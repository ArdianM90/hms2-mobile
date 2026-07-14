import { View, Text, FlatList, ActivityIndicator, StyleSheet, Pressable } from 'react-native';
import { useAuth } from '@/auth/AuthContext';
import { useEffect, useState } from 'react';
import { getReservations } from '@/services/reservation-service';
import { colors } from '@/config/theme';
import { router } from 'expo-router';
import { ReservationListItem } from '@/models/reservation';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DictionaryValue } from '@/models/dictionary-value';
import { DictionaryType, getDictionary } from '@/services/dictionaryService';

export default function Reservations() {
    const { hasRole } = useAuth();
    const [loading, setLoading] = useState(true);
    const [reservations, setReservations] = useState<ReservationListItem[]>([]);
    const [total, setTotal] = useState(0);
    const [showPicker, setShowPicker] = useState(false);

    const today = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(today);
    const [statuses, setStatuses] = useState<DictionaryValue[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<string | undefined>();

    const DEFAULT_PAGEABLE = {
        page: 1,
        pageSize: 20,
        sort: 'createdAt,desc',
    };

    useEffect(() => {
        void loadStatuses();
    }, []);

    async function loadStatuses() {
        const result = await getDictionary(DictionaryType.RESERVATION_STATUS);

        setStatuses(result);
    }

    useEffect(() => {
        void loadReservations();
    }, [selectedDate, selectedStatus]);

    async function loadReservations() {
        setLoading(true);

        try {
            const result = await getReservations(
                {
                    createdFrom: selectedDate,
                    createdTo: selectedDate,
                    reservationStatusCode: selectedStatus,
                },
                DEFAULT_PAGEABLE,
            );

            setReservations(result.results);
            setTotal(result.total);
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
            ListHeaderComponent={
                <>
                    <View style={styles.statusContainer}>
                        <Pressable
                            style={[styles.statusChip, !selectedStatus && styles.statusChipActive]}
                            onPress={() => setSelectedStatus(undefined)}
                        >
                            <Text
                                style={[
                                    styles.statusText,
                                    !selectedStatus && styles.statusTextActive,
                                ]}
                            >
                                Wszystkie
                            </Text>
                        </Pressable>

                        {statuses.map((status) => (
                            <Pressable
                                key={status.code}
                                style={[
                                    styles.statusChip,
                                    selectedStatus === status.code && styles.statusChipActive,
                                ]}
                                onPress={() => setSelectedStatus(status.code)}
                            >
                                <Text
                                    style={[
                                        styles.statusText,
                                        selectedStatus === status.code && styles.statusTextActive,
                                    ]}
                                >
                                    {status.name}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                    <Pressable
                        style={({ pressed }) => [
                            styles.dateButton,
                            pressed && styles.dateButtonPressed,
                        ]}
                        onPress={() => setShowPicker((prev) => !prev)}
                    >
                        <Text style={styles.dateButtonText}>📅 Utworzono: {selectedDate}</Text>
                    </Pressable>

                    {showPicker && (
                        <DateTimePicker
                            value={new Date(selectedDate)}
                            mode="date"
                            onValueChange={(_event, date) => {
                                setShowPicker(false);
                                if (date) {
                                    setSelectedDate(date.toISOString().split('T')[0]);
                                }
                            }}
                            onDismiss={() => setShowPicker(false)}
                        />
                    )}
                </>
            }
            ListEmptyComponent={
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyIcon}>📋</Text>

                    <Text style={styles.emptyTitle}>Brak rezerwacji</Text>

                    <Text style={styles.emptyText}>
                        Dla wybranego dnia nie znaleziono żadnych rezerwacji.
                    </Text>
                </View>
            }

            renderItem={({ item }) => (
                <Pressable
                    style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
                    onPress={() => {
                        router.push({
                            pathname: '/reservation/[reservationId]',
                            params: { reservationId: item.reservationId.toString() },
                        });
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
                            <Text style={styles.label}>{item.reservationStatus.name}</Text>

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
        backgroundColor: colors.backgroundSecondary,
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

    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 64,
        paddingHorizontal: 24,
    },

    emptyIcon: {
        fontSize: 48,
        marginBottom: 12,
    },

    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 6,
    },

    emptyText: {
        fontSize: 15,
        color: colors.textLightGrey,
        textAlign: 'center',
    },

    dateButton: {
        backgroundColor: colors.background,
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
        marginBottom: 16,
        elevation: 2,
    },

    dateButtonText: {
        fontWeight: '600',
        color: colors.primary,
    },

    dateButtonPressed: {
        backgroundColor: colors.secondaryPressed,
    },

    statusContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12,
    },

    statusChip: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: colors.backgroundSecondary,
    },

    statusChipActive: {
        backgroundColor: colors.primary,
    },

    statusText: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.textGrey,
    },

    statusTextActive: {
        color: '#fff',
    },
});
