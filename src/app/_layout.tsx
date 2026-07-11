import { Stack } from 'expo-router';
import { AuthProvider } from '@/auth/AuthContext';
import { colors } from '@/config/theme';

export default function RootLayout() {
    return (
        <AuthProvider>
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: colors.background },
                }}
            />
        </AuthProvider>
    );
}
