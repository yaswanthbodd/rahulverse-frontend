
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Avatar,
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  Check,
  ChevronDown,
  MessageCircle,
  Pencil,
  Send,
  Trash2,
  X,
} from "lucide-react";

import {
  Comment,
  CommentPage,
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from "@/services/comment.service";

import { useAuth } from "@/context/AuthContext";

interface CommentSectionProps {
  postId: number;
  onCountChange?: (count: number) => void;
}

export default function CommentSection({
  postId,
  onCountChange,
}: CommentSectionProps) {
  const { user } = useAuth();

  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const getInitial = (name: string | null | undefined) =>
    name?.trim()?.charAt(0)?.toUpperCase() || "U";

  const loadComments = useCallback(
    async (requestedPage = 0, append = false) => {
      setLoading(true);
      setError("");

      try {
        const result: CommentPage = await getComments(
          postId,
          requestedPage,
          10
        );

        setComments((previous) =>
          append ? [...previous, ...result.content] : result.content
        );

        setPage(result.page);
        setTotalPages(result.totalPages);
        setTotalElements(result.totalElements);

        onCountChange?.(result.totalElements);
      } catch (err: unknown) {
        console.error("Comments loading error:", err);
        setError("Unable to load comments. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [postId, onCountChange]
  );

  useEffect(() => {
    loadComments(0);
  }, [loadComments]);

  const handleCreateComment = async () => {
    const trimmedContent = content.trim();

    if (!trimmedContent || submitting) return;

    if (trimmedContent.length > 2000) {
      setError("Comment cannot exceed 2000 characters.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const created = await createComment(postId, trimmedContent);

      setComments((previous) => [created, ...previous]);

      const nextCount = totalElements + 1;
      setTotalElements(nextCount);
      onCountChange?.(nextCount);

      setContent("");
    } catch (err: unknown) {
      console.error("Comment creation error:", err);
      setError("Unable to publish your comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const startEditing = (comment: Comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
    setError("");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditContent("");
  };

  const handleUpdateComment = async (commentId: number) => {
    const trimmedContent = editContent.trim();

    if (!trimmedContent) {
      setError("Comment cannot be empty.");
      return;
    }

    if (trimmedContent.length > 2000) {
      setError("Comment cannot exceed 2000 characters.");
      return;
    }

    setError("");

    try {
      const updated = await updateComment(commentId, trimmedContent);

      setComments((previous) =>
        previous.map((comment) =>
          comment.id === commentId ? updated : comment
        )
      );

      cancelEditing();
    } catch (err: unknown) {
      console.error("Comment update error:", err);
      setError("Unable to update this comment. You may not be its owner.");
    }
  };

  const handleDeleteComment = async () => {
    if (deleteTarget === null || deleting) return;

    const commentId = deleteTarget;

    setDeleting(true);
    setError("");

    try {
      await deleteComment(commentId);

      setComments((previous) =>
        previous.filter((comment) => comment.id !== commentId)
      );

      const nextCount = Math.max(0, totalElements - 1);
      setTotalElements(nextCount);
      onCountChange?.(nextCount);

      if (editingId === commentId) {
        cancelEditing();
      }

      setDeleteTarget(null);
    } catch (err: unknown) {
      console.error("Comment deletion error:", err);
      setError("Unable to delete this comment. You may not be its owner.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box sx={{ mt: 1.5, pt: 1.5, borderTop: "1px solid var(--border)" }}>

      {/* COMMENTS HEADER */}
      <Stack
        direction="row"
        spacing={0.8}
        sx={{ mb: 1.5, alignItems: "center" }}
      >
        <MessageCircle size={16} color="#fbbf24" />

        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            color: "var(--text-primary)",
          }}
        >
          Comments ({totalElements})
        </Typography>
      </Stack>

      {/* CREATE COMMENT */}
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: "flex-start" }}
      >
        <Avatar
          src={user?.profileImageUrl || undefined}
          alt={user?.displayName || "User"}
          slotProps={{
            img: {
              referrerPolicy: "no-referrer",
            },
          }}
          sx={{
            width: 32,
            height: 32,
            bgcolor: "#b45309",
            color: "#fff",
            fontSize: 13,
            fontWeight: 700,
            border: "1px solid rgba(251,191,36,0.4)",
          }}
        >
          {getInitial(user?.displayName)}
        </Avatar>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <TextField
            fullWidth
            multiline
            minRows={1}
            maxRows={4}
            value={content}
            onChange={(event) => {
              setContent(event.target.value);
              setError("");
            }}
            placeholder="Write a comment..."
            disabled={submitting}
            slotProps={{
              htmlInput: { maxLength: 2000 },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "var(--text-primary)",
                backgroundColor: "var(--background)",
                borderRadius: 2,
                fontSize: "0.85rem",
                padding: "9px 11px",
                "& fieldset": { borderColor: "var(--border)" },
                "&:hover fieldset": { borderColor: "#d97706" },
                "&.Mui-focused fieldset": { borderColor: "#fbbf24" },
              },
              "& textarea::placeholder": {
                color: "var(--text-muted)",
                opacity: 1,
              },
            }}
          />

          <Stack
            direction="row"
            spacing={1}
            sx={{
              mt: 0.8,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: "var(--text-muted)", fontSize: "0.7rem" }}
            >
              {content.length}/2000
            </Typography>

            <Button
              size="small"
              variant="contained"
              onClick={handleCreateComment}
              disabled={!content.trim() || submitting}
              endIcon={
                submitting ? (
                  <CircularProgress size={13} color="inherit" />
                ) : (
                  <Send size={13} />
                )
              }
              sx={{
                minWidth: 0,
                px: 1.5,
                py: 0.55,
                fontSize: "0.75rem",
                bgcolor: "#fbbf24",
                color: "#111827",
                textTransform: "none",
                fontWeight: 700,
                borderRadius: 1.5,
                "&:hover": { bgcolor: "#f59e0b" },
                "&.Mui-disabled": {
                  bgcolor: "#6b7280",
                  color: "#d1d5db",
                },
              }}
            >
              {submitting ? "Posting..." : "Post"}
            </Button>
          </Stack>
        </Box>
      </Stack>

      {/* ERROR MESSAGE */}
      {error && (
        <Alert severity="error" sx={{ mt: 1.5, py: 0 }}>
          {error}
        </Alert>
      )}

      {/* LOADING */}
      {loading && comments.length === 0 && (
        <Stack spacing={1} sx={{ py: 3, alignItems: "center" }}>
          <CircularProgress size={22} sx={{ color: "#fbbf24" }} />

          <Typography
            variant="caption"
            sx={{ color: "var(--text-secondary)" }}
          >
            Loading comments...
          </Typography>
        </Stack>
      )}

      {/* EMPTY STATE */}
      {!loading && comments.length === 0 && !error && (
        <Paper
          elevation={0}
          sx={{
            mt: 2,
            p: 2,
            textAlign: "center",
            bgcolor: "var(--background)",
            border: "1px solid var(--border)",
            borderRadius: 2,
          }}
        >
          <MessageCircle size={23} color="#6b7280" />

          <Typography
            variant="body2"
            sx={{ mt: 0.5, color: "var(--text-primary)", fontWeight: 600 }}
          >
            No comments yet.
          </Typography>

          <Typography
            variant="caption"
            sx={{ color: "var(--text-secondary)" }}
          >
            Start the conversation!
          </Typography>
        </Paper>
      )}

      {/* COMMENTS LIST */}
      <Stack spacing={1.2} sx={{ mt: 2 }}>
        {comments.map((comment) => {
          const isOwner = user?.id === comment.userId;
          const isEditing = editingId === comment.id;
          const displayName =
            comment.displayName || comment.username || "User";

          return (
            <Paper
              key={comment.id}
              elevation={0}
              sx={{
                p: 1.5,
                bgcolor: "var(--background)",
                border: "1px solid var(--border)",
                borderRadius: 2,
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                sx={{ alignItems: "flex-start" }}
              >
                {/* ACTUAL COMMENT AUTHOR AVATAR */}
                <Avatar
                  src={comment.profileImageUrl || undefined}
                  alt={displayName}
                  slotProps={{
                    img: {
                      referrerPolicy: "no-referrer",
                    },
                  }}
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: "#b45309",
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 700,
                    border: "1px solid rgba(251,191,36,0.4)",
                  }}
                >
                  {getInitial(displayName)}
                </Avatar>

                <Box sx={{ flex: 1, minWidth: 0 }}>

                  {/* USER IDENTITY */}
                  <Stack
                    direction="row"
                    spacing={0.7}
                    sx={{
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <Link
                      href={`/profile/${comment.username}`}
                      className="font-bold text-xs transition hover:text-amber-400"
                      style={{
                        color: "var(--text-primary)",
                        textDecoration: "none",
                      }}
                    >
                      {displayName}
                    </Link>

                    <Typography
                      variant="caption"
                      sx={{
                        color: "var(--text-muted)",
                        fontSize: "0.68rem",
                      }}
                    >
                      @{comment.username || "user"}
                    </Typography>

                    <Typography
                      variant="caption"
                      sx={{
                        color: "var(--text-muted)",
                        fontSize: "0.68rem",
                      }}
                    >
                      · {new Date(comment.createdAt).toLocaleDateString()}
                    </Typography>
                  </Stack>

                  {/* EDIT COMMENT */}
                  {isEditing && isOwner ? (
                    <Box sx={{ mt: 1 }}>
                      <TextField
                        fullWidth
                        multiline
                        minRows={1}
                        maxRows={4}
                        value={editContent}
                        onChange={(event) =>
                          setEditContent(event.target.value)
                        }
                        slotProps={{
                          htmlInput: { maxLength: 2000 },
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            color: "var(--text-primary)",
                            bgcolor: "var(--surface)",
                            borderRadius: 2,
                            fontSize: "0.85rem",
                            padding: "8px 10px",
                            "& fieldset": {
                              borderColor: "var(--border)",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#fbbf24",
                            },
                          },
                        }}
                      />

                      <Stack
                        direction="row"
                        spacing={0.5}
                        sx={{ mt: 0.8, justifyContent: "flex-end" }}
                      >
                        <Button
                          size="small"
                          onClick={cancelEditing}
                          startIcon={<X size={13} />}
                          sx={{
                            minWidth: 0,
                            fontSize: "0.7rem",
                            color: "var(--text-secondary)",
                            textTransform: "none",
                          }}
                        >
                          Cancel
                        </Button>

                        <Button
                          size="small"
                          variant="contained"
                          disabled={!editContent.trim()}
                          onClick={() => handleUpdateComment(comment.id)}
                          startIcon={<Check size={13} />}
                          sx={{
                            minWidth: 0,
                            fontSize: "0.7rem",
                            px: 1.2,
                            bgcolor: "#fbbf24",
                            color: "#111827",
                            textTransform: "none",
                            "&:hover": { bgcolor: "#f59e0b" },
                          }}
                        >
                          Save
                        </Button>
                      </Stack>
                    </Box>
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{
                        mt: 0.7,
                        color: "var(--text-secondary)",
                        whiteSpace: "pre-wrap",
                        overflowWrap: "anywhere",
                        lineHeight: 1.6,
                        fontSize: "0.82rem",
                      }}
                    >
                      {comment.content}
                    </Typography>
                  )}
                </Box>

                {/* OWNER ACTIONS */}
                {isOwner && !isEditing && (
                  <Stack direction="row" spacing={0}>
                    <Tooltip title="Edit comment">
                      <IconButton
                        size="small"
                        onClick={() => startEditing(comment)}
                        sx={{
                          p: 0.6,
                          color: "var(--text-muted)",
                          "&:hover": { color: "#fbbf24" },
                        }}
                      >
                        <Pencil size={15} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete comment">
                      <IconButton
                        size="small"
                        onClick={() => setDeleteTarget(comment.id)}
                        sx={{
                          p: 0.6,
                          color: "var(--text-muted)",
                          "&:hover": { color: "#f87171" },
                        }}
                      >
                        <Trash2 size={15} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                )}
              </Stack>
            </Paper>
          );
        })}
      </Stack>

      {/* LOAD MORE */}
      {!loading && page + 1 < totalPages && (
        <Button
          fullWidth
          size="small"
          onClick={() => loadComments(page + 1, true)}
          startIcon={<ChevronDown size={15} />}
          sx={{
            mt: 1.5,
            py: 0.8,
            fontSize: "0.75rem",
            color: "var(--text-secondary)",
            border: "1px solid var(--border)",
            textTransform: "none",
            "&:hover": {
              borderColor: "#fbbf24",
              color: "#fbbf24",
            },
          }}
        >
          Load more comments
        </Button>
      )}

      {loading && comments.length > 0 && (
        <Stack sx={{ py: 1.5, alignItems: "center" }}>
          <CircularProgress size={19} sx={{ color: "#fbbf24" }} />
        </Stack>
      )}

      {/* DELETE CONFIRMATION */}
      <Dialog
        open={deleteTarget !== null}
        onClose={() => {
          if (!deleting) setDeleteTarget(null);
        }}
        slotProps={{
          paper: {
            sx: {
              bgcolor: "var(--surface)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
              borderRadius: 3,
            },
          },
        }}
      >
        <DialogTitle sx={{ fontSize: "1rem" }}>
          Delete comment?
        </DialogTitle>

        <DialogContent>
          <DialogContentText
            sx={{
              color: "var(--text-secondary)",
              fontSize: "0.85rem",
            }}
          >
            Are you sure you want to delete this comment? This action cannot be undone.
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ p: 1.5 }}>
          <Button
            size="small"
            onClick={() => setDeleteTarget(null)}
            disabled={deleting}
            sx={{
              color: "var(--text-secondary)",
              textTransform: "none",
            }}
          >
            Cancel
          </Button>

          <Button
            size="small"
            onClick={handleDeleteComment}
            disabled={deleting}
            variant="contained"
            color="error"
            sx={{ textTransform: "none" }}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
