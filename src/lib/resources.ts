export const resourceMarkets=['Beauty & Personal Care','Home Care and I&I Cleaning','Agrochemicals','Lubricants and Metalworking Fluids','Textile and Leather'];
export const resourceTypes=['Brochure','Leaflet','Formulation Guide'];
// Request categories from the supplied brief; no unpublished files are exposed.
export const resources=resourceMarkets.flatMap((market,m)=>resourceTypes.map((type,t)=>({id:`${m}-${t}`,market,type,title:`${market} — ${type}`})));
export function filterResources(query:string,market:string,type:string){const words=query.trim().toLowerCase().split(/\s+/).filter(Boolean);return resources.filter(r=>(!market||r.market===market)&&(!type||r.type===type)&&words.every(w=>r.title.toLowerCase().includes(w)));}
