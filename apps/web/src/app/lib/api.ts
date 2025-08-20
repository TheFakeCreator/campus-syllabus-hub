
import axios from 'axios';
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { ApiResponse } from '../../types/api';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

// Interceptor for refresh-token flow
api.interceptors.response.use(
    (response: AxiosResponse<ApiResponse<any>>) => response,
    async (error: AxiosError<ApiResponse<any>>) => {
        if (error.response?.status === 401) {
            try {
                // Attempt refresh
                await api.post('/auth/refresh');
                // Retry original request
                if (error.config) {
                    return api.request(error.config as AxiosRequestConfig);
                }
            } catch (refreshError) {
                // If refresh fails, reject
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
