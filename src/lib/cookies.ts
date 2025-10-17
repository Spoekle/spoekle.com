/**
 * Cookie utility functions for client-side cookie management
 */

export const cookieUtils = {
  /**
   * Set a cookie
   * @param name Cookie name
   * @param value Cookie value
   * @param days Number of days until expiration (default: 7)
   */
  set: (name: string, value: string, days: number = 7): void => {
    if (typeof window === 'undefined') return;
    
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    
    // Set cookie with Secure, HttpOnly-like behavior (SameSite=Strict for CSRF protection)
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict${
      window.location.protocol === 'https:' ? ';Secure' : ''
    }`;
  },

  /**
   * Get a cookie value by name
   * @param name Cookie name
   * @returns Cookie value or null if not found
   */
  get: (name: string): string | null => {
    if (typeof window === 'undefined') return null;
    
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    
    return null;
  },

  /**
   * Remove a cookie
   * @param name Cookie name
   */
  remove: (name: string): void => {
    if (typeof window === 'undefined') return;
    
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Strict`;
  },

  /**
   * Check if a cookie exists
   * @param name Cookie name
   * @returns true if cookie exists, false otherwise
   */
  exists: (name: string): boolean => {
    return cookieUtils.get(name) !== null;
  },
};
