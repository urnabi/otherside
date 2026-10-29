import React from 'react';
import { X, Sparkles, Shield, Lock, Sliders, RotateCcw, Check, Info } from 'lucide-react';
import { UserSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onResetData: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  onUpdateSettings,
  onResetData,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#1c1b1a]/45 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#FAF8F5] rounded-3xl p-5 sm:p-6 shadow-2xl border border-[#E6E1D8] max-h-[90vh] overflow-y-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E6E1D8]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#f1edeb] text-[#5e5586] flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1c1b1a]">Settings & Privacy</h3>
              <p className="text-[11px] text-[#79757f]">THE OTHER SIDE Communication Controls</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-200/50 text-[#79757f] hover:text-[#1c1b1a]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* AI Assist Controls */}
        <div className="p-4 rounded-2xl bg-white border border-[#E6E1D8] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#5e5586]" />
              <span className="text-xs font-semibold text-[#1c1b1a]">AI Mediator Assistance</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.aiAssistActive}
                onChange={(e) => onUpdateSettings({ aiAssistActive: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-[#e6e2e0] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#5e5586]"></div>
            </label>
          </div>

          <p className="text-[11px] text-[#79757f] leading-snug">
            When enabled, messages you draft are automatically reviewed for tone, clarity, and hidden friction before you hit send.
          </p>

          <div className="pt-2 border-t border-[#ece7e5]">
            <label className="block text-[11px] font-semibold text-[#1c1b1a] mb-1.5">
              Reframing Style Intensity:
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['gentle', 'balanced', 'direct'] as const).map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => onUpdateSettings({ assistIntensity: style })}
                  className={`py-1.5 px-2 rounded-xl text-[11px] capitalize font-medium border transition-all ${
                    settings.assistIntensity === style
                      ? 'bg-[#5e5586] text-white border-[#5e5586] shadow-2xs font-semibold'
                      : 'bg-[#FAF8F5] text-[#48454e] border-[#E6E1D8] hover:bg-[#f1edeb]'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Privacy by Design */}
        <div className="p-4 rounded-2xl bg-white border border-[#E6E1D8] space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#1c1b1a]">
            <Lock className="w-4 h-4 text-[#7A9A82]" />
            <span>Strict Privacy Guarantees</span>
          </div>
          <ul className="text-[11px] text-[#48454e] space-y-1.5 leading-relaxed">
            <li className="flex items-start gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#7A9A82] shrink-0 mt-0.5" />
              <span><strong>Drafts are 100% private:</strong> Unsent drafts and AI suggestions are never seen by the other participant.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#7A9A82] shrink-0 mt-0.5" />
              <span><strong>You retain full control:</strong> The AI never auto-sends or replaces your text without your approval.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#7A9A82] shrink-0 mt-0.5" />
              <span><strong>No hidden blame:</strong> The mediator protects boundaries and never forces false apologies.</span>
            </li>
          </ul>
        </div>

        {/* Reset / Clear Data */}
        <div className="flex justify-between items-center pt-2">
          <button
            onClick={() => {
              if (confirm('Reset conversation history to sample defaults?')) {
                onResetData();
                onClose();
              }
            }}
            className="text-xs text-[#79757f] hover:text-[#ba1a1a] flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo Data</span>
          </button>

          <button
            onClick={onClose}
            className="py-2 px-5 rounded-full bg-[#5e5586] text-white text-xs font-semibold hover:bg-[#4a4269] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
