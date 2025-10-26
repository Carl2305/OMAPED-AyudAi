export class ApiResponse<T> {
  success: boolean = false;
  status: number = 0;
  message: string = '';
  data?: T;
  errors: string[] = [];

  constructor(init?: Partial<ApiResponse<T>>) {
    if (init) {
      Object.assign(this, init);
    }
  }

  static successResponse<T>(
    data: T,
    status: number = 200,
    message: string = ''
  ): ApiResponse<T> {
    return new ApiResponse<T>({
      success: true,
      status,
      message,
      data,
      errors: []
    });
  }

  static errorResponse<T>(
    status: number = 500,
    message: string = '',
    errors?: string[]
  ): ApiResponse<T> {
    return new ApiResponse<T>({
      success: false,
      status,
      message,
      data: undefined,
      errors: errors ?? []
    });
  }
}