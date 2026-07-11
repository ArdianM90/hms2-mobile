import { api } from '@/api/api';
import { Reservation } from '@/models/reservation';

export async function getReservations(isAdmin: boolean): Promise<Reservation[]> {
    const endpoint = isAdmin ? '/reservations/all' : '/reservations';

    const response = await api.get<Reservation[]>(endpoint);

    return response.data;
}
