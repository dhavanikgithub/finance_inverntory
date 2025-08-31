'use client'
import React, { useEffect, useState } from 'react';
import Dashboard from '@/components/Dashboard/Dashboard';
import { SectionHeader, SectionHeaderLeft, SectionHeaderRight, Heading, SubHeading, SectionContent } from '@/components/Section';
import { useDispatch, useSelector } from 'react-redux';
import { addClient, deleteClient, fetchClients, updateClient } from '@/store/actions/clientActions';
import CustomTable, { TableBody, TableData, TableHeader, TableHeaderItem, TableRow } from '@/components/Table';
import { Pencil, Search, Trash2, UserRound } from 'lucide-react';
import ClientManagementModal from '@/components/ClientManagementModal';
import { baseFuseOptions, formatDate, formatTime } from '@/utils/helper';
import DeactivateAccountModal from '@/components/DeactivateAccountModal';
import { AppDispatch, RootState } from '@/store/store';
import { Client } from '@/app/model/Client';
import ViewMore from '@/components/ViewMore';
import ActionMenu from '@/components/ActionMenu';
import SearchBox from '@/components/SearchBox';
import Fuse from 'fuse.js';
import DataProcessor, { SearchColumn } from '@/utils/DataProcessor';
import { SortConfig } from '@/types/SortConfig';
import { useRouter } from 'next/navigation';


export default function ClientScreen() {
    const router = useRouter();
    // Redux hooks
    const dispatch: AppDispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [clientToEdit, setClientToEdit] = useState<null | Client>(null);
    const clients = useSelector((state: RootState) => state.client.clients);
    const loading = useSelector((state: RootState) => state.client.loading);
    const [sortedData, setSortedData] = useState<Client[]>([]);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "name", direction: "asc" });
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [currentRows, setCurrentRows] = useState<Client[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [isDeleteRecordDialogOpen, setIsDeleteRecordDialogOpen] = useState<null | Client>(null);
    const [searchInput, setSearchInput] = useState<string>("");
    const columnsToShowWhileDeleteRecord = [
        { label: 'Client', accessor: 'name' },
        { label: 'Transactions', accessor: 'transaction_count' },
        { label: 'Email', accessor: 'email' },
        { label: 'Contact', accessor: 'contact' },
        { label: 'Created On', accessor: 'create_date' }
    ]
    

    const openDeleteRecordDialog = (data: Client) => {
        setIsDeleteRecordDialogOpen(data);
    };

    const closeDeleteRecordDialog = () => {
        setIsDeleteRecordDialogOpen(null);
    };

    // Define the type for a column object
    interface Column {
        Header: string;
        accessor: keyof Client | string; // Change this from string to keyof Transaction
        type?: string;        // Optional property for custom column types (like "action")
        sorting?: boolean;    // Optional property for sorting control
    }

    const sortDataToggle = (key: keyof Client, direction = "asc") => {
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
        sortData(key, direction);
    };

    // Sorting Function
    const sortData = (key: keyof Client, direction = "asc") => {
        if (!clients || clients.length === 0) {
            setSortedData([]);
            return;
        }
        console.log("Sorting data by key:", key, "in direction:", direction);
        console.log("Current clients data:", clients);

        const sorted = [...clients].sort((a, b) => {
            const aVal = String(a[key] || '').toLowerCase();
            const bVal = String(b[key] || '').toLowerCase();

            if (aVal < bVal) return direction === "asc" ? -1 : 1;
            if (aVal > bVal) return direction === "asc" ? 1 : -1;
            return 0;
        });

        setSortedData(sorted);
    };

    useEffect(() => {
        const indexOfLastRow = currentPage * rowsPerPage;
        const indexOfFirstRow = indexOfLastRow - rowsPerPage;
        setCurrentRows(sortedData.slice(indexOfFirstRow, indexOfLastRow));
    }, [currentPage, sortedData, clients, rowsPerPage])

    const getSortIcon = (columnKey: string, sorting = true) => {
        if (sorting && sortConfig.key === columnKey) {
            return sortConfig.direction === "asc" ? "↑" : "↓";
        }
        return "";
    };

    useEffect(() => {
        dispatch(fetchClients());
    }, [dispatch]);

    useEffect(() => {
        sortData(sortConfig.key as keyof Client, sortConfig.direction);
    }, [clients])

    const openModalForEdit = (client: Client) => {
        setClientToEdit(client);
        setIsModalOpen(true);
    };

    const openModalForAdd = () => {
        setClientToEdit(null); // Clear clientToEdit for adding new
        setIsModalOpen(true);
    };


    const handleSaveClient = (clientData: Client) => {
        if (clientToEdit) {
            // Update existing client
            dispatch(updateClient(clientData));
        } else {
            // Add new client
            dispatch(addClient(clientData));
        }

    };

    const handleDeleteClient = (clientData: Client) => {
        dispatch(deleteClient(clientData.id!));
    }


    const columns = [
        {
            Header: "Name",
            accessor: "name",
            type: "string"
        },
        {
            Header: "Transactions",
            accessor: "transaction_count",
            type: "number"
        },
        {
            Header: "Email",
            accessor: "email",
            type: "string"
        },
        {
            Header: "Contact",
            accessor: "contact",
            type: "string"
        },
        {
            Header: "Address",
            accessor: "address",
            type: "string"
        },
        {
            Header: "Date",
            accessor: "create_date"
        },
        {
            Header: "Action",
            accessor: "action",
            type: "action",
            sorting: false,
        },

    ];

    function gotoClientTransactionPage(client: Client) {
        router.push(`/client/${client.name}/transaction`);
    }

    function renderTableHeaders(columns: Column[]) {
        return (
            <>
                {columns.map((column) => (
                    <TableHeaderItem key={column.accessor} onClick={() => sortDataToggle(column.accessor as keyof Client)}>
                        {column.Header} <span>{getSortIcon(column.accessor, column?.sorting)}</span>
                    </TableHeaderItem>
                ))}
            </>
        )
    }

    function renderTableRows(currentRows: Client[], columns: Column[]) {

        const renderTableData = (row: Client) => {
            return (
                <>
                    <TableData onClick={() => gotoClientTransactionPage(row)} className='cursor-pointer hover:underline text-blue-600 dark:text-blue-400'>
                        {row.name}
                    </TableData>
                    <TableData onClick={() => gotoClientTransactionPage(row)} className='cursor-pointer hover:underline text-blue-600 dark:text-blue-400'>
                        {row.transaction_count || 0}
                    </TableData>
                    <TableData>
                        {row.email || ''}
                    </TableData>
                    <TableData>
                        {row.contact || ''}
                    </TableData>
                    <TableData>
                        <ViewMore title={"Address"} text={row.address || ''} charLimit={20} />
                    </TableData>
                    <TableData>
                        <span className='text-sm'>
                            <span className=''>{formatDate(row.create_date!)}</span><br />
                            <span className='text-gray-500'>{formatTime(row.create_time!)}</span>
                        </span>
                    </TableData>
                    <TableData>
                        <ActionMenu<Client> items={menuItems} data={row} />
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
    const searchColumn: SearchColumn[] = [
        {
            name: "name"
        },
        {
            name: "email"
        },
        {
            name: "contact"
        },
        {
            name: "address"
        },
    ];


    const handleOnSearch = (searchText: string) => {
        setCurrentPage(1);
        const dataProcessor = new DataProcessor<Client>(clients, searchColumn);
        dataProcessor.applySearch(searchText);
        setSortedData(dataProcessor.getData());
    }


    function onRowsPerPageChange(newRowsPerPage: number) {
        setCurrentPage(1); // Reset to first page when rows per page changes
        setRowsPerPage(newRowsPerPage);
    };

    return (
        <Dashboard>
            <SectionHeader>

                <SectionHeaderLeft>
                    <Heading>Clients</Heading>
                    <SubHeading>
                        Manage, review, add, update, or delete client records and their transactions.
                    </SubHeading>
                </SectionHeaderLeft>
                <SectionHeaderRight>
                    {/* <button
                        className="rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all hover:opacity-75 focus:ring focus:ring-slate-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        type="button">
                        Report
                    </button> */}
                    <button
                        onClick={openModalForAdd}
                        className="btn-secondary"
                        type="button">
                        <UserRound className='w-3 h-3' />
                        Add Client
                    </button>
                    {/* Client Management Modal */}
                    <ClientManagementModal
                        isOpen={isModalOpen}
                        clientToEdit={clientToEdit}
                        onClose={() => setIsModalOpen(false)}
                        onSave={handleSaveClient}
                    />

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
                            {renderTableRows(currentRows, columns)}
                        </TableBody>
                    </CustomTable>
                    <DeactivateAccountModal
                        title={"Delete Client"}
                        description={
                            "You are about to delete this client and all their associated transactions. " +
                            "This action cannot be undone. All records related to this client, including their transactions, will be permanently removed from the system."
                        }
                        positiveButtonText={"Delete Client"}
                        negativeButtonText={"Cancel"}
                        isOpen={isDeleteRecordDialogOpen}
                        columns={columnsToShowWhileDeleteRecord}
                        onClose={closeDeleteRecordDialog}
                        onDelete={handleDeleteClient}
                    />

                </div>
            </SectionContent>

        </Dashboard>
    );
}
