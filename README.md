# StoreNav — jouw persoonlijke winkelassistent

Een web-app die de fysieke winkelervaring **persoonlijk** maakt — van het moment dat je de app opent tot het moment dat je het juiste schap bereikt. Net zoals Uber je toont welke ritten relevant zijn op basis van waar je bent en waar je heen gaat, toont StoreNav jou welke winkels en producten op dít moment voor jou interessant zijn — en eenmaal in de winkel leidt het je rechtstreeks naar het juiste schap.

Denk: **Uber's persoonlijke startscherm** + **Klarna's klantenkaart-laag** + **indoor-navigatie**, allemaal gebouwd rond één principe: **alles wat de gebruiker ziet, is afgestemd op wie hij of zij is.**

---

## 🧭 De rode draad: personalisatie

Personalisatie is geen feature in deze app. Het is de **fundamentele aanname** waaromheen alles is gebouwd. Elk scherm, elke lijst, elke route en elk alternatief wordt gefilterd, gesorteerd of gewogen op basis van het profiel van de gebruiker.

Concreet betekent dat: een gast en een ingelogd lid zien **een andere app**. Niet gewoon "dezelfde app met een naam erbovenop", maar werkelijk andere content, andere volgorde, andere aanbevelingen.

We laten dat verschil in elke laag van de app expliciet zien — dat is wat het project verkoopt.

---

## 📖 Probleem en oplossing

Klanten staan voor drie wrijvingsmomenten in fysiek winkelen:

1. **Vóór de winkel** — "waar moet ik heen voor wat ik nodig heb?" Mensen googelen, scrollen door losse winkel-apps, of gokken.
2. **Binnenkomst in de winkel** — "waar ligt dit verdomme?" Eindeloos dwalen of personeel onderbreken.
3. **Bij een leeg schap** — "het is er niet". De verkoop is weg, vaak ook de klant.

StoreNav lost alle drie op, met personalisatie als kern:

| Moment | Wat StoreNav doet |
|---|---|
| **Vóór de winkel** | Persoonlijk startscherm met winkels dichtbij, jouw vaste winkels, en winkels op je route met producten die jij waarschijnlijk leuk vindt. |
| **In de winkel** | Geoptimaliseerde route langs jouw boodschappenlijstje, gepersonaliseerde acties op locatie. |
| **Bij een leeg schap** | Alternatieven die passen bij **jouw** voorkeuren (merk, dieet, prijsklasse), niet generieke "andere producten in dezelfde categorie". |

## 🎯 Doelgroepen

| Doelgroep | Wat ze krijgen |
|---|---|
| **De nieuwe gebruiker** | Een toegankelijk startscherm op basis van locatie alleen, met de uitnodiging om te personaliseren door in te loggen. |
| **Het lid (klantenkaart)** | Een werkelijk persoonlijke ervaring — startscherm, zoekresultaten, routes en alternatieven zijn allemaal op hen afgestemd. |
| **De winkel** | Meer relevante voetgang (mensen komen omdat ze écht geïnteresseerd zijn), hogere conversie via alternatieven, inzicht in zoekgedrag. |

---

## 🎯 Scope — wat zit er wél in, en wat niet

### In scope (kern-demo)

Dit moet werken op de hackathon-demo en is jurybestendig:

1. **Persoonlijk startscherm (Uber-stijl)** met drie secties:
   * **Winkels dichtbij jou** — op basis van (gesimuleerde) locatie.
   * **Jouw vaste winkels** — voor ingelogde leden, op basis van geschiedenis.
   * **Op je route** — winkels op een gedefinieerd traject met producten die matchen met jouw voorkeuren.
2. **Klantenkaart-login** — twee tot drie voorbeeldprofielen die elk hun eigen startscherm en winkelervaring opleveren.
3. **Per winkel: plattegrond + zoeker** — open een winkel, zoek een product, krijg een route over een 2D SVG-plattegrond.
4. **QR-instap als alternatief** — een QR aan de winkelingang opent direct die winkel in de app (skipt het startscherm).
5. **Gepersonaliseerde zoekresultaten** — leden zien hun voorkeurs-merken bovenaan, met dieet-tags die kloppen met hun profiel.
6. **Alternatieven met profielweging** — leeg schap toont alternatieven die niet alleen in dezelfde categorie zitten, maar ook passen bij voorkeuren van de gebruiker.
7. **Boodschappenlijst-modus** — meerdere producten tegelijk; route geoptimaliseerd langs alle stops.
8. **Loyalty-acties op locatie** — leden zien gepersonaliseerde deals voor producten die zij waarschijnlijk willen.

### Out of scope (stretch)

* Live indoor-positionering (Bluetooth beacons, WiFi).
* Camera/barcode-scanner voor producten.
* Koppeling met echte kassa-/voorraadsystemen van winkels.
* Personeelsdashboard met zoekstatistieken.
* Semantische "lijkt op"-matching via embeddings.
* Echte authenticatie en GDPR-compliant dataopslag.
* Pushnotificaties als je in de buurt van een relevante winkel komt.

### Expliciet géén onderdeel

* Betalingen of kassafunctionaliteit.
* Echte persoonsgegevens — alle profielen zijn fictief.
* Onbeperkt aantal winkels — voor de demo bouwen we er 3 tot 4 uit, waarvan 1 met een volledige plattegrond.

---

## ✨ Features in detail — met personalisatie als rode draad

### 1. Het startscherm — waar personalisatie meteen voelbaar wordt

Wanneer de app opent (zonder QR-scan), zie je een Uber-achtig scherm:

**Voor een gast (niet ingelogd):**
* Eén sectie: "Winkels dichtbij jou" — op basis van locatie alleen.
* Subtiele banner bovenaan: "Log in met je klantenkaart om persoonlijke aanbevelingen te zien."

**Voor een ingelogd lid:**
* **Welkomstheader** met naam en loyalty-saldo.
* **Sectie 1 — "Goedemorgen, Sander"** — winkels dichtbij, maar al gesorteerd op jouw voorkeur (bijv. supermarkten boven kledingwinkels als je vooral boodschappen doet).
* **Sectie 2 — "Jouw vaste winkels"** — winkels waar je vaker komt, met snelle ingang naar je boodschappenlijst.
* **Sectie 3 — "Op je route"** — als je een bestemming hebt gedefinieerd (bijv. "naar werk"), tonen we winkels langs die route met producten die jij waarschijnlijk leuk vindt. Bijvoorbeeld: "AH XL Brugge ligt op je route en heeft je favoriete koffie deze week in actie."
* **Sectie 4 (optioneel) — "Misschien iets voor jou"** — winkels die je nog niet kent, maar die producten verkopen die passen bij je profiel.

Dit scherm is de **kern van de pitch**. Hier zie je in één blik dat de app weet wie je bent.

### 2. De klantenkaart — wat zit er in een profiel

Op het loginscherm tonen we 2 tot 3 voorbeeldprofielen, elk met een herkenbare persoonlijkheid die in de demo zichtbaar tot andere resultaten leidt:

| Profiel | Karakteristieken |
|---|---|
| **Sander** | Doet vooral boodschappen, glutenvrij dieet, premium merken, woont in Brugge centrum. |
| **Lies** | Sportieve millennial, koopt regelmatig sportkleding en gezonde snacks, prijsbewust, fietst overal. |
| **Marc** | Gezinsvader, grote weekboodschappen, koopt graag op aanbieding, vaste route school–werk–thuis. |

Elk profiel heeft:
* **Voorkeuren** — favoriete merken, dieet-tags, prijsklasse, productcategorieën waar ze veel kopen.
* **Geschiedenis** — eerder bezochte winkels en eerder gekochte producten.
* **Vaste route** — een gesimuleerde dagelijkse route (thuis–werk, of thuis–school–werk).
* **Boodschappenlijst** — een opgeslagen lijst voor "deze trip".
* **Loyalty-saldo** — punten en actieve deals.

Bij het wisselen tussen profielen tijdens de demo zie je het **hele startscherm veranderen**, en ook de winkelervaring erna. Dat is de kracht van de demo.

### 3. Een winkel openen

Drie manieren om bij een winkel uit te komen:

1. **Tikken op een winkelkaart** vanuit het startscherm.
2. **QR scannen** aan de winkelingang (skipt startscherm, opent direct die winkel met locatie "ingang").
3. **Direct via een product** — als je vanuit het startscherm op "Sanders favoriete koffie is in actie bij AH XL" tikt, opent de winkel en wordt de route naar dat product al ingeladen.

### 4. In de winkel — plattegrond en route

De winkel wordt intern gemodelleerd als een **graaf**:
* **Knooppunten** — kruispunten, ganguiteinden, schappen.
* **Randen** — loopbare verbindingen met gewicht (afstand).

We renderen een SVG-plattegrond en tekenen de route met **Dijkstra** (of A* als optimalisatie) als duidelijke lijn over de kaart. Voor meerdere stops (lid met boodschappenlijst) gebruiken we een **greedy nearest-neighbour TSP** — voor 5–10 producten snel genoeg en geeft een logische volgorde.

### 5. Productzoeker — ook hier personaliseren we

Het zoekveld geeft live resultaten. Voor leden:
* **Voorkeurs-merken bovenaan** — als jij vaak merk X koopt, staat merk X-koffie boven merk Y-koffie.
* **Dieet-tags zichtbaar én gefilterd** — een glutenvrij lid ziet glutenvrije opties als eerste, of een hint "💡 dit bevat gluten" bij niet-passende producten.
* **Suggesties uit je lijst en geschiedenis** — voordat je iets typt, tonen we je opgeslagen boodschappenlijst en "vorige aankopen" als snelkeuze.

Voor een gast: gewoon alfabetisch of relevantie-gesorteerd, geen tags.

### 6. Alternatieven bij afwezigheid — opnieuw persoonlijk

Wanneer een product niet op voorraad is:

1. **Categorie-match** — andere producten in dezelfde (sub)categorie, op voorraad. *(Basis, ook voor gasten.)*
2. **Attribuut-overlap** — score op merk, prijs, maat. *(Basis.)*
3. **Profielweging** — voor leden tellen voorkeuren extra zwaar. Een glutenvrij lid krijgt **nooit** een glutenbevattend alternatief vooraan zien. *(Personalisatie.)*
4. **Locatie meenemen** — voorrang aan alternatieven die in de buurt van de huidige route liggen, om niet door de hele winkel te hoeven omlopen.

Resultaat: een rij van 3 tot 5 alternatieven, elk met locatie, route-knop, en voor leden een korte uitleg waarom dit aanbevolen wordt ("zelfde merk, in actie deze week").

### 7. Loyalty-acties op locatie — persoonlijk, niet generiek

In de seed-data markeren we ~10 producten als "in actie deze week". Maar voor leden tonen we **alleen acties die voor hen relevant zijn**:

* Sander (glutenvrij) ziet wel de actie op glutenvrije pasta, niet die op normale pasta.
* Marc (gezinsvader, prijsbewust) ziet vooral grootverpakkingen en multipack-deals.
* Lies (sportief) ziet sport-gerelateerde producten en gezonde snacks.

Tijdens een route krijgen relevante actieproducten een badge op de plattegrond en in de lijst. Het voelt alsof de app voor jou is gemaakt — omdat dat ook zo is.

---

## 🧠 Architectuur

```
┌─────────────────────────────────────────────────┐
│  Frontend (React, single-page)                  │
│                                                 │
│  ├─ Startscherm (persoonlijk, Uber-stijl)       │
│  │   ├─ Locatie-detectie (gesimuleerd)          │
│  │   ├─ Profiel-engine (sortering & filtering)  │
│  │   └─ Winkelkaarten met deeplinks             │
│  │                                              │
│  ├─ Winkelweergave                              │
│  │   ├─ SVG-plattegrond                         │
│  │   ├─ Zoeker (gepersonaliseerd)               │
│  │   ├─ Routelogica (Dijkstra + greedy TSP)     │
│  │   └─ Alternatieven-engine (gewogen)          │
│  │                                              │
│  └─ Profiel-laag (overal beschikbaar)           │
│      ├─ Active profile state                    │
│      ├─ Voorkeuren, geschiedenis, lijst         │
│      └─ Loyalty & acties                        │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│  Seed-data (JSON, in repo)                      │
│  ├─ winkels (locatie, categorie, plattegrond)   │
│  ├─ producten (per winkel, attributen, voorraad)│
│  ├─ acties / deals                              │
│  ├─ voorbeeldprofielen (3 stuks)                │
│  └─ gesimuleerde gebruikerslocatie              │
└─────────────────────────────────────────────────┘
```

Alle logica draait in de frontend met seed-data. Geen backend, geen database, geen serverafhankelijkheid tijdens de demo. Dat geeft een gegarandeerd-werkende demo én een korte stack.

## 📦 Datamodel

| Entiteit | Velden (kern) |
|---|---|
| **Winkel** | id, naam, type (supermarkt/kleding/etc.), locatie (lat/lng), openingstijden, heeft-plattegrond (bool) |
| **Product** | id, winkel-id, naam, EAN, categorie-id, attributen (merk, maat, prijs, dieet-tags), voorraadstatus, schaplocatie-id, actie-id |
| **Categorie** | id, naam, parent-id |
| **Locatie (schap)** | id, winkel-id, label, graaf-knooppunt-id, SVG-coördinaat (x, y) |
| **Plattegrond** | winkel-id, graaf (knooppunten + randen), SVG-source |
| **Actie** | id, product-id, korting, doelgroep-tags |
| **Profiel** | id, naam, voorkeuren (merken, dieet, prijsklasse, categorieën), geschiedenis (winkel-ids, product-ids), vaste route (lijn van punten), boodschappenlijst, loyalty-punten |
| **Gebruikerslocatie** | (gesimuleerd) huidige lat/lng + actieve route |

De cruciale kruising die we maken — en waar de "magie" zit — is **profiel × locatie × productdata**. Dat is wat de personalisatie aandrijft.

### De personalisatie-engine — hoe het werkt

Voor elke lijst (winkels op startscherm, zoekresultaten, alternatieven) draait dezelfde flow:

1. **Filter** op harde criteria (binnen X km, voorraad aanwezig, dieet-compatibel).
2. **Score** per item op basis van:
   * Match met voorkeuren (gewicht hoog).
   * Geschiedenis (heb je hier eerder gewinkeld? gekocht?).
   * Locatie/route (afstand tot huidige positie of route).
   * Acties (loyalty-deals tellen extra).
3. **Sorteer** aflopend op totaalscore.
4. **Label** waarom dit item bovenaan staat ("jouw vaste winkel", "in actie", "matcht je voorkeur").

Voor een gast slaan we stap 2 grotendeels over en sorteren we alleen op afstand.

---

## 🛠️ Tech stack

| Onderdeel | Technologie |
|---|---|
| Frontend | React (Vite) |
| Styling | Tailwind CSS |
| Plattegronden | Hand-getekende SVG per winkel |
| Routelogica | JavaScript — graaf + Dijkstra, greedy TSP voor meerdere stops |
| Personalisatie-engine | JavaScript — gewogen scoring-functies |
| Buitenkaart (winkels in de buurt) | Leaflet + OpenStreetMap-tiles (gratis, geen API-key) |
| State | React Context voor het actieve profiel, localStorage voor sessie |
| Data | JSON-bestanden in `/src/data/` |
| QR-generatie | `qrcode` npm-package |
| Hosting | Vercel of Netlify, HTTPS standaard |

Geen backend. Geen database. Eén externe dienst (OSM-tiles) voor de buitenkaart, gratis en zonder authenticatie.

---

## 🔒 Security (Aikido-check)

Het data-oppervlak blijft klein, dat werkt in ons voordeel:

* **Geen API-keys, tokens of secrets in de repo** — `.env` met `.env.example`, `.env` in `.gitignore`.
* **Dependencies up-to-date** — `npm audit` schoon houden.
* **Input-validatie** op de zoekfunctie (XSS-veilig).
* **HTTPS verplicht** — automatisch via Vercel/Netlify, nodig voor locatie-API in de browser.
* **Geen echte persoonsgegevens** — profielen zijn hardgecodeerd en fictief.
* **CSP-headers** — strikte Content Security Policy via hosting-config.
* **Locatie-toestemming respecteren** — als de gebruiker de geo-API weigert, fallback op een geselecteerde stad zonder fouten.

### Privacy-disclaimer voor de pitch

Een product dat persoonlijke profielen, geschiedenis en locatie combineert, raakt direct aan GDPR. Voor de demo niet relevant (alles fictief), maar in de pitch benoemen we expliciet: opt-in, dataminimalisatie, transparantie over welke data waarvoor wordt gebruikt, en korte retentietermijnen. Juryleden vragen daar bij dit type idee altijd naar.

---

## 🗺️ Stappenplan — bouwvolgorde

Van **zekerheid naar pronk**. Elk blok is afgerond demobaar.

### Blok 1 — Fundament (dag 1 ochtend)

**Doel:** projectstructuur staat, profiel-laag werkt, lege app draait.

1. Vite + React + Tailwind opzetten.
2. Profielen-JSON aanmaken (3 personas met alle velden).
3. React Context voor het actieve profiel — switch werkt al, ook al is er nog niks om te tonen.
4. Eenvoudige header met "ingelogd als X" / "verder als gast", en een knop om te wisselen.

### Blok 2 — Het persoonlijke startscherm (dag 1 middag)

**Doel:** dé pitch werkt al, ook zonder de winkel-binnen-flow.

5. Winkels-JSON met 6–8 winkels (lat/lng, type, naam).
6. Leaflet-kaart met markers voor winkels in de buurt.
7. Onder de kaart: secties "Dichtbij", "Jouw vaste winkels", "Op je route" met winkel-kaartjes.
8. Personalisatie-engine v1: scoring-functie die per profiel een andere volgorde teruggeeft. **Demo-moment:** wissel van profiel, scherm verandert volledig.
9. Voor "Op je route": teken een gesimuleerde route op de kaart (hardcoded polyline per profiel) en filter winkels die er dichtbij liggen.

### Blok 3 — Een winkel openen + plattegrond (dag 1 eind / dag 2 ochtend)

**Doel:** tik op een winkel → zie de plattegrond.

10. SVG-plattegrond voor één winkel (5–6 gangen). Andere winkels mogen "plattegrond komt eraan"-placeholder krijgen — focus op één goed uitgewerkte winkel.
11. Graaf-datastructuur over de SVG, met (x, y) per knooppunt.
12. Routing: Dijkstra implementeren, lege route nog niet tekenen.

### Blok 4 — Productzoeker met personalisatie (dag 2 ochtend)

**Doel:** zoeken werkt, en is duidelijk anders per profiel.

13. Producten-JSON voor de hoofdwinkel: ~30 producten, gekoppeld aan schaplocaties, ~6 niet-op-voorraad.
14. Zoeker met live filtering.
15. Resultaten-sortering per profiel: voorkeurs-merken bovenaan, dieet-incompatibele producten met waarschuwing of onderaan.
16. **Demo-moment:** zelfde zoekwoord ("pasta"), twee profielen, twee andere top-resultaten.

### Blok 5 — Route op plattegrond + alternatieven (dag 2 middag)

**Doel:** klikken op product = route, en bij leeg schap = persoonlijke alternatieven.

17. Tik op product → route tekenen op SVG.
18. Detectie "niet op voorraad" → alternatieven-paneel.
19. Scoring-functie met profielweging: categorie + attribuut-overlap + voorkeuren + locatie-nabijheid.
20. **Demo-moment:** zoek een leeg product met twee profielen, krijg twee andere top-alternatieven.

### Blok 6 — Boodschappenlijst & loyalty op locatie (dag 2 eind)

**Doel:** het volle plaatje — meerdere stops, gepersonaliseerde acties zichtbaar onderweg.

21. Boodschappenlijst per profiel (uit JSON, ~5 producten).
22. Greedy TSP-routing langs alle producten in de lijst.
23. Acties-JSON met ~10 deals.
24. Alleen acties tonen die matchen met het actieve profiel (op productcategorie en voorkeurs-tags).
25. Badge op de plattegrond en in de lijst voor relevante actieproducten.

### Blok 7 — QR + polish (dag 3 ochtend)

**Doel:** demo-klaar.

26. App deployen, live URL claimen.
27. QR-code genereren met `?store=ah-xl-brugge&entry=ingang` als query, printen op A4.
28. Visuele polish: kleuren, typografie, transities, mobiel-first check.
29. **Demo-script repeteren** — exact 3 minuten, profiel-wissel laten zien, één heldere doorloop.

### Blok 8 — Stretch (alleen als 1–7 staan)

In deze volgorde:

30. **Zone-QR's** binnen één winkel als her-positioneringspunten.
31. **Camera/barcode-scanner** voor producten (`html5-qrcode`).
32. **Mini-analytics** op `/admin`: meest gezochte producten per profiel-type.

---

## 🚀 Aan de slag

### Vereisten

* Node.js 20+
* npm of pnpm

### Installatie

```bash
git clone https://github.com/leliesander-del/Hackers-and-ravers.2.git
cd Hackers-and-ravers.2
npm install
```

### Draaien

```bash
npm run dev
```

Voor het testen op mobiel: deploy naar Vercel/Netlify (gratis) en open de URL op je telefoon. Locatie-API werkt alleen op HTTPS.

---

## 📋 Definition of Done — kern-demo

De demo is "klaar" als:

* [ ] Startscherm toont voor elk van de 3 profielen een **zichtbaar andere** volgorde en selectie van winkels.
* [ ] Wisselen van profiel ververst het startscherm in realtime.
* [ ] "Verder als gast" geeft een merkbaar uitgeklede versie van het startscherm.
* [ ] Tik op een winkel → plattegrond opent.
* [ ] QR scannen opent dezelfde winkel direct, met startpunt "ingang".
* [ ] Zoeken naar een product geeft per profiel andere top-resultaten.
* [ ] Niet-op-voorraad product → profielspecifieke alternatieven met route-knop.
* [ ] Lid met boodschappenlijst → één geoptimaliseerde route langs ≥4 producten.
* [ ] Loyalty-acties zijn alleen zichtbaar voor relevante profielen.
* [ ] App draait live op HTTPS-URL, mobiel-vriendelijk.
* [ ] Demo-pitch van 3 minuten staat, met expliciete profiel-wissel als climax.

---

## 🎤 De pitch in één zin

> "We bouwen een persoonlijke assistent voor fysieke winkels — een Uber-achtig startscherm dat jou laat zien welke winkels en producten op dit moment voor jou relevant zijn, en eenmaal in de winkel een persoonlijke route langs jouw boodschappen, met alternatieven en acties die echt bij jou passen."
