export interface LoginResponse {
  userId: number;
  username: string;
  email: string;
  role: string;
  profilePicUrl: string | null;
}

export interface SignUpResponse {
  userId: number;
  username: string;
  email: string;
}