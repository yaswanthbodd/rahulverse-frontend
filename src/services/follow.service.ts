
import api from "@/lib/api";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface FollowCounts {
  followersCount: number;
  followingCount: number;
}

export interface FollowUser {
  id: number;
  username: string;
  displayname: string;
  profileImageUrl: string | null;
  followedAt: string;
}

export interface FollowPage {
  content: FollowUser[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export const followUser = async (username: string): Promise<void> => {
  await api.post<ApiResponse<null>>(
    `/api/users/${encodeURIComponent(username)}/follow`
  );
};

export const unfollowUser = async (username: string): Promise<void> => {
  await api.delete<ApiResponse<null>>(
    `/api/users/${encodeURIComponent(username)}/follow`
  );
};

export const getFollowStatus = async (
  username: string
): Promise<boolean> => {
  const response = await api.get<ApiResponse<boolean>>(
    `/api/users/${encodeURIComponent(username)}/follow/status`
  );

  return response.data.data;
};

export const getFollowCounts = async (
  username: string
): Promise<FollowCounts> => {
  const response = await api.get<ApiResponse<FollowCounts>>(
    `/api/users/${encodeURIComponent(username)}/follow/counts`
  );

  return response.data.data;
};

export const getFollowers = async (
  username: string,
  page = 0,
  size = 10
): Promise<FollowPage> => {
  const response = await api.get<ApiResponse<FollowPage>>(
    `/api/users/${encodeURIComponent(username)}/followers`,
    {
      params: { page, size },
    }
  );

  return response.data.data;
};

export const getFollowing = async (
  username: string,
  page = 0,
  size = 10
): Promise<FollowPage> => {
  const response = await api.get<ApiResponse<FollowPage>>(
    `/api/users/${encodeURIComponent(username)}/following`,
    {
      params: { page, size },
    }
  );

  return response.data.data;
};
