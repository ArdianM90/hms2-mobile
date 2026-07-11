import { InternalAxiosRequestConfig } from 'axios';
import { getAccessToken } from '@/auth/storage';

export async function authInterceptor(config: InternalAxiosRequestConfig) {
    const token = await getAccessToken();

    console.log('Interceptor token:', token);

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Authorization header added');
    } else {
        console.log('No token!');
    }
    console.log('REQUEST HEADERS:', config.headers);
    return config;
}
