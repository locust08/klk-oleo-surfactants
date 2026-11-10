'use client';

import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react';

export function PilotRevealCard({ title, children, description, index }: { title: string; children: ReactNode; description: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const descriptionId = useId();

  useEffect(() => {
    const element = ref.current;
    if (!element || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        element.dataset.visible = 'true';
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    element.dataset.animated = 'true';
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className="pilot-reveal-wrap" style={{ '--reveal-delay': `${index * 120}ms` } as CSSProperties}>
    <button type="button" className="pilot-reveal-card" aria-label={title} aria-expanded={open} aria-describedby={open ? descriptionId : undefined}
      onPointerEnter={event => { if (event.pointerType === 'mouse') setOpen(true); }}
      onPointerLeave={event => { if (event.pointerType === 'mouse') setOpen(false); }}
      onClick={event => { if (event.detail === 0 || !window.matchMedia('(hover: hover)').matches) setOpen(value => !value); else setOpen(true); }}
      onBlur={() => setOpen(false)} onKeyDown={event => { if (event.key === 'Escape') setOpen(false); }}>
      <span className="pilot-reveal-front" aria-hidden={open}>{children}<span className="pilot-reveal-hint">Explore details <span aria-hidden="true">↑</span></span></span>
      <span className="pilot-reveal-back" aria-hidden={!open}><span className="pilot-reveal-back-title">{title}</span><span id={descriptionId}>{description}</span></span>
    </button>
  </div>;
}
