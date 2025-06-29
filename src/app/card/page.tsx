'use client'
import React, { useEffect, useState } from 'react';
import Dashboard from '@/components/Dashboard';
import { SectionHeader, SectionHeaderLeft, SectionHeaderRight, Heading, SubHeading, SectionContent } from '@/components/Section';
import { useDispatch, useSelector } from 'react-redux';
import { addNewCard, deleteCardData, fetchCards, updateCardData } from '@/store/actions/cardActions';
import CustomTable, { TableBody, TableData, TableHeader, TableHeaderItem, TableRow } from '@/components/Table';
import { CreditCard, Pencil, Trash2 } from 'lucide-react';
import CardManagementModal from '@/components/CardManagementModal';
import { formatDate, formatTime } from '@/utils/helper';
import DeactivateAccountModal from '@/components/DeactivateAccountModal';
import { AppDispatch, RootState } from '@/store/store';
import { Card } from '@/app/model/Card';
import ActionMenu from '@/components/ActionMenu';

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

    const sortDataToggle = (key: keyof Card, direction = "asc") => {
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        sortData(key, direction);
        setSortConfig({ key, direction });
    };

    const sortData = (key: keyof Card, direction = "asc") => {
        if (!cards || cards.length === 0) {
            setSortedData([]);
            return;
        }
        const sorted = [...cards].sort((a, b) => {
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
        sortData(sortConfig.key as keyof Card, sortConfig.direction);
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

    function renderTableHeaders(columns: Column[]) {
        return (
            <>
                {columns.map((column) => (
                    <TableHeaderItem
                        key={column.accessor}
                        onClick={() => column.sorting !== false && sortDataToggle(column.accessor as keyof Card)}
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
                        <ActionMenu<Card> items={menuItems} data={row}/>
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