const benefits = [
  ["benefit-activation.svg", "Activare în 0–48 ore după înregistrare"],
  ["benefit-payments.svg", "Rapoarte și plăți săptămânale"],
  ["benefit-campaigns.svg", "Campanii și beneficii exclusive"],
  ["benefit-support.svg", "Suport dedicat"],
  ["benefit-cities.svg", "40+ orașe"],
  ["benefit-community.svg", "800+ membri parteneri"],
  ["benefit-group.svg", "Grup pentru comunitate"],
  ["benefit-announcements.svg", "Canal de anunțuri oficial"],
] as const;

const offers = [
  {
    id: "flexibility",
    icon: "◷",
    label: "Flexibilitate",
    title: "Flexibilitate",
    lead: "Tu îți faci programul",
    description: "Dar ține minte că productivitatea se realizează prin disciplină și consistență.",
  },
  {
    id: "autonomy",
    icon: "◈",
    label: "Autonomie",
    title: "Autonomie",
    lead: "Ești propriul șef — tu decizi nivelul de muncă și cum o faci",
    description: "Dar sperăm să ții cont de conduita de bun simț și cooperare a platformelor și flotei 🙏",
  },
  {
    id: "earnings",
    icon: "◉",
    label: "Câștiguri competitive",
    title: "Câștiguri competitive",
    lead: "3.000–6.000 lei/lună venit net",
    description: "Noi îți oferim sfaturi, bonusuri și campanii pentru a-ți maximiza profitul — tu decizi unde pui pragul 💪",
  },
  {
    id: "payments",
    icon: "▤",
    label: "Plăți săptămânale",
    title: "Plăți și rapoarte săptămânale stabile",
    lead: "Încasările tale sunt în siguranță cu noi",
    description: "Primești raport săptămânal și plata direct pe IBAN; plată corectă până la ultimul cent, pentru munca ta 👌",
  },
  {
    id: "support",
    icon: "◌",
    label: "Suport dedicat",
    title: "Suport dedicat",
    lead: "Staff-ul și comunitatea îți sunt alături",
    description: "Oricând ai probleme, nu ești singur — comunitatea, staff-ul flotei, cât și asistența de la platforme îți sunt alături.",
  },
  {
    id: "safety",
    icon: "◇",
    label: "Siguranță",
    title: "Siguranță",
    lead: "Un mediu sigur și stabil",
    description: "Datele și activitatea ta din cadrul flotei sunt în siguranță cu noi — adică, ești în siguranță cu noi ✌️",
  },
  {
    id: "system",
    icon: "✦",
    label: "Sistemul flotei",
    title: "Sistemul flotei",
    lead: "Platforme unice, tehnologie intuitivă",
    description: "Avem aplicație mobilă, grup de comunitate, canal de anunțuri, sistem de ticketing și multe altele.",
  },
] as const;

export function HomeShowcase() {
  return (
    <section className="home-showcase" aria-labelledby="showcase-title">
      <div className="showcase-glow" aria-hidden="true" />

      <div className="showcase-media">
        <div className="showcase-video">
          <h2 className="showcase-section-title showcase-video-title">
            <span><strong>CibeRO</strong> - Prezentare</span>
          </h2>
          <div className="video-frame" data-youtube-id="Fwhi7cUeE4E">
            <button className="video-poster" type="button" aria-label="Redă videoclipul de prezentare CibeRO">
              <img src="https://i.ytimg.com/vi/Fwhi7cUeE4E/maxresdefault.jpg" alt="Coperta videoclipului de prezentare CibeRO" />
              <span className="video-shade" aria-hidden="true" />
              <span className="video-play" aria-hidden="true"><i /></span>
              <span className="video-action" aria-hidden="true">Vezi prezentarea</span>
            </button>
            <noscript><a href="https://youtube.com/shorts/Fwhi7cUeE4E">Vezi prezentarea CibeRO pe YouTube</a></noscript>
          </div>
        </div>
      </div>

      <div className="showcase-benefits">
        <h1 id="showcase-title" className="showcase-section-title">
          <span>Tot ce ai nevoie <em>ca să livrezi</em></span>
        </h1>
        <div className="showcase-benefit-grid">
          {benefits.map(([icon, label]) => (
            <article className="showcase-benefit" key={label}>
              <span className="showcase-benefit-icon"><img src={`/assets/${icon}`} alt="" /></span>
              <h2>{label}</h2>
            </article>
          ))}
        </div>
      </div>

      <section className="offer-extension" aria-labelledby="offer-extension-title">
        <div className="offer-bridge" aria-hidden="true"><span /></div>
        <header className="offer-heading">
          <p>Beneficii în detaliu</p>
          <h2 id="offer-extension-title">Îți oferim:</h2>
        </header>
        <div className="offer-tabs" role="tablist" aria-label="Beneficiile flotei CibeRO">
          {offers.map((offer, index) => (
            <button
              id={`offer-tab-${offer.id}`}
              className={`offer-tab${index === 0 ? " active" : ""}`}
              type="button"
              role="tab"
              aria-selected={index === 0}
              aria-controls={`offer-panel-${offer.id}`}
              data-offer-tab={offer.id}
              tabIndex={index === 0 ? 0 : -1}
              key={offer.id}
            >
              <span>{offer.icon}</span><strong>{offer.label}</strong>
            </button>
          ))}
        </div>
        <div className="offer-panels">
          {offers.map((offer, index) => (
            <article
              id={`offer-panel-${offer.id}`}
              className={`offer-panel${index === 0 ? " active" : ""}`}
              role="tabpanel"
              aria-labelledby={`offer-tab-${offer.id}`}
              data-offer-panel={offer.id}
              hidden={index !== 0}
              key={offer.id}
            >
              <span>{offer.icon}</span>
              <div><h3>{offer.title}</h3><strong>{offer.lead}</strong><p>{offer.description}</p></div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
