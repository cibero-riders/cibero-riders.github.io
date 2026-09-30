const socialLinks = [
  ["https://www.facebook.com/cibero.riders", "Facebook", "social-facebook-cibero.png"],
  ["https://www.instagram.com/cibero_riders/", "Instagram", "social-instagram-cibero.png"],
  ["https://www.tiktok.com/@cibero.riders", "TikTok", "social-tiktok-cibero.png"],
  ["https://www.youtube.com/@CibeRORiders/", "YouTube", "social-youtube-cibero.png"],
] as const;

export function PublicFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-socials" aria-label="Urmărește CibeRO">
        {socialLinks.map(([href, label, image]) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`CibeRO pe ${label}`}>
            <img src={`/assets/${image}`} alt="" width={38} height={38} />
          </a>
        ))}
      </div>
      <div className="footer-company-details" aria-label="Datele firmei CibeRO">
        <span>CibeRO S.R.L. <i aria-hidden="true">·</i> CUI RO53182698 <i aria-hidden="true">·</i> Constanța, România</span>
        <a href="mailto:cibero.riders@gmail.com">cibero.riders@gmail.com</a>
      </div>
      <nav className="footer-legal-links" aria-label="Informații juridice">
        <a href="/termeni/">Termeni și Condiții</a>
        <a href="/confidentialitate/">Confidențialitate &amp; GDPR</a>
        <a href="/cookie-uri/">Politica de Cookie-uri</a>
        <a href="mailto:cibero.riders@gmail.com">Contact</a>
      </nav>
      <span>© Powered by Cibero - 2026 | All rights reserved</span>
    </footer>
  );
}
