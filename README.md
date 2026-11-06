# MultiAI Builder v2 — Full-Stack Edition

**Aplikasi Web Multi-AI** untuk membuat website & aplikasi profesional lengkap dengan:

- Multi-Agent AI (Planner → Designer → Developer → Reviewer)
- **Backend** (Express + SQLite)
- **Database** (Supabase / Prisma / SQLite)
- **Deploy ke Vercel** (ZIP siap pakai)

---

## Fitur Baru (v2)

| Fitur | Keterangan |
|-------|------------|
| **Full-Stack Mode** | Generate Next.js + API routes |
| **Database** | Pilih Supabase, Prisma+PostgreSQL, atau SQLite |
| **Save Projects** | Simpan ke SQLite (backend) atau localStorage |
| **Export ZIP** | Download project lengkap |
| **Deploy Vercel** | Generate struktur Next.js siap deploy + `.env.example` |
| **BYOK** | Grok, OpenAI, Claude, Gemini, OpenRouter |

---

## Cara Menjalankan

### 1. Frontend saja (cepat)

```bash
cd multi-ai-builder
# Buka index.html di browser
# atau
npx serve .
```

### 2. Full (Backend + Database)

```bash
cd multi-ai-builder
npm install
npm run dev
# Buka http://localhost:3000
```

Backend akan:
- Menyimpan project di `data/projects.db` (SQLite)
- Menyediakan API `/api/projects` dan `/api/export-vercel`

### 3. Deploy Builder sendiri ke Vercel

```bash
npx vercel
```

Atau push ke GitHub lalu import di vercel.com.

---

## Cara Pakai Aplikasi

1. Tulis deskripsi website/aplikasi
2. (Opsional) Centang **Full-Stack Mode** → pilih Database
3. Klik **Generate dengan Multi-AI**
4. Lihat Live Preview + Code (HTML / CSS / JS / API / DB)
5. **Save** project, **ZIP**, atau **Deploy Vercel**

### Deploy hasil generate ke Vercel

1. Klik tombol **Deploy Vercel**
2. Download **Vercel ZIP**
3. Extract → `npm install` → isi `.env.local`
4. `npx vercel --prod`  
   atau push ke GitHub & import di Vercel

---

## Struktur Project

```
multi-ai-builder/
├── index.html          # UI utama
├── app.js              # Multi-agent logic + demo + export
├── server.js           # Express backend + SQLite + Vercel export API
├── package.json
├── vercel.json         # Konfigurasi deploy builder
├── data/               # SQLite database (auto-created)
└── README.md
```

---

## Environment (untuk hasil generate)

Jika generate dengan Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Jika Prisma:

```
DATABASE_URL=postgresql://...
```

---

Dibuat untuk Anda • MultiAI Builder v2
