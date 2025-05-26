// src/routes/renderRoutes.tsx
import { Route, Routes, Navigate } from 'react-router-dom';
import { routesConfig } from './routesConfig';
import { ReactNode } from 'react';
import { isTokenExpired } from '../api/auth';
import { MainLayout } from '../layout/MainLayout';

// Default layout fallback
const DefaultLayout = ({ children }: { children: ReactNode }) => (
  <MainLayout>{children}</MainLayout>
);

// Improved PrivateRoute
interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const token = localStorage.getItem('authToken');
  const isAuthenticated = token !== null && !isTokenExpired(token);

  if (!isAuthenticated) {
    localStorage.removeItem('authToken'); // Clear invalid token
    return <Navigate to="/login" replace />; // Redirect to login
  }

  return children;
};

// Renders all routes
export const renderRoutes = () => {
  return (
    <Routes>
      {routesConfig.map(({ path, element, layout, auth }, index) => {
        const Layout = layout || DefaultLayout;

        const pageContent = (
          <Layout>
            {element}
          </Layout>
        );

        return (
          <Route
            key={index}
            path={path}
            element={
              auth ? (
                <PrivateRoute>
                  {pageContent}
                </PrivateRoute>
              ) : (
                pageContent
              )
            }
          />
        );
      })}
    </Routes>
  );
};
