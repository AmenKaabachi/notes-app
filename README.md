# Notes App

A modern, full-featured notes application built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- ✅ **Create, Edit, Delete Notes** - Full CRUD operations
- ✅ **Local Storage Persistence** - Notes are saved locally and persist between sessions
- ✅ **Search & Filter** - Search notes by title, content, category, or tags
- ✅ **Categories & Tags** - Organize notes with categories and tags
- ✅ **Pin Important Notes** - Pin notes to keep them at the top
- ✅ **Dark/Light Mode** - Toggle between themes
- ✅ **Responsive Design** - Works perfectly on desktop and mobile
- ✅ **Export Notes** - Export all notes as JSON
- ✅ **Grid/List View** - Switch between different view modes
- ✅ **Timestamps** - Track when notes were created and last modified
- ✅ **Smooth Animations** - Beautiful transitions and interactions

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **date-fns** - Date formatting utilities

## Getting Started

1. **Clone the repository**
```bash
git clone https://github.com/AmenKaabachi/notes-app.git
cd notes-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Run the development server**
```bash
npm run dev
```

4. **Open your browser**
Visit [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
notes-app/
├── app/
│   ├── components/          # React components
│   │   ├── NoteCard.tsx    # Individual note display
│   │   ├── NoteEditor.tsx  # Note creation/editing modal
│   │   ├── SearchBar.tsx   # Search and filter functionality
│   │   └── EmptyState.tsx  # Empty state component
│   ├── hooks/              # Custom React hooks
│   │   ├── useNotes.ts     # Notes state management
│   │   └── useTheme.ts     # Theme management
│   ├── types/              # TypeScript type definitions
│   │   └── note.ts         # Note interface
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main page component
├── public/                 # Static assets
├── tailwind.config.js      # Tailwind configuration
├── next.config.js          # Next.js configuration
└── package.json           # Dependencies and scripts
```

## Key Features Explained

### Notes Management
- Create new notes with title, content, category, and tags
- Edit existing notes with a full-screen editor
- Delete notes with confirmation dialog
- Pin important notes to keep them visible

### Organization
- **Categories**: Organize notes by topic (Work, Personal, etc.)
- **Tags**: Add multiple tags to notes for better organization
- **Search**: Find notes quickly by searching title, content, or metadata

### User Experience
- **Dark/Light Mode**: Automatic theme detection with manual toggle
- **Responsive**: Works on all screen sizes
- **Animations**: Smooth transitions and hover effects
- **Keyboard Shortcuts**: Quick actions using keyboard

### Data Persistence
- All notes are stored in browser's localStorage
- Automatic saving when notes are created or modified
- Export functionality to backup notes

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).