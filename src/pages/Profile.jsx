import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';

function Profile() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { colors, isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    dateOfBirth: '',
    profilePicture: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [token, navigate]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile({
        ...response.data,
        dateOfBirth: response.data.dateOfBirth ? response.data.dateOfBirth.split('T')[0] : '',
        address: response.data.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        }
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      showToast('Error loading profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/profile`, profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update localStorage user data
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...user, name: response.data.name }));
      
      showToast('Profile updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('Error updating profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    
    if (passwords.newPassword.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      return;
    }

    setSaving(true);
    
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/profile/password`, {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
      showToast('Password updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating password:', error);
      showToast(error.response?.data?.error || 'Error updating password', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setProfile(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfile(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For demo purposes, we'll use a data URL
      // In production, you'd upload to a cloud service
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile(prev => ({ ...prev, profilePicture: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${colors.bg.primary} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className={`mt-4 ${colors.text.secondary}`}>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${colors.bg.primary} py-8 transition-colors duration-300`}>
      <div className="container mx-auto px-4 max-w-4xl">
        <div className={`${colors.bg.card} rounded-lg shadow-xl overflow-hidden transform hover:shadow-2xl transition-all duration-300`}>
          {/* Header */}
          <div className={`${colors.bg.gradient} px-6 py-8 relative overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black opacity-10"></div>
            <div className="relative flex items-center space-x-4">
              <div className="relative group">
                <img
                  src={profile.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || 'User')}&background=16a34a&color=fff&size=100`}
                  alt="Profile"
                  className="w-20 h-20 rounded-full border-4 border-white object-cover transform group-hover:scale-110 transition-transform duration-300"
                />
                <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 cursor-pointer shadow-lg transform hover:scale-110 transition-transform duration-200">
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-bold animate-fadeIn">{profile.name || 'User Profile'}</h1>
                <p className={`${isDarkMode ? 'text-green-300' : 'text-green-200'} animate-fadeIn delay-100`}>{profile.email}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className={`${colors.border.primary} border-b`}>
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'profile', label: 'Personal Information', icon: '👤' },
                { id: 'address', label: 'Address', icon: '📍' },
                { id: 'security', label: 'Security', icon: '🔒' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 text-sm font-medium border-b-2 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? `border-green-500 ${colors.text.accent}`
                      : `border-transparent ${colors.text.secondary} hover:${colors.text.primary}`
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            <form onSubmit={handleProfileSubmit}>
              {activeTab === 'profile' && (
                <div className="space-y-6 animate-fadeIn">
                  <h2 className={`text-lg font-semibold ${colors.text.primary}`}>Personal Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="transform hover:scale-105 transition-transform duration-200">
                      <label className={`block text-sm font-medium ${colors.text.secondary}`}>Full Name</label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={`mt-1 block w-full ${colors.border.primary} border rounded-md px-3 py-2 ${colors.bg.secondary} ${colors.text.primary} focus:outline-none focus:ring-green-500 focus:border-green-500 transition-all duration-200`}
                      />
                    </div>
                    
                    <div className="transform hover:scale-105 transition-transform duration-200">
                      <label className={`block text-sm font-medium ${colors.text.secondary}`}>Phone Number</label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={`mt-1 block w-full ${colors.border.primary} border rounded-md px-3 py-2 ${colors.bg.secondary} ${colors.text.primary} focus:outline-none focus:ring-green-500 focus:border-green-500 transition-all duration-200`}
                      />
                    </div>
                    
                    <div className="transform hover:scale-105 transition-transform duration-200">
                      <label className={`block text-sm font-medium ${colors.text.secondary}`}>Email</label>
                      <input
                        type="email"
                        value={profile.email}
                        disabled
                        className={`mt-1 block w-full ${colors.border.primary} border rounded-md px-3 py-2 ${colors.bg.tertiary} ${colors.text.muted} cursor-not-allowed`}
                      />
                    </div>
                    
                    <div className="transform hover:scale-105 transition-transform duration-200">
                      <label className={`block text-sm font-medium ${colors.text.secondary}`}>Date of Birth</label>
                      <input
                        type="date"
                        value={profile.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        className={`mt-1 block w-full ${colors.border.primary} border rounded-md px-3 py-2 ${colors.bg.secondary} ${colors.text.primary} focus:outline-none focus:ring-green-500 focus:border-green-500 transition-all duration-200`}
                      />
                    </div>
                  </div>
                  
                  <div className="transform hover:scale-105 transition-transform duration-200">
                    <label className={`block text-sm font-medium ${colors.text.secondary}`}>Bio</label>
                    <textarea
                      value={profile.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={3}
                      className={`mt-1 block w-full ${colors.border.primary} border rounded-md px-3 py-2 ${colors.bg.secondary} ${colors.text.primary} focus:outline-none focus:ring-green-500 focus:border-green-500 transition-all duration-200`}
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>
              )}

              {activeTab === 'address' && (
                <div className="space-y-6 animate-fadeIn">
                  <h2 className={`text-lg font-semibold ${colors.text.primary}`}>Address Information</h2>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div className="transform hover:scale-105 transition-transform duration-200">
                      <label className={`block text-sm font-medium ${colors.text.secondary}`}>Street Address</label>
                      <input
                        type="text"
                        value={profile.address.street}
                        onChange={(e) => handleInputChange('address.street', e.target.value)}
                        className={`mt-1 block w-full ${colors.border.primary} border rounded-md px-3 py-2 ${colors.bg.secondary} ${colors.text.primary} focus:outline-none focus:ring-green-500 focus:border-green-500 transition-all duration-200`}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="transform hover:scale-105 transition-transform duration-200">
                        <label className={`block text-sm font-medium ${colors.text.secondary}`}>City</label>
                        <input
                          type="text"
                          value={profile.address.city}
                          onChange={(e) => handleInputChange('address.city', e.target.value)}
                          className={`mt-1 block w-full ${colors.border.primary} border rounded-md px-3 py-2 ${colors.bg.secondary} ${colors.text.primary} focus:outline-none focus:ring-green-500 focus:border-green-500 transition-all duration-200`}
                        />
                      </div>
                      
                      <div className="transform hover:scale-105 transition-transform duration-200">
                        <label className={`block text-sm font-medium ${colors.text.secondary}`}>State</label>
                        <input
                          type="text"
                          value={profile.address.state}
                          onChange={(e) => handleInputChange('address.state', e.target.value)}
                          className={`mt-1 block w-full ${colors.border.primary} border rounded-md px-3 py-2 ${colors.bg.secondary} ${colors.text.primary} focus:outline-none focus:ring-green-500 focus:border-green-500 transition-all duration-200`}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="transform hover:scale-105 transition-transform duration-200">
                        <label className={`block text-sm font-medium ${colors.text.secondary}`}>ZIP Code</label>
                        <input
                          type="text"
                          value={profile.address.zipCode}
                          onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                          className={`mt-1 block w-full ${colors.border.primary} border rounded-md px-3 py-2 ${colors.bg.secondary} ${colors.text.primary} focus:outline-none focus:ring-green-500 focus:border-green-500 transition-all duration-200`}
                        />
                      </div>
                      
                      <div className="transform hover:scale-105 transition-transform duration-200">
                        <label className={`block text-sm font-medium ${colors.text.secondary}`}>Country</label>
                        <input
                          type="text"
                          value={profile.address.country}
                          onChange={(e) => handleInputChange('address.country', e.target.value)}
                          className={`mt-1 block w-full ${colors.border.primary} border rounded-md px-3 py-2 ${colors.bg.secondary} ${colors.text.primary} focus:outline-none focus:ring-green-500 focus:border-green-500 transition-all duration-200`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6 animate-fadeIn">
                  <h2 className={`text-lg font-semibold ${colors.text.primary}`}>Security Settings</h2>
                  
                  {!showPasswordForm ? (
                    <div className={`${colors.bg.tertiary} rounded-lg p-4 transform hover:scale-105 transition-all duration-200`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className={`text-sm font-medium ${colors.text.primary}`}>Password</h3>
                          <p className={`text-sm ${colors.text.secondary}`}>Last updated: Recently</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowPasswordForm(true)}
                          className={`${colors.button.primary} px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg`}
                        >
                          Change Password
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="transform hover:scale-105 transition-transform duration-200">
                        <label className={`block text-sm font-medium ${colors.text.secondary}`}>Current Password</label>
                        <input
                          type="password"
                          value={passwords.currentPassword}
                          onChange={(e) => setPasswords(prev => ({ ...prev, currentPassword: e.target.value }))}
                          className={`mt-1 block w-full ${colors.border.primary} border rounded-md px-3 py-2 ${colors.bg.secondary} ${colors.text.primary} focus:outline-none focus:ring-green-500 focus:border-green-500 transition-all duration-200`}
                        />
                      </div>
                      
                      <div className="transform hover:scale-105 transition-transform duration-200">
                        <label className={`block text-sm font-medium ${colors.text.secondary}`}>New Password</label>
                        <input
                          type="password"
                          value={passwords.newPassword}
                          onChange={(e) => setPasswords(prev => ({ ...prev, newPassword: e.target.value }))}
                          className={`mt-1 block w-full ${colors.border.primary} border rounded-md px-3 py-2 ${colors.bg.secondary} ${colors.text.primary} focus:outline-none focus:ring-green-500 focus:border-green-500 transition-all duration-200`}
                        />
                      </div>
                      
                      <div className="transform hover:scale-105 transition-transform duration-200">
                        <label className={`block text-sm font-medium ${colors.text.secondary}`}>Confirm New Password</label>
                        <input
                          type="password"
                          value={passwords.confirmPassword}
                          onChange={(e) => setPasswords(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className={`mt-1 block w-full ${colors.border.primary} border rounded-md px-3 py-2 ${colors.bg.secondary} ${colors.text.primary} focus:outline-none focus:ring-green-500 focus:border-green-500 transition-all duration-200`}
                        />
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          type="button"
                          onClick={handlePasswordSubmit}
                          disabled={saving}
                          className={`${colors.button.primary} px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 disabled:opacity-50 transform hover:scale-105 hover:shadow-lg`}
                        >
                          {saving ? 'Updating...' : 'Update Password'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowPasswordForm(false);
                            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
                          }}
                          className={`${colors.button.secondary} px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105`}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Save Button */}
              {activeTab !== 'security' && (
                <div className={`flex justify-end pt-6 ${colors.border.primary} border-t`}>
                  <button
                    type="submit"
                    disabled={saving}
                    className={`${colors.button.primary} px-6 py-2 rounded-md font-medium transition-all duration-200 disabled:opacity-50 transform hover:scale-105 hover:shadow-lg flex items-center space-x-2`}
                  >
                    {saving && (
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
