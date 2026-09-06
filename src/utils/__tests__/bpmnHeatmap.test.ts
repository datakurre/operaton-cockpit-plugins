/**
 * Tests for src/utils/bpmn/heatmap.ts
 *
 * @module
 */
import { aggregateDurations, elapsedOf, getHeatColor, getIntensity } from '../bpmn/heatmap';
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

    it('counts the time a still-running activity has already consumed', () => {
      // The engine leaves durationInMillis null until an activity ends. Reading that as
      // zero is what left the map blank for every process still running: a fresh
      // instance's only finished activity is usually an instant start event, so nothing
      // had any time against it. A token parked on a task is where the time is going.
      const now = Date.parse('2024-01-01T10:00:05.000+0000');
      const cells = aggregateDurations([activity('Task_A', null, { startTime: '2024-01-01T10:00:00.000+0000' })], now);

      expect(cells).toEqual([{ elementId: 'Task_A', totalMillis: 5000 }]);
    });

    it('mixes finished and running time on the same element', () => {
      const now = Date.parse('2024-01-01T10:00:10.000+0000');
      const cells = aggregateDurations(
        [
          activity('Task_A', 2000, { endTime: '2024-01-01T09:00:02.000+0000' }),
          activity('Task_A', null, { startTime: '2024-01-01T10:00:07.000+0000' }),
        ],
        now
      );

      expect(cells).toEqual([{ elementId: 'Task_A', totalMillis: 5000 }]);
    });

    it('still ignores an activity with no start time to measure from', () => {
      const cells = aggregateDurations([activity('Task_A', null)], Date.parse('2024-01-01T10:00:05.000+0000'));

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

  describe('elapsedOf', () => {
    it('uses the engine figure once the activity has finished', () => {
      const finished = activity('Task_A', 1200, { endTime: '2024-01-01T10:00:01.200+0000' });
      expect(elapsedOf(finished, Date.parse('2024-01-01T12:00:00.000+0000'))).toBe(1200);
    });

    it('measures a running activity against the clock', () => {
      const running = activity('Task_A', null, { startTime: '2024-01-01T10:00:00.000+0000' });
      expect(elapsedOf(running, Date.parse('2024-01-01T10:00:03.000+0000'))).toBe(3000);
    });

    it('never returns negative time when the clock is behind the engine', () => {
      // Browser and engine clocks are not the same clock. A skewed one would otherwise
      // subtract heat from the element it is sitting on.
      const running = activity('Task_A', null, { startTime: '2024-01-01T10:00:05.000+0000' });
      expect(elapsedOf(running, Date.parse('2024-01-01T10:00:00.000+0000'))).toBe(0);
    });

    it('returns zero when there is nothing to measure from', () => {
      expect(elapsedOf(activity('Task_A', null), Date.now())).toBe(0);
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
