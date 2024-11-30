// src/app/pages/cities/cities.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CityService } from '../../services/city.service';
import { City } from '../../interfaces/city.interface';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { TableConfig } from '../../shared/interfaces/table-config.interface';

@Component({
  selector: 'app-cities',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss']
})
export class CitiesComponent implements OnInit {
  cities: City[] = [];
  isLoading = false;
  error: string | null = null;
  currentSort?: { field: string; direction: 'asc' | 'desc' };

  tableConfig: TableConfig = {
    columns: [
      { field: 'id', header: 'ID', type: 'text', sortable: true },
      { field: 'name', header: 'Şehir Adı', type: 'text', sortable: true },
      { field: 'code', header: 'Plaka Kodu', type: 'text', sortable: true },
      { field: 'is_active', header: 'Durum', type: 'boolean', sortable: true }
    ]
  };

  constructor(private cityService: CityService) {}

  ngOnInit() {
    this.loadCities();
  }

  loadCities() {
    this.isLoading = true;
    this.error = null;

    this.cityService.getCities(
      this.currentSort?.field,
      this.currentSort?.direction
    ).subscribe({
      next: (data) => {
        console.log('Data received:', data);
        this.cities = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error occurred:', err);
        this.error = 'Şehirler yüklenirken bir hata oluştu';
        this.isLoading = false;
      }
    });
  }

  onAddNew() {
    console.log('Add new city');
  }

  onEdit(city: City) {
    console.log('Edit city:', city);
  }

  onDelete(city: City) {
    console.log('Delete city:', city);
  }

  onSort(event: {field: string; direction: 'asc' | 'desc'}) {
    // Remove loadCities call, let DataTable handle sorting
    this.currentSort = event;
  }

  onFilter(event: {field: string; value: any}) {
    console.log('Filter:', event);
  }

  onPageSizeChange(size: number) {
    console.log('Page size changed:', size);
  }
}