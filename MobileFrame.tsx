import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Shield, LogOut, Key, User as UserIcon, X, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthProps {
  isAdmin: boolean;
  onLogin: (name: string, pass: string) => boolean;
  onLogout: () => void;
}

export const Auth: React.FC<AuthProps> = ({ isAdmin, onLogin, onLogout }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLogin(name, pass)) {
      setIsModalOpen(false);
      setName('');
      setPass('');
      setError('');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="flex items-center gap-4">
      {isAdmin ? (
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-bold text-gray-900 dark:text-white">Administrator</span>
            <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Verified Access</span>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border-2 border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-xl font-bold hover:bg-red-50 dark:hover:bg-red-900/20 transition-all active:scale-95 shadow-sm"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Exit Admin</span>
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-5 sm:py-2.5 bg-indigo-600 text-white rounded-lg sm:rounded-xl font-bold hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-200 dark:shadow-none text-xs sm:text-base"
        >
          <Shield size={16} className="sm:w-[18px] sm:h-[18px]" />
          <span>Admin Login</span>
        </button>
      )}

      {mounted && createPortal(
        <AnimatePresence>
          {isModalOpen && (
            <motion.div 
              key="admin-auth-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="fixed inset-0 bg-indigo-950/40 dark:bg-black/60 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-slate-800"
              >
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300 rounded-full z-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-sm"
                >
                  <X size={24} />
                </button>

                <div className="p-8">
                  <div className="flex justify-between items-center mb-8">
                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <Key size={24} />
                    </div>
                  </div>

                  <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Admin Portal</h2>
                  <p className="text-gray-500 dark:text-slate-400 mb-8 text-sm">Enter your credentials to access management features.</p>

                  <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest pl-1">Admin Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 dark:text-slate-500">
                          <UserIcon size={18} />
                        </div>
                        <input
                          required
                          type="text"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white outline-none transition-all font-medium"
                          placeholder="e.g. Admin"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest pl-1">Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 dark:text-slate-500">
                          <Shield size={18} />
                        </div>
                        <input
                          required
                          type="password"
                          value={pass}
                          onChange={e => setPass(e.target.value)}
                          className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white outline-none transition-all font-medium"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    {error && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs font-bold text-center">
                        {error}
                      </motion.p>
                    )}

                    <button
                      type="submit"
                      className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all active:scale-[0.98]"
                    >
                      Authorize Access
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="w-full py-4 bg-gray-50 dark:bg-slate-800 text-gray-400 dark:text-slate-500 rounded-2xl font-black hover:bg-gray-100 dark:hover:bg-slate-700 transition-all active:scale-[0.98] text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                      <ChevronLeft size={16} />
                      Back to Student View
                    </button>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};
