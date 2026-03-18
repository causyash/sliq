import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Calendar, ChevronRight, Users } from 'lucide-react';

const ProjectCard = ({ project }) => {
  return (
    <Link 
      to={`/projects/${project._id}`}
      className="group bg-white border border-gray-100 p-6 rounded-3xl hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50/50 transition-all duration-300 flex flex-col h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
            <Layout size={20} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors truncate max-w-[180px]">
            {project.name}
          </h3>
        </div>
        <div className="text-gray-400 group-hover:translate-x-1 group-hover:text-indigo-600 transition-all">
          <ChevronRight size={20} />
        </div>
      </div>
      
      <p className="text-gray-500 text-sm mb-6 line-clamp-2 h-10">
        {project.description || 'No description provided.'}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
        <div className="flex items-center gap-1 text-gray-400 text-xs">
          <Calendar size={14} />
          <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex -space-x-2">
          {project.members?.slice(0, 3).map((member, i) => (
            <div 
              key={i} 
              className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-600"
              title={member.name}
            >
              {member.name ? member.name.charAt(0).toUpperCase() : '?'}
            </div>
          ))}
          {project.members?.length > 3 && (
            <div className="w-7 h-7 rounded-full bg-gray-50 border-2 border-white flex items-center justify-center text-[10px] text-gray-400 font-medium">
              +{project.members.length - 3}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
