import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import AppLayout from './layout/AppLayout';
import LandingPage from './pages/LandingPage';
import OnBoarding from './pages/OnBoarding';
import JobListing from './pages/JobListing';
import ParticularJob from './pages/ParticularJob';
import PostNewJob from './pages/PostNewJob';
import MyJobs from './pages/MyJobs';
import { ThemeProvider } from './components/theme-provider';
import ProtectedRoute from './app_components/ProtectedRoute';
import NewCompany from './pages/NewCompany';
import MyApplications from './pages/MyApplications';

const App = () => {

  const router = createBrowserRouter([
    {
      element: <AppLayout />,
      children: [
        {
          path: '/',
          element: <LandingPage />,
        },
        {
          path: '/onboarding',
          element: <ProtectedRoute><OnBoarding /></ProtectedRoute>,
        },
        {
          path: '/jobs',
          element: <ProtectedRoute><JobListing /></ProtectedRoute>,
        },
        {
          path: '/job/:id',
          element: <ProtectedRoute><ParticularJob /></ProtectedRoute>,
        },
        {
          path: '/post-job',
          element: <ProtectedRoute><PostNewJob /></ProtectedRoute>,
        },
        {
          path: '/my-jobs',
          element: <ProtectedRoute><MyJobs /></ProtectedRoute>,
        },
        {
          path: '/new-company',
          element: <ProtectedRoute><NewCompany /></ProtectedRoute>
        },
        {
          path: '/my-applications',
          element: <ProtectedRoute><MyApplications /></ProtectedRoute>
        },
      ],
    },
  ]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">

      <RouterProvider router={router} />
      
    </ThemeProvider>
  );
};

export default App;
