import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, FolderKanban, Users, Settings, Mail, Video, Calendar } from 'lucide-react';
import { workspaceAPI, projectAPI } from '../services/api';
import Layout from '../components/Layout';
import ProjectCard from '../components/ProjectCard';
import CreateProjectModal from '../components/CreateProjectModal';
import CreateProjectModal from '../components/CreateProjectModal';
import CreateMeetingModal from '../components/CreateMeetingModal';
import DataTable from '../components/DataTable';

const WorkspacePage = () => {
  const { id } = useParams();
  const [workspace, setWorkspace] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const isDeveloper = userInfo.role === 'developer';

  const fetchWorkspaceData = async () => {
    try {
      const { data } = await workspaceAPI.getById(id);
      setWorkspace(data);
      setProjects(data.projects || []);
    } catch (err) {
      setError('Failed to load workspace data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaceData();
  }, [id]);

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setInviteLoading(true);
    try {
      await workspaceAPI.invite(id, inviteEmail);
      alert('User invited successfully');
      setInviteEmail('');
      fetchWorkspaceData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to invite user');
    } finally {
      setInviteLoading(false);
    }
  };

  if (loading) return (
    <Layout>
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    </Layout>
  );

  if (error) return (
    <Layout>
      <div className="text-center p-20 bg-white rounded-3xl border border-red-100">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
        <p className="text-gray-500 mb-6">{error}</p>
        <button onClick={() => navigate('/workspaces')} className="text-indigo-600 font-bold">Back to Workspaces</button>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="mb-10 flex flex-col xl:flex-row xl:items-start xl:justify-between gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shrink-0">
              {workspace.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">{workspace.name}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-1">
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <Users size={14} />
                  {workspace.members.length} Members
                </span>
                <span className="hidden sm:inline w-1 h-1 bg-gray-300 rounded-full"></span>
                <span className="text-sm text-gray-500">Founded by {workspace.owner?.name}</span>
              </div>
            </div>
          </div>
        </div>

        {!isDeveloper && (
          <div className="flex flex-wrap items-center gap-3">
            <form onSubmit={handleInvite} className="flex gap-2 w-full sm:w-auto">
              <input 
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="User email"
                className="flex-1 min-w-0 sm:w-48 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
              <button 
                type="submit"
                disabled={inviteLoading}
                className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-black transition-all disabled:opacity-50"
              >
                <Mail size={16} />
                {inviteLoading ? '...' : 'Invite'}
              </button>
            </form>
            <div className="flex gap-2 w-full sm:w-auto">
              <button 
                onClick={() => navigate(`/meeting/workspace-${id}`)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all shadow-sm"
              >
                <Video size={18} className="text-indigo-600" />
                Meeting
              </button>
              <button 
                onClick={() => setIsMeetingModalOpen(true)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all shadow-sm"
              >
                <Calendar size={18} className="text-indigo-600" />
                Schedule 
              </button>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
              >
                <Plus size={20} />
                New Project
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))
        ) : (
          <div className="col-span-full bg-white rounded-3xl border border-dashed border-gray-300 p-16 text-center">
            <FolderKanban className="text-gray-300 mx-auto mb-4" size={40} />
            <h3 className="text-lg font-bold text-gray-900">No projects yet</h3>
            <p className="text-gray-500 mt-2 mb-6">Create your first project to start tracking tasks.</p>
            {!isDeveloper && (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="text-indigo-600 font-bold hover:underline"
              >
                Create Project →
              </button>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl p-8 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Users size={20} className="text-indigo-600" />
          Team Members
        </h3>
        <DataTable 
          columns={[
            { header: 'Member', accessor: 'name', cell: (row) => (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-700 font-black text-sm uppercase">
                  {row.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{row.name}</p>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none mt-1">{row.email}</p>
                </div>
              </div>
            )},
            { header: 'Email Address', accessor: 'email', cell: (row) => (
              <span className="text-sm font-medium text-gray-500">{row.email}</span>
            )},
            { header: 'Access Level', accessor: 'role', cell: (row) => (
              <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${row.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                {row.role || 'Member'}
              </span>
            )},
            { header: 'Joined Date', accessor: 'createdAt', cell: (row) => (
              <span className="text-xs font-bold text-gray-400 italic">
                {new Date(row.createdAt).toLocaleDateString()}
              </span>
            )}
          ]}
          data={workspace.members}
          emptyMessage="No members in this workspace yet."
        />
      </div>

      {isModalOpen && (
        <CreateProjectModal 
          workspaceId={id}
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            setIsModalOpen(false);
            fetchWorkspaceData();
          }} 
        />
      )}

      {isMeetingModalOpen && (
        <CreateMeetingModal
          onClose={() => setIsMeetingModalOpen(false)}
          defaultWorkspaceId={id}
          onSuccess={() => {
            setIsMeetingModalOpen(false);
          }}
        />
      )}
    </Layout>
  );
};

export default WorkspacePage;
