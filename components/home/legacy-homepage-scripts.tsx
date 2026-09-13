import Script from "next/script";

export function LegacyHomepageScripts() {
  return (
    <>
      <Script src="/main-page.js?v=9" strategy="afterInteractive" />
      <Script src="/site-theme.js?v=2" strategy="afterInteractive" />
    </>
  );
}
