# EkoTracker Srbija

Aplikacija za prijavu, praćenje i analitiku divljih deponija u Srbiji.

Monorepo sadrži:
- backend (Node.js + Express + Prisma + PostgreSQL)
- mobile (React Native / Expo) – korisnička prijava deponija
- admin (Next.js) – pregled i upravljanje statusima
- packages/shared – zajednički tipovi
- docker-compose – razvojna infrastruktura (Postgres + Mailhog)

## MVP Funkcionalnosti
1. Prijava deponije (slika URL placeholder, opis, lokacija, ocene: izgled & urgentnost, tip okruženja)
2. Agregacija prijava u jednu deponiju (pretraga po malom radijusu)
3. Izračunavanje težinskog (prioritetnog) faktora
4. Prag za slanje email notifikacije komunalnom preduzeću
5. Statusi: ACTIVE | IN_PROGRESS | REMOVAL_PENDING_CONFIRMATION | REMOVED
6. Crowdsourced potvrda uklanjanja (>=3 potvrde)
7. Administrativni panel (pregled + zahtev za uklanjanje)

## Arhitektura (MVP)
- Backend API: /api/dumps, /api/municipalities
- Baza: PostgreSQL (Prisma ORM)
- Analitika težine: kombinacija urgentnosti, izgleda, osetljivosti okruženja, broja prijava
- Notifikacije: email preko SMTP (Mailhog lokalno)

## Težinski faktor (formula v0)
```
weight = (baseUrgency * 1.4) + (appearance * 1.0) + (envSensitivity * 2.0) + (reportFactor * 1.2) + (proximity * 1.5)
```
Gde:
- baseUrgency, appearance -> normalizovano 1–5 u 0–1
- envSensitivity (reka=1.0, park=0.7, residential=0.6, industrial=0.4, other=0.3)
- reportFactor = log(n + 1) / log(10)
- proximity (stub 0–1, kasnije GIS slojevi)

Prag za slanje emaila: podesivo (env NOTIFICATION_EMAIL_THRESHOLD, default 6.5).

## Pokretanje
```
docker compose up -d
cd backend
cp .env.example .env
npm install
npx prisma migrate dev
npm run dev
```
Mobilna aplikacija (u drugom terminalu):
```
cd mobile
npm install
npx expo start
```
Admin (web):
```
cd admin
npm install
npm run dev
```

Mailhog UI (pregled emailova): http://localhost:8025

## Sledeći koraci (predlozi)
- Autentikacija i uloge (USER, MUNICIPALITY, ADMIN)
- Upload stvarnih fotografija (MinIO/S3 presigned URL)
- Geohash / H3 indeksiranje + ozbiljnija klasterizacija (DBSCAN)
- Cron / queue (BullMQ + Redis) za re-evaluaciju težina
- GIS slojevi (OpenStreetMap / Natura2000 / reke / parkovi)
- Rate limiting i anti-spam
- Verzije i audit log promena statusa
- i18n (sr/eng)

## Licenca
MIT (vidi LICENSE).