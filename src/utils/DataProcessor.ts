import { DataOperatorType, FilterOperatorType, FilterType } from "@/components/FilterModal";
import { getTransactionTypeStr } from "./helper";

type SortDirection = 'asc' | 'desc';

class DataProcessor<T> {
  private originalData: T[];
  private searchColumns: (keyof T)[];
  private processedData: T[];

  constructor(data: T[], searchColumns: (keyof T)[]) {
    this.originalData = data;
    this.searchColumns = searchColumns;
    this.processedData = [...data]; // make a copy to process
  }


  applySearch(searchTerm: string): this {
    const term = searchTerm.toLowerCase();
    this.processedData = this.originalData.filter(item =>
      this.searchColumns.some(column =>
        String(item[column]).toLowerCase().includes(term)
      )
    );
    return this;
  }

  applySort(columnName: keyof T, direction: SortDirection='asc'): this {
    this.processedData.sort((a, b) => {
      const aValue = a[columnName];
      const bValue = b[columnName];
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    return this;
  }

  private extractFromData(
    value: any,
    dataOperator: DataOperatorType,
    filterOperator: FilterOperatorType
  ): any {
    if (dataOperator === 'date' && (filterOperator === 'year' || filterOperator === 'month' || filterOperator === 'day')) {
      const date = value instanceof Date ? value : new Date(value);
      if (isNaN(date.getTime())) return null;
      switch(filterOperator){
        case 'day':
            return date.getDate();
        case 'month': 
            return date.getMonth()+1;
        case 'year':
            return date.getFullYear();
        default :
            return value;
      }
    }
    else if(dataOperator === 'transaction_type_number' && filterOperator === 'transaction_type_string'){
      return getTransactionTypeStr(value)
    }
  
    // Default fallback: no transformation
    return value;
  }
  

  applyFilter(appliedFilters: FilterType[]): this {
    this.processedData = this.processedData.filter(item =>
      appliedFilters.every(filter => {
        const itemValue = item[filter.columnAccessor as keyof T];
  
        const extracted = this.extractFromData(itemValue, filter.dataOperator, filter.filterOperator);
  
        // Convert all filter values to string for consistent comparison
        const match = filter.data.some(filterVal => String(extracted) === String(filterVal.value));
  
        return match;
      })
    );
    return this;
  }

  getData(): T[] {
    return this.processedData;
  }
}

export default DataProcessor