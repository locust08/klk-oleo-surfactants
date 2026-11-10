import { createContext, useContext, type ReactNode } from 'react';
import type { SiteData } from '../cms/types';
const Context = createContext<SiteData | null>(null);
export function SiteProvider({ data, children }: { data: SiteData; children: ReactNode }) { return <Context.Provider value={data}>{children}</Context.Provider>; }
export function useSiteData() { const data = useContext(Context); if (!data) throw new Error('Site content provider is missing.'); return data; }
