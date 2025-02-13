import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';

import App from './App';
import { server } from './mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('loads and displays data from the API', async () => {
  render(<App />);
  expect(screen.getByText(/Loading.../)).toBeInTheDocument();
  await waitFor(() => expect(screen.getByText(/"message":"hello"/)).toBeInTheDocument());
});
  
test('handles API error gracefully', async () => {
  server.use(
    http.get('/api/data', () => {
      return HttpResponse.json({ error: 'bonk!' }, { status: 500 });
    })
  );
  render(<App />);
  expect(screen.getByText(/Loading.../)).toBeInTheDocument();
  await waitFor(() => expect(screen.queryByText(/"message"/)).not.toBeInTheDocument());
});