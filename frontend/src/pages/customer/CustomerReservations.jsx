import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Calendar, Clock, Users, XCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CustomerReservations() {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMyReservations();
  }, []);

  const fetchMyReservations = async () => {
    try {
      setIsLoading(true);
      const res = await API.get('/reservations/my');
      setReservations(res.data);
    } catch (error) {
      toast.error('Failed to load your reservations');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      try {
        await API.put(`/reservations/${id}/cancel`);
        toast.success('Reservation cancelled');
        fetchMyReservations();
      } catch (error) {
        toast.error('Failed to cancel reservation');
        console.error(error);
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold bg-emerald-100 text-emerald-800"><CheckCircle className="h-3.5 w-3.5" /> Confirmed</span>;
      case 'pending':
        return <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold bg-amber-100 text-amber-800"><Clock className="h-3.5 w-3.5" /> Pending</span>;
      case 'completed':
        return <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold bg-blue-100 text-blue-800"><CheckCircle className="h-3.5 w-3.5" /> Completed</span>;
      case 'cancelled':
        return <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold bg-red-100 text-red-800"><XCircle className="h-3.5 w-3.5" /> Cancelled</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-800">{status}</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">My Reservations</h1>
        <p className="text-slate-500 mt-2 text-lg">View and manage your upcoming and past dining experiences.</p>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center text-slate-500 text-lg">Loading your reservations...</div>
      ) : reservations.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
          <Calendar className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">No reservations found</h2>
          <p className="text-slate-500 mb-6">You haven't made any reservations yet.</p>
          <a href="/" className="btn-primary">Book a Table Now</a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservations.map(res => (
            <div key={res._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              <div className="p-5 border-b border-slate-100">
                <div className="flex justify-between items-start mb-4">
                  {getStatusBadge(res.status)}
                  <span className="text-sm font-medium text-slate-500">#{res._id.substring(res._id.length - 6).toUpperCase()}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{res.customerName}'s Party</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">{res.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">{res.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">{res.guests} Guests</span>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-slate-50 mt-auto flex justify-between items-center">
                <div className="text-sm text-slate-500">
                  {res.table?.tableNumber ? `Table ${res.table.tableNumber}` : 'Table Pending'}
                </div>
                {(res.status === 'pending' || res.status === 'confirmed') && (
                  <button 
                    onClick={() => handleCancel(res._id)}
                    className="text-sm font-bold text-red-600 hover:text-red-700 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
