/**
 * Tests for src/utils/misc.ts
 *
 * @module
 */
import { asctime, filter, loadSettings, saveSettings, isProcessInstanceRunning, PluginSettings } from '../misc';

describe('utils/misc', () => {
  describe('asctime', () => {
    it('should format 0 milliseconds', () => {
      expect(asctime(0)).toBe('00:00:00.0');
    });

    it('should format milliseconds only', () => {
      expect(asctime(500)).toBe('00:00:00.5');
    });

    it('should format seconds', () => {
      expect(asctime(5000)).toBe('00:00:05.0');
    });

    it('should format minutes', () => {
      expect(asctime(125000)).toBe('00:02:05.0');
    });

    it('should format hours', () => {
      expect(asctime(3725000)).toBe('01:02:05.0');
    });

    it('should format hours minutes seconds milliseconds', () => {
      // 2 hours, 30 minutes, 45 seconds, 600ms
      const duration = 2 * 60 * 60 * 1000 + 30 * 60 * 1000 + 45 * 1000 + 600;
      expect(asctime(duration)).toBe('02:30:45.6');
    });

    it('should handle 24+ hours by wrapping', () => {
      // 25 hours = 25 * 60 * 60 * 1000 = 90,000,000ms
      expect(asctime(90000000)).toBe('01:00:00.0');
    });

    it('should handle double-digit hours', () => {
      // 12 hours
      expect(asctime(12 * 60 * 60 * 1000)).toBe('12:00:00.0');
    });

    it('should handle edge case 59:59.9', () => {
      // 59 minutes, 59 seconds, 900ms
      const duration = 59 * 60 * 1000 + 59 * 1000 + 900;
      expect(asctime(duration)).toBe('00:59:59.9');
    });
  });

  describe('filter', () => {
    it('should filter array based on condition', () => {
      const arr = [1, 2, 3, 4, 5];
      expect(filter(arr, x => x > 3)).toEqual([4, 5]);
    });

    it('should return empty array when no matches', () => {
      expect(filter([1, 2, 3], x => x > 10)).toEqual([]);
    });

    it('should preserve order', () => {
      const arr = ['a', 'bb', 'ccc'];
      expect(filter(arr, x => x.length > 1)).toEqual(['bb', 'ccc']);
    });

    it('should handle empty array', () => {
      expect(filter([], () => true)).toEqual([]);
    });

    it('should handle all matching', () => {
      const arr = [1, 2, 3];
      expect(filter(arr, () => true)).toEqual([1, 2, 3]);
    });

    it('should handle all not matching', () => {
      const arr = [1, 2, 3];
      expect(filter(arr, () => false)).toEqual([]);
    });

    it('should work with objects', () => {
      const arr = [{ a: 1 }, { a: 2 }, { a: 3 }];
      expect(filter(arr, obj => obj.a > 1)).toEqual([{ a: 2 }, { a: 3 }]);
    });
  });

  describe('loadSettings', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      (localStorage.getItem as jest.Mock).mockReturnValue(null);
      window.location.hash = '';
    });

    it('should return default settings when localStorage is empty', () => {
      const settings = loadSettings();
      expect(settings).toEqual({
        autoRefresh: false,
        showHistoricBadges: false,
        showSequenceFlow: false,
        showHeatmap: false,
        showInstanceHeatmap: false,
        leftPaneSize: null,
        topPaneSize: null,
        maxResults: 1000,
      });
    });

    it('should load settings from localStorage', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue(
        JSON.stringify({
          autoRefresh: true,
          showHistoricBadges: true,
        })
      );

      const settings = loadSettings();
      expect(settings.autoRefresh).toBe(true);
      expect(settings.showHistoricBadges).toBe(true);
    });

    it('should load pane sizes from localStorage', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue(
        JSON.stringify({
          leftPaneSize: 300,
          topPaneSize: 400,
        })
      );

      const settings = loadSettings();
      expect(settings.leftPaneSize).toBe(300);
      expect(settings.topPaneSize).toBe(400);
    });

    it('should override with URL query parameters for autoRefresh', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue(
        JSON.stringify({
          autoRefresh: false,
        })
      );
      window.location.hash = '#/path?autoRefresh';

      const settings = loadSettings();
      expect(settings.autoRefresh).toBe(true);
    });

    it('should override with URL query parameters for showHistoricBadges', () => {
      window.location.hash = '#/path?showHistoricBadges';

      const settings = loadSettings();
      expect(settings.showHistoricBadges).toBe(true);
    });

    it('should override with URL query parameters for showSequenceFlow', () => {
      window.location.hash = '#/path?showSequenceFlow';

      const settings = loadSettings();
      expect(settings.showSequenceFlow).toBe(true);
    });

    it('should override with URL query parameters for showInstanceHeatmap', () => {
      window.location.hash = '#/path?showInstanceHeatmap';

      const settings = loadSettings();
      expect(settings.showInstanceHeatmap).toBe(true);
      // The definition diagram's heat rides on a separate flag, so linking to an
      // instance with heat on does not also switch the definition badges on.
      expect(settings.showHeatmap).toBe(false);
    });

    it('should return defaults for corrupted localStorage', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue('not-valid-json');

      const settings = loadSettings();
      expect(settings.autoRefresh).toBe(false);
      expect(settings.showHistoricBadges).toBe(false);
      expect(settings.showSequenceFlow).toBe(false);
    });

    it('should handle partial settings in localStorage', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue(
        JSON.stringify({
          autoRefresh: true,
          // other settings missing
        })
      );

      const settings = loadSettings();
      expect(settings.autoRefresh).toBe(true);
      expect(settings.showHistoricBadges).toBe(false);
      expect(settings.leftPaneSize).toBe(null);
    });
  });

  describe('saveSettings', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should save settings to localStorage', () => {
      const settings: PluginSettings = {
        autoRefresh: true,
        showHistoricBadges: false,
        showSequenceFlow: true,
        leftPaneSize: 300,
        topPaneSize: 400,
      };
      saveSettings(settings);

      expect(localStorage.setItem).toHaveBeenCalledWith('minimal-history-plugin', JSON.stringify(settings));
    });

    it('should save default settings', () => {
      const settings: PluginSettings = {
        autoRefresh: false,
        showHistoricBadges: false,
        showSequenceFlow: false,
        showHeatmap: false,
        showInstanceHeatmap: false,
        leftPaneSize: null,
        topPaneSize: null,
      };
      saveSettings(settings);

      expect(localStorage.setItem).toHaveBeenCalledWith('minimal-history-plugin', JSON.stringify(settings));
    });

    it('should overwrite existing settings', () => {
      const firstSettings: PluginSettings = {
        autoRefresh: true,
        showHistoricBadges: true,
        showSequenceFlow: true,
        leftPaneSize: 100,
        topPaneSize: 200,
      };
      const secondSettings: PluginSettings = {
        autoRefresh: false,
        showHistoricBadges: false,
        showSequenceFlow: false,
        leftPaneSize: 300,
        topPaneSize: 400,
      };

      saveSettings(firstSettings);
      saveSettings(secondSettings);

      expect(localStorage.setItem).toHaveBeenCalledTimes(2);
      expect(localStorage.setItem).toHaveBeenLastCalledWith('minimal-history-plugin', JSON.stringify(secondSettings));
    });
  });

  describe('isProcessInstanceRunning', () => {
    it('should return true for ACTIVE instance', () => {
      expect(isProcessInstanceRunning({ state: 'ACTIVE', endTime: null })).toBe(true);
    });

    it('should return true for active instance with lowercase state', () => {
      expect(isProcessInstanceRunning({ state: 'active', endTime: null })).toBe(true);
    });

    it('should return true for SUSPENDED instance', () => {
      expect(isProcessInstanceRunning({ state: 'SUSPENDED', endTime: null })).toBe(true);
    });

    it('should return true when endTime is null and state is undefined', () => {
      expect(isProcessInstanceRunning({ endTime: null })).toBe(true);
    });

    it('should return false for COMPLETED instance', () => {
      expect(isProcessInstanceRunning({ state: 'COMPLETED', endTime: '2026-09-06T10:00:00.000+0000' })).toBe(false);
    });

    it('should return false for EXTERNALLY_TERMINATED instance', () => {
      expect(
        isProcessInstanceRunning({ state: 'EXTERNALLY_TERMINATED', endTime: '2026-09-06T10:00:00.000+0000' })
      ).toBe(false);
    });

    it('should return false for INTERNALLY_TERMINATED instance', () => {
      expect(
        isProcessInstanceRunning({ state: 'INTERNALLY_TERMINATED', endTime: '2026-09-06T10:00:00.000+0000' })
      ).toBe(false);
    });

    it('should return false when endTime is provided even if state is missing', () => {
      expect(isProcessInstanceRunning({ endTime: '2026-09-06T10:00:00.000+0000' })).toBe(false);
    });
  });
});
