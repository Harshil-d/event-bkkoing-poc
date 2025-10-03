import { constants } from '../constants/index.constants';
import { headersWithAuth, wrapErrorResponse, wrapEventResponse } from '../helpers/api.helper';
import axios from '../utilities/axios.utility';

export interface IEvent {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  location: string;
  totalSeats: number;
  seatsAvailable: number;
  price: string;
  createdAt: string;
  updatedAt: string;
}

export interface IEventListResponse {
  statusCode: number;
  message: string;
  data: IEvent[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface IEventResponse {
  statusCode: number;
  message: string;
  data: IEvent;
}

export interface ICreateEventRequest {
  title: string;
  description: string;
  eventDate: string;
  totalSeats: number;
  price: number;
  location?: string;
}

export interface IUpdateEventRequest {
  title?: string;
  description?: string;
  eventDate?: string;
  totalSeats?: number;
  price?: number;
  location?: string;
}

export interface IListEventsQuery {
  page?: number;
  limit?: number;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export const listEvents = async (query: IListEventsQuery = {}): Promise<IEventListResponse> => {
  try {
    const response = await axios.get('/events', { 
      params: query,
      headers: headersWithAuth()
    });
    return wrapEventResponse<IEventListResponse>(response);
  } catch (err: any) {
    return wrapErrorResponse<IEventListResponse>(err);
  }
};

export const getEvent = async (id: string): Promise<IEventResponse> => {
  try {
    const response = await axios.get(`/events/${id}`, {
      headers: headersWithAuth()
    });
    return wrapEventResponse<IEventResponse>(response);
  } catch (err: any) {
    return wrapErrorResponse<IEventResponse>(err);
  }
};

export const createEvent = async (payload: ICreateEventRequest): Promise<IEventResponse> => {
  try {
    const response = await axios.post('/events', payload, {
      headers: headersWithAuth(),
    });
    return wrapEventResponse<IEventResponse>(response);
  } catch (err: any) {
    return wrapErrorResponse<IEventResponse>(err);
  }
};

export const updateEvent = async (id: string, payload: IUpdateEventRequest): Promise<IEventResponse> => {
  try {
    const response = await axios.patch(`/events/${id}`, payload, {
      headers: headersWithAuth(),
    });
    return wrapEventResponse<IEventResponse>(response);
  } catch (err: any) {
    return wrapErrorResponse<IEventResponse>(err);
  }
};

export const deleteEvent = async (id: string): Promise<{ statusCode: number; message: string }> => {
  try {
    const response = await axios.delete(`/events/${id}`, {
      headers: headersWithAuth(),
    });
    return wrapEventResponse<{ statusCode: number; message: string }>(response);
  } catch (err: any) {
    return wrapErrorResponse<{ statusCode: number; message: string }>(err);
  }
};
