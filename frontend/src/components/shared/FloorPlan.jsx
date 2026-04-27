import React from 'react';
import { Users } from 'lucide-react';

export default function FloorPlan({ tables, onTableClick }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-emerald-500 shadow-emerald-500/50';
      case 'occupied': return 'bg-red-500 shadow-red-500/50';
      case 'reserved': return 'bg-amber-500 shadow-amber-500/50';
      default: return 'bg-slate-400';
    }
  };

  return (
    <div className="relative w-full h-[600px] bg-slate-100 rounded-3xl border-2 border-slate-200 overflow-hidden shadow-inner p-8">
      {/* Floor Texture/Grid */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      {/* Sections Labels */}
      <div className="absolute top-4 left-8 text-xs font-bold text-slate-400 uppercase tracking-widest">Main Dining</div>
      <div className="absolute bottom-4 right-8 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Patio / Window Area</div>

      {tables.map(table => (
        <button
          key={table._id}
          onClick={() => onTableClick(table)}
          style={{ 
            left: `${table.x}%`, 
            top: `${table.y}%`,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          className={`
            absolute -translate-x-1/2 -translate-y-1/2
            w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex flex-col items-center justify-center
            ${table.status === 'available' ? 'bg-white border-2 border-emerald-500' : 'bg-white border-2 border-slate-200'}
            hover:scale-110 active:scale-95 shadow-xl transition-all cursor-pointer z-10
          `}
        >
          <div className={`absolute -top-2 -right-2 w-5 h-5 rounded-full border-2 border-white shadow-sm ${getStatusColor(table.status)}`} />
          <span className="text-xl font-bold text-slate-900 leading-none">{table.tableNumber}</span>
          <div className="flex items-center gap-0.5 mt-1 text-[10px] text-slate-400 font-bold uppercase">
            <Users className="h-2.5 w-2.5" />
            {table.capacity}
          </div>
        </button>
      ))}

      {/* Decorative elements */}
      <div className="absolute top-1/2 right-0 w-8 h-32 bg-slate-300 rounded-l-xl flex items-center justify-center [writing-mode:vertical-lr] text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Kitchen Pass</div>
      <div className="absolute top-0 left-1/2 w-48 h-8 bg-slate-300 rounded-b-xl flex items-center justify-center text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Entrance</div>
    </div>
  );
}
