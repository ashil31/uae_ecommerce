
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FiCreditCard, FiTruck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { serverUrl } from '../../services/url';
import { fetchAddresses } from '../../store/slices/addressSlice';
import { calculateTotals } from '../../store/slices/cartSlice';

const stripePromise = loadStripe('pk_test_51RgKLGRiWKssTbqHR3SwNnHuQl5UqySgRBVLwpoMrzth4RxlqZ5vLewbybrQVo20IAOMorMnyr9VxjrFZWc7H8xK00zmrxaSyK');

const CheckoutForm = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { items, total, coupon } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { addresses } = useSelector((state) => state.address);

  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    emirate: 'Dubai',
    postalCode: '',
    country: 'UAE',
    phone: '',
    paymentMethod: 'credit_card'
  });
  // Calculate final total including shipping and tax (same logic as OrderSummary)
  const shippingCost = total > 500 ? 0 : 25;
  const tax = total * 0.05; // 5% VAT
  const finalTotal = total + shippingCost + tax;

  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState('');

  // Fetch addresses when component mounts
  useEffect(() => {
    if (user?._id) {
      dispatch(fetchAddresses(user._id));
    }
  }, [dispatch, user?._id]);

  // Calculate totals when items or coupon changes
  useEffect(() => {
    dispatch(calculateTotals());
  }, [dispatch, items, coupon]);

  // Populate form with default address when addresses are loaded
  useEffect(() => {
    if (addresses && addresses.length > 0) {
      const defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0]; // Use first address if no default
      // console.log('Default address found:', defaultAddress);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress._id);
        setFormData(prevData => ({
          ...prevData,
          firstName: defaultAddress.firstName || '',
          lastName: defaultAddress.lastName || '',
          street: defaultAddress.street || '',
          city: defaultAddress.city || '',
          emirate: defaultAddress.emirate || 'Dubai',
          postalCode: defaultAddress.postalCode || '',
          country: defaultAddress.country || 'UAE',
          phone: defaultAddress.phone || ''
        }));
      }
    }
  }, [addresses]);

  // Handle address selection change
  const handleAddressChange = (e) => {
    const addressId = e.target.value;
    setSelectedAddressId(addressId);
    
    if (addressId === 'new') {
      // Clear form for new address
      setFormData(prevData => ({
        ...prevData,
        firstName: '',
        lastName: '',
        street: '',
        city: '',
        emirate: 'Dubai',
        postalCode: '',
        country: 'UAE',
        phone: ''
      }));
    } else {
      // Populate with selected address
      const selectedAddress = addresses.find(addr => addr._id === addressId);
      if (selectedAddress) {
        setFormData(prevData => ({
          ...prevData,
          firstName: selectedAddress.firstName || '',
          lastName: selectedAddress.lastName || '',
          street: selectedAddress.street || '',
          city: selectedAddress.city || '',
          emirate: selectedAddress.emirate || 'Dubai',
          postalCode: selectedAddress.postalCode || '',
          country: selectedAddress.country || 'UAE',
          phone: selectedAddress.phone || ''
        }));
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleStripePayment = async (e) => {
    e.preventDefault();
    const stripe = await stripePromise;

    const paymentData = {
      products: items, 
      coupon: coupon ? coupon.code : null,
      subtotal: total,
      shippingCost: shippingCost,
      tax: tax,
      total: finalTotal,
      shippingAddress: formData
    };


    try {
      const response = await axios.post(`${serverUrl}/payment/create-checkout-session`, paymentData, { withCredentials: true });

      
      console.log('Sending payment data:', paymentData);
      const session = response.data;
      if (!session || !session.id) {
        throw new Error('Checkout session not created');
      }

      const result = await stripe.redirectToCheckout({
        sessionId: session.id
      });

      if (result.error) {
        console.error(result.error);
        toast.error(t('checkout.paymentFailed'));
      }
    } catch (error) {
      console.error(error);
      toast.error(t('checkout.paymentFailed'));
    }
  }

  

  return (
    <form onSubmit={handleStripePayment} className="space-y-6">
      {/* Contact Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4">{t('checkout.contactInfo')}</h3>
        <input
          type="email"
          name="email"
          placeholder={t('auth.email')}
          value={formData.email}
          onChange={handleInputChange}
          required
          className="w-full bg-[#f7f5f1] px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-black"
        />
      </div>

      {/* Shipping Address */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FiTruck className="mr-2" />
          {t('checkout.shippingAddress')}
        </h3>
        
        {/* Address Selector */}
        {addresses && addresses.length > 0 && (
          <div className="mb-4">
            <select
              value={selectedAddressId}
              onChange={handleAddressChange}
              className="w-full px-4 py-3 bg-[#f7f5f1] border border-gray-300 rounded focus:outline-none focus:border-black"
            >
              {addresses.map((address) => (
                <option key={address._id} value={address._id}>
                  {address.isDefault ? '⭐ ' : ''}{address.type || 'Address'} - {address.street}, {address.city}, {address.emirate}
                </option>
              ))}
              <option value="new">+ Add New Address</option>
            </select>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="firstName"
            placeholder={t('auth.firstName')}
            value={formData.firstName}
            onChange={handleInputChange}
            required
            className="px-4 py-3 bg-[#f7f5f1] border border-gray-300 rounded focus:outline-none focus:border-black"
          />
          <input
            type="text"
            name="lastName"
            placeholder={t('auth.lastName')}
            value={formData.lastName}
            onChange={handleInputChange}
            required
            className="px-4 py-3 border bg-[#f7f5f1] border-gray-300 rounded focus:outline-none focus:border-black"
          />
          <input
            type="text"
            name="street"
            placeholder={t('checkout.address')}
            value={formData.street}
            onChange={handleInputChange}
            required
            className="md:col-span-2 px-4 bg-[#f7f5f1] py-3 border border-gray-300 rounded focus:outline-none focus:border-black"
          />
          <input
            type="text"
            name="city"
            placeholder={t('checkout.city')}
            value={formData.city}
            onChange={handleInputChange}
            required
            className="px-4 py-3 border bg-[#f7f5f1] border-gray-300 rounded focus:outline-none focus:border-black"
          />
          <select
            name="emirate"
            value={formData.emirate}
            onChange={handleInputChange}
            required
            className="px-4 py-3 border bg-[#f7f5f1] border-gray-300 rounded focus:outline-none focus:border-black"
          >
            <option value="Dubai">Dubai</option>
            <option value="Abu Dhabi">Abu Dhabi</option>
            <option value="Sharjah">Sharjah</option>
            <option value="Ajman">Ajman</option>
            <option value="Ras Al Khaimah">Ras Al Khaimah</option>
            <option value="Fujairah">Fujairah</option>
            <option value="Umm Al Quwain">Umm Al Quwain</option>
          </select>
          <input
            type="text"
            name="postalCode"
            placeholder={t('checkout.postalCode')}
            value={formData.postalCode}
            onChange={handleInputChange}
            required
            className="px-4 py-3 border bg-[#f7f5f1] border-gray-300 rounded focus:outline-none focus:border-black"
          />
          <input
            type="tel"
            name="phone"
            placeholder={t('phone')}
            value={formData.phone}
            onChange={handleInputChange}
            required
            className="px-4 py-3 border bg-[#f7f5f1] border-gray-300 rounded focus:outline-none focus:border-black"
          />
        </div>
      </div>

      {/* Payment Method */}
      {/* <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FiCreditCard className="mr-2" />
          {t('checkout.paymentMethod')}
        </h3>
        <div className="space-y-3">
          <label className="flex items-center p-4 border rounded cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="paymentMethod"
              value="credit_card"
              checked={formData.paymentMethod === 'credit_card'}
              onChange={handleInputChange}
              className="mr-3"
            />
            <span>{t('checkout.creditCard')}</span>
          </label>
          <label className="flex items-center p-4 border rounded cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={formData.paymentMethod === 'cod'}
              onChange={handleInputChange}
              className="mr-3"
            />
            <span>{t('checkout.cashOnDelivery')}</span>
          </label>
        </div>
      </div> */}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isProcessing}
        // onClick={handleStripePayment}
        className={`w-full py-4 text-white font-medium transition-colors ${
          isProcessing
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-black hover:bg-gray-800'
        }`}
      >
        {isProcessing ? t('checkout.processing') : `${t('checkout.placeOrder')} - ${finalTotal.toFixed(2)} ${t('common.currency')}`}
      </button>
    </form>
  );
};

export default CheckoutForm;
