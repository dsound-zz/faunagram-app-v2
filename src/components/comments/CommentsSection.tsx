import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth';
import { commentsApi } from '../../api/comments';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { Comment } from '../../types';

interface CommentsSectionProps {
  commentableType: string;
  commentableId: number;
}

export function CommentsSection({ commentableType, commentableId }: CommentsSectionProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState('');
  const [showReplyForm, setShowReplyForm] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', commentableType, commentableId],
    queryFn: () => commentsApi.getAll(commentableType, commentableId),
  });

  const createMutation = useMutation({
    mutationFn: (body: string) =>
      commentsApi.create({
        body,
        commentable_type: commentableType,
        commentable_id: commentableId,
        username: user?.username,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', commentableType, commentableId] });
      queryClient.invalidateQueries({ queryKey: ['sightings'] });
      setNewComment('');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => commentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', commentableType, commentableId] });
      queryClient.invalidateQueries({ queryKey: ['sightings'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    createMutation.mutate(newComment);
  };

  const handleReply = (parentCommentId: number) => {
    if (!replyText.trim() || !user) return;
    
    commentsApi
      .create({
        body: replyText,
        commentable_type: 'Comment',
        commentable_id: parentCommentId,
        username: user.username,
      })
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['comments', commentableType, commentableId] });
        setReplyText('');
        setShowReplyForm(null);
      });
  };

  if (!user) {
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-button text-center text-gray-600">
        <p>Please log in to view and add comments.</p>
      </div>
    );
  }

  return (
    <div className="mt-6 border-t-2 border-gray-200 pt-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Comments {comments && comments.length > 0 && `(${comments.length})`}
      </h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <Avatar src={user.avatar_url} alt={user.username} size="sm" />
          <div className="flex-1">
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="mb-2"
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!newComment.trim() || createMutation.isPending}
            >
              Post Comment
            </Button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      {isLoading ? (
        <div className="text-center py-4">
          <p className="text-gray-600">Loading comments...</p>
        </div>
      ) : !comments || comments.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onDelete={() => {
                if (confirm('Delete this comment?')) {
                  deleteMutation.mutate(comment.id);
                }
              }}
              canDelete={user.id === comment.user_id}
              showReplyForm={showReplyForm === comment.id}
              onToggleReply={() => setShowReplyForm(showReplyForm === comment.id ? null : comment.id)}
              replyText={replyText}
              onReplyTextChange={setReplyText}
              onReply={() => handleReply(comment.id)}
              currentUser={user}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface CommentItemProps {
  comment: Comment;
  onDelete: () => void;
  canDelete: boolean;
  showReplyForm: boolean;
  onToggleReply: () => void;
  replyText: string;
  onReplyTextChange: (text: string) => void;
  onReply: () => void;
  currentUser: { id: number; username: string; avatar_url?: string };
}

function CommentItem({
  comment,
  onDelete,
  canDelete,
  showReplyForm,
  onToggleReply,
  replyText,
  onReplyTextChange,
  onReply,
  currentUser,
}: CommentItemProps) {
  const [replies, setReplies] = useState<Comment[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);

  const loadReplies = async () => {
    if (replies.length > 0) return; // Already loaded
    setLoadingReplies(true);
    try {
      const data = await commentsApi.getReplies(comment.id);
      setReplies(data);
    } catch (error) {
      console.error('Error loading replies:', error);
    } finally {
      setLoadingReplies(false);
    }
  };

  return (
    <div className="border-l-2 border-gray-200 pl-4">
      <div className="flex items-start gap-2">
        <Avatar
          src={comment.user?.avatar_url}
          alt={comment.user?.username || comment.username || 'User'}
          size="sm"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-gray-800">
              {comment.user?.username || comment.username || 'Anonymous'}
            </span>
            <span className="text-sm text-gray-500">
              {new Date(comment.created_at).toLocaleDateString()}
            </span>
            {canDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="text-red-600 hover:text-red-700 text-xs"
              >
                Delete
              </Button>
            )}
          </div>
          <p className="text-gray-700 mb-2">{comment.body}</p>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onToggleReply}>
              Reply
            </Button>
            {comment.commentable_type === 'Sighting' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={loadReplies}
                disabled={loadingReplies}
              >
                {loadingReplies ? 'Loading...' : `View Replies (${replies.length})`}
              </Button>
            )}
          </div>

          {/* Reply Form */}
          {showReplyForm && (
            <div className="mt-3 ml-4 border-l-2 border-primary/30 pl-4">
              <div className="flex gap-2">
                <Avatar src={currentUser.avatar_url} alt={currentUser.username} size="sm" />
                <div className="flex-1">
                  <Input
                    value={replyText}
                    onChange={(e) => onReplyTextChange(e.target.value)}
                    placeholder="Write a reply..."
                    className="mb-2"
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={onReply}
                      disabled={!replyText.trim()}
                    >
                      Post Reply
                    </Button>
                    <Button variant="ghost" size="sm" onClick={onToggleReply}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Nested Replies */}
          {replies.length > 0 && (
            <div className="mt-3 ml-4 space-y-3">
              {replies.map((reply) => (
                <div key={reply.id} className="border-l-2 border-gray-200 pl-4">
                  <div className="flex items-start gap-2">
                    <Avatar
                      src={reply.user?.avatar_url}
                      alt={reply.user?.username || reply.username || 'User'}
                      size="sm"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-800 text-sm">
                          {reply.user?.username || reply.username || 'Anonymous'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(reply.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{reply.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

