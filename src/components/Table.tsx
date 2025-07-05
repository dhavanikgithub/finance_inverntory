"use client";

import React, { ReactNode, useEffect, useState } from "react";
import Pagination from "./Pagination";
import Spinner from "./Spinner";

interface CustomTableProps {
  children: ReactNode;
  currentPage: number;
  totalRows: number;
  rowsPerPage: number;
  onPageChange: (pageNumber: number) => void;

}
interface TableDataProps {
  children: ReactNode;
  colSpan?: number;
  isLoading?: boolean;
  noData?: boolean;
  onClick?: () => void;
}

interface TableRowProps {
  children: ReactNode;
  onContextMenu?: (e: React.MouseEvent) => void;
}

interface TableBodyProps {
  children: ReactNode;
}

interface TableHeaderProps {
  children: ReactNode;
}

interface TableHeaderItemProps {
  children: ReactNode;
  onClick: () => void;
}

const CustomTable: React.FC<CustomTableProps> = ({
  children,
  currentPage,
  totalRows,
  onPageChange,
  rowsPerPage,
}) => {
  return (
    <div className="w-full mt-4 ">
      <div className="overflow-x-auto">
        <div className="max-h-[420px] overflow-y-auto">
          <table className="w-full text-left table-auto min-w-max">
            {children}
          </table>
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalRows={totalRows}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
      />
    </div>
  );
};

// const TableData:React.FC<TableDataProps> = ({ children }) => {
//   return (
//     <td className="p-4 border-b border-slate-200 dark:border-slate-600">
//       <div className="flex flex-col text-black dark:text-gray-200">{children}</div>
//     </td>
//   )
// }
const TableData: React.FC<TableDataProps> = ({ children, colSpan = 1, isLoading = false, noData = false, onClick }) => {
  let content = children;

  if (isLoading) {
    return (
      <td colSpan={colSpan} className="p-4 text-center border-b border-slate-200 dark:border-slate-600">
        <Spinner />
      </td>
    );
  }

  else if (noData && !isLoading) {
    return (
      <td colSpan={colSpan} className="p-4 text-center border-b border-slate-200 dark:border-slate-600">
        <div className="flex flex-col text-black dark:text-gray-200 w-full">No records found.</div>
      </td>
    );
  }

  else {
    return (
      <td colSpan={colSpan} className="p-4 border-b border-slate-200 dark:border-slate-600 cursor-pointer" onClick={onClick}>
        <div className="flex flex-col text-black dark:text-gray-200 w-full">{content}</div>
      </td>
    );
  }
};

const TableRow: React.FC<TableRowProps> = ({ children, onContextMenu }) => {
  return (
    <tr className="hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" onContextMenu={onContextMenu}>
      {children}
    </tr>
  );
};


const TableBody: React.FC<TableBodyProps> = ({ children }) => {
  return (<tbody>{children}</tbody>)
}

const TableHeaderItem: React.FC<TableHeaderItemProps> = ({ children, onClick }) => {
  return (
    <th
      className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100 sticky top-0 z-10 dark:bg-gray-800 dark:border-slate-600"
      onClick={onClick}
    >
      <p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
        {children}
      </p>
    </th>
  )
}
const TableHeader: React.FC<TableHeaderProps> = ({ children }) => {
  return (
    <thead>
      <tr>
        {children}
      </tr>
    </thead>
  );
};

export { TableHeader, TableHeaderItem, TableBody, TableRow, TableData };

export default CustomTable;
