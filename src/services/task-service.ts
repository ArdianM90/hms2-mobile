import { api } from '@/api/api';
import { Task } from '@/models/task';

export async function getTasks(isAdmin: boolean) {
    const endpoint = isAdmin ? '/tasks' : '/tasks/my';

    const response = await api.get<Task[]>(endpoint);

    return response.data;
}
