/**
 * Integration tests for dashboard-favourites plugin.
 *
 * Tests localStorage persistence and favourite management.
 *
 * @module
 */
import { setStorage, getStorage, MemoryStorage } from '../utils/storage';

// Storage key used by the favourites plugin
const FAVOURITES_KEY = 'minimal-history-plugin-favourites';

interface FavouriteDefinition {
  id: string;
  key: string;
  name: string | null;
  version: number;
}

/**
 * Load favourites from storage (duplicates plugin logic for testing).
 */
function loadFavourites(): FavouriteDefinition[] {
  const storage = getStorage();
  const raw = storage.get(FAVOURITES_KEY);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw) as FavouriteDefinition[];
  } catch {
    return [];
  }
}

/**
 * Save favourites to storage (duplicates plugin logic for testing).
 */
function saveFavourites(favourites: FavouriteDefinition[]): void {
  const storage = getStorage();
  storage.set(FAVOURITES_KEY, JSON.stringify(favourites));
}

/**
 * Check if a definition is favourited.
 */
function isFavourite(processDefinitionId: string): boolean {
  const favourites = loadFavourites();
  return favourites.some(f => f.id === processDefinitionId);
}

/**
 * Add a definition to favourites.
 */
function addFavourite(definition: FavouriteDefinition): void {
  const favourites = loadFavourites();
  if (!favourites.some(f => f.id === definition.id)) {
    favourites.push(definition);
    saveFavourites(favourites);
  }
}

/**
 * Remove a definition from favourites.
 */
function removeFavourite(processDefinitionId: string): void {
  const favourites = loadFavourites();
  const filtered = favourites.filter(f => f.id !== processDefinitionId);
  saveFavourites(filtered);
}

describe('dashboard-favourites localStorage persistence', () => {
  let memoryStorage: MemoryStorage;

  beforeEach(() => {
    memoryStorage = new MemoryStorage();
    setStorage(memoryStorage);
  });

  afterEach(() => {
    setStorage(null);
  });

  describe('loadFavourites', () => {
    it('should return empty array when no favourites stored', () => {
      const favourites = loadFavourites();
      expect(favourites).toEqual([]);
    });

    it('should return stored favourites', () => {
      const stored: FavouriteDefinition[] = [
        { id: 'def-1', key: 'process-1', name: 'Process 1', version: 1 },
        { id: 'def-2', key: 'process-2', name: 'Process 2', version: 2 },
      ];
      memoryStorage.set(FAVOURITES_KEY, JSON.stringify(stored));

      const favourites = loadFavourites();

      expect(favourites).toEqual(stored);
    });

    it('should return empty array for invalid JSON', () => {
      memoryStorage.set(FAVOURITES_KEY, 'invalid-json');

      const favourites = loadFavourites();

      expect(favourites).toEqual([]);
    });
  });

  describe('saveFavourites', () => {
    it('should save favourites to storage', () => {
      const favourites: FavouriteDefinition[] = [{ id: 'def-1', key: 'process-1', name: 'Process 1', version: 1 }];

      saveFavourites(favourites);

      const stored = memoryStorage.get(FAVOURITES_KEY);
      expect(stored).toBe(JSON.stringify(favourites));
    });

    it('should overwrite existing favourites', () => {
      const initial: FavouriteDefinition[] = [{ id: 'def-1', key: 'process-1', name: 'Process 1', version: 1 }];
      const updated: FavouriteDefinition[] = [{ id: 'def-2', key: 'process-2', name: 'Process 2', version: 2 }];

      saveFavourites(initial);
      saveFavourites(updated);

      const stored = memoryStorage.get(FAVOURITES_KEY);
      expect(stored).toBe(JSON.stringify(updated));
    });
  });

  describe('isFavourite', () => {
    it('should return false when no favourites exist', () => {
      expect(isFavourite('def-1')).toBe(false);
    });

    it('should return true for favourited definition', () => {
      const stored: FavouriteDefinition[] = [{ id: 'def-1', key: 'process-1', name: 'Process 1', version: 1 }];
      memoryStorage.set(FAVOURITES_KEY, JSON.stringify(stored));

      expect(isFavourite('def-1')).toBe(true);
    });

    it('should return false for non-favourited definition', () => {
      const stored: FavouriteDefinition[] = [{ id: 'def-1', key: 'process-1', name: 'Process 1', version: 1 }];
      memoryStorage.set(FAVOURITES_KEY, JSON.stringify(stored));

      expect(isFavourite('def-2')).toBe(false);
    });
  });

  describe('addFavourite', () => {
    it('should add a new favourite', () => {
      const definition: FavouriteDefinition = {
        id: 'def-1',
        key: 'process-1',
        name: 'Process 1',
        version: 1,
      };

      addFavourite(definition);

      const favourites = loadFavourites();
      expect(favourites).toHaveLength(1);
      expect(favourites[0]).toEqual(definition);
    });

    it('should not add duplicate favourites', () => {
      const definition: FavouriteDefinition = {
        id: 'def-1',
        key: 'process-1',
        name: 'Process 1',
        version: 1,
      };

      addFavourite(definition);
      addFavourite(definition);

      const favourites = loadFavourites();
      expect(favourites).toHaveLength(1);
    });

    it('should add multiple different favourites', () => {
      const def1: FavouriteDefinition = {
        id: 'def-1',
        key: 'process-1',
        name: 'Process 1',
        version: 1,
      };
      const def2: FavouriteDefinition = {
        id: 'def-2',
        key: 'process-2',
        name: 'Process 2',
        version: 1,
      };

      addFavourite(def1);
      addFavourite(def2);

      const favourites = loadFavourites();
      expect(favourites).toHaveLength(2);
    });
  });

  describe('removeFavourite', () => {
    it('should remove a favourite by id', () => {
      const stored: FavouriteDefinition[] = [
        { id: 'def-1', key: 'process-1', name: 'Process 1', version: 1 },
        { id: 'def-2', key: 'process-2', name: 'Process 2', version: 2 },
      ];
      memoryStorage.set(FAVOURITES_KEY, JSON.stringify(stored));

      removeFavourite('def-1');

      const favourites = loadFavourites();
      expect(favourites).toHaveLength(1);
      expect(favourites[0]?.id).toBe('def-2');
    });

    it('should handle removing non-existent favourite', () => {
      const stored: FavouriteDefinition[] = [{ id: 'def-1', key: 'process-1', name: 'Process 1', version: 1 }];
      memoryStorage.set(FAVOURITES_KEY, JSON.stringify(stored));

      removeFavourite('def-nonexistent');

      const favourites = loadFavourites();
      expect(favourites).toHaveLength(1);
    });

    it('should handle removing from empty list', () => {
      removeFavourite('def-1');

      const favourites = loadFavourites();
      expect(favourites).toEqual([]);
    });
  });

  describe('integration scenarios', () => {
    it('should support add/check/remove workflow', () => {
      const definition: FavouriteDefinition = {
        id: 'def-1',
        key: 'process-1',
        name: 'My Process',
        version: 3,
      };

      // Initially not favourited
      expect(isFavourite('def-1')).toBe(false);

      // Add favourite
      addFavourite(definition);
      expect(isFavourite('def-1')).toBe(true);

      // Remove favourite
      removeFavourite('def-1');
      expect(isFavourite('def-1')).toBe(false);
    });

    it('should persist favourites across "page reloads" (re-initialization)', () => {
      const definition: FavouriteDefinition = {
        id: 'def-1',
        key: 'process-1',
        name: 'Persistent Process',
        version: 1,
      };

      addFavourite(definition);

      // Simulate reading on a new page load
      const freshFavourites = loadFavourites();
      expect(freshFavourites).toHaveLength(1);
      expect(freshFavourites[0]).toEqual(definition);
    });

    it('should preserve definition metadata', () => {
      const definition: FavouriteDefinition = {
        id: 'def-123',
        key: 'order-processing',
        name: 'Order Processing Workflow',
        version: 5,
      };

      addFavourite(definition);
      const favourites = loadFavourites();

      expect(favourites[0]?.id).toBe('def-123');
      expect(favourites[0]?.key).toBe('order-processing');
      expect(favourites[0]?.name).toBe('Order Processing Workflow');
      expect(favourites[0]?.version).toBe(5);
    });

    it('should handle definitions with null name', () => {
      const definition: FavouriteDefinition = {
        id: 'def-1',
        key: 'unnamed-process',
        name: null,
        version: 1,
      };

      addFavourite(definition);
      const favourites = loadFavourites();

      expect(favourites[0]?.name).toBeNull();
    });
  });
});
