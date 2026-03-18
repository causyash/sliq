import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Layout, ChevronRight } from 'lucide-react';

const WorkspaceCard = ({ workspace }) => {
  return (
    <Link 
      to={`/workspaces/${workspace._id}`}
      className="group bg-white border border-gray-100 p-6 rounded-3xl hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50/50 transition-all duration-300 flex flex-col h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-bold text-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
          {workspace.name.charAt(0).toUpperCase()}
        </div>
        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:translate-x-1 group-hover:text-indigo-600 transition-all">
          <ChevronRight size={18} />
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{workspace.name}</h3>
      <p className="text-gray-500 text-sm mb-6 flex-grow">
        Managed by {workspace.owner?.name || 'Unknown'}
      </p>

      <div className="flex items-center gap-4 pt-4 border-t border-gray-50 mt-auto">
        <div className="flex items-center gap-1.5 text-gray-400 text-sm">
          <Users size={16} />
          <span>{workspace.members?.length || 0} Members</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-400 text-sm">
          <Layout size={16} />
          <span>Projects</span>
        </div>
      </div>
    </Link>
  );
};

export default WorkspaceCard;
