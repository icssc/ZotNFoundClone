# Database

After Connecting your AWS EC2 Instance, you will need to set up the database schema. We use Drizzle ORM for database migrations and schema management.

## Setting Up the Database

1. **Install Dependencies**: Ensure you have all necessary dependencies installed. If you haven't done so, run:
   ```bash
   bun install
   ```
   or
   ```bash
   npm install
   ```
2. **Run Migrations**: To set up the database schema, run the following commands:
   ```bash
   bunx drizzle-kit generate
   bunx drizzle-kit migrate
   ```
   or
   ```bash
   npx drizzle-kit generate
   npx drizzle-kit migrate
   ```
   This will create the necessary tables and structures in your PostgreSQL database as defined in the migration files.
3. **Verify the Setup**: After running the migrations, you can verify that the tables have been created by connecting to your PostgreSQL database. You can explore the database in Drizzle Studio by running the following command:

```
npx drizzle-kit studio
```

The database should be ready with the required schema for ZotNFoundClone. You can now proceed with running the application and testing its functionality.
Keep in mind, there is no data in the database yet, you will need to add data directly into the database.
