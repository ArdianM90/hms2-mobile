import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/auth/AuthContext';
import { colors } from '@/config/theme';

export default function Header() {
    const router = useRouter();
    const { logout } = useAuth();

    async function handleLogout() {
        await logout();
        router.replace('/');
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Text style={styles.logo}>HMS</Text>
                <Pressable onPress={handleLogout}>
                    <Text style={styles.logout}>Wyloguj</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: colors.background,
        elevation: 8,
    },

    header: {
        height: 60,
        backgroundColor: colors.background,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },

    logo: {
        color: colors.textOnPrimary,
        fontWeight: '700',
        fontSize: 22,
    },

    logout: {
        color: colors.textOnPrimary,
        fontSize: 16,
        fontWeight: '600',
    },
});
