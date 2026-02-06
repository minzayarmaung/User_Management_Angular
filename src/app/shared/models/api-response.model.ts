export interface ApiResponse<T = any> {
  success: number;
  code: number;
  message: string;
  data: T;
  meta: any;
}

export interface PaginatedApiResponse<T> {
  success: number;
  code: number;
  message: string;
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  method: string;
  endpoint: string;
}

export interface PaginationRequest {
  keyword?: string;
  page: number;
  size: number;
  sortField: string;
  sortDirection: 'ASC' | 'DESC';
}