export interface Subscription {
  createdAt: string;
  deviceName: string;
  email: string;
  imei: string;
  phone: string;
  plan: string;
  price: number;
  queuePosition: string;
  status: string;
  updatedAt: string;
  user: string;
  _id: string;
}

export interface User {
  accessToken: string;
  createdAt: string;
  email: string;
  refreshToken: string;
  updatedAt: string;
  username: string;
  _id: string;
  image: string;
  subscriptions: Subscription[];
  adminInfo: {
    employeeId: string;
    accessLevel: number;
    canApproveSubscriptions: boolean;
    canViewAnalytics: boolean;
    canManageUsers: boolean;
    maxApprovalAmount: number;
  };
  devices: any[];
  emailVerificationExpires: string | null;
  isActive: boolean;
  isEmailVerified: boolean;
  isOnline: boolean;
  lastLoginAt: string;
  lastSeen: string;
  role: string;
  stats: { messageCount: number; activeDevices: number };
  subscription: { status: string };
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
  isCheckingAuth: boolean; // Add this new property
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  fetchUserData: () => Promise<void>; // Add this new method
}
