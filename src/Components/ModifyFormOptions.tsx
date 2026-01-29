/**
 * Form options component for process modification.
 * Contains annotation field and execution option checkboxes.
 */
import React from 'react';
import { useFormContext } from 'react-hook-form';

/**
 * Renders the options section of the modify form.
 * Includes annotation input and skip listeners/mappings checkboxes.
 */
const ModifyFormOptions: React.FC = () => {
  const { register } = useFormContext();

  return (
    <>
      <div style={{ marginBottom: '15px' }}>
        <label>Annotation (optional): </label>
        <br />
        <input
          type="text"
          {...register('annotation')}
          className="form-control"
          placeholder="Reason for modification"
          style={{ width: '100%', maxWidth: '600px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>
          <input type="checkbox" {...register('skipCustomListeners')} /> Skip Custom Listeners
        </label>
        <br />
        <label>
          <input type="checkbox" {...register('skipIoMappings')} /> Skip I/O Mappings
        </label>
      </div>
    </>
  );
};

export default ModifyFormOptions;
