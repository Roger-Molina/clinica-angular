export interface Column {
    field: string;
    header: string;
    sortable?: boolean;
    filterable?: boolean;
    width?: string;
  }
  
  export interface TableConfig {
    showGlobalFilter?: boolean;
    showPaginator?: boolean;
    showColumnFilter?: boolean;
    rowsPerPageOptions?: number[];
    responsive?: boolean;
    exportable?: boolean;
    lazy?: boolean;
  }
  
  export interface PageEvent {
    first: number;
    rows: number;
    page: number;
    pageCount: number;
  }