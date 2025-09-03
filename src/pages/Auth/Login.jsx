
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { loginUser } from '../../store/slices/authSlice';
import Loading from '../../components/UI/Loading';
import { auth, googleProvider, facebookProvider } from '../../firebase/config';
import toast from 'react-hot-toast';
import { browserPopupRedirectResolver, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { isAuthenticated, isLoading, error } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [socialLoading, setSocialLoading] = useState({
    google: false,
    facebook: false
  });

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);


  // Handle Submit Through registered email
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      const user = userCredential.user;

      // console.log('User logged in:', user);
      const localCart = localStorage.getItem('localCart')

      if (!user.emailVerified) {
        await signOut(auth);
        dispatch(mergeCarts(localCart));
        // dispatch(clearLocalCart());
        toast.warning(t('auth.verifyEmailWarning'));
        navigate('/verify-email', { 
          state: { email: user.email, uid: user.uid } 
        });
        return;
      }

      const userData = {
        ...formData,
        uid: user.uid,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        provider: 'email',
      }

      const result = await dispatch(loginUser(userData)).unwrap();
     
      
      if (result?.success) {
        toast.success(t('auth.loginSuccess'));
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 500);
      }
    } catch (error) {
      // console.error('Login error:', error);

      if(error.code?.startsWith('auth/')) {
        const errorMap = {
          'auth/user-not-found': t('auth.errors.userNotFound'),
          'auth/wrong-password': t('auth.errors.wrongPassword'),
          'auth/too-many-requests': t('auth.errors.tooManyRequests'),
          'auth/user-disabled': t('auth.errors.accountDisabled')
        };
        toast.error(errorMap[error.code] || t('auth.loginFailed'));
      }
      toast.error(t('auth.loginFailed'));
    }
  };

  const handleSocialLogin = async (provider, providerType) => {
    setSocialLoading((prev) => ({ ...prev, [providerType]: true }));
    
    try {
      const result = await signInWithPopup(auth, provider );
      const user = result.user;

      // console.log(`${providerType} login successful:`, user);

      // Create user data for Redux store
      const userData = {
        email: user.email,
        password: `AUTH-${providerType}-${user.uid}`,
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
        provider: providerType.toLowerCase()
      };

      // Dispatch to Redux store (you might need to adapt this based on your loginUser action)
      const dispatchResult = await dispatch(loginUser(userData)).unwrap();
      if (dispatchResult?.success) {
        toast.success(t(`auth.loginSuccess`) || t('auth.loginSuccess'));
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 500);
      } else {
        toast.error(t('auth.loginFailed'));
      }
    } catch (error) {
      // console.error(`${providerType} login error:`, error);
      
      const errorMap = {
        'auth/account-exists-with-different-credential': 
          t('auth.errors.accountExistsWithDifferentCredential'),
        'auth/auth-domain-config-required': 
          t('auth.errors.authDomainConfigRequired'),
        'auth/cancelled-popup-request': 
          t('auth.errors.cancelledPopupRequest'),
        'auth/operation-not-allowed': 
          t('auth.errors.operationNotAllowed'),
        'auth/popup-closed-by-user': 
          t('auth.errors.popupClosedByUser')
      };
      
      toast.error(errorMap[error.code] || t('auth.socialLoginFailed'));
    } finally {
      setSocialLoading(prev => ({ ...prev, [providerType]: false }));
    }
  }

  // Handle Google & Facebook Auth
  const handleGoogleLogin = () => handleSocialLogin(googleProvider, 'Google');
  const handleFacebookLogin = () => handleSocialLogin(facebookProvider, 'Facebook');


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <Helmet>
        <title>{`${t('auth.login')} - UAE`}</title>
      </Helmet>

      <div className="min-h-screen flex items-center bg-[#f7f5f1] pt-32 justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md bg-gray-50 py-4 px-4 rounded-xl w-full space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-center">{t('auth.login')}</h1>
            <p className="mt-2 text-center text-gray-600">
              {t('auth.dontHaveAccount')}{' '}
              <Link to="/register" className="text-black hover:underline">
                {t('auth.createAccount')}
              </Link>
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder={t('auth.email')}
                className="w-full px-4 py-3 border bg-[#f7f5f1] border-gray-500 rounded focus:outline-none focus:border-black focus:ring-2 focus:ring-gray-500"
              />
              
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder={t('auth.password')}
                className="w-full px-4 py-3 border bg-[#f7f5f1] border-gray-500 rounded focus:outline-none focus:border-black focus:ring-2 focus:ring-gray-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <Link
                to="/forgot-password"
                className="text-sm text-black hover:underline"
              >
                {t('auth.forgotPassword')}
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
            >
              {isLoading ? <Loading size="sm" /> : t('auth.login')}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">
                {t('auth.orContinueWith') || 'Or continue with'}
              </span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleGoogleLogin}
              disabled={socialLoading.google}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-[#f7f5f1] text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
            >
              {socialLoading.google ? (
                <Loading size="sm" />
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {t('auth.continueWithGoogle') || 'Continue with Google'}
                </>
              )}
            </button>

            <button
              onClick={handleFacebookLogin}
              disabled={socialLoading.facebook}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {socialLoading.facebook ? (
                <Loading size="sm" />
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  {t('auth.continueWithFacebook') || 'Continue with Facebook'}
                </>
              )}
            </button>
          </div>


        </div>
      </div>
    </>
  );
};

export default Login;
