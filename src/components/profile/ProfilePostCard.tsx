
"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  Loader2,
} from "lucide-react";

import type { UserPost } from "@/services/user.service";
import { updatePost, deletePost } from "@/services/post.service";
import PostMedia from "@/components/posts/PostMedia";
import PostActions from "@/components/posts/PostActions";

interface ProfilePostCardProps {
  post: UserPost;
  isOwnProfile: boolean;
  onPostUpdated: () => Promise<void>;
  onPostDeleted: (postId: number) => void;
}

export default function ProfilePostCard({
  post,
  isOwnProfile,
  onPostUpdated,
  onPostDeleted,
}: ProfilePostCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editContent, setEditContent] = useState(post.content || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const initial =
    post.displayName?.trim()?.charAt(0)?.toUpperCase() || "U";

  const handleUpdate = async () => {
    const content = editContent.trim();

    if (!content) {
      setError("Post content cannot be empty.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await updatePost(post.id, content);
      setEditOpen(false);
      await onPostUpdated();
    } catch (err) {
      console.error("Profile post update error:", err);
      setError("Unable to update this post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      await deletePost(post.id);
      setDeleteOpen(false);
      onPostDeleted(post.id);
    } catch (err) {
      console.error("Profile post deletion error:", err);
      setError("Unable to delete this post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const normalizedMedia = (post.media || []).map((item) => ({
    ...item,
    mediaType: item.mediaType?.toLowerCase() || "",
    format: item.format || "",
    sortOrder: item.sortOrder ?? 0,
  }));

  return (
    <>
      <article className="group rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 transition-all duration-200 hover:border-[var(--accent)]/25 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--accent)]/30 bg-[var(--accent-soft)] text-sm font-bold rv-accent">
            {post.profileImageUrl ? (
              <img
                src={post.profileImageUrl}
                alt={`${post.displayName}'s profile`}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            ) : (
              initial
            )}
          </div>

          <div className="min-w-0 flex-1 pt-0.5">
            <p className="truncate text-sm font-bold rv-text">
              {post.displayName}
            </p>

            <p className="mt-0.5 text-xs rv-muted">
              @{post.username}
              <span className="mx-1.5">·</span>
              {new Date(post.createdAt).toLocaleDateString("en-IN")}
            </p>
          </div>

          {isOwnProfile && (
            <div className="relative shrink-0">
              <button
                type="button"
                aria-label="Post options"
                aria-expanded={menuOpen}
                onClick={() => {
                  setMenuOpen((current) => !current);
                  setError("");
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full rv-secondary transition hover:bg-[var(--surface-hover)] hover:rv-accent"
              >
                <MoreHorizontal size={20} />
              </button>

              {menuOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Close post menu"
                    onClick={() => setMenuOpen(false)}
                    className="fixed inset-0 z-20 cursor-default"
                  />

                  <div className="absolute right-0 top-10 z-30 w-44 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-xl">
                    <button
                      type="button"
                      onClick={() => {
                        setEditContent(post.content || "");
                        setEditOpen(true);
                        setMenuOpen(false);
                        setError("");
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium rv-text transition hover:bg-[var(--surface-hover)]"
                    >
                      <Pencil size={16} className="rv-accent" />
                      Edit post
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setDeleteOpen(true);
                        setMenuOpen(false);
                        setError("");
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-500 transition hover:bg-red-500/10"
                    >
                      <Trash2 size={16} />
                      Delete post
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {post.content && (
          <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 rv-text sm:text-[15px]">
            {post.content}
          </p>
        )}

        {normalizedMedia.length > 0 && (
          <div className="mt-4 overflow-hidden rounded-xl border border-[var(--border)]">
            <PostMedia media={normalizedMedia} />
          </div>
        )}

        <div className="mt-3 border-t border-[var(--border)] pt-2">
          <PostActions postId={post.id} />
        </div>
      </article>

      {editOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold rv-text">Edit post</h2>

              <button
                type="button"
                onClick={() => setEditOpen(false)}
                disabled={loading}
                aria-label="Close edit dialog"
                className="rv-icon-button h-9 w-9"
              >
                <X size={18} />
              </button>
            </div>

            <textarea
              value={editContent}
              onChange={(event) => setEditContent(event.target.value)}
              rows={5}
              maxLength={5000}
              disabled={loading}
              className="rv-input w-full resize-y p-3 text-sm leading-6"
              placeholder="Write your post..."
            />

            <div className="mt-2 flex justify-between text-xs rv-muted">
              <span>Update your post content</span>
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
                disabled={loading}
                className="rv-icon-button px-4 py-2 text-sm"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleUpdate}
                disabled={loading || !editContent.trim()}
                className="rv-button-primary px-4 py-2 text-sm disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-2xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
              <Trash2 size={20} />
            </div>

            <h2 className="mt-4 text-lg font-bold rv-text">
              Delete this post?
            </h2>

            <p className="mt-2 text-sm leading-6 rv-secondary">
              This post and its associated media will be deleted. This action
              cannot be undone.
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
                disabled={loading}
                className="rv-icon-button px-4 py-2 text-sm"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {loading && <Loader2 size={15} className="animate-spin" />}
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
