import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Calendar, UserCheck, Phone, Save, Edit2, LogOut, Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, updateUserProfile } from '../services/api';
import toast from 'react-hot-toast';

export default function ProfileModal({ isOpen, onClose }) {
  const { isDark } = useTheme();
  const { user, token, updateUser, logout } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    gender: 'prefer-not-to-say',
    phone: ''
  });

  useEffect(() => {
    if (isOpen && token) {
      setLoading(true);
      getUserProfile(token)
        .then((data) => {
          setFormData({
            name: data.name || '',
            email: data.email || '',
            age: data.age || '',
            gender: data.gender || 'prefer-not-to-say',
            phone: data.phone || ''
          });
        })
        .catch(() => toast.error('Failed to load profile details'))
        .finally(() => setLoading(false));
    } else {
      setIsEditing(false); // Reset edit mode on close
    }
  }, [isOpen, token]);

  // Support ESC to close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      toast.error('Name must be at least 2 characters.');
      return;
    }
    if (formData.age && (formData.age < 0 || formData.age > 120)) {
      toast.error('Please enter a valid age.');
      return;
    }

    setSaving(true);
    try {
      const resp = await updateUserProfile({
        name: formData.name,
        age: formData.age || undefined,
        gender: formData.gender,
        phone: formData.phone
      }, token);

      updateUser(resp.user);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    onClose();
    logout();
  };



  const bg = isDark ? 'bg-[#0F172A]' : 'bg-white';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-500';
  const borderCol = isDark ? 'border-gray-800' : 'border-gray-200';
  const inputBg = isDark ? 'bg-white/5' : 'bg-gray-50';

  const firstName = user?.name?.split(' ')[0] || '';
  const initials = firstName ? firstName.charAt(0).toUpperCase() : 'U';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 h-full w-full pointer-events-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={`relative w-full max-w-sm sm:max-w-md rounded-3xl shadow-2xl overflow-hidden ${bg} border ${borderCol}`}
      >
        {/* Header */}
        <div className={`p-6 pb-0 flex justify-between items-center bg-gradient-to-b ${isDark ? 'from-[#0FA77F]/10 to-transparent' : 'from-[#0FA77F]/5 to-transparent'}`}>
          <h2 className={`text-xl font-bold tracking-tight ${textPrimary}`}>Your Profile</h2>
          <button onClick={onClose} className={`p-2 rounded-full hover:bg-black/5 transition-colors ${textSecondary}`}>
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {/* Avatar Row */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#0FA77F] to-[#22c55e] flex items-center justify-center text-white text-2xl font-bold shadow-lg flex-shrink-0">
              {initials}
            </div>
            <div className="truncate">
              <h3 className={`text-lg font-bold truncate ${textPrimary}`}>{user?.name}</h3>
              <p className={`text-sm truncate ${textSecondary}`}>{user?.email}</p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 className="animate-spin text-[#0FA77F] mb-4" size={24} />
              <p className={textSecondary}>Loading profile...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Form Fields */}
              <div className="space-y-3">
                {/* Name */}
                <div className="flex items-center gap-3">
                  <User size={18} className={`flex-shrink-0 ${textSecondary}`} />
                  <div className="flex-1 w-full overflow-hidden">
                    {isEditing ? (
                      <input name="name" value={formData.name} onChange={handleChange} className={`w-full px-3 py-2 rounded-xl text-sm ${inputBg} border ${borderCol} ${textPrimary} outline-none focus:border-[#0FA77F]`} placeholder="Full Name" />
                    ) : (
                      <div className={`text-sm font-medium truncate ${textPrimary}`}>{formData.name}</div>
                    )}
                  </div>
                </div>

                {/* Email (Read Only) */}
                <div className="flex items-center gap-3">
                  <Mail size={18} className={`flex-shrink-0 ${textSecondary}`} />
                  <div className="flex-1 w-full overflow-hidden">
                    <div className={`text-sm truncate ${textSecondary}`}>{formData.email} <span className="text-[10px] ml-1 opacity-50 uppercase tracking-wider">(Read-only)</span></div>
                  </div>
                </div>

                {/* Age */}
                <div className="flex items-center gap-3">
                  <Calendar size={18} className={`flex-shrink-0 ${textSecondary}`} />
                  <div className="flex-1 w-full overflow-hidden">
                    {isEditing ? (
                      <input type="number" name="age" value={formData.age} onChange={handleChange} className={`w-full px-3 py-2 rounded-xl text-sm ${inputBg} border ${borderCol} ${textPrimary} outline-none focus:border-[#0FA77F]`} placeholder="Age (e.g. 28)" />
                    ) : (
                      <div className={`text-sm font-medium ${formData.age ? textPrimary : textSecondary}`}>{formData.age ? `${formData.age} years old` : 'Age not provided'}</div>
                    )}
                  </div>
                </div>

                {/* Gender */}
                <div className="flex items-center gap-3">
                  <UserCheck size={18} className={`flex-shrink-0 ${textSecondary}`} />
                  <div className="flex-1 w-full overflow-hidden">
                    {isEditing ? (
                      <select name="gender" value={formData.gender} onChange={handleChange} className={`w-full px-3 py-2 rounded-xl text-sm ${inputBg} border ${borderCol} ${textPrimary} outline-none focus:border-[#0FA77F]`}>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    ) : (
                      <div className={`text-sm font-medium ${formData.gender !== 'prefer-not-to-say' ? textPrimary : textSecondary} capitalize`}>
                        {formData.gender === 'prefer-not-to-say' ? 'Gender not specified' : formData.gender}
                      </div>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-3">
                  <Phone size={18} className={`flex-shrink-0 ${textSecondary}`} />
                  <div className="flex-1 w-full overflow-hidden">
                    {isEditing ? (
                      <input name="phone" value={formData.phone} onChange={handleChange} className={`w-full px-3 py-2 rounded-xl text-sm ${inputBg} border ${borderCol} ${textPrimary} outline-none focus:border-[#0FA77F]`} placeholder="Phone Number" />
                    ) : (
                      <div className={`text-sm font-medium truncate ${formData.phone ? textPrimary : textSecondary}`}>{formData.phone || 'Phone not provided'}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className={`my-4 border-t ${borderCol}`} />

              {/* Actions */}
              <div className="flex items-center justify-between">
                {isEditing ? (
                  <div className="flex items-center gap-2 w-full">
                    <button onClick={() => setIsEditing(false)} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border ${borderCol} ${textSecondary} hover:bg-black/5 transition-colors`}>
                      Cancel
                    </button>
                    <button onClick={handleSave} disabled={saving} className={`flex-1 py-2.5 rounded-xl text-sm font-bold bg-[#0FA77F] text-white hover:bg-[#0c8a68] transition-colors flex items-center justify-center gap-2 ${saving ? 'opacity-70' : ''}`}>
                      {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Changes
                    </button>
                  </div>
                ) : (
                  <>
                    <button onClick={() => setIsEditing(true)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border ${borderCol} ${textPrimary} hover:bg-black/5 transition-colors`}>
                      <Edit2 size={14} /> Edit Profile
                    </button>
                    
                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-500/10 transition-colors">
                      <LogOut size={14} /> Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
