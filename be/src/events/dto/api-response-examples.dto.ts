import { HttpStatus } from '@nestjs/common';

/**
 * Events-specific API Response Examples
 * Success response examples specific to events controller
 */

// Create Event Response Examples
export const CreateEventSuccessResponseExample = {
  status: HttpStatus.CREATED,
  description: 'Event created successfully',
  schema: {
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Tech Conference 2024',
      description: 'Annual technology conference',
      eventDate: '2024-06-15T10:00:00Z',
      totalSeats: 500,
      seatsAvailable: 500,
      price: 99.99,
      location: 'Convention Center',
      createdAt: '2024-01-15T14:30:00Z',
      updatedAt: '2024-01-15T14:30:00Z',
    },
  },
};

// List Events Response Examples
export const ListEventsSuccessResponseExample = {
  status: HttpStatus.OK,
  description: 'Events retrieved successfully',
  schema: {
    example: {
      items: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          title: 'Tech Conference 2024',
          description: 'Annual technology conference',
          eventDate: '2024-06-15T10:00:00Z',
          totalSeats: 500,
          seatsAvailable: 450,
          price: 99.99,
          location: 'Convention Center',
          createdAt: '2024-01-15T14:30:00Z',
          updatedAt: '2024-01-15T14:30:00Z',
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

// Get Event Response Examples
export const GetEventSuccessResponseExample = {
  status: HttpStatus.OK,
  description: 'Event retrieved successfully',
  schema: {
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Tech Conference 2024',
      description: 'Annual technology conference',
      eventDate: '2024-06-15T10:00:00Z',
      totalSeats: 500,
      seatsAvailable: 450,
      price: 99.99,
      location: 'Convention Center',
      createdAt: '2024-01-15T14:30:00Z',
      updatedAt: '2024-01-15T14:30:00Z',
    },
  },
};

// Update Event Response Examples
export const UpdateEventSuccessResponseExample = {
  status: HttpStatus.OK,
  description: 'Event updated successfully',
  schema: {
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Updated Tech Conference 2024',
      description: 'Updated annual technology conference',
      eventDate: '2024-06-15T10:00:00Z',
      totalSeats: 500,
      seatsAvailable: 450,
      price: 99.99,
      location: 'Convention Center',
      createdAt: '2024-01-15T14:30:00Z',
      updatedAt: '2024-01-15T16:45:00Z',
    },
  },
};

// Delete Event Response Examples
export const DeleteEventSuccessResponseExample = {
  status: HttpStatus.OK,
  description: 'Event deleted successfully',
  schema: {
    example: {
      message: 'Event deleted successfully',
    },
  },
};

// API Body Examples
export const CreateEventBodyExample = {
  description: 'Event creation data',
  schema: {
    example: {
      title: 'Tech Conference 2024',
      description: 'Annual technology conference',
      eventDate: '2024-06-15T10:00:00Z',
      totalSeats: 500,
      price: 99.99,
      location: 'Convention Center',
    },
  },
};

export const UpdateEventBodyExample = {
  description: 'Event update data',
  schema: {
    example: {
      title: 'Updated Tech Conference 2024',
      description: 'Updated annual technology conference',
      eventDate: '2024-06-15T10:00:00Z',
      totalSeats: 500,
      price: 99.99,
      location: 'Convention Center',
    },
  },
};
