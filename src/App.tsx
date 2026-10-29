/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Contact, ChatMessage, UserSettings } from './types';
import { INITIAL_CONTACTS, INITIAL_MESSAGES, DEFAULT_USER_SETTINGS } from './data/mockData';
import { HomeScreen } from './components/HomeScreen';
import { ChatInterface } from './components/ChatInterface';
import { NewChatModal } from './components/NewChatModal';
import { InvitationDetailModal } from './components/InvitationDetailModal';
import { SettingsModal } from './components/SettingsModal';
import { AndroidStatusBar } from './components/AndroidStatusBar';
import { AndroidNavBar } from './components/AndroidNavBar';
import { AndroidGuideModal } from './components/AndroidGuideModal';
import { Smartphone, Monitor, Download, Sparkles } from 'lucide-react';
import { usePWAInstall } from './hooks/usePWAInstall';

export default function App() {
  // Contacts State
  const [contacts, setContacts] = useState<Contact[]>(() => {
    try {
      const saved = localStorage.getItem('tos_contacts');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return INITIAL_CONTACTS;
  });

  // Messages State
  const [messagesByChat, setMessagesByChat] = useState<Record<string, ChatMessage[]>>(() => {
    try {
      const saved = localStorage.getItem('tos_messages');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return INITIAL_MESSAGES;
  });

  // User Settings State
  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem('tos_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return DEFAULT_USER_SETTINGS;
  });

  // Navigation & Modals
  const [activeContactId, setActiveContactId] = useState<string | null>(null);
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [invitationContact, setInvitationContact] = useState<Contact | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAndroidGuideOpen, setIsAndroidGuideOpen] = useState(false);
  const [isSimulatingReply, setIsSimulatingReply] = useState(false);
  const [isMobileFrame, setIsMobileFrame] = useState(true);
  const [activeTab, setActiveTab] = useState<'chats' | 'invite' | 'settings'>('chats');

  const { isInstallable, install } = usePWAInstall();

  // Persistence
  useEffect(() => {
    try {
      localStorage.setItem('tos_contacts', JSON.stringify(contacts));
    } catch (e) {}
  }, [contacts]);

  useEffect(() => {
    try {
      localStorage.setItem('tos_messages', JSON.stringify(messagesByChat));
    } catch (e) {}
  }, [messagesByChat]);

  useEffect(() => {
    try {
      localStorage.setItem('tos_settings', JSON.stringify(settings));
    } catch (e) {}
  }, [settings]);

  // Handlers
  const handleOpenChat = (contact: Contact) => {
    setActiveContactId(contact.id);
    // Mark messages as read
    setContacts((prev) =>
      prev.map((c) => (c.id === contact.id ? { ...c, unreadCount: 0 } : c))
    );
  };

  const handleSendInvitation = (contactId: string) => {
    setContacts((prev) =>
      prev.map((c) =>
        c.id === contactId
          ? {
              ...c,
              invitationStatus: 'pending',
              lastMessage: 'Invitation sent to join THE OTHER SIDE.',
              lastTimestamp: 'Just now',
            }
          : c
      )
    );
  };

  const handleSimulateAcceptance = (contactId: string) => {
    setContacts((prev) =>
      prev.map((c) =>
        c.id === contactId
          ? {
              ...c,
              invitationStatus: 'accepted',
              lastMessage: 'Invitation accepted! Communication unlocked.',
              lastTimestamp: 'Just now',
              unreadCount: 1,
            }
          : c
      )
    );

    // Add welcome initial message
    const contact = contacts.find((c) => c.id === contactId);
    if (contact) {
      const welcomeMsg: ChatMessage = {
        id: `sys-${Date.now()}`,
        chatId: contactId,
        senderId: contactId,
        senderName: contact.name,
        text: `Hey! I accepted your invite to THE OTHER SIDE. Good to connect here.`,
        timestamp: 'Just now',
        status: 'delivered',
      };
      setMessagesByChat((prev) => ({
        ...prev,
        [contactId]: [...(prev[contactId] || []), welcomeMsg],
      }));
    }
  };

  const handleSimulateDecline = (contactId: string) => {
    setContacts((prev) =>
      prev.map((c) =>
        c.id === contactId
          ? {
              ...c,
              invitationStatus: 'declined',
              lastMessage: 'Invitation declined.',
              lastTimestamp: 'Just now',
            }
          : c
      )
    );
  };

  const handleSendMessage = (
    text: string,
    wasReframed: boolean = false,
    originalDraft?: string,
    reframeReason?: string
  ) => {
    if (!activeContactId) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random()}`,
      chatId: activeContactId,
      senderId: 'user',
      senderName: 'You',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      wasReframed,
      originalDraft,
      reframeReason,
    };

    setMessagesByChat((prev) => ({
      ...prev,
      [activeContactId]: [...(prev[activeContactId] || []), newMsg],
    }));

    // Update contact last message
    setContacts((prev) =>
      prev.map((c) =>
        c.id === activeContactId
          ? {
              ...c,
              lastMessage: text,
              lastTimestamp: 'Just now',
            }
          : c
      )
    );

    // Simulate delivery/read progression
    setTimeout(() => {
      setMessagesByChat((prev) => ({
        ...prev,
        [activeContactId]: (prev[activeContactId] || []).map((m) =>
          m.id === newMsg.id ? { ...m, status: 'delivered' } : m
        ),
      }));
    }, 1000);

    setTimeout(() => {
      setMessagesByChat((prev) => ({
        ...prev,
        [activeContactId]: (prev[activeContactId] || []).map((m) =>
          m.id === newMsg.id ? { ...m, status: 'read' } : m
        ),
      }));
    }, 2500);
  };

  const handleSimulateContactReply = async (contactId: string) => {
    const contact = contacts.find((c) => c.id === contactId);
    if (!contact) return;

    setIsSimulatingReply(true);
    const history = messagesByChat[contactId] || [];
    const lastUserMsg = [...history].reverse().find((m) => m.senderId === 'user');

    try {
      const response = await fetch('/api/mediator/simulate-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lastMessage: lastUserMsg?.text || 'Hello',
          contactName: contact.name,
          contactRole: contact.role,
          chatHistory: history.map((m) => ({ sender: m.senderName, text: m.text })),
        }),
      });

      const data = await response.json();
      const replyText =
        data.reply ||
        `Thanks for sharing that clearly with me. I appreciate you bringing it up so we can understand each other.`;

      const incomingMsg: ChatMessage = {
        id: `reply-${Date.now()}`,
        chatId: contactId,
        senderId: contactId,
        senderName: contact.name,
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'delivered',
      };

      setMessagesByChat((prev) => ({
        ...prev,
        [contactId]: [...(prev[contactId] || []), incomingMsg],
      }));

      setContacts((prev) =>
        prev.map((c) =>
          c.id === contactId
            ? {
                ...c,
                lastMessage: replyText,
                lastTimestamp: 'Just now',
              }
            : c
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulatingReply(false);
    }
  };

  const handleDeleteConversation = (contactId: string) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === contactId ? { ...c, invitationStatus: 'not_invited' } : c))
    );
    setMessagesByChat((prev) => {
      const copy = { ...prev };
      delete copy[contactId];
      return copy;
    });
    if (activeContactId === contactId) {
      setActiveContactId(null);
    }
  };

  const handleResetData = () => {
    localStorage.removeItem('tos_contacts');
    localStorage.removeItem('tos_messages');
    localStorage.removeItem('tos_settings');
    setContacts(INITIAL_CONTACTS);
    setMessagesByChat(INITIAL_MESSAGES);
    setSettings(DEFAULT_USER_SETTINGS);
    setActiveContactId(null);
  };

  const handleNavTabSelect = (tab: 'chats' | 'invite' | 'settings') => {
    setActiveTab(tab);
    if (tab === 'chats') {
      setActiveContactId(null);
    } else if (tab === 'invite') {
      setIsNewChatOpen(true);
    } else if (tab === 'settings') {
      setIsSettingsOpen(true);
    }
  };

  const activeContact = contacts.find((c) => c.id === activeContactId);
  const totalUnread = contacts.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  return (
    <div className="min-h-screen bg-[#f1edeb] text-[#1c1b1a] flex flex-col items-center justify-start relative font-sans selection:bg-[#e6deff] selection:text-[#1d1441]">
      {/* Top Bar for Viewport Toggle & Android APK Info */}
      <header className="w-full max-w-4xl px-4 py-2 flex items-center justify-between border-b border-[#E6E1D8] text-xs text-[#79757f]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#1c1b1a] tracking-tight">THE OTHER SIDE</span>
          <span className="text-[#c9c4cf]">|</span>
          <span className="text-[11px] text-[#5e5586] font-semibold bg-[#e6deff]/70 px-2 py-0.5 rounded-full">
            Android OS
          </span>
        </div>

        {/* Viewport & Install Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAndroidGuideOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold text-[#5e5586] bg-white border border-[#E6E1D8] hover:bg-[#FAF8F5] transition-all cursor-pointer shadow-2xs"
          >
            <Smartphone className="w-3 h-3 text-[#7A9A82]" />
            <span>Install / APK</span>
          </button>

          {isInstallable && (
            <button
              onClick={install}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold text-white bg-[#5e5586] hover:bg-[#4a4269] transition-all cursor-pointer shadow-2xs"
            >
              <Download className="w-3 h-3" />
              <span>Install App</span>
            </button>
          )}

          {/* Viewport frame selector */}
          <div className="hidden sm:flex items-center gap-1 bg-white border border-[#E6E1D8] p-0.5 rounded-full">
            <button
              onClick={() => setIsMobileFrame(true)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                isMobileFrame
                  ? 'bg-[#5e5586] text-white shadow-2xs font-semibold'
                  : 'text-[#79757f] hover:text-[#1c1b1a]'
              }`}
              title="Android Pixel Mobile Frame"
            >
              <Smartphone className="w-3 h-3" />
              <span>Android Pixel</span>
            </button>
            <button
              onClick={() => setIsMobileFrame(false)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                !isMobileFrame
                  ? 'bg-[#5e5586] text-white shadow-2xs font-semibold'
                  : 'text-[#79757f] hover:text-[#1c1b1a]'
              }`}
              title="Edge-to-Edge Fullscreen"
            >
              <Monitor className="w-3 h-3" />
              <span>Fullscreen</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Android App Container */}
      <div
        className={`w-full flex-1 flex flex-col items-center transition-all duration-300 ${
          isMobileFrame
            ? 'max-w-[420px] sm:my-3 sm:rounded-[44px] sm:border-[8px] sm:border-[#242322] sm:shadow-[0_20px_50px_rgba(0,0,0,0.22)] overflow-hidden bg-[#FAF8F5] relative'
            : 'max-w-3xl bg-[#FAF8F5] sm:my-2 sm:rounded-2xl sm:border sm:border-[#E6E1D8] overflow-hidden relative'
        }`}
      >
        {/* Android Native Status Bar */}
        <AndroidStatusBar />

        {/* View Switch */}
        {activeContact ? (
          <ChatInterface
            contact={activeContact}
            messages={messagesByChat[activeContact.id] || []}
            settings={settings}
            onBackToHome={() => setActiveContactId(null)}
            onSendMessage={handleSendMessage}
            onSimulateReply={handleSimulateContactReply}
            isSimulatingReply={isSimulatingReply}
          />
        ) : (
          <HomeScreen
            contacts={contacts}
            onOpenChat={handleOpenChat}
            onOpenNewChat={() => setIsNewChatOpen(true)}
            onOpenInvitationDetail={(c) => setInvitationContact(c)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenAndroidGuide={() => setIsAndroidGuideOpen(true)}
          />
        )}

        {/* Material 3 Bottom Navigation Bar (Shown on Home / Overview) */}
        {!activeContact && (
          <AndroidNavBar
            currentTab={activeTab}
            onSelectTab={handleNavTabSelect}
            unreadTotal={totalUnread}
          />
        )}
      </div>

      {/* Modals */}
      <NewChatModal
        isOpen={isNewChatOpen}
        contacts={contacts}
        onClose={() => setIsNewChatOpen(false)}
        onSendInvitation={handleSendInvitation}
        onOpenChat={handleOpenChat}
        onSimulateAcceptance={handleSimulateAcceptance}
      />

      <InvitationDetailModal
        isOpen={Boolean(invitationContact)}
        contact={invitationContact}
        onClose={() => setInvitationContact(null)}
        onSimulateAcceptance={handleSimulateAcceptance}
        onSimulateDecline={handleSimulateDecline}
        onResendInvitation={handleSendInvitation}
        onDeleteConversation={handleDeleteConversation}
        onOpenChat={handleOpenChat}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        settings={settings}
        onUpdateSettings={(updated) => setSettings((prev) => ({ ...prev, ...updated }))}
        onResetData={handleResetData}
        onClose={() => setIsSettingsOpen(false)}
      />

      <AndroidGuideModal
        isOpen={isAndroidGuideOpen}
        onClose={() => setIsAndroidGuideOpen(false)}
      />
    </div>
  );
}
