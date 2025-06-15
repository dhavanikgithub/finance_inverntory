import { IndianRupee, X } from 'lucide-react';
import React, { useRef, KeyboardEvent, FocusEvent, ChangeEvent } from 'react';

interface InputFieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
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
  icon = <IndianRupee />,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const iconClassName = 'w-4 h-4 text-gray-500 dark:text-gray-400';
  const renderedIcon = icon ? React.cloneElement(icon, { className: iconClassName }) : null;

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };


  const handleClear = () => {
    onChange({ target: { value: '' } } as ChangeEvent<HTMLInputElement>);
    inputRef.current?.focus();
  };

  return (
    <div className={`mb-4 ${className}`}>
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative mb-6">
        {/* Left Icon */}
        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
          {renderedIcon}
        </div>

        {/* Clear Button */}
        {value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear input"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Input */}
        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete='off'
          autoCorrect='off'
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg ring-0 focus:ring-0 focus:outline-none block w-full ps-10 pr-8 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default InputField;
