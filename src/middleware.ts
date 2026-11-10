import { defineMiddleware } from 'astro:middleware';

const fixedCollections=new Set(['home','site_content','pages','service_pages']);

// Native slug-only updates and duplication bypass beforeSave. Fence both exposed transports.
export const onRequest = defineMiddleware(async ({request,url,locals},next) => {
  if(!locals.user)return next();
  const expectedRoute=async(collection:string,id:string)=>{
    if(collection==='home')return 'home';
    if(collection==='site_content')return 'site';
    const current=await locals.emdash?.handleContentGet(collection,id);
    return current?.success?(current.data?.item.data as Record<string,unknown>|undefined)?.route:undefined;
  };
  const reject=(message:string,rpc?:{id?:unknown})=>Response.json(rpc?{jsonrpc:'2.0',id:typeof rpc.id==='string'||typeof rpc.id==='number'?rpc.id:null,error:{code:-32602,message}}:{success:false,error:{code:'FIXED_ROUTE',message}},{status:400,headers:{'Cache-Control':'private, no-store'}});
  const duplicateMessage='Edit the imported fixed entry. Additional fixed page entries are not supported.';
  const slugMessage='This entry has a fixed route. Keep its original slug.';
  const match=url.pathname.match(/^\/_emdash\/api\/content\/(home|site_content|pages|service_pages)\/([^/]+)(\/duplicate)?$/);
  if(match) {
    if(match[3]&&request.method==='POST')return reject(duplicateMessage);
    if(!match[3]&&['PUT','PATCH'].includes(request.method)) {
      let body:Record<string,unknown>;
      try{body=await request.clone().json();}catch{return next();}
      if(body?.slug!==undefined) {
        let id:string;try{id=decodeURIComponent(match[2]);}catch{return reject(slugMessage);}
        const expected=await expectedRoute(match[1],id);
        if(expected&&body.slug!==expected)return reject(slugMessage);
      }
    }
  }
  if(url.pathname==='/_emdash/api/mcp'&&request.method==='POST') {
    let body:unknown;try{body=await request.clone().json();}catch{return next();}
    for(const value of Array.isArray(body)?body:[body]) {
      if(!value||typeof value!=='object')continue;
      const rpc=value as {id?:unknown;method?:string;params?:{name?:string;arguments?:Record<string,unknown>}};
      const args=rpc.params?.arguments;
      if(rpc.method!=='tools/call'||!args||typeof args.collection!=='string'||!fixedCollections.has(args.collection))continue;
      if(rpc.params?.name==='content_duplicate')return reject(duplicateMessage,rpc);
      if(rpc.params?.name==='content_update'&&args.slug!==undefined&&typeof args.id==='string') {
        const expected=await expectedRoute(args.collection,args.id);
        if(expected&&args.slug!==expected)return reject(slugMessage,rpc);
      }
    }
  }
  return next();
});
