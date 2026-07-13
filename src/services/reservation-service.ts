import { api } from '@/api/api';
import {
    ReservationDetails,
    ReservationListItem,
    ReservationsFilterParams,
} from '@/models/reservation';
import { PageableParams } from '@/models/task';
import { PageableResult } from '@/models/pageable';

export async function getReservations(
    filters: ReservationsFilterParams,
    pageable: PageableParams,
): Promise<PageableResult<ReservationListItem[]>> {
    const response = await api.get<PageableResult<ReservationListItem[]>>('/reservations', {
        params: {
            ...filters,
            ...pageable,
        },
    });

    return response.data;
}

export async function getReservation(reservationId: number): Promise<ReservationDetails> {
    const response = await api.get<ReservationDetails>(`/reservations/${reservationId}`);

    return response.data;
}
