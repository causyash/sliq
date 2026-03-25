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
  Eye,
  Database
} from 'lucide-react';
import { projectAPI, authAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import DataTable from './DataTable';

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

      <DataTable 
        columns={[
          { header: 'Project Name', accessor: 'name', cell: (row) => (
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 border border-indigo-100/50">
                <Layout size={20} />
              </div>
              <div>
                <Link to={`/projects/${row._id}`} className="font-bold text-gray-900 hover:text-indigo-600 transition-colors block leading-tight">{row.name}</Link>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{row.description?.slice(0, 40) || 'No description'}</p>
              </div>
            </div>
          )},
          { header: 'Workspace', accessor: 'workspaceId', cell: (row) => (
            <span className="px-3 py-1.5 bg-gray-50 border border-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-widest rounded-xl">
              {row.workspaceId?.name || 'Global'}
            </span>
          )},
          { header: 'Team', accessor: 'members', cell: (row) => (
            <div className="flex -space-x-1.5">
              {row.members.slice(0, 3).map((member, i) => (
                <div 
                  key={member._id}
                  className="w-7 h-7 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center text-[10px] font-black text-indigo-700 shadow-sm"
                  title={member.name}
                >
                  {member.name.charAt(0).toUpperCase()}
                </div>
              ))}
              {row.members.length > 3 && (
                <div className="w-7 h-7 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[8px] font-black text-gray-500 shadow-sm">
                  +{row.members.length - 3}
                </div>
              )}
              {row.members.length === 0 && <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest px-2 py-1 bg-amber-50 rounded-lg">Unassigned</span>}
            </div>
          )},
          { header: 'Actions', accessor: '_id', cell: (row) => (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  setSelectedProject(row);
                  setIsAssignModalOpen(true);
                }}
                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                title="Assign Member"
              >
                <UserPlus size={18} />
              </button>
              <Link 
                to={`/projects/${row._id}`}
                className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                title="View Progress"
              >
                <Eye size={18} />
              </Link>
              <button className="p-2 text-gray-300 hover:text-gray-900 rounded-lg transition-all">
                <MoreVertical size={18} />
              </button>
            </div>
          )}
        ]}
        data={filteredProjects}
        emptyMessage="No projects found matching your search criteria."
      />

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
