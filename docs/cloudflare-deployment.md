# Cloudflare deployment

Account: Eason CF Main (`e7c515dde995479daacd82ad79dfc3e8`). Worker: `klk-oleo-surfactants`.
URL: https://klk-oleo-surfactants.easondev.workers.dev/surfactants

The Astro + EmDash application replaces the earlier Next.js/OpenNext Worker under the same name.
Local development and tests keep the Node adapter, SQLite and local uploads. `npm run build:worker`
sets `EMDASH_TARGET=cloudflare`, which switches to `@astrojs/cloudflare`, D1 (`DB`,
`klk-oleo-surfactants-cms`) and R2 (`MEDIA`, `klk-oleo-surfactants-media`). Wrangler provisions
both on first deploy; the adapter adds `SESSION` KV and `IMAGES`. The cron trigger runs EmDash
scheduled publishing. `EMDASH_SITE_URL` is embedded at build time, so change it in `package.json`
and `wrangler.jsonc` together before moving to a custom domain (passkeys are bound to the hostname).

## Commands

```sh
npm ci
npm run lint && npm run typecheck && npm test
npm run build:worker
npx wrangler deploy --dry-run
npx wrangler deploy
```

## Initial content import

The hosted database starts from the reviewed local editorial database. Export it without accounts,
passkeys, tokens or sessions, with first-admin setup reopened and fresh preview/IP secrets:

```sh
node scripts/export-d1.mjs data.db /path/outside/repo/surfactants-d1.sql https://klk-oleo-surfactants.easondev.workers.dev
npx wrangler d1 execute DB --remote --file /path/outside/repo/surfactants-d1.sql
```

Run this only against an empty D1 database. Later content changes are made in EmDash itself.

## First admin

Hosted setup is closed by the `EMDASH_SETUP_KEY` Worker secret (`npx wrangler secret put EMDASH_SETUP_KEY`).
Open `/_emdash/admin/setup?setup_key=<key>`, leave sample content off (content is already imported),
create the agency Admin and register a passkey. Delete the secret afterwards
(`npx wrangler secret delete EMDASH_SETUP_KEY`); EmDash closes setup once it is complete.
