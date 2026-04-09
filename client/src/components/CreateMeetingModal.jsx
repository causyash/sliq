import React, { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, Clock, Type, AlignLeft, Briefcase, Layout as LayoutIcon } from 'lucide-react';
import { meetingAPI, projectAPI, workspaceAPI } from '../services/api';

const CreateMeetingModal = ({ onClose, onSuccess, initialDate, defaultProjectId, defaultWorkspaceId }) => {
  const formatDate = (date) => {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: initialDate ? formatDate(initialDate) : formatDate(new Date()),
    time: '12:00',
    project: defaultProjectId || '',
    workspace: defaultWorkspaceId || ''
  });
  
  const [projects, setProjects] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingOptions, setFetchingOptions] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [{ data: pData }, { data: wData }] = await Promise.all([
          projectAPI.adminGetAll(),
          workspaceAPI.getAll()
        ]);
        setProjects(pData);
        setWorkspaces(wData);
      } catch (err) {
        console.error('Failed to fetch projects/workspaces', err);
      } finally {
        setFetchingOptions(false);
      }
    };
    fetchOptions();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.title.trim()) {
      setError('Meeting title is required');
      return;
    }

    setLoading(true);
    try {
      // Basic sanitization: send null if empty strings
      const payload = {
        ...formData,
        project: formData.project || undefined,
        workspace: formData.workspace || undefined
      };
      await meetingAPI.create(payload);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to schedule meeting');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Schedule Meeting</h2>
            <p className="text-sm text-gray-500 font-medium">Create a new video conference room</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Meeting Title</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Type size={18} />
                </div>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-gray-900 placeholder-gray-400"
                  placeholder="e.g., Weekly Sync"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Description <span className="text-gray-400 font-normal">(Optional)</span></label>
              <div className="relative">
                <div className="absolute top-3 left-0 pl-4 text-gray-400">
                  <AlignLeft size={18} />
                </div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium text-gray-900 placeholder-gray-400 resize-none"
                  placeholder="Agenda and details..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Workspace <span className="text-gray-400 font-normal">(Optional)</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <LayoutIcon size={18} />
                  </div>
                  <select
                    name="workspace"
                    value={formData.workspace}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-gray-900 appearance-none"
                    disabled={fetchingOptions}
                  >
                    <option value="">Choose Workspace</option>
                    {workspaces.map(ws => (
                      <option key={ws._id} value={ws._id}>{ws.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Project <span className="text-gray-400 font-normal">(Optional)</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Briefcase size={18} />
                  </div>
                  <select
                    name="project"
                    value={formData.project}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-gray-900 appearance-none"
                    disabled={fetchingOptions}
                  >
                    <option value="">Choose Project</option>
                    {projects.map(p => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <CalendarIcon size={18} />
                  </div>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={formatDate(new Date())}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-gray-900"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Time</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Clock size={18} />
                  </div>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-gray-900"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Schedule Meeting'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMeetingModal;
