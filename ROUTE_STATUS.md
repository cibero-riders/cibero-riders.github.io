# Statutul rutelor CibeRO

## Rute inactive

| Rută | Statut | Regula de mentenanță |
| --- | --- | --- |
| `/admin/` | Inactivă / legacy | Se păstrează, dar nu se actualizează odată cu modificările generale. |
| `/ticket/` | Inactivă / legacy | Se păstrează, dar nu se actualizează odată cu modificările generale. |
| `/tickete/` | Alias inactiv către `/ticket/` | Urmează statutul rutei `/ticket/`. |

Statutul se aplică atât fișierelor publicate direct, cât și copiilor din `public/` și resurselor dedicate exclusiv acestor rute. Paginile rămân disponibile pentru compatibilitate, dar au marcaj `noindex, nofollow` și nu intră în actualizările generale de antet, footer, teme, traduceri sau conținut fără o cerere explicită.

## Posibile rute legacy identificate la audit

Aceste rute nu au fost marcate inactive încă, deoarece pot face parte din fluxuri vechi care trebuie confirmate înainte de excludere:

- `/locuri/` — pagina veche de disponibilitate; este legată în principal din panoul `/admin/`.
- `/inregistrare/` — formular intern vechi; în site-ul curent înscrierea principală folosește formularul extern CIBERO Manager.
- `/deschide-cont.html` — flux vechi de deschidere a contului, folosit de `/locuri/` și de cod legacy.
- `/glovo-flow-variante.html`, `/prima-sectiune-variante.html`, `/wolt-variante.html`, `/wolt-card-variante.html` și `/wolt-card-sampleuri.html` — pagini de variante/prototip.
- `/legacy-home.html` — copie legacy prezentă în `public/`.

Nu șterge și nu reclasifica aceste rute fără confirmare.
