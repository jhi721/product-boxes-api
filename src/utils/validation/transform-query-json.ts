export const transformQueryJson = <T>({
  value,
}: {
  value: string;
}): T | undefined => {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T;
    } catch {
      return undefined;
    }
  }
};
