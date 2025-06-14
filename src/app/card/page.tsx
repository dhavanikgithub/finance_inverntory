'use client'
import React, { useEffect, useState } from 'react';
import Dashboard from '@/components/Dashboard';
import { SectionHeader, SectionHeaderLeft, SectionHeaderRight, Heading, SubHeading, SectionContent } from '@/components/Section';
import { useDispatch, useSelector } from 'react-redux';
import { addNewCard, deleteCardData, fetchCards, updateCardData } from '@/store/actions/cardActions';
import CustomTable, { TableBody, TableData, TableHeader, TableHeaderItem, TableRow } from '@/components/Table';
import { SquarePen, Trash, CreditCard } from 'lucide-react';
import CardManagementModal from '@/components/CardManagementModal';
import { formatDate, formatTime } from '@/utils/helper';
import MoreOptionsMenu from '@/components/MoreOptionsMenu';
import DeactivateAccountModal from '@/components/DeactivateAccountModal';
import { showToastError, showToastSuccess } from '@/utils/toast';
import { AppDispatch, RootState } from '@/store/store';
import { Action } from '@/app/model/Action';
import { Card } from '@/app/model/Card';

export interface SortConfig {
    key: string;
    direction: string
}

export default function CardTypeScreen() {
    const dispatch: AppDispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [cardToEdit, setCardToEdit] = useState<null | Card>(null);
    const cards = useSelector((state: RootState) => state.card.cards);
    const [sortedData, setSortedData] = useState<Card[]>([]);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "name", direction: "asc" });
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [currentRows, setCurrentRows] = useState<Card[]>([]);
    const rowsPerPage = 10;
    const [isDeleteRecordDialogOpen, setIsDeleteRecordDialogOpen] = useState<null | Card>(null);

    const openDeleteRecordDialog = (data: Card) => {
        setIsDeleteRecordDialogOpen(data);
    };

    const closeDeleteRecordDialog = () => {
        setIsDeleteRecordDialogOpen(null);
    };

    interface Column {
        Header: string;
        accessor: keyof Card | string;
        type?: string;
        sorting?: boolean;
    }

    const sortData = (key: keyof Card) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }

        const sorted = [...cards].sort((a, b) => {
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
    }, [currentPage, sortedData, cards])

    const getSortIcon = (columnKey: string, sorting = true) => {
        if (sorting && sortConfig.key === columnKey) {
            return sortConfig.direction === "asc" ? "↑" : "↓";
        }
        return "";
    };

    useEffect(() => {
        dispatch(fetchCards());
    }, [dispatch]);

    useEffect(() => {
        setSortedData(cards);
    }, [cards])

    const openModalForEdit = (cardType: Card) => {
        setCardToEdit(cardType);
        setIsModalOpen(true);
    };

    const openModalForAdd = () => {
        setCardToEdit(null);
        setIsModalOpen(true);
    };

    const handleSaveCard = (cardTypeData: Card) => {
        if (cardToEdit) {
            dispatch(updateCardData(cardTypeData))
        } else {
            
            dispatch(addNewCard(cardTypeData))
        }
    };

    const handleDeleteCardType = (cardTypeData: Card) => {
        dispatch(deleteCardData(cardTypeData.id!))
            .then(() => {
                closeDeleteRecordDialog();
            })
    }

    const columns: Column[] = [
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
                        onClick={() => column.sorting !== false && sortData(column.accessor as keyof Card)}
                    >
                        {column.Header} 
                        {column.sorting !== false && <span>{getSortIcon(column.accessor)}</span>}
                    </TableHeaderItem>
                ))}
            </>
        )
    }

    function renderTableRows(currentRows: Card[], columns: Column[]) {
        const renderTableData = (row: Card) => {
            return (
                <>
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
                    <Heading>Card</Heading>
                    <SubHeading>
                        Manage all payment card in the system
                    </SubHeading>
                </SectionHeaderLeft>
                <SectionHeaderRight>
                    <button
                        onClick={openModalForAdd}
                        className="btn-secondary"
                        type="button"
                    >
                        <CreditCard className='w-3 h-3' />
                        Add Card
                    </button>
                    
                    <CardManagementModal
                        isOpen={isModalOpen}
                        cardToEdit={cardToEdit}
                        onClose={() => setIsModalOpen(false)}
                        onSave={handleSaveCard}
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
                        <TableHeader>
                            {renderTableHeaders(columns)}
                        </TableHeader>

                        <TableBody>
                            {renderTableRows(currentRows, columns)}
                        </TableBody>
                    </CustomTable>

                    <DeactivateAccountModal
                        title={"Delete Card"}
                        description={
                            "You are about to delete this card. " +
                            "This action cannot be undone. All records associated with this card will be updated."
                        }
                        positiveButtonText={"Delete Card"}
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