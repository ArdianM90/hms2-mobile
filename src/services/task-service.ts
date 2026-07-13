import { api } from '@/api/api';
import { PageableParams, Task, TasksFilterParams } from '@/models/task';
import { PageableResult } from '@/models/pageable';

export async function getTasks(filters: TasksFilterParams, pageable: PageableParams) {
    const response = await api.get<PageableResult<Task[]>>(`/tasks`, {
        params: {
            ...filters,
            ...pageable,
        },
    });

    return response.data;
}

export async function getTask(taskId: number): Promise<Task> {
    const response = await api.get<Task>(`/tasks/${taskId}`);

    return response.data;
}
