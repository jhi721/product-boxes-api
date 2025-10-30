import { transformQueryJson } from './';

describe('transformQueryJson', () => {
  it('should parse a valid JSON object', () => {
    const obj: Record<string, string> = {
      boxId: 'id',
    };

    const result = transformQueryJson<typeof obj>({
      value: JSON.stringify(obj),
    });

    expect(result).toEqual(obj);
  });

  it('should return undefined on invalid JSON', () => {
    const result = transformQueryJson({ value: '{}[][sad' });

    expect(result).toBeUndefined();
  });

  it('returns undefined when value is not a string', () => {
    // @ts-expect-error test case for invalid input
    const result = transformQueryJson({ value: 123 });

    expect(result).toBeUndefined();
  });
});
