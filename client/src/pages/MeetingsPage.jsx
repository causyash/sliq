import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Calendar, Clock, Users, Briefcase, Layout as LayoutIcon, LayoutGrid, List } from 'lucide-react';
import { meetingAPI } from '../services/api';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';

const MeetingsPage = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState('grid'); // 'grid' or 'list'
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
        <div className="flex items-center gap-4">
          <div className="flex bg-white border border-gray-100 p-1.5 rounded-2xl shadow-sm">
            <button 
              onClick={() => setView('grid')}
              className={`p-2.5 rounded-xl transition-all ${view === 'grid' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <LayoutGrid size={20} />
            </button>
            <button 
              onClick={() => setView('list')}
              className={`p-2.5 rounded-xl transition-all ${view === 'list' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List size={20} />
            </button>
          </div>
          <button 
            onClick={() => navigate('/calendar')}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            <Calendar size={20} />
            Schedule
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-xl border border-red-100">
          {error}
        </div>
      )}

      {view === 'grid' ? (
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
      ) : (
        <DataTable 
          columns={[
            { header: 'Title', accessor: 'title', cell: (row) => (
              <div className="flex flex-col">
                <span className="font-bold text-gray-900">{row.title}</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Room: {row.roomId}</span>
              </div>
            )},
            { header: 'Date & Time', accessor: 'date', cell: (row) => (
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-700">{new Date(row.date).toLocaleDateString()}</span>
                <span className="text-xs font-medium text-gray-400">{row.time}</span>
              </div>
            )},
            { header: 'Host', accessor: 'organizer', cell: (row) => (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-center text-indigo-700 font-black text-xs">
                  {row.organizer?.name?.charAt(0)}
                </div>
                <span className="text-sm font-bold text-gray-600">{row.organizer?.name}</span>
              </div>
            )},
            { header: 'Context', accessor: 'project', cell: (row) => (
              <div className="flex flex-col gap-1">
                {row.project && <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md inline-block">Pro: {row.project.name}</span>}
                {row.workspace && <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md inline-block">Wk: {row.workspace.name}</span>}
              </div>
            )},
            { header: 'Action', accessor: 'roomId', cell: (row) => (
              <button 
                onClick={() => navigate(`/meeting/${row.roomId}`)}
                className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
              >
                Join
              </button>
            )}
          ]}
          data={meetings}
          emptyMessage="No upcoming meetings scheduled."
        />
      )}
    </Layout>
  );
};

export default MeetingsPage;
