import useBodyScrollLock from '@/hooks/useBodyScrollLock';
import { X } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import CustomCheckbox from './CustomCheckbox';
export type FilterOperatorType = 'string' | 'year' | 'number' | 'month' | 'day' | 'transaction_type_string'
export type DataOperatorType = 'string' | 'date' | 'number' | 'transaction_type_number'

export type FilterData = {
    label: string;
    value: string;
}

export interface FilterType {
    columnName: string;
    columnAccessor: string;
    filterOperator: FilterOperatorType;
    dataOperator: DataOperatorType;
    data: FilterData[];
}

interface ColumnStateType {
    columnName: string;
    isOpen: boolean;
}

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    filterColumns: FilterType[];
    initialFilters: FilterType[];
    onApplyFilters: (filters: FilterType[]) => void;
}

export const getTotalFiltersCount = (filters: any) => {
    const filterValues = Object.values(filters);
    if (filterValues.length > 0) {
        return filterValues.flat().length
    }
    return 0
}

// Get total filter count by column
export function getFilterCountByColumn(filters: FilterType[], columnName: string): number {
    const filter = filters.find(f => f.columnName === columnName);
    return filter ? filter.data.length : 0;
}

// Get total filter count across all columns
export function getTotalFilterCount(filters: FilterType[]): number {
    return filters.reduce((sum, filter) => sum + filter.data.length, 0);
}


const FilterModal = ({
    isOpen,
    onClose,
    filterColumns,
    initialFilters,
    onApplyFilters,
}: FilterModalProps) => {
    const [filters, setFilters] = useState<FilterType[]>([]);
    const [columnsState, setColumnsState] = useState<ColumnStateType[]>([]);

    function toggleColumnState(columnName: string) {
        const columnState = columnsState.find((column) => column.columnName === columnName)
        if (!columnState) {
            setColumnsState(
                [...columnsState,
                {
                    columnName,
                    isOpen: true
                }
                ]
            )
            return
        }
        const newState = {
            columnName: columnState.columnName,
            isOpen: !columnState.isOpen
        }
        setColumnsState([...columnsState.filter((item) => item.columnName !== columnName), newState])
    }

    function getColumnState(columnName: string): boolean {
        const columnState = columnsState.find((column) => column.columnName === columnName)
        return columnState ? columnState.isOpen : false
    }
    function getFilterByColumnName(
        filters: FilterType[],
        columnName: string
    ): FilterType | undefined {
        return filters.find(filter => filter.columnName === columnName);
    }


    function invertSelectFilter(
        filters: FilterType[],
        columnName: string,
        allPossibleValues: FilterData[]
    ) {
        const currentFilter = getFilterByColumnName(filters, columnName);
        if (!currentFilter) {
            return;
        }
        setFilters(prev => {
            const others = prev.filter(f => f.columnName !== currentFilter.columnName);
            const invertedValues = allPossibleValues.filter(
                value => !currentFilter.data.includes(value)
            );

            const invertedFilter: FilterType = {
                ...currentFilter,
                data: invertedValues,
            };

            return [...others, invertedFilter];
        });
    }


    // Select all filters for a column (replace with full set of data)
    function selectAllFilter(
        newFilter: FilterType,
    ) {
        setFilters(prev => {
            const others = prev.filter(f => f.columnName !== newFilter.columnName);
            return [...others, newFilter];
        });
    }

    // Clear all filters for a column
    function clearAllFilter(columnName: string) {
        setFilters(prev => prev.filter(f => f.columnName !== columnName));
    }



    function toggleFilter(
        column: FilterType,
        value: FilterData,
    ) {
        setFilters(prev => {
            const existing = prev.find(f => f.columnName === column.columnName);

            if (existing) {
                const valueExists = existing.data.includes(value);

                // Remove the value if it exists
                if (valueExists) {
                    const newData = existing.data.filter(v => v !== value);

                    // If no values left, remove the filter entirely
                    if (newData.length === 0) {
                        return prev.filter(f => f.columnName !== column.columnName);
                    }

                    return prev.map(f =>
                        f.columnName === column.columnName
                            ? { ...f, data: newData }
                            : f
                    );
                }

                // Otherwise, add the value
                return prev.map(f =>
                    f.columnName === column.columnName
                        ? { ...f, data: [...f.data, value] }
                        : f
                );
            }

            // No existing filter for this column, create new
            const newFilter: FilterType = {
                columnAccessor: column.columnAccessor,
                columnName: column.columnName,
                filterOperator: column.filterOperator,
                dataOperator: column.dataOperator,
                data: [value],
            };

            return [...prev, newFilter];
        });
    }





    useEffect(() => {
        if (isOpen) {
            setFilters(initialFilters);
        }
    }, [isOpen, filterColumns]);

    const handleSelectAll = (column: FilterType) => {
        selectAllFilter(column)
    };

    const handleClearSelection = (columnName: string) => {
        clearAllFilter(columnName)
    };

    const handleChange = (column: FilterType, value: FilterData) => {
        toggleFilter(column, value)
    };

    const handleApply = () => {
        onApplyFilters(filters); // Pass both
        onClose();
    };

    const handleClearAllFilter = () => {
        setFilters([])
    }

    const handleClose = () => {
        onClose();
    };

    const totalFilterCount = useMemo(() => {
        return getTotalFilterCount(filters)
    }, [filters])


    const getFilterColumn = (columnName: string): any[] | null => {
        if (filters.length === 0) {
            return null
        }
        const filterColumns = filters.filter((filterItem) => filterItem.columnName === columnName)
        if (filterColumns.length === 0) {
            return null
        }
        return filterColumns[0].data
    }

    useBodyScrollLock(isOpen);

    if (!isOpen) return null;
    return (
        <main className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50 text-gray-900 font-sans overflow-hidden">
            <div className="relative bg-white w-full max-w-lg max-h-[90vh] overflow-hidden p-6 rounded-lg shadow-lg mx-auto my-10 flex flex-col dark:bg-gray-900 dark:text-gray-200">
                <div className='flex justify-between'>
                    <h2 className="text-xl font-semibold mb-4">
                        <span>
                            Filter
                            <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                                {totalFilterCount}
                            </span>
                        </span>

                    </h2>
                    <X className="text-gray-500 opacity-75 cursor-pointer" onClick={handleClose} />
                </div>

                <div className="overflow-y-auto pr-2 flex-1">
                    {filterColumns.map((column) => {
                        return (
                            <div key={column.columnName} className="mb-4 border border-gray-200 rounded dark:border-gray-700">
                                <button
                                    type="button"
                                    onClick={() => toggleColumnState(column.columnName)}
                                    className="w-full px-4 py-2 text-left bg-gray-100 font-medium flex justify-between items-center dark:bg-gray-900"
                                >
                                    <span>
                                        {column.columnName}
                                        <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                                            {getFilterCountByColumn(filters, column.columnName)}
                                        </span>
                                    </span>
                                    <span className="text-sm">{getColumnState(column.columnName) ? '−' : '+'}</span>
                                </button>

                                {getColumnState(column.columnName) && (
                                    <div className="px-4 py-2 space-y-2 bg-white dark:bg-gray-900">
                                        <div className="flex space-x-4">
                                            <button
                                                className="text-blue-500 text-sm"
                                                onClick={() => handleSelectAll(column)}
                                            >
                                                Select All
                                            </button>
                                            <button
                                                className="text-purple-500 text-sm"
                                                onClick={() => invertSelectFilter(filters, column.columnName, column.data)}
                                            >
                                                Invert Select
                                            </button>
                                            <button
                                                className="text-red-500 text-sm"
                                                onClick={() => handleClearSelection(column.columnName)}
                                            >
                                                Clear
                                            </button>
                                        </div>
                                        <div className="space-y-1 max-h-40 overflow-y-auto pr-2">
                                            {column.data.map((dataItem) => (
                                                <CustomCheckbox
                                                    key={dataItem.value}
                                                    value={dataItem.label}
                                                    checked={getFilterColumn(column.columnName)?.includes(dataItem) || false}
                                                    onChange={() => handleChange(column, dataItem)}
                                                />

                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="flex justify-end space-x-4 mt-4">

                    <button
                        className="btn-secondary"
                        onClick={handleApply}
                    >
                        Apply
                    </button>
                    <button
                        className="btn-secondary-outline p-3"
                        onClick={handleClearAllFilter}
                    >
                        Clear All
                    </button>
                </div>
            </div>
        </main>
    );

};

export default FilterModal;
