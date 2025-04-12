// universal-table.component.ts
import { Component, Input, Output, EventEmitter, signal, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { Column, PageEvent, TableConfig } from '../../interfaces/tabla.interface';


@Component({
  selector: 'app-universal-table',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    TableModule,
    PaginatorModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    MultiSelectModule
  ],
  template: `
    <div class="card w-full">
      <!-- Table Controls -->
      <div class="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
        <!-- Global Filter -->
        <div *ngIf="tableConfig().showGlobalFilter" class="p-input-icon-left">
          <i class="pi pi-search"></i>
          <input 
            pInputText 
            type="text" 
            #filter
            (input)="applyGlobalFilter(filter.value)" 
            placeholder="Buscar..." 
            class="p-2 border rounded"
          />
        </div>
        
        <!-- Column Visibility -->
        <div *ngIf="tableConfig().showColumnFilter" class="flex items-center">
          <p-multiSelect 
            [options]="columnsOptions()" 
            [ngModel]="selectedColumns()"
            (ngModelChange)="selectedColumns.set($event)"
            optionLabel="header"
            defaultLabel="Columnas"
            (onChange)="updateVisibleColumns()"
            styleClass="w-full md:w-auto"
          ></p-multiSelect>
        </div>
      </div>

      <!-- Table -->
      <p-table 
        #dt
        [value]="tableData()" 
        [columns]="visibleColumns()"
        [paginator]="tableConfig().showPaginator && !tableConfig().lazy"
        [rows]="tableRows()"
        [rowsPerPageOptions]="tableConfig().rowsPerPageOptions || [5, 10, 25, 50]"
        [totalRecords]="tableTotalRecords()"
        [tableStyle]="{'min-width': '100%'}"
        [lazy]="tableConfig().lazy"
        [responsive]="tableConfig().responsive"
        [loading]="tableLoading()"
        (onPage)="onPageChangeTable($event)"
        styleClass="p-datatable-sm"
        [globalFilterFields]="columnFields()"
        [resizableColumns]="true" 
        [reorderableColumns]="true"
        [autoLayout]="true"
        [scrollable]="true" 
        scrollHeight="flex"
      >
        <!-- Table Header -->
        <ng-template pTemplate="header" let-columns>
          <tr>
            <th *ngFor="let col of columns" 
                [pSortableColumn]="col.sortable ? col.field : undefined"
                [ngStyle]="{'width': col.width}">
              {{col.header}}
              <p-sortIcon *ngIf="col.sortable" [field]="col.field"></p-sortIcon>
            </th>
          </tr>
          <!-- Filters Row -->
          <tr *ngIf="hasFilterableColumns()">
            <th *ngFor="let col of columns">
              <input 
                *ngIf="col.filterable" 
                pInputText 
                type="text" 
                (input)="dt.filter($any($event.target).value, col.field, 'contains')" 
                class="w-full"
              />
            </th>
          </tr>
        </ng-template>

        <!-- Table Body -->
        <ng-template pTemplate="body" let-rowData let-columns="columns">
          <tr [pSelectableRow]="rowData" (click)="onRowSelect(rowData)">
            <td *ngFor="let col of columns">
              <ng-container *ngTemplateOutlet="
                templateMap[col.field] || defaultTemplate;
                context: {$implicit: rowData, field: col.field}
              "></ng-container>
            </td>
          </tr>
        </ng-template>

        <!-- Default Cell Template -->
        <ng-template #defaultTemplate let-rowData let-field="field">
          {{rowData[field]}}
        </ng-template>

        <!-- Empty State -->
        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="100%" class="text-center p-4">
              No se encontraron registros.
            </td>
          </tr>
        </ng-template>
      </p-table>

      <!-- Custom Paginator for Lazy Loading -->
      <p-paginator 
        *ngIf="tableConfig().lazy && tableConfig().showPaginator"
        [rows]="tableRows()"
        [totalRecords]="tableTotalRecords()"
        [rowsPerPageOptions]="tableConfig().rowsPerPageOptions || [5, 10, 25, 50]"
        (onPageChange)="onPageChangePaginator($event)"
        styleClass="mt-4"
      ></p-paginator>
    </div>
  `,
  styles: [`
    :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
      @apply bg-gray-100 text-gray-700 font-medium;
    }
    
    :host ::ng-deep .p-datatable .p-datatable-tbody > tr:hover {
      @apply bg-gray-50;
    }
    
    :host ::ng-deep .p-paginator {
      @apply bg-white border-0;
    }
  `]
})
export class UniversalTableComponent {
  // Input signals
  private _columns = signal<Column[]>([]);
  private _data = signal<any[]>([]);
  private _config = signal<TableConfig>({
    showGlobalFilter: true,
    showPaginator: true,
    showColumnFilter: true,
    rowsPerPageOptions: [5, 10, 25, 50],
    responsive: true,
    exportable: false,
    lazy: false
  });
  private _rows = signal<number>(10);
  private _totalRecords = signal<number>(0);
  private _loading = signal<boolean>(false);
  
  // Computed signals
  public visibleColumns = computed(() => this.selectedColumns());
  public columnsOptions = computed(() => this._columns());
  public columnFields = computed(() => this._columns().map(col => col.field));
  public tableConfig = computed(() => this._config());
  public tableData = computed(() => this._data());
  public tableRows = computed(() => this._rows());
  public tableTotalRecords = computed(() => this._totalRecords());
  public tableLoading = computed(() => this._loading());
  
  // State signals
  public selectedColumns = signal<Column[]>([]);
  
  // Template references
  public templateMap: {[key: string]: any} = {};
  
  // Output events
  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() rowSelect = new EventEmitter<any>();
  @Output() filter = new EventEmitter<string>();
  
  constructor() {
    // Effect to update selected columns when columns input changes
    effect(() => {
      this.selectedColumns.set([...this._columns()]);
    });
  }
  
  // Input setters
  @Input() set columns(value: Column[]) {
    this._columns.set(value);
  }
  
  @Input() set data(value: any[]) {
    this._data.set(value);
    if (!this._config().lazy) {
      this._totalRecords.set(value.length);
    }
  }
  
  @Input() set config(value: TableConfig) {
    this._config.set({...this._config(), ...value});
  }
  
  @Input() set rows(value: number) {
    this._rows.set(value);
  }
  
  @Input() set totalRecords(value: number) {
    this._totalRecords.set(value);
  }
  
  @Input() set loading(value: boolean) {
    this._loading.set(value);
  }
  
  // Template inputs
  @Input() set cellTemplates(templates: {[key: string]: any}) {
    this.templateMap = templates;
  }
  
  // Methods
  public onPageChangeTable(event: any): void {
    const pageEvent: PageEvent = {
      first: event.first,
      rows: event.rows,
      page: event.page,
      pageCount: event.pageCount
    };
    this.pageChange.emit(pageEvent);
  }
  
  public onPageChangePaginator(event: any): void {
    const pageEvent: PageEvent = {
      first: event.first,
      rows: event.rows,
      page: event.page,
      pageCount: event.pageCount
    };
    this.pageChange.emit(pageEvent);
  }
  
  public onRowSelect(rowData: any): void {
    this.rowSelect.emit(rowData);
  }
  
  public applyGlobalFilter(value: string): void {
    this.filter.emit(value);
  }
  
  public updateVisibleColumns(): void {
    // No additional action needed as the visibleColumns computed signal will update
  }
  
  public hasFilterableColumns(): boolean {
    return this.visibleColumns().some(col => col.filterable);
  }
}