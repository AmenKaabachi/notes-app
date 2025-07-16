# Database Setup Instructions

This folder contains database-related scripts and documentation for the Notes App.

## Files Overview

- `setup_complete.sql` - Complete database schema setup with tables, indexes, and initial data
- `seed_data.sql` - Sample data for testing and development
- `migrations/` - Directory for database migration files (if using manual migrations)

## Quick Setup

### Using Prisma (Recommended)

1. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

2. **Push schema to database**:
   ```bash
   npx prisma db push
   ```

3. **Optional: Seed the database**:
   ```bash
   npx prisma db seed
   ```

### Manual Setup (Alternative)

If you prefer to set up the database manually:

1. **Create the database**:
   ```sql
   CREATE DATABASE notes_app;
   ```

2. **Run the setup script**:
   ```bash
   psql -U postgres -d notes_app -f database/setup_complete.sql
   ```

3. **Optional: Add sample data**:
   ```bash
   psql -U postgres -d notes_app -f database/seed_data.sql
   ```

## Database Schema

### Tables

- **users** - User accounts and authentication
- **notes** - User notes with content, categories, and tags
- **categories** - Predefined categories for organizing notes
- **tags** - Flexible tagging system for notes

### Key Features

- **Foreign Key Constraints** - Ensures data integrity
- **Indexes** - Optimized for search and filtering performance
- **Triggers** - Automatic timestamp updates
- **Default Data** - Pre-populated categories and tags

## Environment Setup

Make sure your `.env` file contains the correct database connection:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/notes_app"
```

## Troubleshooting

### Common Issues

1. **Connection refused**: Ensure PostgreSQL is running
2. **Database does not exist**: Create the database first
3. **Permission denied**: Check user permissions and credentials
4. **Schema conflicts**: Drop and recreate the database if needed

### Reset Database

To completely reset the database:

```sql
DROP DATABASE IF EXISTS notes_app;
CREATE DATABASE notes_app;
```

Then run the setup script again.

## Production Considerations

- Use connection pooling for better performance
- Enable SSL connections
- Set up proper backup procedures
- Monitor database performance and optimize indexes as needed
- Consider using Prisma Accelerate for enhanced performance
