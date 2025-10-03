import { lazy, Suspense } from 'react';

import PageLoader from '../components/UI/PageLoader';
import {
  checkLoginStatus,
  forgotPassword,
  resetPassword,
  signIn,
  adminSignIn,
  signUp,
} from '../services/auth.service';

const SignInPage = lazy(() => import('../pages/auth/SignIn'));
const AdminSignInPage = lazy(() => import('../pages/auth/AdminSignIn'));
const SignUpPage = lazy(() => import('../pages/auth/SignUp'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPassword'));
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPassword'));

const routes = [
  {
    path: 'sign-in',
    element: (
      <Suspense fallback={<PageLoader />}>
        <SignInPage />
      </Suspense>
    ),
    loader: checkLoginStatus,
    action: signIn,
  },
  {
    path: 'admin-sign-in',
    element: (
      <Suspense fallback={<PageLoader />}>
        <AdminSignInPage />
      </Suspense>
    ),
    loader: checkLoginStatus,
    action: adminSignIn,
  },
  // {
  //   path: 'sign-up',
  //   element: (
  //     <Suspense fallback={<PageLoader />}>
  //       <SignUpPage />
  //     </Suspense>
  //   ),
  //   loader: checkLoginStatus,
  //   action: signUp,
  // },
  {
    path: 'forgot-password',
    element: (
      <Suspense fallback={<PageLoader />}>
        <ForgotPasswordPage />
      </Suspense>
    ),
    loader: checkLoginStatus,
    action: forgotPassword,
  },
  {
    path: 'reset-password/:token',
    element: (
      <Suspense fallback={<PageLoader />}>
        <ResetPasswordPage />
      </Suspense>
    ),
    loader: checkLoginStatus,
    action: resetPassword,
  },
];

export default routes;
