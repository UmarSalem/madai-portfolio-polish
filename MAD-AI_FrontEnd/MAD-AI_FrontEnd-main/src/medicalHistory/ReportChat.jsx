import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getReportConversation, sendReportQuestion } from '../api/features';

const errorMessage = (error) => {
  const status = error?.response?.status;
  if (status === 401 || status === 403) return 'Please sign in again to use report chat.';
  if (status === 404) return 'This report conversation is unavailable for your account.';
  if ([400, 409, 502, 503, 504].includes(status) && typeof error.response.data?.message === 'string') return error.response.data.message;
  return 'Unable to load or send report chat. Please retry.';
};

export default function ReportChat({ reportId }) {
  const [turns, setTurns] = useState([]);
  const [question, setQuestion] = useState('');
  const [available, setAvailable] = useState(false);
  const [truncated, setTruncated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const alive = useRef(true);
  const pending = useRef(false);

  const load = useCallback(async () => {
    setLoading(true); setError(''); setAvailable(false);
    try {
      const { data } = await getReportConversation(reportId);
      if (!Array.isArray(data?.turns)) throw new Error('Invalid history');
      if (alive.current) {
        setTurns(data.turns); setAvailable(data.available === true); setTruncated(data.contextTruncated === true);
      }
    } catch (requestError) { if (alive.current) setError(errorMessage(requestError)); }
    finally { if (alive.current) setLoading(false); }
  }, [reportId]);

  useEffect(() => {
    alive.current = true;
    load();
    return () => { alive.current = false; };
  }, [load]);

  const send = async (event) => {
    event.preventDefault();
    if (pending.current || loading || !available) return;
    const text = question.trim();
    if (!text || text.length > 1000) { setError('Enter a fictional report question of 1–1,000 characters.'); return; }
    pending.current = true; setSending(true); setError('');
    try {
      const { data } = await sendReportQuestion(reportId, text);
      if (!data?.id || !data.answer || data.source !== 'provider') throw new Error('Invalid response');
      if (alive.current) {
        setTurns(previous => [...previous, data].slice(-20)); setQuestion('');
        setTruncated(data.contextTruncated === true);
      }
    } catch (requestError) { if (alive.current) setError(errorMessage(requestError)); }
    finally { pending.current = false; if (alive.current) setSending(false); }
  };

  return <section aria-label="Report follow-up chat">
    <h3>Questions about this saved report</h3>
    <p>Fictional data only. Educational explanations, not diagnosis or treatment advice. Context uses the saved report excerpt and bounded recent conversation; only the latest 20 successful exchanges are displayed.</p>
    {truncated && <p>Report context is truncated to the saved excerpt (at most 5,000 characters). Omitted report content is unavailable to chat.</p>}
    {loading && <p role="status">Loading report conversation...</p>}
    {!loading && !available && !error && <p role="status">Chat unavailable: no provider or extracted report text is available. No simulated answer will be generated.</p>}
    {error && <p role="alert">{error}</p>}
    <button type="button" disabled={loading || sending} onClick={load}>Reload report conversation</button>
    <div aria-live="polite">
      {turns.map(turn => <article key={turn.id}>
        <p><strong>Your question:</strong> {turn.question}</p>
        <p><strong>Provider-generated response — not medical advice:</strong> {turn.answer}</p>
      </article>)}
    </div>
    <form aria-label="Ask about report" onSubmit={send}>
      <label htmlFor={`report-question-${reportId}`}>Question about this report</label>
      <textarea id={`report-question-${reportId}`} value={question} onChange={event => setQuestion(event.target.value)} maxLength={1000} disabled={loading || sending || !available} />
      <button type="submit" disabled={loading || sending || !available}>{sending ? 'Waiting for response...' : 'Ask report question'}</button>
    </form>
    {sending && <p role="status">Requesting a report-grounded explanation...</p>}
  </section>;
}
