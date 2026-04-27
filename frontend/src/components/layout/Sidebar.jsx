import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Clock, 
  PieChart, 
  Grid,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ open, setOpen }) {
  const { pathname } = useLocation();
  const { user } = useAuth();
  
  const adminLinks = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Reservations', href: '/admin/reservations', icon: Calendar },
    { name: 'Waitlist', href: '/admin/waitlist', icon: Clock },
    { name: 'Tables', href: '/admin/tables', icon: Grid },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Analytics', href: '/admin/analytics', icon: PieChart },
  ];

  const staffLinks = [
    { name: 'Dashboard', href: '/staff', icon: LayoutDashboard },
    { name: 'Reservations', href: '/staff/reservations', icon: Calendar },
    { name: 'Waitlist', href: '/staff/waitlist', icon: Clock },
    { name: 'Tables', href: '/staff/tables', icon: Grid },
  ];

  const links = user?.role === 'admin' ? adminLinks : staffLinks;

  return (
    <div className={`
      fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
      ${open ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="flex h-16 items-center justify-between px-6 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">Spice Hub</span>
        </div>
        <button 
          className="lg:hidden p-1 text-slate-400 hover:text-slate-600"
          onClick={() => setOpen(false)}
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3 mt-4">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/admin' && link.href !== '/staff');
            
            return (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setOpen(false)}
                className={`
                  group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }
                `}
              >
                <Icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-500'
                  }`}
                  aria-hidden="true"
                />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-slate-200 p-4">
        <Link 
          to={`/${user?.role}/settings`} 
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-50 transition-colors"
        >
          <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=random`} alt="Avatar" className="h-9 w-9 rounded-full ring-2 ring-white" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-900 truncate max-w-[120px]">{user?.name}</span>
            <span className="text-xs text-slate-500 capitalize">{user?.role}</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
