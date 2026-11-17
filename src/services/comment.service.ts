
import api from "@/lib/api";

export interface Comment {
  id: number;
  postId: number;
  userId: number;
  username: string;
  displayName: string;
  profileImageUrl: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommentPage {
  content: Comment[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getComments = async (
  postId: number,
  page = 0,
  size = 10
): Promise<CommentPage> => {
  const response = await api.get<ApiResponse<CommentPage>>(
    `/api/posts/${postId}/comments?page=${page}&size=${size}`
  );

  return response.data.data;
};

export const getCommentCount = async (
  postId: number
): Promise<number> => {
  const response = await api.get<ApiResponse<number>>(
    `/api/posts/${postId}/comments/count`
  );

  return response.data.data;
};

export const createComment = async (
  postId: number,
  content: string
): Promise<Comment> => {
  const response = await api.post<ApiResponse<Comment>>(
    `/api/posts/${postId}/comments`,
    { content }
  );

  return response.data.data;
};

export const updateComment = async (
  commentId: number,
  content: string
): Promise<Comment> => {
  const response = await api.put<ApiResponse<Comment>>(
    `/api/comments/${commentId}`,
    { content }
  );

  return response.data.data;
};

export const deleteComment = async (
  commentId: number
): Promise<void> => {
  await api.delete<ApiResponse<null>>(
    `/api/comments/${commentId}`
  );
};
