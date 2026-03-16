import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FolderKanban, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Layout,
  Layers
} from 'lucide-react';
import { analyticsAPI } from '../services/api';
import LayoutComponent from '../components/Layout';
import { motion } from 'framer-motion';

const AdminAnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await analyticsAPI.getGlobal();
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch global analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return (
    <LayoutComponent>
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    </LayoutComponent>
  );

  if (!data) return (
    <LayoutComponent>
      <div className="text-center p-20 bg-white rounded-3xl border border-red-100">
        <p className="text-gray-500">Failed to load analytics data.</p>
      </div>
    </LayoutComponent>
  );

  const stats = [
    { label: 'Total Projects', value: data.totalProjects, icon: <FolderKanban />, color: 'bg-blue-500', bg: 'bg-blue-50' },
    { label: 'Platform Users', value: data.totalUsers, icon: <Users />, color: 'bg-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Total Tasks', value: data.totalTasks, icon: <Layout />, color: 'bg-indigo-500', bg: 'bg-indigo-50' },
    { label: 'Avg. Progress', value: `${data.averageProgress}%`, icon: <TrendingUp />, color: 'bg-amber-500', bg: 'bg-amber-50' },
  ];

  return (
    <LayoutComponent>
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Platform Analytics</h1>
        <p className="mt-2 text-gray-500">Global performance metrics and resource distribution.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label} 
            className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-indigo-50/20 transition-all group"
          >
            <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              {React.cloneElement(stat.icon, { className: `text-${stat.color.split('-')[1]}-600`, size: 28 })}
            </div>
            <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-4xl font-black text-gray-900">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Task Status Distribution */}
        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-10 flex items-center gap-3">
            <Layout className="text-indigo-600" />
            Task Status Distribution
          </h3>
          <div className="space-y-6">
            {Object.entries(data.statusDistribution).map(([status, count]) => {
              const percentage = data.totalTasks > 0 ? (count / data.totalTasks) * 100 : 0;
              const colors = {
                todo: 'bg-gray-200',
                in_progress: 'bg-blue-500',
                review: 'bg-amber-500',
                done: 'bg-emerald-500'
              };
              return (
                <div key={status} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-black text-gray-500 uppercase tracking-widest text-[10px]">{status.replace('_', ' ')}</span>
                    <span className="font-bold text-gray-900">{count} Tasks ({percentage.toFixed(0)}%)</span>
                  </div>
                  <div className="h-4 bg-gray-50 rounded-full overflow-hidden border border-gray-100 p-0.5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      className={`h-full ${colors[status]} rounded-full shadow-sm shadow-indigo-100`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Analysis */}
        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-10 flex items-center gap-3">
            <AlertCircle className="text-orange-600" />
            Priority Analysis
          </h3>
          <div className="grid grid-cols-2 gap-6">
            {Object.entries(data.priorityBreakdown).map(([priority, count]) => (
              <div key={priority} className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{priority}</p>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-black text-gray-900">{count}</span>
                  <span className="text-xs font-bold text-gray-400 mb-1.5">tasks</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-10 p-6 bg-indigo-600 rounded-[2rem] text-white flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Resource Efficiency</p>
              <h4 className="text-xl font-bold mt-1">Optimization Required</h4>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black">High</span>
              <p className="text-[10px] uppercase font-bold opacity-70">Priority</p>
            </div>
          </div>
        </div>
      </div>
    </LayoutComponent>
  );
};

export default AdminAnalyticsPage;
