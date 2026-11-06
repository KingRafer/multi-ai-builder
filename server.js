/**
 * MultiAI Builder - Backend Server
 * - Menyimpan project ke SQLite
 * - API untuk list/save/load/delete project
 * - Siap di-deploy ke Vercel (serverless) atau Node biasa
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory store (Vercel-friendly). For persistent DB use Supabase/Postgres in production.
let db = null;
global.__projects = global.__projects || new Map();
console.log('✅ In-memory project store ready (Vercel compatible)');

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

// ============ API ROUTES ============

// Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '2.0.0', time: new Date().toISOString() });
});

// List projects
app.get('/api/projects', (req, res) => {
  try {
    if (db) {
      const rows = db.prepare('SELECT id, name, prompt, framework, style, full_stack, db_type, created_at, updated_at FROM projects ORDER BY updated_at DESC').all();
      return res.json(rows);
    }
    // fallback
    const list = Array.from(global.__projects?.values() || []).map(p => ({
      id: p.id, name: p.name, prompt: p.prompt, framework: p.framework,
      style: p.style, full_stack: p.full_stack, db_type: p.db_type,
      created_at: p.created_at, updated_at: p.updated_at
    }));
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get single project
app.get('/api/projects/:id', (req, res) => {
  try {
    if (db) {
      const row = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
      if (!row) return res.status(404).json({ error: 'Project not found' });
      return res.json(row);
    }
    const p = global.__projects?.get(req.params.id);
    if (!p) return res.status(404).json({ error: 'Project not found' });
    res.json(p);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Create / Update project
app.post('/api/projects', (req, res) => {
  try {
    const { id, name, prompt, framework, style, code_html, code_css, code_js, full_stack, db_type } = req.body;
    const projectId = id || uuidv4();
    const now = new Date().toISOString();

    if (db) {
      const existing = db.prepare('SELECT id FROM projects WHERE id = ?').get(projectId);
      if (existing) {
        db.prepare(`
          UPDATE projects SET 
            name=?, prompt=?, framework=?, style=?, 
            code_html=?, code_css=?, code_js=?, 
            full_stack=?, db_type=?, updated_at=?
          WHERE id=?
        `).run(name, prompt, framework, style, code_html, code_css, code_js, full_stack ? 1 : 0, db_type || 'none', now, projectId);
      } else {
        db.prepare(`
          INSERT INTO projects (id, name, prompt, framework, style, code_html, code_css, code_js, full_stack, db_type, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(projectId, name || 'Untitled', prompt, framework, style, code_html, code_css, code_js, full_stack ? 1 : 0, db_type || 'none', now, now);
      }
    } else {
      global.__projects = global.__projects || new Map();
      global.__projects.set(projectId, {
        id: projectId, name: name || 'Untitled', prompt, framework, style,
        code_html, code_css, code_js, full_stack: !!full_stack, db_type: db_type || 'none',
        created_at: now, updated_at: now
      });
    }

    res.json({ id: projectId, message: 'Project saved' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Delete project
app.delete('/api/projects/:id', (req, res) => {
  try {
    if (db) {
      db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
    } else {
      global.__projects?.delete(req.params.id);
    }
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Generate Vercel-ready project structure (JSON)
app.post('/api/export-vercel', (req, res) => {
  try {
    const { name, code_html, code_css, code_js, framework, full_stack, db_type, prompt } = req.body;
    
    const files = {};
    
    if (framework === 'next' || full_stack) {
      files['package.json'] = JSON.stringify({
        name: (name || 'multiai-app').toLowerCase().replace(/\s+/g, '-'),
        version: '1.0.0',
        private: true,
        scripts: {
          dev: 'next dev',
          build: 'next build',
          start: 'next start',
          lint: 'next lint'
        },
        dependencies: {
          next: '^14.2.0',
          react: '^18.3.0',
          'react-dom': '^18.3.0',
          ...(db_type === 'supabase' ? { '@supabase/supabase-js': '^2.45.0' } : {}),
          ...(db_type === 'prisma' ? { '@prisma/client': '^5.20.0' } : {})
        },
        devDependencies: {
          typescript: '^5.5.0',
          '@types/react': '^18.3.0',
          '@types/node': '^20.14.0',
          tailwindcss: '^3.4.0',
          postcss: '^8.4.0',
          autoprefixer: '^10.4.0',
          ...(db_type === 'prisma' ? { prisma: '^5.20.0' } : {})
        }
      }, null, 2);

      files['next.config.js'] = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};
module.exports = nextConfig;
`;

      files['tailwind.config.js'] = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: [],
};
`;

      files['postcss.config.js'] = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;

      files['app/globals.css'] = `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground: #0f172a;
  --background: #ffffff;
}

body {
  color: var(--foreground);
  background: var(--background);
}
`;

      files['app/layout.tsx'] = `import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '${name || 'My App'}',
  description: 'Generated by MultiAI Builder',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
`;

      files['app/page.tsx'] = `'use client';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto py-20 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">${name || 'My App'}</h1>
        <p className="text-slate-400 mb-8">Generated by MultiAI Builder • Full-stack ready</p>
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-left text-sm">
          <p className="text-slate-300 mb-2">Prompt asli:</p>
          <p className="text-slate-500">${(prompt || '').replace(/`/g, '\\`').substring(0, 300)}...</p>
        </div>
        <p className="mt-8 text-sm text-slate-500">
          Ganti konten page.tsx ini dengan hasil generate yang lebih lengkap dari MultiAI Builder.
        </p>
      </div>
    </main>
  );
}
`;

      if (db_type === 'supabase') {
        files['lib/supabase.ts'] = `import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
`;

        files['.env.example'] = `NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
`;

        files['app/api/items/route.ts'] = `import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase.from('items').select('*').limit(50);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { data, error } = await supabase.from('items').insert(body).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
`;
      }

      if (db_type === 'prisma') {
        files['prisma/schema.prisma'] = `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Item {
  id        String   @id @default(cuid())
  title     String
  content   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
`;

        files['lib/prisma.ts'] = `import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
`;

        files['.env.example'] = `DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
`;

        files['app/api/items/route.ts'] = `import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const items = await prisma.item.findMany({ take: 50, orderBy: { createdAt: 'desc' } });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const body = await request.json();
  const item = await prisma.item.create({ data: { title: body.title, content: body.content } });
  return NextResponse.json(item, { status: 201 });
}
`;
      }

      files['vercel.json'] = JSON.stringify({
        framework: 'nextjs'
      }, null, 2);

      files['README.md'] = `# ${name || 'My App'}

Generated by **MultiAI Builder**.

## Quick Start

\
\
\
npm install
cp .env.example .env.local
# Isi environment variables
npm run dev
\
\
\

## Deploy ke Vercel

1. Push ke GitHub
2. Import project di [vercel.com](https://vercel.com/new)
3. Set environment variables
4. Deploy!

Atau pakai CLI:
\
\
\
npx vercel --prod
\
\
\
`;
    } else {
      // Simple static HTML export
      files['index.html'] = code_html || '<h1>Empty</h1>';
      files['styles.css'] = code_css || '';
      files['script.js'] = code_js || '';
      files['vercel.json'] = JSON.stringify({
        version: 2,
        builds: [{ src: 'index.html', use: '@vercel/static' }]
      }, null, 2);
      files['README.md'] = `# Static Site\n\nDeploy: \
\
\
npx vercel --prod\n\
\
\
`;
    }

    res.json({ files, message: 'Vercel-ready structure generated' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n🚀 MultiAI Builder running at http://localhost:${PORT}`);
    console.log(`   API: http://localhost:${PORT}/api/health\n`);
  });
}

module.exports = app;
