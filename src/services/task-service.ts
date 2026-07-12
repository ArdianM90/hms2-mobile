import { api } from '@/api/api';
import { Task } from '@/models/task';

export async function getTasks(isAdmin: boolean) {
    const endpoint = isAdmin ? '/tasks' : '/tasks/my';

    const response = await api.get<Task[]>(endpoint);

    return response.data;
}

export async function getTask(taskId: number): Promise<Task> {
    const response = await api.get<Task>(`/tasks/${taskId}`);

    return response.data;
}
