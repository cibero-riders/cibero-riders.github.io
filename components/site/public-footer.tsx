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
        <span className="footer-company-detail">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 21V5.5L12 2l8 3.5V21M8 21v-3h8v3M8 8h1m6 0h1M8 12h1m6 0h1" /></svg>
          <span>CibeRO S.R.L.</span>
        </span>
        <span className="footer-company-detail">
          <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M7 9h4m-4 4h7m3-4h.01" /></svg>
          <span>RO53182698</span>
        </span>
        <span className="footer-company-detail">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>
          <span>Constanța, România</span>
        </span>
        <a className="footer-company-detail" href="mailto:cibero.riders@gmail.com">
          <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg>
          <span>cibero.riders@gmail.com</span>
        </a>
      </div>
      <span>© Powered by Cibero - 2026 | All rights reserved</span>
    </footer>
  );
}
