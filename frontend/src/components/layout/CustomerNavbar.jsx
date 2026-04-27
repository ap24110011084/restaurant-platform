import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, LogOut } from 'lucide-react';

export default function CustomerNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-xl font-bold text-slate-900">Spice Hub</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Book a Table</Link>
            <Link to="/customer/reservations" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">My Reservations</Link>
            
            <div className="h-6 w-px bg-slate-200" />
            
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/customer/profile" className="flex items-center gap-2 hover:bg-slate-50 p-1.5 rounded-lg transition-colors">
                  <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`} alt="Profile" className="h-8 w-8 rounded-full ring-2 ring-blue-100" />
                  <span className="text-sm font-medium text-slate-900 hidden sm:block">{user.name}</span>
                </Link>
                <button onClick={handleLogout} className="text-slate-400 hover:text-red-600 transition-colors" title="Logout">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
