import React from 'react';
import { X, Smartphone, Download, Check, ExternalLink, ShieldCheck, Terminal, Layers } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface AndroidGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidGuideModal: React.FC<AndroidGuideModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, install } = usePWAInstall();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#1c1b1a]/45 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#FAF8F5] rounded-3xl p-5 sm:p-6 shadow-2xl border border-[#E6E1D8] max-h-[92vh] overflow-y-auto space-y-4 text-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E6E1D8]">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#c9ebd0] text-[#1c3821] flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1c1b1a]">Android App Installation</h3>
              <p className="text-[11px] text-[#79757f]">THE OTHER SIDE for Android OS</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-200/50 text-[#79757f] hover:text-[#1c1b1a]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Option 1: Direct Android Install (WebAPK) */}
        <div className="p-4 rounded-2xl bg-white border border-[#E6E1D8] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#1c1b1a] flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-[#5e5586] text-white text-[11px] flex items-center justify-center font-bold">1</span>
              <span>Direct Android Install (WebAPK)</span>
            </span>
            <span className="text-[10px] bg-[#c9ebd0] text-[#1c3821] px-2 py-0.5 rounded-full font-bold">
              Instant
            </span>
          </div>

          <p className="text-xs text-[#48454e] leading-relaxed">
            Install directly through Chrome or any Chromium browser on Android without requiring an app store download.
          </p>

          <ol className="text-xs text-[#48454e] space-y-1.5 list-decimal pl-4 leading-snug">
            <li>Open this app on your Android phone or tablet.</li>
            <li>Tap the browser menu <strong>(⋮)</strong> in Chrome.</li>
            <li>Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
            <li>Android generates an authentic WebAPK on your device home screen and app drawer!</li>
          </ol>

          {isInstallable && (
            <button
              onClick={() => {
                install();
                onClose();
              }}
              className="mt-2 w-full py-2.5 px-4 rounded-full bg-[#5e5586] text-white text-xs font-semibold hover:bg-[#4a4269] flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Trigger Android Install Now</span>
            </button>
          )}
        </div>

        {/* Option 2: APK / Google Play Store via TWA */}
        <div className="p-4 rounded-2xl bg-white border border-[#E6E1D8] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#1c1b1a] flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-[#406375] text-white text-[11px] flex items-center justify-center font-bold">2</span>
              <span>Packaging as Native APK / AAB</span>
            </span>
            <span className="text-[10px] bg-[#e6deff] text-[#5e5586] px-2 py-0.5 rounded-full font-bold">
              Google Play
            </span>
          </div>

          <p className="text-xs text-[#48454e] leading-relaxed">
            Because this application includes a complete Android Web App Manifest, Service Worker, and 512px maskable icons, it is 100% compliant with Google's <strong>Trusted Web Activity (TWA)</strong> standard.
          </p>

          <div className="p-2.5 rounded-xl bg-[#1c1b1a] text-neutral-200 text-[11px] font-mono overflow-x-auto space-y-1">
            <div className="text-[#8E84B8]"># Generate signed Android APK / AAB:</div>
            <div>npx @bubblewrap/cli init --manifest=manifest.webmanifest</div>
            <div>npx @bubblewrap/cli build</div>
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-1 flex justify-end">
          <button
            onClick={onClose}
            className="py-2.5 px-6 rounded-full bg-[#5e5586] text-white text-xs font-semibold hover:bg-[#4a4269] transition-colors"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
