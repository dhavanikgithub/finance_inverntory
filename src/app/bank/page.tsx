'use client'

import React, { useEffect, useMemo, useState } from 'react';
import Dashboard from '@/components/Dashboard/Dashboard';
import {
  SectionHeader,
  SectionHeaderLeft,
  SectionHeaderRight,
  Heading,
  SubHeading,
  SectionContent,
} from '@/components/Section';
import CustomTable, {
  TableHeader,
  TableHeaderItem,
  TableBody,
  TableRow,
  TableData,
} from '@/components/Table';
import { Bank } from '@/app/model/Bank';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import {
  fetchBanks,
  addNewBank,
  updateBankData,
  deleteBankData,
} from '@/store/actions/bankActions';
import { fetchCards } from '@/store/actions/cardActions';
import { Landmark, Pencil, Trash2 } from 'lucide-react';
import DeactivateAccountModal from '@/components/DeactivateAccountModal';

import { formatDate, formatTime } from '@/utils/helper';
import { Card } from '@/app/model/Card';
import BankManagementModal from '@/components/BankManagementModal';
import ActionMenu from '@/components/ActionMenu';

export default function BankScreen() {
  const dispatch: AppDispatch = useDispatch();
  const banks = useSelector((state: RootState) => state.bank.banks);
  const loading = useSelector((state: RootState) => state.bank.loading);
  const error = useSelector((state: RootState) => state.bank.error);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bankToEdit, setBankToEdit] = useState<null | Bank>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortedData, setSortedData] = useState<Bank[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string }>({ key: 'name', direction: 'asc' });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<null | Bank>(null);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  useEffect(() => {
    dispatch(fetchBanks());
    dispatch(fetchCards());
  }, [dispatch]);

  useEffect(() => {
    sortData(sortConfig.key as keyof Bank, sortConfig.direction);
  }, [banks]);

  const openModalForAdd = () => {
    setBankToEdit(null);
    setIsModalOpen(true);
  };

  const openModalForEdit = (bank: Bank) => {
    setBankToEdit(bank);
    setIsModalOpen(true);
  };

  const handleSaveBank = (bank: Bank) => {
    const action = bankToEdit ? updateBankData : addNewBank;
    dispatch(action(bank))
      .then(() => {
        setIsModalOpen(false); // Close the modal on error
        setBankToEdit(null);
      })
  };

  const handleDeleteBank = (bank: Bank) => {
    dispatch(deleteBankData(bank.id))
  };

  const columns = [
    { Header: 'Bank Name', accessor: 'name' },
    { Header: 'Created On', accessor: 'create_date' },
    { Header: 'Action', accessor: 'action', sorting: false },
  ];


  const menuItems = [
    {
      label: 'Edit',
      icon: Pencil,
      onClick: openModalForEdit,
    },
    {
      label: 'Delete',
      icon: Trash2,
      onClick: (data: Bank) => setIsDeleteDialogOpen(data)
    },
  ];

  const sortDataToggle = (key: keyof Card, direction = "asc") => {
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    sortData(key, direction);
    setSortConfig({ key, direction });
  };

  const sortData = (key: keyof Bank, direction = "asc") => {
    if (!banks || banks.length === 0) {
      setSortedData([]);
      return;
    }
    const sorted = [...banks].sort((a, b) => {
      if (a[key]! < b[key]!) return direction === 'asc' ? -1 : 1;
      if (a[key]! > b[key]!) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setSortedData(sorted);
  };

  const renderTableHeaders = () => (
    columns.map((col) => (
      <TableHeaderItem
        key={col.accessor}
        onClick={() => col.sorting !== false && sortDataToggle(col.accessor as keyof Bank)}>
        {col.Header} {col.sorting !== false && (sortConfig.key === col.accessor ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '')}
      </TableHeaderItem>
    ))
  );

  const currentRows = useMemo(() => {
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    return sortedData.slice(indexOfFirstRow, indexOfLastRow);
  },[rowsPerPage, currentPage, sortedData]);

  function onRowsPerPageChange(newRowsPerPage: number) {
    setCurrentPage(1); // Reset to first page when rows per page changes
    setRowsPerPage(newRowsPerPage);
  };
  return (
    <Dashboard>
      <SectionHeader>
        <SectionHeaderLeft>
          <Heading>Bank List</Heading>
          <SubHeading>Manage bank records and their linked card types</SubHeading>
        </SectionHeaderLeft>
        <SectionHeaderRight>
          <button onClick={openModalForAdd} className="btn-secondary" type="button">
            <Landmark className="w-4 h-4" /> Add Bank
          </button>
          <BankManagementModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveBank}
            bankToEdit={bankToEdit}
          />
        </SectionHeaderRight>
      </SectionHeader>
      <SectionContent>
        <CustomTable
          currentPage={currentPage}
          totalRows={sortedData.length}
          onPageChange={setCurrentPage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
        >
          <TableHeader>{renderTableHeaders()}</TableHeader>
          <TableBody>
            {currentRows.map((row) => (
              <TableRow key={row.id}>
                <TableData>{row.name}</TableData>
                <TableData>
                  <span>{formatDate(row.create_date!.toString())}<br /><span className="text-gray-500">{formatTime(row.create_time!)}</span></span>
                </TableData>
                <TableData>
                  <ActionMenu<Bank> items={menuItems} data={row}/>
                </TableData>
              </TableRow>
            ))}
          </TableBody>
        </CustomTable>
        <DeactivateAccountModal
          title="Delete Bank"
          description="Are you sure you want to delete this bank? This action cannot be undone."
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(null)}
          onDelete={handleDeleteBank}
          positiveButtonText="Delete Bank"
          negativeButtonText="Cancel"
        />
      </SectionContent>
    </Dashboard>
  );
}
