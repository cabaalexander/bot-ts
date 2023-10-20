import getCommandsUrl from '../get-commands-url';

describe('getCommandsUrl', () => {
  it('should log root commands url', () => {
    const data = getCommandsUrl({ applicationId: '123321' });
    expect(data).toBe('/applications/123321/commands');
  });

  it('should get url for guilds commands', () => {
    const data = getCommandsUrl({
      applicationId: '123',
      guildId: '321',
    });
    expect(data).toBe('/applications/123/guilds/321/commands');
  });

  it('should get url for command based on command.id', () => {
    const data = getCommandsUrl({
      applicationId: '876678',
      commandId: '65656',
    });
    expect(data).toBe('/applications/876678/commands/65656');
  });

  it('should get url command on a guild', () => {
    const data = getCommandsUrl({
      applicationId: '848477',
      guildId: '969184',
      commandId: '1938575',
    });
    expect(data).toBe('/applications/848477/guilds/969184/commands/1938575');
  });
});
