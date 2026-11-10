import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import react from '@astrojs/react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [react()],
  devToolbar: { enabled: false },
  server: { host: '127.0.0.1', port: 4371 },
  vite: { resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } }, server: { watch: { ignored: ['**/.superpowers/**', '**/.next/**'] } } },
});
