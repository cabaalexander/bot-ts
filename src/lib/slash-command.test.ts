import SlashCommand from './slash-command';

describe('SlashCommand', () => {
  it('should set name and description', () => {
    const slashCommand = new SlashCommand();
    slashCommand.setName('foobar').setDescription('desc');
    const expected = { name: 'foobar', description: 'desc' };

    expect(slashCommand.build()).toStrictEqual(expected);
  });
});
