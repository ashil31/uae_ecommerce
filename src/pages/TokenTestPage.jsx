// pages/TokenTestPage.jsx
import React from 'react';
import TokenTest from '../components/Auth/TokenTest';
import { useAuth } from '../hooks/useAuth';

const TokenTestPage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Token Management Test</h1>
        
        {isAuthenticated ? (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-green-800 mb-2">
                ✅ Authenticated User
              </h2>
              <p className="text-green-700">
                Welcome, {user?.email || 'User'}! You can test token functionality below.
              </p>
            </div>
            
            <TokenTest />
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                How to Test Token Refresh & Logout:
              </h3>
              <ul className="text-blue-700 space-y-2">
                <li>• <strong>Manual Refresh:</strong> Test the refresh token functionality manually</li>
                <li>• <strong>Test Protected Request:</strong> Make an API call that requires authentication</li>
                <li>• <strong>Logout:</strong> Test normal logout functionality</li>
                <li>• <strong>Force Logout:</strong> Test immediate logout with session cleanup</li>
                <li>• <strong>Wait for Auto-Refresh:</strong> Token will auto-refresh 2 minutes before expiry</li>
                <li>• <strong>Refresh Token Expiry:</strong> When refresh token expires (after 1 day), user will be automatically logged out</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">
              ⚠️ Not Authenticated
            </h2>
            <p className="text-yellow-700 mb-4">
              Please login to test token functionality.
            </p>
            <a 
              href="/login" 
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Go to Login
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenTestPage;