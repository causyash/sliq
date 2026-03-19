import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  Tag, 
  User,
  Layout as LayoutIcon,
  Filter,
  Video
} from 'lucide-react';
import { taskAPI, meetingAPI } from '../services/api';
import Layout from '../components/Layout';
import TaskModal from '../components/TaskModal';
import CreateMeetingModal from '../components/CreateMeetingModal';
import { motion, AnimatePresence } from 'framer-motion';

const CalendarPage = () => {
  const [tasks, setTasks] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState(null);
  const [view, setView] = useState('month'); // 'month' or 'week'
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [{ data: tasksData }, { data: meetingsData }] = await Promise.all([
        taskAPI.getAll(),
        meetingAPI.getAll()
      ]);
      setTasks(tasksData);
      setMeetings(meetingsData);
    } catch (err) {
      console.error('Failed to fetch tasks for calendar', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const renderMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const numDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);
    const days = [];

    // Empty slots for previous month
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-32 bg-gray-50/30 border border-gray-100 rounded-2xl opacity-40"></div>);
    }

    // Days of current month
    for (let d = 1; d <= numDays; d++) {
      const dayDate = new Date(year, month, d);
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      
      const dayTasks = tasks.filter(t => t.dueDate && t.dueDate.split('T')[0] === dateStr);
      const dayMeetings = meetings.filter(m => {
        const mDate = new Date(m.date);
        return mDate.getUTCFullYear() === year && 
               mDate.getUTCMonth() === month && 
               mDate.getUTCDate() === d;
      });

      const isToday = new Date().toDateString() === dayDate.toDateString();

      days.push(
        <div key={d} className={`h-32 p-3 border border-gray-100 rounded-3xl transition-all hover:shadow-xl hover:shadow-indigo-50/50 group bg-white ${isToday ? 'ring-2 ring-indigo-500 ring-inset' : ''}`}>
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm font-black ${isToday ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-900'}`}>
              {d}
            </span>
          </div>
          <div className="space-y-1 overflow-y-auto max-h-20 custom-scrollbar pr-1">
            {dayMeetings.map(meeting => (
              <button 
                key={meeting._id}
                onClick={() => navigate(`/meeting/${meeting.roomId}`)}
                className="w-full text-left px-2 py-1 rounded-lg text-[10px] font-black truncate transition-all active:scale-95 bg-indigo-600 text-white border border-indigo-700 flex items-center gap-1 shadow-sm"
                title={`Meeting: ${meeting.title} at ${meeting.time}`}
              >
                <Video size={10} />
                {meeting.time} {meeting.title}
              </button>
            ))}
            {dayTasks.map(task => (
              <button 
                key={task._id}
                onClick={() => setSelectedTask(task)}
                className={`w-full text-left px-2 py-1 rounded-lg text-[10px] font-bold truncate transition-all active:scale-95 ${
                  task.priority === 'urgent' ? 'bg-red-50 text-red-600 border border-red-100' :
                  task.priority === 'high' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                  task.priority === 'medium' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                  'bg-blue-50 text-blue-600 border border-blue-100'
                }`}
                title={task.title}
              >
                {task.title}
              </button>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <Layout>
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <CalendarIcon className="text-indigo-600" size={32} />
            Schedule
          </h1>
          <p className="text-gray-500 font-medium">Manage your deadlines and milestones.</p>
        </div>

        <div className="flex items-center gap-4">
          <button 
             onClick={() => { setSelectedDate(new Date()); setIsMeetingModalOpen(true); }}
             className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
             <Video size={18} /> 
             Schedule 
          </button>
          <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
             <button 
               onClick={prevMonth}
               className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 hover:text-gray-900 transition-all"
             >
               <ChevronLeft size={20} />
             </button>
           <h2 className="text-sm font-black text-gray-900 min-w-[120px] text-center">
             {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
           </h2>
           <button 
             onClick={nextMonth}
             className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 hover:text-gray-900 transition-all"
           >
             <ChevronRight size={20} />
           </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm shadow-indigo-100/20">
        <div className="grid grid-cols-7 gap-4 mb-6">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-4">
          {loading ? (
            Array(35).fill(0).map((_, i) => (
              <div key={i} className="h-32 bg-gray-50 animate-pulse rounded-3xl"></div>
            ))
          ) : renderMonthDays()}
        </div>
      </div>

      {selectedTask && (
        <TaskModal 
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={() => {
            fetchData();
          }}
          onDelete={() => {
            setSelectedTask(null);
            fetchData();
          }}
        />
      )}

      {isMeetingModalOpen && (
        <CreateMeetingModal
          initialDate={selectedDate}
          onClose={() => setIsMeetingModalOpen(false)}
          onSuccess={() => {
            setIsMeetingModalOpen(false);
            // Optionally could navigate to /meetings here or show toast
          }}
        />
      )}
    </Layout>
  );
};

export default CalendarPage;
