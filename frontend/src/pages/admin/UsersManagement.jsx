import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Search, Plus, UserX, Shield, Briefcase, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { user: currentUser } = useAuth(); // to prevent self-deletion

  useEffect(() => {
    fetchUsers();
  }, [search]); // re-fetch if search changes, or better filter locally. Let's filter locally for responsiveness, or use API search. Local is fine for now.

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await API.get(`/users${search ? `?search=${search}` : ''}`);
      setUsers(res.data);
    } catch (error) {
      toast.error('Failed to load users');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (id === currentUser?._id) {
      toast.error("You cannot delete your own account");
      return;
    }
    
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await API.delete(`/users/${id}`);
        setUsers(users.filter(u => u._id !== id));
        toast.success('User removed from system');
      } catch (error) {
        toast.error('Failed to delete user');
        console.error(error);
      }
    }
  };

  const handleRoleChange = async (id, newRole) => {
    if (id === currentUser?._id) {
      toast.error("You cannot change your own role");
      return;
    }

    try {
      await API.put(`/users/${id}/role`, { role: newRole });
      setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
      toast.success(`Role updated to ${newRole}`);
    } catch (error) {
      toast.error('Failed to update role');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage staff access and customer accounts.</p>
        </div>
        <button className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Invite User
        </button>
      </div>

      <div className="card">
        <div className="p-4 border-b border-slate-200">
          <div className="relative max-w-sm w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search users by name or email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10" 
            />
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
                <th scope="col" className="py-3.5 pl-6 pr-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">User Details</th>
                <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="relative py-3.5 pl-3 pr-6"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {users.map((userObj) => (
                <tr key={userObj._id} className="hover:bg-slate-50 transition-colors">
                  <td className="whitespace-nowrap py-4 pl-6 pr-3 flex items-center gap-4">
                    <img src={userObj.avatar || `https://ui-avatars.com/api/?name=${userObj.name}&background=random`} alt="" className="h-10 w-10 rounded-full ring-2 ring-slate-100" />
                    <div>
                      <div className="font-medium text-slate-900">{userObj.name}</div>
                      <div className="text-sm text-slate-500 flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {userObj.email}
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset capitalize
                        ${userObj.role === 'admin' ? 'bg-purple-50 text-purple-700 ring-purple-200' :
                          userObj.role === 'staff' ? 'bg-blue-50 text-blue-700 ring-blue-200' :
                          'bg-slate-50 text-slate-700 ring-slate-200'
                        }
                      `}>
                        {userObj.role === 'admin' ? <Shield className="h-3 w-3" /> : userObj.role === 'staff' ? <Briefcase className="h-3 w-3" /> : null}
                        {userObj.role}
                      </span>
                      {currentUser?._id !== userObj._id && (
                        <select 
                          value={userObj.role}
                          onChange={(e) => handleRoleChange(userObj._id, e.target.value)}
                          className="bg-transparent border-none text-xs text-slate-500 hover:text-slate-700 cursor-pointer outline-none ring-0 w-5"
                          title="Change Role"
                        >
                          <option value="customer">Customer</option>
                          <option value="staff">Staff</option>
                          <option value="admin">Admin</option>
                        </select>
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-800">
                      Active
                    </span>
                  </td>
                  <td className="whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium">
                    {currentUser?._id !== userObj._id && (
                      <button 
                        onClick={() => handleDelete(userObj._id)}
                        className="text-slate-400 hover:text-red-600 transition-colors"
                        title="Deactivate User"
                      >
                        <UserX className="h-5 w-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {!isLoading && users.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-12 text-slate-500 font-medium border-0">
                    No users found matching "{search}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
