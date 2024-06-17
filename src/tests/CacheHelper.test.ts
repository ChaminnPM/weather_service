import CacheHelper from '../Common/Cache/CacheHelper';

describe('CacheHelper', () => {
  let cacheHelper: CacheHelper;

  beforeEach(() => {
    cacheHelper = CacheHelper.getInstance();
  });

  afterEach(() => {
    cacheHelper.clear();
  });

  test('set and get', () => {
    cacheHelper.set('key', 'value');
    expect(cacheHelper.get('key')).toBe('value');
  });

  test('existKey', () => {
    cacheHelper.set('key', 'value');
    expect(cacheHelper.existKey('key')).toBe(true);
    expect(cacheHelper.existKey('nonexistent')).toBe(false);
  });

  test('remove', () => {
    cacheHelper.set('key', 'value');
    cacheHelper.remove('key');
    expect(cacheHelper.get('key')).toBeUndefined();
  });

  test('clear', () => {
    cacheHelper.set('key1', 'value1');
    cacheHelper.set('key2', 'value2');
    cacheHelper.clear();
    expect(cacheHelper.existKey('key1')).toBe(false);
    expect(cacheHelper.existKey('key2')).toBe(false);
  });
});