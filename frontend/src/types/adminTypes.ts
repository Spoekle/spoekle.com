// User-related types
export interface User {
  _id: string;
  username: string;
  email?: string;
  password?: string;
  roles: string[];
  profilePicture?: string;
  discordId?: string;
  discordUsername?: string;
  status?: string;
  createdAt?: string;
}

export interface CreateUserFormData {
  username: string;
  password: string;
  email: string;
  roles: string[];
  status?: string;
}

export interface FormErrors {
  username?: string;
  password?: string;
  email?: string;
  roles?: string;
}

