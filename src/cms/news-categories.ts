export const newsCategories = ['Exhibition', 'Product', 'Corporate', 'Sustainability'] as const;
export type NewsCategory = typeof newsCategories[number];
