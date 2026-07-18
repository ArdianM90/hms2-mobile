import { DictionaryValue } from '@/models/dictionary-value';

export type ReservationListItem = {
    reservationId: number;
    guestFirstName: string;
    guestLastName: string;
    startDate: string;
    endDate: string;
    createdAt: string;
    updatedAt: string | null;
    daysQty: number;
    reservationStatus: DictionaryValue;
    reservationSource: DictionaryValue;
    totalPrice: number;
    roomsQty: number;
};

export type ReservationsFilterParams = {
    reservationStatusCode?: string;
    from: string;
    to: string;
};

export type ReservationDetails = {
    reservationId: number;
    createdAt: string;
    updatedAt: string | null;
    startDate: string;
    endDate: string;
    totalPrice: number | null;
    reservationStatus: DictionaryValue;
    reservationSource: DictionaryValue;
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
