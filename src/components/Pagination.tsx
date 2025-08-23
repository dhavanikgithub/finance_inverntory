"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import React from "react";

interface PaginationProps {
  currentPage: number;
  totalRows: number;
  rowsPerPage: number;
  onPageChange: (pageNumber: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalRows,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const startRecord = (currentPage - 1) * rowsPerPage + 1;
  const endRecord = Math.min(startRecord + rowsPerPage - 1, totalRows);

  const handleFirst = () => {
    if (currentPage !== 1) onPageChange(1);
  };

  const handleLast = () => {
    if (currentPage !== totalPages) onPageChange(totalPages);
  };

  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPageButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = startPage + maxPageButtons - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRowsPerPage = parseInt(e.target.value, 10);
    onRowsPerPageChange(newRowsPerPage);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3">
      <div className="text-sm text-slate-500">
        Showing {startRecord} to {endRecord} of {totalRows} records &nbsp;
        (Page {currentPage} of {totalPages})
      </div>

      <div className="flex flex-wrap items-center gap-1">
        <div className="flex items-center gap-4 me-3">
          <label className="text-sm text-slate-600">
            Records
          </label>
          <select
            className="rounded px-2 py-2 text-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-0"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <button
          className="btn-secondary-outline"
          type="button"
          onClick={handleFirst}
          disabled={currentPage === 1}
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        <button
          className="btn-secondary-outline"
          type="button"
          onClick={handlePrevious}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {getPageNumbers().map((pageNumber) => (
          <button
            key={pageNumber}
            className={`btn-secondary-outline ${pageNumber === currentPage ? "bg-blue-500 text-white" : ""
              }`}
            type="button"
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}

        <button
          className="btn-secondary-outline"
          type="button"
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          className="btn-secondary-outline"
          type="button"
          onClick={handleLast}
          disabled={currentPage === totalPages}
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
