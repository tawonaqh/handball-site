// Simple authentication utility for admin panel
// For now, using hardcoded credentials and localStorage

const ADMIN_CREDENTIALS = {
  username: 'admin',
  email: 'admin@handball263.com',
  password: 'admin'
};

const AUTH_KEY = 'admin_auth';

export async function login(emailOrUsername, password) {
  // Allow login with either email or username
  const isValidCredentials = (
    (emailOrUsername === ADMIN_CREDENTIALS.username || emailOrUsername === ADMIN_CREDENTIALS.email) &&
    password === ADMIN_CREDENTIALS.password
  );

  if (isValidCredentials) {
    const authData = {
      username: ADMIN_CREDENTIALS.username,
      email: ADMIN_CREDENTIALS.email,
      loggedIn: true,
      timestamp: Date.now()
    };
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
      // Also set cookie for middleware
      document.cookie = `admin_auth=${JSON.stringify(authData)}; path=/; max-age=${24 * 60 * 60}`;
    }
    
    return true;
  }
  
  return false;
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_KEY);
    // Also remove cookie
    document.cookie = 'admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
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
