import { Outlet } from 'react-router-dom';
import CustomerNavbar from '../components/layout/CustomerNavbar';

export default function CustomerLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      <CustomerNavbar />
      <main className="flex-1 w-full bg-slate-50 animate-fade-in relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000" />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <Outlet />
        </div>
      </main>
      
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-sm text-slate-500">&copy; {new Date().getFullYear()} Spice Hub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
