# Vinly - Your Personal Music Collection

This is a monorepo for the Vinly application, a personal music collection organizer.

## Project Structure

This Turborepo includes the following packages/apps:

- `apps/web`: The Next.js frontend application for Vinly.
- `apps/api`: The NestJS backend API for Vinly.
- `packages/design-system`: A shared React component library used by the `web` app.
- `packages/api-client`: A generated TypeScript client for interacting with the `api`.
- `packages/eslint-config`: Shared ESLint configurations.
- `packages/typescript-config`: Shared `tsconfig.json` configurations.

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

## Getting Started (Local Development)

To run Vinly locally after cloning the repository:

1.  **Ensure you have Node.js and pnpm installed.**
    - Node.js version should match the one specified in the root `package.json` (`engines.node`).
    - pnpm version should match the one specified in `packageManager` in the root `package.json`.

2.  **Install Dependencies:**
    Navigate to the root directory of the cloned repository and run:
    ```sh
    pnpm install
    ```
    This command will install all necessary dependencies for all packages and apps in the monorepo.

3.  **Set Up Environment Variables:**
    Both the `web` and `api` applications might require environment variables for local development.

    *   **For the Web App (`apps/web`):**
        Create a `.env.local` file in the `apps/web` directory. Refer to the `apps/web/next.config.js` (or similar configuration files) to see what environment variables might be expected (e.g., `NEXT_PUBLIC_API_URL`). For basic local setup, you might need:
        ```env
        # apps/web/.env.local
        NEXT_PUBLIC_API_URL=http://localhost:3000 # Port where your local API will run
        
        # For the simple password authentication (if implemented):
        # PASSWORD_SALT=your_generated_salt_for_local_dev
        # SHARED_PASSWORD_HASH=your_generated_hash_for_local_dev
        ```
        *(To generate `PASSWORD_SALT` and `SHARED_PASSWORD_HASH`, you can use the command: `node -e "const crypto = require('crypto'); const p = 'your_local_password'; const s = crypto.randomBytes(16).toString('hex'); const h = crypto.pbkdf2Sync(p, s, 100000, 64, 'sha512').toString('hex'); console.log('PASSWORD_SALT=' + s + '\nSHARED_PASSWORD_HASH=' + h);"`)*

    *   **For the API App (`apps/api`):**
        Create a `.env` file in the `apps/api` directory. Example content:
        ```env
        # apps/api/.env
        PORT=3000 # Port for the API to run on
        NODE_ENV=development
        # Add any other necessary variables like database URLs, etc.
        ```

4.  **Run in Development Mode:**
    From the root directory of the monorepo, run:
    ```sh
    pnpm dev
    ```
    This command uses Turborepo to start all applications (web and api) in development mode simultaneously. 
    - The web app (Vinly frontend) will typically be available at `http://localhost:3001` (or the port specified in `apps/web/package.json` or its `.env.local`).
    - The API backend will typically be available at `http://localhost:3000` (or the port specified in `apps/api/.env`).

5.  **Build for Production:**
    To build all apps and packages for production, run the following command from the root directory:
    ```sh
    pnpm build
    ```

## Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```
cd my-turborepo
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
npx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.com/docs/reference/configuration)
- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)
