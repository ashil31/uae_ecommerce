
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { registerUser } from '../../store/slices/authSlice';
import Loading from '../../components/UI/Loading';
import toast from 'react-hot-toast';

import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../../firebase/config'; // Adjust the import path as necessary


const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isLoading, error } = useSelector((state) => state.auth);
  const [user, setUser] = useState(null)
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'customer'
  });


  // Password validation function
  const validatePassword = (password) => {
    const minMaxLength = /^.{8,16}$/;
    const uppercase = /[A-Z]/;
    const lowercase = /[a-z]/;
    const number = /[0-9]/;
    const specialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

    if (!minMaxLength.test(password)) {
      return 'Password must be 8-16 characters long';
    }
    if (!uppercase.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!lowercase.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!number.test(password)) {
      return 'Password must contain at least one number';
    }
    if (!specialChar.test(password)) {
      return 'Password must contain at least one special character';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password
    const passwordValidation = validatePassword(formData.password);
    if (passwordValidation) {
      setPasswordError(passwordValidation);
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error(t('Passwords do not match!'));
      return;
    }

    try {
      // 1. Create user in Firebase (unverified state)
      const userCredentials = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      const user = userCredentials.user;
      setUser(user);

      // 2. Immediately send verification email
      await sendEmailVerification(user);

      // 3. Store LIMITED user data in backend (marked unverified)
      const backendUserData = {
        ...formData,
        emailVerified: false,
        firebaseUid: user.uid,
      };

      // 4. Register user in backend WITHOUT granting access
      const result = await dispatch(registerUser( backendUserData));
    
      if (registerUser.fulfilled.match(result)) {
        // 6. Redirect to verification page with email context
        navigate('/verify-email', { 
          state: { 
            email: formData.email,
            uid: user.uid,
          } 
        });

        toast.success(t('Verification email sent! Please check your inbox.'));
      } else {
        toast.error(error || t('Registration failed'));
      }
    } catch (error) {
      // Handle specific Firebase errors
      if (error.code === 'auth/email-already-in-use') {
        toast.error(t('This email is already registered'));
      } else {
        console.error('Registration error:', error);
        // Cleanup: Delete Firebase user if backend registration failed
        if (user) {
          await user.delete();
        }
        toast.error(error.message || t('Registration failed'));
      }
    }
  };


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <Helmet>
        <title>{`${t('auth.register')} - UAE`}</title>
      </Helmet>

      <div className="min-h-screen flex pt-32 bg-[#f7f5f1] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-center">{t('auth.createAccount')}</h1>
            <p className="mt-2 text-center text-gray-600">
              {t('auth.alreadyHaveAccount')}{' '}
              <Link to="/login" className="text-black hover:underline">
                {t('auth.login')}
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder={t('auth.firstName')} 
                  className="px-4 py-3 border bg-[#f7f5f1] border-gray-500 rounded focus:outline-none focus:border-black"
                />
                
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder={t('auth.lastName')}
                  className="px-4 py-3 border bg-[#f7f5f1] border-gray-500 rounded focus:outline-none focus:border-black"
                />
              </div>
              
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder={t('auth.email')}
                className="w-full px-4 py-3 border bg-[#f7f5f1] border-gray-500 rounded focus:outline-none focus:border-black"
              />

              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder={t('auth.phone')}
                className="w-full px-4 py-3 border bg-[#f7f5f1] border-gray-500 rounded focus:outline-none focus:border-black"
              />
              
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder={t('auth.password')}
                className="w-full px-4 py-3 border bg-[#f7f5f1] border-gray-500 rounded focus:outline-none focus:border-black"
              />
              
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder={t('auth.confirmPassword')}
                className="w-full px-4 py-3 border bg-[#f7f5f1] border-gray-500 rounded focus:outline-none focus:border-black"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
            >
              {isLoading ? <Loading size="sm" /> : t('auth.createAccount')}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
