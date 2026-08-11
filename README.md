# PlayQZ — Kazakhstan football booking MVP

This is an original MVP starter inspired by the *functional model* of sports-booking marketplaces. It is not a copy of Playspot's proprietary source code, branding, text, images or design.

## 1. Install

Install Node.js LTS, then:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually:

http://localhost:5173

## 2. Supabase

Create a Supabase project.

Open SQL Editor and run:

`supabase/schema.sql`

Then copy `.env.example` to `.env` and fill:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Restart the dev server.

## 3. What already works

- Home page
- City search
- Pitch listing
- Price filter
- Pitch detail page
- Date selection
- Slot selection
- Booking form
- Booking insert into Supabase (when configured)
- Venue landing page
- Demo venue dashboard
- FAQ/contact/legal placeholders
- Responsive mobile layout

## 4. What must be built before real launch

1. Supabase Auth (Google + phone/email)
2. Real availability engine
3. Booking collision protection / database constraints
4. Venue owner onboarding
5. Owner dashboard connected to Supabase
6. Notifications (email/SMS/WhatsApp strategy)
7. Kazakhstan payment integration
8. Refund/cancellation logic
9. Admin moderation
10. Kazakhstan-specific legal documents
11. Analytics
12. Production security/RLS
13. Domain + deployment

## Recommended architecture

Frontend: React + TypeScript + Vite
Database/Auth/Storage: Supabase
Backend logic: Supabase Edge Functions
Payments: Kazakhstan-local processor / Kaspi-compatible merchant flow
Hosting: Vercel or Cloudflare Pages

Do not put private payment or Supabase service-role keys in VITE_* variables.
