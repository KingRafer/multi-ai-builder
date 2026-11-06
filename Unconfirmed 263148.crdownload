/**
 * MultiAI Office v3 PRO — Professional Game Mode
 * Polished virtual office + multi-agent pipeline
 */

(function () {
  'use strict';

  const AGENTS = [
    {
      id: 'planner',
      name: 'Nova',
      role: 'Planner',
      emoji: '🧠',
      color: '#818cf8',
      desk: { x: 16, y: 52 },
      level: 5,
      xp: 320,
      xpMax: 500,
      status: 'idle',
      personality: 'Strategis & detail-oriented. Memecah requirement jadi arsitektur yang jelas.',
      skills: ['Requirement Analysis', 'Architecture', 'User Stories']
    },
    {
      id: 'designer',
      name: 'Luna',
      role: 'UI/UX Designer',
      emoji: '🎨',
      color: '#f472b6',
      desk: { x: 36, y: 52 },
      level: 4,
      xp: 210,
      xpMax: 400,
      status: 'idle',
      personality: 'Kreatif & estetik. Fokus pada visual hierarchy dan experience.',
      skills: ['Wireframe', 'Design System', 'Tailwind']
    },
    {
      id: 'developer',
      name: 'Kai',
      role: 'Full-Stack Dev',
      emoji: '💻',
      color: '#34d399',
      desk: { x: 56, y: 52 },
      level: 6,
      xp: 480,
      xpMax: 600,
      status: 'idle',
      personality: 'Cepat & solid. Menulis kode bersih, component-based, production-ready.',
      skills: ['React/Next', 'API', 'Database']
    },
    {
      id: 'reviewer',
      name: 'Rex',
      role: 'Code Reviewer',
      emoji: '🔍',
      color: '#fbbf24',
      desk: { x: 76, y: 52 },
      level: 5,
      xp: 350,
      xpMax: 500,
      status: 'idle',
      personality: 'Teliti & kritis. Menemukan bug, security issue, dan improvement.',
      skills: ['Code Quality', 'Security', 'Best Practice']
    },
    {
      id: 'qa',
      name: 'Aria',
      role: 'QA Tester',
      emoji: '🧪',
      color: '#22d3ee',
      desk: { x: 26, y: 26 },
      level: 4,
      xp: 180,
      xpMax: 400,
      status: 'idle',
      personality: 'Perfeksionis. Memastikan fitur berjalan sesuai acceptance criteria.',
      skills: ['Test Cases', 'Edge Cases', 'UX Validation']
    }
  ];

  let state = {
    mode: 'office',
    currentProject: null,
    codes: { html: '', css: '', js: '', api: '', db: '' },
    activeTab: 'html',
    isGenerating: false,
    energy: 100,
    keys: { grok: '', openai: '', claude: '', gemini: '', openrouter: '' },
    demoMode: true,
    selectedAgent: null,
    monaco: null,
    progress: 0
  };

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  function init() {
    loadKeys();
    renderAgentsList();
    renderOfficeDesks();
    setupEventListeners();
    initMonaco();
    logActivity('Sistem', 'Kantor siap. Tunggu briefing dari CEO.');
    updateEnergyUI();
    spawnAmbientParticles();
  }

  function loadKeys() {
    try {
      const saved = localStorage.getItem('multiai_keys');
      if (saved) {
        state.keys = { ...state.keys, ...JSON.parse(saved) };
        state.demoMode = !Object.values(state.keys).some(k => k && k.length > 5);
      }
    } catch (e) {}
  }

  function saveKeysToStorage() {
    localStorage.setItem('multiai_keys', JSON.stringify(state.keys));
  }

  function renderOfficeDesks() {
    const container = $('#desksContainer');
    if (!container) return;
    container.innerHTML = '';

    AGENTS.forEach(agent => {
      const unit = document.createElement('div');
      unit.className = 'desk-unit';
      unit.id = 'desk-' + agent.id;
      unit.style.left = agent.desk.x + '%';
      unit.style.top = agent.desk.y + '%';
      unit.dataset.agent = agent.id;

      unit.innerHTML =
        '<div class="desk-base"></div>' +
        '<div class="desk-monitor-stand"></div>' +
        '<div class="desk-monitor"><div class="desk-monitor-screen"></div></div>' +
        '<div class="agent-char" style="border-color:' + agent.color + '; background:' + agent.color + '18;">' +
          agent.emoji +
          '<span class="status-ring idle" id="ring-' + agent.id + '"></span>' +
        '</div>' +
        '<div class="speech" id="bubble-' + agent.id + '"></div>' +
        '<div class="name-tag">' + agent.name + '</div>';

      unit.addEventListener('click', function () { selectAgent(agent.id); });
      container.appendChild(unit);
    });
  }

  function renderAgentsList() {
    const list = $('#agentsList');
    if (!list) return;
    list.innerHTML = AGENTS.map(function (a) {
      var statusDot =
        a.status === 'working' ? 'bg-emerald-400 animate-pulse' :
        a.status === 'done' ? 'bg-indigo-400' : 'bg-slate-600';
      var rowClass =
        (a.status === 'working' ? 'working ' : '') +
        (state.selectedAgent === a.id ? 'active' : '');
      return (
        '<div class="agent-row ' + rowClass + '" data-agent="' + a.id + '">' +
          '<div class="w-9 h-9 rounded-full flex items-center justify-center text-lg shrink-0" style="background:' + a.color + '18;border:2px solid ' + a.color + '">' + a.emoji + '</div>' +
          '<div class="flex-1 min-w-0">' +
            '<div class="flex items-center justify-between">' +
              '<span class="text-xs font-semibold text-slate-200 truncate">' + a.name + '</span>' +
              '<span class="text-[9px] text-slate-500">Lv.' + a.level + '</span>' +
            '</div>' +
            '<div class="text-[10px] text-slate-500 truncate">' + a.role + '</div>' +
            '<div class="xp-track mt-1"><div class="xp-fill" style="width:' + Math.min(100, (a.xp / a.xpMax) * 100) + '%"></div></div>' +
          '</div>' +
          '<div class="w-2 h-2 rounded-full shrink-0 ' + statusDot + '"></div>' +
        '</div>'
      );
    }).join('');

    list.querySelectorAll('[data-agent]').forEach(function (el) {
      el.addEventListener('click', function () { selectAgent(el.dataset.agent); });
    });
  }

  function selectAgent(id) {
    state.selectedAgent = id;
    var agent = AGENTS.find(function (a) { return a.id === id; });
    if (!agent) return;

    $$('.desk-unit').forEach(function (d) { d.classList.remove('active'); });
    var desk = $('#desk-' + id);
    if (desk) desk.classList.add('active');

    renderAgentsList();
    showAgentDetail(agent);
  }

  function showAgentDetail(agent) {
    var panel = $('#agentDetail');
    if (!panel) return;
    var statusText =
      agent.status === 'idle' ? 'Siaga' :
      agent.status === 'working' ? 'Sedang bekerja...' : 'Selesai';
    var statusColor =
      agent.status === 'working' ? 'bg-emerald-400' :
      agent.status === 'done' ? 'bg-indigo-400' : 'bg-slate-500';

    panel.innerHTML =
      '<div class="space-y-3">' +
        '<div class="flex items-center gap-3">' +
          '<div class="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" style="background:' + agent.color + '18;border:3px solid ' + agent.color + '">' + agent.emoji + '</div>' +
          '<div><h4 class="font-bold text-slate-100">' + agent.name + '</h4><p class="text-xs text-slate-400">' + agent.role + ' • Level ' + agent.level + '</p></div>' +
        '</div>' +
        '<p class="text-xs text-slate-400 leading-relaxed">' + agent.personality + '</p>' +
        '<div><div class="text-[10px] text-slate-500 mb-1.5">Skills</div><div class="flex flex-wrap gap-1">' +
          agent.skills.map(function (s) {
            return '<span class="px-2 py-0.5 rounded-full bg-slate-800/80 text-[10px] text-slate-300 border border-slate-700/50">' + s + '</span>';
          }).join('') +
        '</div></div>' +
        '<div><div class="flex justify-between text-[10px] text-slate-500 mb-1"><span>XP</span><span>' + agent.xp + ' / ' + agent.xpMax + '</span></div>' +
          '<div class="xp-track"><div class="xp-fill" style="width:' + Math.min(100, (agent.xp / agent.xpMax) * 100) + '%"></div></div></div>' +
        '<div class="pt-2 border-t border-slate-800/60"><div class="text-[10px] text-slate-500 mb-1">Status</div>' +
          '<div class="flex items-center gap-2"><span class="w-2 h-2 rounded-full ' + statusColor + '"></span><span class="text-xs">' + statusText + '</span></div></div>' +
      '</div>';
  }

  function logActivity(who, msg) {
    var log = $('#activityLog');
    if (!log) return;
    var time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    var entry = document.createElement('div');
    entry.className = 'activity-entry';
    entry.innerHTML = '<span class="text-slate-600 shrink-0">' + time + '</span><span class="text-indigo-300 font-medium shrink-0">' + who + '</span><span class="text-slate-400">' + msg + '</span>';
    log.prepend(entry);
    if (log.children.length > 50) log.lastChild.remove();
  }

  function showBubble(agentId, text, duration) {
    duration = duration || 2600;
    var bubble = $('#bubble-' + agentId);
    if (!bubble) return;
    bubble.textContent = text;
    bubble.classList.add('show');
    setTimeout(function () { bubble.classList.remove('show'); }, duration);
  }

  function setAgentStatus(id, status) {
    var agent = AGENTS.find(function (a) { return a.id === id; });
    if (!agent) return;
    agent.status = status;

    var desk = $('#desk-' + id);
    if (desk) {
      desk.classList.toggle('working', status === 'working');
      desk.classList.toggle('done', status === 'done');
      desk.classList.toggle('active', status === 'working' || state.selectedAgent === id);
    }

    var ring = $('#ring-' + id);
    if (ring) ring.className = 'status-ring ' + status;

    var chip = document.querySelector('.phase-chip[data-phase="' + id + '"]');
    if (chip) {
      chip.classList.remove('active', 'done');
      if (status === 'working') chip.classList.add('active');
      if (status === 'done') chip.classList.add('done');
    }

    renderAgentsList();
    if (state.selectedAgent === id) showAgentDetail(agent);
  }

  function addXP(id, amount) {
    var agent = AGENTS.find(function (a) { return a.id === id; });
    if (!agent) return;
    agent.xp += amount;

    var desk = $('#desk-' + id);
    if (desk) {
      var popup = document.createElement('div');
      popup.className = 'xp-popup';
      popup.textContent = '+' + amount + ' XP';
      popup.style.left = '50%';
      popup.style.bottom = '90%';
      popup.style.transform = 'translateX(-50%)';
      desk.appendChild(popup);
      setTimeout(function () { popup.remove(); }, 1200);
    }

    if (agent.xp >= agent.xpMax) {
      agent.level += 1;
      agent.xp = agent.xp - agent.xpMax;
      agent.xpMax = Math.floor(agent.xpMax * 1.25);
      logActivity(agent.name, 'Naik level! Sekarang Level ' + agent.level + ' 🎉');
      showBubble(id, 'Level Up! Lv.' + agent.level);
    }
    renderAgentsList();
  }

  function updateEnergyUI() {
    var el = $('#energyValue');
    var fill = $('#energyFill');
    if (el) el.textContent = state.energy;
    if (fill) fill.style.width = state.energy + '%';
  }

  function setProgress(pct, label) {
    state.progress = pct;
    var bar = $('#workProgress');
    var fill = $('#progressFill');
    var lbl = $('#progressLabel');
    if (bar) bar.classList.toggle('hidden', pct <= 0 || pct >= 100);
    if (fill) fill.style.width = Math.min(100, pct) + '%';
    if (lbl) lbl.textContent = label || '';
    if (pct >= 100) {
      setTimeout(function () { if (bar) bar.classList.add('hidden'); }, 800);
    }
  }

  function spawnAmbientParticles() {
    var stage = $('#officeCanvas');
    if (!stage) return;
    setInterval(function () {
      if (Math.random() > 0.4) return;
      var p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.top = Math.random() * 100 + '%';
      var colors = ['#818cf8', '#a855f7', '#34d399', '#22d3ee'];
      p.style.background = colors[Math.floor(Math.random() * 4)];
      stage.appendChild(p);
      p.animate([
        { opacity: 0, transform: 'translateY(0) scale(0.5)' },
        { opacity: 0.6, transform: 'translateY(-30px) scale(1)' },
        { opacity: 0, transform: 'translateY(-60px) scale(0.3)' }
      ], { duration: 2800, easing: 'ease-out' }).onfinish = function () { p.remove(); };
    }, 900);
  }

  async function startOfficeWork() {
    var prompt = $('#promptInput').value.trim();
    if (!prompt) {
      alert('Tulis briefing project dulu, CEO!');
      return;
    }
    if (state.isGenerating) return;
    if (state.energy < 15) {
      alert('Energy habis! Refresh halaman untuk regenerasi.');
      return;
    }

    state.isGenerating = true;
    state.energy = Math.max(0, state.energy - 15);
    updateEnergyUI();
    $('#btnGenerate').disabled = true;
    $('#btnGenerate').innerHTML = '<i class="fas fa-spinner fa-spin"></i> Tim sedang bekerja...';
    $('#officeStatus').textContent = 'Project aktif — agen bekerja';

    var framework = $('#frameworkSelect').value;
    var style = $('#styleSelect').value;
    var fullStack = $('#fullStackToggle').checked;
    var dbType = fullStack ? $('#dbSelect').value : 'none';

    AGENTS.forEach(function (a) {
      setAgentStatus(a.id, 'idle');
      var chip = document.querySelector('.phase-chip[data-phase="' + a.id + '"]');
      if (chip) chip.classList.remove('active', 'done');
    });
    $('#whiteboardText').textContent = prompt.substring(0, 55) + (prompt.length > 55 ? '…' : '');
    setProgress(2, 'Briefing diterima...');

    logActivity('CEO', 'Briefing dikirim ke seluruh tim!');
    showBubble('planner', 'Menerima briefing...');

    try {
      setProgress(12, 'Nova menganalisis requirement...');
      await workPhase('planner', 'Menganalisis requirement & arsitektur...', 1700);
      await runAgent('planner', prompt, framework, style, fullStack, dbType);
      showBubble('planner', 'Arsitektur siap!');
      addXP('planner', 40);
      setAgentStatus('planner', 'done');
      setProgress(28, 'Plan selesai');

      setProgress(35, 'Luna mendesain UI/UX...');
      await workPhase('designer', 'Mendesain UI/UX berdasarkan plan...', 1900);
      await runAgent('designer', prompt, framework, style, fullStack, dbType);
      showBubble('designer', 'Design system siap!');
      addXP('designer', 45);
      setAgentStatus('designer', 'done');
      setProgress(48, 'Design selesai');

      setProgress(55, 'Kai menulis kode production...');
      await workPhase('developer', 'Menulis kode production-ready...', 2600);
      var code = await runAgent('developer', prompt, framework, style, fullStack, dbType);
      showBubble('developer', 'Kode selesai!');
      addXP('developer', 70);
      setAgentStatus('developer', 'done');
      setProgress(75, 'Code selesai');

      setProgress(82, 'Rex mereview kode...');
      await workPhase('reviewer', 'Mereview kode & security...', 1500);
      await runAgent('reviewer', prompt, framework, style, fullStack, dbType);
      showBubble('reviewer', 'Review OK ✓');
      addXP('reviewer', 35);
      setAgentStatus('reviewer', 'done');
      setProgress(90, 'Review selesai');

      setProgress(94, 'Aria menjalankan test...');
      await workPhase('qa', 'Validasi fitur & edge cases...', 1300);
      showBubble('qa', 'Semua test passed!');
      addXP('qa', 30);
      setAgentStatus('qa', 'done');
      setProgress(100, 'Project selesai! 🎉');

      state.codes = code;
      state.currentProject = {
        name: extractProjectName(prompt),
        prompt: prompt,
        framework: framework,
        style: style,
        fullStack: fullStack,
        dbType: dbType,
        codes: Object.assign({}, code)
      };

      applyPreview();
      updateEditor();
      enableActionButtons();
      logActivity('Sistem', '🎉 Project selesai! Preview & code siap.');
      $('#officeStatus').textContent = 'Project selesai — siap export / deploy';
      $('#whiteboardText').textContent = '✅ ' + state.currentProject.name;

      AGENTS.forEach(function (a) {
        var desk = $('#desk-' + a.id);
        if (desk) desk.classList.add('done');
      });

    } catch (err) {
      console.error(err);
      logActivity('Error', err.message || 'Gagal generate');
      alert('Gagal: ' + (err.message || 'Unknown error'));
      setProgress(0);
    } finally {
      state.isGenerating = false;
      $('#btnGenerate').disabled = false;
      $('#btnGenerate').innerHTML = '<i class="fas fa-play"></i> Mulai Kerja Kantor';
    }
  }

  function workPhase(agentId, message, ms) {
    return new Promise(function (resolve) {
      setAgentStatus(agentId, 'working');
      showBubble(agentId, message.length > 30 ? message.substring(0, 28) + '…' : message);
      var agent = AGENTS.find(function (a) { return a.id === agentId; });
      logActivity(agent.name, message);
      setTimeout(resolve, ms);
    });
  }

  async function runAgent(role, prompt, framework, style, fullStack, dbType) {
    if (state.demoMode || !hasAnyKey()) {
      return generateDemoCode(role, prompt, framework, style, fullStack, dbType);
    }
    try {
      return await callLLM(role, prompt, framework, style, fullStack, dbType);
    } catch (e) {
      logActivity('Sistem', 'API gagal, fallback ke demo mode.');
      return generateDemoCode(role, prompt, framework, style, fullStack, dbType);
    }
  }

  function hasAnyKey() {
    return Object.values(state.keys).some(function (k) { return k && k.length > 8; });
  }

  async function callLLM(role, prompt, framework, style, fullStack, dbType) {
    var systemPrompts = {
      planner: 'You are a senior product planner. Analyze the user request and output a concise architecture plan in JSON: {pages:[], features:[], dataModels:[], apiEndpoints:[]}. Keep it short.',
      designer: 'You are a UI/UX designer. Based on the plan, describe the design system briefly in JSON.',
      developer: 'You are an expert full-stack developer. Generate complete, production-ready code. Output ONLY valid JSON with keys: html, css, js, api (optional), db (optional).\nFramework: ' + framework + '. Style: ' + style + '. Full-stack: ' + fullStack + '. DB: ' + dbType + '.\nFor html framework return a single-page beautiful HTML with Tailwind CDN. Make it look professional, modern, and complete.',
      reviewer: 'You are a code reviewer. Improve the given code slightly for quality and security. Return the improved code in same JSON format.'
    };

    if (state.keys.openrouter) {
      var res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + state.keys.openrouter,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'MultiAI Office'
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompts[role] || systemPrompts.developer },
            { role: 'user', content: 'User request: ' + prompt + '\n\nRole: ' + role + '. Respond with pure JSON only.' }
          ],
          temperature: 0.5,
          max_tokens: 4000
        })
      });
      if (!res.ok) throw new Error('OpenRouter error ' + res.status);
      var data = await res.json();
      var content = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '';
      return parseCodeResponse(content, framework, style, fullStack, dbType, prompt);
    }
    throw new Error('No usable API key');
  }

  function parseCodeResponse(text, framework, style, fullStack, dbType, prompt) {
    try {
      var match = text.match(/\{[\s\S]*\}/);
      if (match) {
        var obj = JSON.parse(match[0]);
        return {
          html: obj.html || generateDemoHTML(prompt, style),
          css: obj.css || '',
          js: obj.js || '',
          api: obj.api || '',
          db: obj.db || ''
        };
      }
    } catch (e) {}
    return generateDemoCode('developer', prompt, framework, style, fullStack, dbType);
  }

  function generateDemoCode(role, prompt, framework, style, fullStack, dbType) {
    if (role !== 'developer' && role !== 'reviewer') {
      return { html: '', css: '', js: '', api: '', db: '' };
    }
    return {
      html: generateDemoHTML(prompt, style),
      css: '/* Generated by MultiAI Office — ' + style + ' */\n:root { --primary: #6366f1; }\nbody { margin:0; font-family: Inter, system-ui, sans-serif; }',
      js: "console.log('App ready — built by MultiAI Office agents');\ndocument.querySelectorAll('[data-action]').forEach(btn => {\n  btn.addEventListener('click', () => alert('Fitur demo: ' + btn.dataset.action));\n});",
      api: fullStack ? '// API Routes (Next.js example)\nexport async function GET() {\n  return Response.json({ items: [] });\n}\nexport async function POST(req) {\n  const body = await req.json();\n  return Response.json({ ok: true, data: body }, { status: 201 });\n}' : '',
      db: fullStack && dbType !== 'none' ? '// Database schema (' + dbType + ')\n// model Item {\n//   id String @id @default(cuid())\n//   title String\n//   createdAt DateTime @default(now())\n// }' : ''
    };
  }

  function generateDemoHTML(prompt, style) {
    var title = extractProjectName(prompt);
    var isDark = style !== 'corporate';
    var bg = isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900';
    var card = isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm';
    var accent = 'from-indigo-500 to-purple-600';
    var features = ['Dashboard Analytics', 'Manajemen Data', 'Kolaborasi Tim', 'Integrasi API', 'Keamanan Tinggi', 'Deploy Instant'];
    var icons = ['📊','📁','👥','🔌','🔒','🚀'];
    var featureCards = features.map(function (f, i) {
      return '<div class="p-6 rounded-2xl border ' + card + ' hover:border-indigo-500/50 transition">' +
        '<div class="w-10 h-10 rounded-xl bg-gradient-to-br ' + accent + ' flex items-center justify-center text-white mb-4 text-lg">' + icons[i] + '</div>' +
        '<h3 class="font-semibold mb-2">' + f + '</h3>' +
        '<p class="text-sm opacity-60">Fitur profesional yang dihasilkan secara otomatis oleh multi-agent AI team.</p></div>';
    }).join('');

    return '<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>' + title + '</title>' +
      '<script src="https://cdn.tailwindcss.com"><\/script>' +
      '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">' +
      '<style>body{font-family:Inter,system-ui,sans-serif}</style></head>' +
      '<body class="' + bg + ' min-h-screen">' +
      '<nav class="border-b ' + (isDark ? 'border-slate-800' : 'border-slate-200') + ' sticky top-0 backdrop-blur-md bg-opacity-80 z-50">' +
      '<div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">' +
      '<div class="font-bold text-xl flex items-center gap-2"><div class="w-8 h-8 rounded-lg bg-gradient-to-br ' + accent + ' flex items-center justify-center text-white text-sm">AI</div>' + title + '</div>' +
      '<div class="flex gap-4 text-sm"><a href="#features" class="opacity-70 hover:opacity-100">Fitur</a>' +
      '<button data-action="login" class="px-4 py-2 rounded-lg bg-gradient-to-r ' + accent + ' text-white font-medium">Mulai Gratis</button></div></div></nav>' +
      '<section class="max-w-6xl mx-auto px-6 py-20 text-center">' +
      '<div class="inline-block px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 mb-6">Dibuat oleh MultiAI Office Agents</div>' +
      '<h1 class="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">' + title + '<br/><span class="bg-gradient-to-r ' + accent + ' bg-clip-text text-transparent">Lebih Cepat. Lebih Pintar.</span></h1>' +
      '<p class="text-lg opacity-60 max-w-2xl mx-auto mb-10">' + prompt.substring(0, 140) + (prompt.length > 140 ? '...' : '') + '</p>' +
      '<div class="flex gap-4 justify-center">' +
      '<button data-action="cta" class="px-8 py-3.5 rounded-xl bg-gradient-to-r ' + accent + ' text-white font-semibold shadow-lg shadow-indigo-500/30 hover:scale-105 transition">Coba Sekarang</button>' +
      '<button data-action="demo" class="px-8 py-3.5 rounded-xl border ' + (isDark ? 'border-slate-700' : 'border-slate-300') + ' font-semibold hover:bg-slate-800/30 transition">Lihat Demo</button></div></section>' +
      '<section id="features" class="max-w-6xl mx-auto px-6 py-16"><h2 class="text-3xl font-bold text-center mb-12">Fitur Unggulan</h2>' +
      '<div class="grid md:grid-cols-3 gap-6">' + featureCards + '</div></section>' +
      '<section class="max-w-6xl mx-auto px-6 py-16"><div class="rounded-3xl p-10 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/20 text-center">' +
      '<h2 class="text-3xl font-bold mb-4">Siap naik level?</h2><p class="opacity-70 mb-8">Mulai gratis, upgrade kapan saja.</p>' +
      '<button data-action="signup" class="px-8 py-3.5 rounded-xl bg-white text-slate-900 font-semibold hover:scale-105 transition">Buat Akun Gratis</button></div></section>' +
      '<footer class="border-t ' + (isDark ? 'border-slate-800' : 'border-slate-200') + ' py-10 text-center text-sm opacity-50">© ' + new Date().getFullYear() + ' ' + title + ' • Generated by MultiAI Office</footer></body></html>';
  }

  function extractProjectName(prompt) {
    var words = prompt.split(/\s+/).slice(0, 4).join(' ');
    return words.charAt(0).toUpperCase() + words.slice(1).replace(/[^\w\s]/g, '') || 'My Awesome App';
  }

  function applyPreview() {
    var frame = $('#previewFrame');
    var placeholder = $('#previewPlaceholder');
    if (!frame) return;
    if (state.codes.html) {
      frame.srcdoc = state.codes.html;
      frame.classList.remove('hidden');
      if (placeholder) placeholder.classList.add('hidden');
    }
  }

  function updateEditor() {
    if (!state.monaco) return;
    var map = { html: state.codes.html, css: state.codes.css, js: state.codes.js, api: state.codes.api, db: state.codes.db };
    state.monaco.setValue(map[state.activeTab] || '');
  }

  function initMonaco() {
    if (typeof require === 'undefined') return;
    require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' } });
    require(['vs/editor/editor.main'], function () {
      state.monaco = monaco.editor.create(document.getElementById('monacoEditor'), {
        value: '// Code akan muncul di sini setelah generate',
        language: 'html',
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: { enabled: false },
        fontSize: 13,
        lineNumbers: 'on',
        scrollBeyondLastLine: false
      });
    });
  }

  function enableActionButtons() {
    ['#btnSave', '#btnExportZip', '#btnDeploy', '#btnIterate'].forEach(function (sel) {
      var el = $(sel);
      if (el) el.disabled = false;
    });
  }

  async function exportZip() {
    if (!state.currentProject) return;
    var zip = new JSZip();
    var name = (state.currentProject.name || 'project').toLowerCase().replace(/\s+/g, '-');
    zip.file('index.html', state.codes.html || '');
    zip.file('styles.css', state.codes.css || '');
    zip.file('script.js', state.codes.js || '');
    if (state.codes.api) zip.file('api-example.js', state.codes.api);
    if (state.codes.db) zip.file('schema.example', state.codes.db);
    zip.file('README.md', '# ' + state.currentProject.name + '\n\nGenerated by MultiAI Office\n\nPrompt: ' + state.currentProject.prompt + '\n');
    var blob = await zip.generateAsync({ type: 'blob' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name + '.zip';
    a.click();
    logActivity('Sistem', 'ZIP berhasil diunduh');
  }

  function saveProject() {
    if (!state.currentProject) return;
    var projects = JSON.parse(localStorage.getItem('multiai_projects') || '[]');
    var p = {
      id: Date.now().toString(36),
      name: state.currentProject.name,
      prompt: state.currentProject.prompt,
      framework: state.currentProject.framework,
      style: state.currentProject.style,
      fullStack: state.currentProject.fullStack,
      dbType: state.currentProject.dbType,
      codes: Object.assign({}, state.codes),
      savedAt: new Date().toISOString()
    };
    projects.unshift(p);
    localStorage.setItem('multiai_projects', JSON.stringify(projects.slice(0, 30)));
    logActivity('Sistem', 'Project disimpan ke localStorage');
    alert('Project disimpan!');
  }

  function openProjects() {
    var list = $('#projectsList');
    var projects = JSON.parse(localStorage.getItem('multiai_projects') || '[]');
    list.innerHTML = projects.length ? projects.map(function (p) {
      return '<div class="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-indigo-500/40">' +
        '<div><div class="font-medium text-sm">' + p.name + '</div>' +
        '<div class="text-[10px] text-slate-500">' + new Date(p.savedAt).toLocaleString('id-ID') + ' • ' + p.framework + '</div></div>' +
        '<button class="load-project px-3 py-1.5 rounded-lg bg-indigo-600 text-xs" data-id="' + p.id + '">Load</button></div>';
    }).join('') : '<p class="text-slate-500 text-sm text-center py-8">Belum ada project tersimpan</p>';

    list.querySelectorAll('.load-project').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var p = projects.find(function (x) { return x.id === btn.dataset.id; });
        if (p) {
          state.currentProject = p;
          state.codes = p.codes;
          $('#promptInput').value = p.prompt;
          applyPreview();
          updateEditor();
          enableActionButtons();
          $('#projectsModal').classList.add('hidden');
          $('#projectsModal').classList.remove('flex');
          logActivity('Sistem', 'Loaded: ' + p.name);
        }
      });
    });

    $('#projectsModal').classList.remove('hidden');
    $('#projectsModal').classList.add('flex');
  }

  function setupEventListeners() {
    $('#btnGenerate').addEventListener('click', startOfficeWork);

    $('#fullStackToggle').addEventListener('change', function (e) {
      $('#dbOptions').classList.toggle('hidden', !e.target.checked);
    });

    $('#modeOffice').addEventListener('click', function () {
      state.mode = 'office';
      $('#modeOffice').classList.add('active');
      $('#modeClassic').classList.remove('active');
      $('#officeView').classList.remove('hidden');
      $('#classicView').classList.add('hidden');
    });
    $('#modeClassic').addEventListener('click', function () {
      state.mode = 'classic';
      $('#modeClassic').classList.add('active');
      $('#modeOffice').classList.remove('active');
      $('#classicView').classList.remove('hidden');
      $('#officeView').classList.add('hidden');
      if (state.codes.html) applyPreview();
      updateEditor();
    });

    $$('.code-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        $$('.code-tab').forEach(function (t) {
          t.classList.remove('tab-active');
          t.classList.add('bg-slate-800', 'text-slate-400');
        });
        tab.classList.add('tab-active');
        tab.classList.remove('bg-slate-800', 'text-slate-400');
        var id = tab.id.replace('tab', '').toLowerCase();
        state.activeTab = id === 'html' ? 'html' : id;
        if (state.monaco) {
          var langMap = { html: 'html', css: 'css', js: 'javascript', api: 'javascript', db: 'plaintext' };
          monaco.editor.setModelLanguage(state.monaco.getModel(), langMap[state.activeTab] || 'html');
          updateEditor();
        }
      });
    });

    $('#btnSettings').addEventListener('click', function () {
      $('#keyGrok').value = state.keys.grok || '';
      $('#keyOpenai').value = state.keys.openai || '';
      $('#keyClaude').value = state.keys.claude || '';
      $('#keyGemini').value = state.keys.gemini || '';
      $('#keyOpenRouter').value = state.keys.openrouter || '';
      $('#settingsModal').classList.remove('hidden');
      $('#settingsModal').classList.add('flex');
    });
    $('#closeSettings').addEventListener('click', function () {
      $('#settingsModal').classList.add('hidden');
      $('#settingsModal').classList.remove('flex');
    });
    $('#saveKeys').addEventListener('click', function () {
      state.keys = {
        grok: $('#keyGrok').value.trim(),
        openai: $('#keyOpenai').value.trim(),
        claude: $('#keyClaude').value.trim(),
        gemini: $('#keyGemini').value.trim(),
        openrouter: $('#keyOpenRouter').value.trim()
      };
      saveKeysToStorage();
      state.demoMode = !hasAnyKey();
      $('#settingsModal').classList.add('hidden');
      $('#settingsModal').classList.remove('flex');
      logActivity('Sistem', state.demoMode ? 'Mode Demo aktif' : 'API Keys tersimpan');
    });
    $('#useDemo').addEventListener('click', function () {
      state.demoMode = true;
      $('#settingsModal').classList.add('hidden');
      $('#settingsModal').classList.remove('flex');
      logActivity('Sistem', 'Mode Demo diaktifkan');
    });

    $('#btnProjects').addEventListener('click', openProjects);
    $('#closeProjects').addEventListener('click', function () {
      $('#projectsModal').classList.add('hidden');
      $('#projectsModal').classList.remove('flex');
    });

    $('#btnSave').addEventListener('click', saveProject);
    $('#btnExportZip').addEventListener('click', exportZip);
    $('#btnDeploy').addEventListener('click', function () {
      alert('Deploy: Download ZIP lalu extract → npm install → npx vercel --prod\natau push ke GitHub & import di Vercel.');
      exportZip();
    });

    var btnDesktop = $('#btnDesktop');
    var btnTablet = $('#btnTablet');
    var btnMobile = $('#btnMobile');
    if (btnDesktop) btnDesktop.addEventListener('click', function () {
      var f = $('#previewFrame');
      if (f) { f.style.width = '100%'; f.style.maxWidth = '100%'; }
    });
    if (btnTablet) btnTablet.addEventListener('click', function () {
      var f = $('#previewFrame');
      if (f) { f.style.width = '768px'; f.style.maxWidth = '100%'; }
    });
    if (btnMobile) btnMobile.addEventListener('click', function () {
      var f = $('#previewFrame');
      if (f) { f.style.width = '375px'; f.style.maxWidth = '100%'; }
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
