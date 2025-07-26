import React, { useState, useEffect } from 'react';

type SegmentSelectorProps = {
  options: string[];
  defaultSelected?: string[];
  multiSelect?: boolean;
  onSelect?: (selected: string[]) => void;
  disabledOptions?: string[];
  disabled?: boolean;
  required?: boolean; // <-- New prop to enforce at least one selection
};

const SegmentSelector: React.FC<SegmentSelectorProps> = ({
  options,
  defaultSelected = [],
  multiSelect = false,
  onSelect,
  disabledOptions = [],
  disabled = false,
  required = false,
}) => {
  const getInitialSelection = (): string[] => {
    if (multiSelect) return defaultSelected;
    if (required && defaultSelected.length === 0 && options.length > 0) {
      return [options[0]]; // fallback to first option
    }
    return defaultSelected;
  };

  const [selected, setSelected] = useState<string[]>(getInitialSelection());

  useEffect(() => {
    onSelect?.(selected);
  }, [selected]);

  const handleClick = (option: string) => {
    if (disabled || disabledOptions.includes(option)) return;

    let newSelection: string[] = [];

    if (multiSelect) {
      newSelection = selected.includes(option)
        ? selected.filter((item) => item !== option)
        : [...selected, option];
    } else {
      if (selected.includes(option)) {
        if (required) return; // prevent deselecting if required
        newSelection = []; // allow deselect
      } else {
        newSelection = [option];
      }
    }

    setSelected(newSelection);
  };

  return (
    <div
      className={`inline-flex flex-wrap rounded-xl border p-1 shadow-sm transition-opacity
        ${disabled ? 'border-gray-300 bg-gray-100 dark:bg-gray-700 opacity-60 cursor-not-allowed' : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800'}`}
    >
      {options.map((option) => {
        const isActive = selected.includes(option);
        const isOptionDisabled = disabled || disabledOptions.includes(option);

        return (
          <button
            key={option}
            onClick={() => handleClick(option)}
            disabled={isOptionDisabled}
            className={`px-4 py-2 text-sm font-medium m-1 rounded-lg transition-colors duration-200
              ${isActive && !isOptionDisabled
                ? 'bg-blue-600 text-white dark:bg-blue-500'
                : isOptionDisabled
                  ? 'text-gray-400 cursor-not-allowed bg-gray-100 dark:bg-gray-700'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
};

export default SegmentSelector;
