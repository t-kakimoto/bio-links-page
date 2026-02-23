import { networkInterfaces } from 'node:os';
import { defineConfig } from 'vite';

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const ciBasePath = repositoryName ? `/${repositoryName}/` : '/';
const base =
  process.env.VITE_BASE_PATH ??
  (process.env.GITHUB_ACTIONS === 'true' ? ciBasePath : '/');

const PRIVATE_IPV4_RANGES = [
  /^192\.168\./,
  /^10\./,
  /^172\.(1[6-9]|2\d|3[0-1])\./,
];

function detectAutoDevLanHost(): string {
  const interfaces = networkInterfaces();
  const candidates: string[] = [];

  Object.values(interfaces).forEach((entries) => {
    entries?.forEach((entry) => {
      if (entry.family === 'IPv4' && !entry.internal) {
        candidates.push(entry.address);
      }
    });
  });

  for (const range of PRIVATE_IPV4_RANGES) {
    const match = candidates.find((address) => range.test(address));
    if (match) {
      return match;
    }
  }

  return '';
}

export default defineConfig(({ command }) => {
  const autoDevLanHost = command === 'serve' ? detectAutoDevLanHost() : '';

  return {
    base,
    define: {
      __AUTO_DEV_LAN_HOST__: JSON.stringify(autoDevLanHost),
    },
    test: {
      environment: 'jsdom',
      include: ['src/**/*.test.ts'],
    },
  };
});
