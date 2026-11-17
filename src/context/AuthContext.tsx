
"use client";

import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

import {
    AuthContextType,
    LoginRequest,
    RegisterRequest,
    User,
} from "@/types/auth";

import {
    getCurrentUser,
    loginUser,
    logoutUser,
    registerUser,
} from "@/services/auth.service";

const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

export function AuthProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = useCallback(async () => {
        try {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        } catch {
            setUser(null);
        }
    }, []);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                await refreshUser();
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, [refreshUser]);

    const login = async (credentials: LoginRequest) => {
        await loginUser(credentials);
        await refreshUser();
    };

    const register = async (
        details: RegisterRequest,
        profileImage?: File | null
    ) => {
        await registerUser(details, profileImage);
    };

    const logout = async () => {
        try {
            await logoutUser();
        } finally {
            setUser(null);
        }
    };

    const value: AuthContextType = {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}
