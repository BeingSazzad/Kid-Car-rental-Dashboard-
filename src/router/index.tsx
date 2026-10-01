import { createBrowserRouter } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import AdminLayout from '@/components/layout/AdminLayout';
import OverviewPage from '@/pages/dashboard/OverviewPage';
import UsersPage from '@/pages/users/UsersPage';
import TripsPage from '@/pages/trips/TripsPage';
import PaymentsPage from '@/pages/payments/PaymentsPage';
import KYCPage from '@/pages/kyc/KYCPage';
import ReferralsPage from '@/pages/referrals/ReferralsPage';
import NotificationsPage from '@/pages/notifications/NotificationsPage';
import CMSPage from '@/pages/cms/CMSPage';
import PackagesPage from '@/pages/packages/PackagesPage';
import SupportPage from '@/pages/support/SupportPage';
import SettingsPage from '@/pages/settings/SettingsPage';
import LoginPage from '@/pages/auth/LoginPage';
import NotFoundPage from '@/pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      { index: true, element: <OverviewPage /> },
      { path: ROUTES.USERS.slice(1), element: <UsersPage /> },
      { path: ROUTES.TRIPS.slice(1), element: <TripsPage /> },
      { path: ROUTES.PAYMENTS.slice(1), element: <PaymentsPage /> },
      { path: ROUTES.KYC.slice(1), element: <KYCPage /> },
      { path: ROUTES.REFERRALS.slice(1), element: <ReferralsPage /> },
      { path: ROUTES.NOTIFICATIONS.slice(1), element: <NotificationsPage /> },
      { path: ROUTES.CMS.slice(1), element: <CMSPage /> },
      { path: ROUTES.PACKAGES.slice(1), element: <PackagesPage /> },
      { path: ROUTES.SUPPORT.slice(1), element: <SupportPage /> },
      { path: ROUTES.SETTINGS.slice(1), element: <SettingsPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
