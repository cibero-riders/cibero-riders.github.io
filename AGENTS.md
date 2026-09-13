<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# CibeRO Project Rules

- Site-ul public curent este GitHub Pages, publicat din `main`. Nu utiliza Vercel pentru preview, deploy sau validare decât dacă utilizatorul solicită explicit o migrare la Vercel.
- Înainte de orice schimbare, pornește din ultimul `main` disponibil.
- Fluxul standard este economic: grupează ajustările mici care țin de aceeași zonă, creează commit și fă push direct pe `main`. Nu crea Pull Request și nu cere confirmare manuală pentru publicarea unui task obișnuit.
- Folosește branch și Pull Request numai dacă utilizatorul le cere explicit sau dacă o schimbare cu risc ridicat are nevoie de izolare.
- Pentru modificări de CSS, HTML static sau conținut, fă verificări țintite și `git diff --check`; rulează `npm run typecheck` și `npm run build` doar dacă utilizatorul le cere sau modificarea afectează cod TypeScript/Next.js, configurația, dependențele, autentificarea ori baza de date.
- Pentru schimbări funcționale ample, verifică atât desktop cât și mobile.
- Nu expune environment variables secrete.
- `SUPABASE_SECRET_KEY` și cheile service-role sunt exclusiv server-side.
- Variabilele `NEXT_PUBLIC_*` pot ajunge în browser și nu trebuie să conțină secrete.
- Modificările bazei de date trebuie realizate prin migrations versionate, nu prin schimbări ad-hoc în Production.
- Nu modifica schema Production direct fără instrucțiune explicită.
- Preserve existing public URLs unless the task explicitly requires changing them.
- Preserve existing visual design unless redesign is explicitly requested.
- Nu șterge assets sau cod legacy până nu confirmi că nu mai sunt utilizate.
- Dacă există un branch sau PR activ pentru aceeași zonă, verifică mai întâi dacă modificările lui au ajuns deja în `main`.
