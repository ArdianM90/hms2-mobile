import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

import { authConfig } from '@/config/auth';
import { saveTokens } from '@/auth/storage';

WebBrowser.maybeCompleteAuthSession();

let loginPromise: ReturnType<typeof performLogin> | null = null;

export function login() {
    if (loginPromise) {
        return loginPromise;
    }
    loginPromise = performLogin().finally(() => {
        loginPromise = null;
    });
    return loginPromise;
}

async function performLogin() {
    const discovery = await AuthSession.fetchDiscoveryAsync(
        authConfig.authorizationEndpoint.replace('/oauth2/authorize', ''),
    );

    const request = new AuthSession.AuthRequest({
        clientId: authConfig.clientId,
        scopes: authConfig.scopes,
        redirectUri: authConfig.redirectUri,
        responseType: AuthSession.ResponseType.Code,
        usePKCE: true,
    });

    const result = await request.promptAsync(discovery);
    if (result.type !== 'success') {
        throw new Error(`OAuth failed: ${result.type}`);
    }

    const tokenResult = await AuthSession.exchangeCodeAsync(
        {
            clientId: authConfig.clientId,
            code: result.params.code,
            redirectUri: authConfig.redirectUri,
            extraParams: {
                code_verifier: request.codeVerifier!,
            },
        },
        discovery,
    );
    await saveTokens(tokenResult.accessToken, tokenResult.refreshToken ?? '');
    return tokenResult;
}
