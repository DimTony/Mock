export interface User {
  accessToken: string;
  createdAt: string;
  email: string;
  refreshToken: string;
  updatedAt: string;
  username: string;
  _id: string;
  image?: string;
}

export interface RegisterData {
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  // confirmPassword: string;
  deviceName: string;
  imei: string;
  plan: string;
  files: File[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}
