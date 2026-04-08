# BrainiacTennis — Next.js + Supabase + Vercel

Full-stack tennis school website with online booking, coach scheduling, and availability management.

---

## Tech stack

| Layer | Tool |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Database | Supabase (Postgres) |
| Auth (future) | Supabase Auth |
| Hosting | Vercel |
| Version control | GitHub |

---

## Project structure

```
src/
├── app/
│   ├── page.tsx              ← Homepage
│   ├── book/page.tsx         ← Client booking form
│   ├── schedule/
│   │   ├── page.tsx          ← Public availability calendar
│   │   └── coach/page.tsx    ← Coach dashboard
│   ├── about/page.tsx        ← Tennis tips + about
│   ├── reviews/page.tsx      ← Testimonials
│   ├── gallery/page.tsx      ← Photo gallery
│   ├── careers/page.tsx      ← Job listings
│   ├── contact/page.tsx      ← Contact form
│   └── api/
│       ├── bookings/route.ts ← POST/GET bookings
│       ├── coaches/route.ts  ← GET coaches
│       └── availability/route.ts ← GET/PUT availability
├── components/
│   ├── Navbar.tsx
│   └── Footer.tsx
└── lib/
    └── supabase.ts           ← Supabase client + types
```

---

## Step-by-step setup

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/brainiactennis.git
cd brainiactennis
npm install
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) → **New project**
2. Name it `brainiactennis`, choose a region close to your users
3. Once created, go to **SQL Editor → New Query**
4. Paste the entire contents of `supabase-schema.sql` and click **Run**
   - This creates the `coaches`, `availability`, and `bookings` tables
   - Seeds all 4 coaches and their default weekly availability
5. Go to **Settings → API**
   - Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - Copy **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy **service_role secret key** → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in your Supabase keys:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel via GitHub

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit — BrainiacTennis"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/brainiactennis.git
git push -u origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repo (`brainiactennis`)
3. Framework preset: **Next.js** (auto-detected)
4. Under **Environment Variables**, add all 4 keys from your `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` → set to your Vercel URL (e.g. `https://brainiactennis.vercel.app`)
5. Click **Deploy**

### 3. Connect your custom domain

1. In Vercel → your project → **Settings → Domains**
2. Add `brainiactennis.com`
3. Update your DNS at your registrar:
   - Add an **A record**: `@` → `76.76.21.21`
   - Add a **CNAME**: `www` → `cname.vercel-dns.com`
4. Vercel auto-provisions an SSL certificate

### 4. Future deploys

Every `git push` to `main` triggers an automatic redeploy on Vercel. Zero manual steps.

---

## Key pages

| URL | What it does |
|-----|-------------|
| `/` | Homepage — hero, services, coaches, testimonials |
| `/book` | Client booking form with coach dropdown |
| `/schedule` | Public availability calendar — click slot to book |
| `/schedule/coach` | Coach dashboard — manage bookings & availability |
| `/about` | Esther's bio + tennis tips |
| `/reviews` | Testimonials |
| `/gallery` | Photo gallery |
| `/careers` | Job listings |
| `/contact` | Contact form |
| `/api/bookings` | POST new booking, GET all bookings |
| `/api/coaches` | GET coaches list |
| `/api/availability` | GET/PUT coach availability |

---

## Adding email/SMS notifications (optional next step)

Install [Resend](https://resend.com) for email:

```bash
npm install resend
```

In `src/app/api/bookings/route.ts`, after the booking is created:

```ts
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)

await resend.emails.send({
  from: 'BrainiacTennis <noreply@brainiactennis.com>',
  to: body.client_email,
  subject: 'Your lesson is confirmed!',
  html: `<p>Hi ${body.client_name}, your lesson is booked for ${body.date} at ${body.time_slot}.</p>`,
})
```

Add `RESEND_API_KEY` to your Vercel environment variables.

---

## CMS — editing content without code

For non-technical content editing (tips, testimonials, coach bios), add [Sanity](https://sanity.io) or [Contentlayer](https://contentlayer.dev) as a headless CMS layer. The Supabase `coaches` table already acts as a lightweight CMS for coach profiles — edit directly in the Supabase Table Editor UI.

---

## License

Private — BrainiacTennis. All rights reserved.
