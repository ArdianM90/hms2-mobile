import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '@/auth/AuthContext';
import { useEffect, useState } from 'react';
import { Reservation } from '@/models/reservation';
import { getReservations } from '@/services/reservation-service';

export default function Reservations() {
    const { hasRole } = useAuth();
    const [loading, setLoading] = useState(true);
    const [reservations, setReservations] = useState<Reservation[]>([]);

    useEffect(() => {
        void loadReservations();
    }, []);

    async function loadReservations() {
        try {
            const data = await getReservations(hasRole('ROLE_ADMIN'));
            setReservations(data);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <ActivityIndicator />;
    }

    return (
        <FlatList
            data={reservations}
            keyExtractor={(item) => item.reservationId.toString()}
            renderItem={({ item }) => (
                <View style={styles.card}>
                    <Text style={styles.title}>
                        {item.startDate} — {item.endDate}
                    </Text>
                    <Text>{item.reservationStatus.label}</Text>
                    <Text>{item.totalPrice} zł</Text>
                </View>
            )}
        />
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 16,
        marginBottom: 8,
        backgroundColor: 'white',
        borderRadius: 8,
    },
    title: {
        fontWeight: '600',
        fontSize: 16,
    },
});
