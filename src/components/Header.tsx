import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/auth/AuthContext';

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
        backgroundColor: '#6b1020',
        elevation: 8,
    },

    header: {
        height: 60,
        backgroundColor: '#6b1020',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },

    logo: {
        color: 'white',
        fontWeight: '700',
        fontSize: 22,
    },

    logout: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});
