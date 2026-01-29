/**
 * Task components for the UnlockDialog.
 * Displays external task details with selection controls.
 */
import React from 'react';

import { ExternalTask } from '../types';

// Re-export for backwards compatibility
export type { ExternalTask };

/** Props for TaskItem component. */
interface TaskItemProps {
  /** The external task data. */
  task: ExternalTask;
  /** Whether this task is selected. */
  isSelected: boolean;
  /** Callback when the task selection is toggled. */
  onToggle: () => void;
  /** Whether to show the bottom border. */
  showBorder: boolean;
}

/**
 * Renders a single external task item with checkbox.
 * Shows topic name, activity, worker, and lock expiration.
 */
export const TaskItem: React.FC<TaskItemProps> = ({ task, isSelected, onToggle, showBorder }) => {
  return (
    <div
      style={{
        padding: '0.75em',
        borderBottom: showBorder ? '1px solid #eee' : 'none',
        backgroundColor: isSelected ? '#f0f8ff' : 'white',
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
          checked={isSelected}
          onChange={onToggle}
          style={{ marginRight: '0.5em', marginTop: '0.2em' }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 'bold', marginBottom: '0.25em' }}>{task.topicName ?? 'Unknown'}</div>
          <div style={{ fontSize: '0.9em', color: '#666' }}>
            <div>Activity: {task.activityId ?? 'N/A'}</div>
            <div>Worker: {task.workerId ?? 'N/A'}</div>
            <div>
              Lock expires: {task.lockExpirationTime ? new Date(task.lockExpirationTime).toLocaleString() : 'N/A'}
            </div>
            {task.errorMessage && (
              <div style={{ color: '#d9534f', marginTop: '0.25em' }}>Error: {task.errorMessage}</div>
            )}
          </div>
        </div>
      </label>
    </div>
  );
};

/** Props for TaskList component. */
interface TaskListProps {
  /** The list of external tasks. */
  tasks: ExternalTask[];
  /** Set of selected task IDs. */
  selectedTasks: Set<string>;
  /** Callback when a task selection is toggled. */
  onToggleTask: (taskId: string) => void;
  /** Callback to toggle all tasks. */
  onToggleAll: () => void;
}

/**
 * Renders a list of external tasks with select-all functionality.
 * Wraps TaskItem components in a bordered container.
 */
export const TaskList: React.FC<TaskListProps> = ({ tasks, selectedTasks, onToggleTask, onToggleAll }) => {
  const isAllSelected = selectedTasks.size === tasks.length && tasks.length > 0;

  return (
    <>
      <div style={{ marginBottom: '1em' }}>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input type="checkbox" checked={isAllSelected} onChange={onToggleAll} style={{ marginRight: '0.5em' }} />
          <strong>Select All ({tasks.length} tasks)</strong>
        </label>
      </div>

      <div style={{ border: '1px solid #ddd', borderRadius: '4px' }}>
        {tasks.map((task, index) => (
          <TaskItem
            key={task.id ?? index}
            task={task}
            isSelected={selectedTasks.has(task.id ?? '')}
            onToggle={() => {
              onToggleTask(task.id ?? '');
            }}
            showBorder={index < tasks.length - 1}
          />
        ))}
      </div>
    </>
  );
};
