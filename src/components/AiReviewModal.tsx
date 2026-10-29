import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ArrowRight,
  Send,
  Edit3,
  AlertCircle,
  Check,
  RotateCcw,
  ShieldCheck,
  MessageSquare,
} from 'lucide-react';
import { AiReviewData } from '../types';

interface AiReviewModalProps {
  isOpen: boolean;
  isLoading: boolean;
  reviewData: AiReviewData | null;
  onConfirmSend: (finalText: string, wasReframed: boolean, reason?: string) => void;
  onSendOriginal: () => void;
  onCancel: () => void;
  contactName: string;
}

export const AiReviewModal: React.FC<AiReviewModalProps> = ({
  isOpen,
  isLoading,
  reviewData,
  onConfirmSend,
  onSendOriginal,
  onCancel,
  contactName,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState('');
  const [showSendOriginalConfirm, setShowSendOriginalConfirm] = useState(false);

  // Sync edited text when reviewData changes
  React.useEffect(() => {
    if (reviewData) {
      setEditedText(reviewData.suggestedMessage);
      setIsEditing(false);
      setShowSendOriginalConfirm(false);
    }
  }, [reviewData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#1c1b1a]/45 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#FAF8F5] rounded-3xl p-5 sm:p-6 shadow-2xl border border-[#E6E1D8] max-h-[92vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E6E1D8]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#e6deff] text-[#5e5586] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1c1b1a]">AI Mediator Review</h3>
              <p className="text-[11px] text-[#79757f]">
                Private preview before sending to <span className="font-semibold">{contactName}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="p-1.5 rounded-full hover:bg-neutral-200/60 text-[#79757f] hover:text-[#1c1b1a] transition-colors"
            title="Cancel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-[#8E84B8]/30 border-t-[#5e5586] animate-spin" />
              <Sparkles className="w-5 h-5 text-[#5e5586]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1c1b1a]">Analyzing Tone & Clarity...</p>
              <p className="text-xs text-[#79757f] max-w-xs mt-1">
                Checking for ambiguous wording and phrasing that could unintentionally escalate tension.
              </p>
            </div>
          </div>
        )}

        {/* Review Content */}
        {!isLoading && reviewData && (
          <div className="space-y-4 my-3 text-left">
            {/* Tone Shift Badge */}
            {reviewData.toneAnalysis && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f1edeb] text-[#48454e] text-[11px] font-medium border border-[#E6E1D8]">
                <span className="w-2 h-2 rounded-full bg-[#5e5586]" />
                <span>Tone Shift: <strong className="text-[#1c1b1a]">{reviewData.toneAnalysis}</strong></span>
              </div>
            )}

            {/* Section 1: Your Original Draft */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-[#79757f] mb-1.5 px-1">
                <span>Your Original Message</span>
                <span className="text-[10px] text-[#79757f] font-normal">Exact Draft</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-[#E6E1D8] text-xs sm:text-sm text-[#474543] font-normal leading-relaxed">
                {reviewData.originalDraft}
              </div>
            </div>

            {/* Section 2: Suggested Message */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-[#5e5586] mb-1.5 px-1">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Suggested Message</span>
                </span>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-[11px] text-[#5e5586] hover:underline flex items-center gap-1 font-medium"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>{isEditing ? 'Done Editing' : 'Edit Suggestion'}</span>
                </button>
              </div>

              {isEditing ? (
                <textarea
                  rows={3}
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="w-full p-3.5 rounded-2xl bg-[#fdf8f6] border-2 border-[#8E84B8] text-xs sm:text-sm text-[#1c1b1a] focus:outline-none focus:ring-2 focus:ring-[#e6deff] resize-none leading-relaxed"
                />
              ) : (
                <div className="p-3.5 rounded-2xl bg-[#E9E6F5]/70 border border-[#8E84B8]/30 text-xs sm:text-sm text-[#242322] font-medium leading-relaxed shadow-2xs">
                  {editedText || reviewData.suggestedMessage}
                </div>
              )}
            </div>

            {/* Section 3: Why This Change? */}
            <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E6E1D8] text-xs text-[#48454e] space-y-1.5">
              <div className="font-semibold text-[#1c1b1a] flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-[#5e5586]" />
                <span>Why this change?</span>
              </div>
              <p className="leading-relaxed text-[12px]">
                {reviewData.explanation}
              </p>
              {reviewData.keyChanges?.length > 0 && (
                <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-[#79757f] pt-1">
                  {reviewData.keyChanges.map((change, i) => (
                    <li key={i}>{change}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Confirmation for Send Original */}
            {showSendOriginalConfirm && (
              <div className="p-3.5 rounded-2xl bg-[#FAECE6] border border-[#D98E73]/40 text-xs text-[#474543] animate-in fade-in duration-150">
                <p className="font-semibold text-[#1c1b1a] mb-1">
                  Send your original message without changes?
                </p>
                <p className="text-[11px] text-[#79757f] mb-2.5 leading-snug">
                  The AI mediator will not reframe this text. Your exact draft will be delivered to {contactName}.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onSendOriginal();
                      setShowSendOriginalConfirm(false);
                    }}
                    className="px-3 py-1.5 rounded-full bg-[#ba1a1a] text-white text-[11px] font-semibold hover:bg-[#961515] transition-colors"
                  >
                    Yes, Send Original
                  </button>
                  <button
                    onClick={() => setShowSendOriginalConfirm(false)}
                    className="px-3 py-1.5 rounded-full bg-white text-[#48454e] text-[11px] font-medium border border-[#E6E1D8] hover:bg-neutral-100"
                  >
                    Keep Reviewing
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              {/* Primary Action: Use Suggested Message */}
              <button
                onClick={() =>
                  onConfirmSend(
                    editedText || reviewData.suggestedMessage,
                    true,
                    reviewData.explanation
                  )
                }
                className="flex-1 py-3 px-4 rounded-full bg-[#5e5586] hover:bg-[#4a4269] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.01]"
              >
                <span>Use Suggested Message</span>
                <Send className="w-3.5 h-3.5" />
              </button>

              {/* Secondary Action: Send Original */}
              <button
                onClick={() => setShowSendOriginalConfirm(true)}
                className="py-2.5 px-4 rounded-full bg-white hover:bg-neutral-100 text-[#48454e] text-xs font-medium border border-[#E6E1D8] transition-colors text-center cursor-pointer"
              >
                Send Original
              </button>

              {/* Cancel */}
              <button
                onClick={onCancel}
                className="py-2.5 px-3 rounded-full text-[#79757f] hover:text-[#1c1b1a] text-xs font-medium hover:bg-neutral-200/50 transition-colors text-center"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Core Principle Footer */}
        <div className="pt-2 text-center border-t border-[#E6E1D8]/60 mt-1">
          <p className="text-[10px] text-[#79757f] italic flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#7A9A82]" />
            <span>The AI does not control the conversation. You always decide what to send.</span>
          </p>
        </div>
      </div>
    </div>
  );
};
