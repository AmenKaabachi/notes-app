# Database Migrations

This directory contains manual database migration files for version control and deployment.

## Naming Convention

Migration files should follow this naming pattern:
- `YYYYMMDD_HHMMSS_description.sql`
- Example: `20250712_143000_create_initial_tables.sql`

## Migration Process

1. **Create a new migration file** with a descriptive name
2. **Write the SQL commands** to modify the database schema
3. **Test the migration** on a development database
4. **Apply to production** during deployment

## Example Migration

```sql
-- 20250712_143000_add_color_column_to_notes.sql

-- Add color column to notes table
ALTER TABLE notes ADD COLUMN color VARCHAR(7) DEFAULT '#ffffff';

-- Create index for color filtering
CREATE INDEX idx_notes_color ON notes(color);

-- Update existing notes with default color
UPDATE notes SET color = '#ffffff' WHERE color IS NULL;

COMMIT;
```

## Best Practices

- Always include both forward and rollback instructions
- Test migrations thoroughly before production
- Keep migrations small and focused
- Document any data transformations
- Use transactions to ensure atomicity

## Running Migrations

### Development
```bash
psql -U postgres -d notes_app_dev -f database/migrations/filename.sql
```

### Production
```bash
psql -U postgres -d notes_app -f database/migrations/filename.sql
```

## Rollback Strategy

For each migration, consider creating a corresponding rollback file:
- `20250712_143000_add_color_column_to_notes_rollback.sql`

This helps maintain database integrity during deployments.
