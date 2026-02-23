/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEV_LAN_HOST?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const __AUTO_DEV_LAN_HOST__: string;
