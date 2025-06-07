import { IndianRupee, Text } from 'lucide-react';
import React from 'react';

interface InputFieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  error?: string;
  disabled?: boolean;
  icon?: React.ReactElement;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  className = '',
  error = '',
  disabled = false,
  icon=<IndianRupee />,
}) => {
  const iconClassName = "w-4 h-4 text-gray-500 dark:text-gray-400";

  const renderedIcon = icon ? React.cloneElement(icon, {
    className: iconClassName
  }) : null;
  return (
    <div className={`mb-4 ${className}`}>
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative mb-6">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
          {renderedIcon}
        </div>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

    </div>
  );
};

export default InputField;