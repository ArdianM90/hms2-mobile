import { InternalAxiosRequestConfig } from 'axios';
import { getAccessToken } from '@/auth/storage';

export async function authInterceptor(config: InternalAxiosRequestConfig) {
    const token = await getAccessToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}
