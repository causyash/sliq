import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Calendar, Clock, Users, Briefcase, Layout as LayoutIcon } from 'lucide-react';
import { meetingAPI } from '../services/api';
import Layout from '../components/Layout';

const MeetingsPage = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const { data } = await meetingAPI.getAll();
      setMeetings(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load meetings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const formatTime = (time) => {
    return time; // Using simple string HH:mm from input type="time"
  };

  if (loading) return (
    <Layout>
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <Video className="text-indigo-600" size={32} />
            Scheduled Meetings
          </h1>
          <p className="text-gray-500 font-medium">Join upcoming meetings and view past ones.</p>
        </div>
        <button 
          onClick={() => navigate('/calendar')}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          <Calendar size={20} />
          Schedule
        </button>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-xl border border-red-100">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {meetings.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-white border border-dashed border-gray-300 rounded-3xl">
            <Video className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No meetings scheduled</h3>
            <p className="text-gray-500">Go to the Calendar to schedule a new meeting.</p>
          </div>
        ) : (
          meetings.map((meeting) => (
            <div key={meeting._id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900 truncate">{meeting.title}</h3>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold tracking-wide">
                  Upcoming
                </span>
              </div>
              <p className="text-gray-500 text-sm mb-6 line-clamp-2 min-h-[40px]">
                {meeting.description || 'No description provided.'}
              </p>
              
              <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-2xl">
                <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                  <Calendar size={16} className="text-gray-400" />
                  {new Date(meeting.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                  <Clock size={16} className="text-gray-400" />
                  {formatTime(meeting.time)}
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                  <Users size={16} className="text-gray-400" />
                  Organizer: {meeting.organizer?.name || 'Unknown'}
                </div>
                {meeting.project && (
                  <div className="flex items-center gap-3 text-sm font-bold text-indigo-600">
                    <Briefcase size={16} />
                    Project: {meeting.project.name}
                  </div>
                )}
                {meeting.workspace && (
                  <div className="flex items-center gap-3 text-sm font-bold text-emerald-600">
                    <LayoutIcon size={16} />
                    Workspace: {meeting.workspace.name}
                  </div>
                )}
              </div>

              <button 
                onClick={() => navigate(`/meeting/${meeting.roomId}`)}
                className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition-all"
              >
                <Video size={18} />
                Join Meeting
              </button>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
};

export default MeetingsPage;
