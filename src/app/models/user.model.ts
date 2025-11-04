export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface User {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  natioanlity?:string;
  nativeLanguage?:string;
  dialCode?: string;
  role: string;
  accountStatus?: UserStatus;
  profilePicture?: string;
  userName?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  loading?: boolean;
}

export interface UserListResponse {
  success: boolean;
  data: {
    users: User[];
    total: number;
    page: number;
    pages: number;
  };
  message?: string;
}

export interface UserResponse {
  success: boolean;
  data: User;
  message?: string;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}
