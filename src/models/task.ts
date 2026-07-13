import { DictionaryValue } from '@/models/dictionary-value';

export type Task = {
    employeeTaskId: number;
    assigneeUserId: string;
    assigneeFirstName: string;
    assigneeLastName: string;
    createdByUserId: string;
    createdByFirstName: string;
    createdByLastName: string;
    roomId: number | null;
    roomNumber: string | null;
    reservationId: number | null;
    taskType: DictionaryValue;
    status: DictionaryValue;
    title: string;
    description: string | null;
    priority: number;
    dueAt: string | null;
    createdAt: string;
    startedAt: string | null;
    completedAt: string | null;
};

export type TasksFilterParams = {
    query?: string;
    taskTypeCodes?: string[];
    dueFrom?: string;
    dueTo?: string;
};

export type PageableParams = {
    page: number;
    pageSize: number;
    sort?: string;
};
