import { Action } from '@/app/transaction/page';
import { EllipsisVertical } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
interface MoreOptionsMenuProps {
  options: Action[],
  data: any,
}
const MoreOptionsMenu:React.FC<MoreOptionsMenuProps> = ({ options, data }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null); // Reference to the menu (type it to div element or your custom component type)
  const buttonRef = useRef<HTMLButtonElement | null>(null); // Reference to the button (assuming it's a button)

  // Toggle menu visibility
  const toggleMenu = () => setIsOpen(!isOpen);

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Close menu when an option is clicked
  const handleOptionClick = (onClick:(data:any) => void) => {
    onClick(data); // Execute the option's action
    setIsOpen(false); // Close the menu
  };

  return (
    <div className="relative text-left">
      {/* Three vertical dots icon */}
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="inline-flex items-center justify-center p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        <EllipsisVertical className="w-4 h-4" />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className="bg-white origin-top-right absolute right-0 w-40 rounded-md shadow-lg z-10 dark:bg-gray-800"
        >
          <div className="px-1 py-2">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionClick(option.onClick)}
                className="flex items-center text-black rounded-full px-4 py-2 text-sm w-full text-left hover:bg-gray-300 dark:hover:bg-gray-900 dark:text-gray-200"
              >
                <span className='mr-3'>{option.icon}</span><span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoreOptionsMenu;
