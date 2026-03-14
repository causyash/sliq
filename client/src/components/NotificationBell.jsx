import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Clock, User, MessageSquare, AlertCircle } from 'lucide-react';
import { notificationAPI } from '../services/api';
import socket, { joinUser } from '../services/socket';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchUnread = async () => {
    try {
      const { data } = await notificationAPI.getUnread();
      setNotifications(data.notifications);
      setUnreadCount(data.count);
    } catch (err) {
      console.error('Failed to fetch unread notifications', err);
    }
  };

  useEffect(() => {
    fetchUnread();
    
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const { _id } = JSON.parse(userInfo);
      joinUser(_id);
    }

    socket.on('notification_received', (notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return () => {
      socket.off('notification_received');
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await notificationAPI.markRead(id);
      setNotifications(notifications.filter(n => n._id !== id));
      setUnreadCount(prev => prev - 1);
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'task_assigned': return <User size={14} className="text-blue-500" />;
      case 'status_changed': return <Clock size={14} className="text-amber-500" />;
      case 'comment_added': return <MessageSquare size={14} className="text-emerald-500" />;
      default: return <AlertCircle size={14} className="text-gray-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-indigo-600 hover:border-indigo-100 transition-all relative"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-4 w-80 bg-white rounded-3xl shadow-2xl shadow-indigo-100 border border-gray-100 z-50 overflow-hidden"
          >
            <div className="p-5 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
              <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest">Notifications</h3>
              <span className="text-[10px] font-bold text-gray-400">{unreadCount} New</span>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div key={n._id} className="p-4 hover:bg-gray-50 border-b border-gray-50 transition-colors group relative">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                        {getTypeIcon(n.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-600 leading-relaxed pr-6">{n.message}</p>
                        <span className="text-[10px] text-gray-400 font-bold mt-1 block">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleMarkRead(n._id)}
                      className="absolute right-3 top-4 p-1 bg-white border border-gray-100 text-gray-300 hover:text-emerald-500 hover:border-emerald-100 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                      title="Mark as read"
                    >
                      <Check size={14} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center">
                  <Bell size={32} className="text-gray-200 mx-auto mb-3" />
                  <p className="text-sm font-bold text-gray-400">All caught up!</p>
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <button className="w-full p-4 text-[10px] font-black text-indigo-600 hover:bg-indigo-50 transition-colors uppercase tracking-widest border-t border-gray-50">
                View All Notifications
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
