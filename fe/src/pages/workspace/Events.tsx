import React, { useEffect, useState, useCallback } from 'react';
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
  Modal,
  ModalClose,
  ModalDialog,
  FormControl,
  FormLabel,
  Textarea,
} from '@mui/joy';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BookOnlineIcon from '@mui/icons-material/BookOnline';

import { IEvent, IEventListResponse, ICreateEventRequest, IListEventsQuery } from '../../services/event.service';
import { listEvents, createEvent, deleteEvent } from '../../services/event.service';
import { constants } from '../../constants/index.constants';
import { useSelector } from 'react-redux';
import { GlobalState } from '../../store/index.store';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { hasPermission } from '../../utilities/role.utility';

const EventsPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: GlobalState) => state.user.user);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  const [createForm, setCreateForm] = useState<ICreateEventRequest>({
    title: '',
    description: '',
    eventDate: '',
    totalSeats: 0,
    price: 0,
    location: '',
  });

  const canCreateEvents = hasPermission(user?.role, 'canCreateEvents');

  const fetchEvents = useCallback(async (query: IListEventsQuery = {}) => {
    try {
      setLoading(true);
      const response: IEventListResponse = await listEvents({
        page: query.page || pagination.page,
        limit: query.limit || pagination.limit,
        search: query.search || searchTerm || undefined,
        ...query,
      });

      if (response.statusCode === constants.api.httpStatusCodes.ok) {
        setEvents(response.data || []);
        setPagination(response.pagination || pagination);
      } else {
        toast.error('Failed to fetch events');
      }
    } catch (error) {
      toast.error('Error fetching events');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, searchTerm]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents, user]);

  const handleSearch = () => {
    fetchEvents({ search: searchTerm, page: 1 });
  };

  const handleCreateEvent = async () => {
    try {
      if (!createForm.title || !createForm.description || !createForm.eventDate || !createForm.totalSeats || !createForm.price) {
        toast.error('Please fill in all required fields');
        return;
      }

      const response = await createEvent(createForm);
      if (response.statusCode === constants.api.httpStatusCodes.created) {
        toast.success('Event created successfully');
        setShowCreateModal(false);
        setCreateForm({
          title: '',
          description: '',
          eventDate: '',
          totalSeats: 0,
          price: 0,
          location: '',
        });
        fetchEvents();
      } else {
        toast.error('Failed to create event');
      }
    } catch (error) {
      toast.error('Error creating event');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await deleteEvent(eventId);
        if (response.statusCode === constants.api.httpStatusCodes.ok) {
          toast.success('Event deleted successfully');
          fetchEvents();
        } else {
          toast.error('Failed to delete event');
        }
      } catch (error) {
        toast.error('Error deleting event');
      }
    }
  };

  const handleBookEvent = (eventId: string) => {
    navigate(`/book-event/${eventId}`);
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

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography level="h2">Events</Typography>
        {canCreateEvents && (
          <Button
            startDecorator={<AddRoundedIcon />}
            onClick={() => setShowCreateModal(true)}
            size="lg"
          >
            Create Event
          </Button>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Input
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          startDecorator={<SearchRoundedIcon />}
          sx={{ flex: 1 }}
        />
        <Button onClick={handleSearch}>Search</Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <Typography>Loading events...</Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {events.map((event) => (
            <Grid xs={12} sm={6} md={4} key={event.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography level="title-lg" sx={{ flex: 1 }}>
                      {event.title}
                    </Typography>
                    {canCreateEvents && (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="sm" color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton size="sm" color="danger" onClick={() => handleDeleteEvent(event.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                  
                  <Typography level="body-sm" sx={{ mb: 2, minHeight: '60px' }}>
                    {event.description}
                  </Typography>

                  <Stack spacing={1} sx={{ mb: 2 }}>
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
                        {formatPrice(event.price)}
                      </Typography>
                    </Box>
                  </Stack>

                  <Chip
                    color={event.seatsAvailable > 0 ? 'success' : 'danger'}
                    size="sm"
                    sx={{ mb: 2 }}
                  >
                    {event.seatsAvailable > 0 ? 'Available' : 'Sold Out'}
                  </Chip>
                </CardContent>
                
                {!canCreateEvents && (
                  <CardOverflow>
                    <Divider />
                    <Box sx={{ p: 2 }}>
                      <Button
                        fullWidth
                        startDecorator={<BookOnlineIcon />}
                        onClick={() => handleBookEvent(event.id)}
                        disabled={event.seatsAvailable === 0}
                      >
                        {event.seatsAvailable > 0 ? 'Book Now' : 'Sold Out'}
                      </Button>
                    </Box>
                  </CardOverflow>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {events.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <Typography level="body-lg" color="neutral">
            No events found
          </Typography>
        </Box>
      )}

      {/* Create Event Modal */}
      <Modal open={showCreateModal} onClose={() => setShowCreateModal(false)}>
        <ModalDialog sx={{ maxWidth: 500, width: '100%' }}>
          <ModalClose />
          <Typography level="h3" sx={{ mb: 2 }}>Create New Event</Typography>
          
          <FormControl sx={{ mb: 2 }}>
            <FormLabel>Event Title *</FormLabel>
            <Input
              value={createForm.title}
              onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
              placeholder="Enter event title"
            />
          </FormControl>

          <FormControl sx={{ mb: 2 }}>
            <FormLabel>Description *</FormLabel>
            <Textarea
              value={createForm.description}
              onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
              placeholder="Enter event description"
              minRows={3}
            />
          </FormControl>

          <FormControl sx={{ mb: 2 }}>
            <FormLabel>Event Date *</FormLabel>
            <Input
              type="datetime-local"
              value={createForm.eventDate}
              onChange={(e) => setCreateForm({ ...createForm, eventDate: e.target.value })}
            />
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <FormControl sx={{ flex: 1 }}>
              <FormLabel>Total Seats *</FormLabel>
              <Input
                type="number"
                value={createForm.totalSeats}
                onChange={(e) => setCreateForm({ ...createForm, totalSeats: parseInt(e.target.value) || 0 })}
                placeholder="Enter total seats"
                slotProps={{
                  input: {
                    min: 1,
                  }
                }}
              />
            </FormControl>

            <FormControl sx={{ flex: 1 }}>
              <FormLabel>Price *</FormLabel>
              <Input
                type="number"
                value={createForm.price}
                onChange={(e) => setCreateForm({ ...createForm, price: parseFloat(e.target.value) || 0 })}
                placeholder="Enter price"
                slotProps={{
                  input: {
                    min: 0,
                    step: 0.01,
                  }
                }}
              />
            </FormControl>
          </Box>

          <FormControl sx={{ mb: 3 }}>
            <FormLabel>Location</FormLabel>
            <Input
              value={createForm.location}
              onChange={(e) => setCreateForm({ ...createForm, location: e.target.value })}
              placeholder="Enter event location"
            />
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateEvent}>
              Create Event
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
    </Box>
  );
};

export default EventsPage;
