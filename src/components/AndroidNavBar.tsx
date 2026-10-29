import React from 'react';
import { MessageSquare, UserPlus, Sliders, Sparkles } from 'lucide-react';

interface AndroidNavBarProps {
  currentTab: 'chats' | 'invite' | 'settings';
  onSelectTab: (tab: 'chats' | 'invite' | 'settings') => void;
  unreadTotal: number;
}

export const AndroidNavBar: React.FC<AndroidNavBarProps> = ({
  currentTab,
  onSelectTab,
  unreadTotal,
}) => {
  return (
    <nav className="w-full bg-[#FAF8F5] border-t border-[#E6E1D8] pt-1.5 pb-2 px-6 flex flex-col items-center shrink-0 z-20">
      {/* Material 3 Navigation Bar Items */}
      <div className="w-full flex items-center justify-around max-w-sm">
        {/* Tab 1: Chats */}
        <button
          onClick={() => onSelectTab('chats')}
          className="flex flex-col items-center gap-1 group py-1 px-3 cursor-pointer"
        >
          <div
            className={`px-4 py-1 rounded-full transition-all flex items-center justify-center relative ${
              currentTab === 'chats'
                ? 'bg-[#e6deff] text-[#5e5586]'
                : 'text-[#79757f] hover:text-[#1c1b1a]'
            }`}
          >
            <MessageSquare className="w-4 h-4 stroke-[2]" />
            {unreadTotal > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#5e5586] text-white text-[9px] font-bold flex items-center justify-center">
                {unreadTotal}
              </span>
            )}
          </div>
          <span
            className={`text-[10px] tracking-tight font-medium ${
              currentTab === 'chats' ? 'text-[#1c1b1a] font-bold' : 'text-[#79757f]'
            }`}
          >
            Chats
          </span>
        </button>

        {/* Tab 2: New Invite */}
        <button
          onClick={() => onSelectTab('invite')}
          className="flex flex-col items-center gap-1 group py-1 px-3 cursor-pointer"
        >
          <div
            className={`px-4 py-1 rounded-full transition-all flex items-center justify-center ${
              currentTab === 'invite'
                ? 'bg-[#e6deff] text-[#5e5586]'
                : 'text-[#79757f] hover:text-[#1c1b1a]'
            }`}
          >
            <UserPlus className="w-4 h-4 stroke-[2]" />
          </div>
          <span
            className={`text-[10px] tracking-tight font-medium ${
              currentTab === 'invite' ? 'text-[#1c1b1a] font-bold' : 'text-[#79757f]'
            }`}
          >
            New Invite
          </span>
        </button>

        {/* Tab 3: Settings */}
        <button
          onClick={() => onSelectTab('settings')}
          className="flex flex-col items-center gap-1 group py-1 px-3 cursor-pointer"
        >
          <div
            className={`px-4 py-1 rounded-full transition-all flex items-center justify-center ${
              currentTab === 'settings'
                ? 'bg-[#e6deff] text-[#5e5586]'
                : 'text-[#79757f] hover:text-[#1c1b1a]'
            }`}
          >
            <Sliders className="w-4 h-4 stroke-[2]" />
          </div>
          <span
            className={`text-[10px] tracking-tight font-medium ${
              currentTab === 'settings' ? 'text-[#1c1b1a] font-bold' : 'text-[#79757f]'
            }`}
          >
            Settings
          </span>
        </button>
      </div>

      {/* Android System Gesture Navigation Bar */}
      <div className="w-32 h-1 bg-[#1c1b1a]/30 rounded-full mt-2 mb-0.5" />
    </nav>
  );
};
