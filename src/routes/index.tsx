import { createBrowserRouter } from 'react-router-dom';

import MainLayout from '../layouts/MainLayout';

import DashboardPage from '../modules/dashboard/pages/DashboardPage';

import CustomersPage from '../modules/customers/pages/CustomersPage';

import VehiclesPage from '../modules/vehicles/pages/VehiclesPage';

import VehicleReception from '../modules/operations/pages/reception/VehicleReception';

import WorkOrdersList from '../modules/operations/pages/workorders/WorkOrdersList';

import SettingsPage from '../modules/settings/pages/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,

    children: [
      {
        index: true,
        element: <DashboardPage />,
      },

      {
        path: 'customers',
        element: <CustomersPage />,
      },

      {
        path: 'vehicles',
        element: <VehiclesPage />,
      },

      {
        path: 'operations/reception',
        element: <VehicleReception />,
      },

      {
        path: 'operations/workorders',
        element: <WorkOrdersList />,
      },

      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
]);