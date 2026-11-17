
"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  CalendarDays,
  Users,
  UserPlus,
  UserCheck,
  Loader2,
  Camera,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

import {
  getUserProfile,
  getUserPosts,
  UserProfile,
  UserPost,
} from "@/services/user.service";

import {
  followUser,
  unfollowUser,
  getFollowStatus,
  getFollowCounts,
  getFollowers,
  getFollowing,
  FollowCounts,
  FollowUser,
} from "@/services/follow.service";

import ProfilePostCard from "@/components/profile/ProfilePostCard";
import ProfileUserListModal from "@/components/profile/ProfileUserListModal";

type ListType = "followers" | "following";

export default function ProfilePageClient() {
  const params = useParams<{ username: string }>();
  const router = useRouter();
  const username = params.username;

  const { user } = useAuth();

  const isOwnProfile =
    user?.username?.toLowerCase() === username?.toLowerCase();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<UserPost[]>([]);

  const [counts, setCounts] = useState<FollowCounts>({
    followersCount: 0,
    followingCount: 0,
  });

  const [isFollowing, setIsFollowing] = useState(false);

  const [profileLoading, setProfileLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  const [hasMorePosts, setHasMorePosts] = useState(false);
  const [postPage, setPostPage] = useState(0);

  const [error, setError] = useState("");

  // Followers / Following modal state
  const [listType, setListType] = useState<ListType | null>(null);
  const [listUsers, setListUsers] = useState<FollowUser[]>([]);
  const [listPage, setListPage] = useState(0);
  const [listHasMore, setListHasMore] = useState(false);
  const [listLoading, setListLoading] = useState(false);

  // Load profile details
  const loadProfile = useCallback(async () => {
    if (!username) return;

    setProfileLoading(true);
    setError("");

    try {
      const result = await getUserProfile(username);
      setProfile(result);
    } catch (err) {
      console.error("Profile loading error:", err);
      setError("Unable to load this profile. Please try again.");
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  }, [username]);

  // Load followers and following counts and follow status
  const loadFollowDetails = useCallback(async () => {
    if (!username) return;

    try {
      const result = await getFollowCounts(username);
      setCounts(result);

      if (!isOwnProfile && user) {
        const status = await getFollowStatus(username);
        setIsFollowing(status);
      } else {
        setIsFollowing(false);
      }
    } catch (err) {
      console.error("Follow details loading error:", err);
    }
  }, [username, isOwnProfile, user]);

  // Load profile posts
  const loadPosts = useCallback(
    async (page = 0, append = false) => {
      if (!username) return;

      setPostsLoading(true);

      try {
        const result = await getUserPosts(username, page, 10);

        setPosts((previous) =>
          append ? [...previous, ...result.content] : result.content
        );

        setPostPage(result.page);
        setHasMorePosts(!result.last);
      } catch (err) {
        console.error("User posts loading error:", err);
      } finally {
        setPostsLoading(false);
      }
    },
    [username]
  );

  useEffect(() => {
    setProfile(null);
    setPosts([]);
    setCounts({
      followersCount: 0,
      followingCount: 0,
    });
    setPostPage(0);
    setHasMorePosts(false);

    loadProfile();
    loadFollowDetails();
    loadPosts(0);
  }, [loadProfile, loadFollowDetails, loadPosts]);

  // Follow / Unfollow
  const handleFollowToggle = async () => {
    if (followLoading || isOwnProfile) return;

    const previousFollowing = isFollowing;

    setFollowLoading(true);
    setError("");

    // Optimistic update
    setIsFollowing(!previousFollowing);

    setCounts((previous) => ({
      ...previous,
      followersCount: Math.max(
        0,
        previous.followersCount + (previousFollowing ? -1 : 1)
      ),
    }));

    try {
      if (previousFollowing) {
        await unfollowUser(username);
      } else {
        await followUser(username);
      }
    } catch (err) {
      console.error("Follow update error:", err);

      // Restore previous state if API fails
      setIsFollowing(previousFollowing);

      setCounts((previous) => ({
        ...previous,
        followersCount: Math.max(
          0,
          previous.followersCount + (previousFollowing ? 1 : -1)
        ),
      }));

      setError("Unable to update follow status. Please try again.");
    } finally {
      setFollowLoading(false);
    }
  };

  // Load followers / following list
  const loadUserList = async (
    type: ListType,
    page = 0,
    append = false
  ) => {
    setListLoading(true);

    try {
      const result =
        type === "followers"
          ? await getFollowers(username, page, 10)
          : await getFollowing(username, page, 10);

      setListUsers((previous) =>
        append ? [...previous, ...result.content] : result.content
      );

      setListPage(result.page);
      setListHasMore(!result.last);
    } catch (err) {
      console.error(`${type} loading error:`, err);
    } finally {
      setListLoading(false);
    }
  };

  const openUserList = async (type: ListType) => {
    setListType(type);
    setListUsers([]);
    setListPage(0);
    setListHasMore(false);

    await loadUserList(type, 0);
  };

  const closeUserList = () => {
    setListType(null);
    setListUsers([]);
  };

  const openUserProfile = (selectedUsername: string) => {
    closeUserList();
    router.push(`/profile/${encodeURIComponent(selectedUsername)}`);
  };

  const handlePostDeleted = (postId: number) => {
    setPosts((previous) =>
      previous.filter((post) => post.id !== postId)
    );
  };

  const getInitial = (name: string) =>
    name?.trim()?.charAt(0)?.toUpperCase() || "?";

  const formatDate = (date: string) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric",
    });
  };

  if (profileLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin rv-accent" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rv-card rounded-2xl p-8 text-center">
        <Users size={32} className="mx-auto rv-muted" />

        <h2 className="mt-4 text-xl font-bold rv-text">
          Profile unavailable
        </h2>

        <p className="mt-2 text-sm rv-secondary">
          {error || "This user profile could not be found."}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full space-y-5 rv-fade-in sm:space-y-6">
      {/* Profile card */}
      <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
        {/* Cover */}
        <div className="relative h-36 overflow-hidden bg-gradient-to-br from-amber-500/35 via-amber-400/10 to-[var(--surface-elevated)] sm:h-44">
          <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-[var(--accent)]/10 blur-3xl" />
        </div>

        <div className="px-4 pb-5 sm:px-6 sm:pb-6">
          {/* Avatar and follow action */}
          <div className="-mt-12 flex items-end justify-between gap-3 sm:-mt-14">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-[5px] border-[var(--surface)] bg-[var(--accent)] text-3xl font-black text-slate-950 shadow-lg sm:h-28 sm:w-28 sm:text-4xl">
              {profile.profileImageUrl ? (
                <img
                  src={profile.profileImageUrl}
                  alt={profile.displayName || profile.username}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              ) : (
                getInitial(profile.displayName || profile.username)
              )}
            </div>

            {!isOwnProfile && user && (
              <button
                type="button"
                onClick={handleFollowToggle}
                disabled={followLoading}
                className={`mb-1 flex min-h-10 items-center justify-center gap-2 rounded-full px-5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  isFollowing
                    ? "border border-[var(--border)] bg-[var(--surface-hover)] rv-text hover:border-red-500/40 hover:text-red-500"
                    : "rv-button-primary"
                }`}
              >
                {followLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : isFollowing ? (
                  <UserCheck size={16} />
                ) : (
                  <UserPlus size={16} />
                )}

                {isFollowing ? "Following" : "Follow"}
              </button>
            )}
          </div>

          {/* Name and profile details */}
          <div className="mt-4">
            <h1 className="text-2xl font-black tracking-tight rv-text sm:text-3xl">
              {profile.displayName}
            </h1>

            <p className="mt-1 text-sm rv-secondary">
              @{profile.username}
            </p>

            {profile.bio && (
              <p className="mt-4 max-w-2xl whitespace-pre-wrap break-words text-sm leading-6 rv-text">
                {profile.bio}
              </p>
            )}

            {profile.createdAt && (
              <div className="mt-4 flex items-center gap-2 text-xs rv-muted">
                <CalendarDays size={15} className="rv-accent" />
                <span>Joined {formatDate(profile.createdAt)}</span>
              </div>
            )}
          </div>

          {/* Profile statistics */}
          <div className="mt-6 grid grid-cols-3 border-t border-[var(--border)] pt-5">
            <div className="px-1 text-center">
              <p className="text-2xl font-black rv-text">
                {posts.length}
              </p>
              <p className="mt-1 text-xs rv-muted">Posts</p>
            </div>

            <button
              type="button"
              onClick={() => openUserList("followers")}
              className="rounded-xl border-x border-[var(--border)] px-1 text-center transition hover:bg-[var(--surface-hover)]"
            >
              <p className="text-2xl font-black rv-text">
                {counts.followersCount}
              </p>
              <p className="mt-1 text-xs rv-muted">Followers</p>
            </button>

            <button
              type="button"
              onClick={() => openUserList("following")}
              className="rounded-xl px-1 text-center transition hover:bg-[var(--surface-hover)]"
            >
              <p className="text-2xl font-black rv-text">
                {counts.followingCount}
              </p>
              <p className="mt-1 text-xs rv-muted">Following</p>
            </button>
          </div>
        </div>
      </section>

      {/* Error message */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-500"
        >
          {error}
        </div>
      )}

      {/* Posts section */}
      <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <header className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-4 sm:px-5">
          <div>
            <h2 className="text-lg font-bold rv-text">Posts</h2>
            <p className="mt-0.5 text-xs rv-muted">
              {isOwnProfile
                ? "Your activity in RahulVerse"
                : `Posts by ${profile.displayName}`}
            </p>
          </div>

          <span className="rounded-lg bg-[var(--surface-hover)] px-3 py-1.5 text-xs font-semibold rv-secondary">
            {posts.length}
          </span>
        </header>

        <div className="space-y-3 p-3 sm:space-y-4 sm:p-4">
          {postsLoading && posts.length === 0 ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-7 w-7 animate-spin rv-accent" />
            </div>
          ) : posts.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--surface-hover)]">
                <Camera size={25} className="rv-muted" />
              </div>

              <h3 className="mt-4 text-base font-bold rv-text">
                No posts yet
              </h3>

              <p className="mt-1 text-sm rv-secondary">
                {isOwnProfile
                  ? "Your posts will appear here when you share something."
                  : "This user has not shared any posts yet."}
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <ProfilePostCard
                key={post.id}
                post={post}
                isOwnProfile={isOwnProfile}
                onPostUpdated={() => loadPosts(0)}
                onPostDeleted={handlePostDeleted}
              />
            ))
          )}

          {postsLoading && posts.length > 0 && (
            <div className="flex justify-center py-3">
              <Loader2 className="h-5 w-5 animate-spin rv-accent" />
            </div>
          )}
        </div>

        {hasMorePosts && (
          <div className="border-t border-[var(--border)] p-4">
            <button
              type="button"
              onClick={() => loadPosts(postPage + 1, true)}
              disabled={postsLoading}
              className="w-full rounded-xl border border-[var(--border)] py-3 text-sm font-semibold rv-secondary transition hover:border-[var(--accent)] hover:rv-accent disabled:opacity-50"
            >
              {postsLoading ? "Loading..." : "Load more posts"}
            </button>
          </div>
        )}
      </section>

      {/* Followers / Following modal */}
      <ProfileUserListModal
        listType={listType}
        users={listUsers}
        loading={listLoading}
        hasMore={listHasMore}
        onClose={closeUserList}
        onLoadMore={() => {
          if (listType) {
            loadUserList(listType, listPage + 1, true);
          }
        }}
        onSelectUser={openUserProfile}
      />
    </div>
  );
}
