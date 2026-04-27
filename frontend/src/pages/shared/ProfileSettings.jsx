import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Camera, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfileSettings() {
  const { user, updateProfile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: user?.phone || '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    const res = await updateProfile({
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      phone: formData.phone,
      ...(formData.password ? { password: formData.password } : {})
    });

    setIsSaving(false);
    if (res.success) {
      toast.success('Profile settings updated successfully.');
      setFormData(prev => ({ ...prev, password: '' })); // clear password field
    } else {
      toast.error(res.message || 'Failed to update profile');
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Profile Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your account details and preferences.</p>
      </div>

      <div className="card divide-y divide-slate-200">
        <div className="p-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`} alt="Profile" className="h-24 w-24 rounded-full ring-4 ring-white shadow-md object-cover" />
              <button className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-sm">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Avatar Photo</h3>
              <p className="text-sm text-slate-500 mt-1 mb-3">Gravatar or dynamic avatar active. Uploads coming soon.</p>
              <button className="btn-secondary text-xs py-1.5 px-3">Upload New</button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="input-field" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="input-field" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" className="input-field" />
              </div>
            </div>

            <div className="mt-8 border-t border-slate-200 pt-8">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Security</h3>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">New Password (leave blank to keep current)</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" minLength="6" className="input-field" />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                type="submit" 
                disabled={isSaving}
                className="btn-primary px-8"
              >
                {isSaving ? (
                  <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin mx-auto" />
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
