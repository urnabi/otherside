import React, { useState } from 'react';
import { X, HelpCircle, Sparkles, MessageSquare, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

interface UnderstandMessageModalProps {
  isOpen: boolean;
  messageText: string;
  senderName: string;
  onClose: () => void;
  onUseClarifyingQuestion: (question: string) => void;
}

export const UnderstandMessageModal: React.FC<UnderstandMessageModalProps> = ({
  isOpen,
  messageText,
  senderName,
  onClose,
  onUseClarifyingQuestion,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisText, setAnalysisText] = useState<string>('');

  React.useEffect(() => {
    if (isOpen && messageText) {
      setIsLoading(true);
      fetch('/api/mediator/understand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receivedMessage: messageText, senderName }),
      })
        .then((res) => res.json())
        .then((data) => {
          setAnalysisText(data.analysis || 'Analysis complete.');
        })
        .catch(() => {
          setAnalysisText(`### Uncertainty-Aware Perspective
When messages feel curt or ambiguous, it is easy to assume coldness. Consider:
1. **Pacing & Context**: ${senderName} may be rushed or multitasking.
2. **Intent vs Delivery**: Directness often reflects task-focus rather than personal irritation.

**Suggested Clarifying Response:**
"Hey, just wanted to check if you have a moment to talk, or if things are hectic right now?"`);
        })
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, messageText, senderName]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#1c1b1a]/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#FAF8F5] rounded-3xl p-5 sm:p-6 shadow-2xl border border-[#E6E1D8] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E6E1D8]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#c3e8fe] text-[#406375] flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1c1b1a]">Understanding Their Message</h3>
              <p className="text-[11px] text-[#79757f]">Uncertainty-aware alternative perspectives</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-200/50 text-[#79757f] hover:text-[#1c1b1a]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message preview */}
        <div className="my-3 p-3 rounded-2xl bg-white border border-[#E6E1D8] text-xs text-[#242322]">
          <span className="text-[10px] uppercase font-bold text-[#79757f] block mb-1">
            Message from {senderName}:
          </span>
          <p className="italic">"{messageText}"</p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="py-8 flex flex-col items-center justify-center space-y-2">
            <div className="w-6 h-6 border-2 border-[#406375]/30 border-t-[#406375] rounded-full animate-spin" />
            <p className="text-xs text-[#79757f]">Exploring non-adversarial interpretations...</p>
          </div>
        )}

        {/* Result */}
        {!isLoading && analysisText && (
          <div className="space-y-3 my-3 text-left">
            <div className="p-4 rounded-2xl bg-white border border-[#E6E1D8] text-xs sm:text-sm text-[#474543] leading-relaxed whitespace-pre-wrap">
              {analysisText}
            </div>

            <div className="p-3 rounded-2xl bg-[#E1EDF2] border border-[#6C8FA3]/30 text-xs text-[#274b5d] flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#406375]" />
              <p className="leading-snug">
                Remember: The AI mediator does not know their private mind. These are possibilities designed to reduce anxiety and prevent hostile assumptions.
              </p>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  onUseClarifyingQuestion(
                    `Hey, I wanted to double-check what you meant by "${messageText.slice(0, 30)}..." so I don't make assumptions—are you doing alright?`
                  );
                  onClose();
                }}
                className="flex-1 py-2.5 px-4 rounded-full bg-[#406375] text-white text-xs font-semibold hover:bg-[#2e4c5b] transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Use Clarifying Question in Composer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onClose}
                className="py-2.5 px-4 rounded-full bg-[#f1edeb] text-[#48454e] text-xs font-medium hover:bg-[#e6e2e0]"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
