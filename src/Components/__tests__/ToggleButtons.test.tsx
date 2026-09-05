/**
 * Tests for toggle button components.
 *
 * @module
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToggleHeatmapButton } from '../ToggleHeatmapButton';
import { ToggleHistoryStatisticsButton } from '../ToggleHistoryStatisticsButton';
import { ToggleHistoryViewButton } from '../ToggleHistoryViewButton';
import { ToggleSequenceFlowButton } from '../ToggleSequenceFlowButton';

// Mock the settings utilities
jest.mock('../../utils/misc', () => ({
  loadSettings: jest.fn(() => ({
    showHistoricBadges: false,
    showSequenceFlow: false,
    showInstanceHeatmap: false,
    autoRefresh: false,
  })),
  saveSettings: jest.fn(),
}));

describe('ToggleHistoryStatisticsButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with correct initial aria-label when off', () => {
    const onToggle = jest.fn();
    render(<ToggleHistoryStatisticsButton onToggleHistoryStatistics={onToggle} />);

    expect(screen.getByRole('button', { name: 'Show history instance statistics' })).toBeInTheDocument();
  });

  it('should call callback with the initial mode on mount', () => {
    const onToggle = jest.fn();
    render(<ToggleHistoryStatisticsButton onToggleHistoryStatistics={onToggle} />);

    expect(onToggle).toHaveBeenCalledWith('off');
  });

  it('should cycle off, counts, heat and back to off', async () => {
    const user = userEvent.setup();
    const onToggle = jest.fn();
    render(<ToggleHistoryStatisticsButton onToggleHistoryStatistics={onToggle} />);

    const button = screen.getByRole('button');
    await user.click(button);
    expect(onToggle).toHaveBeenLastCalledWith('counts');

    await user.click(button);
    expect(onToggle).toHaveBeenLastCalledWith('heat');

    await user.click(button);
    expect(onToggle).toHaveBeenLastCalledWith('off');
  });

  it('should name the next state in its label, so the heatmap is discoverable', async () => {
    const user = userEvent.setup();
    const onToggle = jest.fn();
    render(<ToggleHistoryStatisticsButton onToggleHistoryStatistics={onToggle} />);

    const button = screen.getByRole('button');
    await user.click(button);
    expect(screen.getByRole('button', { name: 'Show time heatmap' })).toBeInTheDocument();

    await user.click(button);
    expect(screen.getByRole('button', { name: 'Hide history instance statistics' })).toBeInTheDocument();
  });

  it('should save settings when state changes', async () => {
    const user = userEvent.setup();
    const { saveSettings } = require('../../utils/misc');
    const onToggle = jest.fn();

    render(<ToggleHistoryStatisticsButton onToggleHistoryStatistics={onToggle} />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(saveSettings).toHaveBeenCalled();
  });
});

describe('ToggleHistoryStatisticsButton truncation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should warn in its label once the badges are on and the query hit its cap', async () => {
    // The tab's warning box is on the other side of the screen from the diagram, so
    // the badges need to carry the caveat where they are actually being read.
    const user = userEvent.setup();
    render(<ToggleHistoryStatisticsButton onToggleHistoryStatistics={jest.fn()} partial />);

    await user.click(screen.getByRole('button'));

    expect(
      screen.getByRole('button', { name: /result limit reached — figures cover recent activity only/i })
    ).toBeInTheDocument();
  });

  it('should stay quiet while nothing is drawn', () => {
    // Off, there are no figures for the caveat to be about.
    render(<ToggleHistoryStatisticsButton onToggleHistoryStatistics={jest.fn()} partial />);

    expect(screen.getByRole('button', { name: 'Show history instance statistics' })).toBeInTheDocument();
  });

  it('should say nothing extra when the query was complete', async () => {
    const user = userEvent.setup();
    render(<ToggleHistoryStatisticsButton onToggleHistoryStatistics={jest.fn()} />);

    await user.click(screen.getByRole('button'));

    expect(screen.getByRole('button', { name: 'Show time heatmap' })).toBeInTheDocument();
  });
});

describe('ToggleHistoryViewButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with correct initial aria-label when off', () => {
    const onToggle = jest.fn();
    render(<ToggleHistoryViewButton onToggleHistoryView={onToggle} initial={false} />);

    expect(screen.getByRole('button', { name: 'Show history view' })).toBeInTheDocument();
  });

  it('should render with correct initial aria-label when on', () => {
    const onToggle = jest.fn();
    render(<ToggleHistoryViewButton onToggleHistoryView={onToggle} initial />);

    expect(screen.getByRole('button', { name: 'Show runtime view' })).toBeInTheDocument();
  });

  it('should call callback with initial state on mount', () => {
    const onToggle = jest.fn();
    render(<ToggleHistoryViewButton onToggleHistoryView={onToggle} initial />);

    expect(onToggle).toHaveBeenCalledWith(true);
  });

  it('should toggle state and call callback when clicked', async () => {
    const user = userEvent.setup();
    const onToggle = jest.fn();
    render(<ToggleHistoryViewButton onToggleHistoryView={onToggle} initial={false} />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(onToggle).toHaveBeenCalledWith(true);
  });

  it('should toggle from on to off when clicked', async () => {
    const user = userEvent.setup();
    const onToggle = jest.fn();
    render(<ToggleHistoryViewButton onToggleHistoryView={onToggle} initial />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(onToggle).toHaveBeenCalledWith(false);
    expect(screen.getByRole('button', { name: 'Show history view' })).toBeInTheDocument();
  });
});

describe('ToggleSequenceFlowButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with correct initial aria-label when off', () => {
    const onToggle = jest.fn();
    render(<ToggleSequenceFlowButton onToggleSequenceFlow={onToggle} />);

    expect(screen.getByRole('button', { name: 'Show sequence flow' })).toBeInTheDocument();
  });

  it('should call callback with initial state on mount', () => {
    const onToggle = jest.fn();
    render(<ToggleSequenceFlowButton onToggleSequenceFlow={onToggle} />);

    expect(onToggle).toHaveBeenCalledWith(false);
  });

  it('should warn in its label when the path came from a truncated history', () => {
    const onToggle = jest.fn();
    render(<ToggleSequenceFlowButton onToggleSequenceFlow={onToggle} partial />);

    // The warning has to reach screen readers, not only the icon colour.
    expect(
      screen.getByRole('button', { name: 'Show sequence flow (history truncated — path may be incomplete)' })
    ).toBeInTheDocument();
  });

  it('should toggle state and call callback when clicked', async () => {
    const user = userEvent.setup();
    const onToggle = jest.fn();
    render(<ToggleSequenceFlowButton onToggleSequenceFlow={onToggle} />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(onToggle).toHaveBeenCalledWith(true);
  });

  it('should update aria-label when toggled on', async () => {
    const user = userEvent.setup();
    const onToggle = jest.fn();
    render(<ToggleSequenceFlowButton onToggleSequenceFlow={onToggle} />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(screen.getByRole('button', { name: 'Hide sequence flow' })).toBeInTheDocument();
  });

  it('should save settings when state changes', async () => {
    const user = userEvent.setup();
    const { saveSettings } = require('../../utils/misc');
    const onToggle = jest.fn();

    render(<ToggleSequenceFlowButton onToggleSequenceFlow={onToggle} />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(saveSettings).toHaveBeenCalled();
  });

  it('should toggle back and forth', async () => {
    const user = userEvent.setup();
    const onToggle = jest.fn();
    render(<ToggleSequenceFlowButton onToggleSequenceFlow={onToggle} />);

    const button = screen.getByRole('button');

    // Toggle on
    await user.click(button);
    expect(onToggle).toHaveBeenLastCalledWith(true);

    // Toggle off
    await user.click(button);
    expect(onToggle).toHaveBeenLastCalledWith(false);

    // Toggle on again
    await user.click(button);
    expect(onToggle).toHaveBeenLastCalledWith(true);
  });
});

describe('ToggleHeatmapButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with correct initial aria-label when off', () => {
    const onToggle = jest.fn();
    render(<ToggleHeatmapButton onToggleHeatmap={onToggle} />);

    expect(screen.getByRole('button', { name: 'Show time heatmap' })).toBeInTheDocument();
  });

  it('should call callback with initial state on mount', () => {
    const onToggle = jest.fn();
    render(<ToggleHeatmapButton onToggleHeatmap={onToggle} />);

    expect(onToggle).toHaveBeenCalledWith(false);
  });

  it('should toggle state and call callback when clicked', async () => {
    const user = userEvent.setup();
    const onToggle = jest.fn();
    render(<ToggleHeatmapButton onToggleHeatmap={onToggle} />);

    await user.click(screen.getByRole('button'));

    expect(onToggle).toHaveBeenCalledWith(true);
    expect(screen.getByRole('button', { name: 'Hide time heatmap' })).toBeInTheDocument();
  });

  it('should warn in its label when the heat came from a truncated history', () => {
    const onToggle = jest.fn();
    render(<ToggleHeatmapButton onToggleHeatmap={onToggle} partial />);

    // A cut-short history makes every total a floor, and the element that looks
    // hottest may simply be the hottest one that survived the cut. Say so in the
    // label so it reaches screen readers, not only in the icon colour.
    expect(
      screen.getByRole('button', { name: 'Show time heatmap (history truncated — totals may be incomplete)' })
    ).toBeInTheDocument();
  });

  it('should persist the mode under its own key', async () => {
    const user = userEvent.setup();
    const { saveSettings } = require('../../utils/misc');
    const onToggle = jest.fn();

    render(<ToggleHeatmapButton onToggleHeatmap={onToggle} />);
    await user.click(screen.getByRole('button'));

    // Deliberately not `showHeatmap`: that one drives the definition diagram's
    // statistics button, where it also implies the count badges are on.
    expect(saveSettings).toHaveBeenLastCalledWith(expect.objectContaining({ showInstanceHeatmap: true }));
  });

  it('should start on when the setting says so', () => {
    const { loadSettings } = require('../../utils/misc');
    (loadSettings as jest.Mock).mockReturnValue({ showInstanceHeatmap: true });
    const onToggle = jest.fn();

    render(<ToggleHeatmapButton onToggleHeatmap={onToggle} />);

    expect(onToggle).toHaveBeenCalledWith(true);
    expect(screen.getByRole('button', { name: 'Hide time heatmap' })).toBeInTheDocument();
  });
});
