import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '5mb' }));

// Initialize GoogleGenAI client on the server
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const MEDIATOR_SYSTEM_INSTRUCTION = `You are the neutral communication assistant inside THE OTHER SIDE. Help users express their actual thoughts clearly, respectfully, and constructively. Preserve their meaning, boundaries, and emotional authenticity. Identify potentially ambiguous or escalating language and suggest alternatives without judging the user or the recipient. Do not assume hidden intentions, fabricate context, force positivity, or make every message sound agreeable. Briefly explain significant changes. Offer only a suggestion; the user decides what to send. You are not a judge, therapist, or authority on the relationship.

Rules:
1. Preserve the user's original intention, boundaries, and key information.
2. Identify wording that could be misunderstood, sound accusatory, or escalate tension (e.g. absolutes like "always", "never", blame framing, passive-aggressive phrasing).
3. Generate a clearer, respectful, constructive alternative in natural human language.
4. Avoid making the message overly formal, robotic, submissive, or emotionally unnatural.
5. Never invent apologies, promises, feelings, facts, or intentions the user did not express.
6. Avoid automatically siding with either participant.
7. Respect firm boundaries and allow users to disagree or express negative emotions respectfully.
8. If the draft contains threats or harmful content, prioritize safe, non-threatening communication.`;

// Intelligent fallback reframing function if Gemini API key is not present or API call fails
function generateSmartFallback(draft: string): { suggestedMessage: string; explanation: string; toneAnalysis: string; keyChanges: string[] } {
  const lower = draft.toLowerCase().trim();

  // Pattern: "you never" / "you always"
  if (lower.includes('you never') || lower.includes('you always') || lower.includes('you never listen')) {
    return {
      suggestedMessage: 'I feel like my perspective is getting lost here, and I would really appreciate us taking time to talk through what happened without rushing. Can we talk about it?',
      explanation: 'Replaces absolute generalizations ("always" / "never") with an "I" statement that highlights your core need to be heard without triggering defensiveness.',
      toneAnalysis: 'Accusatory / Frustrated -> Clear & Vulnerable',
      keyChanges: [
        'Shifted from absolute blaming statements to personal emotional impact',
        'Added a constructive invitation to talk through the moment',
      ],
    };
  }

  // Pattern: "fine" / "whatever" / "forget it"
  if (lower === 'fine' || lower === 'whatever' || lower.includes('forget it') || lower.includes('nevermind')) {
    return {
      suggestedMessage: 'I am feeling overwhelmed and need a moment to pause, but I don’t want to leave this unresolved. Can we reconnect in a little bit when I have more bandwidth?',
      explanation: 'Replaces passive-aggressive withdrawal with an honest statement of emotional fatigue while preserving connection and future dialogue.',
      toneAnalysis: 'Guarded / Dismissive -> Honest & Boundary-Setting',
      keyChanges: [
        'Clarified the need for space instead of shutting down',
        'Reassured the recipient that the relationship still matters',
      ],
    };
  }

  // Pattern: Late or missed plans / cancellation
  if (lower.includes('late') || lower.includes('cancelled') || lower.includes('cancel') || lower.includes('forgot')) {
    return {
      suggestedMessage: 'I was really looking forward to our time together, so when plans changed unexpectedly it felt disappointing. I understand things happen, but I’d appreciate more heads-up in the future.',
      explanation: 'Expresses valid disappointment honestly and sets a firm, reasonable expectation without attacking the other person’s character.',
      toneAnalysis: 'Disappointed / Tense -> Assertive & Grounded',
      keyChanges: [
        'Validated your genuine disappointment without sarcasm',
        'Stated a clear and constructive future boundary',
      ],
    };
  }

  // Pattern: Why didn't you reply / ignoring me
  if (lower.includes('ignore') || lower.includes('reply') || lower.includes('read') || lower.includes('answer')) {
    return {
      suggestedMessage: 'Hey, I haven’t heard back from you and wanted to check in. When texts go unanswered I tend to worry or feel out of the loop—are you doing alright?',
      explanation: 'Frames the silence around your feeling of concern and disconnection rather than assuming deliberate malice or giving the cold shoulder.',
      toneAnalysis: 'Anxious / Demanding -> Compassionate & Direct',
      keyChanges: [
        'Checked in on their well-being first',
        'Expressed your experience without jumping to conclusions',
      ],
    };
  }

  // General constructive reframing fallback
  return {
    suggestedMessage: `I wanted to share my perspective on this: ${draft.replace(/[!]+/g, '.').trim()}. I value keeping our communication clear and would like to hear your thoughts as well.`,
    explanation: 'Polishes the delivery to ensure your perspective is presented with clarity, inviting dialogue while honoring your original message.',
    toneAnalysis: 'Direct -> Balanced & Receptive',
    keyChanges: [
      'Softened high-friction punctuation or phrasing',
      'Encouraged mutual understanding',
    ],
  };
}

// 1. Endpoint: AI Message Drafting & Reframing
app.post('/api/mediator/reframe', async (req, res) => {
  try {
    const { draft, conversationContext, stylePreference } = req.body;

    if (!draft || typeof draft !== 'string') {
      return res.status(400).json({ error: 'A draft message string is required' });
    }

    if (aiClient) {
      const prompt = `User's original draft:
"${draft}"

Conversation context:
- Recipient: ${conversationContext?.recipient || 'Contact'}
- Recent messages in thread: ${
        conversationContext?.lastMessages?.length
          ? JSON.stringify(conversationContext.lastMessages.slice(-3))
          : 'None'
      }
- Style preference: ${stylePreference || 'balanced'}

Please analyze this draft according to your instructions.
Return a clean JSON object with:
1. "suggestedMessage": (The revised message. Must preserve the user's authentic intent and boundaries, avoid robot speak, and avoid automatic apologies.)
2. "explanation": (A 1-2 sentence explanation of why changes were suggested, e.g. pointing out absolutes, accusatory phrasing, or ambiguity.)
3. "toneAnalysis": (A short label describing the tone shift, e.g. "Frustrated -> Clear & Direct".)
4. "keyChanges": (An array of 2 bullet points describing the key modifications made.)`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: MEDIATOR_SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              suggestedMessage: { type: Type.STRING },
              explanation: { type: Type.STRING },
              toneAnalysis: { type: Type.STRING },
              keyChanges: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['suggestedMessage', 'explanation', 'toneAnalysis', 'keyChanges'],
          },
          temperature: 0.5,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } else {
      // Fallback
      const fallback = generateSmartFallback(draft);
      return res.json(fallback);
    }
  } catch (error: any) {
    console.error('Error in /api/mediator/reframe:', error);
    const fallback = generateSmartFallback(req.body?.draft || '');
    return res.json(fallback);
  }
});

// 2. Endpoint: Uncertainty-Aware Received Message Explainer
app.post('/api/mediator/understand', async (req, res) => {
  try {
    const { receivedMessage, senderName } = req.body;

    if (!receivedMessage) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (aiClient) {
      const prompt = `The user received this message from ${senderName || 'the other person'}:
"${receivedMessage}"

The user is feeling uncertain or anxious about how to interpret it.
Provide an objective, uncertainty-aware breakdown:
1. Clarify that you do NOT know the sender's inner mind, and offer possibilities rather than facts.
2. Provide 2-3 plausible, benign interpretations (e.g. stress, hurry, brevity, factual intent).
3. Suggest a clarifying question the user could ask to gently verify what was meant without escalating.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are an uncertainty-aware communication analyst. Never assume malice or claim to know what the sender was thinking. Present possibilities calmly and encourage gentle clarification.',
          temperature: 0.6,
        },
      });

      return res.json({ analysis: response.text });
    } else {
      return res.json({
        analysis: `### Uncertainty-Aware Perspective
When messages feel curt or confusing, it is natural for our minds to fill in the blanks with worst-case assumptions. Here are a few possibilities to consider:

1. **Brevity & Bandwidth**: ${senderName || 'They'} may have replied on the move, between meetings, or with low battery, prioritizing speed over warmth.
2. **Task Orientation**: They may have been focusing purely on logistics rather than emotional subtext.
3. **Unstated Stress**: Their tone might reflect external pressure rather than how they feel about you.

**Suggested Clarifying Response:**
*"Hey, just wanted to check if everything is okay on your end, or if you'd like to touch base when things are less rushed?"*`,
      });
    }
  } catch (err: any) {
    console.error('Error in /api/mediator/understand:', err);
    return res.status(500).json({ error: 'Failed to analyze message' });
  }
});

// 3. Endpoint: Simulate Realistic Contact Reply for testing the back-and-forth
app.post('/api/mediator/simulate-reply', async (req, res) => {
  try {
    const { lastMessage, contactName, contactRole, chatHistory } = req.body;

    if (aiClient) {
      const prompt = `You are roleplaying as "${contactName || 'Jordan'}" (${contactRole || 'close friend or partner'}).
The user just sent you this message in a shared chat:
"${lastMessage}"

Recent chat context:
${JSON.stringify(chatHistory?.slice(-4) || [])}

Reply naturally, as a real human would, with appropriate vulnerability and conversational authenticity. Keep it concise (1-3 sentences). Do not use AI jargon or sound like a robot.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          temperature: 0.8,
        },
      });

      return res.json({ reply: response.text?.trim() });
    } else {
      const replies = [
        "Thanks for explaining that clearly. I was feeling a bit overwhelmed earlier and didn't mean to make you feel sidelined. Can we grab coffee tomorrow to talk it through?",
        "I hear you, and I appreciate you telling me directly instead of letting it sit. I had a really stressful day, but that's no excuse. Let's make sure we're on the same page.",
        "That makes a lot of sense. I didn't realize that's how it came across on your end. Thanks for reaching out.",
      ];
      return res.json({ reply: replies[Math.floor(Math.random() * replies.length)] });
    }
  } catch (err: any) {
    return res.json({
      reply: "Thank you for reaching out and sharing that with me. I appreciate you bringing it up so we can understand each other better.",
    });
  }
});

// Setup Vite in development or static serve in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`THE OTHER SIDE server running on port ${PORT}`);
  });
}

startServer();
