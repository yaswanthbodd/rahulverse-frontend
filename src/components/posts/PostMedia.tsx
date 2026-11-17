
"use client";

interface PostMediaItem {
  id: number;
  mediaUrl: string;
  mediaType: string;
  format: string;
  sortOrder: number;
}

interface PostMediaProps {
  media: PostMediaItem[];
}

export default function PostMedia({ media }: PostMediaProps) {
  if (!media || media.length === 0) {
    return null;
  }

  const sortedMedia = [...media].sort(
    (a, b) => a.sortOrder - b.sortOrder
  );

  const isSingleMedia = sortedMedia.length === 1;

  return (
    <div
      className={`mt-3 grid w-full min-w-0 gap-2 overflow-hidden ${
        isSingleMedia
          ? "grid-cols-1"
          : "grid-cols-2"
      }`}
    >
      {sortedMedia.map((item) => {
        if (item.mediaType === "image") {
          return (
            <div
              key={item.id}
              className={`min-w-0 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] ${
                isSingleMedia
                  ? "w-full"
                  : "aspect-[4/3]"
              }`}
            >
              <img
                src={item.mediaUrl}
                alt={`Post image ${item.sortOrder + 1}`}
                loading="lazy"
                className={`block w-full ${
                  isSingleMedia
                    ? "h-auto max-h-[520px] object-contain"
                    : "h-full object-cover"
                }`}
              />
            </div>
          );
        }

        if (item.mediaType === "video") {
          return (
            <div
              key={item.id}
              className={`min-w-0 overflow-hidden rounded-xl border border-[var(--border)] bg-black ${
                isSingleMedia
                  ? "w-full"
                  : "aspect-[4/3]"
              }`}
            >
              <video
                src={item.mediaUrl}
                controls
                playsInline
                preload="metadata"
                className={`block w-full ${
                  isSingleMedia
                    ? "max-h-[520px]"
                    : "h-full object-contain"
                }`}
              >
                Your browser does not support video playback.
              </video>
            </div>
          );
        }

        return (
          <a
            key={item.id}
            href={item.mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="flex min-w-0 items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-3 transition-colors hover:border-[var(--accent)]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)]">
              <span className="text-sm font-bold rv-accent">
                {item.format.toUpperCase().slice(0, 3)}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold rv-text">
                Attachment
              </p>

              <p className="text-xs rv-muted">
                {item.format.toUpperCase()} file
              </p>
            </div>

            <span className="shrink-0 text-xs font-semibold rv-accent">
              Download
            </span>
          </a>
        );
      })}
    </div>
  );
}
