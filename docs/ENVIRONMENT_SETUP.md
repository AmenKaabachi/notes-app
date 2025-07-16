# Environment Configuration Guide

## Required Environment Variables

Create a `.env` file in your project root with the following variables:

### Database Configuration
```env
# Replace with your actual PostgreSQL connection details
DATABASE_URL="postgresql://username:password@localhost:5432/notes_app"
```

### NextAuth Configuration
```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
```

### Optional: Prisma Accelerate (for enhanced performance)
```env
# Get these from your Prisma Cloud dashboard
PULSE_API_KEY="your_pulse_api_key_here"
ACCELERATE_URL="your_accelerate_url_here"
```

## Database Setup Steps

1. **Create PostgreSQL Database**:
   ```bash
   # Run the database setup scripts
   cd database
   psql -U postgres -f setup_complete.sql
   ```

2. **Update Environment Variables**:
   - Replace `username`, `password`, and connection details in `DATABASE_URL`
   - Generate a secure `NEXTAUTH_SECRET` for production

3. **Generate Prisma Client**:
   ```bash
   npx prisma generate --no-engine
   ```

4. **Sync Database Schema**:
   ```bash
   npx prisma db push
   ```

## Prisma Accelerate Setup

Prisma Accelerate provides:
- **Connection pooling** for better database performance
- **Query caching** for faster response times
- **Global CDN** for reduced latency

### To enable Accelerate:

1. Sign up for [Prisma Cloud](https://console.prisma.io/)
2. Create a new project and get your Accelerate URL
3. Add the URL to your `.env` file:
   ```env
   ACCELERATE_URL="prisma://accelerate.prisma-data.net/?api_key=your_api_key"
   ```
4. Update your `DATABASE_URL` to use the Accelerate URL instead of direct connection

## Production Deployment

For production deployment, ensure:

1. **Secure Environment Variables**:
   - Use strong, unique `NEXTAUTH_SECRET`
   - Use secure database credentials
   - Enable SSL for database connections

2. **Database URL Format**:
   ```env
   # For direct PostgreSQL connection
   DATABASE_URL="postgresql://user:password@host:port/dbname?sslmode=require"
   
   # For Prisma Accelerate
   DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=your_api_key"
   ```

3. **Update NEXTAUTH_URL**:
   ```env
   NEXTAUTH_URL="https://your-domain.com"
   ```

## Troubleshooting

### Common Issues:

1. **Database Connection Errors**:
   - Verify PostgreSQL is running
   - Check connection credentials
   - Ensure database exists

2. **Prisma Client Errors**:
   - Run `npx prisma generate` after schema changes
   - Clear `node_modules` and reinstall if needed

3. **Environment Variable Issues**:
   - Restart development server after `.env` changes
   - Verify `.env` file is in project root
   - Check for typos in variable names

### Useful Commands:

```bash
# Regenerate Prisma Client
npx prisma generate

# Reset database (caution: deletes all data)
npx prisma migrate reset

# Open Prisma Studio (database browser)
npx prisma studio

# Format Prisma schema
npx prisma format
```
