import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useAuth } from '@/auth/AuthContext';

export default function Dashboard() {
    const { sub, hasRole } = useAuth();

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
                        onPress={() => {}}
                    >
                        <Text style={styles.buttonText}>Pokaż moje rezerwacje</Text>
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
        color: '#2a2a2a',
    },

    buttonGroup: {
        width: '100%',
        gap: 14,
    },

    button: {
        backgroundColor: '#6b1020',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 3,
    },

    buttonPressed: {
        backgroundColor: '#540c19',
    },

    buttonText: {
        color: 'white',
        fontSize: 17,
        fontWeight: '600',
    },
});
