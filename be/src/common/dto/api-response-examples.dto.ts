import { HttpStatus } from '@nestjs/common';

/**
 * Common API Response Examples
 * Shared response examples that can be reused across all controllers
 */

// Common Success Response Examples
export const SuccessResponseExample = {
  status: HttpStatus.OK,
  description: 'Success',
};

export const CreatedResponseExample = {
  status: HttpStatus.CREATED,
  description: 'Resource created successfully',
};

export const UpdatedResponseExample = {
  status: HttpStatus.OK,
  description: 'Resource updated successfully',
};

export const DeletedResponseExample = {
  status: HttpStatus.OK,
  description: 'Resource deleted successfully',
};

// Common Error Response Examples
export const UnauthorizedResponseExample = {
  status: HttpStatus.UNAUTHORIZED,
  description: 'Unauthorized - Invalid or missing token',
};

export const ForbiddenResponseExample = {
  status: HttpStatus.FORBIDDEN,
  description: 'Forbidden - Access denied',
};

export const NotFoundResponseExample = {
  status: HttpStatus.NOT_FOUND,
  description: 'Resource not found',
};

export const BadRequestResponseExample = {
  status: HttpStatus.BAD_REQUEST,
  description: 'Bad Request - Invalid data provided',
};

export const ConflictResponseExample = {
  status: HttpStatus.CONFLICT,
  description: 'Conflict - Resource already exists',
};

export const InternalServerErrorResponseExample = {
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'Internal Server Error',
};

// Specific Error Response Examples
export const InsufficientSeatsResponseExample = {
  status: HttpStatus.BAD_REQUEST,
  description: 'Bad Request - Insufficient seats available',
};

export const PastEventResponseExample = {
  status: HttpStatus.BAD_REQUEST,
  description: 'Bad Request - Cannot book seats for past events',
};

export const CannotCancelBookingResponseExample = {
  status: HttpStatus.BAD_REQUEST,
  description: 'Bad Request - Booking cannot be cancelled',
};

export const CannotDeleteEventWithBookingsResponseExample = {
  status: HttpStatus.BAD_REQUEST,
  description: 'Bad Request - Cannot delete event with confirmed bookings',
};

// User Role Specific Error Responses
export const UserAccessRequiredResponseExample = {
  status: HttpStatus.FORBIDDEN,
  description: 'Forbidden - User access required',
};

export const AdminAccessRequiredResponseExample = {
  status: HttpStatus.FORBIDDEN,
  description: 'Forbidden - Admin access required',
};

export const CannotCancelThisBookingResponseExample = {
  status: HttpStatus.FORBIDDEN,
  description: 'Forbidden - Cannot cancel this booking',
};

// Pagination Query Examples
export const PaginationQueryExamples = {
  page: {
    name: 'page',
    required: false,
    description: 'Page number (default: 1)',
    example: 1,
  },
  limit: {
    name: 'limit',
    required: false,
    description: 'Items per page (default: 10)',
    example: 10,
  },
  status: {
    name: 'status',
    required: false,
    description: 'Filter by status',
    example: 'CONFIRMED',
    enum: ['CONFIRMED', 'CANCELLED'],
  },
  search: {
    name: 'search',
    required: false,
    description: 'Search term',
    example: 'tech conference',
  },
  dateFrom: {
    name: 'dateFrom',
    required: false,
    description: 'Filter events from this date',
    example: '2024-01-01',
  },
  dateTo: {
    name: 'dateTo',
    required: false,
    description: 'Filter events until this date',
    example: '2024-12-31',
  },
};

// Common Response Groups
export const CommonErrorResponses = {
  unauthorized: UnauthorizedResponseExample,
  forbidden: ForbiddenResponseExample,
  notFound: NotFoundResponseExample,
  badRequest: BadRequestResponseExample,
  conflict: ConflictResponseExample,
  internalServerError: InternalServerErrorResponseExample,
};

export const AuthErrorResponses = {
  unauthorized: UnauthorizedResponseExample,
  userAccessRequired: UserAccessRequiredResponseExample,
  adminAccessRequired: AdminAccessRequiredResponseExample,
};

export const BookingErrorResponses = {
  unauthorized: UnauthorizedResponseExample,
  forbidden: ForbiddenResponseExample,
  notFound: NotFoundResponseExample,
  badRequest: BadRequestResponseExample,
  insufficientSeats: InsufficientSeatsResponseExample,
  pastEvent: PastEventResponseExample,
  cannotCancel: CannotCancelBookingResponseExample,
  cannotCancelThis: CannotCancelThisBookingResponseExample,
  userAccessRequired: UserAccessRequiredResponseExample,
  adminAccessRequired: AdminAccessRequiredResponseExample,
};

export const EventErrorResponses = {
  unauthorized: UnauthorizedResponseExample,
  forbidden: ForbiddenResponseExample,
  notFound: NotFoundResponseExample,
  badRequest: BadRequestResponseExample,
  cannotDeleteWithBookings: CannotDeleteEventWithBookingsResponseExample,
};
