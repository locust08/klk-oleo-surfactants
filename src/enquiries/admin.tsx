import { useEffect, useState } from 'react';
import { apiFetch, parseApiResponse } from 'emdash/plugin-utils';
import type { Lead } from './intake';

function Inbox() {
  const [items, setItems] = useState<{ id: string; data: Lead & { notificationPreview: { subject: string; text: string } } }[]>([]);
  const [message, setMessage] = useState('Loading enquiries…');
  const [cursor, setCursor] = useState<string>();
  async function load(next?: string) {
    try {
      const identity = await parseApiResponse<{ role: number }>(await apiFetch('/_emdash/api/auth/me'));
      if (identity.role < 50) { setMessage('Agency administration is required to access enquiries.'); return; }
      const result = await parseApiResponse<{ items: typeof items; hasMore: boolean; cursor?: string }>(await apiFetch(`/_emdash/api/plugins/surfactants-enquiries/list${next ? `?cursor=${encodeURIComponent(next)}` : ''}`));
      setItems(previous => next ? [...previous, ...result.items] : result.items); setCursor(result.hasMore ? result.cursor : undefined); setMessage(result.items.length || next ? '' : 'No enquiries yet.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to load enquiries.'); }
  }
  useEffect(() => { void load(); }, []);
  return <section style={{ padding: 24, maxWidth: 1100 }}><h1 style={{ fontSize: 28, marginBottom: 12 }}>Surfactants enquiries</h1><p>Saved enquiries await manual agency handling. External email delivery is not configured.</p>{message && <p role="status">{message}</p>}
    {items.map(({ id, data }) => <article key={id} style={{ border: '1px solid #ccc', borderRadius: 8, padding: 20, marginTop: 20 }}><h2>{data.firstName} {data.lastName} — {data.company}</h2><p>{data.createdAt} · {data.status}</p><p><a href={`mailto:${data.email}`}>{data.email}</a> · {data.country}</p>{data.jobPosition && <p>{data.jobPosition}</p>}<p style={{ whiteSpace: 'pre-wrap', marginBlock: 12 }}>{data.message}</p>{data.product && <p>Product: {data.product.title}</p>}<details><summary>Consent and notification preview</summary><p>{data.consentText}</p><p>Recorded {data.consentAt}</p><p>Notification: {data.notificationStatus}</p><pre style={{ whiteSpace: 'pre-wrap' }}>{data.notificationPreview.subject}{'\n\n'}{data.notificationPreview.text}</pre></details></article>)}
    {cursor && <button onClick={() => void load(cursor)}>Load more enquiries</button>}
  </section>;
}
export const pages = { '/inbox': Inbox };
