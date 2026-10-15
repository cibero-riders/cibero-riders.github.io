(() => {
  const translations = {
    currentPayment:'Current payment period',byFive:'by 17:00',paymentTimezone:'Fleet calendar · Romania time',
    heroKicker:'CIBERO · COURIER HUB',heroTitle:'Everything you need for courier work, in one place.',heroLead:'Clear information, quick access to support and fleet tools — ready when you need them.',ticketButton:'Open a ticket',exploreButton:'See essential information',liveInfo:'AUTOMATICALLY UPDATED',nextPayment:'Next payment',workPeriod:'Earnings period',paymentSelector:'Select platform',toolsKicker:'QUICK ACCESS',toolsTitle:'How can we help?',toolsIntro:'The most-used information and actions, without searching through old conversations.',supportTitle:'Support and requests',supportBody:'Payments, accounts, documents, reimbursements and other situations.',campaignsTitle:'Campaigns',campaignsBody:'See active campaigns and their conditions.',benefitsTitle:'Benefits',benefitsBody:'Reimbursement, consultancy and sole trader collaboration.',platformsTitle:'Platform guide',platformsBody:'Compare Bolt Food, Glovo and Wolt.',onboardingTitle:'Onboarding',onboardingBody:'Everything you need before activation.',
    essentialKicker:'FROM THE CIBERO HUB',essentialTitle:'Essential Information.',essentialIntro:'Everything you used in the Telegram menu, reorganized into a clearer and easier-to-use library.',essentialNote:'Spend a few minutes now to get informed — you will save more time later.',calendarTitle:'Payment calendar',calendarSummary:'Dynamic dates, posters and the explained guide.',paymentCutoff:'Payments are made on Friday, by 17:00. The displayed periods update automatically after this time.',explainedCalendar:'Watch the explained calendar for all 3 platforms',videosTitle:'Video guides',videosSummary:'Practical steps for Bolt Food and Wolt.',boltPlaylist:'Bolt — complete guide playlist',boltDepositVideo:'Bolt — balance deposit',woltDepositVideo:'Wolt — balance deposit',woltIdVideo:'Wolt — how to find your courier ID',cashTitle:'Cash, balance, deposit and reset',cashSummary:'Essential rules, separated by platform.',platformSelector:'Select platform',boltTitle:'Balance and deposit',boltRule1:'The reset takes place on Sunday at 23:59. The fleet recommends keeping your balance at 0.',boltRule2:'Any remaining amount may be deducted from the next report and may temporarily affect order priority.',boltRule3:'Deposit directly by card in Bolt Courier; avoid bank transfers during the weekend.',glovoTitle:'Cash and balance',glovoRule1:'The main reset takes place on Sunday at 23:59. Keep the balance at 0 through the end of Monday as well.',glovoRule2:'At RON 600 in cash balance, cash orders are blocked.',glovoRule3:'Deposit at SelfPay stations, with instant balance updates.',woltTitle:'Cash and reset day',woltRule1:'The reset takes place on the 7th, 15th, 22nd and last day of the month, at 23:59.',woltRule2:'At an outstanding balance of RON 500 or more, orders are blocked until it is fully covered.',woltRule3:'Deposit through Aircash; create the account using the details associated with your Wolt account.',woltRule4:'Do not deposit on the 1st, 8th, 16th or 23rd, to avoid a possible double deduction.',depositGuide:'See the deposit guide',selfpayLocations:'Find a SelfPay station',openAircash:'Open Aircash',faqTitle:'Official platform FAQ',faqSummary:'Answers published directly by Bolt, Glovo and Wolt.',faqCaveat:'Some official sections may not be fully up to date. For fleet procedures, use the updated information in this Hub.',gearTitle:'Official bags and gear',gearSummary:'The official stores of all three platforms.',
    communityKicker:'STAY CONNECTED',communityTitle:'The CibeRO community is on WhatsApp.',communityBody:'General discussions and help between couriers are in the community group. Important news is published separately in the announcements channel.',communityButton:'Community group',announcementsButton:'Announcements channel',nextKicker:'COMING TO THE HUB',nextTitle:'A personal account for every member.',nextIntro:'This area will be connected after we define authentication and migrate data from the Telegram system.',profileTitle:'Verified profile',profileBody:'Phone, city, platforms and seniority, protected by authentication.',requestsTitle:'Requests and status',requestsBody:'Data updates, approvals and history in one flow.',remindersTitle:'Personal reminders',remindersBody:'Preferences for payments, reset dates and WhatsApp notifications.',versionNote:'This is the first informational version of the Hub. It does not yet collect or display personal data.'
  };
  Object.assign(translations,{
    hubTitle:'CIBERO Hub - essential information for couriers',
    paymentDate:'Payment date',
    paymentPeriod:'Payment period',
    essentialTitle:'Tools and information for couriers',
    essentialIntro:'Calendars, guides and answers for your daily work. Choose the category you need.',
    fleetPlatform:'Fleet platform',
    paymentMenu:'Next payment',
    referralTitle:'Referral',
    supportCardBody:'Requests, changes and help.',
    campaignsCardBody:'Active CibeRO campaigns.',
    benefitsCardBody:'Your partnership benefits.',
    referralCardBody:'Refer a friend and both of you earn.',
    reimbursementTitle:'5% Reimbursement',
    reimbursementSummary:'The full procedure, eligibility and receipt submission.',
    reimbursementIntro:'💰 The fleet offers 5% reimbursement for all services and purchases made for delivery work.',
    reimbursementCui:'🧾 The company tax ID is: <strong><code>RO53182698</code></strong>',
    reimbursementPrompt:'✅ For accurate information, use the options below.',
    reimbursementHowTitle:'How reimbursement works',
    reimbursementHow1:'ℹ️ Whenever you purchase products or services related to delivery work, ask the merchant to add the company tax ID to the receipt/invoice.',
    reimbursementHow2:'🧾 The company tax ID is: <strong><code>RO53182698</code></strong>',
    reimbursementHow3:'ℹ️ The reimbursement cycle is monthly. From the beginning to the end of a month, collect all receipts. At the beginning of the following month, submit the receipts from the previous month.',
    reimbursementHow4:'👀 Example: collect receipts from the beginning of August through the end of August. The receipts are submitted at the beginning of September.',
    reimbursementHow5:'ℹ️ The procedure differs by city. You can find city-specific information in the “Procedure by city” section from the previous menu.',
    reimbursementCityTitle:'Procedure by city',
    reimbursementCityPrompt:'For which city do you need reimbursement information?',
    reimbursementIasi1:'1️⃣ At the end of the month, place all eligible receipts in an envelope and write your full name on it.',
    reimbursementIasi2:'2️⃣ Go to <code>Strada Tudor Vladimirescu 2a, 700259 Iași</code> and leave the envelope in the mailbox <strong><u>marked 2A.</u></strong>',
    reimbursementIasi3:'⚠️ The receipt envelope may be left earlier, but <strong><u>no later</u></strong> than the 2nd day of the following month.',
    reimbursementConstanta1:'1️⃣ At the end of the month, place all eligible receipts in an envelope and write your full name on it.',
    reimbursementConstanta2:'2️⃣ Deliver the envelope to the office at: <strong><code>Strada Farului 31, 900607, Constanța</code></strong>',
    reimbursementConstanta3:'⚠️ The receipt envelope may be submitted earlier, but <strong><u>no later</u></strong> than the 7th day of the month.',
    reimbursementRestTitle:'Rest of the country',
    reimbursementRest1:'1️⃣ Scan all receipts into a single PDF file. You can use the Genius Scan app for scanning.',
    reimbursementRest2:'2️⃣ Download the Genius app, scan all receipts, save everything as a single PDF and send it using <a href="https://eatsdelivery.bolt.host/modify" target="_blank" rel="noopener noreferrer">this form</a> - Reimbursements.',
    reimbursementPaymentTitle:'When do I receive the reimbursement money',
    reimbursementPayment1:'✅ If you followed all steps and submitted the receipts correctly, you will receive the money around the middle of the following month, on the fleet payment day (Friday).',
    reimbursementPayment2:'👀 Example: You submit the receipts collected in August at the beginning of September. You will receive the money for those receipts around the middle of September.',
    reimbursementCoveredTitle:'What the fleet reimburses',
    reimbursementCovered1:'👉 everything related to the vehicle used - repairs, spare parts, fuel, instalments, rental, <em>useful</em> accessories, etc.',
    reimbursementCovered2:'👉 everything related to official equipment (Bolt/Glovo/Wolt) used for delivery work - bag, jacket, accessories, protective equipment, etc.',
    reimbursementNotCoveredTitle:'What the fleet does NOT reimburse',
    reimbursementNotCovered1:'👉 Any products/services purchased for personal use and not directly related to delivery work - regular clothes, meals, coffee, snacks, fines/personal taxes, phone, etc.'
  });
  const nodes=[...document.querySelectorAll('[data-hub-i18n]')];
  const originals=new Map(nodes.map(node=>[node,node.textContent]));
  const htmlNodes=[...document.querySelectorAll('[data-hub-i18n-html]')];
  const htmlOriginals=new Map(htmlNodes.map(node=>[node,node.innerHTML]));
  const ariaNodes=[...document.querySelectorAll('[data-hub-i18n-aria]')];
  const ariaOriginals=new Map(ariaNodes.map(node=>[node,node.getAttribute('aria-label')]));
  const description=document.querySelector('meta[name="description"]');
  const originalDescription=description?.content;
  let language=document.documentElement.lang==='en'?'en':'ro';
  const DAY=86400000;
  const dateFromParts=(year,month,day)=>new Date(Date.UTC(year,month-1,day,12));
  const addDays=(date,days)=>new Date(date.getTime()+days*DAY);
  const getParts=date=>({year:date.getUTCFullYear(),month:date.getUTCMonth()+1,day:date.getUTCDate()});
  const daysInMonth=(year,month)=>new Date(Date.UTC(year,month,0)).getUTCDate();
  const formatDate=date=>new Intl.DateTimeFormat(language==='en'?'en-GB':'ro-RO',{day:'numeric',month:'long',timeZone:'UTC'}).format(date);
  const formatWeekdayDate=date=>new Intl.DateTimeFormat(language==='en'?'en-GB':'ro-RO',{weekday:'long',day:'numeric',month:'long',timeZone:'UTC'}).format(date);
  function bucharestNow(){const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Bucharest',year:'numeric',month:'2-digit',day:'2-digit',weekday:'short',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date());const value=type=>parts.find(part=>part.type===type)?.value;const weekdays={Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6};return{year:Number(value('year')),month:Number(value('month')),day:Number(value('day')),hour:Number(value('hour')),minute:Number(value('minute')),weekday:weekdays[value('weekday')]};}
  function weeklyPaymentSchedule(now){const today=dateFromParts(now.year,now.month,now.day);const monday=addDays(today,-((now.weekday+6)%7));const friday=addDays(monday,4);const beforeCutoff=today<friday||(today.getTime()===friday.getTime()&&now.hour<17);if(beforeCutoff)return{start:addDays(monday,-7),end:addDays(monday,-1),payment:friday,reset:addDays(monday,-1)};return{start:monday,end:addDays(monday,6),payment:addDays(monday,11),reset:addDays(monday,6)};}
  function woltFiscalPeriod(date){const{year,month,day}=getParts(date);if(day<=7)return{start:dateFromParts(year,month,1),end:dateFromParts(year,month,7)};if(day<=15)return{start:dateFromParts(year,month,8),end:dateFromParts(year,month,15)};if(day<=22)return{start:dateFromParts(year,month,16),end:dateFromParts(year,month,22)};return{start:dateFromParts(year,month,23),end:dateFromParts(year,month,daysInMonth(year,month))};}
  function paymentFridayForWolt(end){const weekday=end.getUTCDay();if([4,5,6].includes(weekday))return addDays(end,12-weekday);let days=(5-weekday+7)%7;if(days===0)days=7;return addDays(end,days);}
  function woltPaymentSchedule(now){const today=dateFromParts(now.year,now.month,now.day);const current=woltFiscalPeriod(today);const previous=woltFiscalPeriod(addDays(current.start,-1));const previousPayment=paymentFridayForWolt(previous.end);const p=getParts(previousPayment);const beforePreviousCutoff=Date.UTC(now.year,now.month-1,now.day,now.hour,now.minute)<Date.UTC(p.year,p.month-1,p.day,17,0);if(beforePreviousCutoff)return{...previous,payment:previousPayment,reset:previous.end};return{...current,payment:paymentFridayForWolt(current.end),reset:current.end};}
  function scheduleFor(platform){const now=bucharestNow();return platform==='wolt'?woltPaymentSchedule(now):weeklyPaymentSchedule(now);}
  const capitalizeDate=value=>value.replace(/\p{L}/u,letter=>letter.toUpperCase());
  function scheduleText(platform){const schedule=scheduleFor(platform);const resetDate=capitalizeDate(formatDate(schedule.reset));return{payment:(language==='en'?'Friday, ':'Vineri, ')+formatDate(schedule.payment)+(language==='en'?', by 17:00':', până în ora 17:00'),period:`${formatDate(schedule.start)} – ${formatDate(schedule.end)}`,note:language==='en'?`Next RESET: ${resetDate}, 23:59. The full balance must be deposited by that date and time.`:`Următorul RESET: ${resetDate}, ora 23:59. Depunerea integrală a balanței e necesară până la acea dată-oră.`};}
  function renderPayments(){['bolt','glovo','wolt'].forEach(platform=>{const data=scheduleText(platform);document.querySelector(`[data-card-payment="${platform}"]`).textContent=data.payment;document.querySelector(`[data-card-period="${platform}"]`).textContent=data.period;document.querySelector(`[data-card-reset="${platform}"]`).textContent=data.note;});}
  function updatePosters(){document.querySelectorAll('[data-poster-link]').forEach(link=>{const platform=link.dataset.posterLink;const source=`assets/calendar-${platform}-${language}.png`;link.href=source;const image=link.querySelector('[data-poster-image]');image.src=source;image.alt=language==='en'?image.dataset.posterAltEn:image.dataset.posterAltRo;});}
  function setLanguage(next){language=next==='en'?'en':'ro';nodes.forEach(node=>node.textContent=language==='en'?(translations[node.dataset.hubI18n]||originals.get(node)):originals.get(node));htmlNodes.forEach(node=>node.innerHTML=language==='en'?(translations[node.dataset.hubI18nHtml]||htmlOriginals.get(node)):htmlOriginals.get(node));ariaNodes.forEach(node=>node.setAttribute('aria-label',language==='en'?(translations[node.dataset.hubI18nAria]||ariaOriginals.get(node)):ariaOriginals.get(node)));document.title=language==='en'?'CIBERO Hub | Courier tools':'CIBERO Hub | Instrumente pentru curieri';if(description)description.content=language==='en'?'CIBERO Hub — information, tools and quick access for CibeRO couriers.':originalDescription;updatePosters();renderPayments();}
  document.addEventListener('cibero:language-change',event=>setLanguage(event.detail.language));
  const hoverQuery=window.matchMedia('(hover: hover) and (pointer: fine)');
  document.querySelectorAll('.hub-pay-row').forEach(card=>{
    card.addEventListener('pointermove',event=>{
      if(!hoverQuery.matches)return;
      const rect=card.getBoundingClientRect();
      card.style.setProperty('--pay-x',`${((event.clientX-rect.left)/rect.width-.5)*6}deg`);
      card.style.setProperty('--pay-y',`${((event.clientY-rect.top)/rect.height-.5)*-6}deg`);
    });
    card.addEventListener('pointerleave',()=>{
      card.style.removeProperty('--pay-x');
      card.style.removeProperty('--pay-y');
    });
  });
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)renderPayments();});
  setInterval(renderPayments,30000);
  document.querySelectorAll('[data-platform]').forEach(button=>button.addEventListener('click',()=>{const platform=button.dataset.platform;document.querySelectorAll('[data-platform]').forEach(item=>{const active=item===button;item.classList.toggle('active',active);item.setAttribute('aria-selected',String(active));});document.querySelectorAll('[data-rule-platform]').forEach(card=>card.hidden=card.dataset.rulePlatform!==platform);}));
  setLanguage(document.documentElement.lang);
})();
