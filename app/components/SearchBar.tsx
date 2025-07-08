'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import UseAnimations from 'react-useanimations';
import searchToX from 'react-useanimations/lib/searchToX';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search notes...",
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <div className="relative max-w-md w-full">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <UseAnimations 
          animation={searchToX} 
          size={20} 
          strokeColor="#8b5cf6"
          reverse={!!searchQuery}
        />
      </div>
      
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder={placeholder}
        className="w-full pl-12 pr-12 py-3 glass-effect border border-white/20 dark:border-gray-700/50 rounded-2xl 
                   text-gray-900 dark:text-white 
                   placeholder-gray-500 dark:placeholder-gray-400 
                   focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 
                   backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
      />
      
      {searchQuery && (
        <button
          onClick={clearSearch}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-300"
        >
          <X className="h-5 w-5" />
        </button>
      )}
      
      {/* Search glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
    </div>
  );
};
