// tokenRefresh.js
let refreshTimer;

export const startTokenRefreshTimer = (store) => {
  clearTokenRefreshTimer();
  
  const state = store.getState();
  const { accessToken } = state.auth;
  
  if (!accessToken) return;

  try {
    const jwtToken = JSON.parse(atob(accessToken.split('.')[1]));
    const expiresIn = (jwtToken.exp * 1000) - Date.now() - (60 * 1000); // 1 min before expiry
    
    if (expiresIn > 0) {
      refreshTimer = setTimeout(() => {
        store.dispatch(refreshToken())
          .then(() => startTokenRefreshTimer(store))
          .catch(error => {
            console.error('Auto-refresh failed:', error);
            store.dispatch(logoutUser());
          });
      }, expiresIn);
    }
  } catch (error) {
    console.error('Token parsing error:', error);
  }
};

export const clearTokenRefreshTimer = () => {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
};