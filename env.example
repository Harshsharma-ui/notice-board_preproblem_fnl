import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Bell, X, ShieldCheck, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MockNotificationProps {
  title: string;
  message: string;
  category: string;
  delay?: number;
  onClose?: () => void;
}

export const MockNotification: React.FC<MockNotificationProps> = ({ title, message, category, delay = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      setTimeout(onClose, 500); // Wait for exit animation
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-6 left-6 right-6 z-[9999] pointer-events-none flex justify-center"
        >
          <div className="w-full max-w-[360px] pointer-events-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-gray-100 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-none rounded-3xl p-4 flex items-center gap-4 ring-1 ring-black/5 dark:ring-white/5">
            <div className="w-10 h-10 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 rounded-2xl flex items-center justify-center shrink-0">
              <ShieldCheck size={20} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[9px] font-black text-pink-600 dark:text-pink-400 uppercase tracking-widest">
                  {category}
                </span>
                <span className="text-[9px] font-bold text-gray-400 dark:text-slate-500">Official</span>
              </div>
              <h4 className="text-xs font-black text-gray-900 dark:text-white truncate">{title}</h4>
              <p className="text-[10px] text-gray-500 dark:text-slate-400 font-medium line-clamp-1">{message}</p>
            </div>

            <button 
              onClick={handleClose}
              className="p-1.5 text-gray-300 hover:text-gray-500 dark:text-slate-600 dark:hover:text-slate-400 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
