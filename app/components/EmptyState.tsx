'use client';

import { FileText, Plus } from 'lucide-react';
import UseAnimations from 'react-useanimations';
import plusToX from 'react-useanimations/lib/plusToX';

interface EmptyStateProps {
  onCreateNote: () => void;
  isSearching?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onCreateNote, isSearching = false }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-xl opacity-20 animate-pulse-slow"></div>
        <div className="relative bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 p-8 rounded-full">
          <FileText size={80} className="text-blue-500 dark:text-blue-400 animate-float" />
        </div>
      </div>
      
      <h3 className="text-3xl font-bold text-gradient mb-4 animate-bounce-in">
        {isSearching ? '🔍 No notes found' : '✨ Your creative space awaits'}
      </h3>
      
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md leading-relaxed">
        {isSearching 
          ? 'Try adjusting your search terms or explore different categories'
          : 'Transform your thoughts into beautiful notes. Every great idea starts with a single word.'
        }
      </p>
      
      {!isSearching && (
        <button
          onClick={onCreateNote}
          className="group relative overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-4 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 animate-bounce-in"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center space-x-3">
            <UseAnimations 
              animation={plusToX} 
              size={24} 
              strokeColor="currentColor"
            />
            <span className="text-lg">Create Your First Note</span>
          </div>
        </button>
      )}
    </div>
  );
};