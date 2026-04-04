/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MOCA_SITE?: string;
  readonly VITE_API_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
