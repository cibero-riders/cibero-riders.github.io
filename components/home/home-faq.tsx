const questions = [
  {
    question: "Ce îmi trebuie pentru a livra?",
    content: <p>Odată ce contul tău e activ, ai nevoie de un vehicul, telefon cu Android/iOS și de o geantă termoizolantă.</p>,
  },
  {
    question: "Când primesc plățile?",
    content: <p>Rapoartele cu încasările și plățile în contul IBAN înregistrat sunt trimise săptămânal.</p>,
  },
  {
    question: "La ce platforme pot avea cont?",
    content: <p>Vei începe cu Bolt Food pentru a te acomoda cât mai ușor, după care poți cere activare și la Glovo sau/și Wolt, după câteva săptămâni de activitate.</p>,
  },
  {
    question: "Cum are loc comunicarea?",
    content: <><p>Comunicarea o desfășurăm pe grupul nostru de Telegram, unde avem și un canal de anunțuri pe care transmitem noutăți și informații.</p><p>Prin intermediul platformelor noastre poți face tickete.</p></>,
  },
  {
    question: "Ce comision se reține din veniturile mele?",
    content: <><p><strong>1. Administrare completă:</strong> dacă vrei să ne ocupăm noi de hârtii, contabilitate, impozit la stat etc., din încasările tale 10% se duc la stat, 7% reține flota, iar 1,5% este taxa pentru aplicațiile platformelor Bolt Food, Glovo și Wolt.</p><p><strong>2. PFA:</strong> dacă ai un PFA sau vrei să-ți deschizi unul, noi te putem ajuta. Comisionul perceput de flotă este de 12,5% în acest caz.</p><p><strong>3. S.R.L. (contract de muncă):</strong> se rețin 12,5% din venituri și 420 lei/săptămână pentru cartea de muncă. Dacă vrei să devii sub-flotă la noi, comisioanele vor scădea.</p></>,
  },
  {
    question: "Cum pot deveni sub-flotă la CibeRO?",
    content: <p>Mergi la <a href="https://cibero-manager-tool.bolt.host/inscriere">Înregistrare</a> și selectează S.R.L., apoi lasă o notă la cerere în care menționezi intenția. Echipa CibeRO te va contacta în curând.</p>,
  },
  {
    question: "Avem activitate în orașul tău?",
    content: <p>Cel mai probabil, da. Activăm în peste 50 de orașe și avem o rețea suficient de remote încât să putem gestiona și de la distanță. Dă click pe <a href="/orase/">Orașe</a> pentru a verifica orașul tău.</p>,
  },
] as const;

export function HomeFaq() {
  return (
    <section className="home-faq" aria-labelledby="faq-title">
      <header>
        <p className="showcase-kicker"><span />Informații utile<span /></p>
        <h2 id="faq-title">Întrebări frecvente</h2>
      </header>
      <div className="home-faq-list">
        {questions.map(({ question, content }) => (
          <details key={question}>
            <summary>{question}<span aria-hidden="true" /></summary>
            {content}
          </details>
        ))}
      </div>
    </section>
  );
}
