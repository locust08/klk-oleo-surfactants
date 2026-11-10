import { useEffect, useState } from 'react';
export function ReceiptStatus({ receipt }: { receipt: string }) {
  const [state, setState] = useState<'checking' | 'received' | 'missing'>('checking');
  useEffect(() => {
    let cancelled = false;
    fetch(`/_emdash/api/plugins/surfactants-enquiries/receipt?id=${encodeURIComponent(receipt)}`)
      .then(response => response.json()).then(result => { if (!cancelled) setState(result.data?.received ? 'received' : 'missing'); })
      .catch(() => { if (!cancelled) setState('missing'); });
    return () => { cancelled = true; };
  }, [receipt]);
  return <section className="section container" aria-live="polite"><h1>{state === 'received' ? 'Thank you for your enquiry' : state === 'checking' ? 'Checking your enquiry receipt' : 'Enquiry receipt unavailable'}</h1><p style={{ marginBlock: 24 }}>{state === 'received' ? 'Your enquiry has been received. Our team will review your details and respond.' : state === 'checking' ? 'Please wait a moment.' : 'We could not verify this receipt. If you still have your enquiry open, please try submitting it again.'}</p><a className="button" href="/surfactants">Return to homepage</a></section>;
}
