// Base API utilities
// Common functions and configuration for all API calls

// For Vercel deployment, this will be the domain where your app is deployed
// In development: http://localhost:3001
// In production: https://your-app-name.vercel.app
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Generic API request handler
export const apiRequest = async <T = any>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Important for Supabase auth cookies
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API Error for ${endpoint}:`, error);
    throw error;
  }
};