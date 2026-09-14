export function HomeActivityVideo() {
  return (
    <section className="home-activity-video" aria-labelledby="activity-video-title">
      <h2 id="activity-video-title" className="showcase-section-title"><span>Video: Cum arată activitatea reală</span></h2>
      <div className="video-frame" data-youtube-id="4sGmJlbcc2k" data-video-title="Cum arată activitatea reală în domeniul de livrări — CibeRO">
        <button className="video-poster" type="button" aria-label="Redă videoclipul: Cum arată activitatea reală în domeniul de livrări">
          <img src="https://i.ytimg.com/vi/4sGmJlbcc2k/maxresdefault.jpg" data-thumbnail-fallback="https://i.ytimg.com/vi/4sGmJlbcc2k/hqdefault.jpg" alt="Coperta videoclipului despre activitatea reală în livrări" width="1280" height="720" loading="lazy" decoding="async" />
          <span className="video-shade" aria-hidden="true" />
          <span className="video-play" aria-hidden="true"><i /></span>
          <span className="video-action" aria-hidden="true">Vezi activitatea reală</span>
        </button>
        <noscript><a href="https://www.youtube.com/watch?v=4sGmJlbcc2k">Vezi videoclipul pe YouTube</a></noscript>
      </div>
      <a className="activity-video-link" href="https://www.youtube.com/watch?v=4sGmJlbcc2k" target="_blank" rel="noopener noreferrer">Deschide videoclipul pe YouTube ↗</a>
    </section>
  );
}
