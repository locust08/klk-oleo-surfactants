import type { Article, Hero } from './types';

type PublishedService = { route:string; title:string };
const routes:Record<string,string>={'Custom Manufacturing':'custom-manufacturing','Pilot Plant':'pilot-plant'};
export function serviceHref(title:string,services:PublishedService[]) {
  const route=routes[title];
  return route&&services.some(page=>page.route===route)?`/surfactants/${route}`:undefined;
}
export function heroDestination(slide:Pick<Hero,'kind'|'target'>,articles:Article[],services:PublishedService[]) {
  if(['anchor','external'].includes(slide.kind))return slide.target;
  if(slide.kind==='article'&&articles.some(article=>article.slug===slide.target&&article.body?.length&&article.publishedAt))return `/surfactants/news-media/${slide.target}`;
  return slide.kind==='deferred'?serviceHref(slide.target,services):undefined;
}
