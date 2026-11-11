export const newsMarketOptions = ['Beauty & Personal Care', 'Home Care and I&I Cleaning', 'Lubricants', 'Agrochemicals', 'Textile and Leather'] as const;
export type NewsMarket = typeof newsMarketOptions[number];

export function filterNews<T extends { category: string; markets: readonly NewsMarket[] }>(items: readonly T[], category: string, market: string): T[] {
  return items.filter(item => (category === 'All' || item.category === category) && (market === 'All' || item.markets.some(tag => tag === market)));
}
