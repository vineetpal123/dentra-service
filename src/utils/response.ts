export const successResponse = (
  message: string,
  data: any = {}
) => ({
  success: true,
  message,
  data,
});

export const errorResponse = (
  message: string,
  code: string,
  errors: any[] = []
) => ({
  success: false,
  message,
  code,
  errors,
});