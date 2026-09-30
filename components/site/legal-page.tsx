import { LegacyHomepageScripts } from "@/components/home/legacy-homepage-scripts";
import { PublicFooter } from "@/components/site/public-footer";
import { PublicHeader } from "@/components/site/public-header";

type Section = { title: string; paragraphs: string[]; items?: string[] };

const contact = ["CibeRO S.R.L.", "CUI: RO53182698", "Nr. Registrul Comerțului: J2026005444001", "Sediu: Strada Farului 31, Constanța, România", "E-mail: cibero.riders@gmail.com", "Telefon: +40 736 364 334"];

const documents: Record<"termeni" | "confidentialitate" | "cookie-uri", { title: string; sections: Section[] }> = {
  termeni: {
    title: "Termeni și Condiții",
    sections: [
      { title: "1. Identificarea operatorului", paragraphs: ["Site-ul cibero.delivery este operat de CibeRO S.R.L., denumită în continuare „CibeRO”, „noi” sau „flota”."], items: contact },
      { title: "2. Scopul site-ului", paragraphs: ["cibero.delivery este site-ul oficial de prezentare al CibeRO și oferă informații despre activitatea flotei, posibilitățile de colaborare, platformele partenere, condițiile generale de înscriere, campanii și beneficii.", "Transmiterea formularului de înscriere reprezintă o cerere inițială de colaborare; nu constituie un contract și nu garantează activarea unui cont de curier. Gestionarea ulterioară se realizează prin Cibero Manager Tool și canalele CibeRO."] },
      { title: "3. Colaborare și eligibilitate", paragraphs: ["CibeRO este o flotă parteneră independentă care poate colabora cu Bolt Food, Glovo și Wolt. Colaborarea poate avea loc prin PFA, SRL, contract de participațiune sau altă formă permisă și convenită de părți.", "Solicitantul trebuie să aibă minimum 18 ani și să transmită informații reale, actuale și complete. Datele false, identitatea altei persoane sau documentele neautentice pot duce la respingerea cererii, suspendare sau încetarea colaborării."] },
      { title: "4. Înscriere, conturi și plăți", paragraphs: ["Formularul poate solicita date de contact, orașul, platformele dorite, forma de colaborare, naționalitatea, vehiculul și observații voluntare. Pentru activare pot fi necesare date și documente suplimentare.", "Comisionul depinde de tipul colaborării și este comunicat înainte de încheierea acesteia. Plățile sunt efectuate săptămânal pentru veniturile săptămânii precedente, de regulă joi sau vineri, în contul bancar comunicat de colaborator.", "Datele necesare activării pot fi transmise platformelor solicitate. Acceptarea, verificarea documentelor și disponibilitatea într-un oraș depind inclusiv de procedurile platformei; CibeRO nu poate garanta aprobarea unui cont."] },
      { title: "5. Obligații și încetare", paragraphs: ["Colaboratorul trebuie să utilizeze date reale și propriul cont și să respecte contractul, regulamentele CibeRO și regulile platformelor. Încetarea se face conform contractului aplicabil.", "CibeRO poate suspenda accesul sau înceta colaborarea în situații justificate, inclusiv fraudă, datorii restante, date false, utilizare neautorizată a contului sau încălcări grave ori repetate ale regulilor."] },
      { title: "6. Dispoziții finale", paragraphs: ["CibeRO este independentă de platformele partenere; mărcile acestora aparțin titularilor lor. Informațiile despre platforme, orașe, campanii și bonusuri se pot modifica independent de CibeRO și nu înlocuiesc condițiile contractuale individuale.", "Acești termeni sunt guvernați de legislația română și pot fi actualizați periodic. Pentru întrebări sau sesizări, contactează-ne la cibero.riders@gmail.com sau +40 736 364 334."] },
    ],
  },
  confidentialitate: {
    title: "Confidențialitate & GDPR",
    sections: [
      { title: "1. Operatorul datelor", paragraphs: ["CibeRO S.R.L. prelucrează datele persoanelor care folosesc site-ul, solicită înscrierea în flotă sau colaborează cu CibeRO."], items: contact },
      { title: "2. Datele pe care le colectăm", paragraphs: ["La înscriere putem colecta nume, telefon, e-mail, oraș, platforme dorite, forma de colaborare, naționalitate, vehicul, sursa informării, observații voluntare și confirmările aferente vârstei și documentelor juridice.", "Dacă procesul continuă, pot fi necesare date suplimentare, precum CNP, act de identitate, IBAN și, pentru PFA, datele de identificare ale formei juridice. Colectăm aceste date numai când sunt necesare pentru colaborare, plăți sau activare."] },
      { title: "3. Scopuri și destinatari", paragraphs: ["Datele sunt folosite pentru analizarea cererii, contactare, încheierea și administrarea colaborării, activarea conturilor, plăți, prevenirea fraudei și respectarea obligațiilor legale.", "Accesul este limitat la personalul autorizat. Datele necesare pot fi transmise către Bolt Food, Glovo sau Wolt, autorități când legea o cere și servicii de comunicare folosite pentru contactare."] },
      { title: "4. Stocare și păstrare", paragraphs: ["Datele sunt păstrate în Cibero Manager Tool și protejate prin măsuri tehnice și organizatorice. Cererile care nu devin colaborări sunt păstrate, în principiu, maximum 2 luni; datele operaționale ale colaboratorilor, pe durata colaborării și în principiu încă 6 luni după încetare.", "Anumite documente pot fi păstrate mai mult dacă legislația sau apărarea unui drept o impun. Datele de marketing sunt păstrate până la retragerea consimțământului sau încetarea scopului."] },
      { title: "5. Drepturile tale", paragraphs: ["Poți solicita acces, rectificare, ștergere, restricționare, portabilitate, opoziție și retragerea consimțământului, în condițiile GDPR. Cererile se transmit prin Cibero Manager Tool sau la cibero.riders@gmail.com.", "Poți depune o plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP). Această politică poate fi actualizată periodic."] },
    ],
  },
  "cookie-uri": {
    title: "Politica de Cookie-uri",
    sections: [
      { title: "Ce sunt cookie-urile", paragraphs: ["Cookie-urile și tehnologiile similare permit unui site să stocheze sau să acceseze anumite informații pe dispozitivul utilizatorului."] },
      { title: "Utilizarea cookie-urilor de către CibeRO", paragraphs: ["La data ultimei actualizări, CibeRO nu utilizează cookie-uri sau tehnologii similare pentru publicitate, marketing, profilare sau analiză comportamentală și nu utilizează pixeli de tracking Meta, TikTok ori Google Ads.", "Mecanismele tehnice strict necesare funcționării site-ului sunt utilizate numai pentru furnizarea funcțiilor solicitate de utilizator."] },
      { title: "Modificări viitoare", paragraphs: ["Dacă vom introduce Google Analytics, Google Ads, Meta Pixel, TikTok Pixel sau alte tehnologii neesențiale, această politică va fi actualizată și va fi implementat mecanismul de consimțământ necesar înainte de activarea lor.", "Pentru întrebări, scrie-ne la cibero.riders@gmail.com."] },
    ],
  },
};

export function LegalPage({ document }: { document: keyof typeof documents }) {
  const current = documents[document];
  return <><PublicHeader /><main className="legal-page"><article className="legal-document"><p className="legal-kicker">CibeRO · INFORMAȚII JURIDICE</p><h1>{current.title}</h1><p className="legal-updated">Ultima actualizare: 30 septembrie 2026</p>{current.sections.map((section) => <section key={section.title}><h2>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.items && <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul>}</section>)}</article></main><PublicFooter /><LegacyHomepageScripts /></>;
}
