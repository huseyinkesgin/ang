// src/app/shared/interfaces/table-config.interface.ts
export interface TableColumn {
    field: string;          // API'den gelen alan adı
    header: string;         // Görüntülenecek başlık
    translationKey?: string; // i18n için kullanılacak key
    sortable?: boolean;     // Sıralanabilir mi?
    filterable?: boolean;   // Filtrelenebilir mi?
    visible?: boolean;      // Görünür mü?
    width?: string;         // Sütun genişliği
    type?: 'text' | 'number' | 'date' | 'currency' | 'custom' | 'boolean'; // Sütun tipi
  }
  
  export interface TableConfig {
    columns: TableColumn[];
    pageable?: boolean;
    filterable?: boolean;
    sortable?: boolean;
    reorderable?: boolean;
    selectable?: boolean;
    pageSize?: number;
    pageSizeOptions?: number[];
    saveState?: boolean;    // Kullanıcı özelleştirmelerini kaydet
    stateKey?: string;      // Kaydedilen state için unique key
  }