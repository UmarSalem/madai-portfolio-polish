import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import ReportChat from './ReportChat';
import { getReportConversation, sendReportQuestion } from '../api/features';

jest.mock('../api/features', () => ({ getReportConversation: jest.fn(), sendReportQuestion: jest.fn() }));
const turn = (id, answer = 'Stub explanation only.') => ({ id, question: 'Fictional question', answer, source: 'provider', contextTruncated: true });
beforeEach(() => {
  jest.resetAllMocks();
  getReportConversation.mockResolvedValue({ data: { turns: [], available: true, contextTruncated: true } });
});
const ready = async () => { render(<ReportChat key="report-a" reportId="report-a" />); await screen.findByText(/Report context is truncated/i); };

test('sends only trimmed question and report id, prevents duplicates, supports follow-up and reload', async () => {
  let complete;
  sendReportQuestion.mockReturnValueOnce(new Promise(resolve => { complete = resolve; }));
  await ready();
  fireEvent.change(screen.getByLabelText('Question about this report'), { target: { value: ' Fictional first question ' } });
  fireEvent.submit(screen.getByRole('form', { name: 'Ask about report' }));
  fireEvent.submit(screen.getByRole('form', { name: 'Ask about report' }));
  expect(sendReportQuestion).toHaveBeenCalledTimes(1);
  expect(sendReportQuestion).toHaveBeenCalledWith('report-a', 'Fictional first question');
  expect(screen.getByRole('button', { name: 'Waiting for response...' })).toBeDisabled();
  await act(async () => complete({ data: turn('1') }));
  expect(screen.getByText(/Provider-generated response.*not medical advice/i)).toBeInTheDocument();
  sendReportQuestion.mockResolvedValueOnce({ data: turn('2', 'Stub follow-up explanation.') });
  fireEvent.change(screen.getByLabelText('Question about this report'), { target: { value: 'Fictional follow-up' } });
  fireEvent.click(screen.getByRole('button', { name: 'Ask report question' }));
  expect(await screen.findByText('Stub follow-up explanation.')).toBeInTheDocument();
  getReportConversation.mockResolvedValueOnce({ data: { turns: [turn('1'), turn('2', 'Stub follow-up explanation.')], available: true } });
  fireEvent.click(screen.getByRole('button', { name: 'Reload report conversation' }));
  expect(await screen.findByText('Stub follow-up explanation.')).toBeInTheDocument();
});

test('provider unavailable never fabricates a response', async () => {
  getReportConversation.mockResolvedValue({ data: { turns: [], available: false } });
  render(<ReportChat reportId="a" />);
  expect(await screen.findByText(/Chat unavailable.*No simulated answer/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Ask report question' })).toBeDisabled();
  expect(sendReportQuestion).not.toHaveBeenCalled();
});

test.each([502, 503, 504])('failure %s retains question for retry and shows no assistant success', async status => {
  await ready();
  sendReportQuestion.mockRejectedValueOnce({ response: { status, data: { message: 'Stub request failed; retry.' } } });
  fireEvent.change(screen.getByLabelText('Question about this report'), { target: { value: 'Fictional retry question' } });
  fireEvent.click(screen.getByRole('button', { name: 'Ask report question' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Stub request failed; retry.');
  expect(screen.getByLabelText('Question about this report')).toHaveValue('Fictional retry question');
  expect(screen.queryByText(/Provider-generated response/i)).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Ask report question' })).toBeEnabled();
});

test('rejects whitespace and displays authentication/history failures', async () => {
  await ready();
  fireEvent.change(screen.getByLabelText('Question about this report'), { target: { value: '   ' } });
  fireEvent.click(screen.getByRole('button', { name: 'Ask report question' }));
  expect(screen.getByRole('alert')).toHaveTextContent(/1–1,000/i);
  expect(sendReportQuestion).not.toHaveBeenCalled();
  getReportConversation.mockRejectedValueOnce({ response: { status: 401 } });
  fireEvent.click(screen.getByRole('button', { name: 'Reload report conversation' }));
  expect(await screen.findByRole('alert')).toHaveTextContent(/sign in again/i);
});

test('switching report unmounts old conversation and ignores its late send response', async () => {
  let complete;
  sendReportQuestion.mockReturnValue(new Promise(resolve => { complete = resolve; }));
  const view = render(<ReportChat key="a" reportId="a" />);
  await screen.findByText(/Report context is truncated/i);
  fireEvent.change(screen.getByLabelText('Question about this report'), { target: { value: 'Fictional report A question' } });
  fireEvent.click(screen.getByRole('button', { name: 'Ask report question' }));
  getReportConversation.mockResolvedValueOnce({ data: { turns: [turn('b', 'Report B stored stub answer')], available: true } });
  view.rerender(<ReportChat key="b" reportId="b" />);
  expect(await screen.findByText('Report B stored stub answer')).toBeInTheDocument();
  await act(async () => complete({ data: turn('a', 'Late report A answer') }));
  expect(screen.queryByText('Late report A answer')).not.toBeInTheDocument();
  expect(screen.getByLabelText('Question about this report')).toHaveValue('');
});
