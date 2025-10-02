import { lazy, Suspense } from 'react';

import RootPage from '../pages/workspace/Root';
import PageLoader from '../components/UI/PageLoader';
import { checkLoginStatus } from '../services/auth.service';

const DashboardPage = lazy(() => import('../pages/workspace/Dashboard'));
const ClientsPage = lazy(() => import('../pages/workspace/Clients'));
const CreateClientPage = lazy(() => import('../pages/workspace/CreateClient'));
const UpdateClientPage = lazy(() => import('../pages/workspace/UpdateClient'));
const DietsPage = lazy(() => import('../pages/workspace/Diets'));
const DietitianPage = lazy(() => import('../pages/workspace/Dietitians'));
const DietPlansPage = lazy(() => import('../pages/workspace/DietPlans'));
const TasksPage = lazy(() => import('../pages/workspace/Tasks'));
const AppointmentPage = lazy(() => import('../pages/workspace/Appointments'));
const MyProfilePage = lazy(() => import('../pages/workspace/MyProfile'));
const DietitianGroupPage = lazy(
  () => import('../pages/workspace/DietitianGroup')
);

const routes = [
  {
    path: '/',
    element: <RootPage />,
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
        path: 'clients',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ClientsPage />
          </Suspense>
        ),
      },
      {
        path: 'clients/create',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CreateClientPage />
          </Suspense>
        ),
      },
      {
        path: 'clients/:id',
        element: (
          <Suspense fallback={<PageLoader />}>
            <UpdateClientPage />
          </Suspense>
        ),
      },
      {
        path: 'diets',
        element: (
          <Suspense fallback={<PageLoader />}>
            <DietsPage />
          </Suspense>
        ),
      },
      {
        path: 'dietitians',
        element: (
          <Suspense fallback={<PageLoader />}>
            <DietitianPage />
          </Suspense>
        ),
      },
      {
        path: 'diet-plans',
        element: (
          <Suspense fallback={<PageLoader />}>
            <DietPlansPage />
          </Suspense>
        ),
      },
      {
        path: 'tasks',
        element: (
          <Suspense fallback={<PageLoader />}>
            <TasksPage />
          </Suspense>
        ),
      },
      {
        path: 'appointments',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AppointmentPage />
          </Suspense>
        ),
      },
      {
        path: 'my-profile',
        element: (
          <Suspense fallback={<PageLoader />}>
            <MyProfilePage />
          </Suspense>
        ),
      },
      {
        path: 'dietitian-group',
        element: (
          <Suspense fallback={<PageLoader />}>
            <DietitianGroupPage />
          </Suspense>
        ),
      },
    ],
    loader: checkLoginStatus,
  },
];

export default routes;
