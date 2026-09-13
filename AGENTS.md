<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# CibeRO Project Rules

- Nu lucra direct pe `main`.
- Fiecare task semnificativ trebuie să folosească un branch separat pornit din ultimul `main`.
- Folosește convențiile de naming: `feat/<name>`, `fix/<name>`, `chore/<name>` sau `refactor/<name>`.
- Un branch trebuie să conțină o singură zonă logică de lucru.
- Nu face merge automat în `main` decât dacă utilizatorul cere explicit.
- Înainte de finalizarea unui task rulează `npm run typecheck` și `npm run build`.
- Nu expune environment variables secrete.
- `SUPABASE_SECRET_KEY` și cheile service-role sunt exclusiv server-side.
- Variabilele `NEXT_PUBLIC_*` pot ajunge în browser și nu trebuie să conțină secrete.
- Modificările bazei de date trebuie realizate prin migrations versionate, nu prin schimbări ad-hoc în Production.
- Nu modifica schema Production direct fără instrucțiune explicită.
- Preserve existing public URLs unless the task explicitly requires changing them.
- Preserve existing visual design unless redesign is explicitly requested.
- Pentru modificări ample, verifică atât desktop cât și mobile.
- Nu șterge assets sau cod legacy până nu confirmi că nu mai sunt utilizate.
- Dacă există un PR activ pentru aceeași zonă, evită să creezi modificări concurente incompatibile.
