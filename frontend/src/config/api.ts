// Get API base URL from environment variable or default to relative path
export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Helper to build full API URL
export const getApiUrl = (path: string): string => {
  // Remove leading slash from path if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  if (API_BASE_URL) {
    // If API_BASE_URL is set, use it (production)
    return `${API_BASE_URL}/${cleanPath}`;
  }
  // Otherwise use relative path (development)
  return `/${cleanPath}`;
};