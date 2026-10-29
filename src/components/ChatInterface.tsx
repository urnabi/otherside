import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Send,
  Sparkles,
  Paperclip,
  Check,
  CheckCheck,
  MoreVertical,
  HelpCircle,
  Shield,
  MessageCircle,
  RotateCcw,
  User,
  Info,
  ChevronDown,
} from 'lucide-react';
import { Contact, ChatMessage, AiReviewData, UserSettings } from '../types';
import { AiReviewModal } from './AiReviewModal';
import { UnderstandMessageModal } from './UnderstandMessageModal';

interface ChatInterfaceProps {
  contact: Contact;
  messages: ChatMessage[];
  settings: UserSettings;
  onBackToHome: () => void;
  onSendMessage: (text: string, wasReframed?: boolean, originalDraft?: string, reframeReason?: string) => void;
  onSimulateReply: (contactId: string) => Promise<void>;
  isSimulatingReply: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  contact,
  messages,
  settings,
  onBackToHome,
  onSendMessage,
  onSimulateReply,
  isSimulatingReply,
}) => {
  const [inputText, setInputText] = useState('');
  const [isAiAssistActive, setIsAiAssistActive] = useState(settings.aiAssistActive);
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);

  // AI Review Modal State
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [reviewData, setReviewData] = useState<AiReviewData | null>(null);

  // Understand Received Message Modal State
  const [understandModalOpen, setUnderstandModalOpen] = useState(false);
  const [selectedReceivedMessage, setSelectedReceivedMessage] = useState<string>('');

  // Expanded reframed message info
  const [expandedReframedId, setExpandedReframedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSimulatingReply]);

  // Handle draft submission
  const handleInitiateSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputText.trim();
    if (!text) return;

    if (!isAiAssistActive) {
      // Send directly without AI review
      onSendMessage(text, false);
      setInputText('');
      return;
    }

    // Open AI review modal and analyze draft
    setIsReviewOpen(true);
    setIsAnalyzing(true);
    setReviewData(null);

    try {
      const response = await fetch('/api/mediator/reframe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draft: text,
          conversationContext: {
            recipient: contact.name,
            lastMessages: messages.slice(-3).map((m) => m.text),
          },
          stylePreference: settings.assistIntensity,
        }),
      });

      if (!response.ok) {
        throw new Error('Server error');
      }

      const data = await response.json();
      setReviewData({
        originalDraft: text,
        suggestedMessage: data.suggestedMessage || text,
        explanation: data.explanation || 'Reviewed for tone and clarity.',
        toneAnalysis: data.toneAnalysis || 'Balanced',
        keyChanges: data.keyChanges || [],
        editedMessage: data.suggestedMessage || text,
      });
    } catch (err) {
      console.error('Reframing error:', err);
      // Fallback
      setReviewData({
        originalDraft: text,
        suggestedMessage: text,
        explanation: 'We could not reach the mediator server, but your draft is ready to send.',
        toneAnalysis: 'Direct',
        keyChanges: [],
        editedMessage: text,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirmSuggestedSend = (finalText: string, wasReframed: boolean, reason?: string) => {
    onSendMessage(finalText, wasReframed, reviewData?.originalDraft, reason);
    setIsReviewOpen(false);
    setInputText('');
    setReviewData(null);
  };

  const handleSendOriginalDirect = () => {
    if (reviewData) {
      onSendMessage(reviewData.originalDraft, false);
      setIsReviewOpen(false);
      setInputText('');
      setReviewData(null);
    }
  };

  const handleCancelReview = () => {
    setIsReviewOpen(false);
  };

  const handleInspectReceivedMessage = (text: string) => {
    setSelectedReceivedMessage(text);
    setUnderstandModalOpen(true);
    setShowOptionsDropdown(false);
  };

  const lastReceivedMessage = [...messages].reverse().find((m) => m.senderId !== 'user');

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col h-[calc(100vh-60px)] bg-[#FAF8F5]">
      {/* Header */}
      <header className="px-4 py-3 bg-white border-b border-[#E6E1D8] flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHome}
            className="p-1.5 -ml-1 rounded-full hover:bg-neutral-100 text-[#48454e] hover:text-[#1c1b1a] transition-colors"
            title="Back to all chats"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Contact info */}
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div
                className="w-10 h-10 rounded-full text-white font-bold text-xs flex items-center justify-center shadow-2xs"
                style={{ backgroundColor: contact.avatarBg }}
              >
                {contact.initials}
              </div>
              <span
                className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                  contact.onlineStatus === 'active'
                    ? 'bg-[#45634d]'
                    : contact.onlineStatus === 'away'
                    ? 'bg-[#D98E73]'
                    : 'bg-[#79757f]'
                }`}
              />
            </div>

            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-[#1c1b1a] leading-tight">
                  {contact.name}
                </h3>
                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-[#f1edeb] text-[#79757f] font-medium">
                  {contact.role}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-[#7A9A82] font-medium">
                <Shield className="w-3 h-3" />
                <span>Protected by THE OTHER SIDE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-1.5 relative">
          <button
            onClick={() => onSimulateReply(contact.id)}
            disabled={isSimulatingReply}
            className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-[#5e5586] bg-[#e6deff]/60 hover:bg-[#e6deff] px-3 py-1.5 rounded-full transition-all disabled:opacity-50 cursor-pointer"
            title="Simulate how the contact responds"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{isSimulatingReply ? 'Replying...' : `Simulate ${contact.name.split(' ')[0]}`}</span>
          </button>

          <button
            onClick={() => setShowOptionsDropdown(!showOptionsDropdown)}
            className="p-2 rounded-full hover:bg-neutral-100 text-[#79757f] hover:text-[#1c1b1a] transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* Options Dropdown */}
          {showOptionsDropdown && (
            <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-2xl shadow-xl border border-[#E6E1D8] p-2 z-30 text-left text-xs animate-in fade-in zoom-95">
              <div className="px-2 py-1 text-[10px] uppercase font-bold text-[#79757f]">
                Conversation Tools
              </div>

              {lastReceivedMessage && (
                <button
                  onClick={() => handleInspectReceivedMessage(lastReceivedMessage.text)}
                  className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-[#f7f3f1] text-[#1c1b1a] flex items-center gap-2"
                >
                  <HelpCircle className="w-4 h-4 text-[#406375]" />
                  <span>Explain Last Message</span>
                </button>
              )}

              <button
                onClick={() => {
                  onSimulateReply(contact.id);
                  setShowOptionsDropdown(false);
                }}
                disabled={isSimulatingReply}
                className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-[#f7f3f1] text-[#1c1b1a] flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4 text-[#5e5586]" />
                <span>Simulate {contact.name.split(' ')[0]}'s Reply</span>
              </button>

              <div className="my-1 border-t border-[#ece7e5]" />

              <div className="px-2 py-1 text-[10px] text-[#79757f] leading-snug">
                Private AI mediation is active. Your unsent drafts are never visible to {contact.name}.
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Trust & Mediation Banner */}
      <div className="px-4 py-1.5 bg-[#FAF8F5] border-b border-[#E6E1D8]/60 flex items-center justify-between text-[11px] text-[#48454e]">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#5e5586]" />
          <span>AI Mediator active: Every draft is checked for clarity & healthy tone before sending.</span>
        </div>
        <button
          onClick={() => setIsAiAssistActive(!isAiAssistActive)}
          className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${
            isAiAssistActive
              ? 'bg-[#c9ebd0] text-[#1c3821]'
              : 'bg-[#f1edeb] text-[#79757f]'
          }`}
          title="Toggle AI assistance for this conversation"
        >
          {isAiAssistActive ? 'Assist ON' : 'Assist OFF'}
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5">
        <div className="text-center my-2">
          <span className="text-[11px] font-medium text-[#79757f] bg-white/70 px-3 py-1 rounded-full border border-[#E6E1D8]">
            Shared conversation unlocked · Invitation accepted
          </span>
        </div>

        {messages.map((msg) => {
          const isUser = msg.senderId === 'user';
          const isExpanded = expandedReframedId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} group`}
            >
              {/* Message Bubble */}
              <div
                className={`relative p-3.5 rounded-3xl max-w-[85%] sm:max-w-[78%] text-xs sm:text-sm leading-relaxed transition-all shadow-2xs ${
                  isUser
                    ? 'bg-[#5e5586] text-white rounded-br-sm'
                    : 'bg-white text-[#1c1b1a] border border-[#E6E1D8] rounded-bl-sm'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>

                {/* Metadata Row inside bubble */}
                <div
                  className={`mt-1 flex items-center justify-end gap-1.5 text-[10px] ${
                    isUser ? 'text-white/70' : 'text-[#79757f]'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {isUser && (
                    <span>
                      {msg.status === 'read' ? (
                        <CheckCheck className="w-3.5 h-3.5 text-[#c3e8fe]" />
                      ) : (
                        <Check className="w-3 h-3" />
                      )}
                    </span>
                  )}
                </div>
              </div>

              {/* Discreet Reframed with AI label (Visible on user's own messages) */}
              {isUser && msg.wasReframed && (
                <div className="mt-1 flex items-center gap-1.5 text-[10px] text-[#79757f]">
                  <Sparkles className="w-2.5 h-2.5 text-[#5e5586]" />
                  <span>Reframed with AI</span>
                  {msg.originalDraft && (
                    <button
                      onClick={() => setExpandedReframedId(isExpanded ? null : msg.id)}
                      className="text-[#5e5586] hover:underline font-medium"
                    >
                      {isExpanded ? 'Hide original' : 'View original draft'}
                    </button>
                  )}
                </div>
              )}

              {/* Expanded Original Draft Comparison drawer */}
              {isUser && isExpanded && msg.originalDraft && (
                <div className="mt-1.5 p-3 rounded-2xl bg-white border border-[#E6E1D8] text-[11px] max-w-[85%] text-left space-y-1.5 shadow-xs animate-in fade-in">
                  <div>
                    <span className="text-[#79757f] block font-semibold text-[10px] uppercase">
                      Your original draft:
                    </span>
                    <p className="text-[#ba1a1a] line-through italic">"{msg.originalDraft}"</p>
                  </div>
                  {msg.reframeReason && (
                    <div>
                      <span className="text-[#5e5586] block font-semibold text-[10px] uppercase">
                        Reasoning:
                      </span>
                      <p className="text-[#48454e]">{msg.reframeReason}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Recipient Message Action: Help me understand */}
              {!isUser && (
                <button
                  onClick={() => handleInspectReceivedMessage(msg.text)}
                  className="mt-1 text-[10px] text-[#79757f] hover:text-[#5e5586] flex items-center gap-1 transition-colors px-1"
                >
                  <HelpCircle className="w-2.5 h-2.5" />
                  <span>Help me understand what they mean</span>
                </button>
              )}
            </div>
          );
        })}

        {isSimulatingReply && (
          <div className="flex items-center gap-2 text-xs text-[#79757f] p-2 bg-white rounded-2xl w-fit border border-[#E6E1D8] animate-pulse">
            <div className="w-2 h-2 rounded-full bg-[#5e5586] animate-bounce" />
            <span>{contact.name} is typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Test Tension Pills (Allows user to test AI reframing in 1 tap!) */}
      <div className="px-3 pt-2 bg-white/90 border-t border-[#E6E1D8]/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-bold text-[#79757f] shrink-0 uppercase">Try draft:</span>
        {[
          'You never listen to me. You always make everything about yourself.',
          'Fine, whatever. Forget it.',
          'Why are you ignoring my messages all day?',
          'I am sick and tired of having to repeat myself.',
        ].map((phrase, i) => (
          <button
            key={i}
            onClick={() => setInputText(phrase)}
            className="whitespace-nowrap px-2.5 py-1 rounded-full bg-[#f1edeb] hover:bg-[#e6deff] text-[10px] text-[#48454e] hover:text-[#5e5586] transition-colors shrink-0 border border-[#E6E1D8]"
          >
            "{phrase.slice(0, 24)}..."
          </button>
        ))}
      </div>

      {/* Composer */}
      <form
        onSubmit={handleInitiateSend}
        className="p-3 bg-white border-t border-[#E6E1D8] flex items-center gap-2"
      >
        <button
          type="button"
          onClick={() => alert('Attachments can be added here in future updates.')}
          className="p-2.5 rounded-full hover:bg-neutral-100 text-[#79757f] hover:text-[#1c1b1a] transition-colors"
          title="Add attachment"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        <div className="relative flex-1">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isAiAssistActive
                ? 'Type what you want to say (AI reviews before sending)...'
                : 'Type message...'
            }
            className="w-full text-xs sm:text-sm px-4 py-3 rounded-full border border-[#E6E1D8] bg-[#fdf8f6] text-[#1c1b1a] focus:outline-none focus:border-[#5e5586] focus:ring-2 focus:ring-[#e6deff] pr-10"
          />
        </div>

        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-3 rounded-full bg-[#5e5586] text-white hover:bg-[#4a4269] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center shrink-0 cursor-pointer"
          title={isAiAssistActive ? 'Review with AI Mediator' : 'Send message'}
        >
          {isAiAssistActive ? (
            <Sparkles className="w-4 h-4 text-[#e6deff]" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>

      {/* AI Review Modal */}
      <AiReviewModal
        isOpen={isReviewOpen}
        isLoading={isAnalyzing}
        reviewData={reviewData}
        onConfirmSend={handleConfirmSuggestedSend}
        onSendOriginal={handleSendOriginalDirect}
        onCancel={handleCancelReview}
        contactName={contact.name}
      />

      {/* Understand Message Modal */}
      <UnderstandMessageModal
        isOpen={understandModalOpen}
        messageText={selectedReceivedMessage}
        senderName={contact.name}
        onClose={() => setUnderstandModalOpen(false)}
        onUseClarifyingQuestion={(q) => setInputText(q)}
      />
    </div>
  );
};
