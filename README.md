# EkoTracker Srbija

Aplikacija za prijavu, praćenje i analitiku divljih deponija u Srbiji.

Monorepo sa Turborepo + pnpm workspace strukturom:

## Paketi

- **[backend](./backend)** - Node.js + Express + Prisma + PostgreSQL API
- **[admin](./admin)** - Next.js admin panel za pregled deponija  
- **[mobile](./mobile)** - Expo (React Native) mobilna aplikacija za prijavu
- **[packages/shared](./packages/shared)** - Zajednički TypeScript tipovi

## MVP Funkcionalnosti

1. **Prijava deponije** - Opis, lokacija, urgentnost (1-5), izgled (1-5), tip okruženja
2. **Agregacija prijava** - Deponije u radijusu ~30m se spajaju u jednu
3. **Težinski faktor** - Automatsko izračunavanje prioriteta na osnovu više parametara
4. **Email notifikacije** - Slanje emaila komunalnim preduzećima za visokoprioritene deponije
5. **Status tracking** - ACTIVE | IN_PROGRESS | REMOVAL_PENDING_CONFIRMATION | REMOVED
6. **Admin panel** - Pregled i upravljanje statusima deponija

## Težinski faktor (formula v0)

```
weight = (normUrgency * 1.4) + (normAppearance * 1.0) + (envSensitivity * 2.0) + (reportFactor * 1.2) + (proximity * 1.5)
```

Gde:
- `normUrgency`, `normAppearance` → normalizovano 1–5 u 0–1  
- `envSensitivity` → reka=1.0, park=0.7, residential=0.6, industrial=0.4, other=0.3
- `reportFactor` → log(n + 1) / log(10) 
- `proximity` → stub 0–1 (za buduće GIS implementacije)

**Prag za email**: NOTIFICATION_EMAIL_THRESHOLD=6.5 (podesivo)

## Brzi start

### Preduslovi
- Node.js 20.12.2+ 
- pnpm 8.0+
- Docker & Docker Compose

### Setup
```bash
# 1. Pokretanje infrastrukture
docker compose up -d

# 2. Instaliranje dependency-ja
pnpm install

# 3. Priprema backend-a
cd backend
cp .env.example .env
pnpm prisma migrate dev
pnpm seed

# 4. Pokretanje svih aplikacija
cd ..
pnpm dev
```

### Individualno pokretanje

```bash
# Backend (port 4000)
pnpm dev:backend

# Admin web app (port 3000)  
pnpm dev:admin

# Mobile app (Expo)
pnpm dev:mobile
```

## API Endpoints

- `GET /api/health` → { ok: true }
- `GET /api/dumps` → Lista deponija (sorted by weight desc)
- `POST /api/dumps` → Kreiranje/agregacija prijave  
- `GET /api/municipalities` → Lista opština
- `POST /api/municipalities` → Kreiranje opštine

## Test scenario

1. Provera: `GET http://localhost:4000/api/health`
2. Kreiranje: `POST /api/dumps` sa test payload-om
3. Ponovni POST sa istim koordinatama → aggregation
4. Admin UI: http://localhost:3000 prikazuje listu
5. Mobile: Expo Dev Tools za test submit

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