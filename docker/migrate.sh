#!/bin/sh

# Wait for the database to be ready
until nc -z -v -w30 postgres 5432
do
  echo "Waiting for database connection..."
  sleep 1
done

# Run Prisma migrations (optional if you use migrations)
npx prisma migrate deploy

# Start the application
exec "$@"
