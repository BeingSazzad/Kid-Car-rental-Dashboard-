import { ENV } from '@/config/env';

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Standard API client for dashboard requests.
 * Prepared for live backend integration with JWT auth header handling.
 */
export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('h2s_auth_token');

  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const url = endpoint.startsWith('http') ? endpoint : `${ENV.API_URL}${endpoint}`;

  try {
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    return { success: true, data };
  } catch (error: any) {
    return { success: false, data: null as any, message: error.message || 'Network error' };
  }
}
