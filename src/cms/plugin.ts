import { definePlugin, ContentSaveRejectedError } from 'emdash';
import { validateDestinations } from './content-policy';

export function createPlugin() {
  return definePlugin({
    id: 'surfactants-content', version: '0.1.0',
    capabilities: ['content:read', 'content:write', 'hooks.content-policy:register'],
    hooks: {
      'content:beforeSave': async event => {
        try { validateDestinations(event.content); }
        catch (error) { throw new ContentSaveRejectedError((error as Error).message); }
        return event.content;
      },
      'content:beforePublish': async event => {
        const content = event.content;
        const data = content.data as Record<string, unknown>;
        const expected = event.collection === 'home' ? 'home' : event.collection === 'site_content' ? 'site' : event.collection === 'pages' ? data.route : null;
        if (expected && content.slug !== expected) return { cancel: true, reason: 'This entry has a fixed route. Restore its original slug before publishing.' };
        validateDestinations(data);
      },
    },
  });
}
