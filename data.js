/* ============================================================
   MUZI STUDIO — data.js
   Chứa toàn bộ nội dung: chủ đề, mục tiêu, công thức, mood...
   Muốn thêm/sửa nội dung → chỉ cần sửa file này
   ============================================================ */

// ── NỘI DUNG CHÍNH (goals, topics, formulas, outputs, styles) ──────────────
const DATA = {
  business: {
    goals: [
      'Bán hàng & Tăng doanh số',
      'Thu hút khách hàng tiềm năng',
      'Xây dựng thương hiệu cá nhân',
      'Tăng tương tác & Giữ chân khách hàng',
      'Giải quyết vấn đề',
    ],
    topics: {
      'Giới thiệu & Bán hàng': [
        'Giới thiệu sản phẩm mới & tính năng nổi bật',
        'Chương trình khuyến mãi & ưu đãi giới hạn',
        'Hướng dẫn mua hàng & chính sách bảo hành',
        'Lý do chọn sản phẩm này thay vì đối thủ',
        'Giải đáp thắc mắc về giá & công dụng',
      ],
      'Xây dựng thương hiệu cá nhân': [
        'Câu chuyện bản thân / Hành trình phát triển',
        'Giá trị cốt lõi & Quan điểm làm nghề',
        'Hậu trường công việc / Một ngày của tôi',
        'Cam kết chất lượng & Quy trình làm việc',
        'Sai lầm từng mắc & Bài học rút ra',
        'Góc nhìn chuyên gia về ngành',
        'Nguyên tắc không bao giờ thỏa hiệp',
      ],
      'Giải quyết vấn đề & Chia sẻ giá trị': [
        'Dấu hiệu nhận biết vấn đề',
        'Sai lầm phổ biến & Cách phòng tránh',
        'Cách tự xử lý cơ bản (DIY)',
        'Phá bỏ hiểu lầm (Myth-busting)',
        'Hậu quả của việc trì hoãn',
        '3 bước giải quyết nhanh',
        'Khi nào cần tìm chuyên gia',
      ],
      'Review & Case Study': [
        'Review chân thật / Đánh giá khách quan',
        'Case study thành công có số liệu cụ thể',
        'Câu chuyện chuyển đổi của khách hàng',
        'Tổng hợp feedback nổi bật',
        'Phân tích lý do thành công',
        'Phỏng vấn khách hàng thực tế',
      ],
    },
    formulas: ['AIDA','PAS','BAB','FAB','3S (Story)','4U','Hook Pain','Hook Curiosity','Hook Myth-bust','Storytelling','Listicle','Deep-dive'],
    outputs: ['Kịch bản video ngắn','Kịch bản video dài','Storyboard phân cảnh','Prompt ảnh AI','Prompt video AI'],
    styles: ['Cinematic','Minimalist','Vlog','Authority','Viral'],
  },
  podcast: {
    goals: [
      'Xây dựng cộng đồng & Kết nối',
      'Truyền cảm hứng & Chiêm nghiệm',
      'Chữa lành & Đồng hành cảm xúc',
      'Tăng Follow / Đăng ký kênh dài hạn',
      'Soft-selling qua nội dung giá trị',
    ],
    topics: {
      'Chiêm nghiệm & Quan điểm sống': [
        'Bài học từ một giai đoạn cuộc đời',
        'Góc nhìn khác về vấn đề quen thuộc',
        'Điều ước gì biết sớm hơn',
        'Ranh giới giữa cố gắng và buông bỏ',
        'Tại sao mình chọn sống chậm lại',
      ],
      'Tài chính & Phát triển bản thân': [
        'Thói quen nhỏ thay đổi cuộc đời',
        'Sai lầm tài chính mình từng mắc phải',
        'Cách xây dựng kỷ luật bản thân',
        'Mindset về tiền bạc ít ai nói thật',
        'Sách/Khóa học thay đổi tư duy',
      ],
      'Kể chuyện / Chữa lành': [
        'Câu chuyện vượt qua giai đoạn khó khăn',
        'Khi chạm đáy và tìm lại bản thân',
        'Nhận ra & thoát khỏi mối quan hệ độc hại',
        'Đối mặt với áp lực xã hội',
        'Thư gửi chính mình ngày xưa',
      ],
      'Soft-selling qua cảm xúc': [
        'Chia sẻ giá trị → Dẫn dắt vào sản phẩm',
        'Câu chuyện khách hàng → CTA nhẹ',
        'Giáo dục → Định vị chuyên gia → Mời tư vấn',
      ],
    },
    formulas: ['Storytelling','Deep-dive','Listicle','Hook Story','Hook Emotion','Hook Confession'],
    outputs: ['Dàn ý Podcast Solo','Kịch bản Podcast Solo','Bộ câu hỏi phỏng vấn','Kịch bản clip ngắn TikTok','Storyboard Visual Podcast','Prompt ảnh AI','Prompt video AI'],
    styles: ['Healing','Vlog','Visual Podcast','Cinematic'],
  },
};

// ── CONVERSION GOALS ────────────────────────────────────────────────────────
const CONVERSION = {
  business: [
    'Tương tác',
    'Tăng Follow / Sub kênh',
    'Doanh số',
    'Lead mềm (Inbox)',
    'Nhận diện thương hiệu',
    'Tăng view',
    'Upsell / Cross-sell',
  ],
  podcast: [
    'Tăng lượt nghe',
    'Tăng Follow',
    'Xây dựng cộng đồng',
    'Kết nối',
    'Share',  
    'Soft-sell sản phẩm tự nhiên',
  ],
};

// ── DURATION ─────────────────────────────────────────────────────────────────
const DURATION = {
  business: [
    { label:'15 giây', key:'15s', words:35,   note:'~35 từ thoại. Hook cực ngắn, 1 thông điệp duy nhất. TikTok/Reels.' },
    { label:'30 giây', key:'30s', words:65,   note:'~65 từ thoại. Hook + 1 điểm chính + CTA. TikTok/Reels tốt nhất.' },
    { label:'60 giây', key:'60s', words:130,  note:'~130 từ thoại. Hook + 2–3 điểm + CTA. Chuẩn TikTok/Shorts.' },
    { label:'3 phút',  key:'3m',  words:390,  note:'~390 từ thoại. Đủ cho 1 câu chuyện ngắn hoặc hướng dẫn 3 bước.' },
    { label:'5 phút',  key:'5m',  words:650,  note:'~650 từ thoại. YouTube ngắn, review sản phẩm, case study.' },
    { label:'10 phút', key:'10m', words:1300, note:'~1,300 từ thoại. YouTube tiêu chuẩn. Đủ cho 1 chủ đề chuyên sâu.' },
    { label:'15 phút', key:'15m', words:1950, note:'~1,950 từ thoại. YouTube dài. Tutorial hoặc phân tích sâu.' },
  ],
  podcast: [
    { label:'5 phút',  key:'5m',  words:650,  note:'~650 từ thuần thoại (không mô tả hành động/không gian). Solo ngắn, 1 insight.' },
    { label:'10 phút', key:'10m', words:1300, note:'~1,300 từ thuần thoại. Podcast mini, 2–3 điểm chính.' },
    { label:'15 phút', key:'15m', words:1950, note:'~1,950 từ thuần thoại. Podcast ngắn chuẩn. 1 câu chuyện hoàn chỉnh.' },
    { label:'20 phút', key:'20m', words:2600, note:'~2,600 từ thuần thoại. Đủ cho chiêm nghiệm sâu hoặc case study.' },
    { label:'30 phút', key:'30m', words:3900, note:'~3,900 từ thuần thoại. ⚠️ AI thường trả về ít hơn — yêu cầu rõ số từ.' },
    { label:'45 phút', key:'45m', words:5850, note:'~5,850 từ thuần thoại. Podcast dài, cần outline chi tiết trước.' },
    { label:'60 phút', key:'60m', words:7800, note:'~7,800 từ thuần thoại. Phải chia thành nhiều phần khi nhờ AI viết.' },
  ],
};

// ── FORMULA HINTS ─────────────────────────────────────────────────────────────
const FORMULA_HINTS = {
  'AIDA':           'Chú ý → Thích → Muốn → Hành động. Cổ điển, hiệu quả cho bán hàng và CTA mạnh.',
  'PAS':            'Vấn đề → Khuếch đại nỗi đau → Giải pháp. Mạnh nhất cho video ngắn TikTok.',
  'BAB':            'Trước → Sau → Cầu nối. Lý tưởng cho case study và chứng minh kết quả.',
  'FAB':            'Tính năng → Thế mạnh → Lợi ích. Tốt cho video giới thiệu sản phẩm.',
  '3S (Story)':     'Nhân vật → Câu chuyện → Giải quyết. Xây dựng cảm xúc và niềm tin.',
  '4U':             'Có ích → Cấp bách → Độc nhất → Cụ thể. Tối ưu cho headline và hook.',
  'Hook Pain':      'Đánh thẳng vào nỗi đau trong 3 giây đầu. Stop-scroll cực mạnh.',
  'Hook Curiosity': 'Câu hỏi gây tò mò ngay mở đầu. Tăng watch-time hiệu quả.',
  'Hook Myth-bust': 'Phá vỡ hiểu lầm phổ biến. Tạo sốc và lan rộng.',
  'Storytelling':   'Kể chuyện từ trải nghiệm thật. Xây dựng kết nối lâu dài.',
  'Listicle':       'Liệt kê / Hướng dẫn từng bước. Dễ tiêu hoá, save nhiều.',
  'Deep-dive':      'Phân tích & Chiêm nghiệm chuyên sâu. Phù hợp YouTube và Podcast.',
  'Hook Story':     'Mở đầu bằng khoảnh khắc thật, kéo người nghe vào câu chuyện.',
  'Hook Emotion':   'Câu hỏi chạm đến cảm xúc người nghe ngay đầu podcast.',
  'Hook Confession':'Thú nhận điều ít ai dám nói thẳng. Tạo tin tưởng ngay lập tức.',
};

// ── STYLE HINTS ───────────────────────────────────────────────────────────────
const STYLE_HINTS = {
  'Cinematic':      'Điện ảnh, sang trọng. Ánh sáng kịch tính, màu sắc điện ảnh, chuyển động chậm và có chiều sâu.',
  'Minimalist':     'Tối giản, hiện đại. Không gian trắng, bố cục sạch, tập trung vào thông điệp.',
  'Vlog':           'Đời thường, chân thật. Handheld camera, gần gũi, tự nhiên như đang trò chuyện.',
  'Authority':      'Chuyên gia, thuyết phục. Studio setup, talking head, professional và đáng tin cậy.',
  'Viral':          'Nhanh, bắt mắt. Fast cuts, text overlay, trending sound, tối ưu TikTok/Reels.',
  'Healing':        'Cảm xúc, chữa lành, ấm áp. Ánh vàng, bokeh, chuyển động nhẹ nhàng.',
  'Visual Podcast': 'Tối giản, có hình ảnh hỗ trợ. Microphone setup, b-roll, tông màu moodboard.',
};

// ── PANE 10: MOOD + PHONG CÁCH PHỤ (tách riêng theo mode) ────────────────────
const PANE10 = {
  business: {
    title:     'Mood · Phong cách phụ · Màu sắc',
    desc:      'Cho video bán hàng & thương hiệu cá nhân',
    moodLabel: '🎭 Mood cảm xúc (chọn 1–2)',
    subLabel:  '🎬 Phong cách quay / dựng (nhiều)',
    moods: [
      // Nhóm kéo hành động
      { label:'Hứng khởi / Năng lượng cao', tip:'Stop-scroll. Dùng cho video viral, promotion.' },
      { label:'Cấp bách / Thôi thúc',        tip:'Urgency, giới hạn. Mạnh cho CTA bán hàng.' },
      { label:'Tự tin / Quyết đoán',         tip:'Authority. Tốt cho thương hiệu cá nhân chuyên gia.' },
      { label:'Thuyết phục / Đáng tin',      tip:'Dẫn chứng thật, không hoa mỹ. Review & case study.' },
      // Nhóm kết nối cảm xúc
      { label:'Chân thật / Gần gũi',         tip:'Phá khoảng cách. Kể chuyện thật, không quảng cáo cứng.' },
      { label:'Cảm hứng / Truyền động lực',  tip:'Từ câu chuyện thật — không hô hào suông.' },
      { label:'Hài hước / Nhẹ nhàng',        tip:'Viral nhẹ, giải trí. Dùng cho hook bất ngờ.' },
      { label:'Mạnh mẽ / Dứt khoát',         tip:'Dành cho niche tài chính, gym, khởi nghiệp.' },
    ],
    substyles: [
      'Talking head',
      'POV (nhìn từ góc người dùng)',
      'B-roll + VO',
      'Text-driven / Kinetic',
      'Montage nhanh',
      'Unboxing / Demo sản phẩm',
      'Before & After',
      'Testimonial / Review thật',
      'Behind the scenes',
      'Storytelling cá nhân',
      'Documentary nhẹ',
      'Tutorial từng bước',
    ],
  },
  podcast: {
    title:     'Mood · Phong cách kể · Màu sắc',
    desc:      'Cho podcast solo & nội dung chiêm nghiệm',
    moodLabel: '🎭 Mood cảm xúc (chọn 1–2)',
    subLabel:  '🎙 Phong cách kể chuyện (nhiều)',
    moods: [
      // Chữa lành & Đồng hành — cốt lõi
      { label:'Đồng cảm / Thấu hiểu',       tip:'"Có người hiểu mình." Dùng khi chạm nỗi đau người nghe.' },
      { label:'Chữa lành / Ấm áp',           tip:'Xoa dịu, không phán xét. Tổn thương, tự trách.' },
      { label:'Nhẹ nhàng / Bình yên',        tip:'Tone thấp, không áp lực. Khi người nghe đang mệt.' },
      { label:'Tĩnh lặng / Nội tâm',         tip:'Hướng vào bên trong. Chiêm nghiệm, suy ngẫm chậm.' },
      { label:'Chấp nhận / Buông bỏ',        tip:'Không phán xét. Mạnh ở phần kết, tạo cảm giác nhẹ vai.' },
      { label:'Từ bi / Tự thương',           tip:'Nhìn mình bằng mắt người yêu mình. Thất bại, tự trách.' },
      // Chiêm nghiệm
      { label:'Sâu lắng / Chiêm nghiệm',     tip:'Dừng lại, nhìn kỹ. Không kết luận vội.' },
      { label:'Chân thật / Gần gũi',         tip:'Nói thật dù ngại. Xóa khoảng cách creator–listener.' },
      { label:'Tò mò / Khám phá',            tip:'Câu hỏi chưa có đáp án. Kéo người nghe cùng tìm hiểu.' },
      // Năng lượng nhẹ
      { label:'Hy vọng / Tia sáng',          tip:'Mở tia sáng cuối tập. Đặt sau khi đã chạm nhói.' },
      { label:'Hài hước nhẹ / Tự trêu',      tip:'Hài khô đời thường. Cân bằng khi tập quá nặng.' },
      { label:'Thảnh thơi / Chill',          tip:'Không deadline cảm xúc. Episode cuối tuần, daily vibe.' },
    ],
    substyles: [
      // Nhóm CỐT LÕI — DNA kênh
      { group:'CỐT LÕI', label:'Tự sự trải nghiệm',        tip:'Kể thật từ trải nghiệm — không lý thuyết.' },
      { group:'CỐT LÕI', label:'Confession / Bộc bạch',    tip:'Thú nhận điều ngại nói. Người nghe không cô đơn.' },
      { group:'CỐT LÕI', label:'Đảo chiều nhẹ',            tip:'"Tui tưởng… hóa ra…" — twist nhẹ tạo điểm nhớ.' },
      { group:'CỐT LÕI', label:'Tự đối thoại hai phe',     tip:'2 tiếng nói trong mình, không phán xét.' },
      { group:'CỐT LÕI', label:'Kể chậm — câu ngắn',       tip:'Nhịp chậm thấm hơn. Nhiều "…" và khoảng lặng.' },
      // Nhóm KỸ THUẬT
      { group:'KỸ THUẬT', label:'Nhật ký quan sát',         tip:'Nhìn hành vi từ xa rồi liên hệ bản thân.' },
      { group:'KỸ THUẬT', label:'Hài khô tự bóc phốt',     tip:'Tự phơi điểm xấu hài hước, không bi kịch hoá.' },
      { group:'KỸ THUẬT', label:'Suy niệm / Chánh niệm',   tip:'Dòng suy nghĩ ngẫu hứng. Episode cuối tháng/năm.' },
      { group:'KỸ THUẬT', label:'Phân tích nghịch lý',      tip:'Logic bóc tách điều ngược đời — tạo Aha moment.' },
      { group:'KỸ THUẬT', label:'Tâm sự ngại mà nói',       tip:'Nói điều người nghe cũng ngại — tạo kết nối sâu.' },
      { group:'KỸ THUẬT', label:'Tái định nghĩa khái niệm', tip:'Giải thích khái niệm khô bằng ngôn ngữ bình dân.' },
    ],
  },
};

// ── TÔNG MÀU CẢM XÚC (dùng chung cả 2 mode) ──────────────────────────────────
const COLOR_BADGES = [
  { label:'Ấm áp / Sang trọng',  color:'#D4A017' },
  { label:'Tối / Kịch tính',     color:'#666'    },
  { label:'Nhẹ nhàng / Nữ tính', color:'#f9b8d4' },
  { label:'Sạch / Tối giản',     color:'#ccc'    },
  { label:'Lạnh / Hiện đại',     color:'#5fc4f5' },
  { label:'Tươi / Chữa lành',    color:'#a8e6a3' },
  { label:'Mạnh / Năng lượng',   color:'#e08060' },
  { label:'Huyền bí / Sáng tạo', color:'#b8a0e8' },
];
