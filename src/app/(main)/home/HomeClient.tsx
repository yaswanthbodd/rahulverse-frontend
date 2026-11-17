
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  RefreshCw,
  Sparkles,
  MoreHorizontal,
  UserPlus,
  UserMinus,
  LoaderCircle,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import {
  FeedPage,
  FeedPost,
  FeedType,
  getFeed,
} from "@/services/feed.service";

import {
  followUser,
  unfollowUser,
  getFollowStatus,
} from "@/services/follow.service";

import {
  updatePost,
  deletePost,
} from "@/services/post.service";

import { useAuth } from "@/context/AuthContext";
import PostMedia from "@/components/posts/PostMedia";
import CreatePost from "@/components/posts/CreatePost";
import PostActions from "@/components/posts/PostActions";

export default function HomePage() {
  const [feedType, setFeedType] = useState<FeedType>("for-you");
  const [feed, setFeed] = useState<FeedPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);

  const loadFeed = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getFeed(feedType, page, 10);
      setFeed(result);
    } catch (err: unknown) {
      console.error("Feed loading error:", err);
      setFeed(null);
      setError("Unable to load the feed. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [feedType, page]);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  const changeFeed = (type: FeedType) => {
    setFeedType(type);
    setPage(0);
  };

  const handlePostUpdated = async () => {
    await loadFeed();
  };

  const handlePostDeleted = (postId: number) => {
    setFeed((current) => {
      if (!current) return current;

      return {
        ...current,
        content: current.content.filter(
          (post) => post.postId !== postId
        ),
        totalElements: Math.max(0, current.totalElements - 1),
      };
    });
  };

  return (
    <div className="rv-fade-in mx-auto w-full max-w-[780px] space-y-4 sm:space-y-5">
      {/* CREATE POST - MATCHES THE FEED WIDTH */}
      <div className="w-full">
        <CreatePost onPostCreated={loadFeed} />
      </div>

      {/* STICKY FEED TABS */}
      <div className="sticky top-[72px] z-20 -mx-2 border-b border-[var(--border)] bg-[var(--background)]/95 px-2 backdrop-blur-xl sm:-mx-3 sm:px-3">
        <div className="grid grid-cols-2">
          {(["for-you", "following"] as FeedType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => changeFeed(type)}
              className={`relative min-h-12 py-3 text-sm font-semibold transition-colors duration-200 ${
                feedType === type
                  ? "rv-text"
                  : "rv-muted hover:bg-[var(--surface-hover)]"
              }`}
            >
              {type === "for-you" ? "For You" : "Following"}
              {feedType === type && (
                <span className="absolute bottom-0 left-1/2 h-[3px] w-12 -translate-x-1/2 rounded-full bg-[var(--accent)] animate-[scale-in_200ms_ease-out]" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 py-1">
        <p className="text-xs rv-secondary">
          {feedType === "for-you"
            ? "Posts from the RahulVerse community"
            : "Posts from people you follow"}
        </p>

        <button
          type="button"
          onClick={loadFeed}
          disabled={loading}
          className="rv-icon-button gap-1.5 rounded-full px-3 py-2 text-xs disabled:opacity-50"
        >
          <RefreshCw
            size={14}
            className={loading ? "animate-spin" : ""}
          />
          <span className="hidden sm:inline">
            {loading ? "Refreshing" : "Refresh"}
          </span>
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-sm text-red-500">{error}</p>
          <button
            type="button"
            onClick={loadFeed}
            className="mt-2 text-sm font-bold rv-accent hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-5 sm:px-5">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-[var(--surface-hover)]" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-32 rounded bg-[var(--surface-hover)]" />
                  <div className="h-3 w-20 rounded bg-[var(--surface-hover)]" />
                </div>
              </div>
              <div className="mt-4 h-3 w-full rounded bg-[var(--surface-hover)]" />
              <div className="mt-2 h-3 w-2/3 rounded bg-[var(--surface-hover)]" />
            </div>
          ))}
        </div>
      )}

      {!loading && !error && feed && (
        <>
          {feed.content.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {feed.content.map((post, index) => (
                <FeedPostCard
                  key={post.postId}
                  post={post}
                  index={index}
                  onPostUpdated={handlePostUpdated}
                  onPostDeleted={handlePostDeleted}
                />
              ))}
            </div>
          ) : (
            <div className="rv-card rounded-2xl px-5 py-12 text-center">
              <Sparkles size={26} className="mx-auto rv-accent" />

              <h2 className="mt-3 text-lg font-black rv-text">
                {feedType === "following"
                  ? "Your Following Feed is Empty"
                  : "No Posts Yet"}
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm rv-secondary">
                {feedType === "following"
                  ? "Follow other people in RahulVerse to see their posts here."
                  : "Be the first to share something with the RahulVerse community."}
              </p>

              {feedType === "following" && (
                <button
                  type="button"
                  onClick={() => changeFeed("for-you")}
                  className="rv-button-primary mt-5"
                >
                  Explore For You
                </button>
              )}
            </div>
          )}

          {feed.totalPages > 1 && (
            <div className="mt-2 flex items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 py-3 sm:px-4">
              <button
                type="button"
                disabled={feed.first || loading}
                onClick={() => setPage((current) => Math.max(0, current - 1))}
                className="rv-icon-button px-4 py-2 text-sm disabled:opacity-40"
              >
                Previous
              </button>

              <span className="text-xs rv-secondary">
                Page {feed.page + 1} of {feed.totalPages}
              </span>

              <button
                type="button"
                disabled={feed.last || loading}
                onClick={() => setPage((current) => current + 1)}
                className="rv-icon-button px-4 py-2 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function FeedPostCard({
  post,
  index,
  onPostUpdated,
  onPostDeleted,
}: {
  post: FeedPost;
  index: number;
  onPostUpdated: () => Promise<void>;
  onPostDeleted: (postId: number) => void;
}) {
  const initial = post.displayName?.trim()?.charAt(0)?.toUpperCase() || "U";

  return (
    <article
      className="rv-slide-up rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)]/20 hover:bg-[var(--surface-hover)]/50 hover:shadow-md sm:px-5 sm:py-5"
      style={{ animationDelay: `${Math.min(index * 60, 240)}ms` }}
    >
      <div className="flex items-start gap-3">
        <Link
          href={`/profile/${encodeURIComponent(post.username)}`}
          aria-label={`View ${post.displayName}'s profile`}
          className="shrink-0"
        >
          {post.profileImageUrl ? (
            <img
              src={post.profileImageUrl}
              alt={`${post.displayName}'s profile`}
              referrerPolicy="no-referrer"
              className="h-10 w-10 rounded-full border border-[var(--border)] object-cover transition-transform duration-200 hover:scale-105 sm:h-11 sm:w-11"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--accent)]/40 bg-[var(--accent-soft)] text-sm font-bold rv-accent sm:h-11 sm:w-11">
              {initial}
            </div>
          )}
        </Link>

        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <Link
              href={`/profile/${encodeURIComponent(post.username)}`}
              className="text-sm font-bold rv-text transition hover:rv-accent"
            >
              {post.displayName}
            </Link>

            <span className="text-xs rv-muted">
              @{post.username}
            </span>

            <span className="text-xs rv-muted">·</span>

            <time
              className="text-xs rv-muted"
              dateTime={post.createdAt}
              title={new Date(post.createdAt).toLocaleString()}
            >
              {new Date(post.createdAt).toLocaleDateString()}
            </time>
          </div>
        </div>

        <PostOptionsMenu
          post={post}
          onPostUpdated={onPostUpdated}
          onPostDeleted={onPostDeleted}
        />
      </div>

      {post.content && (
        <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 rv-text sm:text-[15px]">
          {post.content}
        </p>
      )}

      {post.media && post.media.length > 0 && (
        <div className="mt-3 overflow-hidden rounded-xl border border-[var(--border)]">
          <PostMedia media={post.media} />
        </div>
      )}

      <PostActions postId={post.postId} />
    </article>
  );
}

function PostOptionsMenu({
  post,
  onPostUpdated,
  onPostDeleted,
}: {
  post: FeedPost;
  onPostUpdated: () => Promise<void>;
  onPostDeleted: (postId: number) => void;
}) {
  const { user } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [followed, setFollowed] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const isOwnPost =
    user?.username?.toLowerCase() === post.username.toLowerCase();

  useEffect(() => {
    let active = true;

    const loadStatus = async () => {
      if (!user || isOwnPost) return;

      setLoading(true);

      try {
        const status = await getFollowStatus(post.username);
        if (active) setFollowed(status);
      } catch (err) {
        console.error("Follow status loading error:", err);
        if (active) setError("Unable to load follow status.");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadStatus();

    return () => {
      active = false;
    };
  }, [post.username, user, isOwnPost]);

  const handleFollowToggle = async () => {
    if (updating || loading || followed === null) return;

    setUpdating(true);
    setError("");

    try {
      if (followed) {
        await unfollowUser(post.username);
        setFollowed(false);
      } else {
        await followUser(post.username);
        setFollowed(true);
      }

      setMenuOpen(false);
    } catch (err) {
      console.error("Follow update error:", err);
      setError(
        followed
          ? "Unable to unfollow this user."
          : "Unable to follow this user."
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdatePost = async () => {
    const trimmedContent = editContent.trim();

    if (!trimmedContent) {
      setError("Post content cannot be empty.");
      return;
    }

    setUpdating(true);
    setError("");

    try {
      await updatePost(post.postId, trimmedContent);
      setEditOpen(false);
      setMenuOpen(false);
      await onPostUpdated();
    } catch (err) {
      console.error("Post update error:", err);
      setError("Unable to update this post. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeletePost = async () => {
    if (updating) return;

    setUpdating(true);
    setError("");

    try {
      await deletePost(post.postId);
      setDeleteOpen(false);
      setMenuOpen(false);
      onPostDeleted(post.postId);
    } catch (err) {
      console.error("Post deletion error:", err);
      setError("Unable to delete this post. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <div className="relative shrink-0">
        <button
          type="button"
          onClick={() => {
            setMenuOpen((current) => !current);
            setError("");
          }}
          aria-label="Post options"
          aria-expanded={menuOpen}
          className="flex h-8 w-8 items-center justify-center rounded-full rv-secondary transition hover:bg-[var(--surface-hover)] hover:rv-accent"
        >
          <MoreHorizontal size={20} />
        </button>

        {menuOpen && (
          <>
            <button
              type="button"
              aria-label="Close post options"
              className="fixed inset-0 z-20 cursor-default"
              onClick={() => setMenuOpen(false)}
            />

            <div className="absolute right-0 top-10 z-30 w-52 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-xl">
              {isOwnPost ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setEditContent(post.content);
                      setEditOpen(true);
                      setMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold rv-text transition hover:bg-[var(--surface-hover)]"
                  >
                    <Pencil size={16} className="rv-accent" />
                    Edit post
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDeleteOpen(true);
                      setMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-red-500 transition hover:bg-red-500/10"
                  >
                    <Trash2 size={16} />
                    Delete post
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleFollowToggle}
                  disabled={loading || updating || followed === null}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold rv-text transition hover:bg-[var(--surface-hover)] disabled:opacity-50"
                >
                  {loading || updating ? (
                    <LoaderCircle size={16} className="animate-spin rv-accent" />
                  ) : followed ? (
                    <UserMinus size={16} className="text-red-500" />
                  ) : (
                    <UserPlus size={16} className="rv-accent" />
                  )}

                  {loading
                    ? "Loading..."
                    : updating
                      ? "Updating..."
                      : followed
                        ? "Unfollow"
                        : "Follow"}
                </button>
              )}

              {error && (
                <p className="px-3 py-2 text-xs text-red-500" role="alert">
                  {error}
                </p>
              )}
            </div>
          </>
        )}
      </div>

      {editOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-2xl sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold rv-text">Edit post</h2>
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                disabled={updating}
                className="rv-icon-button h-8 w-8"
                aria-label="Close edit dialog"
              >
                <X size={17} />
              </button>
            </div>

            <textarea
              value={editContent}
              onChange={(event) => setEditContent(event.target.value)}
              rows={5}
              maxLength={5000}
              disabled={updating}
              className="rv-input min-h-28 w-full resize-y p-3 text-sm leading-6"
              placeholder="Write your post..."
            />

            <div className="mt-2 flex justify-between text-xs rv-muted">
              <span>Update the text of your post.</span>
              <span>{editContent.length}/5000</span>
            </div>

            {error && (
              <p className="mt-3 text-sm text-red-500" role="alert">
                {error}
              </p>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                disabled={updating}
                className="rv-icon-button px-4 py-2 text-sm"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleUpdatePost}
                disabled={updating || !editContent.trim()}
                className="rv-button-primary px-4 py-2 text-sm disabled:opacity-50"
              >
                {updating ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-2xl">
            <h2 className="text-lg font-bold rv-text">Delete post?</h2>
            <p className="mt-2 text-sm leading-6 rv-secondary">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>

            {error && (
              <p className="mt-3 text-sm text-red-500" role="alert">
                {error}
              </p>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteOpen(false)}
                disabled={updating}
                className="rv-icon-button px-4 py-2 text-sm"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeletePost}
                disabled={updating}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {updating ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
