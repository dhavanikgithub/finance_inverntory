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
          className="rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all hover:opacity-75 focus:ring focus:ring-slate-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none
          dark:text-slate-300 dark:border-slate-600
          "
          type="button"
          onClick={handlePrevious}
        >
          Previous
        </button>
        <button
          className="rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all hover:opacity-75 focus:ring focus:ring-slate-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none
          dark:text-slate-300 dark:border-slate-600
          "
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
