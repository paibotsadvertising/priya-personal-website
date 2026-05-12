# PaiBots Advertising — Site

Marketing site for PaiBots Advertising. Astro (static SSG) + Tailwind v4 + Sanity CMS, hosted on AWS S3 + CloudFront, with a single Lambda behind API Gateway for lead capture (SES email notification).

> **Operator note:** I run several sites from this machine. This README is the single source of truth for *this* project's infra IDs, env vars, and deploy steps. Never paste credential values here — only names and locations.

---

## Repo

- **Local path:** `/Users/rahulmishra/paibotsadvertising`
- **GitHub:** `paibotsadvertising/priya-personal-website` (origin) — *if this name is wrong, rename the repo on GitHub and update the remote with `git remote set-url origin <new-url>`*
- **Default branch:** `main`
- **CI:** none yet (no `.github/workflows/` — deploys are manual; see "Deploy" below)

## Stack

| Layer | Tech |
|---|---|
| Frontend | Astro 6, Tailwind v4 |
| CMS | Sanity (project `nixmhrlo`, dataset `production`) |
| Lead API | AWS Lambda (Node.js 22.x) behind API Gateway HTTP API |
| Notifications | AWS SES (currently sandbox) |
| Hosting | S3 static website + CloudFront + Route 53 + ACM |

---

## AWS

All resources live in **AWS account `078455283538`** (separate from MyWheelsExpert).
Local CLI access: `aws --profile paibots …` (IAM user: `paibots-deployer`).

### Regional summary
- **Primary region:** `ap-south-1` (Lambda, API GW, SES, S3 bucket)
- **Edge region:** `us-east-1` (ACM cert for CloudFront, since CF requires us-east-1 certs)

### Resources
| Resource | Identifier |
|---|---|
| S3 site bucket | `paibots-site` (ap-south-1, static-website hosting) |
| CloudFront distribution | `E2WGS6QT1Y0BB3` → `d3mweapp1ghr4l.cloudfront.net` |
| CF aliases | `paibotsadvertising.com`, `www.paibotsadvertising.com` |
| ACM certificate (us-east-1) | `arn:aws:acm:us-east-1:078455283538:certificate/310435f5-ac25-429c-ac31-646eb894e701` (ISSUED) |
| Route 53 hosted zone | `paibotsadvertising.com.` (ID `Z06427421GG7J3RH62QN3`) |
| Lambda | `paibots-lead-submit` (Node.js 22.x, ap-south-1) |
| API Gateway HTTP API | `paibots-api` (ID `t328b3odoa`) |
| API base URL | `https://t328b3odoa.execute-api.ap-south-1.amazonaws.com` |
| API routes | `POST /api/lead` → `paibots-lead-submit` |
| DynamoDB | *none* (no leads-audit table; SES is the audit trail) |
| CloudWatch log group | `/aws/lambda/paibots-lead-submit` |

### SES
- **Identity:** `paibotsadvertising@gmail.com` (verified as **email address**, sandbox mode)
- **Notify recipient (lead emails):** `paibotsadvertising@gmail.com`
- **TODO:** request SES production access + verify the `paibotsadvertising.com` domain so outgoing mail isn't flagged as spam.

### Lambda env vars (set on `paibots-lead-submit` — values not stored here)
| Var | Purpose |
|---|---|
| `ALLOW_ORIGIN` | CORS allowlist (e.g. `https://paibotsadvertising.com`) |
| `SES_SENDER` | Verified SES "from" address |
| `NOTIFY_EMAIL` | Internal recipient for new-lead emails |
| `AWS_REGION` | Auto-set by Lambda runtime |

Inspect / update in the AWS console or via:

```sh
aws --profile paibots --region ap-south-1 lambda get-function-configuration \
  --function-name paibots-lead-submit --query 'Environment.Variables'
```

---

## Sanity CMS

| | |
|---|---|
| Project ID | `nixmhrlo` |
| Dataset | `production` |
| API version | `2024-01-01` |
| Studio location | `sanity/` (separate package, own `node_modules`) |
| Schemas | `sanity/schemas/` (siteSettings, navLink, service, testimonial, resultMetric, processStep, quickWin) |
| Astro fetch layer | `src/lib/queries.ts` — every component fetches via GROQ and falls back to constants in `src/lib/site.ts` if Sanity is empty/unreachable. |

### One-time setup

```bash
cd sanity && npm install              # installs studio deps
# generate an Editor token at https://www.sanity.io/manage/project/nixmhrlo/api → Tokens
cp .env.example .env.local            # paste SANITY_WRITE_TOKEN=...
cd .. && npm run studio:seed          # uploads current site.ts content as Sanity docs
```

After seeding, set `PUBLIC_SANITY_PROJECT_ID=nixmhrlo` in the repo-root `.env` so the Astro build pulls live data instead of the local fallback.

### Day-to-day commands (run from repo root)

| Command | What it does |
|---|---|
| `npm run studio:dev` | Run the Studio at `http://localhost:3333` |
| `npm run studio:build` | Build the static Studio bundle |
| `npm run studio:deploy` | Deploy the Studio to `<project>.sanity.studio` |
| `npm run studio:seed` | Re-run the migration (idempotent — safe to run again) |

### How fallback works

If `PUBLIC_SANITY_PROJECT_ID` is unset, or a query returns no documents, every component falls back to the hard-coded data in `src/lib/site.ts` and `src/lib/queries.ts`. The site never breaks because Sanity is unavailable.

---

## Environment variables (local + build)

`.env` at repo root (git-ignored). Template lives in `.env.example`:

| Var | Notes |
|---|---|
| `PUBLIC_SANITY_PROJECT_ID` | `nixmhrlo` |
| `PUBLIC_SANITY_DATASET` | `production` |
| `PUBLIC_SITE_URL` | `https://paibotsadvertising.com` |
| `PUBLIC_LEAD_NOTIFY_EMAIL` | `paibotsadvertising@gmail.com` |
| `PUBLIC_LEAD_API_URL` | `https://t328b3odoa.execute-api.ap-south-1.amazonaws.com/api/lead` |

Anything `PUBLIC_*` is inlined into the static build and is, by Astro convention, **not a secret**. Real secrets (e.g. SES, Sanity write tokens if added later) live only in Lambda env vars or `~/.paibots/secrets.env` — never in this repo.

---

## GitHub

- **Account used by `gh` CLI on this machine:** `prudentads-developer-png` (shared with MyWheelsExpert; has `repo`, `workflow`, `read:org`, `gist` scopes)
- **PaiBots-specific GitHub user:** `paibotsadvertising` (created 2026-05-11) — currently owns the `priya-personal-website` repo that this project's `origin` points to
- To act as the `paibotsadvertising` user via `gh`, run `gh auth switch` (after adding that account with `gh auth login`).

---

## Deploy

> No CI yet — every step is manual. Run from the repo root.

### Frontend (Astro → S3 → CloudFront)

```sh
npm run build
aws --profile paibots s3 sync dist/ s3://paibots-site --delete
aws --profile paibots cloudfront create-invalidation \
  --distribution-id E2WGS6QT1Y0BB3 --paths '/*'
```

### Lambda (`paibots-lead-submit`)

```sh
cd lambda/lead-submit
zip -qr /tmp/paibots-lead-submit.zip .
aws --profile paibots --region ap-south-1 lambda update-function-code \
  --function-name paibots-lead-submit \
  --zip-file fileb:///tmp/paibots-lead-submit.zip
cd -
```

### Verify after deploy

- Open `https://paibotsadvertising.com` (hard-refresh: `Cmd+Shift+R`)
- Submit a test lead → check inbox `paibotsadvertising@gmail.com`
- On failure: `aws --profile paibots --region ap-south-1 logs tail /aws/lambda/paibots-lead-submit --since 5m`

---

## Local development

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to dist/
npm run preview  # serves dist/ locally
```

---

## Other sites I run (cross-reference)

| Site | AWS Account | Local path | GitHub |
|---|---|---|---|
| **PaiBots Advertising** *(this repo)* | `078455283538` | `~/paibotsadvertising` | `paibotsadvertising/priya-personal-website` |
| MyWheelsExpert | (separate account) | `~/auto-news` | `prudentads-developer-png/mywheelsexpert-site` |

Always confirm `aws --profile …` and `git remote -v` before any deploy — the two projects share the same laptop and it's easy to push to the wrong one.

---

## Conventions

- Use package managers (`npm install <pkg>`); never hand-edit `package.json` versions
- Never commit secret values; reference them by name and store in Lambda env / local secrets file
- Hard-refresh after every CloudFront invalidation to confirm what's actually live
- Match existing comment style; don't add rationale comments explaining changes
