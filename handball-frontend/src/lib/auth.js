// Simple authentication utility for admin panel
// For now, using hardcoded credentials and localStorage

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin'
};

const AUTH_KEY = 'admin_auth';

export function login(username, password) {
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    const authData = {
      username: username,
      loggedIn: true,
      timestamp: Date.now()
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
    }
    return { success: true };
  }
  return { success: false, error: 'Invalid username or password' };
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_KEY);
  }
}

export function isAuthenticated() {
  if (typeof window === 'undefined') return false;
  
  try {
    const authData = localStorage.getItem(AUTH_KEY);
    if (!authData) return false;
    
    const parsed = JSON.parse(authData);
    // Check if session is still valid (24 hours)
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    if (Date.now() - parsed.timestamp > maxAge) {
      logout();
      return false;
    }
    
    return parsed.loggedIn === true;
  } catch (error) {
    return false;
  }
}

export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  
  try {
    const authData = localStorage.getItem(AUTH_KEY);
    if (!authData) return null;
    
    const parsed = JSON.parse(authData);
    return parsed.username || null;
  } catch (error) {
    return null;
  }
}
