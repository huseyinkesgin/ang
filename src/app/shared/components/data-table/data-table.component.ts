// src/app/shared/components/data-table/data-table.component.ts
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { TableConfig, TableColumn } from '../../interfaces/table-config.interface';
import { ColumnSettingsModalComponent } from '../column-settings-modal/column-settings-modal.component';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, ColumnSettingsModalComponent],
  templateUrl: './data-table.component.html',
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }

      .cdk-drag-preview {
        background-color: white;
        box-shadow: 0 5px 5px -3px rgba(0,0,0,0.2),
                    0 8px 10px 1px rgba(0,0,0,0.14),
                    0 3px 14px 2px rgba(0,0,0,0.12);
      }
      
      .cdk-drag-placeholder {
        opacity: 0;
      }
      
      .cdk-drag-animating {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }
      
      .drag-handle {
        cursor: move;
        color: #9ca3af;
      }
    `
  ]
})
export class DataTableComponent implements OnInit {
  @Input() config!: TableConfig;
  @Input() data: any[] = [];
  @Input() pageSize = 10;
  @Input() tableId: string = 'default'; // For identifying different tables in localStorage

  @Output() pageChange = new EventEmitter<number>();
  @Output() sortChange = new EventEmitter<{field: string; direction: 'asc' | 'desc'}>();
  @Output() filterChange = new EventEmitter<{field: string; value: any}>();
  @Output() addNew = new EventEmitter<void>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() pageSizeChange = new EventEmitter<number>();

  currentPage = 1;
  searchTerm = '';
  sortField: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';
  protected readonly Math = Math; // Add Math property
  isColumnSettingsOpen = false;

  ngOnInit() {
    this.loadColumnOrder();
    this.loadColumnVisibility(); // Add this line
  }

  get visibleColumns(): TableColumn[] {
    return this.config?.columns.filter(col => col.visible !== false) ?? [];
  }

  get sortedData(): any[] {
    if (!this.sortField) return this.data;

    return [...this.data].sort((a, b) => {
      const aValue = a[this.sortField as string];
      const bValue = b[this.sortField as string];

      if (typeof aValue === 'boolean') {
        return this.sortDirection === 'asc' 
          ? Number(aValue) - Number(bValue)
          : Number(bValue) - Number(aValue);
      }

      if (this.sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }

  get filteredData(): any[] {
    if (!this.searchTerm) return this.sortedData; // Changed from this.data to this.sortedData
    
    return this.sortedData.filter(item =>  // Changed from this.data to this.sortedData
      Object.values(item).some(val => 
        val?.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    );
  }

  onSort(column: TableColumn) {
    if (!column.sortable) return;
    
    if (this.sortField === column.field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = column.field;
      this.sortDirection = 'asc';
    }
    
    this.sortChange.emit({ field: column.field, direction: this.sortDirection });
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm = value;
    this.currentPage = 1;
    this.filterChange.emit({ field: 'search', value });
  }

  get totalPages() {
    return Math.ceil(this.filteredData.length / this.pageSize);
  }

  get paginatedData() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredData.slice(start, start + this.pageSize);
  }

  onPageSizeChange(value: number) {
    this.currentPage = 1;
    this.pageSizeChange.emit(value);
  }

  pageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    if (this.totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      let start = Math.max(1, this.currentPage - 2);
      let end = Math.min(this.totalPages, start + maxVisiblePages - 1);
      
      // Adjust start if we're near the end
      if (end === this.totalPages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.pageChange.emit(page);
    }
  }

  drop(event: CdkDragDrop<any[]>) {
    if (!this.config?.columns) return;
    
    moveItemInArray(this.config.columns, event.previousIndex, event.currentIndex);
    this.saveColumnOrder();
  }

  private saveColumnOrder(): void {
    if (!this.config?.columns) return;
    const columnOrder = this.config.columns.map(col => col.field);
    localStorage.setItem(`table_columns_${this.tableId}`, JSON.stringify(columnOrder));
  }

  private loadColumnOrder(): void {
    const savedOrder = localStorage.getItem(`table_columns_${this.tableId}`);
    if (!savedOrder || !this.config?.columns) return;

    try {
      const orderArray = JSON.parse(savedOrder);
      const orderedColumns: TableColumn[] = [];
      
      // Reorder columns based on saved order
      orderArray.forEach((field: string) => {
        const column = this.config.columns.find(col => col.field === field);
        if (column) orderedColumns.push(column);
      });

      // Add any new columns that weren't in the saved order
      this.config.columns.forEach(column => {
        if (!orderedColumns.find(col => col.field === column.field)) {
          orderedColumns.push(column);
        }
      });

      this.config.columns = orderedColumns;
    } catch (e) {
      console.error('Error loading column order:', e);
    }
  }

  onColumnSettingsChange(columns: TableColumn[]): void {
    if (this.config) {
      this.config.columns = [...columns];
      this.saveColumnVisibility();
    }
  }

  private saveColumnVisibility(): void {
    if (!this.config?.columns) return;
    const visibilitySettings = this.config.columns.map(col => ({
      field: col.field,
      visible: col.visible
    }));
    localStorage.setItem(`table_visibility_${this.tableId}`, JSON.stringify(visibilitySettings));
  }

  private loadColumnVisibility(): void {
    if (!this.config?.columns) return;
    
    const savedVisibility = localStorage.getItem(`table_visibility_${this.tableId}`);
    if (!savedVisibility) return;

    try {
      const visibilitySettings = JSON.parse(savedVisibility);
      this.config.columns = this.config.columns.map(col => ({
        ...col,
        visible: visibilitySettings.find((v: any) => v.field === col.field)?.visible ?? col.visible
      }));
    } catch (e) {
      console.error('Error loading column visibility:', e);
    }
  }
}