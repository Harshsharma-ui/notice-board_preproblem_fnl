import React, { useState, useEffect } from 'react';
import { db, collection, onSnapshot, query, orderBy, handleFirestoreError, OperationType, where, setDoc, doc, deleteDoc, getDocs, Timestamp } from '../firebase';
import { Notice, Category, Subscription } from '../types';
import { NoticeCard } from './NoticeCard';
import { Search, Filter, Bell, BellOff, Pin, Archive, Grid, List, ChevronRight, Info, Sparkles, LayoutGrid, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const categories: Category[] = ["Academic", "Placement", "Events", "Scholarships", "Sports", "Hostel", "General"];

export const StudentPanel: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>(() => {
    const cached = localStorage.getItem('cached_notices');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        return parsed.map((n: any) => ({
          ...n,
          expiryDate: new Timestamp(n.expiryDate.seconds, n.expiryDate.nanoseconds),
          createdAt: new Timestamp(n.createdAt.seconds, n.createdAt.nanoseconds)
        }));
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  const [subscriptions, setSubscriptions] = useState<string[]>([]);
  const [browserNotifsEnabled, setBrowserNotifsEnabled] = useState(localStorage.getItem('browser_notifications_enabled') === 'true');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [showExpired, setShowExpired] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'notices'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const noticesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notice[];
      setNotices(noticesData);
      localStorage.setItem('cached_notices', JSON.stringify(noticesData));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'notices');
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const localSubs = localStorage.getItem('notice_subscriptions');
    if (localSubs) setSubscriptions(JSON.parse(localSubs));
  }, []);

  const handleToggleSubscription = (category: Category) => {
    const newSubs = subscriptions.includes(category)
      ? subscriptions.filter(s => s !== category)
      : [...subscriptions, category];
    
    setSubscriptions(newSubs);
    localStorage.setItem('notice_subscriptions', JSON.stringify(newSubs));
  };

  const handleEnableBrowserNotifs = async () => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notifications.");
      return;
    }

    if (Notification.permission === "granted") {
      setBrowserNotifsEnabled(true);
      localStorage.setItem('browser_notifications_enabled', 'true');
      // Show a test notification
      new Notification("Notifications Enabled!", {
        body: "You will now receive official college updates directly on your desktop.",
        icon: 'https://cdn-icons-png.flaticon.com/512/2232/2232688.png'
      });
    } else if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setBrowserNotifsEnabled(true);
        localStorage.setItem('browser_notifications_enabled', 'true');
        new Notification("Notifications Enabled!", {
          body: "You will now receive official college updates directly on your desktop.",
          icon: 'https://cdn-icons-png.flaticon.com/512/2232/2232688.png'
        });
      }
    } else {
      alert("Notification permission was denied. Please enable it in your browser settings.");
    }
  };

  const filteredNotices = notices.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         n.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || n.category === selectedCategory;
    const isExpired = n.expiryDate.toDate() < new Date();
    const matchesExpiry = showExpired ? isExpired : !isExpired;
    
    return matchesSearch && matchesCategory && matchesExpiry;
  });

  const pinnedNotices = filteredNotices.filter(n => n.pinned).slice(0, 3);
  const regularNotices = filteredNotices.filter(n => !n.pinned);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header & Search */}
      <div className="flex flex-col gap-8 mb-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-pink-200 dark:shadow-none">
              <LayoutGrid size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter leading-none mb-1">
                CampusConnect Board
              </h1>
              <p className="text-[10px] font-black text-pink-600 dark:text-pink-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles size={12} /> Live Updates
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setShowExpired(!showExpired)}
            className={cn(
              "px-3 py-2 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl transition-all border-2 shadow-lg active:scale-95 flex items-center gap-2 sm:gap-3",
              showExpired 
                ? "bg-gray-900 dark:bg-slate-800 text-white border-gray-900 dark:border-slate-700" 
                : "bg-white dark:bg-slate-900 text-gray-400 dark:text-slate-500 border-gray-100 dark:border-slate-800 hover:border-pink-200 dark:hover:border-pink-900 hover:text-pink-600 dark:hover:text-pink-400"
            )}
          >
            {showExpired ? <Grid size={16} className="sm:w-5 sm:h-5" /> : <Archive size={16} className="sm:w-5 sm:h-5" />}
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest">
              {showExpired ? 'View Current' : 'View Archive'}
            </span>
          </button>
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search announcements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-14 pr-6 py-5 border-2 border-gray-100 dark:border-slate-800 rounded-[28px] leading-5 bg-white dark:bg-slate-900 placeholder-gray-400 dark:placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 shadow-xl shadow-gray-100/50 dark:shadow-none transition-all font-bold text-lg dark:text-white"
          />
        </div>
      </div>

      {/* Categories Horizontal Scroll */}
      <div className="mb-12 overflow-x-auto scrollbar-hide -mx-6 px-6">
        <div className="flex items-center gap-3 pb-4">
          <button
            onClick={() => setSelectedCategory('All')}
            className={cn(
              "whitespace-nowrap px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border-2",
              selectedCategory === 'All' 
                ? "bg-pink-600 text-white border-pink-600 shadow-xl shadow-pink-100 dark:shadow-none" 
                : "bg-white dark:bg-slate-900 text-gray-500 dark:text-slate-400 border-gray-100 dark:border-slate-800 hover:border-pink-200 dark:hover:border-pink-900"
            )}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "whitespace-nowrap px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border-2",
                selectedCategory === cat 
                  ? "bg-pink-600 text-white border-pink-600 shadow-xl shadow-pink-100 dark:shadow-none" 
                  : "bg-white dark:bg-slate-900 text-gray-500 dark:text-slate-400 border-gray-100 dark:border-slate-800 hover:border-pink-200 dark:hover:border-pink-900"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-12">
        {/* Pinned Section */}
        {pinnedNotices.length > 0 && !showExpired && (
          <section>
            <div className="flex items-center justify-between mb-6 px-2">
              <h2 className="text-[10px] font-black text-pink-500 uppercase tracking-[0.3em] flex items-center gap-2">
                <Pin size={16} /> Featured
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <AnimatePresence mode="popLayout">
                {pinnedNotices.map(notice => (
                  <NoticeCard key={notice.id} notice={notice} />
                ))}
              </AnimatePresence>
            </div>
          </section>
        )}

        {/* Regular Section */}
        <section>
          <div className="flex items-center justify-between mb-6 px-2">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2">
              <List size={16} /> {showExpired ? 'Archive' : 'Recent'}
            </h2>
          </div>
          
          {filteredNotices.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-[40px] border-4 border-dashed border-gray-50 dark:border-slate-800"
            >
              <div className="w-20 h-20 bg-gray-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-4 text-gray-200 dark:text-slate-700">
                <Info size={32} />
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white">Nothing here</h3>
              <p className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-2">Check back later</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              <AnimatePresence mode="popLayout">
                {regularNotices.map(notice => (
                  <NoticeCard key={notice.id} notice={notice} />
                ))}
                {showExpired && pinnedNotices.map(notice => (
                  <NoticeCard key={notice.id} notice={notice} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>

        {/* Subscription Quick Action */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 bg-gradient-to-br from-pink-500 to-orange-500 rounded-[40px] text-white shadow-2xl shadow-pink-200 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-40 h-40 -mr-20 -mt-20 bg-white/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <Bell size={24} className="animate-bounce" />
                <h3 className="text-xl font-black tracking-tighter">Stay Notified</h3>
              </div>
              <p className="text-xs font-bold text-white/80 mb-6 leading-relaxed">Subscribe to categories and never miss an important update from the college.</p>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => handleToggleSubscription(cat)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border-2",
                      subscriptions.includes(cat)
                        ? "bg-white text-pink-600 border-white shadow-lg"
                        : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-8 bg-white dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-800 rounded-[40px] shadow-xl shadow-gray-100/50 dark:shadow-none flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tighter">Notifications</h3>
              </div>
              <p className="text-xs font-bold text-gray-400 dark:text-slate-500 mb-6 leading-relaxed uppercase tracking-widest">
                Get real-time browser notifications even when you're on other tabs.
              </p>
            </div>
            
            <button
              onClick={handleEnableBrowserNotifs}
              disabled={browserNotifsEnabled}
              className={cn(
                "w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-2",
                browserNotifsEnabled
                  ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 cursor-default"
                  : "bg-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700"
              )}
            >
              {browserNotifsEnabled ? (
                <>
                  <ShieldCheck size={16} /> Notifications Enabled
                </>
              ) : (
                <>
                  <Bell size={16} /> Enable notification
                </>
              )}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
