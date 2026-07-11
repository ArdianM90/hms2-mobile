import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useAuth } from '@/auth/AuthContext';
import { colors } from '@/config/theme';
import { useRouter } from 'expo-router';

export default function Dashboard() {
    const router = useRouter();
    const { sub, hasRole } = useAuth();

    const reservationsButtonText = hasRole('ROLE_ADMIN') ? 'Rezerwacje' : 'Moje rezerwacje';

    return (
        <View style={styles.container}>
            <Text style={styles.greeting}>Witaj {sub}</Text>

            <View style={styles.buttonGroup}>
                {(hasRole('ROLE_EMPLOYEE') || hasRole('ROLE_ADMIN')) && (
                    <Pressable
                        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
                        onPress={() => {}}
                    >
                        <Text style={styles.buttonText}>Pokaż moje zadania</Text>
                    </Pressable>
                )}

                {(hasRole('ROLE_GUEST') || hasRole('ROLE_ADMIN')) && (
                    <Pressable
                        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
                        onPress={() => router.push('/reservations')}
                    >
                        <Text style={styles.buttonText}>{reservationsButtonText}</Text>
                    </Pressable>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 32,
    },

    greeting: {
        fontSize: 22,
        fontWeight: '600',
        color: colors.text,
    },

    buttonGroup: {
        width: '100%',
        gap: 14,
    },

    button: {
        backgroundColor: colors.primary,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 3,
    },

    buttonPressed: {
        backgroundColor: colors.primaryPressed,
    },

    buttonText: {
        color: colors.textOnPrimary,
        fontSize: 17,
        fontWeight: '600',
    },
});
