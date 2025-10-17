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
  isApproved?: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
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

// Blog types
export interface BlogPost {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  featuredImage?: string;
  authorId: User | string;
  publishedDate: Date;
  status: 'draft' | 'published';
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Portfolio types
export interface PortfolioProject {
  _id: string;
  title: string;
  description: string;
  image?: string;
  tags: string[];
  link?: string;
  github?: string;
  category: 'Web Development' | 'Applications' | 'Open Source' | 'Other';
  featured: boolean;
  order: number;
  techs: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Photo types
export interface Photo {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl: string;
  category: 'Nature' | 'Urban' | 'Travel' | 'Portrait' | 'Other';
  metadata?: {
    camera?: string;
    lens?: string;
    aperture?: string;
    shutterSpeed?: string;
    iso?: string;
    focalLength?: string;
    takenAt?: Date;
    location?: string;
  };
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Notification types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

export interface NotificationContextType {
  notifications: Notification[];
  showNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
