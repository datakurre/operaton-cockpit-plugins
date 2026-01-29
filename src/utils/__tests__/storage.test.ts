/**
 * Tests for storage abstraction
 */
import { getStorage, setStorage, resetStorage, MemoryStorage, type Storage } from '../storage';

describe('MemoryStorage', () => {
  let storage: MemoryStorage;

  beforeEach(() => {
    storage = new MemoryStorage();
  });

  it('stores and retrieves values', () => {
    storage.set('key', 'value');
    expect(storage.get('key')).toBe('value');
  });

  it('returns null for non-existent keys', () => {
    expect(storage.get('nonexistent')).toBeNull();
  });

  it('removes values', () => {
    storage.set('key', 'value');
    storage.remove('key');
    expect(storage.get('key')).toBeNull();
  });

  it('clears all values', () => {
    storage.set('key1', 'value1');
    storage.set('key2', 'value2');
    storage.clear();
    expect(storage.get('key1')).toBeNull();
    expect(storage.get('key2')).toBeNull();
  });

  it('overwrites existing values', () => {
    storage.set('key', 'old');
    storage.set('key', 'new');
    expect(storage.get('key')).toBe('new');
  });
});

describe('Storage injection', () => {
  afterEach(() => {
    resetStorage();
  });

  it('returns default localStorage adapter by default', () => {
    const storage = getStorage();
    expect(storage).toBeDefined();
    expect(typeof storage.get).toBe('function');
    expect(typeof storage.set).toBe('function');
    expect(typeof storage.remove).toBe('function');
  });

  it('allows setting a custom storage implementation', () => {
    const getMock = jest.fn().mockReturnValue('mocked');
    const setMock = jest.fn();
    const removeMock = jest.fn();
    const mockStorage: Storage = {
      get: getMock,
      set: setMock,
      remove: removeMock,
    };

    setStorage(mockStorage);
    const storage = getStorage();

    expect(storage.get('key')).toBe('mocked');
    expect(getMock).toHaveBeenCalledWith('key');
  });

  it('resetStorage restores default implementation', () => {
    const mockStorage = new MemoryStorage();
    mockStorage.set('test', 'memory');

    setStorage(mockStorage);
    expect(getStorage().get('test')).toBe('memory');

    resetStorage();
    // After reset, should use localStorage (which won't have our test value)
    expect(getStorage()).toBeDefined();
  });
});
