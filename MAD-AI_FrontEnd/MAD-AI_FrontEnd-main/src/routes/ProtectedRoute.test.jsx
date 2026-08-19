import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import ProtectedRoute from './ProtectedRoute';
import { ROUTE } from './ReactLinks';

describe('ProtectedRoute', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('redirects unauthenticated users to login', () => {
    render(
      <MemoryRouter initialEntries={[ROUTE.Profile]}>
        <Routes>
          <Route
            path={ROUTE.Profile}
            element={(
              <ProtectedRoute>
                <div>Protected profile page</div>
              </ProtectedRoute>
            )}
          />
          <Route path={ROUTE.Login} element={<div>Login page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/login page/i)).toBeInTheDocument();
    expect(screen.queryByText(/protected profile page/i)).not.toBeInTheDocument();
  });
});
