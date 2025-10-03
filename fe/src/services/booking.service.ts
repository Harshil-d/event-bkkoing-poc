import { constants } from '../constants/index.constants';
import { headersWithAuth, wrapErrorResponse, wrapEventResponse } from '../helpers/api.helper';
import axios from '../utilities/axios.utility';

export interface IBooking {
  id: string;
  eventId: string;
  userId: string;
  numberOfSeats: number;
  totalAmount: number;
  status: 'CONFIRMED' | 'CANCELLED';
  bookingDate: string;
  createdAt: string;
  updatedAt: string;
  event: {
    id: string;
    title: string;
    eventDate: string;
    location: string;
    price: string;
  };
  user?: {
    id: string;
    fullName: string;
    email: string;
  };
}

export interface IBookingListResponse {
  statusCode: number;
  message: string;
  data: IBooking[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface IBookingResponse {
  statusCode: number;
  message: string;
  data: IBooking;
}

export interface ICreateBookingRequest {
  eventId: string;
  seats: number;
}

export interface IListBookingsQuery {
  page?: number;
  limit?: number;
  status?: 'CONFIRMED' | 'CANCELLED';
}

export const createBooking = async (payload: ICreateBookingRequest): Promise<IBookingResponse> => {
  try {
    const response = await axios.post('/bookings', payload, {
      headers: headersWithAuth(),
    });
    return wrapEventResponse<IBookingResponse>(response);
  } catch (err: any) {
    return wrapErrorResponse<IBookingResponse>(err);
  }
};

export const listMyBookings = async (query: IListBookingsQuery = {}): Promise<IBookingListResponse> => {
  try {
    const response = await axios.get('/bookings/my-bookings', { 
      params: query,
      headers: headersWithAuth(),
    });
    return wrapEventResponse<IBookingListResponse>(response);
  } catch (err: any) {
    return wrapErrorResponse<IBookingListResponse>(err);
  }
};

export const listAllBookings = async (query: IListBookingsQuery = {}): Promise<IBookingListResponse> => {
  try {
    const response = await axios.get('/bookings', { 
      params: query,
      headers: headersWithAuth(),
    });
    return wrapEventResponse<IBookingListResponse>(response);
  } catch (err: any) {
    return wrapErrorResponse<IBookingListResponse>(err);
  }
};

export const getBooking = async (id: string): Promise<IBookingResponse> => {
  try {
    const response = await axios.get(`/bookings/${id}`, {
      headers: headersWithAuth(),
    });
    return wrapEventResponse<IBookingResponse>(response);
  } catch (err: any) {
    return wrapErrorResponse<IBookingResponse>(err);
  }
};

export const cancelBooking = async (id: string): Promise<IBookingResponse> => {
  try {
    const response = await axios.patch(`/bookings/${id}/cancel`, {}, {
      headers: headersWithAuth(),
    });
    return wrapEventResponse<IBookingResponse>(response);
  } catch (err: any) {
    return wrapErrorResponse<IBookingResponse>(err);
  }
};
