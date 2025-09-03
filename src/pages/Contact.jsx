import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import SEO from '../components/UI/SEO';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { serverUrl } from '../services/url';

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${serverUrl}/contact/submit`, formData, {withCredentials: true});
      
      if (response.data.success) {
        toast.success(response.data.message || 'Thank you for contacting us! We will get back to you soon.');
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: 'general',
          message: ''
        });
      } else {
        toast.error(response.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      // console.error('Contact form submission error:', error);
      toast.error(error.message || 'Failed to submit contact form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const subjectOptions = [
    { value: 'general', label: t('contact.subjectOptions.general') },
    { value: 'wholesale', label: t('contact.subjectOptions.wholesale') },
    { value: 'returns', label: t('contact.subjectOptions.returns') },
    { value: 'complaint', label: t('contact.subjectOptions.complaint') },
    { value: 'product', label: t('contact.subjectOptions.product') },
    { value: 'order', label: t('contact.subjectOptions.order') },
    { value: 'business', label: t('contact.subjectOptions.business') },
    { value: 'other', label: t('contact.subjectOptions.other') },
  ];

  return (
    <>
      <SEO
        title="Contact Us - UAE Customer Service | UAE"
        description="Get in touch with UAE customer service. Find our store locations, contact information, and customer support across UAE."
        keywords="contact UAE, customer service, UAE stores, fashion support"
      />
      
      <div className="w-full bg-[#f7f5f1] mx-auto mt-14 py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center mb-8">{t('contact.title')}</h1>
        
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-[#f7f5f1] p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6">{t('contact.formTitle')}</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('contact.name')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder='Full Name'
                  required
                  className="mt-1 bg-[#f2f2f2] block w-full h-10 px-3 rounded-md border border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('contact.email')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder='Email'
                    required
                    className="mt-1 bg-[#f2f2f2] block w-full h-10 px-3 rounded-md border border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('contact.phone')}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder='Phone'
                    className="mt-1 block bg-[#f2f2f2] w-full h-10 px-3 rounded-md border border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('contact.subject')} <span className="text-red-500">*</span>
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="mt-1 block bg-[#f2f2f2] w-full h-10 px-3 rounded-md border border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                >
                  {subjectOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('contact.message')} <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder='Write a message...'
                  required
                  className="mt-1 block bg-[#f2f2f2] w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                ></textarea>
              </div>
              
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto inline-flex justify-center items-center rounded-md border border-transparent bg-black px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    t('contact.submit')
                  )}
                </button>
              </div>
            </form>
          </div>
          
          {/* Contact Information */}
          <div className="bg-[#f7f5f1] p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6">{t('contact.infoTitle')}</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {t('contact.addressTitle')}
                </h3>
                <address className="not-italic pl-7">
                  {t('contact.addressLine1')}<br />
                  {t('contact.addressLine2')}<br />
                  {t('contact.addressCity')}, {t('contact.addressCountry')}
                </address>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  {t('contact.phoneTitle')}
                </h3>
                <div className="pl-7 space-y-1">
                  <p>
                    <a href="tel:+971501234567" className="hover:text-gray-600 transition-colors">+971 50 123 4567</a> ({t('contact.customerService')})
                  </p>
                  <p>
                    <a href="tel:+97142234567" className="hover:text-gray-600 transition-colors">+971 4 223 4567</a> ({t('contact.wholesaleInquiries')})
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  {t('contact.emailTitle')}
                </h3>
                <div className="pl-7 space-y-1">
                  <p>
                    <a href="mailto:customerservice@UAEfashion.com" className="hover:text-gray-600 transition-colors">
                      customerservice@UAEfashion.com
                    </a>
                  </p>
                  <p>
                    <a href="mailto:wholesale@UAEfashion.com" className="hover:text-gray-600 transition-colors">
                      wholesale@UAEfashion.com
                    </a>
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  {t('contact.hoursTitle')}
                </h3>
                <div className="pl-7">
                  <p className="font-medium">{t('contact.hoursWeekdays')}:</p>
                  <p>9:00 AM - 6:00 PM</p>
                  <p className="font-medium mt-2">{t('contact.hoursWeekends')}:</p>
                  <p>10:00 AM - 4:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;