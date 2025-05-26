import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://10.0.2.2:8000',
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.withCredentials = true; // Enable credentials for cookies
  return config;
});

export interface User {
  id: number;
  name: string;
  email: string;
  role?: string; // Optional, as role may not be returned
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await api.post('/users/login', { email, password });
  return response.data;
};

export const register = async (name: string, email: string, password: string): Promise<User> => {
  const response = await api.post('/users/register', { name, email, password });
  return response.data;
};

export const getUser = async (): Promise<User> => {
  const response = await api.get('/users/me');
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.get('/users/logout');
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('user');
};

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await api.get('/products');
    console.log('Raw products response:', response.data);
    return Array.isArray(response.data.products) ? response.data.products : [];
  } catch (error: any) {
    console.error('getProducts error:', error.message, error.stack);
    throw error;
  }
}

export async function createProduct(product: Omit<Product, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Product> {
  try {
    const response = await api.post('/products', product);
    console.log('Create product response:', response.data);
    return response.data.product || response.data;
  } catch (error: any) {
    console.error('createProduct error:', error.message, error.stack);
    throw error;
  }
}

export async function updateProduct(id: string, product: Partial<Omit<Product, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<Product> {
  try {
    const response = await api.put(`/products/${id}`, product);
    console.log('Update product response:', response.data);
    return response.data.product || response.data;
  } catch (error: any) {
    console.error('updateProduct error:', error.message, error.stack);
    throw error;
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    await api.delete(`/products/${id}`);
  } catch (error: any) {
    console.error('deleteProduct error:', error.message, error.stack);
    throw error;
  }
}

export default api;