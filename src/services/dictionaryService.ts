import { api } from '@/api/api';

export type DictionaryValue = {
    code: string;
    name: string;
};

export const DictionaryType = {
    RESERVATION_STATUS: 'reservation_status',
    TASK_STATUS: 'task_status',
} as const;

export async function getDictionary(dictionaryType: string): Promise<DictionaryValue[]> {
    const response = await api.get<DictionaryValue[]>(`/dictionaries/${dictionaryType}`);

    return response.data;
}
