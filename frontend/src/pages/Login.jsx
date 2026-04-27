import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User as UserIcon, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    let result;
    if (isRegister) {
      result = await register(name, email, password, phone);
    } else {
      result = await login(email, password);
    }
    
    setIsLoading(false);
    
    if (result.success) {
      toast.success(isRegister ? 'Registration successful!' : 'Successfully logged in');
      const userRole = result.role || 'customer';
      if (userRole === 'admin') navigate('/admin');
      else if (userRole === 'staff') navigate('/staff');
      else navigate('/');
    } else {
      toast.error(result.message || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Visual side */}
      <div className="hidden lg:flex w-1/2 bg-blue-600 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-blue-900/40" />
        <div className="relative z-10 text-center text-white px-12">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-lg mb-8 ring-1 ring-white/20">
            <span className="text-white font-bold text-4xl">S</span>
          </div>
          <h1 className="text-5xl font-bold mb-6 tracking-tight">Spice Hub</h1>
          <p className="text-xl text-blue-100 max-w-lg mx-auto leading-relaxed">
            The complete reservation and table management system for premium dining experiences.
          </p>
        </div>
      </div>

      {/* Form side */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12">
        {/* Navigation Link for Customers to Return Home */}
        <div className="w-full max-w-md flex justify-end mb-4">
          <Link to="/" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            &larr; Back to Home
          </Link>
        </div>
        
        <div className="w-full max-w-md animate-fade-in">
          <div className="text-center mb-10">
            <div className="lg:hidden inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg mb-6">
              <span className="font-bold text-3xl">S</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              {isRegister ? 'Create an account' : 'Welcome back'}
            </h2>
            <p className="mt-3 text-slate-500">
              {isRegister ? 'Sign up to start booking tables' : 'Sign in to your account to continue'}
            </p>
          </div>

          <div className="card p-8 shadow-xl border border-slate-100">
             <form onSubmit={handleSubmit} className="space-y-5">
              
              {isRegister && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <UserIcon className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-field pl-10"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email address</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-10"
                    placeholder="admin@restaurant.com"
                  />
                </div>
              </div>

              {isRegister && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Phone className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="input-field pl-10"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-10"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {!isRegister && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">
                      Remember me
                    </label>
                  </div>
                  <button type="button" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-3 text-base flex justify-center shadow-md hover:shadow-lg transition-all"
              >
                {isLoading ? (
                  <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  isRegister ? 'Sign Up' : 'Sign In'
                )}
              </button>
            </form>
          </div>
          
          <div className="mt-8 text-center text-sm font-medium text-slate-600">
            {isRegister ? "Already have an account? " : "Don't have an account? "}
            <button 
              onClick={() => setIsRegister(!isRegister)}
              className="text-blue-600 hover:text-blue-500 underline underline-offset-4"
            >
              {isRegister ? 'Sign in here' : 'Register here'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}