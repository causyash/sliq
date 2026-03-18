import React from 'react';
import { motion } from 'framer-motion';
import { Clock, User } from 'lucide-react';

const ActivityTimeline = ({ activities }) => {
  const formatTimeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return past.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="p-10 text-center bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-200">
        <Clock className="mx-auto text-gray-300 mb-3" size={32} />
        <p className="text-sm font-bold text-gray-400">No activity yet</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical Line */}
      <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-100 hidden sm:block"></div>

      <div className="space-y-8">
        {activities.map((activity, index) => (
          <motion.div 
            key={activity._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative flex items-start gap-4"
          >
            {/* Dot on line */}
            <div className="hidden sm:flex absolute left-6 -translate-x-1/2 w-3 h-3 rounded-full bg-white border-2 border-indigo-500 z-10"></div>

            {/* Avatar */}
            <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-indigo-600 font-bold shadow-sm flex-shrink-0 z-20">
              {activity.userId?.name?.charAt(0).toUpperCase() || '?'}
            </div>

            {/* Content */}
            <div className="flex-1 bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm shadow-indigo-100/10 hover:shadow-md transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                <span className="text-sm font-black text-gray-900 leading-tight">
                  {activity.userId?.name}
                </span>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                  <Clock size={12} />
                  {formatTimeAgo(activity.createdAt)}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-500 leading-relaxed">
                {activity.details}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ActivityTimeline;
