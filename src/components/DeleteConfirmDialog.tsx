import useBodyScrollLock from '@/hooks/useBodyScrollLock';
import { CircleX } from 'lucide-react';
import React, { useEffect } from 'react';

const DeleteConfirmDialog = ({
  title,
  description,
  positiveButtonText,
  negativeButtonText,
  isOpen,
  onClose,
  onDelete,
}
  : {
    title: string,
    description: string,
    positiveButtonText: string,
    negativeButtonText: string,
    isOpen: any,
    onClose: () => void,
    onDelete: (data: any) => void,
  }
) => {
  useBodyScrollLock(isOpen);
  if (!isOpen) return null;

  return (
    <main className="fixed inset-0 antialiased flex items-center justify-center z-50 bg-gray-800 bg-opacity-50  text-gray-900 font-sans overflow-x-hidden">
      {/* Modal */}
      <div className="relative mb-4 mx-4 md:relative bg-white rounded-lg md:max-w-md md:mx-auto p-4 dark:bg-gray-800">
        <div className="md:flex items-center">
          <div className="rounded-full border border-gray-300 flex items-center justify-center w-16 h-16 flex-shrink-0 mx-auto">
            <CircleX className="bx bx-error text-3xl text-red-500" />
          </div>
          <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
            <p className="font-bold">{title}</p>
            <p className="text-sm text-gray-700 mt-1">{description}</p>
          </div>
        </div>
        <div className="text-center md:text-right mt-4 md:flex md:justify-end">
          <button
            onClick={() => {
              onDelete(isOpen); // Perform the delete action
              onClose(); // Close the dialog after the delete action
            }}
            className="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-red-200 text-red-700 rounded-lg font-semibold text-sm md:ml-2 md:order-2"
          >
            {positiveButtonText}
          </button>
          <button
            onClick={onClose}
            className="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-gray-200 rounded-lg font-semibold text-sm mt-4 md:mt-0 md:order-1"
          >
            {negativeButtonText}
          </button>
        </div>
      </div>
    </main>
  );
};

export default DeleteConfirmDialog;
