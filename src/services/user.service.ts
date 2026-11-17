
import api from "@/lib/api";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  displayName: string;
  bio: string | null;
  profileImageUrl: string | null;
  createdAt: string;
}

export interface UserPostMedia {
  id: number;
  mediaUrl: string;
  mediaType: string;
  format: string;
  sortOrder: number;
}

export interface UserPost {
  id: number;
  userId: number;
  username: string;
  displayName: string;
  profileImageUrl: string | null;
  content: string;
  media: UserPostMedia[];
  createdAt: string;
  updatedAt: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export const getUserProfile = async (
  username: string
): Promise<UserProfile> => {
  const response = await api.get<ApiResponse<UserProfile>>(
    `/api/users/${encodeURIComponent(username)}`
  );

  return response.data.data;
};

export const getUserPosts = async (
  username: string,
  page = 0,
  size = 10
): Promise<PageResponse<UserPost>> => {
  const response = await api.get<ApiResponse<PageResponse<UserPost>>>(
    `/api/posts/user/${encodeURIComponent(username)}`,
    {
      params: { page, size },
    }
  );

  return response.data.data;
};
