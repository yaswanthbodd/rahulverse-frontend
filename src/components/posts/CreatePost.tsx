"use client";

import { useEffect, useRef, useState } from "react";
import { createPost } from "@/services/post.service";
import {
  ImagePlus,
  X,
  Send,
  LoaderCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface CreatePostProps {
  onPostCreated?: () => void | Promise<void>;
}

const MAX_FILES = 4;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_VIDEO_SIZE = 100 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
];

export default function CreatePost({
  onPostCreated,
}: CreatePostProps) {
  const { user } = useAuth();

  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const resizeTextarea = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 240)}px`;
  };

  const validateFile = (file: File): string | null => {
    if (ALLOWED_IMAGE_TYPES.includes(file.type)) {
      if (file.size > MAX_IMAGE_SIZE) {
        return `${file.name} exceeds the 10 MB image limit.`;
      }

      return null;
    }

    if (ALLOWED_VIDEO_TYPES.includes(file.type)) {
      if (file.size > MAX_VIDEO_SIZE) {
        return `${file.name} exceeds the 100 MB video limit.`;
      }

      return null;
    }

    return `${file.name} has an unsupported file format.`;
  };

  const handleFileSelection = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    setError("");
    setSuccess("");

    if (files.length + selectedFiles.length > MAX_FILES) {
      setError(`You can upload a maximum of ${MAX_FILES} media files.`);
      event.target.value = "";
      return;
    }

    for (const file of selectedFiles) {
      const validationError = validateFile(file);

      if (validationError) {
        setError(validationError);
        event.target.value = "";
        return;
      }
    }

    setFiles((current) => [...current, ...selectedFiles]);
    event.target.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((current) => current.filter((_, i) => i !== index));
    setError("");
  };

  const handlePublish = async () => {
    setError("");
    setSuccess("");

    if (!content.trim() && files.length === 0) {
      setError("Please write something or select media to publish.");
      return;
    }

    setLoading(true);

    try {
      await createPost(content, files);

      setContent("");
      setFiles([]);

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setSuccess("Your post has been published successfully!");
      await onPostCreated?.();
    } catch (err: unknown) {
      console.error("Post creation error:", err);
      setError("Unable to publish your post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const initial =
    user?.displayName?.trim()?.charAt(0)?.toUpperCase() || "R";

  return (
    <section className="rv-card overflow-hidden rounded-2xl border border-[var(--border)] p-3 transition-colors duration-200 sm:p-4">
      <div className="flex items-start gap-3">
        {/* USER AVATAR */}
        {user?.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt={user.displayName || "Your profile"}
            referrerPolicy="no-referrer"
            className="mt-1 h-10 w-10 shrink-0 rounded-full border border-[var(--accent)]/40 object-cover"
          />
        ) : (
          <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--accent)]/40 bg-[var(--accent-soft)] text-sm font-bold rv-accent">
            {initial}
          </div>
        )}

        {/* COMPACT AUTO-EXPANDING COMPOSER */}
        <div className="min-w-0 flex-1">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(event) => {
              setContent(event.target.value);
              setError("");
              setSuccess("");
              resizeTextarea();
            }}
            onInput={resizeTextarea}
            placeholder="What's happening in RahulVerse?"
            rows={1}
            disabled={loading}
            aria-label="Write your post"
            className="block min-h-10 max-h-60 w-full resize-none overflow-y-auto bg-transparent px-0 py-2 text-[15px] leading-6 rv-text outline-none placeholder:rv-muted disabled:opacity-60"
          />

          {/* SELECTED MEDIA PREVIEWS */}
          {files.length > 0 && (
            <div className="mt-3">
              <div className="grid grid-cols-2 gap-2">
                {files.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="group relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)]"
                  >
                    <div className="flex min-h-24 items-center justify-center bg-black/5">
                      {file.type.startsWith("image/") ? (
                        <img
                          src={previews[index]}
                          alt={file.name}
                          className="max-h-48 w-full object-contain"
                        />
                      ) : (
                        <video
                          src={previews[index]}
                          controls
                          preload="metadata"
                          className="max-h-48 w-full bg-black"
                        />
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2 border-t border-[var(--border)] px-2 py-1.5">
                      <span className="min-w-0 truncate text-[11px] rv-secondary">
                        {file.name}
                      </span>

                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        disabled={loading}
                        aria-label={`Remove ${file.name}`}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-2 text-[11px] rv-muted">
                {files.length} of {MAX_FILES} media files selected
              </p>
            </div>
          )}

          {/* COMPOSER ACTIONS */}
          <div className="mt-2 flex items-center justify-between border-t border-[var(--border)] pt-2">
            <div className="flex items-center gap-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
                multiple
                disabled={loading || files.length >= MAX_FILES}
                onChange={handleFileSelection}
                className="hidden"
                id="post-media-input"
              />

              <label
                htmlFor="post-media-input"
                title="Add photos or videos"
                aria-label="Add photos or videos"
                className={`inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full rv-accent transition-colors hover:bg-[var(--accent-soft)] ${
                  loading || files.length >= MAX_FILES
                    ? "pointer-events-none opacity-40"
                    : ""
                }`}
              >
                <ImagePlus size={19} />
              </label>

              <span className="ml-1 text-[10px] rv-muted">
                {files.length > 0 ? `${files.length}/${MAX_FILES}` : ""}
              </span>
            </div>

            <button
              type="button"
              onClick={handlePublish}
              disabled={loading || (!content.trim() && files.length === 0)}
              aria-label="Publish post"
              className="rv-button-primary inline-flex h-9 items-center justify-center gap-2 rounded-full px-4 text-xs font-bold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? (
                <>
                  <LoaderCircle size={14} className="animate-spin" />
                  Posting
                </>
              ) : (
                <>
                  <Send size={14} />
                  Post
                </>
              )}
            </button>
          </div>

          {/* FEEDBACK */}
          {error && (
            <div
              role="alert"
              className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs leading-5 text-red-500"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="mt-3 rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2 text-xs leading-5 text-green-600"
            >
              {success}
            </div>
          )}

          <p className="mt-2 text-[10px] rv-muted">
            JPG, PNG, WEBP, MP4 and WEBM · Up to 4 files
          </p>
        </div>
      </div>
    </section>
  );
}
