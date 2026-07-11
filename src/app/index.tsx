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
            (async () => {
                try {
                    const result = await login();
                    if (result) {
                        await refresh();
                    }
                } catch (e) {
                    console.error('Login error:', e);
                }
            })();
        }
    }, [isLoading, isAuthenticated]);

    return <ActivityIndicator />;
}
