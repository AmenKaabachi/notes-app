'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useSessionTracking } from '@/hooks/useSessionTracking';
import { NoteCard } from '@/components/notes/NoteCard';
import { NoteEditor } from '@/components/notes/NoteEditor';
import { NoteViewer } from '@/components/notes/NoteViewer';
import { SearchBar } from '@/components/notes/SearchBar';
import { EmptyState } from '@/components/notes/EmptyState';
import { UserDropdown } from '@/components/layout/user-dropdown';
import { DragDropProvider } from '@/components/notes/DragDropProvider';
import { Note } from '@/types/note';
import { Moon, Sun, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UseAnimations from 'react-useanimations';
import plusToX from 'react-useanimations/lib/plusToX';
import loadingAnimation from 'react-useanimations/lib/loading2';

export default function Home() {
  const { session, status, isAuthenticated, isLoading } = useAuth();
  const { isTracking } = useSessionTracking(); // Add session tracking
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>();
  const [viewingNote, setViewingNote] = useState<Note | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Fetch notes when user is authenticated
  useEffect(() => {
    if (session?.user) {
      fetchNotes();
    }
  }, [session]);

  const fetchNotes = async () => {
    try {
      const response = await fetch('/api/notes');
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const addNote = useCallback(async (noteData: any) => {
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      });
      
      if (response.ok) {
        const newNote = await response.json();
        setNotes(prevNotes => [newNote, ...prevNotes]);
        setIsEditorOpen(false);
      }
    } catch (error) {
      console.error('Error adding note:', error);
    }
  }, []);

  const updateNote = useCallback(async (id: string, noteData: any) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      });
      
      if (response.ok) {
        const updatedNote = await response.json();
        setNotes(prevNotes => prevNotes.map(note => note.id === id ? updatedNote : note));
        setIsEditorOpen(false);
      }
    } catch (error) {
      console.error('Error updating note:', error);
    }
  }, []);

  const deleteNote = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  }, []);

  const togglePin = async (id: string) => {
    const note = notes.find(n => n.id === id);
    if (note) {
      await updateNote(id, { ...note, isPinned: !note.isPinned });
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };

  const filteredNotes = () => {
    let filtered = notes;
    
    if (searchQuery) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(note => note.category === selectedCategory);
    }
    
    return filtered.sort((a, b) => {
      if (a.isPinned !== b.isPinned) {
        return a.isPinned ? -1 : 1;
      }
      // If both pinned or both unpinned, sort by order first, then by update time
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  };

  const reorderNotes = async (startIndex: number, endIndex: number) => {
    const filteredList = filteredNotes();
    const reorderedNotes = Array.from(filteredList);
    const [movedNote] = reorderedNotes.splice(startIndex, 1);
    reorderedNotes.splice(endIndex, 0, movedNote);

    // Store original state for potential revert
    const originalNotes = notes;

    // Update local state immediately for better UX
    const updatedNotes = notes.map(note => {
      const newIndex = reorderedNotes.findIndex(rn => rn.id === note.id);
      if (newIndex !== -1) {
        return { ...note, order: newIndex };
      }
      return note;
    });
    setNotes(updatedNotes);

    // Send update to server
    try {
      const noteIds = reorderedNotes.map(note => note.id);
      const response = await fetch('/api/notes/reorder', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ noteIds }),
      });

      if (!response.ok) {
        // Revert on error
        setNotes(originalNotes);
        console.error('Failed to reorder notes');
      }
    } catch (error) {
      // Revert on error
      setNotes(originalNotes);
      console.error('Error reordering notes:', error);
    }
  };

  const handleSaveNote = useCallback((noteData: any) => {
    if (editingNote) {
      updateNote(editingNote.id, noteData);
    } else {
      addNote(noteData);
    }
  }, [editingNote, addNote, updateNote]);

  const handleEditNote = useCallback((note: Note) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  }, []);

  const handleCreateNote = useCallback(() => {
    setEditingNote(undefined);
    setIsEditorOpen(true);
  }, []);

  const handleCloseEditor = useCallback(() => {
    setIsEditorOpen(false);
    setEditingNote(undefined);
  }, []);

  const handleViewNote = (note: Note) => {
    setViewingNote(note);
  };

  const handleCloseViewer = () => {
    setViewingNote(undefined);
  };

  const handleEditFromViewer = () => {
    if (viewingNote) {
      setEditingNote(viewingNote);
      setViewingNote(undefined);
      setIsEditorOpen(true);
    }
  };

  const handleDeleteFromViewer = () => {
    if (viewingNote) {
      deleteNote(viewingNote.id);
      setViewingNote(undefined);
    }
  };

  const handleTogglePinFromViewer = () => {
    if (viewingNote) {
      togglePin(viewingNote.id);
      setViewingNote(prev => prev ? { ...prev, isPinned: !prev.isPinned } : undefined);
    }
  };

  const getCategories = () => {
    const categories = new Set(notes.map(note => note.category).filter(Boolean));
    return Array.from(categories);
  };

  const getAllTags = () => {
    const tags = new Set(notes.flatMap(note => note.tags || []));
    return Array.from(tags);
  };

  // Show loading spinner while checking authentication
  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <UseAnimations 
            animation={loadingAnimation} 
            size={64} 
            strokeColor="#8b5cf6"
          />
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 animate-pulse-slow">Loading your creative space...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect to login)
  if (status === 'unauthenticated' || !isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 glass-effect border-b border-white/20 dark:border-gray-700/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gradient animate-bounce-in">
                ✨ Notes App
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="relative hover:bg-white/20 dark:hover:bg-gray-700/50 rounded-full transition-all duration-300"
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                ) : (
                  <Sun className="h-5 w-5 text-yellow-500 animate-pulse-slow" />
                )}
              </Button>
              
              <UserDropdown />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Controls */}
        <div className="mb-8 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative">
              <SearchBar
                onSearch={setSearchQuery}
                placeholder="🔍 Search your thoughts..."
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="glass-effect hover:bg-white/30 dark:hover:bg-gray-700/30 border-white/20 dark:border-gray-700/50 transition-all duration-300"
              >
                {viewMode === 'grid' ? (
                  <List className="h-4 w-4" />
                ) : (
                  <Grid className="h-4 w-4" />
                )}
              </Button>
              
              <Button 
                onClick={handleCreateNote} 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-none shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 px-6 py-2 rounded-full transform hover:scale-105"
              >
                <UseAnimations 
                  animation={plusToX} 
                  size={20} 
                  strokeColor="currentColor"
                />
                <span className="font-medium">New Note</span>
              </Button>
            </div>
          </div>

          {/* Categories Filter */}
          {getCategories().length > 0 && (
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedCategory('')}
                className={`glass-effect transition-all duration-300 rounded-full ${
                  selectedCategory === '' 
                    ? '!bg-gradient-to-r !from-purple-500 !to-pink-500 !text-white !border-2 !border-pink-400 shadow-lg' 
                    : 'border-white/30 dark:border-gray-600/30 hover:bg-white/20 dark:hover:bg-gray-700/30'
                }`}
              >
                All Notes
              </Button>
              {getCategories().map(category => (
                <Button
                  key={category}
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`glass-effect transition-all duration-300 rounded-full ${
                    selectedCategory === category 
                      ? '!bg-gradient-to-r !from-purple-500 !to-pink-500 !text-white !border-2 !border-pink-400 shadow-lg' 
                      : 'border-white/30 dark:border-gray-600/30 hover:bg-white/20 dark:hover:bg-gray-700/30'
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Notes Grid/List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <UseAnimations 
              animation={loadingAnimation} 
              size={64} 
              strokeColor="#8b5cf6"
            />
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 animate-pulse-slow">Loading your thoughts...</p>
          </div>
        ) : filteredNotes().length === 0 ? (
          <div className="glass-effect rounded-3xl p-12 text-center animate-bounce-in border border-white/20 dark:border-gray-700/50">
            <EmptyState onCreateNote={handleCreateNote} isSearching={!!searchQuery} />
          </div>
        ) : (
          <DragDropProvider
            notes={filteredNotes()}
            onReorderNotes={reorderNotes}
            onEdit={handleEditNote}
            onDelete={deleteNote}
            onTogglePin={togglePin}
            onView={handleViewNote}
            viewMode={viewMode}
          />
        )}
      </main>

      {/* Note Editor Modal */}
      {isEditorOpen && (
        <NoteEditor
          note={editingNote}
          onSave={handleSaveNote}
          onClose={handleCloseEditor}
          categories={getCategories()}
          tags={getAllTags()}
        />
      )}

      {/* Note Viewer Modal */}
      {viewingNote && (
        <NoteViewer
          note={viewingNote}
          onClose={handleCloseViewer}
          onEdit={handleEditFromViewer}
          onDelete={handleDeleteFromViewer}
          onTogglePin={handleTogglePinFromViewer}
        />
      )}
    </div>
  );
}
