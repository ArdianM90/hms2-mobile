import { environment } from '@/config/environment';

export const authConfig = {
    clientId: 'hms-mobile',
    scopes: ['openid', 'profile', 'read'],
    authorizationEndpoint: `${environment.authServer}/oauth2/authorize`,
    tokenEndpoint: `${environment.authServer}/oauth2/token`,
    redirectUri: 'hms://callback',
};
