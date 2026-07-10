import { Stack } from 'expo-router';
import { AuthProvider } from '@/auth/AuthContext';

export default function RootLayout() {
    return (
        <AuthProvider>
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: '#f6f4f5' },
                }}
            />
        </AuthProvider>
    );
}
