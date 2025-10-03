import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Input,
  FormControl,
  FormLabel,
  Stack,
  Alert,
  Divider,
} from '@mui/joy';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BookOnlineIcon from '@mui/icons-material/BookOnline';

import { IEvent, IEventResponse } from '../../services/event.service';
import { getEvent } from '../../services/event.service';
import { createBooking, ICreateBookingRequest } from '../../services/booking.service';
import { constants } from '../../constants/index.constants';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const BookEventPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<IEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<ICreateBookingRequest>({
    eventId: eventId || '',
    seats: 1,
  });
  const [bookingLoading, setBookingLoading] = useState(false);

  const fetchEvent = async () => {
    if (!eventId) return;
    
    try {
      setLoading(true);
      const response: IEventResponse = await getEvent(eventId);
      
      if (response.statusCode === constants.api.httpStatusCodes.ok) {
        setEvent(response.data);
      } else {
        toast.error('Event not found');
        navigate('/events');
      }
    } catch (error) {
      toast.error('Error fetching event');
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  const handleBookingChange = (seats: number) => {
    if (seats < 1) return;
    if (event && seats > event.seatsAvailable) return;
    
    setBooking({ ...booking, seats });
  };

  const handleBookEvent = async () => {
    if (!event) return;
    
    try {
      setBookingLoading(true);
      const response = await createBooking(booking);
      
      if (response.statusCode === constants.api.httpStatusCodes.created) {
        toast.success('Event booked successfully!');
        navigate('/my-bookings');
      } else {
        toast.error('Failed to book event');
      }
    } catch (error) {
      toast.error('Error booking event');
    } finally {
      setBookingLoading(false);
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
    return `$${numPrice.toFixed(2)}`;
  };

  const totalPrice = event ? parseFloat(event.price) * booking.seats : 0;

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading event details...</Typography>
      </Box>
    );
  }

  if (!event) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Event not found</Typography>
        <Button onClick={() => navigate('/events')} sx={{ mt: 2 }}>
          Back to Events
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Button
        startDecorator={<ArrowBackIcon />}
        variant="outlined"
        onClick={() => navigate('/events')}
        sx={{ mb: 3 }}
      >
        Back to Events
      </Button>

      <Typography level="h2" sx={{ mb: 3 }}>
        Book Event
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography level="h3" sx={{ mb: 2 }}>
            {event.title}
          </Typography>
          
          <Typography level="body-md" sx={{ mb: 3 }}>
            {event.description}
          </Typography>

          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EventIcon fontSize="small" />
              <Typography level="body-sm">{formatDate(event.eventDate)}</Typography>
            </Box>
            
            {event.location && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOnIcon fontSize="small" />
                <Typography level="body-sm">{event.location}</Typography>
              </Box>
            )}
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PeopleIcon fontSize="small" />
              <Typography level="body-sm">
                {event.seatsAvailable} / {event.totalSeats} seats available
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AttachMoneyIcon fontSize="small" />
              <Typography level="body-sm" sx={{ fontWeight: 'bold' }}>
                {formatPrice(event.price)} per seat
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {event.seatsAvailable === 0 ? (
        <Alert color="danger">
          This event is sold out. No seats are available.
        </Alert>
      ) : (
        <Card>
          <CardContent>
            <Typography level="h4" sx={{ mb: 3 }}>
              Booking Details
            </Typography>

            <FormControl sx={{ mb: 3 }}>
              <FormLabel>Number of Seats</FormLabel>
            <Input
              type="number"
              value={booking.seats}
              onChange={(e) => handleBookingChange(parseInt(e.target.value) || 1)}
              slotProps={{
                input: {
                  min: 1,
                  max: event.seatsAvailable,
                }
              }}
              sx={{ maxWidth: 200 }}
            />
              <Typography level="body-xs" sx={{ mt: 1 }}>
                Maximum {event.seatsAvailable} seats available
              </Typography>
            </FormControl>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography level="title-md">
                Total Amount ({booking.seats} seat{booking.seats > 1 ? 's' : ''})
              </Typography>
              <Typography level="h4" color="primary">
                {formatPrice(totalPrice)}
              </Typography>
            </Box>

            <Button
              fullWidth
              size="lg"
              startDecorator={<BookOnlineIcon />}
              onClick={handleBookEvent}
              loading={bookingLoading}
              disabled={booking.seats < 1 || booking.seats > event.seatsAvailable}
            >
              {bookingLoading ? 'Processing...' : 'Confirm Booking'}
            </Button>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default BookEventPage;
