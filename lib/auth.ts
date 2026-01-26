const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '';
const CHANNEL_DOMAIN = process.env.NEXT_PUBLIC_CHANNEL_DOMAIN || 'localhost';

export interface Customer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  type: 'registered' | 'guest';
  created_at: string;
  updated_at: string;
}

export interface RegisterData {
  email: string;
  password: string;
  password_confirmation: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  customer: Customer;
  token: string;
}

interface ApiAuthResponse {
  success: boolean;
  message?: string;
  data: AuthResponse;
}

// Client-side only functions
export function setAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
}

export function removeAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
}

export function setCurrentCustomer(customer: Customer): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('current_customer', JSON.stringify(customer));
  }
}

export function getCurrentCustomer(): Customer | null {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem('current_customer');
    if (!data || data === 'undefined' || data === 'null') {
      return null;
    }
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to parse customer data:', error);
      return null;
    }
  }
  return null;
}

export function removeCurrentCustomer(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('current_customer');
  }
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

// API functions
export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
      'X-Channel-Domain': CHANNEL_DOMAIN,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }

  const apiResponse: ApiAuthResponse = await response.json();
  const result = apiResponse.data;

  console.log('Register response:', result);

  // Store token and customer data
  setAuthToken(result.token);
  setCurrentCustomer(result.customer);

  return result;
}

export async function login(data: LoginData): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
      'X-Channel-Domain': CHANNEL_DOMAIN,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  const apiResponse: ApiAuthResponse = await response.json();
  const result = apiResponse.data;

  // Store token and customer data
  setAuthToken(result.token);
  setCurrentCustomer(result.customer);

  return result;
}

export async function logout(): Promise<void> {
  const token = getAuthToken();

  if (token) {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-API-Key': API_KEY,
          'X-Channel-Domain': CHANNEL_DOMAIN,
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // Clear local storage
  removeAuthToken();
  removeCurrentCustomer();
}

export async function getProfile(): Promise<Customer> {
  const token = getAuthToken();

  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${API_BASE_URL}/auth/profile`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-API-Key': API_KEY,
      'X-Channel-Domain': CHANNEL_DOMAIN,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }

  const apiResponse = await response.json();
  const customer = apiResponse.data?.customer || apiResponse.data;
  setCurrentCustomer(customer);

  return customer;
}
