import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/config/theme';

type Props = {
    statusCode: string;
    children: string;
};

export default function TaskStatusBadge({ statusCode, children }: Props) {
    return (
        <View style={[styles.badge, { backgroundColor: getTaskStatusColor(statusCode) }]}>
            <Text style={styles.text}>{children}</Text>
        </View>
    );
}

export function getTaskStatusColor(statusCode: string) {
    switch (statusCode.toLowerCase()) {
        case 'assigned':
            return colors.info;

        case 'in_progress':
            return colors.warning;

        case 'completed':
            return colors.success;

        case 'cancelled':
            return colors.danger;

        default:
            return colors.neutral;
    }
}

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
    },

    text: {
        color: 'white',
        fontWeight: '600',
        fontSize: 12,
    },
});
