-- Notes App Database Setup
-- This script creates the initial database structure for the Notes App

-- Create the database (run this first if database doesn't exist)
-- CREATE DATABASE notes_app;

-- Connect to the notes_app database
\c notes_app;

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pg_trgm extension for trigram search (for advanced text search)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create NextAuth accounts table
CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    type VARCHAR(255) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    provider_account_id VARCHAR(255) NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    token_type VARCHAR(255),
    scope TEXT,
    id_token TEXT,
    session_state TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_accounts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create NextAuth sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_token VARCHAR(255) UNIQUE NOT NULL,
    user_id UUID NOT NULL,
    expires TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create categories table (user-specific)
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_categories_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create tags table (user-specific)
CREATE TABLE IF NOT EXISTS tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL,
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_tags_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category_id UUID,
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_id UUID NOT NULL,
    
    CONSTRAINT fk_notes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_notes_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Create note_tags junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS note_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    note_id UUID NOT NULL,
    tag_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_note_tags_note FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
    CONSTRAINT fk_note_tags_tag FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Create indexes for users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create indexes for accounts
CREATE UNIQUE INDEX IF NOT EXISTS accounts_provider_provider_account_id_key ON accounts(provider, provider_account_id);
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_provider ON accounts(provider);
CREATE INDEX IF NOT EXISTS idx_accounts_provider_account_id ON accounts(provider_account_id);

-- Create indexes for sessions
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires);

-- Create indexes for categories
CREATE UNIQUE INDEX IF NOT EXISTS categories_name_user_id_key ON categories(name, user_id);
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);
CREATE INDEX IF NOT EXISTS idx_categories_user_name ON categories(user_id, name);

-- Create indexes for tags
CREATE UNIQUE INDEX IF NOT EXISTS tags_name_user_id_key ON tags(name, user_id);
CREATE INDEX IF NOT EXISTS idx_tags_user_id ON tags(user_id);
CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);
CREATE INDEX IF NOT EXISTS idx_tags_user_name ON tags(user_id, name);

-- Create indexes for notes (performance optimized)
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_category_id ON notes(category_id);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notes_updated_at ON notes(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_notes_pinned ON notes(is_pinned);
CREATE INDEX IF NOT EXISTS idx_notes_user_pinned ON notes(user_id, is_pinned);
CREATE INDEX IF NOT EXISTS idx_notes_user_created ON notes(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notes_user_updated ON notes(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_notes_user_category ON notes(user_id, category_id);

-- Create full-text search indexes for notes
CREATE INDEX IF NOT EXISTS idx_notes_title_search ON notes USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_notes_content_search ON notes USING gin(to_tsvector('english', content));
CREATE INDEX IF NOT EXISTS idx_notes_title_content_search ON notes USING gin(to_tsvector('english', title || ' ' || content));

-- Create trigram indexes for fuzzy search
CREATE INDEX IF NOT EXISTS idx_notes_title_trgm ON notes USING gin(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_notes_content_trgm ON notes USING gin(content gin_trgm_ops);

-- Create indexes for note_tags junction table
CREATE UNIQUE INDEX IF NOT EXISTS note_tags_note_id_tag_id_key ON note_tags(note_id, tag_id);
CREATE INDEX IF NOT EXISTS idx_note_tags_note_id ON note_tags(note_id);
CREATE INDEX IF NOT EXISTS idx_note_tags_tag_id ON note_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_note_tags_note_tag ON note_tags(note_id, tag_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data insertion function for demo user
CREATE OR REPLACE FUNCTION insert_demo_data(demo_user_id UUID)
RETURNS VOID AS $$
DECLARE
    cat_personal_id UUID;
    cat_work_id UUID;
    cat_ideas_id UUID;
    cat_learning_id UUID;
    tag_urgent_id UUID;
    tag_important_id UUID;
    tag_project_id UUID;
    note_1_id UUID;
    note_2_id UUID;
BEGIN
    -- Insert categories for demo user
    INSERT INTO categories (name, user_id) VALUES 
        ('Personal', demo_user_id),
        ('Work', demo_user_id),
        ('Ideas', demo_user_id),
        ('Learning', demo_user_id)
    ON CONFLICT (name, user_id) DO NOTHING;
    
    -- Get category IDs
    SELECT id INTO cat_personal_id FROM categories WHERE name = 'Personal' AND user_id = demo_user_id;
    SELECT id INTO cat_work_id FROM categories WHERE name = 'Work' AND user_id = demo_user_id;
    SELECT id INTO cat_ideas_id FROM categories WHERE name = 'Ideas' AND user_id = demo_user_id;
    SELECT id INTO cat_learning_id FROM categories WHERE name = 'Learning' AND user_id = demo_user_id;
    
    -- Insert tags for demo user
    INSERT INTO tags (name, user_id) VALUES 
        ('urgent', demo_user_id),
        ('important', demo_user_id),
        ('project', demo_user_id),
        ('meeting', demo_user_id),
        ('research', demo_user_id)
    ON CONFLICT (name, user_id) DO NOTHING;
    
    -- Get tag IDs
    SELECT id INTO tag_urgent_id FROM tags WHERE name = 'urgent' AND user_id = demo_user_id;
    SELECT id INTO tag_important_id FROM tags WHERE name = 'important' AND user_id = demo_user_id;
    SELECT id INTO tag_project_id FROM tags WHERE name = 'project' AND user_id = demo_user_id;
    
    -- Insert sample notes
    INSERT INTO notes (title, content, category_id, is_pinned, user_id) VALUES 
        ('Welcome to Notes App', 
         'This is your first note! You can create, edit, and organize your notes here. Use categories and tags to keep everything organized.',
         cat_personal_id, 
         true, 
         demo_user_id),
        ('Project Ideas',
         '1. Build a weather app with React
2. Create a task manager with drag & drop
3. Develop a portfolio website
4. Learn TypeScript fundamentals',
         cat_ideas_id,
         false,
         demo_user_id)
    ON CONFLICT (id) DO NOTHING
    RETURNING id;
    
    -- Get note IDs for tagging
    SELECT id INTO note_1_id FROM notes WHERE title = 'Welcome to Notes App' AND user_id = demo_user_id;
    SELECT id INTO note_2_id FROM notes WHERE title = 'Project Ideas' AND user_id = demo_user_id;
    
    -- Add tags to notes
    IF note_1_id IS NOT NULL AND tag_important_id IS NOT NULL THEN
        INSERT INTO note_tags (note_id, tag_id) VALUES (note_1_id, tag_important_id)
        ON CONFLICT (note_id, tag_id) DO NOTHING;
    END IF;
    
    IF note_2_id IS NOT NULL AND tag_project_id IS NOT NULL THEN
        INSERT INTO note_tags (note_id, tag_id) VALUES (note_2_id, tag_project_id)
        ON CONFLICT (note_id, tag_id) DO NOTHING;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO notes_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO notes_app_user;

COMMIT;
