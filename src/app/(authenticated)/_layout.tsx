import { Stack } from 'expo-router';
import Header from '@/components/Header';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';

export default function Layout() {
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
