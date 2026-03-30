import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Notice, Urgency } from '../types';
import { format } from 'date-fns';
import { Pin, Calendar, Tag, AlertTriangle, FileText, Trash2, Edit2, ExternalLink, Clock, X, ChevronRight, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NoticeCardProps {
  notice: Notice;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (notice: Notice) => void;
}

const urgencyColors: Record<Urgency, string> = {
  Normal: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800',
  Important: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800',
  Urgent: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-800',
};

const urgencyIcons: Record<Urgency, React.ReactNode> = {
  Normal: <Tag size={14} />,
  Important: <AlertTriangle size={14} />,
  Urgent: <AlertTriangle size={14} />,
};

const categoryStyles: Record<string, string> = {
  Academic: 'from-blue-500 to-indigo-600 shadow-blue-100',
  Placement: 'from-emerald-500 to-teal-600 shadow-emerald-100',
  Events: 'from-purple-500 to-pink-600 shadow-purple-100',
  Scholarships: 'from-amber-500 to-orange-600 shadow-amber-100',
  Sports: 'from-rose-500 to-red-600 shadow-rose-100',
  Hostel: 'from-cyan-500 to-blue-600 shadow-cyan-100',
  General: 'from-slate-500 to-slate-700 shadow-slate-100',
};

export const NoticeCard: React.FC<NoticeCardProps> = ({ notice, isAdmin, onDelete, onEdit }) => {
  const [isFullViewOpen, setIsFullViewOpen] = useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isExpired = notice.expiryDate.toDate() < new Date();
  const categoryGradient = categoryStyles[notice.category] || categoryStyles.General;

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ y: -4 }}
        onClick={() => setIsFullViewOpen(true)}
        className={cn(
          "relative group bg-white dark:bg-slate-900 rounded-[32px] border-2 border-transparent p-6 shadow-2xl shadow-gray-200/50 dark:shadow-none hover:shadow-3xl transition-all duration-500 overflow-hidden cursor-pointer",
          notice.pinned && "border-pink-200 dark:border-pink-900",
          isExpired && "opacity-60 grayscale-[0.5] shadow-none"
        )}
      >
        {/* Decorative Background Gradient */}
        <div className={cn(
          "absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-gradient-to-br opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-500",
          categoryGradient
        )} />

        {notice.pinned && (
          <div className="absolute top-4 right-4 bg-pink-500 text-white p-2 rounded-2xl shadow-lg z-10 animate-bounce">
            <Pin size={14} fill="white" />
          </div>
        )}

        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-start justify-between mb-4">
            <div className="flex flex-wrap gap-2">
              <span className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm",
                urgencyColors[notice.urgency]
              )}>
                {urgencyIcons[notice.urgency]}
                {notice.urgency}
              </span>
              <span className={cn(
                "px-3 py-1.5 bg-gradient-to-br text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-md",
                categoryGradient
              )}>
                {notice.category}
              </span>
            </div>
            
            {isAdmin && (
              <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onEdit?.(notice)}
                  className="p-2 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-xl transition-all active:scale-90"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => onDelete?.(notice.id)}
                  className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all active:scale-90"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>

          <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3 leading-tight tracking-tight group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
            {notice.title}
          </h3>
          
          <p className="text-gray-500 dark:text-slate-400 text-sm mb-6 line-clamp-3 flex-grow leading-relaxed font-medium">
            {notice.description}
          </p>

          <div className="mt-auto pt-5 border-t border-gray-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-wider">
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-pink-400" />
                <span>Expires: {format(notice.expiryDate.toDate(), 'MMM d')}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {notice.attachmentUrl && (
                <a
                  href={notice.attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 bg-gradient-to-br text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg active:scale-95",
                    categoryGradient
                  )}
                >
                  <FileText size={14} />
                  <span>View</span>
                  <ExternalLink size={12} />
                </a>
              )}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFullViewOpen(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-pink-100 dark:hover:bg-pink-900/40 transition-all active:scale-95 border-2 border-pink-100 dark:border-pink-900 shadow-sm"
              >
                Read More <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {mounted && createPortal(
        <AnimatePresence>
          {isFullViewOpen && (
            <motion.div 
              key="notice-full-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsFullViewOpen(false)}
                className="absolute inset-0 bg-gray-950/60 backdrop-blur-xl"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 40 }}
                className="relative bg-white dark:bg-slate-900 rounded-[40px] shadow-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
              >
                {/* Modal Header */}
                <div className={cn(
                  "h-32 bg-gradient-to-br flex items-end p-8 relative overflow-hidden",
                  categoryGradient
                )}>
                  <div className="absolute top-0 right-0 w-64 h-64 -mr-20 -mt-20 bg-white/10 rounded-full blur-3xl" />
                  <div className="relative z-10 flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <span className="px-4 py-2 bg-white/20 backdrop-blur-md text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-white/20">
                        {notice.category}
                      </span>
                      <span className={cn(
                        "px-4 py-2 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl",
                        notice.urgency === 'Urgent' && "text-rose-600 dark:text-rose-400"
                      )}>
                        {notice.urgency}
                      </span>
                    </div>
                    <button
                      onClick={() => setIsFullViewOpen(false)}
                      className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all backdrop-blur-md"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-8 sm:p-12 overflow-y-auto flex-grow custom-scrollbar">
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-4">
                    <Calendar size={14} className="text-pink-500" />
                    Posted {format(notice.createdAt.toDate(), 'MMMM d, yyyy')}
                  </div>
                  
                  <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-8 leading-[1.1] tracking-tight">
                    {notice.title}
                  </h2>

                  <div className="prose prose-pink dark:prose-invert max-w-none">
                    <p className="text-gray-600 dark:text-slate-300 text-lg leading-relaxed font-medium whitespace-pre-wrap">
                      {notice.description}
                    </p>
                  </div>

                  <div className="mt-12 p-8 bg-gray-50 dark:bg-slate-800/50 rounded-[32px] border-2 border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm text-pink-500">
                        <Clock size={24} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">Valid Until</p>
                        <p className="text-lg font-black text-gray-900 dark:text-white">{format(notice.expiryDate.toDate(), 'MMMM d, yyyy')}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      {notice.attachmentUrl && (
                        <a
                          href={notice.attachmentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            "flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-br text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all active:scale-95",
                            categoryGradient
                          )}
                        >
                          <FileText size={18} /> Download Attachment
                        </a>
                      )}
                      <button className="p-4 bg-white dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-800 text-gray-400 dark:text-slate-500 rounded-2xl hover:text-pink-600 dark:hover:text-pink-400 hover:border-pink-100 dark:hover:border-pink-900 transition-all shadow-sm">
                        <Share2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="px-8 py-6 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-800 flex items-center justify-center">
                  <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.4em]">
                    SmartBoard Official Announcement
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};
