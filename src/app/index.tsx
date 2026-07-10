import { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { getAccessToken } from '@/auth/storage';
import { login } from '@/auth/oauth';

export default function Index() {
    useEffect(() => {
        checkAuth();
    }, []);

    async function checkAuth() {
        const token = await getAccessToken();

        if (token) {
            router.replace('/dashboard');
        } else {
            await login();
        }
    }

    return <ActivityIndicator />;
}
