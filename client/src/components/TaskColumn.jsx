import React, { useMemo } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';
import { Plus, MoreHorizontal } from 'lucide-react';

const TaskColumn = ({ id, title, tasks, onTaskClick, onAddTask }) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const isDeveloper = userInfo.role === 'developer';
  const taskIds = useMemo(() => tasks.map(t => t._id), [tasks]);
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div className="flex flex-col w-72 min-w-[280px] h-full">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-gray-900 text-sm uppercase tracking-widest">{title}</h3>
          <span className="bg-gray-100 text-gray-500 text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full">
            {tasks.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {!isDeveloper && (
            <button 
              onClick={onAddTask}
              className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-indigo-600 transition-colors"
            >
              <Plus size={16} />
            </button>
          )}
          <button className="p-1 hover:bg-gray-100 rounded text-gray-400 transition-colors">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      <div 
        ref={setNodeRef}
        className="flex-1 bg-gray-50/50 rounded-2xl p-2 min-h-[500px] border border-gray-100/50"
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} onClick={onTaskClick} />
          ))}
        </SortableContext>
        
        {tasks.length === 0 && (
          <div className="h-20 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl m-2">
            <span className="text-[10px] font-bold text-gray-400 italic">No tasks yet</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskColumn;
