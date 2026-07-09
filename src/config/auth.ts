export const authConfig = {
    clientId: 'hms-mobile',

    scopes: ['openid', 'profile', 'read'],

    authorizationEndpoint: 'http://10.0.2.2:8081/oauth2/authorize',

    tokenEndpoint: 'http://10.0.2.2:8081/oauth2/token',

    redirectUri: 'hms://callback',
};
