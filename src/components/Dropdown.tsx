import { ChevronDown, UserRound } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

interface Dropdown {
  items:string[];
  selectedItem:string|null;
  onItemSelect:(item:string)=>void;
  className: string;
  placeholder?: string;
}

const Dropdown: React.FC<Dropdown> = (
  { 
    items, 
    selectedItem, 
    onItemSelect, 
    className = "", 
    placeholder = "Select..." 
  }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const dropdownRef = useRef<HTMLDivElement | null>(null); // Reference to the dropdown container

  // Toggle the dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false); // Close dropdown if clicked outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter items based on the search term
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  // Handle item selection and close the dropdown
  const handleItemClick = (item:string) => {
    onItemSelect(item); // Call the onItemSelect method passed as a prop
    setIsOpen(false); // Close dropdown after selection
  };

  return (
    <div className={`flex items-center justify-start ${className}`}>
      <div className="relative group w-full " ref={dropdownRef}>
        <button
          id="dropdown-button"
          className="flex justify-between w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black
          dark:border-gray-800 dark:text-gray-200 dark:bg-gray-700
          "
          onClick={toggleDropdown}
        >
          <div className='flex'>
            <UserRound className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400"/>
            <span className="mr-2 dark:text-gray-400">{selectedItem ? selectedItem : placeholder}</span>
          </div>
          <ChevronDown className="w-5 h-5 ml-2 -mr-1" />

        </button>
        {isOpen && (
          <div
            id="dropdown-menu"
            className="absolute w-full left-0 mt-2 z-10 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-1 space-y-1
             dark:text-gray-200 dark:bg-gray-700
            "
          >
            {/* Search input */}
            <input
              id="search-input"
              className="block w-full px-4 py-2 text-gray-800 border rounded-md border-gray-300 focus:outline-none
              dark:border-gray-400 dark:text-gray-200 dark:bg-gray-700 dark:placeholder-gray-400
              "
              type="text"
              placeholder="Search items"
              value={searchTerm}
              onChange={handleSearch}
              autoComplete="off"
            />
            {/* Dropdown content */}
            <div className="max-h-[200px] overflow-y-auto custom-scroll">
              {items
                .filter((item) =>
                  item.toLowerCase().includes(searchTerm)
                )
                .map((item, index) => (
                  <a
                    key={index}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer rounded-md
                    dark:text-gray-200 dark:hover:bg-gray-900
                    "
                    onClick={() => handleItemClick(item)} // Call the item click handler
                  >
                    {item}
                  </a>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dropdown;
