
import api from "@/lib/api";
import {
    ApiResponse,
    LoginRequest,
    RegisterRequest,
    User,
} from "@/types/auth";

export const loginUser = async (
    credentials: LoginRequest
): Promise<void> => {
    await api.post("/api/auth/login", credentials);
};

export const registerUser = async (
    details: RegisterRequest,
    profileImage?: File | null
): Promise<User> => {
    const formData = new FormData();

    formData.append("data", JSON.stringify({
        username: details.username,
        email: details.email,
        password: details.password,
        displayName: details.displayName,
        bio: details.bio ?? "",
    }));

    if (profileImage) {
        formData.append("profileImage", profileImage);
    }

    const response = await api.post<ApiResponse<User>>(
        "/api/auth/register",
        formData
    );

    return response.data.data;
};

export const getCurrentUser = async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>(
        "/api/auth/me"
    );

    return response.data.data;
};

export const logoutUser = async (): Promise<void> => {
    await api.post("/api/auth/logout");
};
