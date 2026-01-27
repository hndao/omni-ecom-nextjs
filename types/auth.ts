/**
 * Authentication API functions
 */

import { post, get, put, setAuthToken, removeAuthToken, setCurrentCustomer } from '../lib/api';
import type { LoginCredentials, RegisterData, AuthResponse, Customer } from '../types';

/**
 * Register a new customer
 */
export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await post<{ data: AuthResponse }>('/auth/register', data);
  
  // Store token and customer data
  setAuthToken(response.data.token);
  setCurrentCustomer(response.data.customer);
  
  return response.data;
}

/**
 * Login a customer
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await post<{ data: AuthResponse }>('/auth/login', credentials);
  
  // Store token and customer data
  setAuthToken(response.data.token);
  setCurrentCustomer(response.data.customer);
  
  return response.data;
}

/**
 * Logout the current customer
 */
export async function logout(): Promise<void> {
  try {
    await post('/auth/logout');
  } finally {
    // Always remove token and customer data, even if API call fails
    removeAuthToken();
  }
}

/**
 * Get the current customer's profile
 */
export async function getProfile(): Promise<Customer> {
  const response = await get<{ data: Customer }>('/auth/profile');
  
  // Update stored customer data
  setCurrentCustomer(response.data);
  
  return response.data;
}

/**
 * Update the current customer's profile
 */
export async function updateProfile(data: Partial<Customer>): Promise<Customer> {
  const response = await put<{ data: Customer }>('/auth/profile', data);

  // Update stored customer data
  setCurrentCustomer(response.data);

  return response.data;
}

/**
 * Change the current customer's password
 */
export async function changePassword(data: {
  current_password: string;
  password: string;
  password_confirmation: string;
}): Promise<void> {
  await put('/auth/change-password', data);
}

