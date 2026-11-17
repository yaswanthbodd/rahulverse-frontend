
"use client";

import { useCallback, useEffect, useState } from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";

import {
  getLikeCount,
  getLikeStatus,
  likePost,
  unlikePost,
} from "@/services/like.service";

import { getCommentCount } from "@/services/comment.service";
import CommentSection from "@/components/posts/CommentSection";

interface PostActionsProps {
  postId: number;
}

export default function PostActions({ postId }: PostActionsProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [heartAnimation, setHeartAnimation] = useState(false);

  useEffect(() => {
    let active = true;

    const loadDetails = async () => {
      setLoading(true);
      setError("");

      try {
        const [status, likes, comments] = await Promise.all([
          getLikeStatus(postId),
          getLikeCount(postId),
          getCommentCount(postId),
        ]);

        if (active) {
          setLiked(status);
          setLikeCount(likes);
          setCommentCount(comments);
        }
      } catch (err: unknown) {
        console.error("Post actions loading error:", err);

        if (active) {
          setError("Unable to load post interactions.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadDetails();

    return () => {
      active = false;
    };
  }, [postId]);

  const handleCheer = async () => {
    if (updating || loading) return;

    const previousLiked = liked;
    const previousCount = likeCount;
    const nextLiked = !previousLiked;

    setUpdating(true);
    setError("");

    setLiked(nextLiked);
    setLikeCount((count) =>
      Math.max(0, count + (nextLiked ? 1 : -1))
    );

    if (nextLiked) {
      setHeartAnimation(true);
      window.setTimeout(() => setHeartAnimation(false), 350);
    }

    try {
      if (nextLiked) {
        await likePost(postId);
      } else {
        await unlikePost(postId);
      }
    } catch (err: unknown) {
      console.error("Cheer update error:", err);

      setLiked(previousLiked);
      setLikeCount(previousCount);

      setError("Unable to update your cheer. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const handleCommentCountChange = useCallback((count: number) => {
    setCommentCount(count);
  }, []);

  return (
    <div className="mt-3 border-t border-[var(--border)] pt-2.5">
      {/* POST ACTION BUTTONS */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-3">
        {/* CHEER */}
        <button
          type="button"
          onClick={handleCheer}
          disabled={loading || updating}
          aria-pressed={liked}
          className={`group inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold transition duration-200 hover:bg-rose-500/10 disabled:opacity-50 ${
            liked ? "text-rose-500" : "rv-secondary"
          }`}
        >
          <Heart
            size={16}
            fill={liked ? "currentColor" : "none"}
            className={`transition-transform duration-200 group-hover:scale-110 ${
              heartAnimation ? "rv-heart-pop" : ""
            }`}
          />

          <span>Cheer</span>

          <span className="text-xs tabular-nums opacity-80">
            {loading ? "..." : likeCount}
          </span>
        </button>

        {/* DISCUSS */}
        <button
          type="button"
          onClick={() => setCommentsOpen((previous) => !previous)}
          aria-expanded={commentsOpen}
          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold transition hover:bg-[var(--accent-soft)] ${
            commentsOpen ? "rv-accent" : "rv-secondary"
          }`}
        >
          <MessageCircle size={16} />

          <span>Discuss</span>

          <span className="text-xs tabular-nums opacity-80">
            {loading ? "..." : commentCount}
          </span>
        </button>

        {/* SHARE */}
        <button
          type="button"
          disabled
          title="Sharing will be available soon"
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold rv-muted opacity-60"
        >
          <Share2 size={16} />
          <span>Share</span>
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <p className="mt-2 text-xs text-red-400" role="alert">
          {error}
        </p>
      )}

      {/* COMMENTS */}
      {commentsOpen && (
        <div className="mt-3 rv-slide-up">
          <CommentSection
            postId={postId}
            onCountChange={handleCommentCountChange}
          />
        </div>
      )}
    </div>
  );
}
