import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Stack,
  Chip,
} from '@mui/joy';
import EventIcon from '@mui/icons-material/Event';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

import { IEvent, IEventListResponse } from '../../services/event.service';
import { listEvents } from '../../services/event.service';
import { IBooking, IBookingListResponse, listMyBookings, listAllBookings } from '../../services/booking.service';
import { constants } from '../../constants/index.constants';
import { useSelector } from 'react-redux';
import { GlobalState } from '../../store/index.store';
import { format } from 'date-fns';
import { hasPermission, isAdmin } from '../../utilities/role.utility';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: GlobalState) => state.user.user);
  const [recentEvents, setRecentEvents] = useState<IEvent[]>([]);
  const [recentBookings, setRecentBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdminUser = isAdmin(user?.role);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch recent events
      const eventsResponse: IEventListResponse = await listEvents({ limit: 3 });
      if (eventsResponse.statusCode === constants.api.httpStatusCodes.ok) {
        setRecentEvents(eventsResponse.data || []);
      }

      // Fetch recent bookings (all bookings for admin, user's own for regular users)
      const bookingsResponse: IBookingListResponse = isAdminUser 
        ? await listAllBookings({ limit: 3 })
        : await listMyBookings({ limit: 3 });
      if (bookingsResponse.statusCode === constants.api.httpStatusCodes.ok) {
        setRecentBookings(bookingsResponse.data || []);
      }
    } catch (error: any) {
      toast.error(error.message || 'Error fetching dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `$${numPrice.toFixed(2)}`;
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography level="h2" sx={{ mb: 3 }}>
        Welcome to Event Booking System
      </Typography>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid xs={12}>
          <Card>
            <CardContent>
              <Typography level="h4" sx={{ mb: 2 }}>
                Quick Actions
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Button
                  startDecorator={<EventIcon />}
                  onClick={() => navigate('/events')}
                  size="lg"
                >
                  Browse Events
                </Button>
                {!isAdminUser && (
                  <Button
                    startDecorator={<BookOnlineIcon />}
                    onClick={() => navigate('/my-bookings')}
                    size="lg"
                    variant="outlined"
                  >
                    My Bookings
                  </Button>
                )}
                {isAdminUser && (
                  <Button
                    startDecorator={<AddRoundedIcon />}
                    onClick={() => navigate('/events')}
                    size="lg"
                    color="primary"
                  >
                    Create Event
                  </Button>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Events */}
        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography level="h4">Recent Events</Typography>
                <Button
                  variant="outlined"
                  size="sm"
                  onClick={() => navigate('/events')}
                >
                  View All
                </Button>
              </Box>
              
              {recentEvents.length > 0 ? (
                <Stack spacing={2}>
                  {recentEvents.map((event) => (
                    <Box
                      key={event.id}
                      sx={{
                        p: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 'sm',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'background.level1',
                        },
                      }}
                      onClick={() => navigate(`/book-event/${event.id}`)}
                    >
                      <Typography level="title-sm" sx={{ mb: 1 }}>
                        {event.title}
                      </Typography>
                      <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                        <Typography level="body-xs">
                          {formatDate(event.eventDate)}
                        </Typography>
                        <Typography level="body-xs">
                          {event.location}
                        </Typography>
                      </Stack>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography level="body-sm" sx={{ fontWeight: 'bold' }}>
                          {formatPrice(event.price)}
                        </Typography>
                        <Chip
                          color={event.seatsAvailable > 0 ? 'success' : 'danger'}
                          size="sm"
                        >
                          {event.seatsAvailable} seats left
                        </Chip>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Typography level="body-sm" color="neutral">
                  No events available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Bookings */}
        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography level="h4">Recent Bookings</Typography>
                <Button
                  variant="outlined"
                  size="sm"
                  onClick={() => navigate(isAdminUser ? '/bookings' : '/my-bookings')}
                >
                  View All
                </Button>
              </Box>
              
              {recentBookings.length > 0 ? (
                <Stack spacing={2}>
                  {recentBookings.map((booking) => (
                    <Box
                      key={booking.id}
                      sx={{
                        p: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 'sm',
                      }}
                    >
                      <Typography level="title-sm" sx={{ mb: 1 }}>
                        {booking.event.title}
                      </Typography>
                      {isAdminUser && booking.user && (
                        <Typography level="body-xs" color="neutral" sx={{ mb: 1 }}>
                          Booked by: {booking.user.fullName} ({booking.user.email})
                        </Typography>
                      )}
                      <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                        <Typography level="body-xs">
                          {formatDate(booking.event.eventDate)}
                        </Typography>
                        <Typography level="body-xs">
                          {booking.numberOfSeats} seat{booking.numberOfSeats > 1 ? 's' : ''}
                        </Typography>
                      </Stack>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography level="body-sm" sx={{ fontWeight: 'bold' }}>
                          {formatPrice(booking.totalAmount)}
                        </Typography>
                        <Chip
                          color={booking.status === 'CONFIRMED' ? 'success' : 'danger'}
                          size="sm"
                        >
                          {booking.status}
                        </Chip>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Typography level="body-sm" color="neutral">
                  {isAdminUser ? 'No bookings found' : 'No bookings yet'}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
