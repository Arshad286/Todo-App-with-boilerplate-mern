import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useCommentContext } from '../../contexts/comment.provider';
import { Comment } from '../../types/comments';
import { AsyncError } from '../../types';

interface CommentListProps {
  taskId: string;
}

const CommentList: React.FC<CommentListProps> = ({ taskId }) => {
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string>('');
  const {
    getComments,
    commentsList = [], 
    isGetCommentsLoading,
    setCommentsList,
    deleteComment,
    updateComment,
  } = useCommentContext();

  useEffect(() => {
    if (!taskId) {
      return;
    }

    const fetchComments = async () => {
      try {
        await getComments(taskId);
      } catch (error) {
        toast.error((error as AsyncError).message);
      }
    };

    fetchComments();
  }, [taskId]); // Ensure that only `taskId` is in the dependency array

  const handleDeleteComment = (commentId: string) => {
    deleteComment(taskId, commentId)
      .then(() => {
        setCommentsList(commentsList.filter((comment) => comment.id !== commentId));
        toast.success('Comment deleted successfully');
      })
      .catch((error: AsyncError) => toast.error(error.message));
  };

  const handleEditComment = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditingComment(comment.comment);
  };

  const handleUpdateComment = () => {
    if (editingCommentId) {
      updateComment(editingCommentId, taskId, editingComment)
        .then((updatedComment) => {
          setCommentsList(
            commentsList.map((comment) =>
              comment.id === updatedComment.id ? updatedComment : comment
            )
          );
          setEditingCommentId(null);
          setEditingComment('');
          toast.success('Comment updated successfully');
        })
        .catch((error: AsyncError) => toast.error(error.message));
    }
  };

  return (
    <div className="mt-4">
      {isGetCommentsLoading && <p>Loading comments...</p>}
      {commentsList.length === 0 && !isGetCommentsLoading && <p>No comments available</p>}
      {commentsList.map((comment: Comment) => (
        <div key={comment.id} className="mb-4 p-2 border rounded">
          {editingCommentId === comment.id ? (
            <div>
              <textarea
                value={editingComment}
                onChange={(e) => setEditingComment(e.target.value)}
                className="w-full p-2 border rounded mb-2"
              />
              <button
                onClick={handleUpdateComment}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Update
              </button>
              <button
                onClick={() => setEditingCommentId(null)}
                className="ml-2 px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <div>
                <p className="mb-2">{comment.comment}</p>
                <p className="text-sm text-gray-500">
                  By {`${comment.account.firstName} ${comment.account.lastName} (${comment.account.username})`} at {new Date(comment.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <button
                  onClick={() => handleEditComment(comment)}
                  className="mr-2 px-4 py-2 bg-yellow-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentList;
