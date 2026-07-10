import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getAccessToken, clearTokens as clearStoredTokens } from './storage';
import { AccessToken } from '@/models/access-token';

type AuthState = {
    isLoading: boolean;
    isAuthenticated: boolean;
    sub: string | null;
    roles: string[];
    hasRole: (role: string) => boolean;
    refresh: () => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

function decodeIfValid(token: string): AccessToken | null {
    try {
        const jwt = jwtDecode<AccessToken>(token);
        if (!jwt.exp || jwt.exp * 1000 <= Date.now()) return null;
        return jwt;
    } catch {
        return null;
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);
    const [claims, setClaims] = useState<AccessToken | null>(null);

    async function refresh() {
        const token = await getAccessToken();
        setClaims(token ? decodeIfValid(token) : null);
        setIsLoading(false);
    }

    async function logout() {
        await clearStoredTokens();
        setClaims(null);
    }

    useEffect(() => {
        refresh();
    }, []);

    const value: AuthState = {
        isLoading,
        isAuthenticated: claims !== null,
        sub: claims?.sub ?? null,
        roles: claims?.roles ?? [],
        hasRole: (role) => claims?.roles.includes(role) ?? false,
        refresh,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
