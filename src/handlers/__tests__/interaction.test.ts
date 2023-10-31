import {
  ApplicationCommandType,
  InteractionResponseType,
  InteractionType,
} from 'discord-api-types/v10';
import { Hono } from 'hono';

import {
  HTTP_CODE_BAD_REQUEST,
  HTTP_CODE_NOT_FOUND,
  HTTP_CODE_OK,
} from '../../config/constants';
import SlashCommand from '../../lib/slash-command';
import handleInteraction from '../interaction';

describe('handlers/interactions', () => {
  let app: Hono;
  let req: Request;
  let reqNoBody: Request;
  const command = new SlashCommand()
    .setName('test-command')
    .setDescription('test description')
    .handle(() => ({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: { content: 'showing something on discord' },
    }));

  beforeEach(() => {
    app = new Hono();
    req = new Request('http://localhost/', {
      method: 'POST',
      body: JSON.stringify({
        type: InteractionType.ApplicationCommand,
        data: {
          guild_id: '111',
          id: '222',
          name: 'test-command',
          type: ApplicationCommandType.ChatInput,
        },
      }),
    });
    reqNoBody = new Request('http://localhost/', { method: 'POST' });
  });

  it('should handle command not found', async () => {
    app.post(
      '/',
      handleInteraction({
        commandsDict: { 'not-command': command },
      }),
    );

    const res = await app.request(req);
    const expectedBody = {
      ok: false,
      errors: ['command not found'],
      msg: 'interaction error',
    };

    expect(res.status).toBe(HTTP_CODE_NOT_FOUND);
    expect(await res.json()).toEqual(expectedBody);
  });

  it('should handle post request with no body', async () => {
    app.post(
      '/',
      handleInteraction({ commandsDict: { 'test-command': command } }),
    );

    const res = await app.request(reqNoBody);
    const data = await res.json();
    const expectedData = {
      ok: false,
      errors: ['not valid json body'],
      msg: 'interaction error',
    };

    expect(res.status).toBe(HTTP_CODE_BAD_REQUEST);
    expect(data).toEqual(expectedData);
  });

  it('should handle valid commands', async () => {
    app.post(
      '/',
      handleInteraction({ commandsDict: { 'test-command': command } }),
    );

    const res = await app.request(req);
    const data = await res.json();
    const expectedData = {
      type: 4,
      data: { content: 'showing something on discord' },
    };

    expect(res.status).toBe(HTTP_CODE_OK);
    expect(data).toEqual(expectedData);
  });
});
