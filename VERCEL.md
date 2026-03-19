# Deploying the docs site to Vercel

The Vercel project should use **Root Directory** = `site` (under **Project → Settings → Build and Deployment → Root Directory**).

Because of that setting, **never run the Vercel CLI from inside `site/`**. If you run `vercel --prod` from `site/`, Vercel stacks the path as `site/site/`, Next.js is not detected, and you may see:

> No Next.js version detected…

## Manual production deploy

From the **monorepo root** (the folder that contains `site/`, `core/`, `pnpm-workspace.yaml`):

```bash
cd /path/to/fivfold
# First time only: link the repo root to your Vercel project (not site/)
vercel link
vercel --prod
```

If you previously linked only from `site/`, remove the old link and link again from the root:

```bash
rm -rf site/.vercel
vercel link
vercel --prod
```

GitHub Actions runs `vercel pull` / `vercel --prod` from the repo root for the same reason.
