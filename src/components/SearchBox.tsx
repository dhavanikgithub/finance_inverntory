import React, { useState, useRef, KeyboardEvent, ChangeEvent, FocusEvent } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBoxProps {
  handleOnSearch: (query: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ handleOnSearch }) => {
  const [searchInput, setSearchInput] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleOnSearch(searchInput);
    }
  };

  const handleClear = (): void => {
    setSearchInput('');
    inputRef.current?.focus();
    handleOnSearch('');
  };

  const handleFocus = (e: FocusEvent<HTMLInputElement>): void => {
    e.target.select();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchInput(e.target.value);
  };

  return (
    <div className="form-search m-0 p-0 relative">
      <label htmlFor="topbar-search" className="form-search-label">Search</label>
      <div className="form-search-wrapper relative">
        <input
          ref={inputRef}
          type="text"
          id="topbar-search"
          name="search"
          className="form-search-input ps-3 pr-10" // add padding for the X icon
          value={searchInput}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder="Search"
        />
        {searchInput && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBox;
