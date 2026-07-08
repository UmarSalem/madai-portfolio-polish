import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SymptomChecker from './SymptomChecker';
import { MemoryRouter } from 'react-router';

// Simple mock for axios (no need for jest.mock in CRA)
jest.mock('axios', () => ({
  post: jest.fn()
}));

describe('SymptomChecker', () => {
  beforeEach(() => {
    // Mock localStorage
    Storage.prototype.getItem = jest.fn(() => JSON.stringify({ id: '123' }));
    
    // Mock API responses
    require('axios').post.mockImplementation((url) => {
      if (url.includes('generativelanguage')) {
        return Promise.resolve({
          data: {
            candidates: [{
              content: {
                parts: [{
                  text: JSON.stringify({
                    possibleConditions: ["Migraine"],
                    advice: "Rest",
                    urgencyLevel: "low",
                    recommendedActions: ["Take medicine"]
                  })
                }]
              }
            }]
          }
        });
      }
      return Promise.resolve({ data: {} });
    });
  });

  test('submits form successfully', async () => {
  render(
    <MemoryRouter>
      <SymptomChecker />
    </MemoryRouter>
  );
    
    fireEvent.change(screen.getByLabelText(/patient name/i), {
      target: { value: 'John' }
    });
    fireEvent.change(screen.getByLabelText(/symptoms/i), {
      target: { value: 'headache' }
    });
    fireEvent.click(screen.getByText(/check symptoms/i));

    await waitFor(() => {
      expect(screen.getByText('Diagnosis for John')).toBeInTheDocument();
    });
  });
});