import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import react from '@astrojs/react';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import emdash, { local } from 'emdash/astro';
import { sqlite } from 'emdash/db';

if (existsSync('.env')) process.loadEnvFile('.env');

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [react(), emdash({
    database: sqlite({ url: process.env.EMDASH_DATABASE_URL || 'file:./data.db' }),
    storage: local({ directory: process.env.EMDASH_UPLOADS_DIR || './uploads', baseUrl: '/_emdash/api/media/file' }),
    siteUrl: process.env.EMDASH_SITE_URL || 'http://127.0.0.1:4371',
    fonts: false,
    updateCheck: false,
    admin: { siteName: 'KLK OLEO Surfactants CMS', locales: ['en'] },
    plugins: [
      { id: 'surfactants-content', version: '0.1.0', format: 'native', entrypoint: 'klk-oleo-surfactants/cms-plugin' },
      { id: 'surfactants-enquiries', version: '0.1.0', format: 'native', entrypoint: 'klk-oleo-surfactants/enquiries-plugin', adminEntry: 'klk-oleo-surfactants/enquiries-admin' },
    ],
  })],
  devToolbar: { enabled: false },
  server: { host: '127.0.0.1', port: 4371 },
  vite: { resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } }, server: { watch: { ignored: ['**/.superpowers/**', '**/.next/**'] } } },
});
