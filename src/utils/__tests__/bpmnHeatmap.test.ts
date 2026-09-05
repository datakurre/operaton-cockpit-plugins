/**
 * Tests for src/utils/bpmn/heatmap.ts
 *
 * @module
 */
import { aggregateDurations, getHeatColor, getIntensity } from '../bpmn/heatmap';
import { HEATMAP_GAMMA } from '../constants';
import type { HistoricActivityInstance } from '../../types';

/** Builds a historic activity record with an explicit duration. */
function activity(activityId: string, durationInMillis: number | null, extra = {}): HistoricActivityInstance {
  return { activityId, activityType: 'serviceTask', durationInMillis, ...extra } as HistoricActivityInstance;
}

describe('utils/bpmn/heatmap', () => {
  describe('aggregateDurations', () => {
    it('sums the time spent per element, hottest first', () => {
      const cells = aggregateDurations([activity('Task_A', 100), activity('Task_B', 900), activity('Task_A', 250)]);

      expect(cells).toEqual([
        { elementId: 'Task_B', totalMillis: 900 },
        { elementId: 'Task_A', totalMillis: 350 },
      ]);
    });

    it('drops elements that consumed no time, so they get no blob', () => {
      const cells = aggregateDurations([activity('Start_1', 0), activity('Task_A', 50)]);

      expect(cells).toEqual([{ elementId: 'Task_A', totalMillis: 50 }]);
    });

    it('ignores a still-running activity rather than guessing its duration', () => {
      // Left as null by the engine until it finishes; inventing "now minus start"
      // would make the unfinished thing the hottest spot on every diagram.
      const cells = aggregateDurations([activity('Task_A', null, { startTime: '2024-01-01T10:00:00.000+0000' })]);

      expect(cells).toEqual([]);
    });

    it('falls back to the timestamps when the engine reports no duration', () => {
      const cells = aggregateDurations([
        activity('Task_A', null, {
          startTime: '2024-01-01T10:00:00.000+0000',
          endTime: '2024-01-01T10:00:02.500+0000',
        }),
      ]);

      expect(cells).toEqual([{ elementId: 'Task_A', totalMillis: 2500 }]);
    });

    it('folds scope-suffixed ids onto their diagram element', () => {
      const cells = aggregateDurations([activity('Task_A#scope', 100), activity('Task_A', 100)]);

      expect(cells).toEqual([{ elementId: 'Task_A', totalMillis: 200 }]);
    });

    it('skips the multi-instance body so its span is not counted twice', () => {
      // The body spans its instances, so adding it double-counts the same wall time.
      const cells = aggregateDurations([
        activity('Task_MI', 100),
        activity('Task_MI', 100),
        activity('Task_MI#multiInstanceBody', 200),
      ]);

      expect(cells).toEqual([{ elementId: 'Task_MI', totalMillis: 200 }]);
    });

    it('returns nothing for an empty history', () => {
      expect(aggregateDurations([])).toEqual([]);
    });
  });

  describe('getIntensity', () => {
    it('puts the hottest element at full intensity', () => {
      expect(getIntensity(500, 500)).toBe(1);
    });

    it('returns zero when nothing consumed time', () => {
      expect(getIntensity(0, 0)).toBe(0);
    });

    it('lifts the middle rather than using a straight ratio', () => {
      // A tenth of the worst offender should not be a tenth as visible, or a single
      // slow task leaves every other element indistinguishable from cold.
      const ratio = 0.1;
      expect(getIntensity(ratio * 1000, 1000)).toBeCloseTo(Math.pow(ratio, HEATMAP_GAMMA), 5);
      expect(getIntensity(ratio * 1000, 1000)).toBeGreaterThan(ratio);
    });

    it('is monotonic, so ordering by heat matches ordering by time', () => {
      const values = [0, 100, 400, 800, 1000].map(total => getIntensity(total, 1000));
      const sorted = [...values].sort((a, b) => a - b);
      expect(values).toEqual(sorted);
    });
  });

  describe('getHeatColor', () => {
    it('is cold at the bottom of the ramp and hot at the top', () => {
      expect(getHeatColor(0)).toBe('rgb(43, 92, 214)');
      expect(getHeatColor(1)).toBe('rgb(216, 44, 32)');
    });

    it('clamps out-of-range intensities to the ends of the ramp', () => {
      expect(getHeatColor(-5)).toBe(getHeatColor(0));
      expect(getHeatColor(5)).toBe(getHeatColor(1));
    });

    it('interpolates between stops', () => {
      // Halfway from the first stop (0) to the second (0.35).
      expect(getHeatColor(0.175)).toBe('rgb(41, 141, 206)');
    });

    it('gets redder as intensity rises', () => {
      const red = (c: string): number => Number(/rgb\((\d+)/.exec(c)?.[1] ?? 0);
      expect(red(getHeatColor(1))).toBeGreaterThan(red(getHeatColor(0.5)));
      expect(red(getHeatColor(0.5))).toBeGreaterThan(red(getHeatColor(0)));
    });
  });
});
