// components/Auth/TokenTest.jsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { refreshToken, logoutUser } from '../../store/slices/authSlice';
import axiosInstance from '../../api/axios';
import { isTokenExpired, getTimeUntilExpiry } from '../../utils/tokenUtils';
import { performLogout } from '../../utils/authUtils';

const TokenTest = () => {
  const dispatch = useDispatch();
  const { accessToken, isAuthenticated } = useSelector(state => state.auth);
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleManualRefresh = async () => {
    setLoading(true);
    try {
      const result = await dispatch(refreshToken());
      if (refreshToken.fulfilled.match(result)) {
        setTestResult('✅ Manual refresh successful');
      } else {
        setTestResult('❌ Manual refresh failed: ' + result.payload?.message);
      }
    } catch (error) {
      setTestResult('❌ Manual refresh error: ' + error.message);
    }
    setLoading(false);
  };

  const handleProtectedRequest = async () => {
    setLoading(true);
    try {
      // Make a request that requires authentication
      const response = await axiosInstance.get('/user/profile', {withCredentials: true});
      setTestResult('✅ Protected request successful');
    } catch (error) {
      setTestResult('❌ Protected request failed: ' + error.message);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await dispatch(logoutUser());
      setTestResult('✅ Logout successful');
    } catch (error) {
      setTestResult('❌ Logout failed: ' + error.message);
    }
    setLoading(false);
  };

  const handleForceLogout = () => {
    performLogout('user_logout', true);
  };

  if (!isAuthenticated) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">
        <p>Please login to test token functionality</p>
      </div>
    );
  }

  const tokenExpired = isTokenExpired(accessToken);
  const timeLeft = getTimeUntilExpiry(accessToken);

  return (
    <div className="p-6 bg-[#f7f5f1] border rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Token Test Panel</h3>
      
      <div className="space-y-4">
        <div className="p-3 bg-gray-50 rounded">
          <h4 className="font-medium mb-2">Token Status</h4>
          <p className="text-sm">
            <span className="font-medium">Expired:</span> 
            <span className={tokenExpired ? 'text-red-600' : 'text-green-600'}>
              {tokenExpired ? ' Yes' : ' No'}
            </span>
          </p>
          <p className="text-sm">
            <span className="font-medium">Time until expiry:</span> 
            <span className="text-gray-600">
              {timeLeft > 0 ? ` ${Math.round(timeLeft / 1000)}s` : ' Expired'}
            </span>
          </p>
          <p className="text-sm break-all">
            <span className="font-medium">Token:</span> 
            <span className="text-gray-600 text-xs">
              {accessToken ? `${accessToken.substring(0, 20)}...` : 'None'}
            </span>
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleManualRefresh}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Refreshing...' : 'Manual Refresh'}
          </button>
          
          <button
            onClick={handleProtectedRequest}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Protected Request'}
          </button>

          <button
            onClick={handleLogout}
            disabled={loading}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
          >
            {loading ? 'Logging out...' : 'Logout'}
          </button>

          <button
            onClick={handleForceLogout}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            Force Logout
          </button>
        </div>

        {testResult && (
          <div className={`p-3 rounded ${
            testResult.startsWith('✅') 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {testResult}
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenTest;