/* ============================================================
   MUZI STUDIO — prompts.js
   Chứa toàn bộ hàm build prompt AI
   Muốn chỉnh prompt → chỉ cần sửa file này
   ============================================================ */

// ── ĐIỀU PHỐI: gọi đúng builder theo loại output ────────────────────────────
function generatePrompts() {
  const idea      = $('txt-idea').value.trim();
  const goal      = getCSVal('cs-goal');
  const topic     = getCSVal('cs-topic');
  const niche     = $('txt-niche-result').value.trim() || getCSVal('cs-niche');
  const formula   = getCSVal('cs-formula');
  const style     = getCSVal('cs-style');
  const outputs   = getSelectedBadges('badges-output');
  const platforms = getSelectedBadges('badges-platform');
  const moods     = getSelectedBadges('badges-mood');
  const substyles = getSelectedBadges('badges-substyle');
  const colors    = getSelectedBadges('badges-color');
  const extra     = $('txt-extra').value.trim();
  const special   = $('txt-special').value.trim();

  const ml  = currentMode === 'business' ? 'Kinh doanh' : 'Podcast';
  const ll  = lang === 'vi' ? 'Tiếng Việt' : 'English';
  const pStr = platforms.length ? platforms.join(', ') : 'TikTok';

  const dl      = DURATION[currentMode] || [];
  const dur     = getCSVal('cs-duration');
  const durObj  = dur ? dl.find(d => d && d.label === dur) || null : null;

  const isPodcastAudio = currentMode === 'podcast' &&
    (platforms.includes('Spotify') || outputs.some(o => o.includes('Podcast')));

  const wAll = outputs.length === 0;
  const wS   = wAll || outputs.some(o => o.includes('Kịch bản') || o.includes('Dàn ý') || o.includes('Bộ câu'));
  const wSB  = wAll || outputs.some(o => o.includes('Storyboard'));
  const wI   = wAll || outputs.some(o => o.includes('ảnh'));
  const wV   = wAll || outputs.some(o => o.includes('video AI') || o.includes('Prompt video'));

  const prompts = [];
  if (wS)  prompts.push({ type:'Kịch bản / Script',     tc:'',      icon:'📝', text: buildScript(ml,idea,goal,topic,niche,formula,pStr,style,ll,extra,special,moods,substyles,colors,durObj,isPodcastAudio) });
  if (wSB) prompts.push({ type:'Storyboard phân cảnh',  tc:'green', icon:'🎬', text: buildSB(ml,niche||topic,formula,style,ll,extra,moods,substyles,colors) });
  if (wI)  prompts.push({ type:'Prompt ảnh AI',          tc:'red',   icon:'🖼', text: buildImg(style,niche||topic,extra,moods,colors) });
  if (wV)  prompts.push({ type:'Prompt video AI',        tc:'red',   icon:'🎥', text: buildVid(style,niche||topic,pStr,extra,moods,substyles,colors) });

  const grid = $('output-grid');
  grid.innerHTML = '';
  prompts.forEach((p, i) => {
    const c = document.createElement('div');
    c.className = 'output-card' + (i === 0 ? ' full' : '');
    c.style.animationDelay = (i * 0.07) + 's';
    c.innerHTML = `<div class="card-type ${p.tc}"><span class="card-type-icon">${p.icon}</span>${p.type}</div>
<div class="prompt-text">${syntaxHL(p.text)}</div>
<div class="card-actions"><button class="action-btn" onclick="copyP(${i},this)">📋 Copy prompt</button></div>`;
    grid.appendChild(c);
  });
  window._prompts = prompts.map(p => p.text);
  $('output-area').style.display = 'block';
  $('output-area').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── BUILD SCRIPT ─────────────────────────────────────────────────────────────
function buildScript(mode,idea,goal,topic,niche,formula,platform,style,lang,extra,special,moods,substyles,colors,durObj,isPodcastAudio) {
  const moodLine  = moods&&moods.length    ? '\n🎭 MOOD / CẢM XÚC: '    + moods.join(', ')     : '';
  const subLine   = substyles&&substyles.length ? '\n🎬 PHONG CÁCH PHỤ: ' + substyles.join(', ') : '';
  const colorLine = colors&&colors.length  ? '\n🎨 TÔNG MÀU CẢM XÚC: '  + colors.join(', ')    : '';
  const isShort   = platform.includes('TikTok') || platform.includes('Shorts') || platform.includes('Reels');

  let durLine = '', wordReq = '';
  if (durObj) {
    durLine = '\n⏱ THỜI LƯỢNG MỤC TIÊU: ' + durObj.label;
    if (isPodcastAudio) {
      wordReq = `\n\nYÊU CẦU ĐỘ DÀI — PODCAST AUDIO THUẦN:\n- Mục tiêu: ${durObj.label} khi phát sóng\n- Số từ cần viết: ĐÚNG ${durObj.words.toLocaleString()} từ thuần thoại\n- CHỈ viết lời NÓI — không mô tả hành động, góc máy, bối cảnh, chỉ dẫn sản xuất\n- Không viết [pause], [nhạc nền], [tiếng động] vào phần thoại\n- Tốc độ nói thực tế: ~190 từ/phút — ${durObj.words.toLocaleString()} từ = ${durObj.label} thực tế\n- Nếu cần dài hơn, hãy mở rộng nội dung thay vì thêm chỉ dẫn kỹ thuật`;
    } else {
      wordReq = `\n\nYÊU CẦU ĐỘ DÀI:\n- Thời lượng mục tiêu: ${durObj.label}\n- Số từ thoại: ~${durObj.words.toLocaleString()} từ${isShort?' (bao gồm text on screen)':''}\n- Tốc độ nói thực tế: ~190 từ/phút`;
    }
  } else {
    wordReq = '\n- Độ dài: ' + (isShort ? '15–60 giây (~65–130 từ thoại)' : '3–10 phút (~390–1,300 từ thoại)');
  }

  // ── PODCAST AUDIO THUẦN (DNA Phương Thảo) ──────────────────────────────────
  if (isPodcastAudio) {
    const xung      = (moods&&moods.some(m=>m.includes('Chữa lành')||m.includes('Sâu lắng')||m.includes('Ấm áp'))) ? 'mình' : 'tui';
    const colorTone = colors&&colors.length ? colors.join(', ')    : 'ấm áp, tự nhiên';
    const moodTone  = moods&&moods.length   ? moods.join(' + ')    : 'chân thật, gần gũi';
    const topicMain = niche||topic||'cuộc sống đời thường';

    return `Bạn là Phương Thảo — chuyên viết kịch bản podcast solo đời thường, giọng miền Nam/Sài Gòn: hiền, thân thiện, hơi tếu nhẹ, như đang ngồi nói chuyện thật với một người bạn khi bật mic.

THÔNG SỐ TẬP NÀY:
💡 Ý tưởng gốc: ${idea||topicMain}
🎯 Mục tiêu cảm xúc: ${goal||'Chữa lành & Đồng hành'}
📌 Chủ đề / Ngách: ${topicMain}
📐 Công thức: ${formula||'Storytelling'}
🎭 Mood xuyên suốt: ${moodTone}
🎨 Tông màu cảm xúc: ${colorTone}
🗣 Ngôn ngữ: ${lang}${extra?'\n🛍 Sản phẩm/Dịch vụ: '+extra:''}${wordReq}

QUY TRÌNH NGẦM TRƯỚC KHI VIẾT (không in ra):
1. Tạo 4–6 hook theo thứ tự ưu tiên: nỗi đau quen thuộc → nghịch lý đời sống → câu hỏi tò mò → triết lý ngắn.
2. Đánh giá hook nào chạm cảm xúc người nghe nhất với chủ đề "${topicMain}".
3. Chọn hook đó làm câu mở đầu, theo sau bằng 1–2 câu kéo người nghe tiếp tục.
4. Nếu chủ đề trừu tượng: bắt buộc mở bằng một khoảnh khắc đời thường cụ thể trước.
5. Xác định xưng "${xung}" và giữ 100% xuyên suốt, không đổi dù một lần.

PHONG CÁCH GIỌNG NÓI:
- Văn phong lời nói miền Nam đời thường: "thiệt ra", "nhiều khi", "nghe cũng hợp lý ha… mà…", "kiểu như", "ừ thì".
- Câu ngắn, tự nhiên, đôi khi lặp ý nhẹ. Có đoạn giống như đang nghĩ thành lời.
- Câu ngắn đứng một mình = nhấn mạnh cảm xúc. Dùng nhiều.
- Dùng "..." khi ngập ngừng. Dùng "—" khi cắt ngang suy nghĩ.
- TUYỆT ĐỐI không viết câu hoàn hảo, trơn tru — con người thật không nói vậy.

ÂM THANH CẢM XÚC (4–7 lần/tập, đúng ngữ cảnh):
- [thở dài] → sau câu thừa nhận điều khó nói.
- [cười nhẹ] → sau câu tự trào hoặc nghịch lý nhỏ.
- [cười khẽ] → khi chia sẻ điều hơi ngại nhưng thật.
- [haha..] → khi kể chuyện dở khóc dở cười.
- [ừm..] → khi chuyển sang ý chưa chắc hoặc đang tìm từ.

NHỊP BẮT BUỘC: Hook → kéo người nghe → chạm nỗi lo → chi tiết đời thường cụ thể → tự nghi ngờ/lật niềm tin cũ → câu nói thẳng đứng một mình → câu hỏi thật lòng → kết dịu hơn lúc mở.

ĐỊNH DẠNG: Chỉ văn xuôi liền mạch. Không bullet, heading, markdown, emoji, [HOOK]/[BODY]/[CTA], không CTA kêu follow/like.${special?'\n\nYÊU CẦU ĐẶC BIỆT (ưu tiên cao nhất): '+special:''}`;
  }

  // ── KINH DOANH ──────────────────────────────────────────────────────────────
  if (mode === 'Kinh doanh') {
    const topicMain  = niche||topic||'chủ đề liên quan';
    const moodTone   = moods&&moods.length  ? moods.join(' + ')  : 'tự nhiên, thuyết phục';
    const colorTone  = colors&&colors.length ? colors.join(', ') : 'phù hợp thương hiệu';
    const isSell     = goal && (goal.includes('Bán hàng') || goal.includes('doanh số') || goal.includes('giỏ hàng'));
    const isCase     = goal && (goal.includes('Case study') || goal.includes('kết quả') || goal.includes('chứng minh'));

    const hookStrategy = isSell
      ? 'Hook nỗi đau + PAS: mở bằng vấn đề người xem đang gặp → khuếch đại → giới thiệu giải pháp'
      : isCase
      ? 'Hook kết quả trước: mở bằng con số cụ thể → kể hành trình → chứng minh bằng bằng chứng thật'
      : 'Hook tò mò hoặc nghịch lý: câu mở khiến người xem dừng scroll và tự hỏi "tại sao vậy?"';

    const ctaStrategy = isSell
      ? 'CTA bán hàng rõ ràng, tạo urgency: dùng giới hạn thời gian/số lượng, lợi ích cuối cùng, lời kêu gọi hành động một bước duy nhất.'
      : isCase
      ? 'CTA mềm dẫn dắt: chia sẻ bài học → mời người xem nhắn tin nếu muốn kết quả tương tự.'
      : 'CTA xây dựng cộng đồng: mời comment chia sẻ trải nghiệm → follow để xem thêm.';

    return `Bạn là chuyên gia content creator bán hàng và thương hiệu cá nhân — phong cách gần gũi, đời thường, thuyết phục tự nhiên, KHÔNG cứng nhắc như quảng cáo.

THÔNG SỐ VIDEO:
💡 Ý tưởng gốc: ${idea||topicMain}
🎯 Mục tiêu: ${goal||'Tăng nhận diện thương hiệu'}
📌 Chủ đề / Ngách: ${topicMain}
📐 Công thức: ${formula||'PAS'}
📱 Nền tảng: ${platform}
🎨 Phong cách: ${style||'Viral'} — ${moodTone}${colorTone?'\n🌈 Tông màu: '+colorTone:''}${durLine}
🗣 Ngôn ngữ: ${lang}${extra?'\n🛍 Sản phẩm/Dịch vụ: '+extra:''}${wordReq}

QUY TRÌNH NGẦM (không in ra):
1. Xác định insight người xem: họ đang đau điểm gì? Họ muốn điều gì? Họ sợ điều gì?
2. Tạo 3–4 hook theo hướng: "${hookStrategy}"
3. Chọn hook chạm insight mạnh nhất, đặt làm câu đầu tiên — kéo người dừng scroll trong 3 giây.
4. Sau hook: 1–2 câu giữ người xem bằng cách hứa hẹn giá trị hoặc tạo tò mò tiếp theo.

PHONG CÁCH GIỌNG NÓI:
- Gần gũi, đời thường, như người bạn đang chia sẻ — không đọc quảng cáo.
- Câu ngắn xen câu dài để tạo nhịp tự nhiên.
- Dùng "bạn" xuyên suốt để tạo kết nối trực tiếp.
- Tránh từ ngữ sáo rỗng: "tuyệt vời", "đỉnh cao", "siêu phẩm".

NHỊP TRIỂN KHAI [HOOK → BODY → CTA]:
[HOOK] Câu mở 3 giây — chạm đúng nỗi đau hoặc tạo tò mò mạnh.
[BODY] Triển khai theo công thức ${formula||'PAS'}: dẫn dắt tự nhiên, có chi tiết đời thường cụ thể, có bằng chứng thật.
[CTA] ${ctaStrategy}

YÊU CẦU BẮT BUỘC:
- Hook KHÔNG bắt đầu bằng "Xin chào", "Hôm nay mình sẽ", "Bạn có biết không".
- Body KHÔNG liệt kê tính năng — phải chuyển tính năng thành lợi ích cảm xúc.
- CTA phải có 1 hành động duy nhất, rõ ràng.
- Phong cách quay/dựng: ${substyles&&substyles.length ? substyles.join(', ') : 'linh hoạt theo nền tảng'}${special?'\n\nYÊU CẦU ĐẶC BIỆT (ưu tiên cao nhất): '+special:''}`;
  }

  // ── PODCAST (không phải audio thuần) ────────────────────────────────────────
  return `Bạn là chuyên gia content creator podcast và cảm xúc.

Hãy tạo kịch bản podcast hoàn chỉnh:${idea?'\n💡 Ý TƯỞNG GỐC: '+idea:''}
📌 MỤC TIÊU: ${goal||'Truyền cảm hứng'}
📌 CHỦ ĐỀ: ${topic||'Không giới hạn'}
📌 NGÁCH: ${niche||topic||'Tự chọn phù hợp'}
📌 CÔNG THỨC: ${formula||'Storytelling'}
📌 NỀN TẢNG: ${platform}
📌 PHONG CÁCH CHÍNH: ${style||'Healing'}${moodLine}${subLine}${colorLine}${durLine}
📌 NGÔN NGỮ: ${lang}${extra?'\n- Sản phẩm: '+extra:''}${special?'\n- Yêu cầu đặc biệt: '+special:''}
${wordReq}

YÊU CẦU THÊM:
- Hook mạnh trong 3 giây đầu, toát ra mood: ${moods&&moods.length?moods[0]:'phù hợp với chủ đề'}
- Áp dụng đúng công thức ${formula||'Storytelling'} từ đầu đến cuối
- Tone & cảm xúc xuyên suốt: ${moods&&moods.length?moods.join(' + '):'tự nhiên, phù hợp'}
- CTA rõ ràng ở cuối

Xuất kịch bản đầy đủ, đánh dấu [HOOK], [BODY], [CTA].`;
}

// ── BUILD STORYBOARD ──────────────────────────────────────────────────────────
function buildSB(mode,topic,formula,style,lang,extra,moods,substyles,colors) {
  const moodLine  = moods&&moods.length    ? '\n- Mood: '            + moods.join(', ')     : '';
  const subLine   = substyles&&substyles.length ? '\n- Phong cách phụ: ' + substyles.join(', ') : '';
  const colorLine = colors&&colors.length  ? '\n- Tông màu cảm xúc: ' + colors.join(', ')   : '';
  return `Tạo storyboard phân cảnh chi tiết cho video ${mode}: "${topic}".${extra?'\nSản phẩm: '+extra:''}

THÔNG SỐ:
- Công thức: ${formula||'Hook Pain + PAS'}
- Phong cách chính: ${style||'Cinematic'}${moodLine}${subLine}${colorLine}
- Ngôn ngữ: ${lang}

ĐỊNH DẠNG MỖI CẢNH:
[CẢNH X — 0:00–0:05]
📍 Bối cảnh: ...
🎥 Góc máy & phong cách quay: ...
🎭 Hành động / cảm xúc diễn viên: ...
💬 Lời thoại/VO: ...
🎵 Âm thanh / Nhạc nền: ...
🎨 Tông màu cảm xúc / Ánh sáng: ...
✨ Text on screen: ...

Tạo 6–8 cảnh, đánh dấu HOOK / BODY / TRANSITION / CTA. Đảm bảo mood "${moods&&moods.length?moods[0]:'phù hợp'}" xuyên suốt toàn bộ.`;
}

// ── BUILD IMAGE PROMPT ────────────────────────────────────────────────────────
function buildImg(style,topic,extra,moods,colors) {
  const sm = {
    'Cinematic':      'cinematic photography, dramatic lighting, film grain, 4K',
    'Minimalist':     'clean minimalist, white space, editorial, soft light',
    'Vlog':           'authentic lifestyle, candid, warm tones, natural light',
    'Authority':      'professional portrait, studio lighting, sharp focus',
    'Viral':          'bold colors, high contrast, dynamic angle, scroll-stopping',
    'Healing':        'soft warm tones, golden hour, bokeh, peaceful',
    'Visual Podcast': 'podcast studio, microphone, moody lighting, cinematic',
  };
  const s        = sm[style] || 'cinematic, professional';
  const tc       = (topic||'').replace(/['"]/g,'');
  const ex       = extra ? ', featuring: '+extra : '';
  const moodStr  = moods&&moods.length  ? ', mood: '          + moods.join(' + ')  : '';
  const colorStr = colors&&colors.length ? ', color palette: ' + colors.join(', ')  : '';
  return `[AI IMAGE PROMPT — Thumbnail / Minh họa]

${s}${moodStr}${colorStr}, Vietnamese content creator, topic: "${tc}"${ex}, social media thumbnail, scroll-stopping, --ar 9:16 --q 2 --style raw

---
[Midjourney / DALL-E / Flux]
A ${s.split(',')[0]} photo, Vietnamese ${style==='Authority'?'expert':'creator'} presenting "${tc}"${ex}. ${moods&&moods.length?'Emotional tone: '+moods.join(', ')+'.':''} ${colors&&colors.length?'Color grade: '+colors.join(', ')+'.':''} Professional, photorealistic, social media ready.`;
}

// ── BUILD VIDEO PROMPT ────────────────────────────────────────────────────────
function buildVid(style,topic,platform,extra,moods,substyles,colors) {
  const sm = {
    'Cinematic': 'cinematic slow zoom, depth of field, film look',
    'Viral':     'fast cuts, dynamic transitions, bold text overlays',
    'Vlog':      'handheld, natural movement, warm color grade',
    'Healing':   'slow gentle motion, soft bokeh, calming pans',
    'Authority': 'steady shot, talking head, clean background',
  };
  const m        = sm[style] || 'smooth professional movement';
  const isShort  = platform.includes('TikTok') || platform.includes('Shorts') || platform.includes('Reels');
  const moodStr  = moods&&moods.length    ? '\n- Mood / Cảm xúc: ' + moods.join(', ')     : '';
  const subStr   = substyles&&substyles.length ? '\n- Phong cách quay: '+ substyles.join(', ') : '';
  const colorStr = colors&&colors.length  ? '\n- Tông màu: '        + colors.join(', ')    : '';
  return `[AI VIDEO PROMPT — Kling / Runway / Sora / Veo]

${m}, Vietnamese ${style==='Authority'?'expert':'content creator'}, topic: "${(topic||'').replace(/['"]/g,'')}"${extra?', featuring: '+extra:''}.

Specs:
- Duration: ${isShort?'15–30 seconds, vertical 9:16':'60–90 seconds, 16:9'}
- Style: ${style||'Cinematic'}, ${m}${moodStr}${subStr}${colorStr}
- Lighting: ${style==='Healing'?'golden hour, soft diffused':style==='Cinematic'?'dramatic rembrandt':'natural bright ambient'}
- Camera: ${isShort?'vertical, close-up talking head, stabilized':'wide establishing + medium closeup'}
- Tông màu cảm xúc: ${colors&&colors.length?colors[0]:style==='Healing'?'warm peach, low contrast':style==='Viral'?'high saturation, punchy':'natural filmic'}
- Platform: ${platform} optimized`;
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
function syntaxHL(text) {
  return text
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/\[([^\]]+)\]/g,       '<span class="hl-yellow">[$1]</span>')
    .replace(/(📌|📍|🎥|🎭|💬|🎵|✨|💡|🎯|🔵)/g, '<span class="hl-green">$1</span>')
    .replace(/\b(HOOK|BODY|CTA|TRANSITION)\b/g,    '<span class="hl-red">$1</span>');
}

async function copyP(i, btn) {
  const t = (window._prompts||[])[i] || '';
  try { await navigator.clipboard.writeText(t); }
  catch(e) {
    const ta = document.createElement('textarea');
    ta.value = t; document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); document.body.removeChild(ta);
  }
  btn.textContent = '✅ Copied!'; btn.classList.add('copied');
  setTimeout(() => { btn.textContent = '📋 Copy prompt'; btn.classList.remove('copied'); }, 2000);
}
