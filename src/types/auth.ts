
export interface User {
    id: number;
    username: string;
    email: string;
    displayName: string;
    bio: string | null;
    profileImageUrl: string | null;
    createdAt: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    displayName: string;
    password: string;
    bio?: string;
}

export interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (credentials: LoginRequest) => Promise<void>;
    register: (
        details: RegisterRequest,
        profileImage?: File | null
    ) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}
