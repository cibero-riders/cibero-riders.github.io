# Statutul rutelor CibeRO

## Rute inactive

| Rută | Statut | Regula de mentenanță |
| --- | --- | --- |
| `/admin/` | Inactivă / legacy | Se păstrează, dar nu se actualizează odată cu modificările generale. |
| `/ticket/` | Inactivă / legacy | Se păstrează, dar nu se actualizează odată cu modificările generale. |
| `/tickete/` | Alias inactiv către `/ticket/` | Urmează statutul rutei `/ticket/`. |
| `/locuri/` | Inactivă / legacy | Pagină veche de disponibilitate, legată de fluxul inactiv `/admin/`. |
| `/inregistrare/` | Inactivă / legacy | Formular intern vechi, înlocuit de înscrierea prin CIBERO Manager. |
| `/deschide-cont.html` | Inactivă / legacy | Flux vechi de deschidere a contului. |
| `/glovo-flow-variante.html` | Inactivă / prototip | Pagină de variante, exclusă din mentenanța publică. |
| `/prima-sectiune-variante.html` | Inactivă / prototip | Pagină de variante, exclusă din mentenanța publică. |
| `/wolt-variante.html` | Inactivă / prototip | Pagină de variante, exclusă din mentenanța publică. |
| `/wolt-card-variante.html` | Inactivă / prototip | Pagină de variante, exclusă din mentenanța publică. |
| `/wolt-card-sampleuri.html` | Inactivă / prototip | Pagină de mostre, exclusă din mentenanța publică. |
| `/legacy-home.html` | Inactivă / legacy | Copie veche a paginii principale, prezentă în `public/`. |

Statutul se aplică atât fișierelor publicate direct, cât și copiilor din `public/` și resurselor dedicate exclusiv acestor rute. Paginile rămân disponibile pentru compatibilitate, dar au marcaj `noindex, nofollow` și nu intră în actualizările generale de antet, footer, teme, traduceri sau conținut fără o cerere explicită.

Marcarea ca inactivă nu autorizează ștergerea fișierelor sau schimbarea URL-urilor fără confirmare explicită.
