import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Search, Plus, MoreVertical, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReservationManagement() {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setIsLoading(true);
      const res = await API.get('/reservations');
      setReservations(res.data);
    } catch (error) {
      toast.error('Failed to load reservations');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      await API.put(`/reservations/${id}/${action}`);
      toast.success(`Reservation ${action}ed`);
      fetchReservations();
    } catch (error) {
      toast.error(`Failed to ${action} reservation`);
      console.error(error);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
      case 'pending': return 'bg-amber-50 text-amber-700 ring-amber-200';
      case 'completed': return 'bg-blue-50 text-blue-700 ring-blue-200';
      case 'cancelled': return 'bg-red-50 text-red-700 ring-red-200';
      default: return 'bg-slate-50 text-slate-700 ring-slate-200';
    }
  };

  const filteredReservations = reservations.filter(r => {
    const matchesSearch = r.customerName.toLowerCase().includes(search.toLowerCase()) || 
                          (r.phone && r.phone.includes(search));
    const matchesDate = dateFilter ? r.date === dateFilter : true;
    return matchesSearch && matchesDate;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reservations</h1>
          <p className="text-sm text-slate-500 mt-1">Manage upcoming bookings and guest requests.</p>
        </div>
        <button className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add Reservation
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50/50">
          <div className="relative max-w-sm w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search by name or phone..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10 bg-white" 
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
             <input 
               type="date" 
               value={dateFilter}
               onChange={(e) => setDateFilter(e.target.value)}
               className="input-field py-1.5 w-full sm:w-auto bg-white" 
             />
             {dateFilter && (
               <button onClick={() => setDateFilter('')} className="text-sm text-slate-500 hover:text-slate-700 px-2">Clear</button>
             )}
          </div>
        </div>
        
        <div className="overflow-x-auto relative min-h-[200px]">
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
              <div className="text-slate-500 font-medium">Loading...</div>
            </div>
          )}
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="py-3.5 pl-6 pr-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Guest</th>
                <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date & Time</th>
                <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Party Size</th>
                <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Table</th>
                <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="relative py-3.5 pl-3 pr-6"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredReservations.map((res) => (
                <tr key={res._id} className="hover:bg-slate-50 transition-colors">
                  <td className="whitespace-nowrap py-4 pl-6 pr-3">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold uppercase">
                        {res.customerName ? res.customerName.charAt(0) : '?'}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900">{res.customerName}</div>
                        <div className="text-sm text-slate-500">{res.phone || 'No phone'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                    <div className="text-slate-900 font-medium">{res.date}</div>
                    <div>{res.time}</div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                    {res.guests} Guests
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                    {res.table?.tableNumber || <span className="text-slate-400 italic">Unassigned</span>}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getStatusColor(res.status)} capitalize`}>
                      {res.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium">
                    <div className="flex justify-end gap-3 text-slate-400">
                      {res.status === 'pending' && (
                        <button onClick={() => handleAction(res._id, 'confirm')} className="text-emerald-500 hover:text-emerald-700 transition-colors" title="Confirm">
                          <CheckCircle className="h-5 w-5" />
                        </button>
                      )}
                      {(res.status === 'pending' || res.status === 'confirmed') && (
                        <button onClick={() => handleAction(res._id, 'cancel')} className="text-red-400 hover:text-red-600 transition-colors" title="Cancel">
                          <XCircle className="h-5 w-5" />
                        </button>
                      )}
                      {res.status === 'confirmed' && (
                        <button onClick={() => handleAction(res._id, 'complete')} className="text-blue-500 hover:text-blue-700 transition-colors" title="Mark Completed">
                          <CheckCircle className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {!isLoading && filteredReservations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500 text-sm">No reservations found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
