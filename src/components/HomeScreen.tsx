import React, { useState } from 'react';
import {
  Search,
  UserPlus,
  Sliders,
  Sparkles,
  Clock,
  XCircle,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  MessageSquare,
  Lock,
  ArrowRight,
  Heart,
  Plus,
  Smartphone,
} from 'lucide-react';
import { Contact } from '../types';
import { AndroidInstallBanner } from './AndroidInstallBanner';

interface HomeScreenProps {
  contacts: Contact[];
  onOpenChat: (contact: Contact) => void;
  onOpenNewChat: () => void;
  onOpenInvitationDetail: (contact: Contact) => void;
  onOpenSettings: () => void;
  onOpenAndroidGuide: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  contacts,
  onOpenChat,
  onOpenNewChat,
  onOpenInvitationDetail,
  onOpenSettings,
  onOpenAndroidGuide,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = contacts.filter((c) => {
    // Only show contacts who have an active conversation or invitation
    if (c.invitationStatus === 'not_invited') return false;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.lastMessage && c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="w-full flex-1 flex flex-col relative text-left">
      {/* Android Installation Banner */}
      <AndroidInstallBanner onOpenAndroidGuide={onOpenAndroidGuide} />

      {/* Main Container */}
      <div className="w-full max-w-2xl mx-auto flex-1 flex flex-col px-4 py-3">
        {/* Brand Header */}
        <header className="flex items-center justify-between pb-3.5 border-b border-[#E6E1D8]">
          <div className="flex items-center gap-2.5">
            {/* THE OTHER SIDE dual-lens logo */}
            <div className="relative w-9 h-9 flex items-center justify-center">
              <div className="absolute -left-0.5 w-5.5 h-5.5 rounded-full bg-[#e6deff] border border-[#8E84B8]/40" />
              <div className="absolute -right-0.5 w-5.5 h-5.5 rounded-full bg-[#c9ebd0] border border-[#7A9A82]/40" />
              <div className="relative z-10 w-2.5 h-2.5 rounded-full bg-[#5e5586] shadow-2xs" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-bold tracking-tight text-[#1c1b1a] leading-none">
                  THE OTHER SIDE
                </h1>
                <span className="text-[9px] bg-[#f1edeb] text-[#5e5586] px-1.5 py-0.2 rounded-md font-bold uppercase tracking-wider">
                  Android
                </span>
              </div>
              <p className="text-[11px] text-[#48454e] font-normal mt-0.5">
                Say what you mean. Understand what they hear.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onOpenAndroidGuide}
              className="p-2 rounded-full hover:bg-white border border-[#E6E1D8] text-[#5e5586] shadow-2xs transition-colors cursor-pointer"
              title="Android App Info & APK packaging"
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-full hover:bg-white border border-[#E6E1D8] text-[#48454e] hover:text-[#1c1b1a] shadow-2xs transition-colors cursor-pointer"
              title="Settings & Privacy"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Search Bar */}
        <div className="relative my-3">
          <Search className="w-4 h-4 text-[#79757f] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chats or messages..."
            className="w-full text-xs pl-10 pr-4 py-2.5 rounded-full border border-[#E6E1D8] bg-white text-[#1c1b1a] focus:outline-none focus:border-[#5e5586] focus:ring-2 focus:ring-[#e6deff] shadow-2xs"
          />
        </div>

        {/* Principle Banner */}
        <div className="p-3 mb-3 rounded-2xl bg-white border border-[#E6E1D8] shadow-2xs flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-full bg-[#e6deff] text-[#5e5586] flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-3 h-3" />
          </div>
          <div className="text-[11px] text-[#48454e]">
            <strong className="text-[#1c1b1a] block mb-0.2">AI Mediator Active</strong>
            Every message you draft is analyzed for tone and misunderstandings before sending.
          </div>
        </div>

        {/* Chats Section */}
        <div className="flex-1 pb-16">
          <div className="flex items-center justify-between mb-2 px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#79757f]">
              Conversations ({filteredContacts.length})
            </h2>
            <span className="text-[11px] text-[#79757f]">
              Protected & Private
            </span>
          </div>

          <div className="space-y-2">
            {filteredContacts.map((contact) => {
              const isAccepted = contact.invitationStatus === 'accepted';
              const isPending = contact.invitationStatus === 'pending';
              const isDeclined = contact.invitationStatus === 'declined';

              return (
                <div
                  key={contact.id}
                  onClick={() => {
                    if (isAccepted) {
                      onOpenChat(contact);
                    } else {
                      onOpenInvitationDetail(contact);
                    }
                  }}
                  className={`p-3 rounded-2xl bg-white border border-[#E6E1D8] flex items-center justify-between gap-3 shadow-2xs hover:border-[#8E84B8] active:scale-[0.99] transition-all cursor-pointer ${
                    contact.unreadCount > 0 ? 'ring-1 ring-[#5e5586]/20 bg-[#fdf8f6]' : ''
                  }`}
                >
                  {/* Contact Avatar & Preview */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <div
                        className="w-10 h-10 rounded-full text-white font-bold text-xs flex items-center justify-center shadow-2xs"
                        style={{ backgroundColor: contact.avatarBg }}
                      >
                        {contact.initials}
                      </div>
                      {isAccepted && (
                        <span
                          className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                            contact.onlineStatus === 'active'
                              ? 'bg-[#45634d]'
                              : contact.onlineStatus === 'away'
                              ? 'bg-[#D98E73]'
                              : 'bg-[#79757f]'
                          }`}
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-xs sm:text-sm font-semibold text-[#1c1b1a] truncate">
                          {contact.name}
                        </h3>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-[#f1edeb] text-[#79757f] font-medium shrink-0">
                          {contact.role}
                        </span>
                      </div>

                      <p className="text-[11px] text-[#79757f] truncate">
                        {isAccepted && (contact.lastMessage || 'Start communicating...')}
                        {isPending && 'Invitation sent · Waiting for acceptance'}
                        {isDeclined && 'Invitation declined'}
                      </p>
                    </div>
                  </div>

                  {/* Right Metadata & Status Badges */}
                  <div className="shrink-0 flex flex-col items-end gap-1 text-right">
                    <span className="text-[10px] text-[#79757f]">
                      {contact.lastTimestamp}
                    </span>

                    {isAccepted && contact.unreadCount > 0 && (
                      <span className="w-4.5 h-4.5 rounded-full bg-[#5e5586] text-white text-[9px] font-bold flex items-center justify-center">
                        {contact.unreadCount}
                      </span>
                    )}

                    {isPending && (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#FAF8F5] text-[#D98E73] text-[9px] font-semibold border border-[#D98E73]/30">
                        <Clock className="w-2.5 h-2.5" />
                        <span>Pending</span>
                      </span>
                    )}

                    {isDeclined && (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#ffdad6]/60 text-[#ba1a1a] text-[9px] font-semibold">
                        <XCircle className="w-2.5 h-2.5" />
                        <span>Declined</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredContacts.length === 0 && (
              <div className="py-10 text-center text-xs text-[#79757f] bg-white rounded-2xl border border-[#E6E1D8] p-5">
                <MessageSquare className="w-7 h-7 mx-auto text-[#c9c4cf] mb-1.5" />
                <p className="font-semibold text-[#1c1b1a]">No chats found</p>
                <p className="mt-0.5">Tap the + button below to invite your first contact.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Android Material 3 Floating Action Button (FAB) for New Chat */}
      <div className="absolute right-5 bottom-4 z-10">
        <button
          onClick={onOpenNewChat}
          className="w-13 h-13 rounded-2xl bg-[#5e5586] hover:bg-[#4a4269] text-white shadow-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          title="Start New Chat"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
