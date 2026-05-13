export interface ApiResponse<T> {
  status: boolean;
  status_code: number;
  message: string;
  data: T;
}