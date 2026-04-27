import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Grid, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TableManagement() {
  const [tables, setTables] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      setIsLoading(true);
      const res = await API.get('/tables');
      setTables(res.data);
    } catch (error) {
      toast.error('Failed to load tables');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTables = tables.filter(t => {
    const matchesFilter = filter === 'all' || t.status === filter;
    const matchesSearch = t.tableNumber.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleStatusChange = async (id, newStatus) => {
    try {
      if (newStatus === 'available') {
        await API.put(`/tables/${id}/free`);
      } else if (newStatus === 'occupied') {
        await API.put(`/tables/${id}/occupy`);
      } else {
        await API.put(`/tables/${id}`, { status: newStatus });
      }
      
      setTables(tables.map(t => t._id === id ? { ...t, status: newStatus } : t));
      toast.success(`Table status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update table status');
      console.error(error);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64 text-slate-500">Loading tables...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Table Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage dining areas and table availability.</p>
        </div>
        <button className="btn-primary">
          <Grid className="h-4 w-4 mr-2" />
          Edit Floor Plan
        </button>
      </div>

      <div className="card p-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search by table #..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-slate-400" />
            <select 
              value={filter} 
              onChange={e => setFilter(e.target.value)}
              className="input-field py-1.5"
            >
              <option value="all">All Statuses</option>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="reserved">Reserved</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {filteredTables.map(table => (
          <div 
            key={table._id} 
            className="group relative card flex flex-col p-4 hover:shadow-lg transition-all"
          >
            <div className={`absolute top-0 inset-x-0 h-1.5 rounded-t-xl 
              ${table.status === 'available' ? 'bg-emerald-500' :
                table.status === 'occupied' ? 'bg-red-500' : 'bg-amber-500'
              }`} 
            />
            
            <div className="flex justify-between items-start mt-2">
              <h3 className="text-xl font-bold text-slate-900">{table.tableNumber}</h3>
              <div className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                x{table.capacity}
              </div>
            </div>

            <p className="text-sm text-slate-500 capitalize mt-4">{table.section}</p>
            
            <div className="mt-4 pt-4 border-t border-slate-100">
               <select
                 value={table.status}
                 onChange={(e) => handleStatusChange(table._id, e.target.value)}
                 className={`w-full text-xs font-medium rounded-md px-2 py-1.5 border-0 ring-1 ring-inset outline-none appearance-none cursor-pointer
                   ${table.status === 'available' ? 'bg-emerald-50 text-emerald-700 ring-emerald-200 focus:ring-emerald-500' :
                     table.status === 'occupied' ? 'bg-red-50 text-red-700 ring-red-200 focus:ring-red-500' :
                     'bg-amber-50 text-amber-700 ring-amber-200 focus:ring-amber-500'
                   }
                 `}
               >
                 <option value="available">Available</option>
                 <option value="occupied">Occupied</option>
                 <option value="reserved">Reserved</option>
               </select>
            </div>
          </div>
        ))}
        {filteredTables.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">
            No tables found.
          </div>
        )}
      </div>
    </div>
  );
}
