
import api from "@/lib/api";

// Post media response
export interface PostMedia {
  id: number;
  mediaUrl: string;
  mediaType: string;
  format: string;
  sortOrder: number;
}

// Post response
export interface PostResponse {
  id: number;
  userId: number;
  username: string;
  displayName: string;
  content: string;
  media: PostMedia[];
  createdAt: string;
  updatedAt: string;
}

// Generic API response
export interface PostApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Paginated response
export interface PostPage {
  content: PostResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

// Create post
export const createPost = async (
  content: string,
  files: File[]
): Promise<PostResponse> => {
  const formData = new FormData();

  if (content.trim()) {
    formData.append("content", content.trim());
  }

  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await api.post<PostApiResponse<PostResponse>>(
    "/api/posts",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data.data;
};

// Get post by ID
export const getPostById = async (
  postId: number
): Promise<PostResponse> => {
  const response = await api.get<PostApiResponse<PostResponse>>(
    `/api/posts/${postId}`
  );

  return response.data.data;
};

// Get logged-in user's posts
export const getMyPosts = async (
  page: number = 0,
  size: number = 10
): Promise<PostPage> => {
  const response = await api.get<PostApiResponse<PostPage>>(
    `/api/posts/my?page=${page}&size=${size}`
  );

  return response.data.data;
};

// Get posts by username
export const getUserPosts = async (
  username: string,
  page: number = 0,
  size: number = 10
): Promise<PostPage> => {
  const response = await api.get<PostApiResponse<PostPage>>(
    `/api/posts/user/${encodeURIComponent(username)}?page=${page}&size=${size}`
  );

  return response.data.data;
};

// Update post content
export const updatePost = async (
  postId: number,
  content: string
): Promise<PostResponse> => {
  const response = await api.put<PostApiResponse<PostResponse>>(
    `/api/posts/${postId}`,
    { content }
  );

  return response.data.data;
};

// Delete post
export const deletePost = async (
  postId: number
): Promise<void> => {
  await api.delete<PostApiResponse<null>>(
    `/api/posts/${postId}`
  );
};
