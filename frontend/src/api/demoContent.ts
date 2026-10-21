// Existing public content may still contain the original sample brand.
// Adapt only public display data; authentication and stored records stay intact.
export function demoContent<T>(value: T): T {
  if (typeof value === 'string') {
    return value
      .replace(/Bozkurt Mobilya/g, 'ABC Mobilya')
      .replace(/BozkurtMobilya/g, 'ABCMobilya')
      .replace(/[\w.-]*bozkurtmobilya\.(?:com|local)/gi, 'example.com')
      .replace(/\/uploads\/logo\.png/g, '/demo-logo.svg') as T;
  }
  if (Array.isArray(value)) return value.map(demoContent) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, demoContent(item)]),
    ) as T;
  }
  return value;
}
