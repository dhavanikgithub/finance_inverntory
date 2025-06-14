'use client'
import React, { useEffect, useState } from 'react';
import Dashboard from '@/components/Dashboard';
import { SectionHeader, SectionHeaderLeft, SectionHeaderRight, Heading, SubHeading, SectionContent } from '@/components/Section';
import { useDispatch, useSelector } from 'react-redux';
import { addNewClient, deleteClientData, fetchClients, updateClientData } from '@/store/actions/clientActions';
import CustomTable, { TableBody, TableData, TableHeader, TableHeaderItem, TableRow } from '@/components/Table';
import { SquarePen, Trash, UserRound } from 'lucide-react';
import ClientManagementModal from '@/components/ClientManagementModal';
import { formatDate, formatTime } from '@/utils/helper';
import MoreOptionsMenu from '@/components/MoreOptionsMenu';
import DeactivateAccountModal from '@/components/DeactivateAccountModal';
import { showToastError, showToastSuccess } from '@/utils/toast';
import { AppDispatch, RootState } from '@/store/store';
import { Action } from '@/app/model/Action';
import { Client } from '@/app/model/Client';

export interface SortConfig {
    key: string;
    direction: string
}
export default function ClientScreen() {

    const dispatch: AppDispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [clientToEdit, setClientToEdit] = useState<null | Client>(null);
    const clients = useSelector((state: RootState) => state.client.clients);
    const loading = useSelector((state: RootState) => state.client.loading);
    const [sortedData, setSortedData] = useState<Client[]>([]);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "name", direction: "asc" });
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [currentRows, setCurrentRows] = useState<Client[]>([]);
    const rowsPerPage = 10;
    const [isDeleteRecordDialogOpen, setIsDeleteRecordDialogOpen] = useState<null | Client>(null);

    const openDeleteRecordDialog = (data:Client) => {
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

    // Sorting Function
    const sortData = (key: keyof Client) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }

        const sorted = [...clients].sort((a, b) => {
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
    }, [currentPage, sortedData, clients])

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
        setSortedData(clients);
    }, [clients])

    const openModalForEdit = (client:Client) => {
        setClientToEdit(client);
        setIsModalOpen(true);
    };

    const openModalForAdd = () => {
        setClientToEdit(null); // Clear clientToEdit for adding new
        setIsModalOpen(true);
    };


    const handleSaveClient = (clientData:Client) => {
        if (clientToEdit) {
            // Update existing client
            dispatch(updateClientData(clientData))
        } else {
            // Add new client
            dispatch(addNewClient(clientData))
        }
    };

    const handleDeleteClient = (clientData:Client) => {
        dispatch(deleteClientData(clientData.id!))
    }


    const columns = [
        {
            Header: "Name",
            accessor: "name",
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

    const actions:Action[] = [
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

    function renderTableHeaders(columns:Column[]) {
        return (
            <>
                {columns.map((column) => (
                    <TableHeaderItem key={column.accessor} onClick={() => sortData(column.accessor as keyof Client)}>
                        {column.Header} <span>{getSortIcon(column.accessor, column?.sorting)}</span>
                    </TableHeaderItem>
                ))}
            </>
        )
    }

    function renderTableRows(currentRows:Client[], columns:Column[]) {

        const renderTableData = (row:Client) => {
            return (
                <>
                    <TableData>
                        {row.name}
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
                        onClose={closeDeleteRecordDialog}
                        onDelete={handleDeleteClient}
                    />

                </div>
            </SectionContent>

        </Dashboard>
    );
}
