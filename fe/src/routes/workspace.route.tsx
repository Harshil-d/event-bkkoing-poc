import { lazy, Suspense } from 'react';

import RootPage from '../pages/workspace/Root';
import PageLoader from '../components/UI/PageLoader';
import { checkLoginStatusForRoot } from '../services/auth.service';

const DashboardPage = lazy(() => import('../pages/workspace/Dashboard'));
const EventsPage = lazy(() => import('../pages/workspace/Events'));
const BookEventPage = lazy(() => import('../pages/workspace/BookEvent'));
const MyBookingsPage = lazy(() => import('../pages/workspace/MyBookings'));

const routes = [
  {
    path: '/',
    element: <RootPage />,
    loader: checkLoginStatusForRoot,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: 'events',
        element: (
          <Suspense fallback={<PageLoader />}>
            <EventsPage />
          </Suspense>
        ),
      },
      {
        path: 'book-event/:eventId',
        element: (
          <Suspense fallback={<PageLoader />}>
            <BookEventPage />
          </Suspense>
        ),
      },
      {
        path: 'my-bookings',
        element: (
          <Suspense fallback={<PageLoader />}>
            <MyBookingsPage />
          </Suspense>
        ),
      },
    ],
  },
];

export default routes;
