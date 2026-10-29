import React from 'react';
import { X, Clock, CheckCircle2, XCircle, ShieldCheck, Sparkles, Send, Trash2, ArrowRight } from 'lucide-react';
import { Contact } from '../types';

interface InvitationDetailModalProps {
  isOpen: boolean;
  contact: Contact | null;
  onClose: () => void;
  onSimulateAcceptance: (contactId: string) => void;
  onSimulateDecline: (contactId: string) => void;
  onResendInvitation: (contactId: string) => void;
  onDeleteConversation: (contactId: string) => void;
  onOpenChat: (contact: Contact) => void;
}

export const InvitationDetailModal: React.FC<InvitationDetailModalProps> = ({
  isOpen,
  contact,
  onClose,
  onSimulateAcceptance,
  onSimulateDecline,
  onResendInvitation,
  onDeleteConversation,
  onOpenChat,
}) => {
  if (!isOpen || !contact) return null;

  const isPending = contact.invitationStatus === 'pending';
  const isDeclined = contact.invitationStatus === 'declined';
  const isAccepted = contact.invitationStatus === 'accepted';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#1c1b1a]/45 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#FAF8F5] rounded-3xl p-5 sm:p-6 shadow-2xl border border-[#E6E1D8]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E6E1D8]">
          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-full text-white font-bold text-xs flex items-center justify-center"
              style={{ backgroundColor: contact.avatarBg }}
            >
              {contact.initials}
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1c1b1a]">{contact.name}</h3>
              <p className="text-[11px] text-[#79757f]">{contact.role}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-200/50 text-[#79757f] hover:text-[#1c1b1a]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Card */}
        <div className="my-4 p-4 rounded-2xl bg-white border border-[#E6E1D8] text-center space-y-2">
          {isPending && (
            <>
              <div className="w-10 h-10 rounded-full bg-[#f1edeb] text-[#D98E73] flex items-center justify-center mx-auto">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#1c1b1a]">Invitation Pending</h4>
              <p className="text-xs text-[#79757f] max-w-xs mx-auto leading-relaxed">
                An invitation was sent to {contact.name}. To ensure mutual consent, the shared chat unlocks only once they accept.
              </p>
              <div className="pt-2 flex justify-center gap-2">
                <button
                  onClick={() => {
                    onSimulateAcceptance(contact.id);
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-full bg-[#5e5586] hover:bg-[#4a4269] text-white text-[11px] font-semibold flex items-center gap-1 shadow-2xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Simulate {contact.name} Accepting</span>
                </button>
                <button
                  onClick={() => {
                    onSimulateDecline(contact.id);
                  }}
                  className="px-3 py-1.5 rounded-full bg-white hover:bg-neutral-100 text-[#ba1a1a] text-[11px] font-semibold border border-[#ffdad6]"
                >
                  Simulate Decline
                </button>
              </div>
            </>
          )}

          {isDeclined && (
            <>
              <div className="w-10 h-10 rounded-full bg-[#ffdad6]/60 text-[#ba1a1a] flex items-center justify-center mx-auto">
                <XCircle className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#1c1b1a]">Invitation Declined</h4>
              <p className="text-xs text-[#79757f] max-w-xs mx-auto leading-relaxed">
                {contact.name} decided not to join THE OTHER SIDE at this time. Their boundaries are respected, and no shared conversation is open.
              </p>
              <div className="pt-2 flex justify-center gap-2">
                <button
                  onClick={() => onResendInvitation(contact.id)}
                  className="px-3.5 py-1.5 rounded-full bg-[#5e5586] text-white text-[11px] font-semibold hover:bg-[#4a4269]"
                >
                  Resend Invitation
                </button>
                <button
                  onClick={() => {
                    onDeleteConversation(contact.id);
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-full bg-white text-[#79757f] hover:text-[#ba1a1a] text-[11px] font-medium border border-[#E6E1D8]"
                >
                  Delete
                </button>
              </div>
            </>
          )}

          {isAccepted && (
            <>
              <div className="w-10 h-10 rounded-full bg-[#c9ebd0] text-[#45634d] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#1c1b1a]">Invitation Accepted!</h4>
              <p className="text-xs text-[#79757f] max-w-xs mx-auto leading-relaxed">
                You and {contact.name} can now communicate with AI Mediator assistance enabled.
              </p>
              <button
                onClick={() => {
                  onOpenChat(contact);
                  onClose();
                }}
                className="mt-2 py-2 px-5 rounded-full bg-[#5e5586] text-white text-xs font-semibold hover:bg-[#4a4269] flex items-center gap-1 mx-auto"
              >
                <span>Enter Shared Chat</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>

        {/* What the recipient sees info */}
        <div className="p-3.5 rounded-2xl bg-[#f7f3f1] border border-[#ece7e5] text-xs text-[#48454e] space-y-1">
          <div className="font-semibold text-[#1c1b1a] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#5e5586]" />
            <span>Invitation Principle</span>
          </div>
          <p className="text-[11px] text-[#79757f] leading-relaxed">
            The invitation clearly informs the recipient that THE OTHER SIDE uses an AI mediator to suggest healthier phrasing. Private drafts are never shown to the other person.
          </p>
        </div>
      </div>
    </div>
  );
};
