'use client'

import React, { useEffect, useState } from 'react';
import Dashboard from '@/components/Dashboard';
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
import { showToastError, showToastSuccess } from '@/utils/toast';
import { SquarePen, Trash, Building, Landmark } from 'lucide-react';
import MoreOptionsMenu from '@/components/MoreOptionsMenu';
import DeactivateAccountModal from '@/components/DeactivateAccountModal';

import { formatDate, formatTime } from '@/utils/helper';
import { Card } from '@/app/model/Card';
import BankManagementModal from '@/components/BankManagementModal';

export default function BankScreen() {
  const dispatch: AppDispatch = useDispatch();
  const banks = useSelector((state: RootState) => state.bank.banks);
  const loading = useSelector((state: RootState) => state.bank.loading);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bankToEdit, setBankToEdit] = useState<null | Bank>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortedData, setSortedData] = useState<Bank[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string }>({ key: '', direction: 'asc' });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<null | Bank>(null);
  const rowsPerPage = 10;

  useEffect(() => {
    dispatch(fetchBanks());
    dispatch(fetchCards());
  }, [dispatch]);

  useEffect(() => {
    setSortedData(banks);
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
      .then(() => showToastSuccess(`Bank ${bankToEdit ? 'Updated' : 'Added'}`, 'Operation successful.'))
      .catch((error) => showToastError('Error', error.message));
  };

  const handleDeleteBank = (bank: Bank) => {
    dispatch(deleteBankData(bank.id))
      .then(() => showToastSuccess('Bank Deleted', 'Successfully deleted.'))
      .catch((error) => showToastError('Error', error.message));
  };

  const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Bank Name', accessor: 'name' },
    { Header: 'Created On', accessor: 'create_date' },
    { Header: 'Action', accessor: 'action', sorting: false },
  ];

  const actions = [
    {
      icon: <SquarePen className="w-4 h-4" />, label: 'Edit', onClick: openModalForEdit,
    },
    {
      icon: <Trash className="w-4 h-4" />, label: 'Delete', onClick: (data: Bank) => setIsDeleteDialogOpen(data),
    },
  ];

  const sortData = (key: keyof Bank) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    const sorted = [...banks].sort((a, b) => {
      if (a[key]! < b[key]!) return direction === 'asc' ? -1 : 1;
      if (a[key]! > b[key]!) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setSortedData(sorted);
    setSortConfig({ key, direction });
  };

  const renderTableHeaders = () => (
    columns.map((col) => (
      <TableHeaderItem
        key={col.accessor}
        onClick={() => col.sorting !== false && sortData(col.accessor as keyof Bank)}>
        {col.Header} {col.sorting !== false && (sortConfig.key === col.accessor ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '')}
      </TableHeaderItem>
    ))
  );

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = sortedData.slice(indexOfFirstRow, indexOfLastRow);

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
          totalRows={banks.length}
          onPageChange={setCurrentPage}
          rowsPerPage={rowsPerPage}
        >
          <TableHeader>{renderTableHeaders()}</TableHeader>
          <TableBody>
            {currentRows.map((row) => (
              <TableRow key={row.id}>
                <TableData>{row.id}</TableData>
                <TableData>{row.name}</TableData>
                <TableData>
                  <span>{formatDate(row.create_date!.toString())}<br /><span className="text-gray-500">{formatTime(row.create_time!)}</span></span>
                </TableData>
                <TableData><MoreOptionsMenu options={actions} data={row} /></TableData>
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
