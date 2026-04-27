import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Clock, UserPlus, Check, X, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function WaitlistManagement() {
  const [waitlist, setWaitlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    guests: '2',
    phone: '',
    quotedTime: '15-20 mins'
  });

  useEffect(() => {
    fetchWaitlist();
  }, []);

  const fetchWaitlist = async () => {
    try {
      setIsLoading(true);
      const res = await API.get('/waitlist');
      setWaitlist(res.data);
    } catch (error) {
      toast.error('Failed to load waitlist');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeat = async (id) => {
    try {
      await API.put(`/waitlist/${id}/promote`);
      toast.success('Party seated successfully!');
      fetchWaitlist();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to seat party');
    }
  };

  const handleCancel = async (id) => {
    try {
      await API.delete(`/waitlist/${id}`);
      toast('Party removed from waitlist', { icon: 'ℹ️' });
      fetchWaitlist();
    } catch (error) {
      toast.error('Failed to remove from waitlist');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await API.post('/waitlist', {
        ...formData,
        guests: parseInt(formData.guests)
      });
      toast.success('Added to waitlist');
      setIsModalOpen(false);
      setFormData({ name: '', guests: '2', phone: '', quotedTime: '15-20 mins' });
      fetchWaitlist();
    } catch (error) {
      toast.error('Failed to add to waitlist');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateWaitTime = (createdAt) => {
    if (!createdAt) return 'Just now';
    const diffMin = Math.floor((new Date() - new Date(createdAt)) / 60000);
    return diffMin <= 0 ? 'Just now' : `${diffMin} min ago`;
  };

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center">Loading waitlist...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Waitlist Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage walk-ins and quoted wait times.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add to Waitlist
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {waitlist.length === 0 ? (
            <div className="card p-12 flex flex-col items-center justify-center text-slate-500">
              <Clock className="h-12 w-12 text-slate-300 mb-4" />
              <p>Waitlist is currently empty.</p>
            </div>
          ) : (
            waitlist.map((party) => (
              <div key={party._id} className="card p-4 flex flex-col sm:flex-row gap-4 items-center justify-between border-l-4 border-l-amber-500 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="h-12 w-12 rounded-xl bg-slate-100 flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-xs text-slate-500 font-medium">Party</span>
                    <span className="text-lg font-bold text-slate-900 leading-none">{party.guests}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{party.name}</h3>
                    <div className="flex items-center gap-3 text-sm mt-1">
                      <span className="text-amber-600 font-medium flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> Quote: {party.quotedTime}
                      </span>
                      <span className="text-slate-400 border-l border-slate-300 pl-3">Joined: {calculateWaitTime(party.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t border-slate-100 sm:border-0">
                  {party.status === 'waiting' && (
                    <>
                      <button 
                        onClick={() => handleSeat(party._id)}
                        className="flex-1 sm:flex-none btn-primary bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Check className="h-4 w-4 mr-1.5" /> Seat
                      </button>
                      <button 
                        onClick={() => handleCancel(party._id)}
                        className="flex-1 sm:flex-none btn-secondary text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4 mr-1.5" /> Cancel
                      </button>
                    </>
                  )}
                  {party.status === 'seated' && (
                    <span className="inline-flex items-center rounded-md px-2.5 py-1 text-sm font-medium bg-slate-100 text-slate-600">
                      Seated
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="card p-6 h-max sticky top-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Waitlist Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-500 text-sm">Waiting Parties</span>
              <span className="text-lg font-bold text-slate-900">{waitlist.filter(w => w.status === 'waiting').length}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-500 text-sm">Total Guests Waiting</span>
              <span className="text-lg font-bold text-slate-900">
                {waitlist.filter(w => w.status === 'waiting').reduce((acc, curr) => acc + curr.guests, 0)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-500 text-sm">Avg Wait Time</span>
              <span className="text-lg font-bold text-slate-900">
                {waitlist.length > 0 ? '~15 min' : '0 min'}
              </span>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-200">
            <h4 className="text-sm font-medium text-slate-900 mb-3">Suggested Quote Times</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-50 p-2 text-center rounded text-sm">
                <span className="block text-slate-500 text-xs mb-1">1-2 Guests</span>
                <span className="font-semibold text-slate-900">15-20 min</span>
              </div>
              <div className="bg-slate-50 p-2 text-center rounded text-sm">
                <span className="block text-slate-500 text-xs mb-1">3-4 Guests</span>
                <span className="font-semibold text-slate-900">25-30 min</span>
              </div>
              <div className="bg-slate-50 p-2 text-center rounded text-sm">
                <span className="block text-slate-500 text-xs mb-1">5+ Guests</span>
                <span className="font-semibold text-slate-900">45+ min</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add to Waitlist Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative" onClick={e => e.stopPropagation()}>
            <div className="bg-slate-50 px-8 py-6 border-b border-slate-200 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Add to Waitlist</h3>
                <p className="text-sm text-slate-500 mt-1">New walk-in party</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-200 text-slate-400 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Guest Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="input-field" 
                  placeholder="e.g. John Smith"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Party Size</label>
                  <select 
                    value={formData.guests}
                    onChange={e => setFormData({...formData, guests: e.target.value})}
                    className="input-field"
                  >
                    {[1,2,3,4,5,6,7,8,9,10,12].map(n => (
                      <option key={n} value={n}>{n} Guests</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Quoted Wait</label>
                  <select 
                    value={formData.quotedTime}
                    onChange={e => setFormData({...formData, quotedTime: e.target.value})}
                    className="input-field"
                  >
                    <option value="5-10 mins">5-10 mins</option>
                    <option value="15-20 mins">15-20 mins</option>
                    <option value="30-45 mins">30-45 mins</option>
                    <option value="60+ mins">60+ mins</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number (Optional)</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="input-field" 
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full btn-primary h-12 text-base shadow-lg shadow-blue-600/20"
                >
                  {isSubmitting ? (
                    <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin mx-auto" />
                  ) : (
                    <>
                      <Plus className="h-5 w-5 mr-2" />
                      Add Party to List
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
