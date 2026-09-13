const questions = [
  ["Ce îmi trebuie pentru a livra?", ["Odată ce contul tău e activ, ai nevoie de un vehicul, telefon cu Android/iOS și de o geantă termoizolantă."]],
  ["Când primesc plățile?", ["Rapoartele cu încasările și plățile în contul IBAN înregistrat sunt trimise săptămânal."]],
  ["La ce platforme pot avea cont?", ["Vei începe cu Bolt Food pentru a te acomoda cât mai ușor, după care poți cere activare la Glovo sau/și Wolt, după câteva săptămâni de activitate."]],
  ["Cum are loc comunicarea?", ["Comunicarea o desfășurăm pe grupul nostru de Telegram, unde avem și un canal de anunțuri pe care transmitem noutăți și informații.", "Prin intermediul platformelor noastre poți face tickete."]],
  ["Ce comision se reține din veniturile mele?", ["În funcție de tipul contractului de colaborare, comisionul perceput de flotă variază între 7% - 12.5%."]],
] as const;

export function HomeFaq() {
  return (
    <section className="home-faq" aria-labelledby="faq-title">
      <header>
        <p className="showcase-kicker"><span />Informații utile<span /></p>
        <h2 id="faq-title">Întrebări frecvente</h2>
      </header>
      <div className="home-faq-list">
        {questions.map(([question, answers]) => (
          <details key={question}>
            <summary>{question}<span aria-hidden="true" /></summary>
            {answers.map((answer) => <p key={answer}>{answer}</p>)}
          </details>
        ))}
      </div>
    </section>
  );
}
