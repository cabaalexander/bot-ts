import Followup from '../followup';
import Interaction from '../interaction';

describe('followup', () => {
  let followUp: Followup;
  const mockFetch = jest.fn();

  beforeEach(() => {
    const interaction = new Interaction({});
    followUp = new Followup(interaction, { fetch: mockFetch });
  });

  it('should create a followup instance', () => {
    expect(followUp).toBeInstanceOf(Followup);
  });

  const cases: Array<{
    label: string;
    methodName: keyof Followup;
    methodArgs?: Array<unknown>;
    expected: Array<Record<string, unknown> | string>;
  }> = [
    {
      label: 'should make a reply on the followup',
      methodName: 'reply',
      expected: [
        'https://discord.com/api/v10/webhooks/',
        {
          body: '{"content":"some default body"}',
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
        },
      ],
    },
    {
      label: 'should get followup message',
      methodName: 'get',
      methodArgs: [],
      expected: [
        'https://discord.com/api/v10/webhooks///messages/',
        { method: 'GET' },
      ],
    },
    {
      label: 'should edit follow up message',
      methodName: 'edit',
      expected: [
        'https://discord.com/api/v10/webhooks///messages/',
        {
          body: '{"content":"some default body"}',
          headers: { 'Content-Type': 'application/json' },
          method: 'PATCH',
        },
      ],
    },
  ];

  // @highlight
  test.each(cases)(
    '$label',
    ({
      methodName,
      expected,
      methodArgs = [{ content: 'some default body' }],
    }) => {
      // @ts-expect-error 2556
      followUp[methodName](...methodArgs);
      expect(mockFetch).toHaveBeenCalledWith(...expected);
    },
  );
});
