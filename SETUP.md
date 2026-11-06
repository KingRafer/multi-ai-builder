# Setup MultiAI Builder

Repo sudah berisi:
- `index.html` (UI lengkap)
- `server.js` (backend)
- `package.json`, `vercel.json`, `README.md`

## Lengkapi app.js

File `app.js` (logika multi-agent) berukuran besar. Cara paling cepat:

1. Clone repo:
```bash
git clone https://github.com/KingRafer/multi-ai-builder.git
cd multi-ai-builder
```

2. Ganti `app.js` dengan file lengkap dari archive yang diberikan di chat, atau minta AI mengirim ulang konten `app.js`.

3. Deploy ke Vercel:
```bash
npx vercel
```

Atau di [vercel.com/new](https://vercel.com/new) import repo ini.

## Mode Demo

Bahkan tanpa `app.js` penuh, `index.html` + server sudah bisa di-deploy. Setelah `app.js` lengkap di-push, fitur Generate Multi-AI aktif penuh.
