# Eesti aadressi ilm

Üheleheline staatiline veebirakendus, mis:

1. leiab Maa- ja Ruumiameti In-AKS teenusest Eesti aadressi koordinaadid;
2. küsib Open-Meteost selle koha praeguse temperatuuri ja tuulekiiruse;
3. kuvab aadressi Leafleti kaardil OpenStreetMapi aluskaardiga;
4. salvestab viimase eduka aadressi brauseri `localStorage`-isse ja taastab selle lehe värskendamisel automaatselt.

## Käivitamine

Serveeri kausta `dist` tavalise staatilise veebiserveriga ja ava leht brauseris. Rakendus ei vaja API-võtit, andmebaasi ega eraldi taustserverit.

## Andmeallikad

- Aadress ja koordinaadid: Maa- ja Ruumiameti In-AKS Gazetteer
- Praegune temperatuur ja 10 m tuulekiirus: Open-Meteo Forecast API
- Kaart: Leaflet 1.9.4 ja OpenStreetMap

## FTP-veebimajutus

Laadi `dist` kausta failid HTTPS-i kasutava veebimajutuse avalikku kausta. Staatilisest FTP-veebimajutusest piisab.
