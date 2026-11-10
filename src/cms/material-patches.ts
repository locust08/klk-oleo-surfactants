import materials from './drive-materials.json' with { type: 'json' };
import { helpItems } from '../lib/content';
import type { MaterialPatch } from './material-import';

export function buildMaterialPatches(): MaterialPatch[] {
  return [
    ...materials.articles.map(article => ({ ...article, collection: 'news', key: `${materials.version}:${article.slug}` })),
    { collection: 'pages', slug: 'news-media', key: `${materials.version}:news-media`, publish: true, data: materials.newsPage },
    { collection: 'home', slug: 'home', key: `${materials.version}:home`, publish: true, data: current => {
      if (!Array.isArray(current.help_items)) throw new Error('Home help cards require editorial review before importing icons.');
      return {
        award_image: current.award_image || materials.award,
        help_items: current.help_items.map((item: Record<string, unknown>) => {
          const index = helpItems.findIndex(([title]) => title === item.title);
          if (index === -1) throw new Error('A renamed help card requires editorial icon mapping.');
          return { ...item, image: item.image || materials.helpImages[index] };
        }),
      };
    } },
  ];
}
