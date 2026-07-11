import { CodeLabel } from '@/models/code-label';

export type Reservation = {
    reservationId: number;
    guestFirstName?: string;
    guestLastName?: string;
    startDate: string;
    endDate: string;
    createdAt: string;
    updatedAt: string;
    daysQty: number;
    reservationStatus: CodeLabel;
    reservationSource: CodeLabel;
    totalPrice: number;
    roomsQty: number;
};
