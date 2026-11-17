
import api from "@/lib/api";

export interface LikeApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Like a post
export const likePost = async (postId: number): Promise<void> => {
  await api.post<LikeApiResponse<null>>(
    `/api/posts/${postId}/likes`
  );
};

// Unlike a post
export const unlikePost = async (postId: number): Promise<void> => {
  await api.delete<LikeApiResponse<null>>(
    `/api/posts/${postId}/likes`
  );
};

// Get current user's like status
export const getLikeStatus = async (
  postId: number
): Promise<boolean> => {
  const response = await api.get<LikeApiResponse<boolean>>(
    `/api/posts/${postId}/likes/status`
  );

  return response.data.data;
};

// Get total like count
export const getLikeCount = async (
  postId: number
): Promise<number> => {
  const response = await api.get<LikeApiResponse<number>>(
    `/api/posts/${postId}/likes/count`
  );

  return response.data.data;
};
