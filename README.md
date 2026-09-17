# Eesti aadressiotsing

Minimaalne staatiline veebirakendus, mis otsib Maa- ja Ruumiameti ametlikust In-AKS Gazetteer-teenusest Eesti aadresse ja kuvab nende koordinaadid.

## Käivitamine arvutis

1. Ava PowerShell projekti kaustas.
2. Käivita staatiline veebiserver: `python -m http.server 8080 --directory dist`
3. Ava brauseris `http://localhost:8080`.
4. Sisesta näiteks `Mustamäe tee 51, Tallinn` ja vajuta **Otsi aadressi**.

Faili `index.html` võib testimiseks ka otse avada, kuid kohalik veebiserver jäljendab päris veebimajutust paremini.

## Kuidas API-ga suhtlus töötab

1. Kasutaja sisestab aadressi ja saadab vormi.
2. `app.js` kodeerib sisendi URL-i parameetriks `address`.
3. Rakendus lisab lehele ajutise `<script>` elemendi, mille aadress on näiteks `https://aks.geoportaal.ee/inaks/inaadress/gazetteer?address=...&callback=...`.
4. Ametlik teenus tagastab JSONP-vastuse ja kutsub rakenduse ajutist callback-funktsiooni. JSONP on vajalik, sest Gazetteer ei väljasta tavaliseks brauseri `fetch`-päringuks CORS-päist.
5. Rakendus eemaldab ajutise skripti, loeb vastuse `addresses` massiivi ja kuvab iga vaste ametliku aadressi ning WGS84 ja L-EST97 koordinaadid.
6. Esmalt kasutatakse uut In-AKS teenust. Kui see ei vasta, proovib rakendus pildil antud vana In-ADS aadressi.

API-võtit ei ole vaja ning rakendus ei salvesta kasutaja päringuid.

## FTP-veebimajutusse paigaldamine

Tavalisest FTP-veebimajutusest piisab, kui majutus serveerib faile HTTPS-i kaudu.

1. Laadi kausta `dist` kolm faili (`index.html`, `styles.css`, `app.js`) oma veebimajutuse avalikku juurkausta, sageli `public_html` või `www`.
2. Säilita failinimed ja nende omavaheline asukoht.
3. Ava oma HTTPS-aadress brauseris ja tee proovipäring.
4. Kontrolli nii lauaarvutis kui telefonis, et aadressid ja koordinaadid ilmuvad.

Eraldi andmebaasi, PHP-d ega Node.js serverit selle versiooni jaoks vaja ei ole. HTTPS on oluline, sest rakendus pöördub HTTPS-API poole ja HTTP-lehelt võivad brauserid turvareeglite tõttu päringuid piirata.

## Mida seadistada ja jälgida

- API aadressid asuvad `dist/app.js` alguses muutujas `API_ENDPOINTS`.
- Päringu ajal kuvatakse laadimisolek; 12 sekundi järel loetakse üks teenusekatse aegunuks ja proovitakse varuaadressi.
- Tühi vastus, vigane sisend ja ühenduse viga kuvatakse kasutajale eraldi.
- Jälgi Maa- ja Ruumiameti In-AKS muudatuste teadet ning testi vähemalt kord kuus üht kindlat kontrollaadressi.
- Kui otsing lakkab töötamast, ava brauseri arendajatööriistade **Console** ja **Network**, kontrolli Gazetteer-päringu olekukoodi ning seda, kas callback-vastus saabus.
- Suure liikluse või töökindluse garantii vajaduse korral lisa enda serveripoolne vahenduskiht, logimine, vahemälu ja seire. Väikese lihtsa rakenduse jaoks pole see kohustuslik.

## Olulised andmeväljad

- `taisaadress` — ametlik täisaadress
- `viitepunkt_b`, `viitepunkt_l` — WGS84 laius- ja pikkuskraad
- `viitepunkt_x`, `viitepunkt_y` — L-EST97 koordinaadid
- `ads_oid`, `adr_id` — ametlikud ADS-i tunnused
- `sihtnumber` — postiindeks, kui see on vastuses olemas
