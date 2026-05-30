# Hackers & Ravers — In-store navigatie via QR

> Hackathon-project van team **Hackers & Ravers**

Een web-app die winkelbezoekers via een QR-code naar hun product leidt op een
plattegrond — en bij afwezigheid vergelijkbare alternatieven toont met hun locatie.

## 📖 Over dit project

Klanten verdwalen in grote winkels, vinden producten niet, en lopen weg als iets
niet op voorraad is. Personeel wordt overvraagd met "waar ligt X?".

Onze app lost beide op: een bezoeker scant bij binnenkomst een QR-code, zoekt of
selecteert een product, en krijgt een route over de winkelplattegrond naar het
juiste schap. Is het product niet op voorraad, dan toont de app een rij
vergelijkbare alternatieven uit dezelfde categorie, elk met eigen locatie.

Het resultaat: **zelfbediening voor de klant**, **minder onderbrekingen voor het
personeel** en **behoud van een verkoop** wanneer het eerste product ontbreekt.

### Twee doelgroepen

- **De bezoeker** — wil snel en zonder gedoe het juiste schap vinden.
- **De winkel** — wil omzet, minder personeelsdruk en inzicht in zoekgedrag.

## ✨ Features

Kernfuncties (scope voor de hackathon):

- [ ] **QR-instap** — één QR aan de ingang opent de web-app op het startpunt van de winkel.
- [ ] **Productzoeker** — typen of selecteren uit een lijst; toont naam, categorie, schaplocatie en voorraadstatus.
- [ ] **Plattegrond met route** — 2D-kaart van de winkel met een gemarkeerd pad van startpunt naar het schap.
- [ ] **Alternatieven bij afwezigheid** — niet op voorraad? Toon vergelijkbare producten uit dezelfde categorie, elk met locatie.

### Volgende stappen (stretch, niet in de kern-demo)

- [ ] Zone-QR's als startpunt — goedkope "positionering" zonder dure indoor-tracking.
- [ ] Camera-/barcode-scanner voor producten.
- [ ] Live indoor-positionering.
- [ ] Koppeling met een echt kassa-/voorraadsysteem.
- [ ] Personeelsdashboard met zoekstatistieken.
- [ ] Semantische "lijkt op"-matching via embeddings/vector-search.

## 🧠 Hoe het werkt

### Architectuur

De app bestaat uit drie lagen:

- **Frontend (web-app)** — opent direct via QR in de browser, zonder installatie. Plattegrond, zoeker en routeweergave zitten hier.
- **Backend / API** — levert productdata, voorraadstatus, locaties en de berekende route.
- **Data** — producten, categorieën, schaplocaties en de plattegrond zelf.

Voor de hackathon mag de "backend" simpel zijn: alle logica draait met een
seed-dataset in de frontend, zodat er geen serverafhankelijkheid is tijdens de
demo. De winkel-specifieke data staat netjes los van de code.

### Datamodel

| Entiteit | Velden (kern) |
| --- | --- |
| **Product** | id, naam, EAN/artikelcode, categorie-id, attributen (merk, maat, prijs), voorraadstatus, schaplocatie-id |
| **Categorie** | id, naam, optionele hiërarchie (hoofd- → subcategorie) |
| **Locatie (schap/zone)** | id, label ("Gang 4, links"), coördinaat (x, y), knooppunt in de routegraaf |
| **Plattegrond** | de winkel als graaf van knooppunten (gangen, kruispunten, schappen) met verbindingen |

De koppeling die wij toevoegen en die winkels meestal níet hebben, is
**product → schaplocatie**. Dat is het hart van de app.

### Routeberekening

De winkel wordt gemodelleerd als een **graaf**: knooppunten zijn kruispunten,
ganguiteinden en schappen; randen zijn de loopbare verbindingen met een afstand
(gewicht). De route van startpunt naar productschap berekenen we met een
kortste-pad-algoritme (Dijkstra / A\*) en tekenen we als lijn over een
handgetekende SVG-plattegrond.

### Alternatieven-logica

1. **Categorie-match** — toon andere producten in dezelfde (sub)categorie die wél op voorraad zijn.
2. **Attribuut-match** — sorteer op overeenkomst in merk, prijsklasse en maat: meer gedeelde attributen = hogere plek.
3. **Semantische match** *(stretch)* — "lijkt op" via embeddings/vector-search.

Voor de demo zijn stap 1 + 2 ruim voldoende en goed uitlegbaar.

## 🛠️ Tech stack

| Onderdeel | Technologie |
| --------- | ----------- |
| Frontend | React + SVG-plattegrond, Tailwind voor styling |
| Routelogica | JavaScript — graaf + Dijkstra/A\*, in de frontend met seed-data |
| Data | JSON-bestand met producten, categorieën en locaties (geen database nodig voor de demo) |
| Hosting | Statische host (Vercel/Netlify) over HTTPS |

> Niets is verplicht; wil je het serieuzer, dan kan een lichte backend met
> SQLite/PostgreSQL erbij.

## 🔒 Security (Aikido)

Dit idee heeft een klein gevoelig data-oppervlak — dat werkt in ons voordeel.
Wat we vanaf het begin goed zetten:

- Geen API-keys, tokens of secrets in de broncode of repo — gebruik environment variables.
- Dependencies up-to-date en zonder bekende kwetsbaarheden; scan vroeg, niet pas op het eind.
- Invoer in de zoekfunctie valideren (voorkom injection bij een echte database/query).
- Geen persoonsgegevens verzamelen; logs bevatten geen identificeerbare data.
- Serveren over HTTPS (verplicht voor cameratoegang bij de scanner-stretch).

Geen accounts, betalingen of persoonsgegevens → hier valt bijna foutloos te scoren.

## 🚀 Aan de slag

### Vereisten

- Node.js 20+

### Installatie

```bash
# Repo klonen
git clone https://github.com/leliesander-del/Hackers-and-ravers.2.git
cd Hackers-and-ravers.2

# Dependencies installeren
npm install
```

### Draaien

```bash
# Start de dev-server
npm run dev
```

## 🗺️ Bouwvolgorde

Van zekerheid naar pronk — zorg dat stap 1–6 onverwoestbaar werken vóór de stretches:

1. SVG-plattegrond tekenen + graaf eroverheen definiëren.
2. Seed-dataset met ~20–30 producten, categorieën en locaties.
3. Productzoeker die een product koppelt aan een locatie.
4. Kortste pad berekenen en als lijn op de plattegrond tekenen.
5. Alternatieven-logica (categorie + attributen) bij afwezig product.
6. QR-code genereren die naar de live URL wijst.
7. UI polijsten voor de "vibes" en de demo-flow strak repeteren.
8. *(Stretch)* zone-QR's als startpunt, of camera/barcode-scanner.

## 📁 Projectstructuur

```
.
├── README.md
└── ...
```

## 👥 Team

| Naam | Rol |
| ---- | --- |
| _naam_ | _rol_ |

## 📝 Licentie

_Nog te bepalen (bv. MIT)._
