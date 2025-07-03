import './Button.scss';

import React, { useEffect, useState } from 'react';
import { TbRefresh, TbRefreshOff } from 'react-icons/tb';

import { get } from '../utils/api';
import { loadSettings, saveSettings } from '../utils/misc';

// Declare angular globally if not imported
declare const angular: any;

const LAST_ACTIVITY_KEY = `lastHistoricActivity_`;

export const ToggleAutoRefreshButton = ({ api, processInstanceId }: any) => {
  const [autoRefresh, setAutoRefresh] = useState(loadSettings().autoRefresh);

  useEffect(() => {
    if (!autoRefresh) {
      const previousActivityData = JSON.parse(
        localStorage.getItem(LAST_ACTIVITY_KEY + processInstanceId) || '[null, null]'
      );
      if (previousActivityData[1]) {
        console.log('Auto refresh is off, clearing last activity data');
        clearInterval(parseInt(previousActivityData[1]));
      }
      localStorage.removeItem(LAST_ACTIVITY_KEY + processInstanceId);
    }
    saveSettings({
      ...loadSettings(),
      autoRefresh,
    });
  }, [autoRefresh]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    const poll = async () => {
      const previousActivityData = JSON.parse(
        localStorage.getItem(LAST_ACTIVITY_KEY + processInstanceId) || '[null, null]'
      );

      if (!window.location.href.includes(processInstanceId)) {
        console.log('Process instance no longer in URL, stopping polling');
        if (intervalId) {
          clearInterval(intervalId);
        }
        localStorage.removeItem(LAST_ACTIVITY_KEY);
        return;
      }

      const latestActivityId =
        (
          await get(api, '/history/activity-instance', {
            processInstanceId,
            sortBy: 'endTime',
            sortOrder: 'desc',
            maxResults: '1',
          })
        )?.[0]?.id || null;

      if (latestActivityId === null) {
        console.log('No activities found, stopping polling');
        if (intervalId) {
          clearInterval(intervalId);
        }
        localStorage.removeItem(LAST_ACTIVITY_KEY);
        return;
      }

      if (previousActivityData[0] !== null && latestActivityId !== previousActivityData[0]) {
        console.log('New activity detected, updating lastHistoricActivity');

        // Save activity ID and interval ID as array
        localStorage.setItem(
          LAST_ACTIVITY_KEY + processInstanceId,
          JSON.stringify([latestActivityId, intervalId?.toString() || null])
        );

        // Update the AngularJS app
        const injector = angular.element(document.body).injector();
        const $route = injector.get('$route');
        $route.reload();
      }

      localStorage.setItem(
        LAST_ACTIVITY_KEY + processInstanceId,
        JSON.stringify([latestActivityId, intervalId?.toString() || null])
      );
    };

    const startPolling = () => {
      const previousActivityData = JSON.parse(
        localStorage.getItem(LAST_ACTIVITY_KEY + processInstanceId) || '[null, null]'
      );

      const lastIntervalId = previousActivityData[1];
      if (lastIntervalId) {
        clearInterval(parseInt(lastIntervalId));
      }

      intervalId = setInterval(poll, 1000); // Poll every 1 second
      localStorage.setItem(
        LAST_ACTIVITY_KEY + processInstanceId,
        JSON.stringify([previousActivityData[0], intervalId.toString()])
      );
    };

    // Start polling if autoRefresh is enabled
    if (autoRefresh) {
      console.log('Auto refresh is on, starting polling');
      startPolling();
    }

    // Cleanup
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        localStorage.removeItem(LAST_ACTIVITY_KEY);
      }
    };
  }, [autoRefresh]);

  return (
    <button
      className="toggle-auto-refresh-button"
      title={!autoRefresh ? 'Auto refresh view' : 'Auto refresh view off'}
      aria-label={!autoRefresh ? 'Auto refresh view' : 'Auto refresh view off'}
      onClick={() => setAutoRefresh(!autoRefresh)}
    >
      {!!autoRefresh ? (
        <TbRefresh style={{ opacity: !autoRefresh ? '0.33' : '1.0', fontSize: '133%' }} />
      ) : (
        <TbRefreshOff style={{ opacity: !autoRefresh ? '0.33' : '1.0', fontSize: '133%' }} />
      )}
    </button>
  );
};
