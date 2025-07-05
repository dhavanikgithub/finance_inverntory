import { formatDate, formatTime } from '@/utils/helper';
import React from 'react';

interface KeyValueTableProps {
  data: Record<string, any>;
}

const KeyValueTable: React.FC<KeyValueTableProps> = ({ data }) => {
  return (
    <div className="mt-4 max-h-64 overflow-y-auto rounded border border-gray-200 dark:border-gray-700">
      <table className="min-w-full text-sm text-left bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        <thead className="sticky top-0 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
          <tr>
            <th className="px-4 py-2 border-b border-gray-200 dark:border-gray-600">Field</th>
            <th className="px-4 py-2 border-b border-gray-200 dark:border-gray-600">Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([key, value]) => {
            let displayValue = value;
            if (
              displayValue === null ||
              displayValue === undefined ||
              (typeof displayValue === 'string' && displayValue.trim() === '')
            ) {
              displayValue = '-';
            }
            else if (key.toLowerCase().includes('date')) {
              displayValue = formatDate(value);
            } 
            else if (key.toLowerCase().includes('time')) {
              displayValue = formatTime(value);
            } 
            else if (typeof value === 'object' && value !== null) {
              displayValue = JSON.stringify(value, null, 2);
            }
            

            return (
              <tr key={key} className="border-t border-gray-200 dark:border-gray-700">
                <td className="px-4 py-2 font-medium">{key}</td>
                <td className="px-4 py-2 break-all whitespace-pre-wrap">{String(displayValue)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default KeyValueTable;
