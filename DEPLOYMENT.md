# Tradelink Deployment Guide

This guide is tailored for the recommended Tradelink stack:

- **Vercel** for the Next.js application
- **Railway** for PostgreSQL
- optional **Cloudflare R2** or **AWS S3** for document storage later

## 1. Create the GitHub repository

Create a new empty GitHub repository, then push the project:

```bash
git init
git add .
git commit -m "Initial Tradelink platform scaffold"
git remote add origin <your-github-repo-url>
git branch -M main
git push -u origin main
```

## 2. Provision PostgreSQL on Railway

1. Create a new Railway project
2. Add a PostgreSQL service
3. Copy the Railway `DATABASE_URL`

## 3. Configure Vercel

1. Import the GitHub repository into Vercel
2. Set the framework to Next.js if prompted
3. Add the required environment variables

### Required environment variables

```env
DATABASE_URL=
AUTH_SECRET=
AUTH_URL=
NEXT_PUBLIC_APP_NAME=Tradelink
```

### Production values

- `DATABASE_URL` → Railway PostgreSQL connection string
- `AUTH_SECRET` → long random production secret
- `AUTH_URL` → your Vercel app URL, e.g. `https://tradelink.vercel.app`

## 4. Run Prisma setup

After configuring the database:

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

## 5. Deploy application

Once GitHub is connected, Vercel can deploy automatically from your default branch.

Recommended branch setup:

- `main` → production
- feature branches → Vercel preview deployments

## 6. Verify critical routes

After deploy, verify:

- `/`
- `/shipments`
- `/batches`
- `/documents`
- `/suppliers`
- `/copilot`
- `/sign-in`
- `/api`
- `/api/copilot`

## 7. Recommended next production steps

1. Replace demo Auth.js credentials with real identity provider login
2. Add object storage for eBDL and compliance uploads
3. Add audit logs for role actions and AI/copilot responses
4. Add staging and production Railway databases
5. Add monitoring and alerting

## Notes

- Vercel is ideal for the app layer
- Railway is a good fit for PostgreSQL and later worker services
- For heavy telemetry ingestion, consider a dedicated worker/service layer as Tradelink grows
