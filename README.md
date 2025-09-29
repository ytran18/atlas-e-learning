This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## CI/CD (GitHub Actions → Vercel)

This repo includes a workflow at `.github/workflows/vercel.yml` to:

-   Lint and build on every PR to `master` and push to `master`.
-   Deploy Preview on pull requests targeting `master`.
-   Deploy Production on pushes to `master`.

### Required GitHub Secrets

Create these repository secrets in GitHub Settings → Secrets and variables → Actions:

-   `VERCEL_TOKEN`: Personal token from Vercel (Account Settings → Tokens).
-   `VERCEL_ORG_ID`: Organization ID (Project Settings → General or from `.vercel/project.json`).
-   `VERCEL_PROJECT_ID`: Project ID (Project Settings → General or from `.vercel/project.json`).

The workflow uses Vercel CLI with `vercel pull`, `vercel build`, and `vercel deploy` to create Preview and Production deployments.

If your production branch is not `master`, update the workflow triggers accordingly.
