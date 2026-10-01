import Script from "next/script";

export function LegacyHomepageScripts() {
  return (
    <>
      <Script src="/main-page.js?v=10" strategy="afterInteractive" />
      <Script src="/site-theme.js?v=3" strategy="afterInteractive" />
    </>
  );
}
