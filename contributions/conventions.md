# Conventions

The documentation of the following conventions we use, while using NextJS, TypeScript, and TailwindCSS.

### Project Structure

- **`/app`**: Contains the main application code, including pages and components.
  - **`/api`**: API routes.
  - **`/about`**: About page.
  - **`/page.tsx`**: The main entry point of the application.
- **`/components`**: Reusable UI components / Small Composable pieces. `/ui` for generic UI components or ShadCN components.
- **`/lib`**: Utility functions and constants.
- **`/db`**: Database-related code, schema for things like auth and our data.
- **`/server`**: Server-side code, make sure to `import "server-only";` at the top of files here, since this runs on the server only and performs actions like DB queries.
  - **`/actions`**: Server actions that can be called from the client. Generall `/create`, `/update`, `/delete` actions for the data model / table we want.
  - **`/data`**: Data fetching functions.
- **`/hooks`**: Custom React hooks.
