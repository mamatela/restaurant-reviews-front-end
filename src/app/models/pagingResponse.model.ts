export class PagingResponse<T> {
  items: Array<T>;
  totalItems: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
}