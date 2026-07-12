import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';

import { colors } from '@/config/theme';
import { getTask } from '@/services/task-service';
import { Task } from '@/models/task';
import { formatDate } from '@/utils/formatters';

export default function TaskDetailsScreen() {
    const { taskId } = useLocalSearchParams<{
        taskId: string;
    }>();

    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (taskId) {
            void loadTask();
        }
    }, [taskId]);

    async function loadTask() {
        try {
            const data = await getTask(Number(taskId));
            setTask(data);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <ActivityIndicator />;
    }

    if (!task) {
        return (
            <View style={styles.center}>
                <Text>Nie znaleziono zadania</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>
                    Zadanie #{taskId} - {task.title}
                </Text>

                <View style={styles.row}>
                    <Text>Status</Text>

                    <Text style={styles.status}>{task.status.name}</Text>
                </View>

                <View style={styles.row}>
                    <Text>Typ</Text>

                    <Text>{task.taskType.name}</Text>
                </View>

                <View style={styles.row}>
                    <Text>Priorytet</Text>

                    <Text>{priorityLabel(task.priority)}</Text>
                </View>

                <View style={styles.separator} />

                <Text style={styles.sectionTitle}>Opis</Text>

                <Text>{task.description ?? '-'}</Text>

                <View style={styles.separator} />

                <Text style={styles.sectionTitle}>Przypisanie</Text>

                <View style={styles.row}>
                    <Text>Przypisane do</Text>

                    <Text>
                        {task.assigneeFirstName} {task.assigneeLastName}
                    </Text>
                </View>

                <View style={styles.row}>
                    <Text>Utworzone przez</Text>

                    <Text>
                        {task.createdByFirstName} {task.createdByLastName}
                    </Text>
                </View>

                <View style={styles.separator} />

                <Text style={styles.sectionTitle}>Powiązania</Text>

                <View style={styles.row}>
                    <Text>Pokój</Text>

                    <Text>{task.roomNumber ?? '-'}</Text>
                </View>

                <View style={styles.row}>
                    <Text>Rezerwacja</Text>

                    <Text>{task.reservationId ? `#${task.reservationId}` : '-'}</Text>
                </View>

                <View style={styles.separator} />

                <Text style={styles.sectionTitle}>Daty</Text>

                <View style={styles.row}>
                    <Text>Termin</Text>

                    <Text>{formatDate(task.dueAt) ?? 'brak terminu'}</Text>
                </View>

                <View style={styles.row}>
                    <Text>Utworzono</Text>

                    <Text>{formatDate(task.createdAt)}</Text>
                </View>

                <View style={styles.row}>
                    <Text>Rozpoczęto</Text>

                    <Text>{formatDate(task.startedAt) ?? '-'}</Text>
                </View>

                <View style={styles.row}>
                    <Text>Zakończono</Text>

                    <Text>{formatDate(task.completedAt) ?? 'w trakcie'}</Text>
                </View>
            </View>
        </ScrollView>
    );
}

function priorityLabel(priority: number) {
    switch (priority) {
        case 1:
            return 'Niski';

        case 2:
            return 'Średni';

        case 3:
            return 'Wysoki';

        default:
            return String(priority);
    }
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
        color: colors.text,
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 8,
        color: colors.text,
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

    separator: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 16,
    },

    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
