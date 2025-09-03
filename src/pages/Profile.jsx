  
import React, { use, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { FiUser, FiMail, FiLock, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Breadcrumb from '../components/UI/Breadcrumb';
import { fetchUserProfile } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
});

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  useEffect( () => {
    if (!user) {
      navigate('/login'); // Redirect to login page if user is not authenticated
    }
    dispatch(fetchUserProfile()); // Fetch user profile data
  }, [dispatch])



  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user?.addresses?.[0]?.firstName || '',
        lastName: user?.addresses?.[0]?.lastName || '',
        email: user?.email || '',
        phone: user?.addresses?.[0]?.phone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);


  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePersonalInfoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Profile updated successfully!');
      setLoading(false);
    }, 1500);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Password updated successfully!');
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setLoading(false);
    }, 1500);
  };

  const breadcrumbs = [
    { name: t('account.myAccount'), path: '/account' },
    { name: t('account.profile'), path: '/account/profile' }
  ];

  return (
    <>
      <Helmet>
        <title>{`${t('account.profile')} - UAE`}</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <Breadcrumb customPaths={breadcrumbs} />
        
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">{t('account.profile')}</h1>
          
          {/* Tab Navigation */}
          <div className="flex space-x-8 border-b mb-8">
            <button
              onClick={() => setActiveTab('personal')}
              className={`pb-4 px-2 font-medium transition-colors ${
                activeTab === 'personal'
                  ? 'border-b-2 border-black text-black'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Personal Information
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`pb-4 px-2 font-medium transition-colors ${
                activeTab === 'password'
                  ? 'border-b-2 border-black text-black'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Change Password
            </button>
          </div>

          {/* Personal Information Tab */}
          {activeTab === 'personal' && (
            <div className="bg-[#f7f5f1] p-6 rounded-lg border">
              <div className="flex items-center mb-6">
                <FiUser className="mr-3" size={24} />
                <h2 className="text-xl font-semibold">Personal Information</h2>
              </div>
              
              <form onSubmit={handlePersonalInfoSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder='First Name'
                      className="w-full px-4 py-3 border bg-[#f7f5f1] border-gray-300 rounded-lg focus:outline-none focus:border-black"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      placeholder='Last Name'
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border bg-[#f7f5f1] border-gray-300 rounded-lg focus:outline-none focus:border-black"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder='Email'
                    onChange={handleInputChange}
                    disabled
                    className="w-full px-4 py-3 border bg-[#f7f5f1] border-gray-300 rounded-lg focus:outline-none focus:border-black"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border bg-[#f7f5f1] border-gray-300 rounded-lg focus:outline-none focus:border-black"
                    placeholder="+971 50 123 4567"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center space-x-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  <FiSave size={18} />
                  <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </form>
            </div>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <div className="bg-[#f7f5f1] p-6 rounded-lg border">
              <div className="flex items-center mb-6">
                <FiLock className="mr-3" size={24} />
                <h2 className="text-xl font-semibold">Change Password</h2>
              </div>
              
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border bg-[#f7f5f1] border-gray-300 rounded-lg focus:outline-none focus:border-black"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border bg-[#f7f5f1] border-gray-300 rounded-lg focus:outline-none focus:border-black"
                    required
                    minLength={8}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Password must be at least 8 characters long
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border bg-[#f7f5f1] border-gray-300 rounded-lg focus:outline-none focus:border-black"
                    required
                    minLength={8}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center space-x-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  <FiLock size={18} />
                  <span>{loading ? 'Updating...' : 'Update Password'}</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
