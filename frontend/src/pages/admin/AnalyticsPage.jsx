import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Download, Calendar as CalendarIcon, TrendingUp, Users, Clock, AlertTriangle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import API from '../../api/axios';

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const res = await API.get('/analytics');
      setData(res.data);
    } catch (error) {
      console.error('Failed to load analytics', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !data) {
    return <div className="flex h-64 items-center justify-center">Analyzing restaurant data...</div>;
  }

  const pieData = [
    { name: 'On-Time', value: 100 - data.noShowRate },
    { name: 'No-Show', value: data.noShowRate },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Spice Hub <span className="text-slate-400 font-normal">Analytics</span></h1>
          <p className="text-slate-500 mt-1">Detailed performance metrics and operational insights.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Last 7 Days
          </button>
          <button className="btn-primary shadow-lg shadow-blue-600/20">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6 border-l-4 border-l-blue-600">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-2xl">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Turnover Rate</p>
              <h4 className="text-2xl font-black text-slate-900">{data.turnoverRate}x</h4>
            </div>
          </div>
        </div>
        <div className="card p-6 border-l-4 border-l-emerald-600">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 rounded-2xl">
              <Users className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Guest Satisfaction</p>
              <h4 className="text-2xl font-black text-slate-900">94%</h4>
            </div>
          </div>
        </div>
        <div className="card p-6 border-l-4 border-l-amber-600">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-50 rounded-2xl">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Avg. Service</p>
              <h4 className="text-2xl font-black text-slate-900">42m</h4>
            </div>
          </div>
        </div>
        <div className="card p-6 border-l-4 border-l-red-600">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-50 rounded-2xl">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No-Show Rate</p>
              <h4 className="text-2xl font-black text-slate-900">{data.noShowRate}%</h4>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Weekly Revenue Trend
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenueByDay}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
                <Tooltip cursor={{stroke: '#3b82f6', strokeWidth: 2}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            Peak Dining Hours
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.peakHours}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="total" fill="#f59e0b" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Booking Integrity
          </h3>
          <div className="h-80 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center pb-8">
                <span className="block text-3xl font-black text-slate-900">{100 - data.noShowRate}%</span>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Completion</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <TrendingUp className="h-40 w-40" />
          </div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Spice Hub Insights</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Based on this week's trend, your busiest period is Saturday at 7:00 PM. We recommend staffing 2 extra servers during this window.
              </p>
            </div>
            <div className="mt-8">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Projected Revenue</p>
              <h2 className="text-5xl font-black text-white">${(data.totalRevenue * 1.15).toLocaleString(undefined, { maximumFractionDigits: 0 })}</h2>
              <p className="text-emerald-400 text-xs font-bold mt-2 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> +15% vs Last Week
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
