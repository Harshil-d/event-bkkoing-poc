import { lazy, Suspense } from 'react';

const Error403Page = lazy(() => import('../pages/error/Error403'));
const Error404Page = lazy(() => import('../pages/error/Error404'));

const routes = [
  {
    path: '403',
    element: (
      <Suspense>
        <Error403Page />
      </Suspense>
    ),
  },
  {
    path: '404',
    element: (
      <Suspense>
        <Error404Page />
      </Suspense>
    ),
  },
];

export default routes;
