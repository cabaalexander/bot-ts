import { type Context } from 'hono';

export type Bindings = {
  DISCORD_TOKEN: string;
  DISCORD_PUBLIC_KEY: string;
  DISCORD_APPLICATION_ID: string;

  CLOUDFLARE_ACCOUNT_ID: string;
  CLOUDFLARE_API_TOKEN: string;

  AUTH_USER: string;
  AUTH_PASS: string;

  NO_LOG?: string;
};

export type ContextCustom = Context<{ Bindings: Bindings }>;
