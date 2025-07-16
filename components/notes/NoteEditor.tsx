'use client';

import { useState, useEffect } from 'react';
import { Note, NoteFormData } from '../types/note';
import { X, Save, Tag, Folder } from 'lucide-react';
import UseAnimations from 'react-useanimations';
import checkmark from 'react-useanimations/lib/checkmark';

interface NoteEditorProps {
  note?: Note;
  onSave: (noteData: NoteFormData) => void;
  onClose: () => void;
  categories: string[];
  tags: string[];
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  onSave,
  onClose,
  categories,
  tags,
}) => {
  const [formData, setFormData] = useState<NoteFormData>({
    title: '',
    content: '',
    category: '',
    tags: [],
  });
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<{
    title?: string;
    content?: string;
    category?: string;
  }>({});

  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title,
        content: note.content,
        category: note.category,
        tags: note.tags,
      });
    }
  }, [note]);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSave(formData);
    onClose();
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="glass-effect rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden mx-4 animate-slide-up border border-white/20 dark:border-gray-700/50 shadow-2xl">
        <div className="relative bg-white/95 dark:bg-gradient-to-r dark:from-purple-500/10 dark:to-pink-500/10 border-b border-gray-200 dark:border-gray-700/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {note ? '✏️ Edit Note' : '✨ Create New Note'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-full transition-all duration-300"
            >
              <X size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 custom-scrollbar overflow-y-auto max-h-[calc(90vh-80px)] bg-white/90 dark:bg-transparent">
          <div>
            <input
              type="text"
              placeholder="✍️ What's on your mind?"
              value={formData.title}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, title: e.target.value }))
                if (errors.title) setErrors(prev => ({ ...prev, title: undefined }))
              }}
              className={`w-full text-3xl font-bold bg-transparent border-none outline-none placeholder-gray-400 dark:placeholder-gray-400 text-gray-800 dark:text-white transition-all duration-300 ${
                errors.title ? 'text-red-500' : 'focus:text-purple-600 dark:focus:text-purple-400'
              }`}
              autoFocus
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-2 animate-bounce-in">{errors.title}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <Folder size={16} className="text-purple-500" />
                <span>Category</span>
              </label>
              <input
                type="text"
                placeholder="📁 Choose a category..."
                value={formData.category}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, category: e.target.value }))
                  if (errors.category) setErrors(prev => ({ ...prev, category: undefined }))
                }}
                list="categories"
                className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-gray-800 dark:text-white bg-white dark:bg-gray-800/30 transition-all duration-300 shadow-sm ${
                  errors.category ? 'border-red-500 focus:ring-red-500/50' : ''
                }`}
              />
              {errors.category && (
                <p className="text-red-500 text-sm mt-2 animate-bounce-in">{errors.category}</p>
              )}
              <datalist id="categories">
                {categories.map(category => (
                  <option key={category} value={category} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <Tag size={16} className="text-pink-500" />
                <span>Tags</span>
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="🏷️ Add tags..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  list="tags"
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 text-gray-800 dark:text-white bg-white dark:bg-gray-800/30 transition-all duration-300 shadow-sm"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Add
                </button>
              </div>
              <datalist id="tags">
                {tags.map(tag => (
                  <option key={tag} value={tag} />
                ))}
              </datalist>
            </div>
          </div>

          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900 dark:to-purple-900 text-pink-700 dark:text-pink-200 text-sm rounded-full animate-bounce-in border border-pink-200 dark:border-transparent shadow-sm"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              <span className="text-blue-500">📝</span>
              <span>Content</span>
            </label>
            <textarea
              placeholder="✨ Share your thoughts, ideas, or memories..."
              value={formData.content}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, content: e.target.value }))
                if (errors.content) setErrors(prev => ({ ...prev, content: undefined }))
              }}
              className={`w-full h-64 px-4 py-4 border border-gray-300 dark:border-gray-600/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-gray-800 dark:text-white bg-white dark:bg-gray-800/30 resize-none transition-all duration-300 shadow-sm ${
                errors.content ? 'border-red-500 focus:ring-red-500/50' : ''
              }`}
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-2 animate-bounce-in">{errors.content}</p>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700/50">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600/30 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-all duration-300 bg-white dark:bg-transparent shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <UseAnimations 
                animation={checkmark} 
                size={20} 
                strokeColor="currentColor"
              />
              <span>Save Note</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};