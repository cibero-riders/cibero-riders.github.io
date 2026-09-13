const socialLinks = [
  ["https://www.facebook.com/cibero.riders", "Facebook", "social-facebook-cibero.png"],
  ["https://www.instagram.com/cibero_riders/", "Instagram", "social-instagram-cibero.png"],
  ["https://www.tiktok.com/@cibero.riders", "TikTok", "social-tiktok-cibero.png"],
  ["https://www.youtube.com/@CibeRORiders/", "YouTube", "social-youtube-cibero.png"],
] as const;

export function PublicHeader() {
  return (
    <header className="site-header global-header">
      <a className="brand brand-wordmark" href="/" aria-label="CibeRO, pagina principală">
        <img src="/assets/cibero-header-wordmark.png" alt="CibeRO" />
      </a>
      <div className="header-socials" aria-label="Urmărește CibeRO">
        {socialLinks.map(([href, label, image]) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`CibeRO pe ${label}`}>
            <img src={`/assets/${image}`} alt="" />
          </a>
        ))}
      </div>
      <button className="menu-toggle" type="button" aria-label="Deschide meniul" aria-controls="main-nav" aria-expanded="false">☰</button>
      <nav id="main-nav" aria-label="Navigație principală">
        <a aria-current="page" href="/">Prezentare</a>
        <a href="/orase/">Orașe</a>
        <a href="/campanii/">Campanii</a>
        <a className="nav-account" href="/deschide-cont.html">Deschide Cont</a>
      </nav>
    </header>
  );
}
