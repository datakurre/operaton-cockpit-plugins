/**
 * Instance selection fields shared by the definition-level batch operation forms.
 *
 * Reads and writes the `instanceSelectionMode`, `specificInstanceIds`, `queryActivityId`
 * and `queryState` fields of the surrounding react-hook-form.
 *
 * @module
 */
import React from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import SearchableSelect from './SearchableSelect';
import type { BpmnElement } from '../utils/bpmnParsing';
import { formatLabelWithId } from '../utils/formatting';

interface InstanceSelectionFieldsProps {
  /** Activities of the process definition, offered as query filters */
  activities: BpmnElement[];
  /** Label for the selection dropdown */
  label?: string;
}

/**
 * Renders the "select instances by" dropdown and the fields its modes need.
 */
const InstanceSelectionFields: React.FC<InstanceSelectionFieldsProps> = ({
  activities,
  label = 'Select Instances By',
}) => {
  const { register, control } = useFormContext();
  const instanceSelectionMode = useWatch({ control, name: 'instanceSelectionMode' }) as string | undefined;

  return (
    <>
      <div className="modify-form__field">
        <label htmlFor="instanceSelectionMode">{label}</label>
        <select id="instanceSelectionMode" {...register('instanceSelectionMode')} className="modify-form__input">
          <option value="all">All active instances of this definition</option>
          <option value="query">Query (filter by activity/state)</option>
          <option value="specific">Specific instance IDs</option>
        </select>
      </div>

      {instanceSelectionMode === 'specific' && (
        <div className="modify-form__field">
          <label htmlFor="specificInstanceIds">Instance IDs (comma-separated)</label>
          <textarea
            id="specificInstanceIds"
            {...register('specificInstanceIds')}
            placeholder="instance-id-1, instance-id-2, instance-id-3"
            rows={3}
            className="modify-form__textarea"
          />
        </div>
      )}

      {instanceSelectionMode === 'query' && (
        <>
          <div className="modify-form__field">
            <label htmlFor="queryActivityId">Filter by Activity (optional)</label>
            <Controller
              name="queryActivityId"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  id="queryActivityId"
                  value={field.value as string}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  options={activities.map(a => ({
                    value: a.id,
                    label: `${formatLabelWithId(a.name, a.id)} — ${a.type}`,
                  }))}
                  placeholder="Any activity"
                  className="modify-form__input"
                />
              )}
            />
          </div>
          <div className="modify-form__field">
            <label htmlFor="queryState">Instance State</label>
            <select id="queryState" {...register('queryState')} className="modify-form__input">
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="any">Any</option>
            </select>
          </div>
        </>
      )}
    </>
  );
};

export default InstanceSelectionFields;
