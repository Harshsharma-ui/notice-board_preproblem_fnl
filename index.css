import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { db, collection, getDocs, addDoc, Timestamp, query, orderBy, onSnapshot, limit } from './firebase';
import { Auth } from './components/Auth';
import { ErrorBoundary } from './components/ErrorBoundary';
import { MockNotification } from './components/MockNotification';
import { GraduationCap, ShieldCheck, Zap, Heart, Bell, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { AdminPanel } from './components/AdminPanel';
import { StudentPanel } from './components/StudentPanel';

const ADMIN_NAME = "Admin";
const ADMIN_PASS = "college123";

import { Toaster, toast } from 'sonner';

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('is_admin_mode') === 'true');
  const [darkMode, setDarkMode] = useState(false);
  const [activeNotification, setActiveNotification] = useState<{ title: string; message: string; category: string } | null>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    // Initial data seeding
    const initApp = async () => {
      // Check localStorage first - this is synchronous and very fast
      if (localStorage.getItem('data_seeded') === 'true') return;

      try {
        // Use a limit(1) query to check if data exists - much faster than getDocs on whole collection
        const noticesQuery = query(collection(db, 'notices'), limit(1));
        const noticesSnapshot = await getDocs(noticesQuery);
        
        if (!noticesSnapshot.empty) {
          localStorage.setItem('data_seeded', 'true');
          return;
        }
      
        const initialNotices = [
          {
            title: "Welcome to SmartBoard Portal",
            description: "Welcome to the new Smart College Notice Board. This platform is designed to provide real-time updates to all students and faculty members. You can now access all official announcements, academic schedules, and event details directly from your browser. Stay connected and never miss an important update from the college administration. Our goal is to ensure transparency and timely communication across all departments.",
            category: "General",
            urgency: "Normal",
            expiryDate: Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
            createdAt: Timestamp.now(),
            pinned: true,
            authorUid: 'system'
          },
          {
            title: "End Semester Examination Schedule - Spring 2026",
            description: "The final schedule for the End Semester Examinations for all undergraduate and postgraduate programs has been officially released by the Examination Cell. Students are advised to download the detailed timetable and note the room assignments and timing for each subject. Any discrepancies should be reported to the Controller of Examinations immediately. Please ensure you carry your valid ID card and hall ticket for all examination sessions.",
            category: "Academic",
            urgency: "Urgent",
            expiryDate: Timestamp.fromDate(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)),
            createdAt: Timestamp.now(),
            pinned: true,
            authorUid: 'system'
          },
          {
            title: "Placement Drive: TechCorp Global Solutions",
            description: "TechCorp Global Solutions is conducting a campus recruitment drive for Final Year B.Tech and MCA students. The recruitment process will include a technical written test followed by personal interviews. Interested candidates must register on the placement portal and upload their updated resumes by the end of this week. This is an excellent opportunity for students looking to start their careers in software development with a global leader in technology.",
            category: "Placement",
            urgency: "Important",
            expiryDate: Timestamp.fromDate(new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)),
            createdAt: Timestamp.now(),
            pinned: false,
            authorUid: 'system'
          },
          {
            title: "Annual Cultural Fest: 'Vibrance 2026'",
            description: "Get ready for the most awaited event of the year! 'Vibrance 2026' is set to take place next month, featuring a wide array of competitions including music, dance, drama, and fine arts. We invite all students to showcase their talents and participate in this grand celebration of culture and creativity. Registration forms are available at the Student Activity Center. Don't miss out on the chance to win exciting prizes and represent your department!",
            category: "Events",
            urgency: "Normal",
            expiryDate: Timestamp.fromDate(new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)),
            createdAt: Timestamp.now(),
            pinned: true,
            authorUid: 'system'
          }
        ];

        // Batch add initial notices
        const promises = initialNotices.map(notice => addDoc(collection(db, 'notices'), notice));
        await Promise.all(promises);

        const notificationsSnapshot = await getDocs(query(collection(db, 'notifications'), limit(1)));
        if (notificationsSnapshot.empty) {
          await addDoc(collection(db, 'notifications'), {
            title: "System Update",
            message: "SmartBoard is now live! Explore the new features and stay connected.",
            category: "System",
            createdAt: Timestamp.now()
          });
        }
        
        localStorage.setItem('data_seeded', 'true');
      } catch (error) {
        console.error("Error initializing app:", error);
      }
    };

    // Only run initialization if not already seeded to avoid unnecessary overhead
    if (localStorage.getItem('data_seeded') !== 'true') {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => initApp());
      } else {
        setTimeout(initApp, 500); // Reduced fallback delay
      }
    }
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const latest = snapshot.docs[0].data();
        
        // Check subscriptions
        const localSubs = localStorage.getItem('notice_subscriptions');
        const subscriptions = localSubs ? JSON.parse(localSubs) : [];
        
        // If user has subscriptions, only show if it matches
        if (subscriptions.length > 0 && !subscriptions.includes(latest.category)) {
          return;
        }

        // Only show if it's recent (within last 5 minutes)
        const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
        if (latest.createdAt.toDate().getTime() > fiveMinutesAgo) {
          setActiveNotification({
            title: latest.title,
            message: latest.message,
            category: latest.category
          });

          // Trigger Native Browser Notification if enabled
          if (localStorage.getItem('browser_notifications_enabled') === 'true' && Notification.permission === 'granted') {
            try {
              new Notification(`SmartBoard: ${latest.title}`, {
                body: latest.message,
                icon: 'https://cdn-icons-png.flaticon.com/512/2232/2232688.png', // Professional graduation icon
              });
            } catch (err) {
              console.error("Error showing native notification:", err);
            }
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAdminLogin = (name: string, pass: string) => {
    if (name === ADMIN_NAME && pass === ADMIN_PASS) {
      setIsAdmin(true);
      localStorage.setItem('is_admin_mode', 'true');
      toast.success('Successfully logged in as Admin');
      return true;
    }
    toast.error('Invalid admin credentials');
    return false;
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('is_admin_mode');
    toast.info('Logged out from Admin mode');
  };

  return (
    <ErrorBoundary>
      <Toaster position="top-right" richColors closeButton />
      <Router>
        <AnimatePresence>
          {activeNotification && (
            <MockNotification 
              key={activeNotification.title + activeNotification.message}
              title={activeNotification.title} 
              message={activeNotification.message} 
              category={activeNotification.category} 
              delay={0}
              onClose={() => setActiveNotification(null)}
            />
          )}
        </AnimatePresence>
        
        <div className="min-h-screen flex flex-col font-sans selection:bg-pink-100 selection:text-pink-900 bg-gradient-to-b from-white to-pink-50/30 dark:from-slate-950 dark:to-slate-900 dark:text-slate-100 transition-colors duration-300">
          {/* Navigation */}
          <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl border-b border-gray-100 dark:border-slate-800 shadow-sm">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex justify-between h-20 items-center">
                <div className="flex items-center gap-2 sm:gap-3 group cursor-pointer" onClick={() => window.location.href = '/'}>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-xl shadow-pink-200 dark:shadow-none group-hover:scale-110 transition-transform duration-300">
                    <GraduationCap size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg sm:text-xl font-black text-gray-900 dark:text-white leading-none tracking-tighter">CampusConnect</span>
                    <span className="text-[7px] sm:text-[8px] font-black text-pink-600 dark:text-pink-400 uppercase tracking-[0.3em] pl-0.5">College Portal</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="relative w-14 h-8 rounded-full bg-gray-100 dark:bg-slate-800 p-1 transition-colors duration-300 focus:outline-none border border-gray-200 dark:border-slate-700"
                    aria-label="Toggle Dark Mode"
                  >
                    <motion.div
                      animate={{ x: darkMode ? 24 : 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="w-6 h-6 rounded-full bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center"
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                          key={darkMode ? 'dark' : 'light'}
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 90 }}
                          transition={{ duration: 0.15 }}
                        >
                          {darkMode ? <Moon size={12} className="text-pink-500" /> : <Sun size={12} className="text-orange-500" />}
                        </motion.div>
                      </AnimatePresence>
                    </motion.div>
                  </button>
                  <Auth isAdmin={isAdmin} onLogin={handleAdminLogin} onLogout={handleAdminLogout} />
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-grow relative z-10">
            <Routes>
              <Route 
                path="/" 
                element={
                  isAdmin ? <AdminPanel onLogout={handleAdminLogout} /> : <StudentPanel />
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="bg-white dark:bg-slate-950 border-t border-gray-100 dark:border-slate-800 py-10 relative z-10">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl flex items-center justify-center text-white">
                    <GraduationCap size={16} />
                  </div>
                  <span className="text-lg font-black text-gray-900 dark:text-white tracking-tighter">CampusConnect</span>
                </div>
                
                <div className="flex items-center gap-6 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">
                  <div className="flex items-center gap-1.5 hover:text-pink-600 dark:hover:text-pink-400 transition-colors cursor-pointer">
                    <ShieldCheck size={14} /> Privacy
                  </div>
                  <div className="flex items-center gap-1.5 hover:text-pink-600 dark:hover:text-pink-400 transition-colors cursor-pointer">
                    <Zap size={14} /> Fast
                  </div>
                  <div className="flex items-center gap-1.5 hover:text-pink-600 dark:hover:text-pink-400 transition-colors cursor-pointer">
                    <Heart size={14} /> Life
                  </div>
                </div>

                <p className="text-[10px] text-gray-400 dark:text-slate-600 font-bold">
                  © 2026 CampusConnect. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
