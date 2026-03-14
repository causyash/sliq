import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { 
  Briefcase, Kanban, CheckCircle2, Clock, AlertCircle, 
  TrendingUp, Activity, Filter, ChevronDown 
} from 'lucide-react';
import { workspaceAPI, analyticsAPI } from '../services/api';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';

const AnalyticsPage = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const { data } = await workspaceAPI.getAll();
        setWorkspaces(data);
        if (data.length > 0) {
          setSelectedWorkspace(data[0]);
        }
      } catch (err) {
        console.error('Failed to fetch workspaces', err);
      }
    };
    fetchWorkspaces();
  }, []);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!selectedWorkspace) return;
      setLoading(true);
      try {
        const { data } = await analyticsAPI.getWorkspace(selectedWorkspace._id);
        setData(data);
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [selectedWorkspace]);

  const COLORS = ['#6366f1', '#f59e0b', '#ec4899', '#10b981'];
  const PRIORITY_COLORS = {
    low: '#3b82f6',
    medium: '#f59e0b',
    high: '#ef4444',
    urgent: '#7c3aed'
  };

  if (!selectedWorkspace && !loading) return (
    <Layout>
      <div className="flex items-center justify-center p-20 bg-white rounded-3xl border border-gray-100 italic text-gray-400">
        No workspaces found. Create one to see analytics.
      </div>
    </Layout>
  );

  const statusData = data ? [
    { name: 'To Do', value: data.statusDistribution.todo },
    { name: 'In Progress', value: data.statusDistribution.in_progress },
    { name: 'Review', value: data.statusDistribution.review },
    { name: 'Done', value: data.statusDistribution.done },
  ] : [];

  const priorityData = data ? [
    { name: 'Low', count: data.priorityBreakdown.low, fill: PRIORITY_COLORS.low },
    { name: 'Medium', count: data.priorityBreakdown.medium, fill: PRIORITY_COLORS.medium },
    { name: 'High', count: data.priorityBreakdown.high, fill: PRIORITY_COLORS.high },
    { name: 'Urgent', count: data.priorityBreakdown.urgent, fill: PRIORITY_COLORS.urgent },
  ] : [];

  return (
    <Layout>
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Analytics Dashboard</h1>
          <p className="text-gray-500 font-medium">Real-time insights for {selectedWorkspace?.name}</p>
        </div>

        <div className="relative group">
          <select 
            value={selectedWorkspace?._id}
            onChange={(e) => setSelectedWorkspace(workspaces.find(w => w._id === e.target.value))}
            className="appearance-none bg-white border border-gray-200 px-6 py-3 pr-12 rounded-2xl font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all cursor-pointer shadow-sm shadow-gray-100 hover:shadow-md"
          >
            {workspaces.map(w => (
              <option key={w._id} value={w._id}>{w.name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-3xl" />)}
        </div>
      ) : data && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm shadow-gray-100/50">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4 transition-transform hover:scale-110">
                <Briefcase size={24} />
              </div>
              <div className="text-3xl font-black text-gray-900">{data.totalProjects}</div>
              <div className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1">Total Projects</div>
            </motion.div>

            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.1}} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm shadow-gray-100/50">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 transition-transform hover:scale-110">
                <Kanban size={24} />
              </div>
              <div className="text-3xl font-black text-gray-900">{data.totalTasks}</div>
              <div className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1">Total Tasks</div>
            </motion.div>

            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.2}} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm shadow-gray-100/50">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 transition-transform hover:scale-110">
                <CheckCircle2 size={24} />
              </div>
              <div className="text-3xl font-black text-gray-900">{data.completedTasks}</div>
              <div className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1">Completed</div>
            </motion.div>

            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.3}} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm shadow-gray-100/50">
              <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-4 transition-transform hover:scale-110">
                <AlertCircle size={24} />
              </div>
              <div className="text-3xl font-black text-gray-900">{data.overdueTasks}</div>
              <div className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1">Overdue Tasks</div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            {/* Status Chart */}
            <motion.div initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <h3 className="text-lg font-black text-gray-900 mb-8 flex items-center gap-3">
                <Activity size={20} className="text-indigo-600" />
                Task Status Distribution
              </h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                      itemStyle={{ fontWeight: '800', fontSize: '12px' }}
                    />
                    <Legend iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Priority Chart */}
            <motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <h3 className="text-lg font-black text-gray-900 mb-8 flex items-center gap-3">
                <TrendingUp size={20} className="text-indigo-600" />
                Priority Breakdown
              </h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priorityData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#9ca3af', fontWeight: 'bold', fontSize: '10px'}}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#9ca3af', fontWeight: 'bold', fontSize: '10px'}}
                    />
                    <Tooltip 
                      cursor={{fill: '#f9fafb'}}
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Productivity Chart placeholder or more stats */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm mb-12">
            <h3 className="text-lg font-black text-gray-900 mb-8 flex items-center gap-3">
              <TrendingUp size={20} className="text-indigo-600" />
              Progress Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Completion Rate</span>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-gray-100 h-3 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full transition-all duration-1000" 
                      style={{ width: `${data.totalTasks ? (data.completedTasks / data.totalTasks) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-xl font-black text-gray-900">
                    {data.totalTasks ? Math.round((data.completedTasks / data.totalTasks) * 100) : 0}%
                  </span>
                </div>
              </div>
              {/* Add more metrics if needed */}
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default AnalyticsPage;
