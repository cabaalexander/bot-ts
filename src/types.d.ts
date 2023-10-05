import {type Env, type Context} from 'hono';

export type Bindings = {
  DISCORD_TOKEN: string;
  DISCORD_PUBLIC_KEY: string;
  DISCORD_APPLICATION_ID: string;
  CF_ACCOUNT_ID: string;
  CF_API_TOKEN: string;
  NO_LOG: string | undefined;
};

export type ContextCustom = Context<{Bindings: Bindings}>;
