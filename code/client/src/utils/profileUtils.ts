/**
 * Utility functions for profile URL handling
 */

/**
 * Generate a profile URL using username
 * @param username - User's username 
 * @param tab - Optional tab to navigate to
 * @returns Profile URL string
 */
export const getProfileUrl = (username: string, tab?: string): string => {
  const baseUrl = `/profile/${username}`;
  return tab ? `${baseUrl}?tab=${tab}` : baseUrl;
};

/**
 * Get current user's profile URL
 * @param user - Current user object
 * @param tab - Optional tab to navigate to
 * @returns Profile URL string or fallback
 */
export const getCurrentUserProfileUrl = (user: any, tab?: string): string => {
  const username = user?.user_metadata?.username;
  if (!username) {
    // Fallback to basic profile route if no username
    return tab ? `/profile?tab=${tab}` : '/profile';
  }
  return getProfileUrl(username, tab);
};

/**
 * Extract username from a profile URL
 * @param url - Profile URL
 * @returns username or null
 */
export const extractUsernameFromUrl = (url: string): string | null => {
  const match = url.match(/\/profile\/([^/?]+)/);
  return match ? match[1] : null;
};