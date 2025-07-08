'use client';

import { useState } from 'react';
import { Note } from '../types/note';
import { formatDistanceToNow } from 'date-fns';
import { X, Pin, PinOff, Calendar, Tag, Folder } from 'lucide-react';
import UseAnimations from 'react-useanimations';
import edit from 'react-useanimations/lib/edit';
import trash2 from 'react-useanimations/lib/trash2';
import bookmark from 'react-useanimations/lib/bookmark';

interface NoteViewerProps {
  note: Note;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePin: () => void;
}

export const NoteViewer: React.FC<NoteViewerProps> = ({
  note,
  onClose,
  onEdit,
  onDelete,
  onTogglePin,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="glass-effect rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden mx-4 animate-slide-up border border-white/20 dark:border-gray-700/50 shadow-2xl">
        {/* Header */}
        <div className="relative bg-white/95 dark:bg-gradient-to-r dark:from-purple-500/10 dark:to-pink-500/10 border-b border-gray-200 dark:border-gray-700/50 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white truncate">
                {note.title}
              </h1>
              {note.isPinned && (
                <div className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full text-sm font-medium animate-pulse-slow shadow-md">
                  📌 Pinned
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={onTogglePin}
                className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-full transition-all duration-300 group"
                title={note.isPinned ? 'Unpin note' : 'Pin note'}
              >
                <UseAnimations 
                  animation={bookmark} 
                  size={24} 
                  reverse={note.isPinned}
                  strokeColor={note.isPinned ? '#f59e0b' : 'currentColor'}
                />
              </button>
              
              <button
                onClick={onEdit}
                className="p-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-all duration-300 group"
                title="Edit note"
              >
                <UseAnimations 
                  animation={edit} 
                  size={24} 
                  strokeColor="#3b82f6"
                />
              </button>
              
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all duration-300 group"
                title="Delete note"
              >
                <UseAnimations 
                  animation={trash2} 
                  size={24} 
                  strokeColor="#ef4444"
                />
              </button>
              
              <button
                onClick={onClose}
                className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-full transition-all duration-300"
                title="Close"
              >
                <X className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="px-6 py-4 bg-white/90 dark:bg-gray-700/30 border-b border-gray-200 dark:border-gray-700/50">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700 dark:text-gray-400">
            <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800/50 px-3 py-1 rounded-full border border-gray-200 dark:border-transparent">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span>
                Updated {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
              </span>
            </div>
            
            {note.category && (
              <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800/50 px-3 py-1 rounded-full border border-gray-200 dark:border-transparent">
                <Folder className="h-4 w-4 text-purple-500" />
                <span className="px-2 py-1 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 text-blue-700 dark:text-blue-200 rounded-full text-xs font-medium border border-blue-200 dark:border-transparent">
                  {note.category}
                </span>
              </div>
            )}
            
            {note.tags && note.tags.length > 0 && (
              <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800/50 px-3 py-1 rounded-full border border-gray-200 dark:border-transparent">
                <Tag className="h-4 w-4 text-pink-500" />
                <div className="flex flex-wrap gap-1">
                  {note.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900 dark:to-purple-900 text-pink-700 dark:text-pink-200 rounded-full text-xs font-medium border border-pink-200 dark:border-transparent"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[60vh] custom-scrollbar bg-white/80 dark:bg-gray-800/50">
          <div className="prose dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-gray-800 dark:text-white leading-relaxed text-lg bg-white dark:bg-transparent p-6 rounded-xl shadow-sm border border-gray-200/50 dark:border-transparent">
              {note.content}
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm mx-4 shadow-xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                Delete Note
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Are you sure you want to delete "{note.title}"? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors border border-gray-300 dark:border-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors shadow-md"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
