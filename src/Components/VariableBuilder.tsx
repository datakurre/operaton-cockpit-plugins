import React from 'react';
import { useFieldArray, useFormContext, Controller, useWatch } from 'react-hook-form';

const variableTypes = [
  'String',
  'Integer',
  'Boolean',
  'Double',
  'Date',
  'Json',
  'Object',
  'File',
  'Bytes',
  'Short',
  'Long',
];

interface VariableBuilderProps {
  name: string;
  showLocalFlag: boolean;
}

const ValueInput = ({ name, index }: { name: string; index: number }): React.ReactElement => {
  const { control } = useFormContext();
  const type: string = useWatch({
    control,
    name: `${name}.${String(index)}.type`,
  }) as string;

  switch (type) {
    case 'Boolean':
      return (
        <Controller
          name={`${name}.${String(index)}.value`}
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <select {...field} className="form-control">
              <option value="false">false</option>
              <option value="true">true</option>
            </select>
          )}
        />
      );
    case 'Json':
    case 'Object':
      return (
        <Controller
          name={`${name}.${String(index)}.value`}
          control={control}
          defaultValue=""
          render={({ field }) => <textarea {...field} placeholder="Value" className="form-control" />}
        />
      );
    case 'Date':
      return (
        <Controller
          name={`${name}.${String(index)}.value`}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <input type="datetime-local" {...field} placeholder="Value" className="form-control" />
          )}
        />
      );
    case 'Integer':
    case 'Double':
    case 'Short':
    case 'Long':
      return (
        <Controller
          name={`${name}.${String(index)}.value`}
          control={control}
          defaultValue=""
          render={({ field }) => <input type="number" {...field} placeholder="Value" className="form-control" />}
        />
      );
    default:
      return (
        <Controller
          name={`${name}.${String(index)}.value`}
          control={control}
          defaultValue=""
          render={({ field }) => <input {...field} placeholder="Value" className="form-control" />}
        />
      );
  }
};

const VariableBuilder: React.FC<VariableBuilderProps> = ({ name, showLocalFlag }) => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <div>
      {fields.map((item, index) => (
        <div key={item.id} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <Controller
            name={`${name}.${String(index)}.name`}
            control={control}
            defaultValue=""
            render={({ field }) => <input {...field} placeholder="Name" className="form-control" />}
          />
          <Controller
            name={`${name}.${String(index)}.type`}
            control={control}
            defaultValue="String"
            render={({ field }) => (
              <select {...field} className="form-control">
                {variableTypes.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            )}
          />
          <ValueInput name={name} index={index} />
          {showLocalFlag && (
            <label style={{ display: 'flex', alignItems: 'center' }}>
              <Controller
                name={`${name}.${String(index)}.local`}
                control={control}
                defaultValue={false}
                render={({ field }) => <input type="checkbox" {...field} checked={field.value as boolean} />}
              />
              <span style={{ marginLeft: '5px' }}>Local</span>
            </label>
          )}
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => {
              remove(index);
            }}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        className="btn btn-secondary"
        onClick={() => {
          append({ name: '', type: 'String', value: '', local: false });
        }}
      >
        Add Variable
      </button>
    </div>
  );
};

export default VariableBuilder;
