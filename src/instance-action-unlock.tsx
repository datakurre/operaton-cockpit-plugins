// Styles
import './instance-action-unlock.scss';
// https://github.com/reactjs/react-modal/issues/283
import './Components/Modal.scss';

// React
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

// Third-party libraries
import { HiLockOpen } from 'react-icons/hi';
import ReactModal from 'react-modal';

// Local components
import { TaskList, ExternalTask } from './Components/TaskListComponents';

// Local utilities
import { get, post } from './utils/api';
import { MODAL_Z_INDEX } from './utils/constants';

// Types
import { InstancePluginParams, API } from './types';

// https://github.com/reactjs/react-modal/issues/283
ReactModal.defaultStyles = {};

interface UnlockDialogProps {
  api: API;
  processInstanceId: string;
}

/**
 * Dialog component for unlocking external tasks on a process instance.
 * This component handles task fetching, selection, and batch unlock operations.
 */
// eslint-disable-next-line max-lines-per-function -- Modal dialog with cohesive task management logic
const UnlockDialog: React.FC<UnlockDialogProps> = ({ api, processInstanceId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [lockedTasks, setLockedTasks] = useState<ExternalTask[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLockedTasks = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const tasks = (await get(api, '/external-task', {
        processInstanceId: processInstanceId,
        locked: 'true',
      })) as ExternalTask[] | null;
      setLockedTasks(tasks ?? []);
    } catch (_err) {
      setError('Failed to fetch locked external tasks');
      console.error('Error fetching locked tasks:', _err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpen = (): void => {
    setIsOpen(true);
    setSelectedTasks(new Set());
    void fetchLockedTasks();
  };

  const handleClose = (): void => {
    setIsOpen(false);
    setSelectedTasks(new Set());
    setError(null);
  };

  const handleToggleTask = (taskId: string): void => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTasks(newSelected);
  };

  const handleToggleAll = (): void => {
    if (selectedTasks.size === lockedTasks.length) {
      setSelectedTasks(new Set());
    } else {
      setSelectedTasks(
        new Set(lockedTasks.map(t => t.id).filter((id): id is string => id !== null && id !== undefined))
      );
    }
  };

  const handleUnlock = async (): Promise<void> => {
    if (selectedTasks.size === 0) {
      return;
    }

    setIsUnlocking(true);
    setError(null);

    try {
      const unlockPromises = Array.from(selectedTasks).map(taskId => post(api, `/external-task/${taskId}/unlock`));

      await Promise.all(unlockPromises);

      // Refresh the task list
      await fetchLockedTasks();
      setSelectedTasks(new Set());
    } catch (_err) {
      setError('Failed to unlock some tasks. Please try again.');
      console.error('Error unlocking tasks:', _err);
    } finally {
      setIsUnlocking(false);
    }
  };

  return (
    <>
      <button
        className="btn btn-default btn-toolbar unlock-dialog__trigger-btn"
        title="Unlock External Tasks"
        onClick={handleOpen}
      >
        <HiLockOpen className="unlock-dialog__icon" />
      </button>

      <ReactModal
        className="modal-dialog"
        isOpen={isOpen}
        onRequestClose={handleClose}
        shouldCloseOnEsc
        shouldReturnFocusAfterClose
        aria={{
          labelledby: 'unlock-tasks-modal-title',
          describedby: 'unlock-tasks-modal-description',
          modal: true,
        }}
        role="dialog"
        style={{
          content: {},
          overlay: {
            zIndex: MODAL_Z_INDEX,
          },
        }}
      >
        <div className="modal-content unlock-dialog__modal-content">
          <div className="modal-header">
            <h3 id="unlock-tasks-modal-title">Unlock External Tasks</h3>
            <button onClick={handleClose} className="close unlock-dialog__close-btn" aria-label="Close modal">
              ×
            </button>
          </div>

          <div className="modal-body unlock-dialog__body" id="unlock-tasks-modal-description">
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {isLoading && <div className="unlock-dialog__loading">Loading locked tasks...</div>}
            {!isLoading && lockedTasks.length === 0 && (
              <div className="unlock-dialog__empty">No locked external tasks found for this process instance.</div>
            )}
            {!isLoading && lockedTasks.length > 0 && (
              <TaskList
                tasks={lockedTasks}
                selectedTasks={selectedTasks}
                onToggleTask={handleToggleTask}
                onToggleAll={handleToggleAll}
              />
            )}
          </div>

          <div className="modal-footer unlock-dialog__footer">
            <button onClick={handleClose} className="btn btn-default" disabled={isUnlocking}>
              Close
            </button>
            <button
              onClick={() => {
                void handleUnlock();
              }}
              className="btn btn-primary"
              disabled={selectedTasks.size === 0 || isUnlocking}
            >
              {isUnlocking ? 'Unlocking...' : `Unlock ${selectedTasks.size} task${selectedTasks.size !== 1 ? 's' : ''}`}
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
    render: (node: HTMLElement, { api, processInstanceId }: InstancePluginParams): void => {
      const root = createRoot(node);
      root.render(
        <React.StrictMode>
          <UnlockDialog api={api} processInstanceId={processInstanceId} />
        </React.StrictMode>
      );
    },
  },
];
