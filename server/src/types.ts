/// <reference types="@cloudflare/workers-types" />

export interface Bindings {
  DB: D1Database;
  CACHE: KVNamespace;
  API_SECRET?: string;
  JWT_SECRET: string;
}

export interface Variables {
  user: {
    id: string;
    email: string;
    name: string;
    balance: number;
    api_key: string;
  };
}
