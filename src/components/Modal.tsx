import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import useBodyScrollLock from '@/hooks/useBodyScrollLock';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disableOutsideClick?: boolean;
  
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  disableOutsideClick = true,
}) => {

   const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!disableOutsideClick && modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, disableOutsideClick]);

  useBodyScrollLock(isOpen);
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
      <div ref={modalRef} className="relative bg-white p-6 rounded-lg shadow-lg w-1/2 dark:bg-gray-900 dark:text-gray-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-xl dark:hover:text-gray-400"
          aria-label="Close"
        >
          <X className='w-4 h-4' />
        </button>

        {/* Modal panel */}

        {/* Header */}
        <h3
          className="text-lg leading-6 font-medium"
          id="modal-headline"
        >
          {title}
        </h3>

        {/* Content */}
        <div className="px-4 py-3 sm:px-6 sm:py-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;