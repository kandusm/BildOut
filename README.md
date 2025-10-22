# QuickBill

A niche-focused invoice generator with embedded payments, built for trade and service professionals.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS v3.4
- **UI Components:** Shadcn UI
- **Database:** Supabase (Postgres + Auth + Storage + RLS)
- **Payments:** Stripe Connect Express
- **Email:** Resend
- **Analytics:** PostHog
- **Hosting:** Vercel

## 📁 Project Structure

```
invoice-app/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Protected merchant dashboard
│   ├── (marketing)/       # Public pages (landing, SEO)
│   ├── pay/               # Public payment pages
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # Shadcn UI components
│   ├── invoice/          # Invoice-specific components
│   └── payments/         # Payment forms
├── lib/                  # Utility functions
│   ├── supabase/         # Supabase clients
│   ├── stripe/           # Stripe helpers
│   ├── validations/      # Zod schemas
│   └── calculations/     # Invoice math
├── types/                # TypeScript type definitions
├── supabase/
│   └── migrations/       # Database migrations
├── emails/               # Email templates (React Email)
└── public/               # Static assets
```

## 🗂️ Documentation

- **[TECHNICAL_SPEC.md](./TECHNICAL_SPEC.md)** - Complete technical specification
- **[WORK_PLAN.md](./WORK_PLAN.md)** - 6-week development plan with daily tasks

## 🔑 Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your credentials:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Resend
RESEND_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🏗️ Current Status

### ✅ Completed
- Project initialization (Next.js 15 + TypeScript)
- Tailwind CSS v3.4 configuration
- Project structure setup
- Technical specification document
- 6-week work plan

### 🚧 In Progress
- Day 2: Supabase setup & database schema

### 📋 Next Steps
1. Set up Supabase project
2. Run database migrations
3. Configure authentication
4. Build Stripe Connect integration

## 📖 Key Features (Planned)

- ✨ Fast invoice creation with line items
- 💳 Embedded payment processing (Stripe)
- 📊 Partial payments & deposits
- 📧 Automated email notifications
- 📄 Professional PDF generation
- 🏢 Multi-user support (Agency plan)
- 📈 Simple analytics dashboard
- 🔍 SEO-optimized template pages

## 🎯 MVP Goals (90 days)

- 100 signups
- 25 activated merchants (≥1 invoice sent)
- 10 paying Pro subscribers
- $1,500 GMV processed
- 1,000 organic sessions/month

## 📝 License

Private project - All rights reserved

## 🤝 Contributing

This is a private project. Development follows the work plan in `WORK_PLAN.md`.

---

**Built with ❤️ for trade professionals**
