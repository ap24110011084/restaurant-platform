import React, { useState, useEffect } from 'react';
import { Users, Calendar, TrendingUp, DollarSign } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import API from '../../api/axios';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [timeframe, setTimeframe] = useState('Week');
  const [statsData, setStatsData] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock revenue chart data since backend doesn't provide chart time-series yet
  const chartData = [
    { name: 'Mon', total: 4000 },
    { name: 'Tue', total: 3000 },
    { name: 'Wed', total: 2000 },
    { name: 'Thu', total: 2780 },
    { name: 'Fri', total: 1890 },
    { name: 'Sat', total: 2390 },
    { name: 'Sun', total: 3490 },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [statsRes, resRes] = await Promise.all([
        API.get('/dashboard/stats'),
        API.get('/reservations?limit=4')
      ]);
      setStatsData(statsRes.data);
      setReservations(resRes.data.slice(0, 4));
    } catch (error) {
      toast.error('Failed to load dashboard statistics');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !statsData) {
    return <div className="flex h-64 items-center justify-center">Loading...</div>;
  }

  const stats = [
    { name: 'Total Users', value: statsData.totalUsers, icon: Users, trend: '+12.5%', isPositive: true },
    { name: 'Reservations', value: statsData.totalReservations, icon: Calendar, trend: '+5.2%', isPositive: true },
    { name: 'Occupied Tables', value: statsData.occupiedTables, icon: Users, trend: '-2.1%', isPositive: false },
    { name: 'Table Occupancy', value: `${statsData.tableOccupancyRate}%`, icon: TrendingUp, trend: '+4.6%', isPositive: true },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 mt-1">Here's what's happening at your restaurant today.</p>
        </div>
        <div className="flex bg-white rounded-lg p-1 shadow-sm border border-slate-200">
          {['Day', 'Week', 'Month'].map(t => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                timeframe === t ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card p-6 flex flex-col hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <span className={`text-sm font-medium ${stat.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                  {stat.trend}
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-slate-500 text-sm font-medium">{stat.name}</h3>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="card p-6 xl:col-span-2">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Revenue Growth</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Reservations */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900">Upcoming Reservations</h3>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View All</button>
          </div>
          <div className="space-y-4">
            {reservations.map((res) => (
              <div key={res._id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
                    {res.customerName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{res.customerName}</p>
                    <p className="text-xs text-slate-500">{res.time} • {res.guests} guests</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    res.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' :
                    res.status === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {res.status}
                  </span>
                  <p className="text-xs text-slate-500 mt-1 font-medium">{res.table?.tableNumber ? `Table ${res.table.tableNumber}` : 'Pending'}</p>
                </div>
              </div>
            ))}
            {reservations.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">No upcoming reservations</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
