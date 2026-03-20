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

  // đọc state từ pane 6
  const ar  = typeof aspectRatio   !== 'undefined' ? aspectRatio   : '9:16';
  const rq  = typeof renderQuality !== 'undefined' ? renderQuality : '4K';
  const qtyInp = $('qty-input');
  const qty = qtyInp ? Math.max(1, parseInt(qtyInp.value)||6) : (typeof promptQty !== 'undefined' ? promptQty : 6);

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
  if (wI)  prompts.push({ type:`Prompt ảnh AI (${qty} ảnh · ${ar} · ${rq})`,  tc:'red', icon:'🖼', text: buildImg(style,niche||topic,extra,moods,colors,ar,rq,qty,idea,formula) });
  if (wV)  prompts.push({ type:`Prompt video AI (${qty} clip · ${ar} · ${rq})`,tc:'red', icon:'🎥', text: buildVid(style,niche||topic,pStr,extra,moods,substyles,colors,ar,rq,qty,idea,formula) });

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

  // ── KINH DOANH — Framework 5 Bước + Timestamp ──────────────────────────────
  if (mode === 'Kinh doanh') {
    const topicMain  = niche||topic||'chủ đề liên quan';
    const moodTone   = moods&&moods.length  ? moods.join(' + ')  : 'tự nhiên, thuyết phục';
    const colorTone  = colors&&colors.length ? colors.join(', ') : 'phù hợp thương hiệu';
    const isSell     = goal && (goal.includes('Bán hàng') || goal.includes('doanh số') || goal.includes('giỏ hàng'));
    const isCase     = goal && (goal.includes('Case study') || goal.includes('kết quả') || goal.includes('chứng minh'));
    const isBrand    = goal && (goal.includes('thương hiệu') || goal.includes('Follow') || goal.includes('tương tác'));

    // ── Tính phân bổ thời gian 5 bước từ durObj ──────────────────────────────
    const totalSec = durObj ? Math.round(durObj.words / 3) : (isShort ? 30 : 60);
    // Tỉ lệ: Hook 12% | Agitate 25% | Solution 35% | Proof 20% | CTA ~8% (min 3s)
    const t_hook    = Math.max(3,  Math.round(totalSec * 0.12));
    const t_agitate = Math.max(5,  Math.round(totalSec * 0.25));
    const t_solution= Math.max(8,  Math.round(totalSec * 0.35));
    const t_proof   = Math.max(5,  Math.round(totalSec * 0.20));
    const t_cta     = Math.max(3,  totalSec - t_hook - t_agitate - t_solution - t_proof);
    const targetWordCount = Math.round(totalSec * 3);

    // Timestamp tích luỹ
    let ts = 0;
    const fmt = (s) => { const m=Math.floor(s/60); return `${m}:${String(s%60).padStart(2,'0')}`; };
    const ts0=fmt(ts);                 ts+=t_hook;
    const ts1=fmt(ts);                 ts+=t_agitate;
    const ts2=fmt(ts);                 ts+=t_solution;
    const ts3=fmt(ts);                 ts+=t_proof;
    const ts4=fmt(ts);                 const ts5=fmt(ts+t_cta);

    const hookStrategy = isSell
      ? 'Câu mở chạm đúng nỗi đau: gây sốc, câu hỏi tu từ, hoặc sự thật bất ngờ — dừng scroll trong 3 giây'
      : isCase
      ? 'Hook kết quả trước: mở bằng con số / thành quả cụ thể — kéo người xem muốn biết "làm thế nào?"'
      : 'Hook tò mò / nghịch lý: câu mở khiến người xem dừng và tự hỏi "tại sao vậy?"';

    const ctaStrategy = isSell
      ? 'Kêu gọi khéo léo, tạo urgency nhẹ: "trải nghiệm ngay", "khám phá tại giỏ hàng" — tránh từ bán hàng thô thiển'
      : isCase
      ? 'CTA mềm: "nhắn tin nếu bạn muốn kết quả tương tự" — không ép mua ngay'
      : 'CTA cộng đồng: mời comment, chia sẻ trải nghiệm, follow để xem tiếp';

    const proofType = isCase
      ? 'Con số, kết quả rõ rệt, case study khách hàng thành công — có tên/số liệu cụ thể'
      : isBrand
      ? 'Review, phản hồi, hậu trường quy trình — cam kết chất lượng bằng bằng chứng thực'
      : 'Trích dẫn cảm nhận thật, before/after, hoặc con số kiểm chứng';

    return `Bạn là chuyên gia Video Marketing. Hãy viết kịch bản theo công thức 5 Bước Bắt Buộc dưới đây.

━━━ THÔNG SỐ VIDEO ━━━
💡 Ý tưởng: ${idea||topicMain}
🎯 Mục tiêu: ${goal||'Tăng nhận diện thương hiệu'}
📌 Chủ đề / Ngách: ${topicMain}
📐 Công thức: ${formula||'PAS'}
📱 Nền tảng: ${platform}
🎨 Phong cách: ${style||'Viral'} · Mood: ${moodTone}${colorTone?'\n🌈 Tông màu: '+colorTone:''}${durLine}
🗣 Ngôn ngữ: ${lang}${extra?'\n🛍 Sản phẩm/Dịch vụ: '+extra:''}

━━━ YÊU CẦU KỸ THUẬT ━━━
• Tổng thời lượng: ${totalSec} giây
• Tốc độ nói (quy tắc vàng): ~${targetWordCount} từ (3 từ/giây)
• Văn phong: Tự nhiên, kể chuyện, đời thường — người xem dễ đồng cảm
• Định dạng đầu ra: BẮT BUỘC ghi timestamp từng đoạn [${ts0}–${ts1}], [${ts1}–${ts2}]... để dễ căn video
• Phong cách quay/dựng: ${substyles&&substyles.length ? substyles.join(', ') : 'linh hoạt theo nền tảng'}

━━━ CẤU TRÚC 5 BƯỚC BẮT BUỘC ━━━

1. HOOK — Mồi nhử [${ts0}–${ts1}] (~${t_hook}s · ~${t_hook*3} từ)
   Mục tiêu: Thu hút sự chú ý NGAY LẬP TỨC — người xem không kịp scroll qua
   Nội dung: ${hookStrategy}
   ⚠️ KHÔNG bắt đầu bằng "Xin chào", "Hôm nay mình sẽ", "Bạn có biết không"

2. AGITATE — Nỗi đau [${ts1}–${ts2}] (~${t_agitate}s · ~${t_agitate*3} từ)
   Mục tiêu: Khơi gợi vấn đề, nỗi lo lắng hoặc mong muốn thầm kín của khách hàng
   Nội dung: Nhấn mạnh vào khó khăn họ đang gặp — đừng giải quyết ngay, hãy để nỗi đau "thấm"
   Chủ đề áp dụng: ${topicMain}

3. SOLUTION — Giải pháp [${ts2}–${ts3}] (~${t_solution}s · ~${t_solution*3} từ)
   Mục tiêu: Giới thiệu sản phẩm/dịch vụ/giải pháp như "chìa khoá" giải quyết vấn đề trên
   Nội dung: Nêu bật USP — tính năng PHẢI được chuyển thành lợi ích cảm xúc, không liệt kê khô khan${extra?'\n   Sản phẩm: '+extra:''}

4. PROOF — Bằng chứng [${ts3}–${ts4}] (~${t_proof}s · ~${t_proof*3} từ)
   Mục tiêu: Củng cố niềm tin bằng kết quả thực tế
   Nội dung: ${proofType}

5. CTA — Kêu gọi hành động [${ts4}–${ts5}] (~${t_cta}s · ~${t_cta*3} từ)
   Mục tiêu: Hướng dẫn bước tiếp theo rõ ràng, tự nhiên
   Nội dung: ${ctaStrategy}

━━━ QUY TRÌNH NGẦM TRƯỚC KHI VIẾT (không in ra) ━━━
1. Xác định insight: khách hàng đang đau điểm gì? Muốn gì? Sợ gì?
2. Tạo 3–4 phương án Hook, chọn cái chạm insight mạnh nhất
3. Viết AGITATE đủ "đau" để SOLUTION trở nên đáng giá
4. Proof phải cụ thể: tên, con số, cảm nhận thật — không chung chung
5. CTA 1 hành động duy nhất — không liệt kê 3–4 việc cùng lúc${special?'\n\n━━━ YÊU CẦU ĐẶC BIỆT (ưu tiên cao nhất) ━━━\n'+special:''}`;
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

// ── BUILD IMAGE PROMPT (N ảnh bám sát nội dung) ───────────────────────────────
function buildImg(style, topic, extra, moods, colors, ar, rq, qty, idea, formula) {
  const sm = {
    'Cinematic':      'cinematic photography, dramatic lighting, film grain',
    'Minimalist':     'clean minimalist, white space, editorial, soft light',
    'Vlog':           'authentic lifestyle, candid, warm tones, natural light',
    'Authority':      'professional portrait, studio lighting, sharp focus',
    'Viral':          'bold colors, high contrast, dynamic angle, scroll-stopping',
    'Healing':        'soft warm tones, golden hour, bokeh, peaceful',
    'Visual Podcast': 'podcast studio, microphone, moody lighting, cinematic',
  };
  const baseStyle  = sm[style] || 'cinematic, professional';
  const tc         = (topic||'').replace(/['"]/g,'');
  const ex         = extra ? `, featuring: ${extra}` : '';
  const moodStr    = moods&&moods.length   ? `, mood: ${moods.join(' + ')}`        : '';
  const colorStr   = colors&&colors.length ? `, color palette: ${colors.join(', ')}` : '';
  const arFlag     = `--ar ${(ar||'9:16').replace(':','/')}`;
  const qFlag      = rq === '8K' ? '--q 2 --style raw' : rq === '4K' ? '--q 2' : '--q 1';
  const n = Math.max(1, qty || 6);

  // Template cảnh — cycle nếu n > số template
  const sceneTemplates = [
    { role:'HOOK / Mở đầu',       desc:`Khoảnh khắc đầu tiên chạm cảm xúc — ${tc}` },
    { role:'BODY 1 / Vấn đề',     desc:`Khắc họa nỗi đau / vấn đề chính — ${tc}` },
    { role:'BODY 2 / Giải pháp',  desc:`Khoảnh khắc chuyển hoá / hành động — ${tc}` },
    { role:'BODY 3 / Cảm xúc',    desc:`Biểu cảm cảm xúc cao nhất trong nội dung` },
    { role:'TRANSITION',          desc:`Cảnh chuyển tiếp, tạo nhịp và không khí` },
    { role:'CTA / Kết',           desc:`Hình ảnh kêu gọi hành động — bám sát ${tc}` },
    { role:'DETAIL',              desc:`Chi tiết sản phẩm / không gian / con người` },
    { role:'WIDE SHOT',           desc:`Cảnh toàn cảnh — bối cảnh chủ đề ${tc}` },
    { role:'CLOSE-UP',            desc:`Cận cảnh cảm xúc / chi tiết nổi bật` },
    { role:'LIFESTYLE',           desc:`Phong cách sống gắn với chủ đề — ${tc}` },
    { role:'BEHIND SCENES',       desc:`Hậu trường / quá trình / sự thật` },
    { role:'FINAL FRAME',         desc:`Khung hình kết thúc đọng lại trong tâm trí` },
  ];

  // Tạo đúng n cảnh — cycle template nếu n > 12
  const scenes = Array.from({length: n}, (_, i) => sceneTemplates[i % sceneTemplates.length]);
  const header = `[AI IMAGE PROMPTS — ${n} ẢNH · ${ar||'9:16'} · ${rq||'4K'}]
Chủ đề: "${tc}"${extra?' | Sản phẩm: '+extra:''}
Style: ${baseStyle}${moodStr}${colorStr}
Công thức: ${formula||'Storytelling'} | Idea: ${idea||tc}
${'─'.repeat(50)}
`;

  const body = scenes.map((s, i) => {
    const n1 = String(i+1).padStart(2,'0');
    return `PROMPT ${n1} — [${s.role}]
${baseStyle}, Vietnamese ${style==='Authority'?'expert':'content creator'}, ${s.desc}${ex}${moodStr}${colorStr}. ${rq} quality, photorealistic, social media ready.
${arFlag} ${qFlag}
`;
  }).join('\n');

  return header + body + `\n⚙️ Gợi ý tool: Midjourney / DALL-E 3 / Flux / Stable Diffusion`;
}

// ── BUILD VIDEO PROMPT (N clip bám sát nội dung) ─────────────────────────────
function buildVid(style, topic, platform, extra, moods, substyles, colors, ar, rq, qty, idea, formula) {
  const sm = {
    'Cinematic': 'cinematic slow zoom, depth of field, film look',
    'Viral':     'fast cuts, dynamic transitions, bold text overlays',
    'Vlog':      'handheld, natural movement, warm color grade',
    'Healing':   'slow gentle motion, soft bokeh, calming pans',
    'Authority': 'steady shot, talking head, clean background',
  };
  const baseMotion = sm[style] || 'smooth professional movement';
  const isShort    = platform.includes('TikTok') || platform.includes('Shorts') || platform.includes('Reels');
  const tc         = (topic||'').replace(/['"]/g,'');
  const ex         = extra ? `, featuring: ${extra}` : '';
  const moodStr    = moods&&moods.length    ? `\n  Mood: ${moods.join(', ')}`           : '';
  const subStr     = substyles&&substyles.length ? `\n  Phong cách quay: ${substyles.join(', ')}` : '';
  const colorStr   = colors&&colors.length  ? `\n  Tông màu: ${colors.join(', ')}`      : '';
  const lighting   = style==='Healing' ? 'golden hour, soft diffused' : style==='Cinematic' ? 'dramatic rembrandt' : 'natural bright ambient';
  const camera     = ar==='9:16' || isShort ? 'vertical frame, close-up talking head, stabilized gimbal' : 'wide establishing shot + medium closeup';
  const duration   = isShort ? '5–8 seconds per clip' : '8–15 seconds per clip';
  const arSpec     = ar || '9:16';
  const n = Math.max(1, qty || 6);

  const sceneTemplates = [
    { role:'HOOK / Mở đầu',         cam:'extreme close-up face expression, shock cut',       action:`Creator nhìn thẳng camera, hook bằng cảm xúc — "${tc}"` },
    { role:'BODY 1 / Vấn đề',       cam:'medium shot, slight handheld',                      action:'Kể vấn đề / nỗi đau — biểu cảm thật, không diễn' },
    { role:'BODY 2 / Giải pháp',    cam:'medium-wide, stable',                               action:'Trình bày giải pháp / sản phẩm / insight chính' },
    { role:'BODY 3 / Cảm xúc đỉnh', cam:'close-up, dramatic push-in slow',                   action:'Cao trào cảm xúc — khoảnh khắc người xem dừng lại' },
    { role:'B-ROLL / Chi tiết',      cam:'macro / detail shot, smooth slide',                 action:`Chi tiết sản phẩm / không gian / bàn tay — bám sát "${tc}"` },
    { role:'TRANSITION',             cam:'whip pan / match cut',                              action:'Cảnh chuyển tiếp tạo nhịp và không khí' },
    { role:'LIFESTYLE',              cam:'wide lifestyle shot, golden hour',                   action:`Phong cách sống gắn chủ đề — ${tc}` },
    { role:'REACTION / Testimonial', cam:'medium close-up, natural light',                   action:'Biểu cảm phản ứng thật sau khi trải nghiệm' },
    { role:'TEXT OVERLAY',           cam:'static background, typography focus',               action:'Text key message nổi trên màn hình — hook tiếp theo' },
    { role:'BEHIND SCENES',          cam:'handheld vlog style',                               action:'Hậu trường / quá trình thật — xây trust' },
    { role:'CTA Setup',              cam:'medium shot, direct to camera',                     action:'Dẫn dắt vào CTA — ánh mắt và cử chỉ mời gọi' },
    { role:'CTA / Kết',              cam:'close-up + zoom out ending',                       action:`Kêu gọi hành động cuối — bám chủ đề "${tc}"` },
  ];

  // Cycle template nếu n > 12
  const scenes = Array.from({length: n}, (_, i) => sceneTemplates[i % sceneTemplates.length]);
  const header = `[AI VIDEO PROMPTS — ${n} CLIP · ${arSpec} · ${rq||'4K'}]
Chủ đề: "${tc}"${extra?' | Sản phẩm: '+extra:''}
Style: ${baseMotion}${moodStr}${subStr}${colorStr}
Công thức: ${formula||'Storytelling'} | Platform: ${platform} | Idea: ${idea||tc}
Lighting: ${lighting} | Camera: ${camera} | Duration: ${duration}
${'─'.repeat(55)}
`;

  const body = scenes.map((s, i) => {
    const n1 = String(i+1).padStart(2,'0');
    return `PROMPT ${n1} — [${s.role}]
${baseMotion}, Vietnamese ${style==='Authority'?'expert':'content creator'}, ${s.action}${ex}.
Camera: ${s.cam}. Lighting: ${lighting}. ${rq||'4K'} quality, ${arSpec} frame, ${duration}, realistic motion.
`;
  }).join('\n');

  return header + body + `\n⚙️ Gợi ý tool: Kling AI / Runway Gen-3 / Sora / Veo 2 / HeyGen`;
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
