"use client";

import React from "react";

interface PaginationProps {
  currentPage: number;
  totalRows: number;
  rowsPerPage: number;
  onPageChange: (pageNumber:number) => void
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalRows, onPageChange, rowsPerPage }) => {
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex items-center justify-between p-3">
      <p className="block text-sm text-slate-500">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex gap-1">
        <button
          className="btn-secondary-outline"
          type="button"
          onClick={handlePrevious}
        >
          Previous
        </button>
        <button
          className="btn-secondary-outline"
          type="button"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
