import axios from 'axios';

import { environment } from '@/config/environment';
import { authInterceptor } from '@/api/auth-interceptor';
import { getValidAccessToken } from '@/auth/token-refresh';
import { clearTokens } from '@/auth/storage';
import { login } from '@/auth/oauth';

export const api = axios.create({
    baseURL: `${environment.apiServer}/api/hms`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(authInterceptor);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config;

        if (error.response?.status === 401 && !original._retry) {
            original._retry = true;

            const token = await getValidAccessToken();
            if (token) {
                original.headers.Authorization = `Bearer ${token}`;
                return api(original);
            }

            await clearTokens();
            await login();
        }
        return Promise.reject(error);
    },
);
