import React, { useState, useEffect } from 'react';
import { Users, Clock, Grid, Map, List } from 'lucide-react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import FloorPlan from '../../components/shared/FloorPlan';
import POSModal from '../../components/shared/POSModal';
import { useNavigate } from 'react-router-dom';

export default function StaffDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    todayReservations: 0,
    pendingReservations: 0,
    confirmedReservations: 0,
    occupiedTables: 0,
    availableTables: 0,
    waitingCustomers: 0
  });
  const [tables, setTables] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedTable, setSelectedTable] = useState(null);
  const [isPOSOpen, setIsPOSOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      if (isLoading) setIsLoading(true);
      const [statsRes, tablesRes] = await Promise.all([
        API.get('/dashboard/stats'),
        API.get('/tables')
      ]);
      setStats(statsRes.data);
      setTables(tablesRes.data);
    } catch (error) {
      console.error('Failed to load dashboard data', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTableClick = (table) => {
    setSelectedTable(table);
    setIsPOSOpen(true);
  };

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center">Loading shift overview...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Spice Hub <span className="text-slate-400 font-normal">Shift Overview</span></h1>
          <p className="text-slate-500 mt-1">Manage today's service and operations in real-time.</p>
        </div>
        <div className="flex bg-white rounded-xl p-1 shadow-sm border border-slate-200">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              viewMode === 'grid' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Grid className="h-4 w-4" />
            Grid View
          </button>
          <button
            onClick={() => setViewMode('visual')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              viewMode === 'visual' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Map className="h-4 w-4" />
            Visual Layout
          </button>
        </div>
      </div>

      {/* Stats row... */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none shadow-xl relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
            <Grid className="h-32 w-32" />
          </div>
          <div className="relative z-10">
            <p className="text-blue-100 font-bold uppercase tracking-wider text-xs">Table Availability</p>
            <h3 className="text-5xl font-extrabold mt-3">{stats.availableTables} <span className="text-xl font-normal opacity-70">/ {tables.length}</span></h3>
            <div className="mt-8 flex gap-2">
              <button onClick={() => setViewMode('visual')} className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur pb-px py-2.5 rounded-xl text-sm font-bold transition-colors">Map View</button>
              <button onClick={() => navigate('/staff/tables')} className="flex-1 bg-white text-blue-700 hover:bg-slate-50 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-lg">Manage</button>
            </div>
          </div>
        </div>

        <div className="card p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 font-bold uppercase tracking-wider text-xs">Ready to Seat</p>
              <h3 className="text-4xl font-extrabold text-slate-900 mt-2">{stats.waitingCustomers}</h3>
            </div>
            <div className="p-3 bg-amber-50 rounded-2xl ring-1 ring-amber-100"><Clock className="h-7 w-7 text-amber-600" /></div>
          </div>
          <button onClick={() => navigate('/staff/waitlist')} className="w-full mt-6 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 py-3 rounded-xl text-sm font-bold transition-all">Manage Waitlist</button>
        </div>

        <div className="card p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 font-bold uppercase tracking-wider text-xs">Pending Requests</p>
              <h3 className="text-4xl font-extrabold text-slate-900 mt-2">{stats.pendingReservations}</h3>
            </div>
            <div className="p-3 bg-purple-50 rounded-2xl ring-1 ring-purple-100"><Users className="h-7 w-7 text-purple-600" /></div>
          </div>
          <button onClick={() => navigate('/staff/reservations')} className="w-full mt-6 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 py-3 rounded-xl text-sm font-bold transition-all">Review RSVP</button>
        </div>
      </div>

      {viewMode === 'visual' ? (
        <div className="animate-fade-in">
          <FloorPlan tables={tables} onTableClick={handleTableClick} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          <div className="lg:col-span-2 card p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><List className="h-5 w-5 text-blue-600" />Table Grid View</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {tables.map(t => (
                <button 
                  key={t._id} 
                  onClick={() => handleTableClick(t)}
                  className={`relative p-5 rounded-2xl border-2 flex flex-col items-center justify-center transition-all group scale-100 active:scale-95
                    ${t.status === 'available' ? 'bg-emerald-50 border-emerald-100 hover:border-emerald-500 hover:bg-white' :
                      t.status === 'occupied' ? 'bg-red-50 border-red-100 hover:border-red-500 hover:bg-white' : 'bg-amber-50 border-amber-100 hover:border-amber-500 hover:bg-white'
                    }`}
                >
                  <div className={`text-2xl font-black ${t.status === 'available' ? 'text-emerald-700' : t.status === 'occupied' ? 'text-red-700' : 'text-amber-700'}`}>{t.tableNumber}</div>
                  <div className={`text-[10px] mt-1 font-bold uppercase tracking-wider ${t.status === 'available' ? 'text-emerald-600' : t.status === 'occupied' ? 'text-red-600' : 'text-amber-600'}`}>{t.status}</div>
                </button>
              ))}
            </div>
          </div>
          <div className="card p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Staff Shortcuts</h3>
            <div className="space-y-3">
              <button onClick={() => navigate('/staff/reservations')} className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 transition-all border border-slate-100 group">
                <span className="font-bold">Check-in Guest</span>
                <Users className="h-5 w-5 text-slate-400 group-hover:rotate-12 transition-transform" />
              </button>
              <button onClick={() => navigate('/staff/waitlist')} className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 transition-all border border-slate-100 group">
                <span className="font-bold">Add Walk-in</span>
                <Clock className="h-5 w-5 text-slate-400 group-hover:rotate-12 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}

      {isPOSOpen && selectedTable && (
        <POSModal 
          table={selectedTable} 
          onClose={() => {setIsPOSOpen(false); setSelectedTable(null);}} 
          onUpdate={fetchDashboardData}
        />
      )}
    </div>
  );
}
