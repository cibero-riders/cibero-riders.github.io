import Script from "next/script";

export function LegacyHomepageScripts() {
  return (
    <>
      <Script src="/main-page.js?v=12" strategy="afterInteractive" />
      <Script src="/site-theme.js?v=3" strategy="afterInteractive" />
    </>
  );
}
