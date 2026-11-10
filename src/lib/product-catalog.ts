export type CategorySlug = 'anionic' | 'cationic' | 'nonionic';
export type Product = { brand:string; slug:string; category:CategorySlug; descriptor?:string; summary?:string; brochure?:string };
export const categories: {slug:CategorySlug;name:string}[] = [{slug:'anionic',name:'Anionic Surfactants'},{slug:'cationic',name:'Cationic Surfactants'},{slug:'nonionic',name:'Nonionic Surfactants'}];
export function categoryName(slug:CategorySlug){return categories.find(item=>item.slug===slug)!.name;}
export const productPath=(product:Product)=>`/surfactants/products/${product.category}#${product.slug}`;
export function searchCatalog(products:Product[],input:string):Product[]{const query=input.normalize('NFKC').trim().toLowerCase().slice(0,120);if(!query)return [];const words=query.split(/\s+/);return products.filter(product=>{const text=`${product.brand} ${product.descriptor??''} ${categoryName(product.category)}`.toLowerCase();return words.every(word=>text.includes(word));});}
