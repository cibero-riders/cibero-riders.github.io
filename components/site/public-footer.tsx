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
            <img src={`/assets/${image}`} alt="" />
          </a>
        ))}
      </div>
      <span>© Powered by Cibero - 2026 | All rights reserved</span>
    </footer>
  );
}
