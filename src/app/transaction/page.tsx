'use client'
import { JSX, useEffect, useState } from 'react';
import AmountManagementModal from '../../components/AmountManagementModal';
import { ArrowLeftRight, File, SquarePen, Trash } from "lucide-react";
import Dashboard from '@/components/Dashboard';
import { SectionHeader, SectionHeaderLeft, SectionHeaderRight, SectionContent, Heading, SubHeading } from '@/components/Section';
import CustomTable, { TableBody, TableData, TableHeader, TableHeaderItem, TableRow } from '@/components/Table';
import { useDispatch, useSelector } from 'react-redux';
import { addTransaction, deleteTransaction, fetchTransactions, updateTransaction } from '@/store/actions/transactionActions';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import MoreOptionsMenu from '@/components/MoreOptionsMenu';
import { formatAmount, formatDate, formatTime } from '@/utils/helper';
import { fetchClients } from '@/store/actions/clientActions';
import GenerateReportModal from '@/components/GenerateReportModal';
import DeactivateAccountModal from '@/components/DeactivateAccountModal';
import { showToastError, showToastSuccess } from '@/utils/toast';
import { AppDispatch, RootState } from '@/store/store';
import { Transaction } from '@/store/slices/transactionSlice';
import { SortConfig } from '../client/page';
export type Action = {
  icon: JSX.Element; // `JSX.Element` type for React components or elements
  label: string;
  onClick: (data: any) => void; // `onClick` is a function that takes no arguments and returns void
};
export default function Home() {
  const dispatch: AppDispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const transactions = useSelector((state: RootState) => state.transaction.transactions);
  const clients = useSelector((state: RootState) => state.client.clients);
  const loading = useSelector((state: RootState) => state.transaction.loading);
  const clientsLoading = useSelector((state: RootState) => state.client.loading);
  const [transactionToEdit, setTransactionToEdit] = useState<null | Transaction>(null);
  const [sortedData, setSortedData] = useState<Transaction[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "", direction: "asc" });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentRows, setCurrentRows] = useState<Transaction[]>([]);
  const rowsPerPage: number = 10;
  const [isGenerateReportModalOpen, setIsGenerateReportModalOpen] = useState<boolean>(false);

  const [isDeleteRecordDialogOpen, setIsDeleteRecordDialogOpen] = useState<null | Transaction>(null);

  const openDeleteRecordDialog = (data: Transaction) => {
    setIsDeleteRecordDialogOpen(data);
  };

  const closeDeleteRecordDialog = () => {
    setIsDeleteRecordDialogOpen(null);
  };

  // Sorting Function
  const sortData = (key: keyof Transaction) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sorted = [...transactions].sort((a, b) => {
      if (a[key]! < b[key]!) return direction === "asc" ? -1 : 1;
      if (a[key]! > b[key]!) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setSortedData(sorted);
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    setCurrentRows(sortedData.slice(indexOfFirstRow, indexOfLastRow));
  }, [currentPage, sortedData, transactions])

  const getSortIcon = (columnKey: string, sorting = true) => {
    if (sorting && sortConfig.key === columnKey) {
      return sortConfig.direction === "asc" ? "↑" : "↓";
    }
    return "";
  };

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchClients())
  }, [dispatch]);

  useEffect(() => {
  }, [clients])
  useEffect(() => {
    setSortedData(transactions);
  }, [transactions]);


  const openModalForEdit = (transaction: Transaction) => {
    setTransactionToEdit(transaction);
    setIsModalOpen(true);
  };

  const openModalForAdd = () => {
    setTransactionToEdit(null); // Clear clientToEdit for adding new
    setIsModalOpen(true);
  };

  const handleSaveTransaction = (transactionData: Transaction) => {

    if (transactionToEdit) {
      // Update existing Transaction
      dispatch(updateTransaction(transactionData))
        .then(() => {
          // Show success toast after successful update
          showToastSuccess('Transaction Updated', 'The transaction was updated successfully.');
        })
        .catch((error) => {
          // Show error toast if the update failed
          showToastError('Error Updating Transaction', `Something went wrong: ${error.message}`);
        });

      setTransactionToEdit(null);
    } else {
      // Add new Transaction
      dispatch(addTransaction(transactionData))
        .then(() => {
          // Show success toast after successful add
          showToastSuccess('Transaction Added', 'The new transaction has been added successfully.');
        })
        .catch((error) => {
          // Show error toast if the add failed
          showToastError('Error Adding Transaction', `Something went wrong: ${error.message}`);
        });
    }
  };

  const handleDeleteTransaction = (transactionData: Transaction) => {
    if (transactionData?.id) {
      dispatch(deleteTransaction(transactionData.id)).then(() => {
        // Show success toast after successful update
        showToastSuccess('Transaction Deleted', 'The transaction was deleted successfully.');
      })
        .catch((error) => {
          // Show error toast if the update failed
          showToastError('Error Deleting Transaction', `Something went wrong: ${error.message}`);
        });
    }
  }


  // Define the type for a column object
  interface Column {
    Header: string;
    accessor: keyof Transaction | string; // Change this from string to keyof Transaction
    type?: string;        // Optional property for custom column types (like "action")
    sorting?: boolean;    // Optional property for sorting control
  }

  // Define the columns array with the correct types
  const columns: Column[] = [
    { Header: "Client", accessor: "client_name" },
    { Header: "Amount", accessor: "amount" },
    { Header: "Transaction Type", accessor: "transaction_type" },
    { Header: "Transaction Amount", accessor: "transaction_amount" },
    { Header: "Charges", accessor: "widthdraw_charges" },
    { Header: "Available Amount", accessor: "final_amount" },
    { Header: "Create Date", accessor: "create_date" },
    {
      Header: "Action",
      accessor: "action",
      type: "action",
      sorting: false,
    },
  ];



  const actions: Action[] = [
    {
      icon: <SquarePen className='w-4 h-4' />,
      label: "Edit",
      onClick: openModalForEdit,
    },
    {
      icon: <Trash className='w-4 h-4' />,
      label: "Delete",
      onClick: openDeleteRecordDialog,
    }
  ]

  const openGenerateReport = () => {
    setIsGenerateReportModalOpen(true)
  }


  function renderTableHeaders(columns: Column[]) {
    return (
      <>
        {columns.map((column) => (
          <TableHeaderItem key={column.accessor} onClick={() => {
            if (column.sorting != false) {
              sortData(column.accessor as keyof Transaction)
            }
          }
          }>
            {column.Header} <span>{getSortIcon(column.accessor, column?.sorting)}</span>
          </TableHeaderItem>
        ))}
      </>
    )
  }

  function renderTableRows(currentRows: Transaction[], columns: Column[]) {

    const renderTableData = (row: Transaction) => {

      return (
        <>

          <TableData>
            {row.client_name}
          </TableData>
          <TableData>
            ₹{formatAmount(row.amount.toString())}/-
          </TableData>
          <TableData>
            {row.transaction_type === 0 ?
              <div
                className="relative grid items-center px-2 py-1 font-sans text-xs font-bold text-green-900 uppercase rounded-md select-none whitespace-nowrap bg-green-500/20
                dark:bg-green-900 dark:text-green-300 dark:bg-opacity-30
                ">
                <span className="">Deposit</span>
              </div>
              :
              <div
                className="relative grid items-center px-2 py-1 font-sans text-xs font-bold text-red-900 uppercase rounded-md select-none whitespace-nowrap bg-red-500/20
                dark:bg-red-900 dark:text-red-300 dark:bg-opacity-30
                ">
                <span className="">Widthdraw</span>
              </div>
            }
          </TableData>
          <TableData>
            {row.transaction_type === 1 ?
              <div>
                <p className="text-red-700 text-sm dark:text-red-500">
                  - ₹{formatAmount((row.transaction_amount * -1).toString())}/-
                </p>
                <p
                  className="text-sm text-slate-500">
                  ATA: ₹{formatAmount((row.transaction_amount + ((row.transaction_amount * (row.widthdraw_charges / 100)) * -1)).toString())}/-
                </p>
              </div>

              :
              <p className="text-green-700 text-sm dark:text-green-500">
                + ₹{formatAmount(row.transaction_amount.toString())}/-
              </p>
            }
          </TableData>
          <TableData>
            {row.transaction_type === 0 ? (<p className="text-sm font-semibold text-slate-700">-</p>) : (
              <>
                <p className="text-sm font-semibold text-slate-700 dark:text-gray-200">
                  {row.widthdraw_charges}%
                </p>
                <p
                  className="text-sm text-slate-500">
                  ₹{formatAmount(((row.transaction_amount * (row.widthdraw_charges / 100)) * -1).toString())}/-
                </p>
              </>
            )}


          </TableData>
          <TableData>
            <span
            className={row.final_amount < 0 ? 'text-red-500' : ''}
            >
              {row.final_amount < 0
                ? `- ₹${formatAmount(Math.abs(row.final_amount).toString())}/-`
                : `₹${formatAmount(row.final_amount.toString())}/-`}
            </span>
          </TableData>
          <TableData>
            <span className='text-sm'>
              <span className=''>{formatDate(row.create_date!)}</span><br />
              <span className='text-gray-500'>{formatTime(row.create_time!)}</span>
            </span>
          </TableData>
          <TableData>
            <MoreOptionsMenu options={actions} data={row} />
          </TableData>
        </>
      )
    }
    return (
      <>
        {currentRows.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {renderTableData(row)}
          </TableRow>
        ))}
      </>
    )
  }

  const onCloseAmountManagementModal = () => {
    setIsModalOpen(false)
    setTransactionToEdit(null)
  }

  return (
    <Dashboard>
      <SectionHeader>
        <SectionHeaderLeft>
          <Heading>Transactions</Heading>
          <SubHeading>Review each person before edit</SubHeading>
        </SectionHeaderLeft>
        <SectionHeaderRight>
          <button
            onClick={openGenerateReport}
            className="btn-secondary-outline"
            type="button">
            <File className='w-3 h-3' />
            Report
          </button>
          <button
            onClick={openModalForAdd}
            className="btn-secondary"
            type="button">
            <ArrowLeftRight className='w-3 h-3' />
            Add Transaction
          </button>
          <AmountManagementModal clients={clients} transactionToEdit={transactionToEdit} isOpen={isModalOpen} onClose={onCloseAmountManagementModal} onSave={handleSaveTransaction} />
        </SectionHeaderRight>
      </SectionHeader>
      <SectionContent>
        <div className="container mx-auto">
          <CustomTable
            currentPage={currentPage}
            totalRows={transactions.length}
            onPageChange={setCurrentPage}
            rowsPerPage={rowsPerPage}
          >
            {/* Table Header */}
            <TableHeader>
              {renderTableHeaders(columns)}
            </TableHeader>

            {/* Table Body */}
            <TableBody>
              {renderTableRows(currentRows, columns)}
            </TableBody>
          </CustomTable>
          <DeactivateAccountModal
            title={"Delete Transaction"}
            description={
              "You are about to delete this transaction." +
              "This action cannot be undone. will be permanently removed from the system."
            }
            positiveButtonText={"Delete Transaction"}
            negativeButtonText={"Cancel"}
            isOpen={isDeleteRecordDialogOpen}
            onClose={closeDeleteRecordDialog}
            onDelete={handleDeleteTransaction}
          />
          <GenerateReportModal clients={clients} isOpen={isGenerateReportModalOpen} onClose={() => setIsGenerateReportModalOpen(false)} />
        </div>

      </SectionContent>
    </Dashboard>
  );
}
