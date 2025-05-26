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
    const token = await AsyncStorage.getItem('token');
    console.log('Fetching products with token:', token); // Debug
    const response = await fetch('http://10.0.2.2:8000/products', {
      method: 'GET',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });
    console.log('Response status:', response.status); // Debug
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Raw products response:', data); // Debug
    return Array.isArray(data.products) ? data.products : [];
  } catch (error) {
    console.error('getProducts error:', error);
    throw error;
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`http://10.0.2.2:8000/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    console.error('deleteProduct error:', error);
    throw error;
  }
}

export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  const response = await api.post('/products', product);
  return response.data;
};

export const updateProduct = async (id: number, product: Omit<Product, 'id'>): Promise<Product> => {
  const response = await api.put(`/products/${id}`, product);
  return response.data;
};


export default api;