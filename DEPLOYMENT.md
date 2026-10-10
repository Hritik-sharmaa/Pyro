# Deploying Pyro

Pyro deploys as **one web service**: the Express server serves the API (`/api/*`),
the game posters (`/assets/*`) **and** the built React app (everything else). One
URL, no CORS, no cookie problems, one set of environment variables.

```
Browser ──► https://your-app.example.com
              ├─ /api/*      → Express routes  → MongoDB
              ├─ /assets/*   → game posters (assets/poster/*)
              └─ /*          → React app (frontend/dist, SPA fallback)
```

You need three things before the app can run anywhere:

1. a **MongoDB** database (Atlas free tier is fine),
2. a few **environment variables** (see [reference](#environment-variables)),
3. a host that can run Node 20+ **or** Docker.

---

## 0. Do this first: rotate leaked secrets

Earlier commits of this repo contained a real `.env` and `frontend/.env`
(MongoDB password, API keys, …). Git history keeps them forever, so treat them
as **public** and replace them — don't reuse any of them:

| Secret | Where to rotate |
|---|---|
| MongoDB user password | Atlas → Database Access → edit user → new password |
| Resend API key | resend.com → API Keys → delete + create |
| Gemini API key (was in `frontend/.env`) | Google AI Studio → delete the key |
| Google OAuth client secret | Google Cloud Console → Credentials → reset secret |
| Gmail app password (`SMTP_PASSWORD`) | Google Account → App passwords → revoke + create |
| `JWT_SECRET`, `SESSION_SECRET` | just generate new random strings |
| RAWG API key | rawg.io → regenerate |

`frontend/.env` is no longer tracked, and `.gitignore` blocks every `.env*` file
except `.env.example`.

---

## 1. Create the database (MongoDB Atlas)

1. Create a free **M0** cluster at <https://cloud.mongodb.com>.
2. **Database Access** → add a user with a strong password (letters/digits only
   avoids URL-encoding problems).
3. **Network Access** → *Add IP Address* → **Allow access from anywhere
   (`0.0.0.0/0`)**. Free hosts have no fixed IP, so this is required — it is the
   most common reason for "Could not connect to any servers in your MongoDB Atlas
   cluster".
4. **Connect → Drivers** → copy the connection string and put the database name
   before the `?`:

   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/pyro?retryWrites=true&w=majority
   ```

   This is your `MONGO_URI`.

### Load the games

A new database is empty, so the store shows no games. Seed it once **from your
own computer** (it takes a few minutes):

```bash
npm install
cp .env.example .env        # then fill MONGO_URI, RAWG_API_KEY, BASE_URL
npm run seed                # imports ~200 games from RAWG
```

Already have a seeded database? Run `npm run seed:posters` once instead, to
apply the corrected poster file names to the existing documents.

---

## 2. Deploy

### Option A — Render (free, recommended)

1. Push this repo to GitHub.
2. Render dashboard → **New → Blueprint** → pick the repo. It reads
   [`render.yaml`](render.yaml) and asks for the secret values.
   *(Manual alternative: **New → Web Service**, runtime **Node**, build
   `npm ci && npm run build`, start `npm start`, health check `/api/health`.)*
3. Fill in `MONGO_URI`, `ADMIN_PASSWORD`, `RESEND_API_KEY` (and the Google pair if
   you use Google login). `JWT_SECRET`/`SESSION_SECRET` are generated for you.
4. Deploy. When it's live, copy the URL (e.g. `https://pyro.onrender.com`) and set
   `CLIENT_URL` to it, then redeploy.

Free instances sleep after ~15 min idle; the first request afterwards takes
30–60 s to wake up.

### Option B — Docker (Railway, Fly.io, Koyeb, Cloud Run, a VPS, …)

The [`Dockerfile`](Dockerfile) builds the React app and bundles it with the server:

```bash
docker build -t pyro .
docker run -p 3000:3000 \
  -e MONGO_URI="mongodb+srv://…/pyro?retryWrites=true&w=majority" \
  -e JWT_SECRET="…" -e SESSION_SECRET="…" -e ADMIN_PASSWORD="…" \
  -e CLIENT_URL="http://localhost:3000" \
  pyro
```

On a hosted container platform, point it at this repo (it detects the
Dockerfile), set the same variables in its dashboard, and expose port `3000`
(most inject `PORT` automatically — the app honours it).

### Option C — any Node host (Railway/Nixpacks, Heroku, Azure App Service, …)

| Setting | Value |
|---|---|
| Build command | `npm ci && npm run build` |
| Start command | `npm start` |
| Node version | 20 or newer |
| Health check | `GET /api/health` |

### Option D — frontend and backend on different hosts

Only do this if you specifically want, e.g., the UI on Vercel/Netlify.

* **Backend** (Render/Docker as above): set `CLIENT_URL=https://<your-frontend>`
  (this also allows that origin through CORS).
* **Frontend**: Root Directory `frontend`, build `npm run build`, output `dist`,
  and set `VITE_BACKEND_URL=https://<your-backend>` **before** building — Vite
  inlines it at build time. [`frontend/vercel.json`](frontend/vercel.json)
  already contains the SPA rewrite.

Vercel/Netlify are *not* a good home for the Express backend: it expects a
long-running server (in-memory sessions, ~170 poster files).

---

## 3. Optional integrations

### Email (verification code, password reset, order confirmation)

Registration **requires** working email — without it, signup fails with
"We couldn't send the verification email".

* **Resend (`RESEND_API_KEY`)** — sent over HTTPS, so it works on every host.
  Caveat: until you [verify a domain](https://resend.com/domains), Resend only
  delivers to the email address of your own Resend account. Set `EMAIL_FROM`
  (e.g. `Pyro <no-reply@yourdomain.com>`) once the domain is verified.
* **SMTP (`SMTP_EMAIL` + `SMTP_PASSWORD`)** — Gmail with an
  [App Password](https://myaccount.google.com/apppasswords) by default, or any
  provider via `SMTP_HOST`/`SMTP_PORT`. **Render's free tier blocks outbound SMTP
  ports 25/465/587** ([announcement](https://render.com/changelog/free-web-services-will-no-longer-allow-outbound-traffic-to-smtp-ports)),
  so use Resend there, a paid instance, or a host that allows SMTP.

If `RESEND_API_KEY` is set it is used; otherwise SMTP is used.

### Google login

1. Google Cloud Console → *APIs & Services → Credentials → Create OAuth client ID
   (Web application)*.
2. **Authorized redirect URI**: `https://<your-domain>/api/auth/google/callback`
   (and `http://localhost:3000/api/auth/google/callback` for local testing).
3. Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

If these are unset, the rest of the app works and the Google button returns a
"not configured" message.

### Admin dashboard

`/admin` asks for the password from `ADMIN_PASSWORD`. It is checked **on the
server**; if the variable is not set the admin API is disabled.

---

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `MONGO_URI` | **yes** | MongoDB connection string (include the DB name). |
| `JWT_SECRET` | **yes** | Signs login tokens. Long random string. |
| `SESSION_SECRET` | recommended | Express session secret (falls back to `JWT_SECRET`). |
| `ADMIN_PASSWORD` | recommended | Password for `/admin`. Unset ⇒ admin API disabled. |
| `CLIENT_URL` | recommended | Public site URL, no trailing slash. Used in reset emails and the post-Google-login redirect; also allowed by CORS. If unset it is inferred from the request. |
| `RESEND_API_KEY` | for email | Send email through Resend (HTTPS). |
| `EMAIL_FROM` | optional | Sender address override. |
| `SMTP_EMAIL`, `SMTP_PASSWORD` | for email (alt.) | SMTP login (Gmail by default). |
| `SMTP_HOST`, `SMTP_PORT` | optional | Use a non-Gmail SMTP provider. |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | for Google login | OAuth credentials. |
| `GOOGLE_CALLBACK_URL` | optional | Pin the OAuth callback to an absolute URL. |
| `RAWG_API_KEY`, `BASE_URL` | only for `npm run seed` | Import games (`BASE_URL=https://api.rawg.io/api/games`). |
| `CORS_ORIGINS` | optional | Extra allowed origins (comma-separated), split deployments only. |
| `PORT` | automatic | Injected by the host; defaults to `3000`. |
| `VITE_BACKEND_URL` | **build time**, split deployments only | Backend URL baked into the frontend. Leave unset for the single-service setup. |

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Site loads but every list is empty / "Network Error" in browser console, requests go to `localhost:3000` | Frontend was built with a `VITE_BACKEND_URL=http://localhost:3000` | Don't set it for single-service deploys; rebuild. (A committed `frontend/.env` used to cause this.) |
| Logs: `Missing required environment variable(s): MONGO_URI…` | Env vars not set on the host | Add them in the platform dashboard. |
| Logs: `Could not connect to any servers in your MongoDB Atlas cluster` | Atlas IP allow-list | Atlas → Network Access → `0.0.0.0/0`. |
| Logs: `bad auth` / `Authentication failed` | Wrong DB user/password, or special characters not URL-encoded | Re-check `MONGO_URI`; use a simple password. |
| Games list empty, no errors | Fresh database | Run `npm run seed` (see above). |
| Signup says "couldn't send the verification email" | No email provider, SMTP blocked, or Resend sandbox recipient | See [Email](#email-verification-code-password-reset-order-confirmation). |
| Google login: `redirect_uri_mismatch` | Callback URL not registered | Add `https://<domain>/api/auth/google/callback` in Google Cloud Console. |
| Google login redirects to `localhost` | Old build / `CLIENT_URL` wrong | Set `CLIENT_URL` to the public URL. |
| Posters broken | Host doesn't include `assets/` (e.g. deploying only `backend/`) | Deploy from the repo root so `assets/poster` ships with the app. |
| Admin dashboard says "Admin access is disabled" | `ADMIN_PASSWORD` unset | Set it and redeploy. |
| First page load takes ~1 min | Free tier cold start | Normal; upgrade or use an uptime pinger. |
| Build fails: ``npm ci` can only install packages when your package.json and package-lock.json are in sync` / `Missing: gcp-metadata@5.3.0 from lock file` | Lockfile was generated by a newer npm than the host's (Render on Node 20 uses npm 10); `mongoose` and `google-auth-library` declare conflicting optional peers | Already handled: the committed `.npmrc` sets `legacy-peer-deps=true`. After changing dependencies, regenerate with `npx npm@10 install` (not a newer npm) and commit `package-lock.json`. |
| Build fails: `FATAL ERROR: Reached heap limit … JavaScript heap out of memory` | The frontend build needs more RAM than the host's build machine (512 MB on free tiers) | Already handled: `frontend/vite-plugins/slim-react-icons.js` cuts the build to ~256 MB. Keep importing icons as `import { X } from "react-icons/<pack>"`. |
