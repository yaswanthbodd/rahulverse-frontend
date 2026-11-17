
"use client";

import { Loader2, X } from "lucide-react";
import type { FollowUser } from "@/services/follow.service";

type ListType = "followers" | "following";

interface ProfileUserListModalProps {
  listType: ListType | null;
  users: FollowUser[];
  loading: boolean;
  hasMore: boolean;
  onClose: () => void;
  onLoadMore: () => void;
  onSelectUser: (username: string) => void;
}

export default function ProfileUserListModal({
  listType,
  users,
  loading,
  hasMore,
  onClose,
  onLoadMore,
  onSelectUser,
}: ProfileUserListModalProps) {
  if (!listType) return null;

  const getInitial = (name: string) =>
    name?.trim()?.charAt(0)?.toUpperCase() || "?";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label={listType}
        className="flex max-h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-[var(--border)] p-4">
          <div>
            <h2 className="text-lg font-bold capitalize rv-text">
              {listType}
            </h2>
            <p className="mt-0.5 text-xs rv-muted">
              People in this community
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rv-icon-button h-9 w-9"
          >
            <X size={18} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-3">
          {users.map((person) => (
            <button
              key={person.id}
              type="button"
              onClick={() => onSelectUser(person.username)}
              className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-[var(--surface-hover)]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--accent)]/30 bg-[var(--accent-soft)] text-sm font-bold rv-accent">
                {person.profileImageUrl ? (
                  <img
                    src={person.profileImageUrl}
                    alt={person.displayname}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  getInitial(person.displayname || person.username)
                )}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold rv-text">
                  {person.displayname}
                </p>
                <p className="truncate text-xs rv-muted">
                  @{person.username}
                </p>
              </div>
            </button>
          ))}

          {!loading && users.length === 0 && (
            <p className="py-10 text-center text-sm rv-secondary">
              No {listType} yet.
            </p>
          )}

          {loading && (
            <div className="flex justify-center py-5">
              <Loader2 className="h-6 w-6 animate-spin rv-accent" />
            </div>
          )}
        </div>

        {hasMore && !loading && (
          <footer className="border-t border-[var(--border)] p-3">
            <button
              type="button"
              onClick={onLoadMore}
              className="w-full rounded-xl border border-[var(--border)] py-2.5 text-sm font-semibold rv-secondary transition hover:border-[var(--accent)] hover:rv-accent"
            >
              Load more
            </button>
          </footer>
        )}
      </section>
    </div>
  );
}
