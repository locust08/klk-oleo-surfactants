import { defineMiddleware } from 'astro:middleware';

// EmDash's save hooks receive data only and omit slug-only updates. Guard those REST writes here.
export const onRequest = defineMiddleware(async ({request,url,locals},next) => {
  const match=url.pathname.match(/^\/_emdash\/api\/content\/(home|site_content|pages)\/([^/]+)$/);
  if (!match || !['PUT','PATCH'].includes(request.method) || !locals.user || locals.user.role < 40) return next();
  let body: Record<string,unknown>;
  try { body=await request.clone().json(); } catch { return next(); }
  if (body.slug === undefined) return next();
  const collection=match[1];
  let expected:unknown=collection==='home'?'home':collection==='site_content'?'site':undefined;
  if (collection==='pages') {
    const current=await locals.emdash?.handleContentGet(collection,decodeURIComponent(match[2]));
    if (current?.success) expected=(current.data?.item.data as Record<string,unknown> | undefined)?.route;
  }
  if (expected && body.slug !== expected) return Response.json({success:false,error:{code:'FIXED_ROUTE',message:'This entry has a fixed route. Keep its original slug.'}},{status:400,headers:{'Cache-Control':'private, no-store'}});
  return next();
});
