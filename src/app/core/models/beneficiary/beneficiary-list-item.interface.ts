export interface BeneficiaryListItem {
  idBeneficiario: number;
  tipoDocumento: string;
  numeroDocumento: string;
  nombreCompleto: string;
  tipoDiscapacidad: string;
  serviciosBasicos: string | null;
  edad: number;
}

export interface PagedResponse<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
