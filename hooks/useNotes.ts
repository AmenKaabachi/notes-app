'use client';

import { useState, useEffect } from 'react';
import { Note, NoteFormData } from '../types/note';

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt),
        }));
        setNotes(parsedNotes);
      } catch (error) {
        console.error('Error parsing saved notes:', error);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('notes', JSON.stringify(notes));
    }
  }, [notes, loading]);

  const addNote = (noteData: NoteFormData) => {
    const newNote: Note = {
      id: Date.now().toString(),
      ...noteData,
      createdAt: new Date(),
      updatedAt: new Date(),
      isPinned: false,
    };
    setNotes(prev => [newNote, ...prev]);
    return newNote;
  };

  const updateNote = (id: string, noteData: Partial<NoteFormData>) => {
    setNotes(prev => prev.map(note => 
      note.id === id 
        ? { ...note, ...noteData, updatedAt: new Date() }
        : note
    ));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const togglePin = (id: string) => {
    setNotes(prev => prev.map(note => 
      note.id === id 
        ? { ...note, isPinned: !note.isPinned, updatedAt: new Date() }
        : note
    ));
  };

  const searchNotes = (query: string) => {
    if (!query.trim()) return notes;
    return notes.filter(note => 
      note.title.toLowerCase().includes(query.toLowerCase()) ||
      note.content.toLowerCase().includes(query.toLowerCase()) ||
      note.category.toLowerCase().includes(query.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  };

  const getCategories = () => {
    const categories = new Set(notes.map(note => note.category));
    return Array.from(categories).filter(Boolean);
  };

  const getAllTags = () => {
    const tags = new Set(notes.flatMap(note => note.tags));
    return Array.from(tags).filter(Boolean);
  };

  const sortedNotes = [...notes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.updatedAt.getTime() - a.updatedAt.getTime();
  });

  return {
    notes: sortedNotes,
    loading,
    addNote,
    updateNote,
    deleteNote,
    togglePin,
    searchNotes,
    getCategories,
    getAllTags,
  };
};