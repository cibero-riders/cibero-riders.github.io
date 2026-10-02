export function HomeAbout() {
  return (
    <section id="despre-noi" className="home-about" aria-labelledby="home-about-title">
      <header>
        <p className="showcase-kicker"><span />Cine suntem<span /></p>
        <h2 id="home-about-title">Despre noi</h2>
      </header>
      <div className="home-about-copy">
        <p>
          CibeRO - flotă parteneră cu toate cele 3 platforme delivery din țară, Bolt Food, Glovo și Wolt. Colaborăm cu persoane care vor să facă curierat la oricare din platforme, cu posibilitatea de activare la toate 3 platformele. De asemenea, colaborăm cu sub-flote deja existente sau în dezvoltare (și tu poți avea una).
        </p>
        <p>
          Susținem ideea că, atunci când oamenii au libertate la a alege ei cum își gestionează viața, timpul, banii, și nu mai sunt condiționați de o rutină strictă și norme rigide, sunt mult mai predispuși să se dezvolte și să devină mai buni administratori a resurselor lor. Așa că, asta e ce oferim.
        </p>
        <p className="home-about-question">Tu ce alegi să faci din această oportunitate?</p>
      </div>
      <a className="home-about-cta" href="https://cibero-manager-tool.bolt.host/inscriere">
        Fă primul pas <span aria-hidden="true">→</span>
      </a>
    </section>
  );
}
