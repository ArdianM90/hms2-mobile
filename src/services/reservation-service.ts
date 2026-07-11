import { api } from '@/api/api';
import { ReservationId, ReservationDetails } from '@/models/reservation';

export async function getReservations(isAdmin: boolean): Promise<ReservationId[]> {
    const endpoint = isAdmin ? '/reservations/all' : '/reservations';
    const response = await api.get<ReservationId[]>(endpoint);

    return response.data;
}

export async function getReservation(reservationId: number): Promise<ReservationDetails> {
    const response = await api.get<ReservationDetails>(`/reservations/${reservationId}`);

    return response.data;
}
