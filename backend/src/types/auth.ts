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

export interface SignupResponse<T = any> {
  success: boolean;
  data: T;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string | T;
}
