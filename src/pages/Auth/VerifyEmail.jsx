import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { auth } from '../../firebase/config';
import { sendEmailVerification } from 'firebase/auth';
import { checkVerification } from '../../services/authService';
import Loading from '../../components/UI/Loading';
import toast from 'react-hot-toast';

const POLLING_INTERVAL = 5000; // 5 seconds
const MAX_RESEND_ATTEMPTS = 3;

const VerifyEmail = () => {
    const { state } = useLocation();
    const { t } = useTranslation();
    const [email, setEmail] = useState(state?.email || '');
    const [uid, setUid] = useState(state?.uid || '');
    const [isVerified, setIsVerified] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [resendCount, setResendCount] = useState(0);
    const [isPolling, setIsPolling] = useState(true);
    const intervalRef = useRef(null);
    const navigate = useNavigate();

    // Check verification status
    const verifyStatus = async () => {
        try {
            await auth.currentUser?.reload();
            if (auth.currentUser?.emailVerified) {
                clearInterval(intervalRef.current);
                setIsVerified(true);
                const success = await checkVerification(uid);
                if (success) {
                    await auth.signOut();
                    toast.success(t('Email successfully verified!'));
                    navigate('/login', { state: { verified: true } });
                }
            }
        } catch (error) {
            console.error('Verification check failed:', error);
            toast.error(t('Verification check failed'));
        }
    };

    // Handle resend verification email
    const handleResend = async () => {
        if (resendCount >= MAX_RESEND_ATTEMPTS) {
            toast.error(t('Maximum resend attempts reached. Please try again later.'));
            return;
        }

        setIsResending(true);
        try {
            await sendEmailVerification(auth.currentUser);
            setResendCount(prev => prev + 1);
            toast.success(t('Verification email resent!'));
            
            // Restart polling if it was stopped
            if (!isPolling) {
                setIsPolling(true);
                startPolling();
            }
        } catch (error) {
            console.error('Resend failed:', error);
            toast.error(t('Failed to resend verification email'));
        } finally {
            setIsResending(false);
        }
    };

    // Start polling for verification status
    const startPolling = () => {
        intervalRef.current = setInterval(verifyStatus, POLLING_INTERVAL);
    };

    useEffect(() => {
        if (!email || !uid) {
            navigate('/register');
            return;
        }

        // Initial verification check
        verifyStatus();

        // Start polling
        startPolling();

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [email, uid, navigate]);

    // Stop polling after 5 minutes (safety measure)
    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsPolling(false);
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            toast(t('Automatic verification checking has stopped. Please resend the verification email if needed.'));
        }, 300000); // 5 minutes

        return () => clearTimeout(timeout);
    }, []);

    return (
        <>
            <Helmet>
                <title>{`${t('Verify Email')} - UAE`}</title>
            </Helmet>

            <div className="min-h-screen flex pt-32 bg-[#f7f5f1] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold text-center">
                            {t('Verify Your Email')}
                        </h1>
                        <p className="mt-2 text-center text-gray-600">
                            {t('A verification link has been sent to')} <br />
                            <span className="font-medium text-black">{email}</span>
                        </p>
                        <p className="mt-4 text-center text-sm text-gray-500">
                            {t('Please check your inbox and click the verification link to continue.')}
                        </p>
                    </div>

                    <div className="mt-8 space-y-6">
                        {isVerified ? (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-center">
                                <p className="font-medium">{t('Email verified! Redirecting...')}</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {isPolling ? (
                                    <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
                                        <p className="text-sm">
                                            {t('We are checking your verification status automatically.')}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
                                        <p className="text-sm">
                                            {t('Automatic verification checking has stopped. Please resend the verification email if needed.')}
                                        </p>
                                    </div>
                                )}

                                <button
                                    onClick={handleResend}
                                    disabled={isResending || resendCount >= MAX_RESEND_ATTEMPTS}
                                    className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white ${resendCount >= MAX_RESEND_ATTEMPTS ? 'bg-gray-500' : 'bg-black hover:bg-gray-800'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50`}
                                >
                                    {isResending ? (
                                        <Loading size="sm" />
                                    ) : (
                                        resendCount >= MAX_RESEND_ATTEMPTS 
                                            ? t('Resend limit reached')
                                            : t('Resend Verification Email')
                                    )}
                                </button>

                                {resendCount > 0 && (
                                    <p className="text-center text-sm text-gray-500">
                                        {t('Resend attempts')}: {resendCount}/{MAX_RESEND_ATTEMPTS}
                                    </p>
                                )}

                                <div className="text-center">
                                    <p className="text-sm text-gray-600">
                                        {t('Wrong email address?')}{' '}
                                        <Link to="/register" className="text-black hover:underline">
                                            {t('Register again')}
                                        </Link>
                                    </p>
                                </div>

                                <div className="text-center">
                                    <p className="text-sm text-gray-600">
                                        {t('Already verified?')}{' '}
                                        <Link to="/login" className="text-black hover:underline">
                                            {t('Go to login')}
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default VerifyEmail;