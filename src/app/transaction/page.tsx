'use client'
import { useEffect, useMemo, useRef, useState } from 'react';
import TransactionModal from '../../components/TransactionModal';
import { ArrowDownLeft, ArrowUpRight, File, Filter as FilterIcon, Pencil, Search, Trash2, User2 } from "lucide-react";
import Dashboard from '@/components/Dashboard/Dashboard';
import { SectionHeader, SectionHeaderLeft, SectionHeaderRight, SectionContent, Heading, SubHeading } from '@/components/Section';
import CustomTable, { TableBody, TableData, TableHeader, TableHeaderItem, TableRow } from '@/components/Table';
import { useDispatch, useSelector } from 'react-redux';
import { addTransaction, deleteTransaction, fetchTransactions, updateTransaction } from '@/store/actions/transactionActions';
import { baseFuseOptions, formatAmount, formatDate, formatTime, getMonthName, getMonthNumberFromDate, getTransactionTypeStr, isTransactionTypeDeposit, isTransactionTypeWidthdraw } from '@/utils/helper';
import { fetchClients } from '@/store/actions/clientActions';
import GenerateReportModal from '@/components/GenerateReportModal';
import DeactivateAccountModal from '@/components/DeactivateAccountModal';
import { AppDispatch, RootState } from '@/store/store';
import Fuse from 'fuse.js';
import Transaction, { Deposit, TransactionType, Widthdraw } from '../model/Transaction';
import FilterModal, { FilterData, FilterType, getTotalFilterCount } from '@/components/FilterModal';
import DataProcessor, { SearchColumn } from '@/utils/DataProcessor';
import { fetchBanks } from '@/store/actions/bankActions';
import { fetchCards } from '@/store/actions/cardActions';
import ViewMore from '@/components/ViewMore';
import SearchBox from '@/components/SearchBox';
import ActionMenu from '@/components/ActionMenu';
import InfoModalWrapper from '@/components/InfoModal/InfoModalWrapper';
import ContextMenuWrapper from '@/components/ContextMenu/ContextMenuWrapper';
import { ContextMenuHandle, ContextMenuItem } from '@/components/ContextMenu/types';
import { InfoModalRef } from '@/components/InfoModal/types';
import { Client } from '../model/Client';
import { SortConfig } from '@/types/SortConfig';


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
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [isGenerateReportModalOpen, setIsGenerateReportModalOpen] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [isDeleteRecordDialogOpen, setIsDeleteRecordDialogOpen] = useState<null | Transaction>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterType[]>([]);
  const [filterColumns, setFilterColumns] = useState<FilterType[]>([]);
  const userInfoModalRef = useRef<InfoModalRef>(null);
  const contextMenuRef = useRef<ContextMenuHandle>(null);

  const contextItems: ContextMenuItem[] = [
    {
      label: "User Info",
      icon: User2,
      onClick: (data) => {
        handleClientNameClick(data.client.id)
      }
    },
    {
      label: "Edit",
      icon: Pencil,
      onClick: (data) => {
        openModalForEdit(data.transaction)
      }
    },
    {
      label: "Delete",
      icon: Trash2,
      onClick: (data) => {
        openDeleteRecordDialog(data.transaction)
      }
    }
  ];

  const handleRightClick = (e: React.MouseEvent, transaction: Transaction) => {
    e.preventDefault();
    const client = clients.find(c => c.id === transaction.client_id);
    contextMenuRef.current?.show(e, { transaction: { ...transaction }, client: { ...client } });
  };

  const openDeleteRecordDialog = (data: Transaction) => {
    setIsDeleteRecordDialogOpen(data);
  };

  const closeDeleteRecordDialog = () => {
    setIsDeleteRecordDialogOpen(null);
  };

  const sortDataToggle = (key: keyof Transaction, direction = "asc") => {
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    sortData(key, direction);
    setSortConfig({ key, direction });
  };

  // Sorting Function
  const sortData = (key: keyof Transaction, direction = "asc") => {
    if (!transactions || transactions.length === 0) {
      setSortedData([]);
      return;
    }
    const sorted = [...transactions].sort((a, b) => {
      const aVal = String(a[key] || '').toLowerCase();
      const bVal = String(b[key] || '').toLowerCase();

      if (aVal < bVal) return direction === "asc" ? -1 : 1;
      if (aVal > bVal) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setSortedData(sorted);

  };

  const columnsToShowWhileDeleteRecord = [
    { label: 'Client', accessor: 'client_name' },
    { label: 'Transaction Type', accessor: 'transaction_type' },
    { label: 'Amount', accessor: 'transaction_amount' },
    { label: 'Charges', accessor: 'widthdraw_charges' },
    { label: 'Bank', accessor: 'bank_name' },
    { label: 'Card', accessor: 'card_name' },
    { label: 'Create Date', accessor: 'create_date' },
    { label: 'Create Time', accessor: 'create_time' },
  ]

  const columnsToClientInfoRecord = [
    { label: 'Client', accessor: 'name' },
    { label: 'Transactions', accessor: 'transaction_count' },
    { label: 'Email', accessor: 'email' },
    { label: 'Contact', accessor: 'contact' },
    { label: 'Created On', accessor: 'create_date' }
  ]

  const handleClientNameClick = (clientId: number) => {
    const client = clients.find((c) => c.id === clientId);
    if (client) {
      userInfoModalRef.current?.open(client, columnsToClientInfoRecord, `Client Info: ${client.name}`);
    } else {
      console.warn(`Client not found: ${clientId}`);
    }
  };


  useEffect(() => {
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    setCurrentRows(sortedData.slice(indexOfFirstRow, indexOfLastRow));
  }, [currentPage, sortedData, transactions, rowsPerPage])

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
    sortData(sortConfig.key as keyof Transaction, sortConfig.direction);
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
      dispatch(updateTransaction(transactionData));

      setTransactionToEdit(null);
    } else {
      // Add new Transaction
      dispatch(addTransaction(transactionData));
    }
  };

  const handleDeleteTransaction = (transactionData: Transaction) => {
    if (transactionData?.id) {
      dispatch(deleteTransaction(transactionData.id));
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


  const openGenerateReport = () => {
    setIsGenerateReportModalOpen(true)
  }


  function renderTableHeaders(columns: Column[]) {
    return (
      <>
        {columns.map((column) => (
          <TableHeaderItem key={column.accessor} onClick={() => {
            if (column.sorting != false) {
              sortDataToggle(column.accessor as keyof Transaction)
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

          <TableData className={"cursor-pointer hover:underline text-blue-600 dark:text-blue-400"} onClick={() => handleClientNameClick(row.client_id)}>
            {row.client_name}
          </TableData>

          <TableData>
            {isTransactionTypeDeposit(row.transaction_type) ?
              <div
                className="grid items-center px-2 py-1 font-sans text-xs font-bold text-green-900 uppercase rounded-md select-none whitespace-nowrap bg-green-500/20
                dark:bg-green-900 dark:text-green-300 dark:bg-opacity-25
                ">
                <span className="">Deposit</span>
              </div>
              :
              <div
                className="grid items-center px-2 py-1 font-sans text-xs font-bold text-red-900 uppercase rounded-md select-none whitespace-nowrap bg-red-500/20
                dark:bg-red-900 dark:text-red-300 dark:bg-opacity-25
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
            <ViewMore title={"Remark"} text={row.remark} charLimit={20} />
          </TableData>

          <TableData>
            <ActionMenu<Transaction> items={menuItems} data={row} />
          </TableData>
        </>
      )
    }
    return (
      <>
        {currentRows.map((row, rowIndex) => (
          <TableRow key={rowIndex} onContextMenu={(e) => handleRightClick(e, row)}>
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
  const searchColumn: SearchColumn[] = [
    {
      name: "client_name"
    },
    {
      name: "remark"
    },
    {
      name: "bank_name"
    },
    {
      name: "card_name"
    }
  ]

  const handleOnSearch = (searchText: string) => {
    setCurrentPage(1);
    const dataProcessor = new DataProcessor<Transaction>(transactions, searchColumn);
    dataProcessor.applySearch(searchText);
    setSortedData(dataProcessor.getData());
  }

  const handleApplyFilters = (filters: FilterType[]) => {
    setAppliedFilters(filters);
  };

  useEffect(() => {
    const dataProcessor = new DataProcessor(transactions, [])
    dataProcessor.applyFilter(appliedFilters)
    setSortedData(dataProcessor.getData())
  }, [appliedFilters])

  const clientNameFilter = useMemo((): FilterType => {
    const distinctClientNames: FilterData[] = Array.from(
      new Set(transactions.map(t => t.client_name).sort((a, b) => a.localeCompare(b))) //sort client name by acending
    ).map(clientName => {
      return {
        label: clientName,
        value: clientName,
      }
    });

    return {
      columnName: "Client Name",
      columnAccessor: "client_name",
      filterOperator: 'string',
      dataOperator: 'string',
      data: distinctClientNames,
    }
  }, [transactions]);

  const dateYearFilter = useMemo((): FilterType => {
    const distinctYears: FilterData[] = Array.from(
      new Set(
        transactions
          .filter(t => t.create_date)
          .map(t => new Date(t.create_date!).getFullYear().toString())
          .sort((a, b) => parseInt(b) - parseInt(a)) // Sort in descending order
      )
    ).map(yearStr => {
      return {
        label: yearStr,
        value: yearStr,
      };
    });

    return {
      columnName: "Transaction Year",
      columnAccessor: "create_date",
      filterOperator: 'year',
      dataOperator: 'date',
      data: distinctYears,
    };
  }, [transactions]);

  const dateMonthFilter = useMemo((): FilterType => {
    const distinctMonths: FilterData[] = Array.from(
      new Set(
        transactions
          .filter(t => t.create_date)
          .map(t => getMonthNumberFromDate(t.create_date!).toString()) // returns "YYYY-MM"
          .sort((a, b) => parseInt(a) - parseInt(b)) // Sort in ascending order
      )
    ).map(monthStr => {
      const label = `${getMonthName(parseInt(monthStr))} (${monthStr})`;
      return {
        label,
        value: monthStr,
      };
    });

    return {
      columnName: "Transaction Month",
      columnAccessor: "create_date",
      filterOperator: 'month',
      dataOperator: 'date',
      data: distinctMonths,
    };
  }, [transactions]);

  const dateDayFilter = useMemo((): FilterType => {
    const distinctDays: FilterData[] = Array.from(
      new Set(
        transactions
          .filter(t => t.create_date)
          .map(t => new Date(t.create_date!).getDate().toString()) // assumes ISO string: "YYYY-MM-DDTHH:mm:ss"
          .sort((a, b) => parseInt(a) - parseInt(b)) // Sort in ascending order
      )
    ).map(dayStr => {
      return {
        label: `Day ${dayStr}`,
        value: dayStr,
      }
    });

    return {
      columnName: "Transaction Day",
      columnAccessor: "create_date",
      filterOperator: 'day',
      dataOperator: 'date',
      data: distinctDays,
    };
  }, [transactions]);


  const transactionTypeFilter = useMemo((): FilterType => {
    const distinctTransactionType: FilterData[] = [
      {
        label: getTransactionTypeStr(0),
        value: getTransactionTypeStr(0),
      },
      {
        label: getTransactionTypeStr(1),
        value: getTransactionTypeStr(1),
      }
    ];

    return {
      columnName: "Transaction Type",
      columnAccessor: "transaction_type",
      filterOperator: 'transaction_type_string',
      dataOperator: 'transaction_type_number',
      data: distinctTransactionType,
    };
  }, [transactions]);



  useEffect(() => {
    setFilterColumns([
      transactionTypeFilter,
      clientNameFilter,
      dateYearFilter,
      dateMonthFilter,
      dateDayFilter
    ])
  }, [transactions])


  const totalFilterCount = useMemo(() => {
    return getTotalFilterCount(appliedFilters)
  }, [appliedFilters])

  const menuItems = [
    {
      label: 'Edit',
      icon: Pencil,
      onClick: openModalForEdit,
    },
    {
      label: 'Delete',
      icon: Trash2,
      onClick: openDeleteRecordDialog,
    },
  ];


  function onRowsPerPageChange(newRowsPerPage: number) {
    setCurrentPage(1); // Reset to first page when rows per page changes
    setRowsPerPage(newRowsPerPage);
  };

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
              isSelectedClient={false}
            />
          }
        </SectionHeaderRight>
      </SectionHeader>
      <div className='w-full flex items-baseline justify-end gap-2'>

        <SearchBox handleOnSearch={handleOnSearch} searchInput={searchInput} setSearchInput={setSearchInput} />
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
            onRowsPerPageChange={onRowsPerPageChange}
          >
            {/* Table Header */}
            <TableHeader>
              {renderTableHeaders(columns)}
            </TableHeader>

            {/* Table Body */}
            <TableBody>
              {loading || currentRows.length === 0 ?
                (
                  <TableRow>
                    <TableData colSpan={9} isLoading={loading} noData={transactions.length === 0}>
                      {""}
                    </TableData>
                  </TableRow>
                )
                : renderTableRows(currentRows)
              }
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
            columns={columnsToShowWhileDeleteRecord}
            onClose={closeDeleteRecordDialog}
            onDelete={handleDeleteTransaction}
          />
          <InfoModalWrapper ref={userInfoModalRef} />
          <ContextMenuWrapper ref={contextMenuRef} items={contextItems} />
          <GenerateReportModal clients={clients} isOpen={isGenerateReportModalOpen} onClose={() => setIsGenerateReportModalOpen(false)} />
        </div>

      </SectionContent>
    </Dashboard>
  );
}
