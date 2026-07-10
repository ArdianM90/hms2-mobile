import { router, Stack, useRouter } from 'expo-router';
import Header from '@/components/Header';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { getAccessToken } from '@/auth/storage';
import { jwtDecode } from 'jwt-decode';
import { AccessToken } from '@/auth/access-token';

export default function Layout() {
    const router = useRouter();

    useEffect(() => {
        checkToken();
    }, []);

    async function checkToken() {
        const token = await getAccessToken();

        if (!token || !isTokenValid(token)) {
            router.replace('/');
        }
    }

    function isTokenValid(token: string) {
        try {
            const jwt = jwtDecode<AccessToken>(token);

            if (!jwt.exp) {
                return false;
            }

            return jwt.exp * 1000 > Date.now();
        } catch {
            return false;
        }
    }

    return (
        <SafeAreaProvider style={styles.container}>
            <Header />

            <View style={styles.content}>
                <Stack
                    screenOptions={{
                        headerShown: false,
                    }}
                />
            </View>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f4f5',
    },

    content: {
        flex: 1,
        padding: 20,
    },
});
