/* ============================================================
   MUZI STUDIO — app.js
   Logic điều khiển UI: tab, select, badge, render
   ============================================================ */

// ── STATE ─────────────────────────────────────────────────────────────────────
let currentMode = 'business';
let lang        = 'vi';
let openCS      = null;
const $ = id => document.getElementById(id);

// ── TAB NAV ───────────────────────────────────────────────────────────────────
function goTab(n) {
  document.querySelectorAll('.tab-pane').forEach(p => {
    p.classList.remove('active');
    p.style.display = 'none';
  });
  const pane = $('pane-' + n);
  if (pane) { pane.classList.add('active'); pane.style.display = 'flex'; }
  document.querySelectorAll('.tab-btn').forEach(b =>
    b.classList.toggle('active', parseInt(b.dataset.tab) === n)
  );
  $('progress-fill').style.width = (n === 0 ? 0 : Math.round(n / 10 * 100)) + '%';
}

function setLang(l) {
  lang = l;
  ['lang-vi','lang-vi2'].forEach(id => { const e=$(id); if(e) e.classList.toggle('active', l==='vi'); });
  ['lang-en','lang-en2'].forEach(id => { const e=$(id); if(e) e.classList.toggle('active', l==='en'); });
}

function setMode(mode) {
  currentMode = mode;
  $('mode-biz').classList.toggle('active', mode === 'business');
  $('mode-pod').classList.toggle('active', mode === 'podcast');
  $('sum-mode').textContent = mode === 'business' ? 'Kinh doanh' : 'Podcast';
  renderAll();
}

// ── CUSTOM SELECT ─────────────────────────────────────────────────────────────
function toggleCS(id) {
  const wrap    = $(id);
  const trigger = wrap.querySelector('.cs-trigger');
  const drop    = wrap.querySelector('.cs-dropdown');
  const wasOpen = drop.classList.contains('open');
  closeAllCS();
  if (!wasOpen) { trigger.classList.add('open'); drop.classList.add('open'); openCS = id; }
}

function closeAllCS() {
  document.querySelectorAll('.cs-trigger').forEach(t => t.classList.remove('open'));
  document.querySelectorAll('.cs-dropdown').forEach(d => d.classList.remove('open'));
  openCS = null;
}
document.addEventListener('click', e => { if (!e.target.closest('.custom-select')) closeAllCS(); });

function buildCS(csId, items, valId, onSelect) {
  const drop = $(csId + '-drop');
  if (!drop) return;
  drop.innerHTML = '';
  items.forEach(item => {
    const opt = document.createElement('div');
    opt.className = 'cs-option';
    opt.textContent = item;
    opt.dataset.value = item;
    opt.onclick = () => {
      drop.querySelectorAll('.cs-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      const v = $(valId);
      v.textContent = item;
      v.classList.remove('placeholder');
      closeAllCS();
      if (onSelect) onSelect(item);
      updateSummary();
    };
    drop.appendChild(opt);
  });
}

// ── BADGES ────────────────────────────────────────────────────────────────────
function toggleBadge(el, cls) {
  const classes = ['sel-y','sel-g','sel-r','sel-b'];
  const isOn = classes.some(c => el.classList.contains(c));
  classes.forEach(c => el.classList.remove(c));
  if (!isOn) el.classList.add(cls);
  updateSummary();
}
function getSelectedBadges(cid) {
  return Array.from($(cid).querySelectorAll('.sel-y,.sel-g,.sel-r,.sel-b')).map(e => e.textContent);
}
function getCSVal(id) {
  const e = $(id + '-val');
  return e && !e.classList.contains('placeholder') ? e.textContent : '';
}

// ── RENDER ALL ────────────────────────────────────────────────────────────────
function renderAll() {
  const d = DATA[currentMode];

  buildCS('cs-goal', d.goals, 'cs-goal-val', null);

  buildCS('cs-topic', Object.keys(d.topics), 'cs-topic-val', topic => {
    buildCS('cs-niche', d.topics[topic] || [], 'cs-niche-val', null);
    $('cs-niche-val').textContent = '— Chọn ngách —';
    $('cs-niche-val').classList.add('placeholder');
  });

  buildCS('cs-formula', d.formulas, 'cs-formula-val', val => {
    $('formula-hint').innerHTML = '<div class="hint-title">' + val + '</div><div class="hint-body">' + (FORMULA_HINTS[val]||'') + '</div>';
  });

  buildCS('cs-style', d.styles, 'cs-style-val', val => {
    $('style-hint').innerHTML = '<div class="hint-title">' + val + '</div><div class="hint-body">' + (STYLE_HINTS[val]||'') + '</div>';
  });

  const dl = DURATION[currentMode] || [];
  buildCS('cs-duration', dl.filter(x => x).map(x => x.label), 'cs-duration-val', val => {
    const d2 = dl.find(x => x && x.label === val);
    const hint = $('duration-hint'), te = $('dur-hint-title'), be = $('dur-hint-body');
    if (d2 && hint && te && be) {
      hint.style.display = 'block';
      te.textContent = val + ' — ~' + d2.words.toLocaleString() + ' từ';
      be.innerHTML = d2.note + (currentMode === 'podcast'
        ? '<br><br><span style="color:var(--accent2);font-size:11px">⚠️ Chỉ tính từ được NÓI ra, không mô tả kỹ thuật.</span>'
        : '');
    }
    updateSummary();
  });

  // badges conversion
  const convEl = $('badges-conversion');
  convEl.innerHTML = '';
  CONVERSION[currentMode].forEach(o => {
    const b = document.createElement('span');
    b.className = 'mbadge'; b.textContent = o;
    b.onclick = () => toggleBadge(b, 'sel-y');
    convEl.appendChild(b);
  });

  // badges output
  const outEl = $('badges-output');
  outEl.innerHTML = '';
  d.outputs.forEach(o => {
    const b = document.createElement('span');
    b.className = 'mbadge'; b.textContent = o;
    b.onclick = () => toggleBadge(b, 'sel-r');
    outEl.appendChild(b);
  });

  // reset placeholders
  ['cs-goal-val','cs-topic-val','cs-niche-val','cs-formula-val','cs-style-val','cs-duration-val'].forEach(id => {
    const e = $(id); if (e) e.classList.add('placeholder');
  });
  $('cs-goal-val').textContent     = '— Chọn mục tiêu —';
  $('cs-topic-val').textContent    = '— Chọn chủ đề —';
  $('cs-niche-val').textContent    = '— Chọn chủ đề trước —';
  $('cs-formula-val').textContent  = '— Chọn công thức —';
  $('cs-style-val').textContent    = '— Chọn phong cách —';
  $('cs-duration-val').textContent = '— Chọn thời lượng —';
  const dh = $('duration-hint'); if (dh) dh.style.display = 'none';

  renderPane10();
  updateSummary();
}

// ── RENDER PANE 10 (mood + substyle đổi theo mode) ────────────────────────────
function renderPane10() {
  const p10 = PANE10[currentMode];
  $('pane10-title').textContent = p10.title;
  $('pane10-desc').textContent  = p10.desc;

  // mood
  const moodEl = $('badges-mood');
  moodEl.innerHTML = '';
  $('label-mood').textContent = p10.moodLabel;
  p10.moods.forEach(item => {
    const b = document.createElement('span');
    b.className = 'mbadge'; b.textContent = item.label;
    if (item.tip) b.title = item.tip;
    b.onclick = () => toggleBadge(b, 'sel-y');
    moodEl.appendChild(b);
  });

  // substyle — podcast có group divider
  const subEl = $('badges-substyle');
  subEl.innerHTML = '';
  $('label-substyle').textContent = p10.subLabel;

  if (currentMode === 'podcast') {
    let lastGroup = '';
    p10.substyles.forEach(item => {
      if (item.group && item.group !== lastGroup) {
        const div = document.createElement('div');
        div.style.cssText = 'width:100%;font-size:9px;font-weight:700;letter-spacing:1.5px;color:var(--muted);text-transform:uppercase;margin:6px 0 2px;padding-top:4px;border-top:1px solid var(--border)';
        div.textContent = item.group;
        if (lastGroup !== '') subEl.appendChild(div);
        lastGroup = item.group;
      }
      const b = document.createElement('span');
      b.className = 'mbadge'; b.textContent = item.label;
      if (item.tip) b.title = item.tip;
      b.onclick = () => toggleBadge(b, 'sel-g');
      subEl.appendChild(b);
    });
  } else {
    p10.substyles.forEach(item => {
      const b = document.createElement('span');
      b.className = 'mbadge';
      b.textContent = typeof item === 'string' ? item : item.label;
      if (item.tip) b.title = item.tip;
      b.onclick = () => toggleBadge(b, 'sel-g');
      subEl.appendChild(b);
    });
  }

  // color badges — chung 2 mode
  const colEl = $('badges-color');
  colEl.innerHTML = '';
  COLOR_BADGES.forEach(({ label, color }) => {
    const b = document.createElement('span');
    b.className = 'mbadge'; b.textContent = label;
    b.style.borderLeft = '3px solid ' + color;
    b.onclick = () => toggleBadge(b, 'sel-r');
    colEl.appendChild(b);
  });
}

// ── SUMMARY STRIP ─────────────────────────────────────────────────────────────
function updateSummary() {
  const set = (id, val) => {
    const e = $(id); if (!e) return;
    e.textContent = val || '—';
    e.className = val ? 'sum-val' : 'sum-empty';
  };
  set('sum-goal',    getCSVal('cs-goal'));
  set('sum-topic',   getCSVal('cs-topic'));
  set('sum-formula', getCSVal('cs-formula'));
  const dur    = getCSVal('cs-duration');
  const dl     = DURATION[currentMode] || [];
  const durObj = dur ? dl.find(d => d && d.label === dur) || null : null;
  set('sum-duration', durObj ? dur + ' (~' + durObj.words.toLocaleString() + ' từ)' : '');
}

// ── NICHE PROMPT ──────────────────────────────────────────────────────────────
function generateNichePrompt() {
  const idea  = $('txt-idea').value.trim();
  const goal  = getCSVal('cs-goal');
  const topic = getCSVal('cs-topic');
  const ml    = currentMode === 'business' ? 'Kinh doanh' : 'Podcast';
  const prompt = `Bạn là chuyên gia chiến lược nội dung ${ml}.

Dựa trên:
💡 Ý TƯỞNG: ${idea||'(Chưa nhập)'}
🎯 MỤC TIÊU: ${goal||'(Chưa chọn)'}
📌 CHỦ ĐỀ: ${topic||'(Chưa chọn)'}

Đề xuất 5–8 NGÁCH NỘI DUNG cụ thể:
[STT]. [Tên ngách]
→ Lý do: ...
→ Hook: "..."`;
  $('niche-prompt-box').style.display = 'block';
  $('niche-prompt-text').innerHTML = syntaxHL(prompt);
  window._nichePrompt = prompt;
}

async function copyNichePrompt(btn) {
  const t = window._nichePrompt || '';
  try { await navigator.clipboard.writeText(t); } catch(e) {}
  btn.textContent = '✅';
  setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
}

// ── INIT ──────────────────────────────────────────────────────────────────────
renderAll();
goTab(0);
