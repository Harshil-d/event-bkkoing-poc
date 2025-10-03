import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Button,
  Card,
  CardContent,
  CardOverflow,
  Chip,
  Divider,
  Grid,
  IconButton,
  Input,
  Stack,
  Typography,
  Sheet,
  Select,
  Option,
} from '@mui/joy';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { IBooking, IBookingListResponse, IListBookingsQuery } from '../../services/booking.service';
import { listMyBookings, cancelBooking } from '../../services/booking.service';
import { constants } from '../../constants/index.constants';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const MyBookingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  const fetchBookings = async (query: IListBookingsQuery = {}) => {
    try {
      setLoading(true);
      const response: IBookingListResponse = await listMyBookings({
        page: query.page || pagination.page,
        limit: query.limit || pagination.limit,
        status: query.status || (statusFilter as 'CONFIRMED' | 'CANCELLED') || undefined,
      });

      if (response.statusCode === constants.api.httpStatusCodes.ok) {
        setBookings(response.data || []);
        setPagination(response.pagination || pagination);
      } else {
        toast.error('Failed to fetch bookings');
      }
    } catch (error) {
      toast.error('Error fetching bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleSearch = () => {
    // For now, just refetch with current filters
    fetchBookings({ status: statusFilter as 'CONFIRMED' | 'CANCELLED' || undefined });
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    fetchBookings({ status: status as 'CONFIRMED' | 'CANCELLED' || undefined, page: 1 });
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        const response = await cancelBooking(bookingId);
        if (response.statusCode === constants.api.httpStatusCodes.ok) {
          toast.success('Booking cancelled successfully');
          fetchBookings();
        } else {
          toast.error('Failed to cancel booking');
        }
      } catch (error) {
        toast.error('Error cancelling booking');
      }
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return format(date, 'MMM dd, yyyy - hh:mm a');
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numPrice)) return '$0.00';
    return `$${numPrice.toFixed(2)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'success';
      case 'CANCELLED':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography level="h2" sx={{ mb: 3 }}>
        My Bookings
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Input
          placeholder="Search bookings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          startDecorator={<SearchRoundedIcon />}
          sx={{ flex: 1, minWidth: 200 }}
        />
        <Select
          placeholder="Filter by status"
          value={statusFilter}
          onChange={(_, value) => handleStatusFilter(value || '')}
          sx={{ minWidth: 150 }}
        >
          <Option value="">All Status</Option>
          <Option value="CONFIRMED">Confirmed</Option>
          <Option value="CANCELLED">Cancelled</Option>
        </Select>
        <Button onClick={handleSearch}>Search</Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <Typography>Loading bookings...</Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {bookings.map((booking) => (
            <Grid xs={12} sm={6} md={4} key={booking.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography level="title-lg" sx={{ flex: 1 }}>
                      {booking.event.title}
                    </Typography>
                    <Chip
                      color={getStatusColor(booking.status)}
                      size="sm"
                    >
                      {booking.status}
                    </Chip>
                  </Box>
                  
                  <Stack spacing={1} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EventIcon fontSize="small" />
                      <Typography level="body-sm">{formatDate(booking.event.eventDate)}</Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationOnIcon fontSize="small" />
                      <Typography level="body-sm">{booking.event.location}</Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PeopleIcon fontSize="small" />
                      <Typography level="body-sm">
                        {booking.numberOfSeats} seat{booking.numberOfSeats > 1 ? 's' : ''}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AttachMoneyIcon fontSize="small" />
                      <Typography level="body-sm" sx={{ fontWeight: 'bold' }}>
                        {formatPrice(booking.totalAmount)} (${formatPrice(booking.event.price)} per seat)
                      </Typography>
                    </Box>
                  </Stack>

                  <Typography level="body-xs" color="neutral">
                    Booked on: {formatDate(booking.bookingDate)}
                  </Typography>
                </CardContent>
                
                <CardOverflow>
                  <Divider />
                  <Box sx={{ p: 2 }}>
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="sm"
                        variant="outlined"
                        startDecorator={<VisibilityIcon />}
                        sx={{ flex: 1 }}
                      >
                        View Details
                      </Button>
                      {booking.status === 'CONFIRMED' && (
                        <IconButton
                          size="sm"
                          color="danger"
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          <CancelIcon />
                        </IconButton>
                      )}
                    </Stack>
                  </Box>
                </CardOverflow>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {bookings.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <Typography level="body-lg" color="neutral">
            No bookings found
          </Typography>
          <Button
            onClick={() => navigate('/events')}
            sx={{ mt: 2 }}
          >
            Browse Events
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default MyBookingsPage;

