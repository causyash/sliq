import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, User } from 'lucide-react';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const { name } = JSON.parse(userInfo);
      setUserName(name);
    }
  }, []);

  return (
    <header className="h-20 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search projects, tasks, members..."
            className="w-full pl-12 pr-6 py-2.5 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white focus:border-indigo-100 transition-all text-sm font-medium"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <NotificationBell />
        
        <div className="h-8 w-px bg-gray-100"></div>

        <button className="flex items-center gap-3 p-1.5 hover:bg-gray-50 rounded-2xl transition-all group">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-100">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="text-left py-1 pr-2">
            <p className="text-xs font-black text-gray-900 leading-tight">{userName}</p>
            <p className="text-[10px] font-bold text-gray-400">Available</p>
          </div>
          <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-900 transition-colors" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
