import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Users, 
  FolderKanban, 
  MoreVertical, 
  UserPlus, 
  Search,
  Layout,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye
} from 'lucide-react';
import { projectAPI, authAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const AdminProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectsRes, usersRes] = await Promise.all([
        projectAPI.adminGetAll(),
        authAPI.getUsers()
      ]);
      setProjects(projectsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error('Failed to fetch admin data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssign = async (userId) => {
    try {
      const updatedMembers = [...selectedProject.members.map(m => m._id), userId];
      await projectAPI.update(selectedProject._id, { members: updatedMembers });
      setIsAssignModalOpen(false);
      fetchData();
    } catch (error) {
      alert('Failed to assign user');
    }
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.workspaceId?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Search all projects & workspaces..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-3 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white focus:border-indigo-100 transition-all text-sm font-medium"
          />
        </div>
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <div className="flex-1 md:flex-none px-4 py-2.5 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center justify-center md:justify-start gap-2 min-w-[140px]">
            <FolderKanban size={16} className="text-indigo-600" />
            <span className="text-sm font-bold text-indigo-700 whitespace-nowrap">{projects.length} Total Projects</span>
          </div>
          <div className="flex-1 md:flex-none px-4 py-2.5 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-center md:justify-start gap-2 min-w-[140px]">
            <Users size={16} className="text-emerald-600" />
            <span className="text-sm font-bold text-emerald-700 whitespace-nowrap">{users.length} Total Users</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredProjects.map((project) => (
          <div 
            key={project._id}
            className="bg-white border border-gray-100 p-6 rounded-[2.5rem] hover:shadow-xl hover:shadow-indigo-50/20 transition-all group"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex gap-4 items-start">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 border border-gray-100 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all duration-300">
                  <Layout size={28} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Link to={`/projects/${project._id}`} className="hover:text-indigo-600 transition-colors">
                      <h3 className="text-xl font-black text-gray-900 leading-tight">{project.name}</h3>
                    </Link>
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-lg">
                      {project.workspaceId?.name || 'Global'}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm line-clamp-1 max-w-md">{project.description || 'No description provided.'}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-8">
                <div className="flex -space-x-2">
                  {project.members.length > 0 ? (
                    project.members.map((member, i) => (
                      <div 
                        key={member._id}
                        className="w-8 h-8 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center text-[10px] font-black text-indigo-700 shadow-sm"
                        title={`${member.name} (${member.role})`}
                      >
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center gap-1.5 text-amber-500 bg-amber-50 px-3 py-1 rounded-full border border-amber-100 text-[10px] font-black uppercase tracking-widest">
                      <AlertCircle size={12} />
                      Unassigned
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 border-l border-gray-100 pl-8">
                  <button 
                    onClick={() => {
                        setSelectedProject(project);
                        setIsAssignModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-black hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
                  >
                    <UserPlus size={16} />
                    Assign Member
                  </button>
                  <Link 
                    to={`/projects/${project._id}`}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-100 text-gray-600 rounded-xl text-xs font-black hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                  >
                    <Eye size={16} className="text-indigo-600" />
                    View Status
                  </Link>
                  <button className="p-2.5 text-gray-300 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredProjects.length === 0 && (
          <div className="text-center p-20 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
            <FolderKanban size={48} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-bold">No projects found matching your search.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isAssignModalOpen && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-2xl font-black text-gray-900">Assign Members</h3>
                <p className="text-gray-500 text-sm mt-1">Select a developer to add to "{selectedProject?.name}"</p>
              </div>
              <div className="p-4 max-h-[400px] overflow-y-auto">
                <div className="space-y-2">
                  {users
                    .filter(u => u.role === 'developer' && !selectedProject?.members.some(m => m._id === u._id))
                    .map(user => (
                    <button 
                      key={user._id}
                      onClick={() => handleAssign(user._id)}
                      className="w-full flex items-center justify-between p-4 hover:bg-indigo-50 rounded-[1.5rem] transition-all group"
                    >
                      <div className="flex items-center gap-3 text-left">
                        <div className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-indigo-600 font-black group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900">{user.name}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{user.role}</p>
                        </div>
                      </div>
                      <Plus size={20} className="text-gray-300 group-hover:text-indigo-600" />
                    </button>
                  ))}

                  {users.filter(u => !selectedProject?.members.some(m => m._id === u._id)).length === 0 && (
                      <p className="text-center text-gray-400 py-10 font-bold">No available users to assign.</p>
                  )}
                </div>
              </div>
              <div className="p-6 bg-gray-50/50 border-t border-gray-100">
                <button 
                  onClick={() => setIsAssignModalOpen(false)}
                  className="w-full py-3 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProjectList;
