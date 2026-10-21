(() => {
  const isSubfleet=document.body.dataset.hubVariant==='subfleet';
  const translations = {
    currentPayment:'Current payment period',byFive:'by 17:00',paymentTimezone:'Fleet calendar · Romania time',
    heroKicker:'CIBERO · COURIER HUB',heroTitle:'Everything you need for courier work, in one place.',heroLead:'Clear information, quick access to support and fleet tools — ready when you need them.',ticketButton:'Open a ticket',exploreButton:'See essential information',liveInfo:'AUTOMATICALLY UPDATED',nextPayment:'Next payment',workPeriod:'Earnings period',paymentSelector:'Select platform',toolsKicker:'QUICK ACCESS',toolsTitle:'How can we help?',toolsIntro:'The most-used information and actions, without searching through old conversations.',supportTitle:'Support and requests',supportBody:'Payments, accounts, documents, reimbursements and other situations.',campaignsTitle:'Campaigns',campaignsBody:'See active campaigns and their conditions.',benefitsTitle:'Benefits',benefitsBody:'Reimbursement, consultancy and sole trader collaboration.',platformsTitle:'Platform guide',platformsBody:'Compare Bolt Food, Glovo and Wolt.',onboardingTitle:'Onboarding',onboardingBody:'Everything you need before activation.',
    essentialKicker:'FROM THE CIBERO HUB',essentialTitle:'Essential Information.',essentialIntro:'Everything you used in the Telegram menu, reorganized into a clearer and easier-to-use library.',essentialNote:'Spend a few minutes now to get informed — you will save more time later.',calendarTitle:'Payment calendar',calendarSummary:'Choose the poster or the video explanation.',paymentCutoff:'Payments are made on Friday, by 17:00. The displayed periods update automatically after this time.',explainedCalendar:'Watch the explained calendar for all 3 platforms',videosTitle:'Video guides',videosSummary:'Practical steps for Bolt Food and Wolt.',boltPlaylist:'Bolt — complete guide playlist',boltDepositVideo:'Bolt — balance deposit',woltDepositVideo:'Wolt — balance deposit',woltIdVideo:'Wolt — how to find your courier ID',cashTitle:'Cash, balance, deposit and reset',cashSummary:'Essential rules, separated by platform.',platformSelector:'Select platform',boltTitle:'Balance and deposit',boltRule1:'The reset takes place on Sunday at 23:59. The fleet recommends keeping your balance at 0.',boltRule2:'Any remaining amount may be deducted from the next report and may temporarily affect order priority.',boltRule3:'Deposit directly by card in Bolt Courier; avoid bank transfers during the weekend.',glovoTitle:'Cash and balance',glovoRule1:'The main reset takes place on Sunday at 23:59. Keep the balance at 0 through the end of Monday as well.',glovoRule2:'At RON 600 in cash balance, cash orders are blocked.',glovoRule3:'Deposit at SelfPay stations, with instant balance updates.',woltTitle:'Cash and reset day',woltRule1:'The reset takes place on the 7th, 15th, 22nd and last day of the month, at 23:59.',woltRule2:'At an outstanding balance of RON 500 or more, orders are blocked until it is fully covered.',woltRule3:'Deposit through Aircash; create the account using the details associated with your Wolt account.',woltRule4:'Do not deposit on the 1st, 8th, 16th or 23rd, to avoid a possible double deduction.',depositGuide:'See the deposit guide',selfpayLocations:'Find a SelfPay station',openAircash:'Open Aircash',faqTitle:'Official platform FAQ',faqSummary:'Answers published directly by Bolt, Glovo and Wolt.',faqCaveat:'Some official sections may not be fully up to date. For fleet procedures, use the updated information in this Hub.',gearTitle:'Official bags and gear',gearSummary:'The official stores of all three platforms.',
    communityKicker:'STAY CONNECTED',communityTitle:'The CibeRO community is on WhatsApp.',communityBody:'General discussions and help between couriers are in the community group. Important news is published separately in the announcements channel.',communityButton:'Community group',announcementsButton:'Announcements channel',nextKicker:'COMING TO THE HUB',nextTitle:'A personal account for every member.',nextIntro:'This area will be connected after we define authentication and migrate data from the Telegram system.',profileTitle:'Verified profile',profileBody:'Phone, city, platforms and seniority, protected by authentication.',requestsTitle:'Requests and status',requestsBody:'Data updates, approvals and history in one flow.',remindersTitle:'Personal reminders',remindersBody:'Preferences for payments, reset dates and WhatsApp notifications.',versionNote:'This is the first informational version of the Hub. It does not yet collect or display personal data.'
  };
  Object.assign(translations,{
    hubTitle:'CIBERO Fleet Hub',
    hubSubtitle:'Information and resources for CibeRO couriers.',
    hubKicker:'CIBERO · COURIER TOOLS',
    paymentDate:'Payment date',
    paymentPeriod:'Payment period',
    paymentsCategory:'Payment periods and next payment day',
    appsCategory:'Official mobile apps',
    appsSelector:'Select the courier platform',
    downloadBoltIos:'Download Bolt Food from the App Store',
    downloadBoltAndroid:'Download Bolt Food from Google Play',
    downloadGlovoIos:'Download Glovo Rider from the App Store',
    downloadGlovoAndroid:'Download Glovo Rider from Google Play',
    downloadWoltIos:'Download Wolt Partner from the App Store',
    downloadWoltAndroid:'Download Wolt Partner from Google Play',
    downloadControlFleetAndroid:'Download ControlFleet from Google Play',
    guidesCategory:'Cash, balance, deposit and reset',
    videosCategory:'Video guides and tutorials',
    toolsCategory:'Tools, resources and support',
    whatsappCategory:'Announcements and Communication - WhatsApp',
    quickCalendar:'Calendar',quickVideos:'Video',quickReimbursement:'Reimbursement',
    nextPaymentSummary:'Payment date, covered period and next reset.',
    nextPaymentLabel:'Next payment:',
    paymentPeriodLabel:'For earnings collected during',
    paymentResetLabel:'RESET: Deposit the full balance by',
    calendarFormatSelector:'Choose the calendar format',
    posterOption:'Poster',
    openCalendarYoutube:'View payment calendar',
    calendarVideoTitle:'Payment calendar explained for Bolt Food, Glovo and Wolt',
    essentialTitle:'Tools and information for couriers',
    essentialIntro:'Calendars, guides and answers for your daily work. Choose the category you need.',
    fleetPlatform:'Fleet platform',
    paymentMenu:'Next payment',
    woltPaymentDelay:'Payment may be delayed by a few days while late reports are processed.',
    referralTitle:'Referral',
    supportCardBody:'Send a ticket for requests, changes and help.',
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
    reimbursementHow5:'ℹ️ The procedure differs by city. You can find city-specific information in the “Procedure by city” section below.',
    reimbursementCityTitle:'Procedure by city',
    reimbursementCityPrompt:'For which city do you need reimbursement information?',
    reimbursementIasi1:'1️⃣ At the end of the month, place all eligible receipts in an envelope and write your full name on it.',
    reimbursementIasi2:'2️⃣ Go to <strong><a href="https://maps.app.goo.gl/YsLnCGx84XkjUiam8" target="_blank" rel="noopener noreferrer"><code>Strada Tudor Vladimirescu 2a, 700259 Iași</code></a></strong> and leave the envelope in the mailbox <strong><u>marked 2A.</u></strong>',
    reimbursementIasi3:'⚠️ The receipt envelope may be left earlier, but <strong><u>no later</u></strong> than the 2nd day of the following month.',
    reimbursementConstanta1:'1️⃣ At the end of the month, place all eligible receipts in an envelope and write your full name on it.',
    reimbursementConstanta2:'2️⃣ Deliver the envelope to the office at: <strong><a href="https://maps.app.goo.gl/JG4tLVszZ9cjBivE7" target="_blank" rel="noopener noreferrer"><code>Strada Farului 31, 900607, Constanța</code></a></strong>',
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
    reimbursementNotCovered1:'👉 Any products/services purchased for personal use and not directly related to delivery work - regular clothes, meals, coffee, snacks, fines/personal taxes, phone, etc.',
    cashKnowTitle:'What you need to know ↓',
    cashDoTitle:'What you need to do ↓',
    resetRecommendationsTitle:'Reset and recommendations',
    resetDepositTitle:'Reset and deposit',
    boltCashIntro:'Always make sure you have the cash amount in your wallet when you go out for deliveries, so you can pay at pickup when needed without issues.',
    boltCashRule1:'Do not change the balance amount in the app. If necessary, first contact in-app support and ask them to make the change, to prevent difficulties or later issues caused by changing the balance yourself.',
    boltCashRule2:'On Bolt, depositing is not mandatory during the week, since you receive orders that require payment at pickup. You can restore your balance at this pace.',
    boltCashRule3:'If your balance goes beyond -250 lei, do not worry. Orders where you would receive cash from the customer will no longer be assigned until your balance drops below the threshold. You will easily restore the balance through the next orders where you pay at pickup.',
    boltCashRule4:'During the week, you can keep the money in circulation. Every <strong>Sunday</strong> at <strong>23:59</strong>, depositing the full balance is mandatory.',
    boltCashRule5:'If you make plans and will not deliver for a few days, cover the full balance so that you do not leave an outstanding amount for an extended period. <strong>Platforms do not like this.</strong>',
    boltCashRule6:'<em>Cash tips received from customers stay in your pocket.</em>',
    glovoCashRule:'<strong>If your cash balance reaches RON 600, cash orders will be blocked.</strong> Deposit frequently to keep your balance at an optimal level.',
    glovoResetRule1:'The main reset takes place every <strong>Sunday at 23:59</strong>. Keep your balance at 0.',
    glovoResetRule2:'Glovo also runs a second reset on Monday. We recommend keeping the balance at 0 both on <strong>Sunday at 23:59</strong> and <strong>Monday at 23:59</strong>, to avoid the money being withheld twice.',
    glovoDepositRule:'Deposits can be made at any SelfPay station, and the balance updates instantly.',
    woltCashRule:'If you reach an outstanding amount of <strong>500 lei</strong> in the balance or more, orders will be blocked and you will not be able to go online until you cover the amount <strong>IN FULL</strong>.',
    woltResetRule1:'The fiscal periods are: <strong>01–07, 08–15, 16–22 and 23–the last day of the month</strong> (28/29/30/31).',
    woltResetAction:'Deposit the full balance on reset days — the <strong>7th, 15th, 22nd and last day of the month</strong> — by <strong>23:59</strong>.',
    woltNoNextDayDeposit:'Do not make deposits on the day after a reset — the 1st, 8th, 16th and 23rd — because the amount may be withheld twice.',
    woltAircashAccountSetup:'When creating your Aircash account, use the same email address and phone number associated with your Wolt courier account.',
    woltDepositRule2:'Do not use <strong>Abon</strong> for deposits. This method is no longer valid.',
    woltDepositInfo:'Depositing through Aircash updates your balance instantly. You can deposit by card directly in Aircash or with cash at PayPoint, Un-doi Centru de plăți, Kaseria, StartPay and Inmedio.',
    woltDepositGuide:'Watch the deposit video guide',
    aircashLocations:'See Aircash locations'
  });
  if(isSubfleet)Object.assign(translations,{
    hubTitle:'Courier Hub',
    hubSubtitle:'Information and resources for partner couriers.',
    subfleetSupportTitle:'Support and requests',
    subfleetTicketTitle:'Open a ticket',
    subfleetTicketBody:'Send a request to the support team.',
    subfleetVehicleTitle:'Change vehicle',
    subfleetVehicleBody:'Update the vehicle you use for deliveries.',
    subfleetVehiclePrompt:'Choose the platform where you want to change your vehicle',
    subfleetReimbursementSummary:'General guidance; ask your sub-fleet administrator for the details.',
    subfleetReimbursementIntro:'💰 The fleet offers 5% reimbursement for services and purchases made for delivery work.',
    subfleetReimbursementCui:'🧾 Ask your fleet administrator which company tax ID to use for reimbursement.',
    subfleetReimbursementHow1:'ℹ️ Whenever you purchase products or services related to delivery work, ask the merchant to add the company tax ID to the receipt/invoice.',
    subfleetReimbursementHow2:'🧾 Use only the company tax ID provided by your sub-fleet administrator and keep the supporting documents.',
    subfleetReimbursementHow3:'📅 Your sub-fleet sets the deadline, submission method and payment date.'
  });
  const nodes=[...document.querySelectorAll('[data-hub-i18n]')];
  const originals=new Map(nodes.map(node=>[node,node.textContent]));
  const htmlNodes=[...document.querySelectorAll('[data-hub-i18n-html]')];
  const htmlOriginals=new Map(htmlNodes.map(node=>[node,node.innerHTML]));
  const ariaNodes=[...document.querySelectorAll('[data-hub-i18n-aria]')];
  const ariaOriginals=new Map(ariaNodes.map(node=>[node,node.getAttribute('aria-label')]));
  const titleNodes=[...document.querySelectorAll('[data-hub-i18n-title]')];
  const titleOriginals=new Map(titleNodes.map(node=>[node,node.getAttribute('title')]));
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
  function weeklyPaymentSchedule(now){
    const today=dateFromParts(now.year,now.month,now.day);
    const monday=addDays(today,-((now.weekday+6)%7));
    const sunday=addDays(monday,6);
    // Keep the payout period through Friday; its cash deadline follows the current week.
    const periodStart=now.weekday===0||now.weekday===6?monday:addDays(monday,-7);
    return{start:periodStart,end:addDays(periodStart,6),payment:addDays(periodStart,11),reset:sunday};
  }
  function woltFiscalPeriod(date){const{year,month,day}=getParts(date);if(day<=7)return{start:dateFromParts(year,month,1),end:dateFromParts(year,month,7)};if(day<=15)return{start:dateFromParts(year,month,8),end:dateFromParts(year,month,15)};if(day<=22)return{start:dateFromParts(year,month,16),end:dateFromParts(year,month,22)};return{start:dateFromParts(year,month,23),end:dateFromParts(year,month,daysInMonth(year,month))};}
  function paymentFridayForWolt(end){const weekday=end.getUTCDay();let days=(5-weekday+7)%7;if(days===0)days=7;return addDays(end,days);}
  function woltDisplayRollover(period){
    const weekday=period.end.getUTCDay();
    // Thursday/Friday resets stay visible through Monday so the delay warning is seen.
    if(weekday===4||weekday===5)return addDays(period.end,(2-weekday+7)%7);
    return addDays(paymentFridayForWolt(period.end),1);
  }
  function woltPaymentSchedule(now){
    const today=dateFromParts(now.year,now.month,now.day);
    const current=woltFiscalPeriod(today);
    const previous=woltFiscalPeriod(addDays(current.start,-1));
    const displayed=today<woltDisplayRollover(previous)?previous:current;
    const weekday=displayed.end.getUTCDay();
    return{...displayed,payment:paymentFridayForWolt(displayed.end),reset:displayed.end,delayed:weekday===4||weekday===5};
  }
  function scheduleFor(platform){const now=bucharestNow();return platform==='wolt'?woltPaymentSchedule(now):weeklyPaymentSchedule(now);}
  const capitalizeDate=value=>value.replace(/\p{L}/u,letter=>letter.toUpperCase());
  function scheduleText(platform){const schedule=scheduleFor(platform);const resetDate=capitalizeDate(formatDate(schedule.reset));const sameMonth=schedule.start.getUTCFullYear()===schedule.end.getUTCFullYear()&&schedule.start.getUTCMonth()===schedule.end.getUTCMonth();const period=platform==='wolt'&&sameMonth?`${schedule.start.getUTCDate()}–${formatDate(schedule.end)}`:`${formatDate(schedule.start)} – ${formatDate(schedule.end)}`;return{payment:(language==='en'?'Friday, ':'Vineri, ')+formatDate(schedule.payment)+(language==='en'?', by 17:00':', până în ora 17:00'),period,note:resetDate+(language==='en'?', 23:59':', ora 23:59'),delayed:Boolean(schedule.delayed)};}
  function renderPayments(){if(!document.querySelector('[data-card-payment]'))return;['bolt','glovo','wolt'].forEach(platform=>{const data=scheduleText(platform);document.querySelector(`[data-card-payment="${platform}"]`).textContent=data.payment;document.querySelector(`[data-card-period="${platform}"]`).textContent=data.period;document.querySelector(`[data-card-reset="${platform}"]`).textContent=data.note;if(platform==='wolt')document.querySelector('[data-card-delay="wolt"]').hidden=!data.delayed;});}
  function setLanguage(next){language=next==='en'?'en':'ro';nodes.forEach(node=>node.textContent=language==='en'?(translations[node.dataset.hubI18n]||originals.get(node)):(node.dataset.hubI18n==='reimbursementTitle'?'5% Decontare':originals.get(node)));htmlNodes.forEach(node=>node.innerHTML=language==='en'?(translations[node.dataset.hubI18nHtml]||htmlOriginals.get(node)):htmlOriginals.get(node));ariaNodes.forEach(node=>node.setAttribute('aria-label',language==='en'?(translations[node.dataset.hubI18nAria]||ariaOriginals.get(node)):ariaOriginals.get(node)));titleNodes.forEach(node=>node.setAttribute('title',language==='en'?(translations[node.dataset.hubI18nTitle]||titleOriginals.get(node)):titleOriginals.get(node)));document.title=isSubfleet?'Courier Hub':(language==='en'?'CIBERO Fleet Hub':'Hub-ul Flotei CibeRO');if(description)description.content=language==='en'?(isSubfleet?'Courier Hub — general information and resources for partner couriers.':'CIBERO Fleet Hub — information and resources for CibeRO couriers.'):originalDescription;renderPayments();}
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
  document.querySelectorAll('[data-payment-platform]').forEach(button=>button.addEventListener('click',()=>{const platform=button.dataset.paymentPlatform;document.querySelectorAll('[data-payment-platform]').forEach(item=>{const active=item===button;item.classList.toggle('active',active);item.setAttribute('aria-selected',String(active));});document.querySelectorAll('[data-payment-card]').forEach(card=>card.hidden=card.dataset.paymentCard!==platform);}));
  document.querySelectorAll('[data-app-platform]').forEach(button=>button.addEventListener('click',()=>{const platform=button.dataset.appPlatform;document.querySelectorAll('[data-app-platform]').forEach(item=>{const active=item===button;item.classList.toggle('active',active);item.setAttribute('aria-selected',String(active));});document.querySelectorAll('[data-app-panel]').forEach(panel=>panel.hidden=panel.dataset.appPanel!==platform);}));
  document.querySelectorAll('[data-cash-platform]').forEach(button=>button.addEventListener('click',()=>{const platform=button.dataset.cashPlatform;document.querySelectorAll('[data-cash-platform]').forEach(item=>{const active=item===button;item.classList.toggle('active',active);item.setAttribute('aria-selected',String(active));});document.querySelectorAll('[data-rule-platform]').forEach(card=>card.hidden=card.dataset.rulePlatform!==platform);}));
  const hubSections=new Set(['informatii-esentiale','aplicatii-mobile','plati','urmatoarea-plata','ghiduri-video','reguli-cash-si-reset','decontare','faq-platforme','instrumente-si-suport','echipament-oficial','comunicare-whatsapp']);
  const nonDisclosureSections=new Set(['informatii-esentiale','instrumente-si-suport']);
  const platformSlugs={bolt:'boltfood',glovo:'glovo',wolt:'wolt',controlfleet:'controlfleet'};
  const reimbursementSlugs=['cum-functioneaza','orase','cand-primesc-banii','ce-deconteaza','ce-nu-deconteaza'];
  const citySlugs=['iasi','constanta','restul-tarii'];
  const reimbursementItems=[...document.querySelectorAll('.hub-reimbursement-list > details')];
  const cityItems=[...document.querySelectorAll('.hub-city-list > details')];
  let applyingDeepLink=false;
  function currentRoute(){
    try{return decodeURIComponent(location.hash.slice(1)).replace(/\/#/g,'/').replace(/\/+$/,'');}
    catch{return '';}
  }
  function setRoute(route,replace=false){
    if(applyingDeepLink||currentRoute()===route)return;
    history[replace?'replaceState':'pushState'](null,'',`${location.pathname}${location.search}${route?`#${route}`:''}`);
  }
  function selectPlatform(attribute,slug){
    const platform=slug==='boltfood'||slug==='bolt-food'?'bolt':slug;
    if(!Object.hasOwn(platformSlugs,platform))return false;
    const button=document.querySelector(`[${attribute}="${platform}"]`);
    if(!button)return false;
    button.click();
    return true;
  }
  function openDeepLink(){
    const parts=currentRoute().split('/').filter(Boolean);
    const section=parts[0];
    if(!hubSections.has(section))return;
    applyingDeepLink=true;
    let target=document.getElementById(section);
    if(!target){applyingDeepLink=false;return;}
    if(section==='aplicatii-mobile'&&parts[1])selectPlatform('data-app-platform',parts[1]);
    if(!nonDisclosureSections.has(section))target.open=true;
    const category=target.closest('.hub-category-accordion');
    if(category)category.open=true;
    if(section==='urmatoarea-plata'&&parts[1])selectPlatform('data-payment-platform',parts[1]);
    if(section==='reguli-cash-si-reset'&&parts[1])selectPlatform('data-cash-platform',parts[1]);
    if(section==='decontare'&&parts[1]){
      const item=reimbursementItems.find((candidate,index)=>(candidate.dataset.reimbursementSlug||reimbursementSlugs[index])===parts[1]);
      if(item){
        item.open=true;
        target=item;
        if(parts[1]==='orase'&&parts[2]){
          const cityIndex=citySlugs.indexOf(parts[2]);
          if(cityIndex!==-1){cityItems[cityIndex].open=true;target=cityItems[cityIndex];}
        }
      }
    }
    applyingDeepLink=false;
    requestAnimationFrame(()=>target.scrollIntoView({block:'start',behavior:'instant'}));
  }
  document.querySelectorAll('.hub-resource, .hub-reimbursement-item, .hub-city-list > details').forEach(item=>{
    item.querySelector(':scope > summary').addEventListener('click',()=>setTimeout(()=>{
      const route=item.classList.contains('hub-resource')?item.id:item.closest('.hub-city-list')?`decontare/orase/${citySlugs[cityItems.indexOf(item)]}`:`decontare/${item.dataset.reimbursementSlug||reimbursementSlugs[reimbursementItems.indexOf(item)]}`;
      if(item.open)setRoute(route);
      else if(currentRoute()===route||currentRoute().startsWith(`${route}/`))setRoute(item.classList.contains('hub-resource')?'informatii-esentiale':item.closest('.hub-city-list')?'decontare/orase':'decontare',true);
    },0));
  });
  document.querySelectorAll('.hub-category-accordion > summary').forEach(summary=>summary.addEventListener('click',()=>setTimeout(()=>{
    const category=summary.parentElement;
    if(category.open)setRoute(category.id);
    else if(category.contains(document.getElementById(currentRoute().split('/')[0])))setRoute('',true);
  },0)));
  document.querySelectorAll('[data-app-platform]').forEach(button=>button.addEventListener('click',()=>setRoute(`aplicatii-mobile/${platformSlugs[button.dataset.appPlatform]}`)));
  document.querySelectorAll('[data-payment-platform]').forEach(button=>button.addEventListener('click',()=>setRoute(`urmatoarea-plata/${platformSlugs[button.dataset.paymentPlatform]}`)));
  document.querySelectorAll('[data-cash-platform]').forEach(button=>button.addEventListener('click',()=>setRoute(`reguli-cash-si-reset/${platformSlugs[button.dataset.cashPlatform]}`)));
  window.addEventListener('hashchange',openDeepLink);
  window.addEventListener('popstate',openDeepLink);
  if(location.hash){openDeepLink();window.addEventListener('load',openDeepLink,{once:true});}
  setLanguage(document.documentElement.lang);
})();
