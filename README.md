# PaiBots Advertising — paibotsadvertising.com

Marketing site for PaiBots Advertising. Astro + Tailwind static site, deployed to AWS (S3 + CloudFront).

> ⚠️ **The GitHub repo is public.** Never commit secrets (API keys, AWS keys, PATs, `.env` values). `.env` is gitignored — keep it that way.

---

## Stack

- **Framework:** Astro 5 (static output)
- **Styling:** Tailwind CSS (via `@tailwindcss/vite`)
- **Content (planned):** Sanity (folder scaffolded, schemas pending)
- **Lead form backend:** AWS Lambda + SES (`lambda/lead-submit/`)
- **Hosting:** AWS S3 (origin) + CloudFront (CDN) + Route 53 (DNS) + ACM (TLS)

---

## Local development

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # generates ./dist/
npm run preview      # preview the production build locally
```

Requires Node 18+.

---

## Environment variables

Copy `.env.example` to `.env` and fill in:

| Variable | Purpose |
| --- | --- |
| `PUBLIC_SANITY_PROJECT_ID` | Sanity project ID (leave blank until CMS is wired) |
| `PUBLIC_SANITY_DATASET` | Defaults to `production` |
| `PUBLIC_SITE_URL` | `https://paibotsadvertising.com` |
| `PUBLIC_LEAD_NOTIFY_EMAIL` | Where lead-form submissions are emailed |
| `PUBLIC_LEAD_API_URL` | Public URL of the deployed `lead-submit` Lambda (leave blank to disable form) |

`.env` is gitignored. Do not commit.

---

## GitHub

| | |
| --- | --- |
| **Repo** | https://github.com/paibotsadvertising/priya-personal-website |
| **Owner account** | `paibotsadvertising` (GitHub user account, not org) |
| **Default branch** | `main` |
| **Visibility** | Public |

### Pushing from a new machine

You need credentials for the `paibotsadvertising` GitHub account (a classic PAT with `repo` scope). Store them in `~/.netrc` so git uses them automatically — never paste tokens into commands or chat:

```bash
cat > ~/.netrc <<'EOF'
machine github.com
login paibotsadvertising
password <YOUR_CLASSIC_PAT_HERE>
EOF
chmod 600 ~/.netrc
```

Then `git push origin main` works without prompts.

> If you accidentally expose a token (in chat, in a commit, anywhere): **revoke it immediately** at https://github.com/settings/tokens and generate a new one.

---

## AWS deployment

### Account & access

| | |
| --- | --- |
| **AWS Account ID** | `078455283538` |
| **Deploy IAM user** | `paibots-deployer` |
| **Local AWS profile name** | `paibots` |
| **Region** | `ap-south-1` (Mumbai) |

Configure once on a new machine (paste keys in your terminal only — never in chat or commits):

```bash
aws configure --profile paibots
# AWS Access Key ID:     <from paibots-deployer>
# AWS Secret Access Key: <from paibots-deployer>
# Default region:        ap-south-1
# Default output:        json
```

Verify: `aws sts get-caller-identity --profile paibots` — should show account `078455283538`.

### Infrastructure (already provisioned)

| Resource | Identifier |
| --- | --- |
| **S3 bucket** (origin) | `paibots-site` (ap-south-1, S3 website hosting enabled) |
| **CloudFront distribution** | `E2WGS6QT1Y0BB3` |
| **CloudFront default domain** | `d3mweapp1ghr4l.cloudfront.net` |
| **Custom domains** | `paibotsadvertising.com`, `www.paibotsadvertising.com` |
| **Route 53 hosted zone** | `Z06427421GG7J3RH62QN3` |
| **ACM certificate** | `paibotsadvertising.com` (issued in `us-east-1`, required for CloudFront) |

### Deploy procedure (manual — current)

```bash
npm run build
aws s3 sync dist/ s3://paibots-site/ --delete --profile paibots
aws cloudfront create-invalidation \
  --profile paibots \
  --distribution-id E2WGS6QT1Y0BB3 \
  --paths "/*"
```

The site is live at https://paibotsadvertising.com within ~2 min of the invalidation completing.

> **GitHub Actions auto-deploy is not yet wired.** When ready, add a workflow at `.github/workflows/deploy.yml` and store `AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY` as GitHub repo secrets (Settings → Secrets and variables → Actions).

---

## Sanity CMS (optional, not yet wired)

Folder `sanity/schemas/` exists but is empty. Until schemas are added and `PUBLIC_SANITY_PROJECT_ID` is set, the site reads all content from `src/lib/site.ts` (fallback constants). No action needed for current deploys.

---

## Lead form Lambda

`lambda/lead-submit/` — Node.js Lambda using `@aws-sdk/client-sesv2` to send lead submissions by email. Deploy separately to AWS Lambda; expose via Function URL or API Gateway and put that URL in `PUBLIC_LEAD_API_URL`.

---

## Project structure

```
src/
  components/    Astro components (Hero, Header, Footer, Slideshow, etc.)
  pages/         Routes (index.astro + services/[slug].astro)
  layouts/       Base layout
  lib/site.ts    Site-wide content constants (used as Sanity fallback)
  styles/        Global Tailwind + custom CSS
public/          Static assets (images, favicon)
lambda/          AWS Lambda backend(s)
sanity/          Sanity Studio scaffold (schemas pending)
```
