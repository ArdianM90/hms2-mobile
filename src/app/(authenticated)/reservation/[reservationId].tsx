import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ReservationDetails } from '@/models/reservation';
import { getReservation } from '@/services/reservation-service';
import { colors } from '@/config/theme';

export default function ReservationDetailsScreen() {
    const { reservationId } = useLocalSearchParams<{
        reservationId: string;
    }>();

    const [reservation, setReservation] = useState<ReservationDetails | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (reservationId) {
            void loadReservation();
        }
    }, [reservationId]);

    async function loadReservation() {
        try {
            const data = await getReservation(Number(reservationId));

            setReservation(data);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <ActivityIndicator />;
    }

    if (!reservation) {
        return (
            <View style={styles.center}>
                <Text>Nie znaleziono rezerwacji</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Rezerwacja #{reservation.reservationId}</Text>

                <View style={styles.row}>
                    <Text>Status</Text>

                    <Text style={styles.status}>{reservation.reservationStatus.name}</Text>
                </View>

                <View style={styles.row}>
                    <Text>Źródło</Text>

                    <Text>{reservation.reservationSource.name}</Text>
                </View>

                <View style={styles.separator} />

                <Text style={styles.sectionTitle}>Termin</Text>

                <Text style={styles.big}>
                    {reservation.startDate}
                    {'  —  '}
                    {reservation.endDate}
                </Text>

                <View style={styles.separator} />

                <Text style={styles.sectionTitle}>Pokoje</Text>

                {reservation.rooms.map((room) => (
                    <View key={room.roomId} style={styles.room}>
                        <Text style={styles.roomTitle}>Pokój {room.roomNumber}</Text>
                        <Text>Standard: {room.standard.name}</Text>
                        <Text>Piętro: {room.floor}</Text>
                        <Text>Powierzchnia: {room.areaM2} m²</Text>
                        <Text>Maks. osób: {room.capacity}</Text>
                        <Text>Cena/noc: {room.pricePerNight.toFixed(2)} zł</Text>
                    </View>
                ))}

                <View style={styles.separator} />

                <View style={styles.row}>
                    <Text style={styles.sectionTitle}>Razem</Text>

                    <Text style={styles.price}>
                        {reservation.totalPrice !== null
                            ? `${reservation.totalPrice.toFixed(2)} zł`
                            : '-'}
                    </Text>
                </View>

                {reservation.comment && (
                    <>
                        <View style={styles.separator} />

                        <Text style={styles.sectionTitle}>Uwagi</Text>

                        <Text>{reservation.comment}</Text>
                    </>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },

    card: {
        backgroundColor: colors.backgroundSecondary,
        borderRadius: 12,
        padding: 18,
        elevation: 3,
    },

    title: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 16,
        color: colors.primary,
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 8,
        color: colors.primary,
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },

    status: {
        color: colors.primary,
        fontWeight: '700',
    },

    big: {
        fontSize: 18,
        fontWeight: '600',
    },

    price: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.primary,
    },

    separator: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 16,
    },

    room: {
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        padding: 12,
        marginBottom: 10,
    },

    roomTitle: {
        fontSize: 17,
        fontWeight: '700',
        marginBottom: 6,
    },

    grey: {
        color: colors.textGrey,
    },

    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
