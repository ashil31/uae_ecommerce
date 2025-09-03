import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { FiSettings, FiBell, FiGlobe, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Breadcrumb from '../../components/UI/Breadcrumb';
import { updateUserSettings } from '../../store/slices/userSlice';

const Settings = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    language: user?.settings?.language || 'en',
    notifications: user?.settings?.notifications || {
      email: true,
      sms: false,
      push: true
    },
    currency: user?.settings?.currency || 'AED',
    showTrackingInfo: user?.settings?.showTrackingInfo || true
  });
  
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('preferences');
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await dispatch(updateUserSettings({ 
        userId: user._id, 
        settings: formData 
      }));
      toast.success('Settings updated successfully!');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbs = [
    { name: t('account.myAccount'), path: '/account' },
    { name: t('account.settings'), path: '/account/settings' }
  ];

  return (
    <>
      <Helmet>
        <title>{`${t('account.settings')} - UAE`}</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <Breadcrumb customPaths={breadcrumbs} />
        
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">{t('account.settings')}</h1>
          
          {/* Tab Navigation */}
          <div className="flex space-x-8 border-b mb-8">
            <button
              onClick={() => setActiveTab('preferences')}
              className={`pb-4 px-2 font-medium transition-colors ${
                activeTab === 'preferences'
                  ? 'border-b-2 border-black text-black'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Preferences
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`pb-4 px-2 font-medium transition-colors ${
                activeTab === 'notifications'
                  ? 'border-b-2 border-black text-black'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`pb-4 px-2 font-medium transition-colors ${
                activeTab === 'security'
                  ? 'border-b-2 border-black text-black'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Security
            </button>
          </div>

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="bg-[#f7f5f1] p-6 rounded-lg border">
              <div className="flex items-center mb-6">
                <FiSettings className="mr-3" size={24} />
                <h2 className="text-xl font-semibold">Preferences</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border bg-[#f7f5f1] border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  >
                    <option value="en">English</option>
                    <option value="ar">Arabic</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#f7f5f1] border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  >
                    <option value="AED">UAE Dirham (AED)</option>
                    <option value="USD">US Dollar (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                    <option value="GBP">British Pound (GBP)</option>
                  </select>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showTrackingInfo"
                    name="showTrackingInfo"
                    checked={formData.showTrackingInfo}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-black bg-[#f7f5f1] focus:ring-black border-gray-300 rounded"
                  />
                  <label htmlFor="showTrackingInfo" className="ml-3 text-sm text-gray-700">
                    Show order tracking information on dashboard
                  </label>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Preferences'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="bg-[#f7f5f1] p-6 rounded-lg border">
              <div className="flex items-center mb-6">
                <FiBell className="mr-3" size={24} />
                <h2 className="text-xl font-semibold">Notification Preferences</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="notifications.email"
                        name="notifications.email"
                        checked={formData.notifications.email}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                      />
                      <label htmlFor="notifications.email" className="ml-3 text-sm text-gray-700">
                        Receive email notifications
                      </label>
                    </div>
                    <p className="text-sm text-gray-500 ml-7">
                      Order confirmations, shipping updates, and promotions
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">SMS Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="notifications.sms"
                        name="notifications.sms"
                        checked={formData.notifications.sms}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                      />
                      <label htmlFor="notifications.sms" className="ml-3 text-sm text-gray-700">
                        Receive SMS notifications
                      </label>
                    </div>
                    <p className="text-sm text-gray-500 ml-7">
                      Order confirmations and shipping updates
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Push Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="notifications.push"
                        name="notifications.push"
                        checked={formData.notifications.push}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                      />
                      <label htmlFor="notifications.push" className="ml-3 text-sm text-gray-700">
                        Receive push notifications
                      </label>
                    </div>
                    <p className="text-sm text-gray-500 ml-7">
                      Order updates and personalized recommendations
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Notification Settings'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="bg-[#f7f5f1] p-6 rounded-lg border">
              <div className="flex items-center mb-6">
                <FiGlobe className="mr-3" size={24} />
                <h2 className="text-xl font-semibold">Security Settings</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Active Sessions</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">
                      You're currently logged in on this device.
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {navigator.userAgent}
                    </p>
                  </div>
                </div>
                
                {/* <div>
                  <h3 className="text-lg font-medium mb-4">Change Password</h3>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-500 hover:text-black"
                        >
                          {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Password must be at least 8 characters long
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        Update Password
                      </button>
                    </div>
                  </form>
                </div> */}

              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Settings;