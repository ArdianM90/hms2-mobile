import { useEffect, useRef } from 'react';
import { ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { login } from '@/auth/oauth';
import { useAuth } from '@/auth/AuthContext';

export default function Index() {
    const { isLoading, isAuthenticated, refresh } = useAuth();
    const loginInProgress = useRef(false);

    useEffect(() => {
        if (isLoading) {
            return;
        }

        if (isAuthenticated) {
            router.replace('/dashboard');
        } else if (!loginInProgress.current) {
            loginInProgress.current = true;
            (async () => {
                try {
                    await login();
                    await refresh();
                } catch (e) {
                    console.error('Login error:', e);
                } finally {
                    loginInProgress.current = false;
                }
            })();
        }
    }, [isLoading, isAuthenticated]);

    return <ActivityIndicator />;
}
