import { View, Text, FlatList, ActivityIndicator, StyleSheet, Pressable } from 'react-native';
import { useAuth } from '@/auth/AuthContext';
import { useEffect, useState } from 'react';
import { colors } from '@/config/theme';
import { Task } from '@/models/task';
import { getTasks } from '@/services/task-service';
import TaskStatusBadge from '@/components/TaskStatusBadge';
import { formatDate } from '@/utils/formatters';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DictionaryValue } from '@/models/dictionary-value';
import { DictionaryType, getDictionary } from '@/services/dictionaryService';

export default function Tasks() {
    const { hasRole } = useAuth();
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState(0);
    const [showPicker, setShowPicker] = useState(false);

    const today = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(today);
    const [statuses, setStatuses] = useState<DictionaryValue[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<string | undefined>();

    const DEFAULT_PAGEABLE = {
        page: 1,
        pageSize: 20,
        sort: 'dueAt,asc',
    };

    useEffect(() => {
        void loadStatuses();
    }, []);

    async function loadStatuses() {
        const result = await getDictionary(DictionaryType.TASK_STATUS);

        setStatuses(result);
    }

    useEffect(() => {
        void loadTasks();
    }, [selectedDate, selectedStatus]);

    async function loadTasks() {
        setLoading(true);

        try {
            const result = await getTasks(
                {
                    dueFrom: selectedDate,
                    dueTo: selectedDate,
                    taskStatusCodes: selectedStatus ? [selectedStatus] : undefined,
                },
                DEFAULT_PAGEABLE,
            );

            setTasks(result.results);
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
            data={tasks}
            keyExtractor={(item) => item.employeeTaskId.toString()}
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
                        <Text style={styles.dateButtonText}>📅 Termin: {selectedDate}</Text>
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

                    <Text style={styles.emptyTitle}>Brak zadań</Text>

                    <Text style={styles.emptyText}>
                        Dla wybranego dnia nie znaleziono żadnych zadań.
                    </Text>
                </View>
            }

            renderItem={({ item }) => (
                <Pressable
                    style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
                    onPress={() => {
                        router.push({
                            pathname: '/task/[taskId]',
                            params: { taskId: item.employeeTaskId.toString() },
                        });
                    }}
                >
                    <Text style={styles.title}>{item.title}</Text>

                    {hasRole('ROLE_ADMIN') && (
                        <Text style={styles.assignee}>
                            {item.assigneeFirstName} {item.assigneeLastName}
                        </Text>
                    )}

                    <Text style={styles.type}>{item.taskType.name}</Text>

                    <View style={styles.details}>
                        <View style={styles.row}>
                            <TaskStatusBadge statusCode={item.status.code}>
                                {item.status.name}
                            </TaskStatusBadge>

                            <Text style={styles.due}>
                                {formatDate(item.dueAt) ?? 'brak terminu'}
                            </Text>
                        </View>

                        <Text style={styles.priority}>Priorytet {item.priority}</Text>
                    </View>
                </Pressable>
            )}
        />
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.background,
        borderRadius: 12,
        padding: 16,
        marginBottom: 14,
        elevation: 3,
        gap: 6,
    },

    cardPressed: {
        backgroundColor: colors.secondaryPressed,
        transform: [{ scale: 0.98 }],
    },

    title: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text,
    },

    assignee: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.primary,
        marginBottom: 4,
    },

    type: {
        fontSize: 14,
        marginLeft: 12,
        fontWeight: '600',
        color: colors.text,
    },

    details: {
        marginLeft: 12,
        marginTop: 6,
        gap: 6,
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    due: {
        fontSize: 13,
        color: colors.textLightGrey,
    },

    priority: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textGrey,
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
