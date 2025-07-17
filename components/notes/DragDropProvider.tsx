'use client';

import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Note } from '@/types/note';
import { NoteCard } from '@/components/notes/NoteCard';

interface DragDropProviderProps {
  notes: Note[];
  onReorderNotes: (startIndex: number, endIndex: number) => void;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onView?: (note: Note) => void;
  viewMode: 'grid' | 'list';
}

export const DragDropProvider: React.FC<DragDropProviderProps> = ({
  notes,
  onReorderNotes,
  onEdit,
  onDelete,
  onTogglePin,
  onView,
  viewMode,
}) => {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const startIndex = result.source.index;
    const endIndex = result.destination.index;

    if (startIndex !== endIndex) {
      onReorderNotes(startIndex, endIndex);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="notes-list">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`
              ${viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
              }
              ${snapshot.isDraggingOver ? 'bg-blue-50/50 dark:bg-blue-900/10 rounded-lg transition-colors duration-200 p-2' : ''}
            `}
          >
            {notes.map((note, index) => (
              <Draggable key={note.id} draggableId={note.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`
                      animate-fade-in
                      ${snapshot.isDragging ? 'dragging' : ''}
                      transition-all duration-200
                    `}
                    style={{ 
                      animationDelay: `${index * 0.1}s`,
                      ...provided.draggableProps.style 
                    }}
                  >
                    <div
                      {...provided.dragHandleProps}
                      className="group relative cursor-grab active:cursor-grabbing"
                    >
                      {/* Drag indicator */}
                      <div className="absolute -top-2 -left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-1.5 rounded-full shadow-lg">
                          <svg 
                            width="14" 
                            height="14" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path 
                              d="M8 6h2v2H8V6zM8 10h2v2H8v-2zM8 14h2v2H8v-2zM14 6h2v2h-2V6zM14 10h2v2h-2v-2zM14 14h2v2h-2v-2z" 
                              fill="currentColor"
                            />
                          </svg>
                        </div>
                      </div>
                      
                      <NoteCard
                        note={note}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onTogglePin={onTogglePin}
                        onView={onView}
                      />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
