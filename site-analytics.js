(() => {
  const SUPABASE_FUNCTION = 'https://xpzgvknnrkyvcnncfqrq.supabase.co/functions/v1/track-site-entry-5-';
  const SUPABASE_KEY = 'sb_publishable_yqSB3WMkNNxujsJhLMqLJA_8Q99BmbN';
  const currentPath = window.location.pathname === '/' ? '/' : `${window.location.pathname.replace(/\/+$/, '')}/`;

  if (currentPath === '/statistici/' || !/^https?:$/.test(window.location.protocol)) return;

  let referrerHost = '';
  let entryKind = 'direct';
  if (document.referrer) {
    try {
      const referrer = new URL(document.referrer);
      if (referrer.origin === window.location.origin) return;
      referrerHost = referrer.hostname;
      entryKind = 'external';
    } catch {
      return;
    }
  }

  const send = () => fetch(SUPABASE_FUNCTION, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      path: currentPath,
      entry_kind: entryKind,
      referrer_host: referrerHost || null
    }),
    keepalive: true
  }).catch(() => {});

  if (document.readyState === 'complete') send();
  else window.addEventListener('load', send, { once: true });
})();
