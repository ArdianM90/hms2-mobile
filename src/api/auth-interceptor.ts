import { InternalAxiosRequestConfig } from 'axios';
import { getValidAccessToken } from '@/auth/token-refresh';

export async function authInterceptor(config: InternalAxiosRequestConfig) {
    const token = await getValidAccessToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}
