import { View, Text, FlatList, ActivityIndicator, StyleSheet, Pressable } from 'react-native';
import { useAuth } from '@/auth/AuthContext';
import { useEffect, useState } from 'react';
import { Reservation } from '@/models/reservation';
import { getReservations } from '@/services/reservation-service';
import { colors } from '@/config/theme';

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
                <Pressable
                    style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
                    onPress={() => {
                        // router.push(`/reservations/${item.reservationId}`);
                    }}
                >
                    <View style={styles.leftBorder} />

                    <View style={styles.content}>
                        <Text style={styles.date}>
                            {item.startDate} — {item.endDate}
                        </Text>

                        {hasRole('ROLE_ADMIN') && (
                            <Text style={styles.guest}>
                                {item.guestFirstName} {item.guestLastName}
                            </Text>
                        )}

                        <View style={styles.row}>
                            <Text style={styles.label}>{item.reservationStatus.label}</Text>

                            <Text style={styles.price}>{item.totalPrice.toFixed(2)} zł</Text>
                        </View>

                        <Text style={styles.small}>
                            {item.roomsQty} pokój • {item.daysQty} dni
                        </Text>
                    </View>
                </Pressable>
            )}
        />
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: colors.background,
        borderRadius: 12,
        marginBottom: 14,
        elevation: 3,
        overflow: 'hidden',
    },

    cardPressed: {
        backgroundColor: colors.secondaryPressed,
        transform: [{ scale: 0.98 }],
    },

    leftBorder: {
        width: 6,
        backgroundColor: colors.primary,
    },

    content: {
        flex: 1,
        padding: 16,
        gap: 6,
    },

    date: {
        fontSize: 17,
        fontWeight: '700',
        color: colors.text,
    },

    guest: {
        fontSize: 15,
        color: colors.textGrey,
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 6,
    },

    label: {
        color: colors.primary,
        fontWeight: '600',
    },

    price: {
        fontWeight: '700',
        fontSize: 16,
    },

    small: {
        color: colors.textLightGrey,
        marginTop: 4,
    },
});
