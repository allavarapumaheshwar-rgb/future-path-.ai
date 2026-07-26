# Plan: FuturePath AI — Comprehensive College & Scholarship Hub

## Goal
Transform the existing College Finder and Scholarship Hub into a world-class, searchable student resource platform without removing any existing features. Add 500+ colleges and 1000+ scholarships with rich metadata, detail pages, advanced filters, and authenticated save/compare/share capabilities.

## What will be built

### 1. Database schema (Lovable Cloud / Supabase)
New public tables with full GRANT/RLS setup:
- `colleges` — name, state, district, city, type (govt/private/autonomous/central/state/deemed), category tags, courses, fees, entrance exams, eligibility, accreditation, facilities, placement stats, hostel, website, contact, description.
- `scholarships` — name, description, provider, level, category, gender, income limit, state, stream/course, amount, start/last date, documents, selection process, website, apply link, faq.
- `college_categories` & `scholarship_categories` lookup tables for clean filtering.
- Extend existing `saved_colleges` / `saved_scholarships` to reference the new tables by ID.

Access:
- Public read (`TO anon`) for college and scholarship listings/details.
- Authenticated users can save/bookmark (existing pattern).
- Service role for admin seeding.

### 2. Seed data
Because hand-crafting 500 real colleges with full details is impractical, I will:
- Build a generator script that produces a realistic, diverse starter dataset covering every requested category and every Indian state/UT.
- Target: 500+ colleges and 1000+ scholarships with plausible names, fees, courses, and contact patterns.
- Include a curated core of well-known real institutions (IITs, AIIMS, NITs, central universities, etc.) mixed with representative state/district/private colleges.
- Run the seed through the database insert tool in batches.

### 3. College Finder UI expansion
Update `/colleges` route:
- Hero with search and quick category chips.
- Advanced filter sidebar/drawer: state, district, city, stream/course, type (govt/private/...), fee range, entrance exam, ranking, hostel.
- Responsive grid/list toggle.
- Modern cards with key stats, course chips, fee range, type badge.
- "Top" quick sections: Top Engineering, Medical, Commerce, Arts, Law, Govt, Private, By State.
- Individual college detail page `/colleges/$slug` with full info, courses, fees, placements, facilities, contact, official website button, share, save, compare CTA.

### 4. Scholarship Hub UI expansion
Update `/scholarships` route:
- Hero search + deadline/status chips (Latest, Closing Soon, Newly Announced, Popular).
- Advanced filters: education level, state, category, gender, income limit, stream, deadline, govt/private.
- Grid/list view, save/bookmark, share.
- Individual scholarship detail page `/scholarships/$slug` with eligibility, benefits, documents, selection process, dates, FAQ, apply button.
- Sections: By State, By Stream, By Course, Closing Soon.

### 5. Authenticated features
- Save/unsave colleges and scholarships (extends existing dashboard saved panels).
- Compare colleges side-by-side (new authenticated feature, stores compare list in session).
- Share copy-link for any college/scholarship detail page.

### 6. Data management / admin-friendly structure
- All data lives in typed Supabase tables; future updates happen via SQL inserts/updates or a future admin UI.
- Provide a clear, documented JSON/CSV-shaped import pattern in code comments so non-developers can add rows without touching layout code.

### 7. Mobile & performance
- Responsive filter drawer on mobile.
- Virtualized/paginated lists (load more / pagination) so 500+ items render smoothly.
- Search debounced.
- SEO head metadata on every route.

## Files changed / created
- New migration for `colleges`, `scholarships`, category tables.
- New/updated routes: `src/routes/colleges.tsx`, `src/routes/colleges.$slug.tsx`, `src/routes/scholarships.tsx`, `src/routes/scholarships.$slug.tsx`.
- New server functions: `src/lib/colleges.functions.ts`, `src/lib/scholarships.functions.ts`.
- Seed script: `/tmp/seed-colleges-scholarships.ts` (run via bun) or SQL inserts.
- Updated dashboard to show saved colleges/scholarships from new tables.
- Updated `src/routeTree.gen.ts` automatically via TanStack.

## Out of scope for this pass
- External CMS integration (Sanity/Airtable) — not requested.
- Admin CRUD UI for adding colleges/scholarships — tables are designed for it, but the UI will be a follow-up if needed.
- Real-time logo fetching from external APIs — logos will be generated placeholders or initials badges to avoid broken images.

## Approval needed
Confirm you want me to proceed with this plan, especially the generated seed-data approach for 500+ colleges and 1000+ scholarships.