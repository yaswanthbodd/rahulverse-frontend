
import api from "@/lib/api";

export interface PostMedia {
  id: number;
  mediaUrl: string;
  mediaType: string;
  format: string;
  sortOrder: number;
}

export interface FeedPost {
  postId: number;
  content: string;
  userId: number;
  username: string;
  displayName: string;
  profileImageUrl: string | null;
  media: PostMedia[];
  createdAt: string;
  updatedAt: string;
}

export interface FeedPage {
  content: FeedPost[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface FeedApiResponse {
  success: boolean;
  message: string;
  data: FeedPage;
}

export type FeedType = "for-you" | "following";

export const getFeed = async (
  feedType: FeedType,
  page: number = 0,
  size: number = 10
): Promise<FeedPage> => {
  const response = await api.get<FeedApiResponse>(
    `/api/feed/${feedType}?page=${page}&size=${size}`
  );

  return response.data.data;
};
