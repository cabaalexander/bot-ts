import {
  ApplicationCommandType,
  ButtonStyle,
  ComponentType,
  InteractionResponseType,
  InteractionType,
  MessageFlags,
} from 'discord-api-types/v10';
import { Hono } from 'hono';

import {
  HTTP_CODE_BAD_REQUEST,
  HTTP_CODE_NOT_FOUND,
  HTTP_CODE_OK,
} from '../../config/constants';
import SlashCommand from '../../lib/slash-command';
import SlashComponent from '../../lib/slash-component';
import handleInteraction from '../interaction';

describe('interactions', () => {
  let app: Hono;
  let reqNoBody: Request;

  const command = new SlashCommand('test-command', 'test description');
  command.handle(() => ({
    type: InteractionResponseType.ChannelMessageWithSource,
    data: { content: 'showing something on discord' },
  }));
  const component = new SlashComponent({
    type: ComponentType.Button,
    style: ButtonStyle.Primary,
    custom_id: 'comp_m0',
  });
  component.handle(() => ({
    type: InteractionResponseType.ChannelMessageWithSource,
    data: { content: 'component content yes' },
  }));

  beforeEach(() => {
    app = new Hono();
    reqNoBody = new Request('http://localhost/', { method: 'POST' });
  });

  describe('commands', () => {
    let commandReq: Request;

    beforeEach(() => {
      commandReq = new Request('http://localhost/', {
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
    });

    it('should handle command not found', async () => {
      app.post(
        '/',
        handleInteraction({
          commands: { 'not-command': command },
        }),
      );

      const res = await app.request(commandReq);
      const data = await res.json();
      const expectedBody = {
        data: {
          content: '💥 command not triggered',
          flags: MessageFlags.Ephemeral,
        },
        type: InteractionResponseType.ChannelMessageWithSource,
      };

      expect(res.status).toBe(HTTP_CODE_OK);
      expect(data).toEqual(expectedBody);
    });

    it('should handle post request with no body', async () => {
      app.post(
        '/',
        handleInteraction({ commands: { 'test-command': command } }),
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
        handleInteraction({ commands: { 'test-command': command } }),
      );

      const res = await app.request(commandReq);
      const data = await res.json();
      const expectedData = {
        type: 4,
        data: { content: 'showing something on discord' },
      };

      expect(res.status).toBe(HTTP_CODE_OK);
      expect(data).toEqual(expectedData);
    });
  });

  describe('components', () => {
    let componentReq: Request;

    beforeEach(() => {
      componentReq = new Request('http://localhost/', {
        method: 'POST',
        body: JSON.stringify({
          type: InteractionType.MessageComponent,
          data: {
            custom_id: 'comp_m0',
            component_type: 2,
          },
        }),
      });
    });

    it('should get discord error for component not triggered', async () => {
      app.post(
        '/',
        handleInteraction({
          components: { 'no-component': component },
        }),
      );

      const res = await app.request(componentReq);
      const data = await res.json();
      const expectedBody = {
        data: {
          content: '💥 component not triggered',
          flags: MessageFlags.Ephemeral,
        },
        type: InteractionResponseType.ChannelMessageWithSource,
      };

      expect(res.status).toBe(HTTP_CODE_OK);
      expect(data).toEqual(expectedBody);
    });

    it('should handle existing component', async () => {
      app.post('/', handleInteraction({ components: { comp_m0: component } }));

      const res = await app.request(componentReq);
      const data = await res.json();
      const expectedData = {
        type: 4,
        data: { content: 'component content yes' },
      };

      expect(res.status).toBe(HTTP_CODE_OK);
      expect(data).toEqual(expectedData);
    });
  });

  it('should handle not found interaction', async () => {
    const wrongInteractionReq = new Request('http://localhost/', {
      method: 'POST',
      body: JSON.stringify({
        type: 'unknown',
        data: {
          custom_id: 'comp_m0',
          component_type: 2,
        },
      }),
    });

    app.post('/', handleInteraction({ components: { comp_m0: component } }));

    const res = await app.request(wrongInteractionReq);

    expect(res.status).toBe(HTTP_CODE_NOT_FOUND);
    expect(res.body).toBeNull();
  });
});
