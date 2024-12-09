export interface SignupBody {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface ApiResponse<T = any> {
  status: "success" | "error";
  data: T;
}

export interface ErrorResponse<T = any> {
  message: string | T;
}
