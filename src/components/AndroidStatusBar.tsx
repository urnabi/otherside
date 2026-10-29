import React, { useState, useEffect } from 'react';
import { Wifi, Signal, Battery, Sparkles } from 'lucide-react';

export const AndroidStatusBar: React.FC = () => {
  const [timeStr, setTimeStr] = useState('9:41');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: false })
      );
    };
    update();
    const interval = setInterval(update, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#FAF8F5] text-[#1c1b1a] px-5 pt-2 pb-1.5 flex items-center justify-between text-xs font-semibold select-none z-20 shrink-0 border-b border-[#E6E1D8]/40">
      {/* Time & App icon indicator */}
      <div className="flex items-center gap-1.5">
        <span className="font-bold tracking-tight text-[12px]">{timeStr}</span>
        <div className="w-1.5 h-1.5 rounded-full bg-[#5e5586]" title="THE OTHER SIDE Active" />
      </div>

      {/* Camera Punch Hole */}
      <div className="w-3.5 h-3.5 rounded-full bg-[#1c1b1a] border border-neutral-300 shadow-inner" />

      {/* Android System Icons */}
      <div className="flex items-center gap-1.5 text-[11px] text-[#48454e]">
        <Signal className="w-3.5 h-3.5 stroke-[2.2]" />
        <Wifi className="w-3.5 h-3.5 stroke-[2.2]" />
        <div className="flex items-center gap-0.5">
          <span className="text-[10px] font-mono tabular-nums">98%</span>
          <Battery className="w-4 h-4 stroke-[2.2] fill-[#48454e]" />
        </div>
      </div>
    </div>
  );
};
