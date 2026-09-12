# CibeRO Web

Fundația aplicației publice CibeRO folosește Next.js, React și TypeScript. Migrarea este intenționat graduală: homepage-ul rulează prin App Router, iar paginile publice cu fluxuri complexe sunt păstrate temporar în `public/` pentru compatibilitate vizuală și funcțională.

## Comenzi

```bash
npm install
npm run dev
npm run typecheck
npm run build
npm start
```

## Structură

- `app/` — App Router, layout, metadata și homepage.
- `components/` — componentele React ale homepage-ului și navigației publice.
- `lib/supabase/` — utilitare separate pentru browser, server și operațiuni privilegiate.
- `public/` — imaginile, stilurile, scripturile și rutele legacy păstrate în prima etapă de migrare.
- `supabase/` — funcțiile Edge și migrările existente, nemodificate de această etapă.

## Supabase

Codul din browser folosește doar:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Codul server-side poate folosi `SUPABASE_SECRET_KEY` prin utilitarul marcat `server-only`. Cheile legacy sunt acceptate numai ca fallback de compatibilitate. Nicio cheie secretă nu trebuie prefixată cu `NEXT_PUBLIC_`.

Copiază `.env.example` ca `.env.local` numai pentru dezvoltare locală și completează valorile în afara repository-ului.

## Migrare graduală

Rutele `/admin/`, `/campanii/`, `/inregistrare/`, `/locuri/`, `/onboarding/`, `/orase/`, `/ticket/` și `/tickete/` sunt rescrise intern către paginile statice păstrate. Astfel, formularele, autentificarea existentă, hărțile, tutorialele și integrarea Supabase continuă să funcționeze până când fiecare flux va fi migrat separat în React.
