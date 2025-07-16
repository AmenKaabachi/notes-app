'use client';

import { useState } from 'react';
import { Note } from '../types/note';
import { formatDistanceToNow } from 'date-fns';
import { Pin, Tag } from 'lucide-react';
import UseAnimations from 'react-useanimations';
import edit from 'react-useanimations/lib/edit';
import trash2 from 'react-useanimations/lib/trash2';
import bookmark from 'react-useanimations/lib/bookmark';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onView?: (note: Note) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onEdit,
  onDelete,
  onTogglePin,
  onView,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    onDelete(note.id);
    setShowDeleteConfirm(false);
  };

  return (
    <div 
      className="group relative glass-effect rounded-2xl p-6 card-hover animate-fade-in cursor-pointer overflow-hidden border border-white/20 dark:border-gray-700/50 backdrop-blur-sm"
      onClick={() => onView?.(note)}
    >
      {/* Gradient overlay for pinned notes */}
      {note.isPinned && (
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-orange-400/10 rounded-2xl"></div>
      )}
      
      {/* Top decorative line */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
        note.isPinned 
          ? 'from-yellow-400 to-orange-400' 
          : 'from-blue-400 to-purple-400'
      }`}></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
            {note.title || 'Untitled Note'}
          </h3>
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onTogglePin(note.id)}
              className={`p-2 rounded-full hover:bg-white/20 dark:hover:bg-gray-700/50 transition-all duration-300 ${
                note.isPinned ? 'text-yellow-500' : 'text-gray-400'
              }`}
            >
              <UseAnimations 
                animation={bookmark} 
                size={18} 
                reverse={note.isPinned}
                strokeColor="currentColor"
              />
            </button>
            <button
              onClick={() => onEdit(note)}
              className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 text-gray-400 hover:text-blue-500"
            >
              <UseAnimations 
                animation={edit} 
                size={18} 
                strokeColor="currentColor"
              />
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 text-gray-400 hover:text-red-500"
            >
              <UseAnimations 
                animation={trash2} 
                size={18} 
                strokeColor="currentColor"
              />
            </button>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 leading-relaxed">
            {note.content || 'No content'}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {note.category && (
              <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 text-blue-800 dark:text-blue-200 text-xs rounded-full font-medium">
                {note.category}
              </span>
            )}
            {note.tags.length > 0 && (
              <div className="flex items-center space-x-1">
                <Tag size={12} className="text-gray-400" />
                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                  {note.tags.length}
                </span>
              </div>
            )}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-full">
            {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
          </span>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="glass-effect rounded-2xl p-6 max-w-sm mx-4 animate-bounce-in border border-white/20 dark:border-gray-700/50">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                <UseAnimations 
                  animation={trash2} 
                  size={24} 
                  strokeColor="#ef4444"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Delete Note
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to delete this note? This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};