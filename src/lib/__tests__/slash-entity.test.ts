import type { TSlashBuild } from '../../config/types';
import SlashEntity from '../slash-entity';

describe('SlashEntity', () => {
  class FooM8 extends SlashEntity {
    private buildReturn = {
      type: 2,
      custom_id: 'custom_m3',
      style: 1,
    };

    build(): TSlashBuild {
      return this.buildReturn;
    }
  }

  const mockHandler = jest.fn();
  const foom8 = new FooM8();

  it('should return discord response if handler is not implemented', () => {
    // @ts-expect-error 2554
    foom8.execute();
    expect(mockHandler).not.toHaveBeenCalled();
  });

  it('should set the handler function', () => {
    foom8.handle(mockHandler);
    const interactionCallback = Reflect.get(foom8, 'interactionCallback');

    expect(interactionCallback).toBe(mockHandler);
  });

  it('should execute saved handler', () => {
    // @ts-expect-error 2554
    foom8.execute();
    expect(mockHandler).toHaveBeenCalled();
  });
});
