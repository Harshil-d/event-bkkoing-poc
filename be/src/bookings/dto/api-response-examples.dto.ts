import { HttpStatus } from '@nestjs/common';

/**
 * API Response Examples for Bookings Controller
 * Centralized response examples for better code organization
 */

// Create Booking Response Examples
export const CreateBookingSuccessResponseExample = {
  status: HttpStatus.CREATED,
  description: 'Booking created successfully',
  schema: {
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      eventId: '456e7890-e89b-12d3-a456-426614174001',
      userId: '789e0123-e89b-12d3-a456-426614174002',
      numberOfSeats: 2,
      totalAmount: 199.98,
      status: 'CONFIRMED',
      bookingDate: '2024-01-15T14:30:00Z',
      createdAt: '2024-01-15T14:30:00Z',
      updatedAt: '2024-01-15T14:30:00Z',
      event: {
        id: '456e7890-e89b-12d3-a456-426614174001',
        title: 'Tech Conference 2024',
        date: '2024-06-15T10:00:00Z',
        location: 'Convention Center, Hall A',
        price: 99.99,
      },
    },
  },
};

// Moved to common/dto/api-response-examples.dto.ts

// List My Bookings Response Examples
export const ListMyBookingsSuccessResponseExample = {
  status: HttpStatus.OK,
  description: 'User bookings retrieved successfully',
  schema: {
    example: {
      items: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          eventId: '456e7890-e89b-12d3-a456-426614174001',
          userId: '789e0123-e89b-12d3-a456-426614174002',
          numberOfSeats: 2,
          totalAmount: 199.98,
          status: 'CONFIRMED',
          bookingDate: '2024-01-15T14:30:00Z',
          createdAt: '2024-01-15T14:30:00Z',
          updatedAt: '2024-01-15T14:30:00Z',
          event: {
            id: '456e7890-e89b-12d3-a456-426614174001',
            title: 'Tech Conference 2024',
            date: '2024-06-15T10:00:00Z',
            location: 'Convention Center, Hall A',
            price: 99.99,
          },
        },
      ],
      meta: {
        page: 1,
        limit: 10,
        totalItems: 1,
        totalPages: 1,
      },
    },
  },
};

// List All Bookings Response Examples
export const ListAllBookingsSuccessResponseExample = {
  status: HttpStatus.OK,
  description: 'All bookings retrieved successfully',
  schema: {
    example: {
      items: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          eventId: '456e7890-e89b-12d3-a456-426614174001',
          userId: '789e0123-e89b-12d3-a456-426614174002',
          numberOfSeats: 2,
          totalAmount: 199.98,
          status: 'CONFIRMED',
          bookingDate: '2024-01-15T14:30:00Z',
          createdAt: '2024-01-15T14:30:00Z',
          updatedAt: '2024-01-15T14:30:00Z',
          event: {
            id: '456e7890-e89b-12d3-a456-426614174001',
            title: 'Tech Conference 2024',
            date: '2024-06-15T10:00:00Z',
            location: 'Convention Center, Hall A',
            price: 99.99,
          },
          user: {
            id: '789e0123-e89b-12d3-a456-426614174002',
            fullName: 'John Doe',
            email: 'john@example.com',
          },
        },
      ],
      meta: {
        page: 1,
        limit: 10,
        totalItems: 1,
        totalPages: 1,
      },
    },
  },
};

// Cancel Booking Response Examples
export const CancelBookingSuccessResponseExample = {
  status: HttpStatus.OK,
  description: 'Booking cancelled successfully',
  schema: {
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      eventId: '456e7890-e89b-12d3-a456-426614174001',
      userId: '789e0123-e89b-12d3-a456-426614174002',
      numberOfSeats: 2,
      totalAmount: 199.98,
      status: 'CANCELLED',
      bookingDate: '2024-01-15T14:30:00Z',
      createdAt: '2024-01-15T14:30:00Z',
      updatedAt: '2024-01-15T16:45:00Z',
      event: {
        id: '456e7890-e89b-12d3-a456-426614174001',
        title: 'Tech Conference 2024',
        date: '2024-06-15T10:00:00Z',
        location: 'Convention Center, Hall A',
        price: 99.99,
      },
    },
  },
};

// Moved to common/dto/api-response-examples.dto.ts

// API Body Examples
export const CreateBookingBodyExample = {
  description: 'Booking creation data',
  schema: {
    example: {
      eventId: '123e4567-e89b-12d3-a456-426614174000',
      seats: 2,
    },
  },
};
