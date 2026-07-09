import { Button, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { login } from '@/auth/oauth';
import { getAccessToken } from '@/auth/storage';

export default function LoginPage() {
    const router = useRouter();

    async function handleLogin() {
        console.log('Kliknięto login');

        try {
            await login();

            const token = await getAccessToken();

            if (!token) {
                throw new Error('Token nie został zapisany');
            }

            router.replace('/dashboard');
        } catch (e) {
            console.error('Błąd logowania:', e);
        }
    }

    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                gap: 20,
            }}
        >
            <Text
                style={{
                    fontSize: 28,
                }}
            >
                HMS Mobile
            </Text>

            <Button title="Zaloguj" onPress={handleLogin} />
        </View>
    );
}
