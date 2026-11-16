// Cloudflare Worker entry: EmDash's wrapper around the Astro handler, adding scheduled publishing.
import handler from '@emdash-cms/cloudflare/worker';
export { EmDashRoom, EmDashRoomSite, PluginBridge } from '@emdash-cms/cloudflare/worker';

export default handler;
