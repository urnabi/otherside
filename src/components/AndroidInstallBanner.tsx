import React, { useState } from 'react';
import { Download, CheckCircle2, X, Smartphone, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface AndroidInstallBannerProps {
  onOpenAndroidGuide: () => void;
}

export const AndroidInstallBanner: React.FC<AndroidInstallBannerProps> = ({ onOpenAndroidGuide }) => {
  const { isInstallable, isInstalled, isAndroid, install } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState(false);

  // If already running standalone as an installed app or dismissed
  if (isInstalled || isDismissed) {
    return null;
  }

  return (
    <div className="w-full px-4 pt-2.5 pb-1">
      <div className="p-3 rounded-2xl bg-[#5e5586] text-white shadow-sm flex items-center justify-between gap-3 text-left">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-white/15 text-white flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5 text-[#e6deff]" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold leading-tight flex items-center gap-1.5">
              <span>Install Android App</span>
              <span className="text-[9px] bg-[#c9ebd0] text-[#1c3821] px-1.5 py-0.2 rounded-full font-bold">
                APK / PWA
              </span>
            </h4>
            <p className="text-[11px] text-[#e6deff]/90 truncate mt-0.5">
              Install THE OTHER SIDE on your Android home screen
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-1.5">
          {isInstallable ? (
            <button
              onClick={install}
              className="px-3 py-1.5 rounded-full bg-white text-[#5e5586] hover:bg-[#FAF8F5] text-xs font-bold shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>
          ) : (
            <button
              onClick={onOpenAndroidGuide}
              className="px-3 py-1.5 rounded-full bg-white text-[#5e5586] hover:bg-[#FAF8F5] text-xs font-bold shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
