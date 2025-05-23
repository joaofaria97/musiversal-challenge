import axios, { AxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const customInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const customInstanceAsync = async <T>({
  url,
  method,
  params,
  data,
  headers,
}: AxiosRequestConfig): Promise<T> => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });

  instance.interceptors.request.use(
    (config) => {
      // You can add auth token here
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const response = await instance.request<T>({
    url,
    method,
    params,
    data,
  });

  return response.data;
}; 