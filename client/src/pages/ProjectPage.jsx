import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  Settings, 
  Users, 
  Calendar, 
  Kanban,
  CheckCircle2,
  Clock,
  AlertCircle,
  BarChart3,
  Layout as LayoutIcon,
  Plus,
  Video
} from 'lucide-react';
import { projectAPI, taskAPI, activityAPI } from '../services/api';
import socket, { joinProject } from '../services/socket';
import Layout from '../components/Layout';
import KanbanBoard from '../components/KanbanBoard';
import TaskModal from '../components/TaskModal';
import CreateTaskModal from '../components/CreateTaskModal';
import CreateMeetingModal from '../components/CreateMeetingModal';
import ActivityTimeline from '../components/ActivityTimeline';

const ProjectPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState('kanban'); // 'overview' or 'kanban'
  const [selectedTask, setSelectedTask] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [initialStatus, setInitialStatus] = useState('todo');
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const isDeveloper = userInfo.role === 'developer';

  const fetchData = async () => {
    try {
      const [projectRes, tasksRes, activityRes] = await Promise.all([
        projectAPI.getById(id),
        taskAPI.getByProject(id),
        activityAPI.getByProject(id)
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
      setActivities(activityRes.data);
    } catch (err) {
      setError('Failed to load project details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    joinProject(id);

    socket.on('task_created', (newTask) => {
      setTasks(prev => [...prev, newTask]);
    });

    socket.on('task_updated', (updatedTask) => {
      setTasks(prev => prev.map(t => t._id === updatedTask._id ? updatedTask : t));
      if (selectedTask?._id === updatedTask._id) {
        setSelectedTask(updatedTask);
      }
    });

    socket.on('task_deleted', (deletedId) => {
      setTasks(prev => prev.filter(t => t._id !== deletedId));
      if (selectedTask?._id === deletedId) {
        setSelectedTask(null);
      }
    });

    socket.on('comment_added', ({ taskId, comment }) => {
      if (selectedTask?._id === taskId) {
        // Handled in TaskModal
      }
    });

    return () => {
      socket.off('task_created');
      socket.off('task_updated');
      socket.off('task_deleted');
      socket.off('comment_added');
    };
  }, [id, selectedTask?._id]);

  const handleTaskUpdate = async (taskId, updates) => {
    try {
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, ...updates } : t));
      await taskAPI.update(taskId, updates);
    } catch (err) {
      alert('Failed to update task');
      fetchData(); 
    }
  };

  const openCreateModal = (status = 'todo') => {
    setInitialStatus(status);
    setIsCreateModalOpen(true);
  };

  if (loading) return (
    <Layout>
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    </Layout>
  );

  if (error || !project) return (
    <Layout>
      <div className="text-center p-20 bg-white rounded-3xl border border-red-100">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
        <p className="text-gray-500 mb-6">{error || 'Project not found'}</p>
        <button onClick={() => navigate(-1)} className="text-indigo-600 font-bold">Go Back</button>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="mb-8">
        {JSON.parse(localStorage.getItem('userInfo') || '{}').role === 'admin' ? (
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-indigo-600 mb-6 transition-colors"
          >
            <ChevronLeft size={16} />
            Back to Admin Console
          </Link>
        ) : (
          <Link 
            to={`/workspaces/${project.workspaceId?._id}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-indigo-600 mb-6 transition-colors"
          >
            <ChevronLeft size={16} />
            Back to {project.workspaceId?.name || 'Workspace'}
          </Link>
        )}
        
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                <Kanban size={24} />
              </div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{project.name}</h1>
            </div>
            <p className="text-gray-500 max-w-2xl px-1">{project.description || 'No description provided for this project.'}</p>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => navigate(`/meeting/project-${id}`)}
              className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all shadow-sm"
            >
              <Video size={18} className="text-indigo-600" />
              Meet
            </button>
            <button 
              onClick={() => setIsMeetingModalOpen(true)}
              className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all shadow-sm"
            >
              <Calendar size={18} className="text-indigo-600" />
              Schedule 
            </button>
            {!isDeveloper && (
              <button 
                onClick={() => openCreateModal()}
                className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 mr-2"
              >
                <Plus size={20} />
                Add Task
              </button>
            )}
            {!isDeveloper && (
              <button className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-900 hover:border-gray-200 transition-all shadow-sm">
                <Settings size={20} />
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-6 mt-10 border-b border-gray-100">
          <button 
            onClick={() => setView('overview')}
            className={`pb-4 px-2 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${view === 'overview' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            <BarChart3 size={18} />
            Overview
          </button>
          <button 
            onClick={() => setView('kanban')}
            className={`pb-4 px-2 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${view === 'kanban' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            <LayoutIcon size={18} />
            Kanban Board
          </button>
        </div>
      </div>

      {view === 'overview' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Calendar size={20} className="text-indigo-600" />
                Project Timeline
              </h3>
              <div className="flex items-center gap-8">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Started On</span>
                  <span className="text-lg font-bold text-gray-900">
                    {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="w-px h-10 bg-gray-100"></div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Members</span>
                  <span className="text-lg font-bold text-gray-900">{project.members.length} People</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-gray-900">Task Overview</h3>
                <button 
                  onClick={() => setView('kanban')}
                  className="text-sm font-bold text-indigo-600 hover:underline"
                >
                  Go to Board
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100/50">
                  <div className="w-10 h-10 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-4">
                    <Clock size={20} />
                  </div>
                  <div className="text-2xl font-black text-gray-900">{tasks.filter(t => t.status !== 'done').length}</div>
                  <div className="text-sm font-bold text-gray-500">In Progress</div>
                </div>
                <div className="p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100/50">
                  <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-4">
                    <CheckCircle2 size={20} />
                  </div>
                  <div className="text-2xl font-black text-gray-900">{tasks.filter(t => t.status === 'done').length}</div>
                  <div className="text-sm font-bold text-gray-500">Completed</div>
                </div>
                <div className="p-6 bg-amber-50/50 rounded-3xl border border-amber-100/50">
                  <div className="w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 mb-4">
                    <AlertCircle size={20} />
                  </div>
                  <div className="text-2xl font-black text-gray-900">{tasks.filter(t => t.priority === 'urgent').length}</div>
                  <div className="text-sm font-bold text-gray-500">Urgent</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <Clock size={20} className="text-indigo-600" />
                Activity Timeline
              </h3>
              <ActivityTimeline activities={activities} />
            </div>

            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Users size={20} className="text-indigo-600" />
                Project Members
              </h3>
              <div className="space-y-4">
                {project.members.map((member) => (
                  <div key={member._id} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 font-bold border border-gray-200">
                      {member.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[150px]">{member.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8">
          <KanbanBoard 
            tasks={tasks} 
            onTaskUpdate={handleTaskUpdate} 
            onTaskClick={setSelectedTask}
            onAddTask={(status) => openCreateModal(status)}
          />
        </div>
      )}

      {selectedTask && (
        <TaskModal 
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={() => {
            setSelectedTask(null);
            fetchData();
          }}
          onDelete={() => {
            setSelectedTask(null);
            fetchData();
          }}
        />
      )}

      {isCreateModalOpen && (
        <CreateTaskModal 
          projectId={id}
          workspaceId={project.workspaceId?._id}
          initialStatus={initialStatus}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            setIsCreateModalOpen(false);
            fetchData();
          }}
        />
      )}

      {isMeetingModalOpen && (
        <CreateMeetingModal
          onClose={() => setIsMeetingModalOpen(false)}
          defaultProjectId={project._id}
          onSuccess={() => {
            setIsMeetingModalOpen(false);
            // Optionally navigate to meetings or show toast
          }}
        />
      )}
    </Layout>
  );
};

export default ProjectPage;
