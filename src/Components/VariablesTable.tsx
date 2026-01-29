// https://github.com/reactjs/react-modal/issues/283
import './Modal.scss';

import React, { useContext, useState } from 'react';
import { CellProps, Column } from 'react-table';
import { ReactJason } from 'react-jason';
import github from 'react-jason/themes/github';
import ReactModal from 'react-modal';

import { HistoricActivityInstance, HistoricProcessInstance, HistoricVariableInstance } from '../types';
import { get } from '../utils/api';
import { MODAL_Z_INDEX } from '../utils/constants';
import { formatDateTime } from '../utils/formatting';
import APIContext from './APIContext';
import { Clippy } from './Clippy';
import SortableTable from './SortableTable';

/**
 * Row data structure for the variables table.
 * Extends variable instance data with computed scope.
 */
interface VariableRow {
  /** Variable ID */
  id: string;
  /** Variable name */
  name: string;
  /** Variable type (String, Integer, Json, Object, File, etc.) */
  type: string;
  /** Variable value */
  value: unknown;
  /** Scope name (process definition name or activity name) */
  scope: string;
  /** Creation timestamp */
  createTime: string | null;
}

interface ModalProps {
  title: string;
  label: string;
  variable: VariableRow;
}

// https://github.com/reactjs/react-modal/issues/283
ReactModal.defaultStyles = {};

const Modal: React.FC<ModalProps> = ({ title, label, variable }) => {
  const [value, setValue] = useState(variable.value);
  const api = useContext(APIContext);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button
        className="btn btn-link"
        style={{
          padding: 0,
          margin: 0,
          border: 0,
        }}
        onClick={() => {
          void (async () => {
            try {
              if (variable.type !== 'Json') {
                setIsOpen(true);
              } else {
                const data = (await get(api, `/history/variable-instance/${variable.id}`, {
                  deserializeValue: 'false',
                })) as { value: string };
                setValue(JSON.parse(data.value));
                setIsOpen(true);
              }
            } catch {
              // Silently handle errors
            }
          })();
        }}
      >
        {label}
      </button>
      <ReactModal
        className="modal-dialog"
        isOpen={isOpen}
        onRequestClose={() => {
          setIsOpen(false);
        }}
        shouldCloseOnEsc
        shouldReturnFocusAfterClose
        aria={{
          labelledby: 'variable-modal-title',
          describedby: 'variable-modal-description',
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
        <div
          className="modal-content"
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div className="modal-header">
            <h3 id="variable-modal-title">Inspect "{title}" variable</h3>
          </div>
          <div className="modal-body" id="variable-modal-description">
            <Clippy value={JSON.stringify(value)}>
              <strong>Value</strong>
            </Clippy>
            <ReactJason value={value} theme={github} />
          </div>
          <div
            className="model-footer"
            style={{
              height: '4em',
              paddingRight: '1em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <button
              onClick={() => {
                setIsOpen(false);
              }}
              className="btn btn-default"
            >
              Close
            </button>
          </div>
        </div>
      </ReactModal>
    </>
  );
};

interface Props {
  instance: HistoricProcessInstance;
  activities: Map<string, HistoricActivityInstance>;
  variables: HistoricVariableInstance[];
}

/**
 * Variables table displaying process variables with type,
 * value, scope information, and creation timestamps.
 */
const VariablesTable: React.FC<Props> = ({ instance, activities, variables }) => {
  const api = useContext(APIContext);
  const columns = React.useMemo<Column<VariableRow>[]>(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
        Cell: ({ value }: CellProps<VariableRow, string>) => <Clippy value={value}>{value}</Clippy>,
      },
      {
        Header: 'Type',
        accessor: 'type',
      },
      {
        Header: 'Value',
        accessor: 'value',
        Cell: ({ data, row, value }: CellProps<VariableRow, unknown>) => {
          const raw = data[row.index];
          if (!raw) {
            return null;
          }
          switch (raw.type) {
            case 'Object':
              return <Modal title={raw.name} label="View" variable={raw} />;
            case 'File':
              return (
                <Clippy value={`${window.location.origin}${api.engineApi}/history/variable-instance/${raw.id}/data`}>
                  <a href={`${api.engineApi}/history/variable-instance/${raw.id}/data`}>Download</a>
                </Clippy>
              );
            case 'Json':
              return <Modal title={raw.name} label="View" variable={raw} />;
            default:
              return (
                <Clippy
                  value={typeof value === 'string' || typeof value === 'number' ? String(value) : JSON.stringify(value)}
                >
                  {typeof value === 'string' || typeof value === 'number' ? value : JSON.stringify(value)}
                </Clippy>
              );
          }
        },
      },
      {
        Header: 'Scope',
        accessor: 'scope',
      },
      {
        Header: 'Created',
        accessor: 'createTime',
        Cell: ({ value }: CellProps<VariableRow, string | null>) => {
          if (!value) {
            return null;
          }
          const formatted = formatDateTime(value);
          return <Clippy value={formatted}>{formatted}</Clippy>;
        },
      },
    ],
    [api.engineApi]
  );
  const data = React.useMemo<VariableRow[]>(() => {
    return variables
      .filter(
        (variable: HistoricVariableInstance) =>
          variable.activityInstanceId === instance.id ||
          (activities.has(variable.activityInstanceId ?? '') &&
            Boolean(activities.get(variable.activityInstanceId ?? '')?.activityName))
      )
      .map((variable: HistoricVariableInstance): VariableRow => {
        return {
          id: variable.id ?? '',
          name: variable.name ?? '',
          type: variable.type ?? '',
          value: variable.value,
          createTime: variable.createTime ?? null,
          scope:
            variable.activityInstanceId === instance.id
              ? (instance.processDefinitionName ?? '')
              : (activities.get(variable.activityInstanceId ?? '')?.activityName ?? ''),
        };
      });
  }, [instance, variables, activities]);

  return <SortableTable<VariableRow> columns={columns} data={data} ariaLabel="Process variables table" />;
};

export default VariablesTable;
