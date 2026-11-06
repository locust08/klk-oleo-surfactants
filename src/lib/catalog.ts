export type CategorySlug = 'anionic' | 'cationic' | 'nonionic';
export type Product = { brand: string; slug: string; category: CategorySlug; descriptor?: string; summary?: string };
export const categories: {slug:CategorySlug;name:string}[] = [
  {slug:'anionic',name:'Anionic Surfactants'},
  {slug:'cationic',name:'Cationic Surfactants'},
  {slug:'nonionic',name:'Nonionic Surfactants'},
];
const rows: [string,CategorySlug,string?][] = [
 ['PALMOSALT','anionic','Soap Noodles'],['PALMFONATE','anionic','Methyl Ester Sulphonates'],
 ['SERMUL','anionic'],['SERVO','anionic'],['SERVOXYL','anionic'],['SERWET','anionic'],
 ['SYMPARE','anionic','Methyl Ester Sulphonates'],['TENSAFIN','anionic'],
 ['TENSAGEX','anionic','Alcohol Ether Sulphates'],['TENSARYL','anionic','Linear Alkylbenzene Sulphonates & Sulphonic Acids'],
 ['TENSOMILD','anionic','Sulphosuccinates'],['TENSOPOL','anionic','Alcohol Sulphates'],
 ['SERVAMINE','cationic'],['AIDIGRO','nonionic','Agrochemicals'],
 ['GREENBENTIN','nonionic','Ethoxylates & Alkoxylates'],['HEDICOL','nonionic'],
 ['HEDILUB','nonionic','Alkoxylates & Ester'],['HEDIPIN','nonionic','Alkoxylates, Triglyceride Ethoxylates & Esters'],
 ['HEDJUVAN','nonionic','Polysorbates, Sorbitan Esters & Polyethylene Glycols'],['IMBENTIN','nonionic','Ethoxylates & Alkoxylates'],
 ['KOTILEN','nonionic','Sorbitan Ester Ethoxylates (Polysorbates)'],['SERDAS','nonionic'],['SERDOS','nonionic'],['SERVIROX','nonionic'],
 ['SYMPATENS','nonionic','Fatty Alcohol & Fatty Acid Ethoxylates, Triglyceride Ethoxylates'],
];
export const products: Product[] = rows.map(([brand,category,descriptor])=>({brand,category,descriptor,slug:brand.toLowerCase()}));
export function categoryName(slug:CategorySlug){ return categories.find(c=>c.slug===slug)!.name; }
export function searchProducts(input:string):Product[]{
 const query=input.normalize('NFKC').trim().toLowerCase().slice(0,120);
 if(!query) return [];
 const words=query.split(/\s+/);
 return products.filter(p=>{
   const haystack=`${p.brand} ${p.descriptor??''} ${categoryName(p.category)}`.toLowerCase();
   return words.every(word=>haystack.includes(word));
 });
}
export const productPath=(p:Product)=>`/surfactants/products/${p.category}#${p.slug}`;
