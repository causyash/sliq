import React, { useState, useEffect } from 'react';
import { X, Send, User, Calendar, Tag, Trash2, Clock, CheckCircle2 } from 'lucide-react';
import { taskAPI, commentAPI } from '../services/api';
import socket from '../services/socket';

const TaskModal = ({ task, onClose, onUpdate, onDelete }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [subtasks, setSubtasks] = useState(task.subtasks || []);
  const [newSubtask, setNewSubtask] = useState('');
  const [loading, setLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const userData = JSON.parse(localStorage.getItem('userInfo') || '{}');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await commentAPI.getByTask(task._id);
        setComments(data);
      } catch (err) {
        console.error('Failed to load comments', err);
      }
    };
    fetchComments();

    socket.on('comment_added', ({ taskId, comment }) => {
      if (taskId === task._id) {
        setComments(prev => {
          // Avoid duplicate comments if the current user also emitted it (though usually server filters or client handles)
          if (prev.find(c => c._id === comment._id)) return prev;
          return [...prev, comment];
        });
      }
    });

    return () => {
      socket.off('comment_added');
    };
  }, [task._id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setCommentLoading(true);
    try {
      const { data } = await commentAPI.create({ taskId: task._id, message: newComment });
      setComments([...comments, data]);
      setNewComment('');
    } catch (err) {
      alert('Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleStatusChange = async (status) => {
    try {
      await taskAPI.update(task._id, { status });
      onUpdate();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleAddSubtask = async (e) => {
    e.preventDefault();
    if (!newSubtask.trim()) return;
    const updatedSubtasks = [...subtasks, { title: newSubtask, isCompleted: false }];
    try {
      setSubtasks(updatedSubtasks);
      await taskAPI.update(task._id, { subtasks: updatedSubtasks });
      setNewSubtask('');
      onUpdate();
    } catch (err) {
      alert('Failed to add subtask');
    }
  };

  const toggleSubtask = async (index) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[index].isCompleted = !updatedSubtasks[index].isCompleted;
    try {
      setSubtasks(updatedSubtasks);
      await taskAPI.update(task._id, { subtasks: updatedSubtasks });
      onUpdate();
    } catch (err) {
      alert('Failed to update subtask');
    }
  };

  const removeSubtask = async (index) => {
    const updatedSubtasks = subtasks.filter((_, i) => i !== index);
    try {
      setSubtasks(updatedSubtasks);
      await taskAPI.update(task._id, { subtasks: updatedSubtasks });
      onUpdate();
    } catch (err) {
      alert('Failed to remove subtask');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskAPI.delete(task._id);
        onDelete();
      } catch (err) {
        alert('Failed to delete task');
      }
    }
  };

  const priorityColors = {
    low: 'text-blue-600 bg-blue-50',
    medium: 'text-amber-600 bg-amber-50',
    high: 'text-orange-600 bg-orange-50',
    urgent: 'text-red-600 bg-red-50'
  };

  return (
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
            <span className="text-gray-400 font-bold text-xs uppercase tracking-widest flex items-center gap-1">
              <Clock size={14} />
              {task.status.replace('_', ' ')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {userData.role !== 'developer' && (
              <button 
                onClick={handleDelete}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
              >
                <Trash2 size={20} />
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-900 hover:bg-white rounded-xl transition-all"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto flex">
          {/* Main Content */}
          <div className="flex-[2] p-8 border-r border-gray-100">
            <h2 className="text-3xl font-black text-gray-900 mb-6">{task.title}</h2>
            
            <div className="space-y-8">
              <div className="space-y-3">
                <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">Description</h4>
                <div className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                  {task.description || 'No description provided.'}
                </div>
              </div>

              {/* Subtasks Section */}
              <div className="space-y-4 pt-4">
                <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center justify-between">
                  Checklist
                  <span className="text-[10px] lowercase font-bold text-indigo-600">
                    {subtasks.filter(s => s.isCompleted).length}/{subtasks.length} done
                  </span>
                </h4>
                
                <div className="space-y-2">
                  {subtasks.map((st, i) => (
                    <div key={i} className="flex items-center gap-3 group bg-gray-50/50 p-3 rounded-2xl hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200">
                      <button 
                        onClick={() => toggleSubtask(i)}
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${st.isCompleted ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300'}`}
                      >
                        {st.isCompleted && <CheckCircle2 size={12} className="text-white" />}
                      </button>
                      <span className={`text-sm flex-1 ${st.isCompleted ? 'text-gray-400 line-through font-medium' : 'text-gray-700 font-bold'}`}>
                        {st.title}
                      </span>
                      <button 
                        onClick={() => removeSubtask(i)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  
                  <form onSubmit={handleAddSubtask} className="flex gap-2 mt-2">
                    <input 
                      type="text"
                      value={newSubtask}
                      onChange={(e) => setNewSubtask(e.target.value)}
                      placeholder="Add an item..."
                      className="flex-1 px-4 py-2 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-xs"
                    />
                    <button className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-all">
                      <Plus size={16} />
                    </button>
                  </form>
                </div>
              </div>

              {/* Comments Section */}
              <div className="space-y-6 pt-8 border-t border-gray-50">
                <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  Discussion
                  <span className="bg-gray-100 text-gray-500 text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                    {comments.length}
                  </span>
                </h4>
                
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {comments.map((comment) => (
                    <div key={comment._id} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-black text-indigo-700 flex-shrink-0">
                        {comment.userId?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-gray-900">{comment.userId?.name}</span>
                          <span className="text-[10px] font-bold text-gray-400">
                            {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{comment.message}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleCommentSubmit} className="flex gap-3 pt-4">
                  <input 
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Wrtie a comment..."
                    className="flex-1 px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm"
                  />
                  <button 
                    disabled={commentLoading || !newComment.trim()}
                    className="p-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-100"
                  >
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Sidebar Properties */}
          <div className="flex-1 p-8 bg-gray-50/30">
            <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Properties</h4>
            
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Assignee</label>
                <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-gray-100">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                    {task.assignee?.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{task.assignee?.name || 'Unassigned'}</p>
                    <p className="text-[10px] text-gray-500">Project Member</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Due Date</label>
                <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-gray-100 text-gray-600">
                  <Calendar size={18} className="text-gray-400" />
                  <span className="text-sm font-bold">
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'No deadline'}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Project</label>
                <div className="text-sm font-bold text-indigo-600">{task.projectId?.name}</div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Quick Actions</label>
                <div className="space-y-3">
                  {/* Common Actions */}
                  {task.status === 'todo' && (
                    <button 
                      onClick={() => handleStatusChange('in_progress')}
                      className="w-full flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors"
                    >
                      <Clock size={14} />
                      Start Working
                    </button>
                  )}

                  {task.status === 'in_progress' && (
                    <button 
                      onClick={() => handleStatusChange('review')}
                      className="w-full flex items-center gap-2 px-4 py-3 bg-amber-50 text-amber-700 rounded-xl text-xs font-black hover:bg-amber-100 transition-colors border border-amber-200/50"
                    >
                      <Send size={14} />
                      Submit for Review
                    </button>
                  )}

                  {/* PM/Admin Approval Console */}
                  {(userData.role === 'admin' || userData.role === 'project_manager') && task.status === 'review' && (
                    <div className="space-y-2 p-4 bg-gray-50 rounded-[2rem] border border-gray-100 mt-4">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center mb-2">Review Management</p>
                      <button 
                        onClick={() => handleStatusChange('done')}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 text-white rounded-xl text-xs font-black hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100"
                      >
                        <CheckCircle2 size={14} />
                        Approve & Complete
                      </button>
                      <button 
                        onClick={() => handleStatusChange('in_progress')}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-red-600 border border-red-100 rounded-xl text-xs font-bold hover:bg-red-50 transition-all"
                      >
                        <X size={14} />
                        Reject (Needs Work)
                      </button>
                    </div>
                  )}

                  {/* Developer Perspective */}
                  {userData.role !== 'admin' && userData.role !== 'project_manager' && task.status === 'review' && (
                    <div className="p-6 bg-amber-50/50 border border-amber-100/50 rounded-3xl text-center space-y-2">
                       <Clock size={24} className="mx-auto text-amber-500 animate-pulse" />
                       <p className="text-xs font-black text-amber-700 uppercase tracking-tight">Under Review</p>
                       <p className="text-[10px] text-amber-600/70 font-medium">Waiting for Project Manager to verify and approve your work.</p>
                    </div>
                  )}
                  
                  {task.status === 'done' && (
                     <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-3xl text-center space-y-2">
                        <CheckCircle2 size={24} className="mx-auto text-emerald-500" />
                        <p className="text-xs font-black text-emerald-700 uppercase tracking-tight">Approved & Completed</p>
                     </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
