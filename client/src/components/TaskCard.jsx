import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Clock, MessageSquare, Paperclip, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

const TaskCard = ({ task, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: task._id,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const priorityColors = {
    low: 'bg-blue-50 text-blue-600 border-blue-100',
    medium: 'bg-amber-50 text-amber-600 border-amber-100',
    high: 'bg-orange-50 text-orange-600 border-orange-100',
    urgent: 'bg-red-50 text-red-600 border-red-100'
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 bg-gray-100 border-2 border-dashed border-gray-300 min-h-[120px] rounded-2xl mb-3"
      />
    );
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onClick && onClick(task)}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-100 p-4 rounded-2xl mb-3 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all cursor-grab active:cursor-grabbing group relative"
    >
      <div className="flex items-start justify-between mb-3">
        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${priorityColors[task.priority] || priorityColors.medium}`}>
          {task.priority}
        </span>
        <button className="text-gray-300 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal size={16} />
        </button>
      </div>

      <h4 className="text-sm font-bold text-gray-900 mb-3 line-clamp-2 leading-snug">
        {task.title}
      </h4>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-3">
          {task.dueDate && (
            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
              <Clock size={12} />
              <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
            <MessageSquare size={12} />
            <span>0</span>
          </div>
        </div>

        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-700 border-2 border-white shadow-sm" title={task.assignee?.name}>
          {task.assignee?.name ? task.assignee.name.charAt(0).toUpperCase() : '?'}
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
