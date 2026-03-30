import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { db, collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, Timestamp, handleFirestoreError, OperationType } from '../firebase';
import { Notice, Category, Urgency } from '../types';
import { NoticeCard } from './NoticeCard';
import { Plus, X, Save, Loader2, Pin, Calendar, Tag, AlertTriangle, FileText, Search, Sparkles, LayoutDashboard, Bell, ChevronLeft, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';

import { toast } from 'sonner';

const categories: Category[] = ["Academic", "Placement", "Events", "Scholarships", "Sports", "Hostel", "General"];
const urgencies: Urgency[] = ["Normal", "Important", "Urgent"];

interface AdminPanelProps {
  onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const [mounted, setMounted] = useState(false);
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'General' as Category,
    urgency: 'Normal' as Urgency,
    expiryDate: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    pinned: false,
    attachmentUrl: '',
  });

  useEffect(() => {
    setMounted(true);
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

  const handleOpenModal = (notice?: Notice) => {
    if (notice) {
      setEditingNotice(notice);
      setFormData({
        title: notice.title,
        description: notice.description,
        category: notice.category,
        urgency: notice.urgency,
        expiryDate: format(notice.expiryDate.toDate(), 'yyyy-MM-dd'),
        pinned: notice.pinned,
        attachmentUrl: notice.attachmentUrl || '',
      });
    } else {
      setEditingNotice(null);
      setFormData({
        title: '',
        description: '',
        category: 'General',
        urgency: 'Normal',
        expiryDate: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
        pinned: false,
        attachmentUrl: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const noticeData = {
        ...formData,
        expiryDate: Timestamp.fromDate(new Date(formData.expiryDate)),
        createdAt: editingNotice ? editingNotice.createdAt : Timestamp.now(),
        authorUid: 'admin',
      };

      if (editingNotice) {
        await updateDoc(doc(db, 'notices', editingNotice.id), noticeData);
        toast.success('Notice updated successfully');
      } else {
        await addDoc(collection(db, 'notices'), noticeData);
        toast.success('Notice posted successfully');
      }
      setIsModalOpen(false);
    } catch (error) {
      handleFirestoreError(error, editingNotice ? OperationType.UPDATE : OperationType.CREATE, 'notices');
      toast.error('Failed to save notice');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    setIsLoading(true);
    try {
      await deleteDoc(doc(db, 'notices', deleteConfirmId));
      toast.success('Notice deleted successfully');
      setDeleteConfirmId(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'notices');
      toast.error('Failed to delete notice');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredNotices = notices.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    n.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [notifData, setNotifData] = useState({
    title: '',
    message: '',
    category: 'General'
  });

      const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await addDoc(collection(db, 'notifications'), {
        ...notifData,
        createdAt: Timestamp.now()
      });
      toast.success('Broadcast sent to all students');
      setIsNotifModalOpen(false);
      setNotifData({ title: '', message: '', category: 'General' });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'notifications');
      toast.error('Failed to send broadcast');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col gap-8 mb-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-pink-200 dark:shadow-none">
              <LayoutDashboard size={24} className="sm:w-8 sm:h-8" />
            </div>
            <div>
              <h1 className="text-xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tighter leading-none mb-1">
                Admin Area
              </h1>
              <p className="text-[8px] sm:text-[10px] font-black text-pink-600 dark:text-pink-400 uppercase tracking-widest flex items-center gap-1 sm:gap-1.5">
                <Sparkles size={10} className="sm:w-3 sm:h-3" /> Management Console
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onLogout}
              className="px-6 h-14 bg-white dark:bg-slate-900 text-gray-400 dark:text-slate-500 border-2 border-gray-100 dark:border-slate-800 rounded-2xl flex items-center gap-2 shadow-lg dark:shadow-none hover:border-pink-200 dark:hover:border-pink-900 hover:text-pink-600 dark:hover:text-pink-400 transition-all active:scale-95 font-black text-[10px] uppercase tracking-widest"
            >
              <ChevronLeft size={18} /> Back to Student View
            </button>
            <button
              onClick={() => setIsNotifModalOpen(true)}
              className="px-6 h-14 bg-indigo-600 text-white rounded-2xl flex items-center gap-2 shadow-2xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all active:scale-95 font-black text-[10px] uppercase tracking-widest"
            >
              <Bell size={18} /> Broadcast
            </button>
            <button
              onClick={() => handleOpenModal()}
              className="w-14 h-14 bg-pink-600 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-pink-200 dark:shadow-none hover:bg-pink-700 transition-all active:scale-95"
            >
              <Plus size={28} />
            </button>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search notices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-14 pr-6 py-5 border-2 border-gray-100 dark:border-slate-800 rounded-[28px] leading-5 bg-white dark:bg-slate-900 placeholder-gray-400 dark:placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 shadow-xl shadow-gray-100/50 dark:shadow-none transition-all font-bold text-lg dark:text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredNotices.map(notice => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              isAdmin={true}
              onDelete={handleDelete}
              onEdit={handleOpenModal}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Modal */}
      {mounted && createPortal(
        <AnimatePresence>
          {deleteConfirmId && (
            <motion.div 
              key="delete-confirm-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setDeleteConfirmId(null)}
                className="fixed inset-0 bg-gray-900/40 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto p-8 text-center"
              >
                <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle size={40} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter">Confirm Delete</h3>
                <p className="text-gray-500 dark:text-slate-400 mb-8 text-sm font-medium">This action cannot be undone. Are you sure you want to remove this notice?</p>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    className="flex-1 py-4 bg-gray-50 dark:bg-slate-800 text-gray-400 dark:text-slate-500 rounded-2xl font-black hover:bg-gray-100 dark:hover:bg-slate-700 transition-all active:scale-95 text-xs uppercase tracking-widest"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={isLoading}
                    className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-black shadow-xl shadow-rose-100 dark:shadow-none hover:bg-rose-700 transition-all active:scale-95 text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Broadcast Modal */}
      {mounted && createPortal(
        <AnimatePresence>
          {isNotifModalOpen && (
            <motion.div 
              key="broadcast-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsNotifModalOpen(false)}
                className="fixed inset-0 bg-gray-900/40 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto flex flex-col"
              >
                <div className="px-8 py-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
                  <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tighter flex items-center gap-2">
                    <Bell className="text-indigo-600 dark:text-indigo-400" size={24} /> Broadcast
                  </h2>
                  <button
                    onClick={() => setIsNotifModalOpen(false)}
                    className="p-2 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleBroadcast} className="p-8 space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest pl-1">Title</label>
                    <input
                      required
                      type="text"
                      value={notifData.title}
                      onChange={e => setNotifData({ ...notifData, title: e.target.value })}
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 rounded-2xl focus:border-indigo-500 outline-none transition-all font-bold dark:text-white"
                      placeholder="E.g., Urgent Update"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest pl-1">Message</label>
                    <textarea
                      required
                      rows={3}
                      value={notifData.message}
                      onChange={e => setNotifData({ ...notifData, message: e.target.value })}
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 rounded-2xl focus:border-indigo-500 outline-none transition-all resize-none font-medium text-sm dark:text-white"
                      placeholder="What do you want to tell everyone?"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest pl-1">Category</label>
                    <select
                      value={notifData.category}
                      onChange={e => setNotifData({ ...notifData, category: e.target.value })}
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 rounded-2xl focus:border-indigo-500 outline-none transition-all font-bold text-sm appearance-none dark:text-white"
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 py-5 bg-indigo-600 text-white font-black rounded-3xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-70 active:scale-95"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Bell size={20} />}
                    <span className="uppercase tracking-widest text-xs">Send to All</span>
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Modal */}
      {mounted && createPortal(
        <AnimatePresence>
          {isModalOpen && (
            <motion.div 
              key="notice-modal"
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
                className="fixed inset-0 bg-gray-900/40 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto flex flex-col"
              >
                <div className="px-8 py-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
                  <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tighter">
                    {editingNotice ? 'Edit Notice' : 'New Notice'}
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 overflow-y-auto flex-grow space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest pl-1">Title</label>
                    <input
                      required
                      type="text"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 rounded-2xl focus:border-pink-500 outline-none transition-all font-bold dark:text-white"
                      placeholder="Notice title"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest pl-1">Description</label>
                    <textarea
                      required
                      rows={3}
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 rounded-2xl focus:border-pink-500 outline-none transition-all resize-none font-medium text-sm dark:text-white"
                      placeholder="Detailed information"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest pl-1">Category</label>
                      <select
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value as Category })}
                        className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 rounded-2xl focus:border-pink-500 outline-none transition-all font-bold text-sm appearance-none dark:text-white"
                      >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest pl-1">Urgency</label>
                      <select
                        value={formData.urgency}
                        onChange={e => setFormData({ ...formData, urgency: e.target.value as Urgency })}
                        className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 rounded-2xl focus:border-pink-500 outline-none transition-all font-bold text-sm appearance-none dark:text-white"
                      >
                        {urgencies.map(u => <option key={u} value={u}>{u}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest pl-1">Expiry</label>
                      <input
                        required
                        type="date"
                        value={formData.expiryDate}
                        onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
                        className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 rounded-2xl focus:border-pink-500 outline-none transition-all font-bold text-sm dark:text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest pl-1">Link (Optional)</label>
                      <input
                        type="url"
                        value={formData.attachmentUrl}
                        onChange={e => setFormData({ ...formData, attachmentUrl: e.target.value })}
                        className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 rounded-2xl focus:border-pink-500 outline-none transition-all font-bold text-sm dark:text-white"
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-5 bg-pink-50 dark:bg-pink-900/20 rounded-3xl border-2 border-pink-100 dark:border-pink-900">
                    <input
                      type="checkbox"
                      id="pinned"
                      checked={formData.pinned}
                      onChange={e => setFormData({ ...formData, pinned: e.target.checked })}
                      className="w-5 h-5 text-pink-600 dark:text-pink-400 border-gray-300 dark:border-slate-700 rounded focus:ring-pink-500"
                    />
                    <label htmlFor="pinned" className="flex items-center gap-2 text-xs font-black text-pink-900 dark:text-pink-400 cursor-pointer uppercase tracking-widest">
                      <Pin size={14} /> Pin to top
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 py-5 bg-pink-600 text-white font-black rounded-3xl shadow-xl shadow-pink-100 hover:bg-pink-700 transition-all disabled:opacity-70 active:scale-95"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    <span className="uppercase tracking-widest text-xs">{editingNotice ? 'Update' : 'Post Now'}</span>
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};
