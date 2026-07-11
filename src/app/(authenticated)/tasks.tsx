import { View, Text, FlatList, ActivityIndicator, StyleSheet, Pressable } from 'react-native';
import { useAuth } from '@/auth/AuthContext';
import { useEffect, useState } from 'react';
import { colors } from '@/config/theme';
import { Task } from '@/models/task';
import { getTasks } from '@/services/task-service';
import TaskStatusBadge from '@/components/TaskStatusBadge';
import { formatDate } from '@/utils/formatters';

export default function Tasks() {
    const { hasRole } = useAuth();
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        void loadTasks();
    }, []);

    async function loadTasks() {
        try {
            const data = await getTasks(hasRole('ROLE_ADMIN'));
            setTasks(data);
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
            renderItem={({ item }) => (
                <Pressable
                    style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
                    onPress={() => {
                        // router.push(`/tasks/${item.taskId}`);
                    }}
                >
                    <Text style={styles.title}>{item.title}</Text>

                    {hasRole('ROLE_ADMIN') && (
                        <Text style={styles.assignee}>
                            {item.assigneeFirstName} {item.assigneeLastName}
                        </Text>
                    )}

                    <Text style={styles.type}>{item.taskType}</Text>

                    <View style={styles.details}>
                        <View style={styles.row}>
                            <TaskStatusBadge statusCode={item.statusCode}>
                                {item.status}
                            </TaskStatusBadge>

                            <Text style={styles.due}>{formatDate(item.dueAt)}</Text>
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
});
