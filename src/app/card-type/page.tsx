'use client'
import React, { useEffect, useState } from 'react';
import Dashboard from '@/components/Dashboard';
import { SectionHeader, SectionHeaderLeft, SectionHeaderRight, Heading, SubHeading, SectionContent } from '@/components/Section';
import { useDispatch, useSelector } from 'react-redux';
import { addNewCardType, deleteCardTypeData, fetchCardTypes, updateCardTypeData } from '@/store/actions/cardTypeActions';
import CustomTable, { TableBody, TableData, TableHeader, TableHeaderItem, TableRow } from '@/components/Table';
import { SquarePen, Trash, CreditCard } from 'lucide-react';
import CardTypeManagementModal from '@/components/CardTypeManagementModal';
import { formatDate, formatTime } from '@/utils/helper';
import MoreOptionsMenu from '@/components/MoreOptionsMenu';
import DeactivateAccountModal from '@/components/DeactivateAccountModal';
import { showToastError, showToastSuccess } from '@/utils/toast';
import { AppDispatch, RootState } from '@/store/store';
import { Action } from '@/app/model/Action';
import { CardType } from '@/app/model/CardType';

export interface SortConfig {
    key: string;
    direction: string
}

export default function CardTypeScreen() {
    const dispatch: AppDispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [cardTypeToEdit, setCardTypeToEdit] = useState<null | CardType>(null);
    const cardTypes = useSelector((state: RootState) => state.cardType.cardTypes);
    const loading = useSelector((state: RootState) => state.cardType.loading);
    const [sortedData, setSortedData] = useState<CardType[]>([]);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "", direction: "asc" });
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [currentRows, setCurrentRows] = useState<CardType[]>([]);
    const rowsPerPage = 10;
    const [isDeleteRecordDialogOpen, setIsDeleteRecordDialogOpen] = useState<null | CardType>(null);

    const openDeleteRecordDialog = (data: CardType) => {
        setIsDeleteRecordDialogOpen(data);
    };

    const closeDeleteRecordDialog = () => {
        setIsDeleteRecordDialogOpen(null);
    };

    interface Column {
        Header: string;
        accessor: keyof CardType | string;
        type?: string;
        sorting?: boolean;
    }

    const sortData = (key: keyof CardType) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }

        const sorted = [...cardTypes].sort((a, b) => {
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
    }, [currentPage, sortedData, cardTypes])

    const getSortIcon = (columnKey: string, sorting = true) => {
        if (sorting && sortConfig.key === columnKey) {
            return sortConfig.direction === "asc" ? "↑" : "↓";
        }
        return "";
    };

    useEffect(() => {
        dispatch(fetchCardTypes());
    }, [dispatch]);

    useEffect(() => {
        setSortedData(cardTypes);
    }, [cardTypes])

    const openModalForEdit = (cardType: CardType) => {
        setCardTypeToEdit(cardType);
        setIsModalOpen(true);
    };

    const openModalForAdd = () => {
        setCardTypeToEdit(null);
        setIsModalOpen(true);
    };

    const handleSaveCardType = (cardTypeData: CardType) => {
        if (cardTypeToEdit) {
            dispatch(updateCardTypeData(cardTypeData))
                .then(() => showToastSuccess('Card Type Updated', 'The card type was updated successfully.'))
                .catch((error) => showToastError('Error Updating Card Type', `Something went wrong: ${error.message}`));
        } else {
            dispatch(addNewCardType(cardTypeData))
                .then(() => showToastSuccess('Card Type Added', 'The new card type has been added successfully.'))
                .catch((error) => showToastError('Error Adding Card Type', `Something went wrong: ${error.message}`));
        }
    };

    const handleDeleteCardType = (cardTypeData: CardType) => {
        dispatch(deleteCardTypeData(cardTypeData.id!))
            .then(() => showToastSuccess('Card Type Deleted', 'The card type was deleted successfully.'))
            .catch((error) => showToastError('Error Deleting Card Type', `Something went wrong: ${error.message}`));
    }

    const columns: Column[] = [
        {
            Header: "ID",
            accessor: "id",
            type: "string"
        },
        {
            Header: "Name",
            accessor: "name",
            type: "string"
        },
        {
            Header: "Created On",
            accessor: "create_date"
        },
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

    function renderTableHeaders(columns: Column[]) {
        return (
            <>
                {columns.map((column) => (
                    <TableHeaderItem 
                        key={column.accessor} 
                        onClick={() => column.sorting !== false && sortData(column.accessor as keyof CardType)}
                    >
                        {column.Header} 
                        {column.sorting !== false && <span>{getSortIcon(column.accessor)}</span>}
                    </TableHeaderItem>
                ))}
            </>
        )
    }

    function renderTableRows(currentRows: CardType[], columns: Column[]) {
        const renderTableData = (row: CardType) => {
            return (
                <>
                    <TableData>{row.id}</TableData>
                    <TableData>{row.name}</TableData>
                    <TableData>
                        <span className='text-sm'>
                            <span>{formatDate(row.create_date!.toString())}</span><br />
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
                    <Heading>Card Types</Heading>
                    <SubHeading>
                        Manage all payment card types in the system
                    </SubHeading>
                </SectionHeaderLeft>
                <SectionHeaderRight>
                    <button
                        onClick={openModalForAdd}
                        className="btn-secondary"
                        type="button"
                    >
                        <CreditCard className='w-3 h-3' />
                        Add Card Type
                    </button>
                    
                    <CardTypeManagementModal
                        isOpen={isModalOpen}
                        cardTypeToEdit={cardTypeToEdit}
                        onClose={() => setIsModalOpen(false)}
                        onSave={handleSaveCardType}
                    />
                </SectionHeaderRight>
            </SectionHeader>
            
            <SectionContent>
                <div className="container mx-auto">
                    <CustomTable
                        currentPage={currentPage}
                        totalRows={cardTypes.length}
                        onPageChange={setCurrentPage}
                        rowsPerPage={rowsPerPage}
                    >
                        <TableHeader>
                            {renderTableHeaders(columns)}
                        </TableHeader>

                        <TableBody>
                            {renderTableRows(currentRows, columns)}
                        </TableBody>
                    </CustomTable>

                    <DeactivateAccountModal
                        title={"Delete Card Type"}
                        description={
                            "You are about to delete this card type. " +
                            "This action cannot be undone. All records associated with this card type will be updated."
                        }
                        positiveButtonText={"Delete Card Type"}
                        negativeButtonText={"Cancel"}
                        isOpen={isDeleteRecordDialogOpen}
                        onClose={closeDeleteRecordDialog}
                        onDelete={handleDeleteCardType}
                    />
                </div>
            </SectionContent>
        </Dashboard>
    );
}