import './Button.scss';

import React, { useEffect, useState } from 'react';
import { TbRefresh, TbRefreshOff } from 'react-icons/tb';

import { API } from '../types';
import { getActivities } from '../utils/api';
import { AUTO_REFRESH_POLL_INTERVAL_MS } from '../utils/constants';
import { loadSettings, saveSettings } from '../utils/misc';
import { reloadAngularRoute } from '../utils/angular';

const LAST_ACTIVITY_KEY = `lastHistoricActivity_`;

/** Type for localStorage activity tracking data [activityId, intervalId] */
type ActivityData = [string | null, string | null];

/**
 * Safely parses localStorage activity data with type validation
 * @param raw - Raw string from localStorage
 * @returns Parsed activity data tuple
 */
function parseActivityData(raw: string | null): ActivityData {
  if (raw === null) {
    return [null, null];
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length >= 2) {
      const activityId = typeof parsed[0] === 'string' ? parsed[0] : null;
      const intervalId = typeof parsed[1] === 'string' ? parsed[1] : null;
      return [activityId, intervalId];
    }
  } catch {
    // Return default on parse error
  }
  return [null, null];
}

interface ToggleAutoRefreshButtonProps {
  api: API;
  processInstanceId: string;
}

/**
 * Toggle button for enabling/disabling auto-refresh of process instance view.
 * @param props - Component props
 * @param props.api - The API configuration object
 * @param props.processInstanceId - The current process instance ID
 * @returns Toggle button component
 */
export const ToggleAutoRefreshButton: React.FC<ToggleAutoRefreshButtonProps> = ({ api, processInstanceId }) => {
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(loadSettings().autoRefresh);

  useEffect(() => {
    if (!isAutoRefreshEnabled) {
      const previousActivityData = parseActivityData(localStorage.getItem(LAST_ACTIVITY_KEY + processInstanceId));
      if (previousActivityData[1] !== null) {
        console.debug('Auto refresh is off, clearing last activity data');
        clearInterval(parseInt(previousActivityData[1], 10));
      }
      localStorage.removeItem(LAST_ACTIVITY_KEY + processInstanceId);
    }
    saveSettings({
      ...loadSettings(),
      autoRefresh: isAutoRefreshEnabled,
    });
  }, [isAutoRefreshEnabled, processInstanceId]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    const poll = async (): Promise<void> => {
      const previousActivityData = parseActivityData(localStorage.getItem(LAST_ACTIVITY_KEY + processInstanceId));

      if (!window.location.href.includes(processInstanceId)) {
        console.debug('Process instance no longer in URL, stopping polling');
        if (intervalId) {
          clearInterval(intervalId);
        }
        localStorage.removeItem(LAST_ACTIVITY_KEY);
        return;
      }

      const latestActivityId = await (async () => {
        const activities = await getActivities(api, processInstanceId, {
          sortBy: 'endTime',
          sortOrder: 'desc',
          maxResults: '1',
        });
        return activities[0]?.id ?? null;
      })();

      if (latestActivityId === null) {
        console.debug('No activities found, stopping polling');
        if (intervalId) {
          clearInterval(intervalId);
        }
        localStorage.removeItem(LAST_ACTIVITY_KEY);
        return;
      }

      if (previousActivityData[0] !== null && latestActivityId !== previousActivityData[0]) {
        console.debug('New activity detected, updating lastHistoricActivity');

        // Save activity ID and interval ID as array
        localStorage.setItem(
          LAST_ACTIVITY_KEY + processInstanceId,
          JSON.stringify([latestActivityId, intervalId?.toString() ?? null])
        );

        // Update the AngularJS app
        reloadAngularRoute();
      }

      localStorage.setItem(
        LAST_ACTIVITY_KEY + processInstanceId,
        JSON.stringify([latestActivityId, intervalId?.toString() ?? null])
      );
    };

    const startPolling = (): void => {
      const previousActivityData = parseActivityData(localStorage.getItem(LAST_ACTIVITY_KEY + processInstanceId));

      const lastIntervalId = previousActivityData[1];
      if (lastIntervalId !== null) {
        clearInterval(parseInt(lastIntervalId, 10));
      }

      intervalId = setInterval(() => {
        void poll();
      }, AUTO_REFRESH_POLL_INTERVAL_MS);
      localStorage.setItem(
        LAST_ACTIVITY_KEY + processInstanceId,
        JSON.stringify([previousActivityData[0], intervalId.toString()])
      );
    };

    // Start polling if isAutoRefreshEnabled is enabled
    if (isAutoRefreshEnabled) {
      console.debug('Auto refresh is on, starting polling');
      startPolling();
    }

    // Cleanup
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        localStorage.removeItem(LAST_ACTIVITY_KEY);
      }
    };
  }, [isAutoRefreshEnabled, api, processInstanceId]);

  return (
    <button
      className="toggle-auto-refresh-button"
      title={!isAutoRefreshEnabled ? 'Auto refresh view' : 'Auto refresh view off'}
      aria-label={!isAutoRefreshEnabled ? 'Auto refresh view' : 'Auto refresh view off'}
      onClick={() => {
        setIsAutoRefreshEnabled(!isAutoRefreshEnabled);
      }}
    >
      {isAutoRefreshEnabled ? (
        <TbRefresh style={{ opacity: '1.0', fontSize: '133%' }} />
      ) : (
        <TbRefreshOff style={{ opacity: '0.33', fontSize: '133%' }} />
      )}
    </button>
  );
};
