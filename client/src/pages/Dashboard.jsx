import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, FolderKanban, ChevronRight } from 'lucide-react';
import { workspaceAPI } from '../services/api';
import Layout from '../components/Layout';
import WorkspaceCard from '../components/WorkspaceCard';
import CreateWorkspaceModal from '../components/CreateWorkspaceModal';

import AdminProjectList from '../components/AdminProjectList';

const Dashboard = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const isAdmin = user.role === 'admin';
  const isDeveloper = user.role === 'developer';

  const fetchWorkspaces = async () => {
    try {
      if (isAdmin) {
          // Admin data is handled in AdminProjectList component
          setLoading(false);
          return;
      }
      const { data } = await workspaceAPI.getAll();
      setWorkspaces(data);
    } catch (error) {
      console.error('Failed to fetch workspaces', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user._id) {
      navigate('/login');
      return;
    }
    fetchWorkspaces();
  }, [navigate]);

  return (
    <Layout>
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {isAdmin ? 'Admin Management Console' : 'Your Workspaces'}
          </h1>
          <p className="mt-2 text-gray-500">
            {isAdmin 
              ? 'Oversee all ongoing projects and workspaces across the platform.' 
              : 'Manage your teams and organized projects efficiently.'}
          </p>
        </div>
        {!isAdmin && !isDeveloper && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
          >
            <Plus size={20} />
            Create Workspace
          </button>
        )}
      </div>

      {isAdmin ? (
         <AdminProjectList />
      ) : (
        loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : workspaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map((workspace) => (
              <WorkspaceCard key={workspace._id} workspace={workspace} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-20 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No workspaces yet</h3>
            <p className="text-gray-500 mt-2 mb-8">Set up your first workspace to start collaborating with your team.</p>
            {!isDeveloper && (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="text-indigo-600 font-bold hover:underline"
              >
                Create your first workspace →
              </button>
            )}
          </div>
        )
      )}

      {isModalOpen && (
        <CreateWorkspaceModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            setIsModalOpen(false);
            fetchWorkspaces();
          }} 
        />
      )}
    </Layout>
  );
};

export default Dashboard;
