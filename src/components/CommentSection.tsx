import { useState } from 'react'
import { MessageCircle, Send, User } from 'lucide-react'
import { Comment } from '../types'

export default function CommentSection() {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')

  const addComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        text: newComment.trim(),
        timestamp: new Date(),
        author: 'You'
      }
      setComments([...comments, comment])
      setNewComment('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      addComment()
    }
  }

  return (
    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
        <MessageCircle className="h-5 w-5 text-crella-600" />
        <span>Comments & Notes</span>
      </h3>

      {/* Add Comment */}
      <div className="mb-4">
        <div className="flex space-x-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a comment or note about this analysis..."
            className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-crella-500 focus:border-transparent resize-none"
            rows={3}
          />
          <button
            onClick={addComment}
            disabled={!newComment.trim()}
            className="px-4 py-2 bg-crella-600 hover:bg-crella-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center space-x-2 h-fit"
          >
            <Send className="h-4 w-4" />
            <span>Post</span>
          </button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-3">
        {comments.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm italic text-center py-4">
            No comments yet. Add your thoughts about this analysis.
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-crella-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
                      {comment.author}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {comment.timestamp.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {comment.text}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
