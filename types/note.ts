export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isPinned: boolean;
  order: number;
}

export interface NoteFormData {
  title: string;
  content: string;
  category: string;
  tags: string[];
}