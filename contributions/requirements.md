# Requirements for ZotNFoundClone

These are the requirements to run and develop ZotNFound:

### Development Environment

- **Bun** (preferred) or **Node.js** (>=20.x)
  - Bun can run Next.js projects and is compatible with most npm packages.
  - If using Node.js, ensure you have npm or yarn installed.
- **Next.js** (15.3.1-canary.15)
- **TypeScript** (>=5.8.3)
- **PostgreSQL** (for local development, required by `pg` and `drizzle-orm`)
- **TailwindCSS** (>=4)
- **Prettier** (>=3.6.2)
- **ESLint** (>=9)
- **dotenv** (for environment variable management)

### API Keys & Environment Variables
Create a `.env.local` file in the project root with the following (example names, adjust as needed):

```env
DATABASE_URL=postgres://user:password@localhost:5432/zotnfound
NEXT_PUBLIC_MAPBOX_DARK_URL=your_map_api_key
BETTER_AUTH_API_KEY=your_better_auth_api_key
DRIZZLE_DATABASE_URL=postgres://user:password@localhost:5432/zotnfound
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
AWS_HOST=your-db-host
AWS_USER=your-db-user
AWS_PASSWORD=your-db-password
AWS_DB_NAME=your-db-name
AWS_PORT=5432
```

- **DATABASE_URL**: PostgreSQL connection string.
- **BETTER_AUTH_API_KEY**: Used for authentication. Found at [BetterAuth](https://www.better-auth.com/docs/installation).
- **NEXT_PUBLIC_MAPBOX_DARK_URL**: For map services (Leaflet, etc). Please request from the project maintainer if you don't have one! Generally speaking you can make a public key [here](https://account.mapbox.com/access-tokens/). [Docs](https://docs.mapbox.com/help/dive-deeper/access-tokens/)
- **DRIZZLE_DATABASE_URL**: For Drizzle ORM migrations.
- **GOOGLE_CLIENT_ID** and **GOOGLE_CLIENT_SECRET**: For Google OAuth authentication. Set up a project in the [Google Developer Console](https://console.developers.google.com/). (We might just swap to the UCI Shared Auth provider in the future)
- - **AWS_USER**, **AWS_PASSWORD**, **AWS_HOST**, **AWS_PORT**, **AWS_DB_NAME**: We are connecting to a PostgreSQL database hosted on AWS, you will need to set these environment variables for authentication. You can obtain these credentials from your AWS Console under the RDS or EC2 dashboard. For more information on retrieving database credentials, see the [AWS EC2 documentation](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-connect-to-db.html).


### Other Notes

- Run `bun install` (or `npm install`) to install dependencies.
- Use `bun run dev` (or `npm run dev`) to start the development server.
- For formatting and linting, use `bun run format` and `bun run lint`.
- For type checking, use `bun run type-check`.


