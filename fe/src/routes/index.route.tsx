import { createBrowserRouter } from 'react-router-dom';

import errorRoute from './error.route';
import authRoute from './auth.route';
import workspaceRoute from './workspace.route';
import ErrorPage from '../pages/error/Error';

const router = createBrowserRouter([
  {
    path: '/',
    children: [...authRoute, ...workspaceRoute, ...errorRoute],
    errorElement: <ErrorPage />,
  },
]);

export default router;
