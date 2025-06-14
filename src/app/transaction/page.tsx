'use client'
import { useEffect, useMemo, useState } from 'react';
import TransactionModal from '../../components/TransactionModal';
import { ArrowDownLeft, ArrowUpRight, File, Filter as FilterIcon, Search, SquarePen, Trash } from "lucide-react";
import Dashboard from '@/components/Dashboard';
import { SectionHeader, SectionHeaderLeft, SectionHeaderRight, SectionContent, Heading, SubHeading } from '@/components/Section';
import CustomTable, { TableBody, TableData, TableHeader, TableHeaderItem, TableRow } from '@/components/Table';
import { useDispatch, useSelector } from 'react-redux';
import { addTransaction, deleteTransaction, fetchTransactions, updateTransaction } from '@/store/actions/transactionActions';
import MoreOptionsMenu from '@/components/MoreOptionsMenu';
import { baseFuseOptions, formatAmount, formatDate, formatTime, getMonthNumberFromDate, getTransactionTypeStr, isTransactionTypeDeposit, isTransactionTypeWidthdraw } from '@/utils/helper';
import { fetchClients } from '@/store/actions/clientActions';
import GenerateReportModal from '@/components/GenerateReportModal';
import DeactivateAccountModal from '@/components/DeactivateAccountModal';
import { showToastError, showToastSuccess } from '@/utils/toast';
import { AppDispatch, RootState } from '@/store/store';
import { SortConfig } from '../client/page';
import Fuse from 'fuse.js';
import { Action } from '../model/Action';
import Transaction, { Deposit, TransactionType, Widthdraw } from '../model/Transaction';
import FilterModal, { FilterType, getTotalFilterCount, getTotalFiltersCount } from '@/components/FilterModal';
import DataProcessor from '@/utils/DataProcessor';
import { fetchBanks } from '@/store/actions/bankActions';
import { fetchCards } from '@/store/actions/cardActions';


export default function Home() {

  const dispatch: AppDispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState<null | TransactionType>(null);
  const transactions = useSelector((state: RootState) => state.transaction.transactions);
  const clients = useSelector((state: RootState) => state.client.clients);
  const banks = useSelector((state: RootState) => state.bank.banks);
  const cards = useSelector((state: RootState) => state.card.cards);
  const loading = useSelector((state: RootState) => state.transaction.loading);
  const clientsLoading = useSelector((state: RootState) => state.client.loading);
  const [transactionToEdit, setTransactionToEdit] = useState<null | Transaction>(null);
  const [sortedData, setSortedData] = useState<Transaction[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "create_date", direction: "desc" });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentRows, setCurrentRows] = useState<Transaction[]>([]);
  const rowsPerPage: number = 10;
  const [isGenerateReportModalOpen, setIsGenerateReportModalOpen] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [isDeleteRecordDialogOpen, setIsDeleteRecordDialogOpen] = useState<null | Transaction>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterType[]>([]);
  const [filterColumns, setFilterColumns] = useState<FilterType[]>([])
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
    dispatch(fetchClients());
    dispatch(fetchBanks());
    dispatch(fetchCards());
  }, [dispatch]);


  useEffect(() => {
    setSortedData(transactions);
  }, [transactions]);


  const openModalForEdit = (transaction: Transaction) => {
    setTransactionToEdit(transaction);
    setIsModalOpen(getTransactionTypeStr(transaction.transaction_type));
  };

  const openModalForAdd = (transactionType: TransactionType) => {
    setTransactionToEdit(null); // Clear clientToEdit for adding new
    setIsModalOpen(transactionType);
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
    { Header: "Type", accessor: "transaction_type" },
    { Header: "Amount", accessor: "transaction_amount" },
    { Header: "Charges", accessor: "widthdraw_charges" },
    { Header: "Bank", accessor: "bank_name" },
    { Header: "Card", accessor: "card_name" },
    { Header: "Date", accessor: "create_date" },
    { Header: "Remarks", accessor: "remark" },
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

  function renderTableRows(currentRows: Transaction[]) {

    const renderTableData = (row: Transaction) => {

      return (
        <>

          <TableData>
            {row.client_name}
          </TableData>

          <TableData>
            {isTransactionTypeDeposit(row.transaction_type) ?
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
            {isTransactionTypeWidthdraw(row.transaction_type) ?
              <div>
                <p className="text-red-700 text-sm dark:text-red-500">
                  - ₹{formatAmount((row.transaction_amount * -1).toString())}/-
                </p>

              </div>

              :
              <p className="text-green-700 text-sm dark:text-green-500">
                + ₹{formatAmount(row.transaction_amount.toString())}/-
              </p>
            }
          </TableData>
          <TableData>
            {isTransactionTypeDeposit(row.transaction_type) ? (<p className="text-sm font-semibold text-slate-700">-</p>) : (
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
            <p className="text-sm font-semibold text-slate-700 dark:text-gray-200">
              {row.bank_name}
            </p>
          </TableData>
          <TableData>
            <p className="text-sm font-semibold text-slate-700 dark:text-gray-200">
              {row.card_name}
            </p>
          </TableData>
          <TableData>
            <span className='text-sm'>
              <span className=''>{formatDate(row.create_date!)}</span><br />
              <span className='text-gray-500'>{formatTime(row.create_time!)}</span>
            </span>
          </TableData>
          <TableData>

            <textarea
              rows={1}
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={row.remark}
              readOnly />
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
    setIsModalOpen(null)
    setTransactionToEdit(null)
  }
  const fuseOptions = {
    ...baseFuseOptions,
    keys: [
      "remark",
      "client_name"
    ]
  }
  const fuse = new Fuse(transactions, fuseOptions);
  const handleOnSearch = (searchText: string) => {
    if (searchText === "") {
      setCurrentRows([...transactions])
      return
    }
    const fuseSearchResult = fuse.search(searchText);
    const searchResultList = fuseSearchResult.map((fuseItem) => {
      return fuseItem.item
    })
    setCurrentRows([...searchResultList])
  }

  const handleApplyFilters = (filters: FilterType[]) => {
    setAppliedFilters(filters);
  };

  useEffect(() => {
    const dataProcessor = new DataProcessor(transactions, [])
    dataProcessor.applyFilter(appliedFilters)
    setSortedData(dataProcessor.getData())
  }, [appliedFilters])

  const clientNameFilter = useMemo((): FilterType<string> => {
    const distinctClientNames: string[] = Array.from(
      new Set(transactions.map(t => t.client_name))
    );

    return {
      columnName: "Client Name",
      columnAccessor: "client_name",
      filterOperator: 'string',
      dataOperator: 'string',
      data: distinctClientNames,
    }
  }, [transactions])

  

  useEffect(() => {
    setFilterColumns([
      clientNameFilter,
    ])
  }, [transactions])


  const totalFilterCount = useMemo(() => {
    return getTotalFilterCount(appliedFilters)
  }, [appliedFilters])

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
            onClick={() => openModalForAdd(Deposit)}
            className="btn-secondary bg-green-500 dark:bg-green-700"
            type="button">
            <ArrowDownLeft className='w-3 h-3' />
            Deposit
          </button>
          <button
            onClick={() => openModalForAdd(Widthdraw)}
            className="btn-secondary bg-red-500 dark:bg-red-700"
            type="button">
            <ArrowUpRight className='w-3 h-3' />
            Widthdraw
          </button>

          {isModalOpen != null &&
            <TransactionModal
              clients={clients}
              cards={cards}
              banks={banks}
              transactionToEdit={transactionToEdit}
              isOpen={isModalOpen != null}
              onClose={onCloseAmountManagementModal}
              onSave={handleSaveTransaction}
              transactionType={isModalOpen}
            />
          }
        </SectionHeaderRight>
      </SectionHeader>
      <div className='w-full flex items-baseline justify-end gap-2'>
        <div className="form-search m-0 p-0">
          <label htmlFor="topbar-search" className="form-search-label">Search</label>
          <div className="form-search-wrapper">
            <input type="text" name="email" id="topbar-search"
              className="form-search-input ps-3"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search" />
          </div>
        </div>
        <button
          onClick={() => handleOnSearch(searchInput)}
          className="btn-secondary-outline p-3"
          type="button">
          <Search className='w-3 h-3' />
          Search
        </button>
        <div className="relative inline-block">
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="btn-secondary-outline p-3 flex items-center gap-2"
            type="button"
          >
            <FilterIcon className="w-3 h-3" />
            Filter
          </button>
          {totalFilterCount > 0 &&
            (
              <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {totalFilterCount}
              </span>
            )
          }
        </div>

        {/* <button
          onClick={() => setIsFilterModalOpen(true)}
          className="btn-secondary-outline p-3"
          type="button">
          <Filter className='w-3 h-3' />
          Filter
        </button> */}
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          filterColumns={filterColumns}
          initialFilters={appliedFilters}
          onApplyFilters={handleApplyFilters}
        />
      </div>
      <SectionContent>
        <div className="container mx-auto">
          <CustomTable
            currentPage={currentPage}
            totalRows={sortedData.length}
            onPageChange={setCurrentPage}
            rowsPerPage={rowsPerPage}
          >
            {/* Table Header */}
            <TableHeader>
              {renderTableHeaders(columns)}
            </TableHeader>

            {/* Table Body */}
            <TableBody>
              {renderTableRows(currentRows)}
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
