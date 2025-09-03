// src/services/authService.js
import axios from 'axios';
import { auth } from '../firebase/config';
import { serverUrl } from '../services/url'

export const checkVerification = async (uid) => {
  try {
    const response = await axios.post(`${serverUrl}/auth/verify-email`, { uid });
    console.log(response)
    return response.data.success;
  } catch (error) {
    console.error('Verification check failed:', error);
    return false;
  }
};

export const isEmailVerified = async () => {
  await auth.currentUser?.reload();
  return auth.currentUser?.emailVerified || false;
};