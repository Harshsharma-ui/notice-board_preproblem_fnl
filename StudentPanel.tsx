import React from 'react';
import { Battery, Signal, Wifi } from 'lucide-react';
import { motion } from 'motion/react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const [time, setTime] = React.useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0F172A] p-4 sm:p-10 font-sans selection:bg-pink-100 selection:text-pink-900">
      {/* Phone Outer Shell */}
      <div className="relative w-full max-w-[420px] aspect-[9/19.5] bg-[#1E293B] rounded-[60px] p-4 shadow-[0_0_100px_rgba(236,72,153,0.3)] border-[8px] border-[#334155] ring-1 ring-white/10 overflow-hidden">
        
        {/* Dynamic Island / Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-8 bg-black rounded-b-3xl z-[100] flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-pink-500/20 rounded-full blur-[1px]" />
          <div className="w-12 h-1 bg-white/5 rounded-full" />
        </div>

        {/* Status Bar */}
        <div className="absolute top-0 left-0 right-0 h-12 px-8 flex items-center justify-between z-[90] text-white/90 font-black text-xs tracking-tighter">
          <div className="flex items-center gap-1">
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-2">
            <Signal size={14} />
            <Wifi size={14} />
            <div className="flex items-center gap-1">
              <span className="text-[10px]">92%</span>
              <Battery size={14} className="rotate-90" />
            </div>
          </div>
        </div>

        {/* App Viewport */}
        <div className="w-full h-full bg-white rounded-[48px] overflow-hidden relative shadow-inner">
          <div className="absolute inset-0 overflow-y-auto scrollbar-hide pt-12">
            {children}
          </div>
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-black/10 rounded-full z-[100]" />
      </div>

      {/* Background Glows - More Vibrant */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 -left-24 w-[600px] h-[600px] bg-pink-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-24 w-[600px] h-[600px] bg-orange-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[150px]" />
      </div>
    </div>
  );
};
