// https://github.com/reactjs/react-modal/issues/283
import './Components/Modal.scss';

import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { HiLockOpen } from 'react-icons/hi';
import ReactModal from 'react-modal';

import { InstancePluginParams } from './types';
import { get, post } from './utils/api';

// https://github.com/reactjs/react-modal/issues/283
ReactModal.defaultStyles = {};

interface ExternalTask {
  id: string;
  activityId: string;
  activityInstanceId: string;
  errorMessage: string | null;
  executionId: string;
  lockExpirationTime: string;
  processDefinitionId: string;
  processDefinitionKey: string;
  processInstanceId: string;
  retries: number;
  suspended: boolean;
  workerId: string;
  topicName: string;
  priority: number;
  businessKey: string;
}

interface UnlockDialogProps {
  api: any;
  processInstanceId: string;
}

const UnlockDialog: React.FC<UnlockDialogProps> = ({ api, processInstanceId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [lockedTasks, setLockedTasks] = useState<ExternalTask[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLockedTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const tasks = await get(api, '/external-task', {
        processInstanceId: processInstanceId,
        locked: 'true',
      });
      setLockedTasks(tasks || []);
    } catch (err) {
      setError('Failed to fetch locked external tasks');
      console.error('Error fetching locked tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = async () => {
    setIsOpen(true);
    setSelectedTasks(new Set());
    await fetchLockedTasks();
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedTasks(new Set());
    setError(null);
  };

  const handleToggleTask = (taskId: string) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTasks(newSelected);
  };

  const handleToggleAll = () => {
    if (selectedTasks.size === lockedTasks.length) {
      setSelectedTasks(new Set());
    } else {
      setSelectedTasks(new Set(lockedTasks.map(t => t.id)));
    }
  };

  const handleUnlock = async () => {
    if (selectedTasks.size === 0) return;

    setUnlocking(true);
    setError(null);

    try {
      const unlockPromises = Array.from(selectedTasks).map(taskId =>
        post(api, `/external-task/${taskId}/unlock`)
      );

      await Promise.all(unlockPromises);

      // Refresh the task list
      await fetchLockedTasks();
      setSelectedTasks(new Set());
    } catch (err) {
      setError('Failed to unlock some tasks. Please try again.');
      console.error('Error unlocking tasks:', err);
    } finally {
      setUnlocking(false);
    }
  };

  return (
    <>
      <button
        className="btn btn-default btn-toolbar"
        title="Unlock External Tasks"
        onClick={handleOpen}
        style={{
          padding: '6px 9px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '5px auto',
        }}
      >
        <HiLockOpen style={{ fontSize: '1.33em' }} />
      </button>

      <ReactModal
        className="modal-dialog"
        isOpen={isOpen}
        onRequestClose={handleClose}
        style={{
          content: {},
          overlay: {
            zIndex: 2000,
          },
        }}
      >
        <div
          className="modal-content"
          style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '300px',
          }}
        >
          <div className="modal-header">
            <h3>Unlock External Tasks</h3>
            <button
              onClick={handleClose}
              className="close"
              style={{
                position: 'absolute',
                right: '15px',
                top: '15px',
                border: 'none',
                background: 'transparent',
                fontSize: '1.5em',
                cursor: 'pointer',
              }}
            >
              ×
            </button>
          </div>

          <div className="modal-body" style={{ flex: 1, overflow: 'auto' }}>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {loading ? (
              <div style={{ textAlign: 'center', padding: '2em' }}>Loading locked tasks...</div>
            ) : lockedTasks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2em', color: '#666' }}>
                No locked external tasks found for this process instance.
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '1em' }}>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={selectedTasks.size === lockedTasks.length && lockedTasks.length > 0}
                      onChange={handleToggleAll}
                      style={{ marginRight: '0.5em' }}
                    />
                    <strong>Select All ({lockedTasks.length} tasks)</strong>
                  </label>
                </div>

                <div style={{ border: '1px solid #ddd', borderRadius: '4px' }}>
                  {lockedTasks.map((task, index) => (
                    <div
                      key={task.id}
                      style={{
                        padding: '0.75em',
                        borderBottom: index < lockedTasks.length - 1 ? '1px solid #eee' : 'none',
                        backgroundColor: selectedTasks.has(task.id) ? '#f0f8ff' : 'white',
                      }}
                    >
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          cursor: 'pointer',
                          margin: 0,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedTasks.has(task.id)}
                          onChange={() => handleToggleTask(task.id)}
                          style={{ marginRight: '0.5em', marginTop: '0.2em' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 'bold', marginBottom: '0.25em' }}>
                            {task.topicName}
                          </div>
                          <div style={{ fontSize: '0.9em', color: '#666' }}>
                            <div>Activity: {task.activityId}</div>
                            <div>Worker: {task.workerId}</div>
                            <div>
                              Lock expires:{' '}
                              {new Date(task.lockExpirationTime).toLocaleString()}
                            </div>
                            {task.errorMessage && (
                              <div style={{ color: '#d9534f', marginTop: '0.25em' }}>
                                Error: {task.errorMessage}
                              </div>
                            )}
                          </div>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div
            className="modal-footer"
            style={{
              padding: '1em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '0.5em',
              borderTop: '1px solid #ddd',
            }}
          >
            <button onClick={handleClose} className="btn btn-default" disabled={unlocking}>
              Close
            </button>
            <button
              onClick={handleUnlock}
              className="btn btn-primary"
              disabled={selectedTasks.size === 0 || unlocking}
            >
              {unlocking
                ? 'Unlocking...'
                : `Unlock ${selectedTasks.size} task${selectedTasks.size !== 1 ? 's' : ''}`}
            </button>
          </div>
        </div>
      </ReactModal>
    </>
  );
};

export default [
  {
    id: 'instanceActionUnlock',
    pluginPoint: 'cockpit.processInstance.runtime.action',
    render: (node: HTMLElement, { api, processInstanceId }: InstancePluginParams) => {
      const root = createRoot(node);
      root.render(
        <React.StrictMode>
          <UnlockDialog api={api} processInstanceId={processInstanceId} />
        </React.StrictMode>
      );
    },
  },
];
