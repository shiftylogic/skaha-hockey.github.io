# Skaha Hockey Site

This is the new team website, built with Next.js, Tailwind CSS, and Recharts.
It serves as a static site suitable for GitHub Pages.

## Project Structure

- `src/app`: Pages and Layouts.
- `src/components`: UI Components.
- `src/lib`: Data logic and utilities.
- `src/data`: Generated JSON data from the SQLite DB.
- `src/content`: Migrated Markdown posts.
- `scripts`: Tools to ingest data.

## Getting Started

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000).

## Updating Data

To update the stats or posts from the main project (`../stats.db` or `../old-site/_posts`):

1.  **Run the Ingestion Scripts:**
    ```bash
    # Update Stats
    node scripts/ingest-db.js

    # Update Posts
    node scripts/migrate-posts.js
    ```

    *Note: `ingest-db.js` requires the database to be at `../../stats.db`.*

2.  **Rebuild the Site:**
    ```bash
    npm run build
    ```

## Deployment

The project is configured for Static Export (`output: "export"` in `next.config.ts`).
Running `npm run build` generates a static version of the site in the `out/` directory.

To deploy to GitHub Pages:
1.  Commit the code.
2.  Configure GitHub Actions to build this Next.js app and deploy the `out` directory.