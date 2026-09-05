const views = document.querySelectorAll('.view');
const show = id => { views.forEach(view => view.classList.toggle('active', view.id === id)); window.scrollTo({top:0,behavior:'smooth'}); };
let selectedStatus = '';
let selectedWoltProof = null;
const applicationEndpoint = 'https://xpzgvknnrkyvcnncfqrq.supabase.co/functions/v1/submit-application';
const supabasePublishableKey = 'sb_publishable_yqSB3WMkNNxujsJhLMqLJA_8Q99BmbN';
document.querySelectorAll('[data-account-answer="yes"]').forEach(button => button.addEventListener('click', () => show('platform-step')));
document.querySelectorAll('[data-platform]').forEach(button => button.addEventListener('click', () => { if(button.dataset.platform === 'wolt') show('wolt-flow'); else show('glovo-info-flow'); }));
document.querySelectorAll('.platform-card[data-platform]').forEach(card => card.addEventListener('keydown', event => { if(event.key === 'Enter' || event.key === ' ') { event.preventDefault(); card.click(); } }));
document.querySelectorAll('[data-back]').forEach(button => button.addEventListener('click', () => show('platform-step')));
document.querySelectorAll('[data-wolt-back]').forEach(button => button.addEventListener('click', () => { if (statusOptions?.querySelector('[data-status="new"]')) show('wolt-flow'); else resetStatusChoices(); }));
document.querySelectorAll('[data-status-back]').forEach(button => button.addEventListener('click', () => show(selectedStatus === 'client' ? 'wolt-client-existing-flow' : selectedStatus === 'none' ? 'wolt-client-new-flow' : 'status-flow')));
document.querySelectorAll('[data-wolt-target]').forEach(button => button.addEventListener('click', () => show(button.dataset.woltTarget)));
const ruleAccept = document.querySelector('#rule-accept'); const toStatus = document.querySelector('#to-status'); ruleAccept.addEventListener('change', () => toStatus.disabled = !ruleAccept.checked); toStatus.addEventListener('click', () => show('status-flow'));
const detail = document.querySelector('#status-detail');
const details = {courier:`<h3 class="detail-title">Contul tău trebuie transferat în flota noastră.</h3><ol class="detail-steps"><li><b>Asigură-te că ai balanța 0</b>Verifică în aplicația Wolt Courier că nu ai bani neîncasați.</li><li><b>Cere să fii setat Offline</b>Contactează flota actuală și cere setarea Offline.</li><li><b>Cere offboarding</b>Fără offboarding, transferul nu poate fi procesat.</li></ol><p class="detail-warning"><b>Nu completa formularul de înscriere nouă.</b> O înregistrare duplicată poate bloca sau șterge contul existent.</p><button class="continue detail-action">Solicită transferul contului →</button>`,client:`<h3 class="detail-title">Verifică datele înainte să continui.</h3><p>Deschide <b>Wolt Client → Profil → Date personale</b> și verifică emailul, numărul de telefon și numele.</p><label class="accept"><input class="verify-client" type="checkbox" />Am verificat acum datele din aplicația Wolt Client.</label><label class="upload"> <span>▣</span>Încarcă screenshot Wolt Client<input class="proof" type="file" accept="image/*" /></label><button class="continue detail-action to-form" disabled>Continuă cu datele verificate →</button>`,none:`<h3 class="detail-title">Fără cont Wolt Client = activare imposibilă.</h3><p class="detail-warning">Wolt verifică existența unui cont client cu același email și telefon înainte de activare.</p><ol class="detail-steps"><li><b>Descarcă aplicația Wolt Client</b><span>Folosește magazinul potrivit dispozitivului tău.</span><div class="store-links"><a class="store-link play" href="https://play.google.com/store/apps/details?id=com.wolt.android&hl=en" target="_blank" rel="noopener"><i>▶</i>Google Play</a><a class="store-link apple" href="https://apps.apple.com/us/app/wolt-delivery-food-and-more/id943905271" target="_blank" rel="noopener"><i>●</i>App Store</a></div></li><li><b>Creează-ți contul Wolt Client</b>Folosește numele, emailul și telefonul tău real.</li><li><b>Fă un screenshot din Profil → Date personale</b>Numele, emailul și telefonul trebuie să fie vizibile.</li></ol><label class="upload"><span>▣</span>Încarcă screenshot Wolt Client<input class="proof" type="file" accept="image/*" /></label><button class="continue detail-action to-form" disabled>Continuă către formular →</button>`};
details.none = details.none.replace('<div class="store-links"><a class="store-link play" href="https://play.google.com/store/apps/details?id=com.wolt.android&hl=en" target="_blank" rel="noopener"><i>▶</i>Google Play</a><a class="store-link apple" href="https://apps.apple.com/us/app/wolt-delivery-food-and-more/id943905271" target="_blank" rel="noopener"><i>●</i>App Store</a></div>', '<div class="store-links"><a class="store-link play" href="https://play.google.com/store/apps/details?id=com.wolt.android&hl=en" target="_blank" rel="noopener" aria-label="Deschide Wolt Client în Google Play"><img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" /></a><a class="store-link apple" href="https://apps.apple.com/us/app/wolt-delivery-food-and-more/id943905271" target="_blank" rel="noopener" aria-label="Deschide Wolt Client în App Store"><img src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83" alt="Download on the App Store" /></a></div>');
const statusOptions = document.querySelector('#status-flow .status-options');
const clientStatusOptions = document.querySelector('.client-status-options');
const statusNote = document.querySelector('#status-note');
const transferDetail = document.querySelector('#transfer-detail');
const clientExistingDetail = document.querySelector('#client-existing-detail');
const clientNewDetail = document.querySelector('#client-new-detail');
statusNote.textContent = 'Atenție: conturile deja existente la Wolt influențează procesarea cererii de activare a contului de curier. Verifică atent situația contului tău înainte de a continua.';
const resetStatusChoices = () => { selectedStatus = ''; selectedWoltProof = null; detail.innerHTML = ''; detail.className = 'status-detail'; document.querySelectorAll('.status-card').forEach(card => card.classList.remove('selected')); };
document.querySelectorAll('[data-transfer-back]').forEach(button => button.addEventListener('click', () => { resetStatusChoices(); show('status-flow'); }));
const showClientQuestion = () => { selectedStatus = ''; show('wolt-client-question-flow'); };
const openClientDetail = type => {
  selectedStatus = type;
  const target = type === 'client' ? clientExistingDetail : clientNewDetail;
  target.innerHTML = details[type];
  target.className = 'status-detail show wolt-standalone-detail';
  const proof = target.querySelector('.proof');
  const verify = target.querySelector('.verify-client');
  const advance = target.querySelector('.to-form');
  const update = () => { if (advance) advance.disabled = !(proof?.files.length && (!verify || verify.checked)); };
  proof?.addEventListener('change', () => { selectedWoltProof = proof.files[0] || null; update(); });
  verify?.addEventListener('change', update);
  advance?.addEventListener('click', () => {
    document.querySelector('#form-description').textContent = type === 'client' ? 'Introdu exact datele verificate în Wolt Client.' : 'Introdu datele din contul Wolt Client pe care tocmai l-ai creat.';
    show('form-flow');
  });
  show(type === 'client' ? 'wolt-client-existing-flow' : 'wolt-client-new-flow');
};
const renderStatus = card => {
  const type = card.dataset.status;
  if (type === 'new') { showClientQuestion(); return; }
  if (type === 'courier') { selectedStatus = type; transferDetail.innerHTML = details.courier; transferDetail.className = 'status-detail show transfer-standalone'; show('transfer-flow'); return; }
  openClientDetail(type);
};
const bindStatusCards = root => root.querySelectorAll('.status-card').forEach(card => card.addEventListener('click', () => renderStatus(card)));
bindStatusCards(statusOptions);
bindStatusCards(clientStatusOptions);
const woltForm = document.querySelector('#wolt-form');
const glovoForm = document.querySelector('#glovo-form');
const finalAccept = document.querySelector('#final-accept');
const submit = document.querySelector('#submit-request');

const setSubmitFeedback = (element, message = '', success = false) => {
  element.textContent = message;
  element.classList.toggle('success', success);
};

const applicationPayload = (form, platform) => {
  const source = new FormData(form);
  const payload = new FormData();
  payload.set('platform', platform);
  payload.set('application_type', 'new_account');
  payload.set('first_name', String(source.get('prenume') || ''));
  payload.set('last_name', String(source.get('nume') || ''));
  payload.set('email', String(source.get('email') || ''));
  payload.set('phone', String(source.get('telefon') || ''));
  payload.set('city', String(source.get('oras') || ''));
  payload.set('vehicle', String(source.get('vehicul') || ''));
  payload.set('message', String(source.get('mesaj') || ''));
  payload.set('website', String(source.get('website') || ''));
  payload.set('consent_privacy', 'true');
  payload.set('consent_data_accuracy', platform === 'wolt' ? 'true' : 'false');
  if (platform === 'wolt' && selectedWoltProof) payload.set('proof', selectedWoltProof, selectedWoltProof.name);
  return payload;
};

const submitApplication = async (form, platform) => {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 30000);
  try {
    const response = await fetch(applicationEndpoint, {
      method: 'POST',
      headers: { apikey: supabasePublishableKey },
      body: applicationPayload(form, platform),
      signal: controller.signal,
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.ok) throw new Error(result.error || 'Cererea nu a putut fi trimisă.');
    return result;
  } catch (error) {
    if (error?.name === 'AbortError') throw new Error('Conexiunea a durat prea mult. Verifică internetul și încearcă din nou.');
    if (error instanceof TypeError) throw new Error('Nu ne-am putut conecta la serviciul de înscriere. Încearcă din nou.');
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
};

const setButtonBusy = (button, busy, busyLabel, originalContent) => {
  button.disabled = busy;
  button.setAttribute('aria-busy', String(busy));
  if (busy) button.textContent = busyLabel;
  else button.innerHTML = originalContent;
};

woltForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!selectedWoltProof) return;
  finalAccept.checked = false;
  submit.disabled = true;
  setSubmitFeedback(document.querySelector('#wolt-submit-feedback'));
  show('final-flow');
});

finalAccept.addEventListener('change', () => submit.disabled = !finalAccept.checked);
submit.addEventListener('click', async () => {
  if (!finalAccept.checked || !woltForm.reportValidity()) return;
  const feedback = document.querySelector('#wolt-submit-feedback');
  const originalContent = submit.innerHTML;
  setSubmitFeedback(feedback, 'Cererea se trimite în siguranță…');
  setButtonBusy(submit, true, 'Se trimite…', originalContent);
  try {
    await submitApplication(woltForm, 'wolt');
    setSubmitFeedback(feedback, '', true);
    woltForm.reset();
    selectedWoltProof = null;
    show('success-flow');
  } catch (error) {
    setSubmitFeedback(feedback, error.message || 'Cererea nu a putut fi trimisă.');
    setButtonBusy(submit, false, '', originalContent);
  }
});

document.querySelectorAll('[data-glovo-target]').forEach(button => button.addEventListener('click', () => show(button.dataset.glovoTarget)));
document.querySelectorAll('[data-glovo-reveal]').forEach(stack => {
  const items = [...stack.querySelectorAll('.glovo-reveal-item')];
  const button = stack.querySelector('.glovo-next');
  const nextView = stack.dataset.nextView;
  let visible = 1;
  button.addEventListener('click', () => {
    if (visible < items.length) {
      items[visible].classList.add('visible');
      visible += 1;
      button.innerHTML = visible === items.length ? 'Continuă <span>→</span>' : 'Mai departe <span>→</span>';
      return;
    }
    show(nextView);
  });
});
const glovoChecks = [...document.querySelectorAll('.glovo-confirm-card input[type="checkbox"]')];
const glovoConfirmNext = document.querySelector('#glovo-confirm-next');
glovoChecks.forEach(check => check.addEventListener('change', () => { glovoConfirmNext.disabled = !glovoChecks.every(item => item.checked); }));
glovoConfirmNext.addEventListener('click', () => show('glovo-activation-flow'));
glovoForm.addEventListener('submit', async event => {
  event.preventDefault();
  const button = glovoForm.querySelector('button[type="submit"], button:not([type])');
  const feedback = document.querySelector('#glovo-submit-feedback');
  const originalContent = button.innerHTML;
  setSubmitFeedback(feedback, 'Cererea se trimite în siguranță…');
  setButtonBusy(button, true, 'Se trimite…', originalContent);
  try {
    await submitApplication(glovoForm, 'glovo');
    setSubmitFeedback(feedback, '', true);
    glovoForm.reset();
    show('glovo-success-flow');
  } catch (error) {
    setSubmitFeedback(feedback, error.message || 'Cererea nu a putut fi trimisă.');
    setButtonBusy(button, false, '', originalContent);
  }
});
