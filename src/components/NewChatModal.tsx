import React, { useState } from 'react';
import {
  X,
  Search,
  UserPlus,
  CheckCircle2,
  Clock,
  XCircle,
  Sparkles,
  ArrowRight,
  Shield,
  MessageSquare,
} from 'lucide-react';
import { Contact } from '../types';

interface NewChatModalProps {
  isOpen: boolean;
  contacts: Contact[];
  onClose: () => void;
  onSendInvitation: (contactId: string) => void;
  onOpenChat: (contact: Contact) => void;
  onSimulateAcceptance: (contactId: string) => void;
}

export const NewChatModal: React.FC<NewChatModalProps> = ({
  isOpen,
  contacts,
  onClose,
  onSendInvitation,
  onOpenChat,
  onSimulateAcceptance,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentlyInvitedId, setRecentlyInvitedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInvite = (contactId: string) => {
    onSendInvitation(contactId);
    setRecentlyInvitedId(contactId);
    setTimeout(() => setRecentlyInvitedId(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#1c1b1a]/45 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#FAF8F5] rounded-3xl p-5 sm:p-6 shadow-2xl border border-[#E6E1D8] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E6E1D8]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#e6deff] text-[#5e5586] flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1c1b1a]">Start a New Chat</h3>
              <p className="text-[11px] text-[#79757f]">Invite someone to communicate via THE OTHER SIDE</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-200/50 text-[#79757f] hover:text-[#1c1b1a]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="my-3 relative">
          <Search className="w-4 h-4 text-[#79757f] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contacts by name or relationship..."
            className="w-full text-xs pl-9 pr-4 py-2.5 rounded-full border border-[#E6E1D8] bg-white text-[#1c1b1a] focus:outline-none focus:border-[#5e5586] focus:ring-2 focus:ring-[#e6deff]"
          />
        </div>

        {/* Prototype notice */}
        <div className="p-2.5 mb-2 rounded-2xl bg-[#f7f3f1] border border-[#ece7e5] text-[11px] text-[#48454e] flex items-start gap-2">
          <Shield className="w-3.5 h-3.5 text-[#5e5586] shrink-0 mt-0.5" />
          <p>
            <strong>Simulated Prototype Flow:</strong> In THE OTHER SIDE, chats are locked until the other party accepts the invitation to ensure consensual, mutually mediated communication.
          </p>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 my-1">
          {filteredContacts.map((contact) => {
            const isAccepted = contact.invitationStatus === 'accepted';
            const isPending = contact.invitationStatus === 'pending';
            const isDeclined = contact.invitationStatus === 'declined';
            const isNotInvited = contact.invitationStatus === 'not_invited';

            return (
              <div
                key={contact.id}
                className="p-3 rounded-2xl bg-white border border-[#E6E1D8] flex items-center justify-between gap-3 shadow-2xs hover:border-[#8E84B8]/40 transition-colors"
              >
                {/* Contact info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-10 h-10 rounded-full text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs"
                    style={{ backgroundColor: contact.avatarBg }}
                  >
                    {contact.initials}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold text-[#1c1b1a] truncate">
                      {contact.name}
                    </h4>
                    <p className="text-[11px] text-[#79757f] truncate">{contact.role}</p>
                  </div>
                </div>

                {/* Actions & Status */}
                <div className="shrink-0 flex items-center gap-1.5">
                  {isAccepted && (
                    <button
                      onClick={() => {
                        onOpenChat(contact);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-full bg-[#5e5586] hover:bg-[#4a4269] text-white text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <span>Open Chat</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}

                  {isPending && (
                    <div className="flex flex-col items-end gap-1">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#f1edeb] text-[#48454e] text-[10px] font-semibold border border-[#E6E1D8]">
                        <Clock className="w-2.5 h-2.5 text-[#D98E73]" />
                        <span>Pending</span>
                      </span>
                      <button
                        onClick={() => {
                          onSimulateAcceptance(contact.id);
                          onClose();
                        }}
                        className="text-[10px] text-[#5e5586] font-medium hover:underline"
                        title="Simulate recipient accepting right now"
                      >
                        Simulate Accept
                      </button>
                    </div>
                  )}

                  {isDeclined && (
                    <div className="flex flex-col items-end gap-1">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ffdad6]/60 text-[#ba1a1a] text-[10px] font-semibold">
                        <XCircle className="w-2.5 h-2.5" />
                        <span>Declined</span>
                      </span>
                      <button
                        onClick={() => handleInvite(contact.id)}
                        className="text-[10px] text-[#5e5586] font-medium hover:underline"
                      >
                        Re-invite
                      </button>
                    </div>
                  )}

                  {isNotInvited && (
                    <button
                      onClick={() => handleInvite(contact.id)}
                      className="px-3 py-1.5 rounded-full bg-white hover:bg-[#f7f3f1] text-[#5e5586] text-[11px] font-semibold border border-[#5e5586] transition-all cursor-pointer shadow-2xs hover:scale-[1.02]"
                    >
                      Send Invitation
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {filteredContacts.length === 0 && (
            <div className="py-8 text-center text-xs text-[#79757f]">
              No contacts matching "{searchQuery}"
            </div>
          )}
        </div>

        {/* Recently Invited Feedback Toast */}
        {recentlyInvitedId && (
          <div className="mt-2 p-2.5 rounded-2xl bg-[#c9ebd0] text-[#1c3821] text-xs font-medium flex items-center justify-between animate-in fade-in duration-150">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#45634d]" />
              <span>Invitation sent! Awaiting recipient's acceptance.</span>
            </span>
            <button
              onClick={() => {
                onSimulateAcceptance(recentlyInvitedId);
                onClose();
              }}
              className="text-[10px] font-bold underline cursor-pointer"
            >
              Simulate Accept
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
