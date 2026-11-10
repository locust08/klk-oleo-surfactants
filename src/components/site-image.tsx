import type { ImgHTMLAttributes } from 'react';

type Props = ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean };

/** Shared image markup for React islands; styling matches the original layout. */
export function SiteImage({ fill, priority, style, alt = '', ...props }: Props) {
  return <img {...props} alt={alt} loading={priority ? 'eager' : props.loading || 'lazy'} fetchPriority={priority ? 'high' : undefined}
    style={{ ...(fill ? { position: 'absolute', inset: 0, width: '100%', height: '100%' } as const : {}), ...style }} />;
}
