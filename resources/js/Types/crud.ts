import { LucideIcon } from 'lucide-react';
import { z } from 'zod';

export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'textarea'
  | 'richtext'
  | 'select'
  | 'hidden'
  | 'multi-select'
  | 'checkbox'
  | 'switch'
  | 'file'
  | 'date'
  | 'datetime-local'
  | 'time'
  | 'color'
  | 'url'
  | 'key-value'
  | 'validation-rules'
  | 'password-input'
  | 'daterange'
  | 'disable'
  | 'date-range'
  | 'disabled'
  | 'phone';

export type ColumnRenderType =
  | 'text'
  | 'badge'
  | 'status'
  | 'date'
  | 'currency'
  | 'boolean-badge'
  | 'user'
  | 'avatar'
  | 'relation-badge'
  | 'custom';

export interface FormField {

  [key: string]: any;
  name: string;
  label: string;
  type: FieldType;
  icon?: any;
  section?: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  validation?: z.ZodTypeAny;
  defaultValue?: any;
  previewImgDbKey?: any;
  hasDependents?: boolean;
  dependencyConfig?: any[];
  isClearable?: boolean;


  // Field-specific options
  options?: Array<{ value: string | number; label: string }>;
  optionsFrom?: string; // Backend prop key
  optionLabel?: string;
  optionValue?: string;

  // File input
  accept?: string;
  maxSize?: number; // in KB
  preview?: boolean;
  multiple?: boolean;

  // Number input
  min?: number;
  max?: number;
  step?: string;

  // Textarea/richtext
  rows?: number;
  height?: string;

  // Layout
  gridColumn?: string;
  className?: string;
  disabled?: boolean;

  // Conditional rendering
  dependsOn?: string;
  showWhen?: (value: any) => boolean;

  onChange?: (value: any, formData: any) => void;

  parentField?: string;

}

export interface TableColumn {
  key?: string;
  keys?: string[];

  label: string;
  sortable?: boolean;
  filterable?: boolean;
  serializable?: boolean;
  showCollectionFilter?: boolean;
  className?: string;
  headerClassName?: string;
  priority?: number; // For responsive hiding
  hidden?: boolean;
  showOnlyInRecycleBin?: boolean;

  renderType?: ColumnRenderType;
  relationKey?: string;
  statusColorKey?: string;

  defaultIcon?: LucideIcon

  render?: (item: any) => React.ReactNode;
  [key: string]: any;
}

export interface FilterField {
  key: string;
  label: string;
  type: 'select' | 'text' | 'number' | 'date' | 'daterange' | 'date_range' | 'searchable-select' | 'boolean';
  placeholder?: string;
  options?: Array<{ value: string | number; label: string }>;
  optionsFrom?: string;
  optionLabel?: string;
  optionValue?: string;
  defaultOption?: { value: string; label: string };
  note?: string;
  filterSource?: string;
}

export interface StatCard {
  key: string;
  title: string;
  icon?: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  format?: 'number' | 'currency' | 'percentage';
  showChange?: boolean;
  changeKey?: string;
  description?: string
}

export interface BulkAction {
  label: string;
  action: string;
  value?: any;
  variant?: 'default' | 'destructive' | 'outline';
  icon?: React.ReactNode;
  confirm?: false | {
    title: string;
    description: string;
  };
}

export interface CrudRoutes {
  index?: string;
  create?: string;
  edit?: string;
  store?: string;
  update?: string;
  destroy?: string;
  forceDestroy?: string;
  show?: string;
  bulkDestroy?: string;
  updateStatus?: string;
  restore?: string;
  makeDefault?: string;
  block?: string;
  updatePassword?: string;
  impersonate?: string;
  bulkAction?: string;
  [key: string]: any;
}

export interface CrudPermissions {
  create?: string;
  edit?: string;
  delete?: string;
  view?: string;
  bulkDelete?: string;
  updateStatus?: string;
  restore?: string;
  bulk?: string;
  block?: string;
  updatePassword?: string;
  makeDefault?: string;
  permanentDelete?: string;
  [key: string]: any;
}

export interface CrudConfig {
  // Basic info
  resource?: string;
  resourcePlural?: string;
  title?: string;
  description?: string;
  fetchToggle?: boolean

  saveAlertInfo?: any;
  formComponent?: any;
  formValidationRules?: object

  // Routes
  routes: CrudRoutes;



  // Display mode
  formDisplayMode?: 'modal' | 'page';
  viewDisplayMode?: 'modal' | 'page'
  statusType?: 'binary' | 'dropdown'; // binary = active/inactive, dropdown = multi-state

  // Table
  table?: {
    selectable?: boolean;
    searchable?: boolean;
    serializable: boolean,
    searchPlaceholder?: string;
    sortable?: boolean;
    defaultSort?: string;
    defaultSortDirection?: 'asc' | 'desc';
    perPageOptions?: number[];
    emptyMessage?: string;
    emptyMessageIcon?: LucideIcon;
    columns: TableColumn[];
    bulkActions?: any;
    customActions?: any
    actions?: any
    editMode?: string,
    customActionSubmenus?: any,
    [key: string]: any;


  };

  // Stats
  stats?: StatCard[];

  // Form
  form?: {
    title?: {
      create: string;
      edit: string;
    };
    description?: {
      create: string;
      edit: string;
    };
    submitButtonText?: {
      create: string;
      edit: string;
    };
    fields: FormField[];
    [key: string]: any;
  };


  destroyDialogConfig?: any,
  breadcrumbs?: any,


  // Filters
  filters?: {
    searchFields?: string[];
    filterFields?: FilterField[];
  };

  // Permissions
  permissions?: {
    actions?: CrudPermissions;
  };

  // Action constraints
  actionConstraints?: {
    delete?: Array<{
      field: string;
      checkValue?: any;
      message: string;
    }>;
    bulkDelete?: Array<{
      field: string;
      checkValue?: any;
      message: string;
    }>;
  };

  // Labels
  labels?: {
    singular: string;
    plural: string;
    [key: string]: any;
  };

  [key: string]: any;
}

export interface PaginationMeta {
  current_page: number;
  from: number;
  to: number;
  total: number;
  last_page: number;
}

export interface CrudPageProps<T = any> {
  data: T[];
  meta: PaginationMeta;
  stats?: Record<string, any>;
  [key: string]: any;
}


export interface CrudPageShowProps<T = any> {
  config: CrudConfig;
  item: any;
  [key: string]: any;
}


export interface DynamicFiltersProps {
  config: CrudConfig;
  currentFilters: Record<string, any>;
  onFilterChange: (key: string, value: any) => void;
  onClearFilters: () => void;
  backendData?: Record<string, any>;
}


export interface DynamicTableProps {
  config: CrudConfig;
  data: any;
  isCollection?: boolean;
  selectedRows?: Array<number | string>;
  clearSelection?: any
  onToggleRow?: (id: number | string) => void;
  onToggleAll?: (ids: Array<number | string>) => void;
  onSort?: (column: string) => void;
  onEdit?: (item: any) => void;
  onDelete?: (id: number | string) => void;
  onRestore?: (id: number | string) => void;
  onBulkDelete?: (ids: Array<number | string>) => void;
  onBulkAction?: (ids: Array<number | string>, action: string) => void;
  onUpdateStatus?: (id: number | string, status: string) => void;
  onView?: any;
  onPageChange?: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  customActions?: any,
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  bulkActionLoader?: boolean;
  bulkAction?: string;
  setBulkAction?: (action: string) => void;
}



export interface CustomActionOption {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  value?: any;
  queryParams?: any;
  iconColor?: string;
  disabled?: (item: any) => boolean;
  isCurrent?: (item: any) => boolean;
}

export interface RouteAction {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  route: string;
  queryParams?: (item: any) => Record<string, any>;
  routeParams?: any;
  target?: string;
}

export interface CustomActionSubmenuConfig {
  key: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  type?: 'state' | 'route';
  queryParams?: (item: any) => Record<string, any>;
  route?: string;
  fieldKey?: string;
  options?: CustomActionOption[];
  actions?: RouteAction[];
}

export interface CustomActionSubmenuProps {
  config: CustomActionSubmenuConfig;
  item: any;
}

