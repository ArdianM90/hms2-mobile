import { CodeLabel } from '@/models/code-label';

export type ReservationId = {
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

export type ReservationDetails = {
    reservationId: number;
    createdAt: string;
    updatedAt: string | null;
    startDate: string;
    endDate: string;
    totalPrice: number | null;
    reservationStatus: CodeLabel;
    reservationSource: CodeLabel;
    rooms: ReservationRoom[];
    comment: string | null;
};

export type ReservationRoom = {
    roomId: number;
    roomNumber: string;
    standard: {
        code: string;
        name: string;
    };
    capacity: number;
    pricePerNight: number;
    floor: number;
    areaM2: number;
};
