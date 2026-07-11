import axios from 'axios';

import { environment } from '@/config/environment';
import { authInterceptor } from '@/api/auth-interceptor';

export const api = axios.create({
    baseURL: `${environment.apiServer}/api/hms`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(authInterceptor);
