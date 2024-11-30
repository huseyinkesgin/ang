import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableColumn } from '../../interfaces/table-config.interface';

@Component({
  selector: 'app-column-settings-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="px-4 py-3 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Sütun Ayarları</h3>
        </div>
        
        <div class="px-4 py-4 max-h-[60vh] overflow-y-auto">
          <div class="space-y-3">
            @for (column of columns; track column.field) {
              <div class="flex items-center">
                <input
                  type="checkbox"
                  [id]="column.field"
                  [(ngModel)]="column.visible"
                  (ngModelChange)="onColumnVisibilityChange()"
                  class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                >
                <label [for]="column.field" class="ml-2 text-sm text-gray-700">
                  {{ column.header }}
                </label>
              </div>
            }
          </div>
        </div>

        <div class="px-4 py-3 bg-gray-50 flex justify-end gap-2 rounded-b-lg">
          <button
            type="button"
            (click)="close.emit()"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  `
})
export class ColumnSettingsModalComponent {
  @Input() isOpen = false;
  @Input() columns: TableColumn[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() columnsChange = new EventEmitter<TableColumn[]>();

  onColumnVisibilityChange(): void {
    this.columnsChange.emit(this.columns);
  }
}
