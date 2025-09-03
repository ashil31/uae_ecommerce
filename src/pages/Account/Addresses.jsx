import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { FiPlus, FiEdit2, FiTrash2, FiMapPin, FiCheck, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import Breadcrumb from '../../components/UI/Breadcrumb';
import { 
  fetchAddresses, 
  addAddress, 
  updateAddress, 
  setDefaultAddress, 
  deleteAddress,
  clearError 
} from '../../store/slices/addressSlice';

const Addresses = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  // Redux state
  const { addresses, isLoading, error } = useSelector((state) => state.address);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    type: 'home',
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    emirate: 'Dubai',
    postalCode: '',
    country: 'UAE',
    phone: '',
    isDefault: false
  });

  const emirates = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'];

  // Fetch addresses on component mount
  useEffect(() => {
    if (isAuthenticated && user?._id) {
      dispatch(fetchAddresses(user._id));
    }
  }, [dispatch, isAuthenticated, user?._id]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  console.log(isAuthenticated)

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!isAuthenticated) {
      toast.error('User not authenticated');
      return;
    }
    
    try {
      if (editingAddress) {
        // Update existing address
        await dispatch(updateAddress({
          userId: user._id,
          addressId: editingAddress._id,
          addressData: formData
        })).unwrap();
        toast.success('Address updated successfully!');
        setEditingAddress(null);
      } else {
        // Add new address
        await dispatch(addAddress({
          userId: user._id,
          addressData: formData
        })).unwrap();
        toast.success('Address added successfully!');
      }
      
      setShowAddForm(false);
      resetForm();
    } catch (error) {
      toast.error(error.message || 'Operation failed');
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'home',
      firstName: '',
      lastName: '',
      street: '',
      city: '',
      emirate: 'Dubai',
      postalCode: '',
      country: 'UAE',
      phone: '',
      isDefault: false
    });
  };

  const handleEdit = (address) => {
    setFormData(address);
    setEditingAddress(address);
    setShowAddForm(true);
  };

  const handleDelete = async (addressId) => {
    if (!user?._id) {
      toast.error('User not authenticated');
      return;
    }

      try {
        await dispatch(deleteAddress({
          userId: user._id,
          addressId: addressId
        })).unwrap();
        toast.success('Address deleted successfully!');
      } catch (error) {
        toast.error(error.message || 'Failed to delete address');
      }
  };

  console.log(user)

  const handleSetDefault = async (addressId) => {
    if (!user?._id) {
      toast.error('User not authenticated');
      return;
    }

    try {
      await dispatch(setDefaultAddress({
        userId: user._id,
        addressId: addressId
      })).unwrap();
      toast.success('Default address updated!');
    } catch (error) {
      toast.error(error.message || 'Failed to set default address');
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingAddress(null);
    resetForm();
  };

  const breadcrumbs = [
    { name: t('account.myAccount'), path: '/account' },
    { name: t('account.addresses'), path: '/account/addresses' }
  ];

  // Show loading if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f7f5f1]">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto bg-[#f7f5f1] rounded-xl shadow-sm p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-[#f7f5f1] rounded-full flex items-center justify-center">
              <FiMapPin className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Authentication Required</h3>
            <p className="text-gray-600">Please log in to view your addresses.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${t('account.addresses')} - UAE`}</title>
      </Helmet>

      <div className="min-h-screen bg-[#f7f5f1]">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <Breadcrumb customPaths={breadcrumbs} />
            
            {/* Header */}
            <div className="bg-[#f7f5f1] rounded-xl shadow-sm p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{t('account.addresses')}</h1>
                  <p className="text-gray-600 mt-1">Manage your delivery addresses</p>
                </div>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  <FiPlus className="w-4 h-4 mr-2" />
                  Add New Address
                </button>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="bg-[#f7f5f1] rounded-xl shadow-sm p-8">
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-black border-t-transparent"></div>
                  <span className="ml-3 text-gray-600">Loading addresses...</span>
                </div>
              </div>
            )}

            {/* No Addresses State */}
            {!isLoading && addresses.length === 0 && (
              <div className="bg-[#f7f5f1] rounded-xl shadow-sm p-12">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <FiMapPin className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No addresses yet</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Add your first address to start receiving deliveries at your preferred location.
                  </p>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                  >
                    <FiPlus className="w-4 h-4 mr-2" />
                    Add Your First Address
                  </button>
                </div>
              </div>
            )}

            {/* Address List */}
            {!isLoading && addresses.length > 0 && (
              <div className="grid gap-6 mb-8">
                {addresses.map((address) => (
                  <div key={address._id} className="bg-[#f7f5f1] rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {/* Address Header */}
                          <div className="flex items-center mb-4">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                              <FiMapPin className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <div className="flex items-center">
                                <h3 className="font-semibold text-gray-900 capitalize mr-3">
                                  {address.type} Address
                                </h3>
                                {address.isDefault && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <FiCheck className="w-3 h-3 mr-1" />
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                {address.firstName} {address.lastName}
                              </p>
                            </div>
                          </div>
                          
                          {/* Address Details */}
                          <div className="bg-[#f7f5f1] rounded-lg p-4">
                            <div className="space-y-2">
                              <div className="flex items-start">
                                <span className="text-sm text-gray-500 w-16 shrink-0">Address:</span>
                                <span className="text-sm text-gray-900">{address.street}</span>
                              </div>
                              <div className="flex items-start">
                                <span className="text-sm text-gray-500 w-16 shrink-0">City:</span>
                                <span className="text-sm text-gray-900">
                                  {address.city}, {address.emirate} {address.postalCode}
                                </span>
                              </div>
                              <div className="flex items-start">
                                <span className="text-sm text-gray-500 w-16 shrink-0">Country:</span>
                                <span className="text-sm text-gray-900">{address.country}</span>
                              </div>
                              <div className="flex items-start">
                                <span className="text-sm text-gray-500 w-16 shrink-0">Phone:</span>
                                <span className="text-sm text-gray-900">{address.phone}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center space-x-2 ml-6">
                          {!address.isDefault && (
                            <button
                              onClick={() => handleSetDefault(address._id)}
                              className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                              disabled={isLoading}
                            >
                              Set Default
                            </button>
                          )}
                          <button
                            onClick={() => handleEdit(address)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            disabled={isLoading}
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(address._id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            disabled={isLoading}
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add/Edit Address Form */}
            {showAddForm && (
              <div className="bg-[#f7f5f1] rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {editingAddress ? 'Edit Address' : 'Add New Address'}
                      </h2>
                      <p className="text-gray-600 mt-1">
                        {editingAddress ? 'Update your address details' : 'Fill in the details for your new address'}
                      </p>
                    </div>
                    <button
                      onClick={handleCancel}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6">
                  <div className="space-y-6">
                    {/* Address Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address Type
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#f7f5f1] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      >
                        <option value="home">Home</option>
                        <option value="work">Work</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    {/* Name Fields */}
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
                          className="w-full px-4 py-3 bg-[#f7f5f1] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
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
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-[#f7f5f1] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                    
                    {/* Street Address */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#f7f5f1] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="Building name, street name, area"
                        required
                      />
                    </div>
                    
                    {/* Location Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-[#f7f5f1] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Emirate
                        </label>
                        <select
                          name="emirate"
                          value={formData.emirate}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-[#f7f5f1] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        >
                          {emirates.map(emirate => (
                            <option key={emirate} value={emirate}>{emirate}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-[#f7f5f1] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                          placeholder="000000"
                        />
                      </div>
                    </div>
                    
                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#f7f5f1] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="+971 50 123 4567"
                        required
                      />
                    </div>
                    
                    {/* Default Address Checkbox */}
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <input
                        type="checkbox"
                        name="isDefault"
                        checked={formData.isDefault}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                      />
                      <label className="ml-3 text-sm font-medium text-gray-700">
                        Set as default address
                      </label>
                    </div>
                    
                    {/* Form Actions */}
                    <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? 'Processing...' : (editingAddress ? 'Update Address' : 'Add Address')}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Addresses;