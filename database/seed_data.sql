-- Sample data for the Notes App
-- Run this after setting up the main schema

-- Insert sample users (passwords are hashed for 'password123')
-- Using bcrypt hash: $2b$12$1arymB4wLTnwQ3IPo.z6henHZoOUIJRWVOk/V0srfHRCpgFigNYwi
DO $$
DECLARE
    demo_user_id UUID;
    john_user_id UUID;
    jane_user_id UUID;
    cat_personal_id UUID;
    cat_work_id UUID;
    cat_ideas_id UUID;
    cat_learning_id UUID;
    tag_urgent_id UUID;
    tag_important_id UUID;
    tag_project_id UUID;
    tag_meeting_id UUID;
    note_1_id UUID;
    note_2_id UUID;
    note_3_id UUID;
BEGIN
    -- Insert users
    INSERT INTO users (email, name, password) VALUES
        ('demo@example.com', 'Demo User', '$2b$12$1arymB4wLTnwQ3IPo.z6henHZoOUIJRWVOk/V0srfHRCpgFigNYwi'),
        ('john.doe@example.com', 'John Doe', '$2b$12$1arymB4wLTnwQ3IPo.z6henHZoOUIJRWVOk/V0srfHRCpgFigNYwi'),
        ('jane.smith@example.com', 'Jane Smith', '$2b$12$1arymB4wLTnwQ3IPo.z6henHZoOUIJRWVOk/V0srfHRCpgFigNYwi')
    ON CONFLICT (email) DO NOTHING;
    
    -- Get user IDs
    SELECT id INTO demo_user_id FROM users WHERE email = 'demo@example.com';
    SELECT id INTO john_user_id FROM users WHERE email = 'john.doe@example.com';
    SELECT id INTO jane_user_id FROM users WHERE email = 'jane.smith@example.com';
    
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
        ('research', demo_user_id),
        ('todo', demo_user_id),
        ('learning', demo_user_id),
        ('javascript', demo_user_id)
    ON CONFLICT (name, user_id) DO NOTHING;
    
    -- Get tag IDs
    SELECT id INTO tag_urgent_id FROM tags WHERE name = 'urgent' AND user_id = demo_user_id;
    SELECT id INTO tag_important_id FROM tags WHERE name = 'important' AND user_id = demo_user_id;
    SELECT id INTO tag_project_id FROM tags WHERE name = 'project' AND user_id = demo_user_id;
    SELECT id INTO tag_meeting_id FROM tags WHERE name = 'meeting' AND user_id = demo_user_id;
    
    -- Insert sample notes for demo user
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
4. Learn TypeScript fundamentals

## Next Steps
- Research best practices
- Set up development environment
- Create project timeline',
         cat_ideas_id,
         false,
         demo_user_id),
        ('Meeting Notes - Team Standup',
         'Daily standup meeting notes:

**Completed:**
- Fixed login bug
- Updated documentation  

**In Progress:**
- Working on user dashboard
- Testing API endpoints

**Blockers:**
- Need design approval for new feature

**Action Items:**
- Follow up with design team
- Schedule code review session',
         cat_work_id,
         false,
         demo_user_id),
        ('JavaScript Best Practices',
         '## JavaScript Best Practices

### 1. Use const and let instead of var
```javascript
const name = "John";
let age = 25;
```

### 2. Use arrow functions
```javascript
const multiply = (a, b) => a * b;
```

### 3. Destructuring
```javascript
const { name, age } = user;
```

### 4. Template literals
```javascript
const message = `Hello, ${name}!`;
```

### 5. Async/Await over Promises
```javascript
const fetchData = async () => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};
```',
         cat_learning_id,
         true,
         demo_user_id)
    ON CONFLICT DO NOTHING;
    
    -- Get note IDs for tagging
    SELECT id INTO note_1_id FROM notes WHERE title = 'Welcome to Notes App' AND user_id = demo_user_id;
    SELECT id INTO note_2_id FROM notes WHERE title = 'Project Ideas' AND user_id = demo_user_id;
    SELECT id INTO note_3_id FROM notes WHERE title = 'Meeting Notes - Team Standup' AND user_id = demo_user_id;
    
    -- Add tags to notes
    IF note_1_id IS NOT NULL AND tag_important_id IS NOT NULL THEN
        INSERT INTO note_tags (note_id, tag_id) VALUES (note_1_id, tag_important_id)
        ON CONFLICT (note_id, tag_id) DO NOTHING;
    END IF;
    
    IF note_2_id IS NOT NULL AND tag_project_id IS NOT NULL THEN
        INSERT INTO note_tags (note_id, tag_id) VALUES (note_2_id, tag_project_id)
        ON CONFLICT (note_id, tag_id) DO NOTHING;
    END IF;
    
    IF note_3_id IS NOT NULL AND tag_meeting_id IS NOT NULL THEN
        INSERT INTO note_tags (note_id, tag_id) VALUES (note_3_id, tag_meeting_id)
        ON CONFLICT (note_id, tag_id) DO NOTHING;
    END IF;
    
    IF note_3_id IS NOT NULL AND tag_urgent_id IS NOT NULL THEN
        INSERT INTO note_tags (note_id, tag_id) VALUES (note_3_id, tag_urgent_id)
        ON CONFLICT (note_id, tag_id) DO NOTHING;
    END IF;
    
END $$;

COMMIT;
