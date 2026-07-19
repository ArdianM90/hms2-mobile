import * as AuthSession from 'expo-auth-session';
import { jwtDecode } from 'jwt-decode';
import { authConfig } from '@/config/auth';
import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from '@/auth/storage';

let refreshPromise: Promise<string | null> | null = null;

export async function getValidAccessToken(): Promise<string | null> {
    const token = await getAccessToken();
    if (!token) {
        return null;
    }

    if (isExpiringSoon(token)) {
        if (!refreshPromise) {
            refreshPromise = doRefresh().finally(() => {
                refreshPromise = null;
            });
        }
        return refreshPromise;
    }
    return token;
}

function isExpiringSoon(token: string, skewSeconds = 30): boolean {
    try {
        const { exp } = jwtDecode<{ exp: number }>(token);
        return Date.now() >= exp * 1000 - skewSeconds * 1000;
    } catch {
        return true;
    }
}

async function doRefresh(): Promise<string | null> {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
        await clearTokens();
        return null;
    }

    try {
        const discovery = await AuthSession.fetchDiscoveryAsync(
            authConfig.authorizationEndpoint.replace('/oauth2/authorize', ''),
        );
        const result = await AuthSession.refreshAsync(
            {
                clientId: authConfig.clientId,
                refreshToken,
            },
            discovery,
        );
        await saveTokens(result.accessToken, result.refreshToken ?? refreshToken);
        return result.accessToken;
    } catch (e) {
        await clearTokens();
        return null;
    }
}
