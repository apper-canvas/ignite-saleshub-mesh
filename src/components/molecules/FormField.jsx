import React from 'react';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Textarea from '@/components/atoms/Textarea';

const FormField = ({ label, type = 'text', options, id, value, onChange, required, rows, className = '', labelClassName = '', inputClassName = '', ...props }) => {
  const renderControl = () => {
    switch (type) {
      case 'select':
        return (
          <Select id={id} value={value} onChange={onChange} required={required} className={inputClassName} {...props}>
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </Select>
        );
      case 'textarea':
        return (
          <Textarea id={id} value={value} onChange={onChange} required={required} rows={rows} className={inputClassName} {...props} />
        );
      default:
        return (
          <Input id={id} type={type} value={value} onChange={onChange} required={required} className={inputClassName} {...props} />
        );
    }
  };

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}>
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}
      {renderControl()}
    </div>
  );
};

export default FormField;