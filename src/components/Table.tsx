"use client";

import React, { ReactNode, useEffect, useState } from "react";
import Pagination from "./Pagination";

interface CustomTableProps {
  children: ReactNode;
  currentPage: number;
  totalRows: number;
  rowsPerPage:number;
  onPageChange: (pageNumber:number)=> void;

}
interface TableDataProps {
  children: ReactNode;
}

interface TableRowProps {
  children: ReactNode;
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

const TableData:React.FC<TableDataProps> = ({ children }) => {
  return (
    <td className="p-4 border-b border-slate-200 dark:border-slate-600">
      <div className="flex flex-col text-black dark:text-gray-200">{children}</div>
    </td>
  )
}

const TableRow:React.FC<TableRowProps> = ({ children }) => {
  return (
    <tr>{children}</tr>
  )
}

const TableBody:React.FC<TableBodyProps> = ({ children }) => {
  return (<tbody>{children}</tbody>)
}

const TableHeaderItem:React.FC<TableHeaderItemProps> = ({ children, onClick }) => {
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
const TableHeader:React.FC<TableHeaderProps> = ({ children }) => {
  return (
    <thead>
      <tr>
        {children}
      </tr>
    </thead>
  );
};

export { TableHeader, TableHeaderItem, TableBody, TableRow, TableData};

export default CustomTable;
