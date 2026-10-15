import React, { useState } from 'react';

interface GameContainerStaticProps {
  teamName?: string;
  score?: number;
  timerSeconds?: number;
  currentGameIndex?: number; // 1 to 5
}

export const GameContainerStatic: React.FC<GameContainerStaticProps> = ({
  teamName = 'Tổ 1',
  score = 0,
  timerSeconds = 45,
  currentGameIndex = 1,
}) => {
  const [activeGame, setActiveGame] = useState<number>(currentGameIndex);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      id="game-container"
      className="relative min-h-screen w-full flex flex-col justify-between p-3 sm:p-5 select-none font-sans overflow-x-hidden bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.45)), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80')`,
      }}
    >
      {/* 1. THANH TRẠNG THÁI NHỎ CỐ ĐỊNH Ở TRÊN CÙNG (SLIM STATUS BAR) */}
      <header className="w-full max-w-4xl mx-auto h-11 bg-white/90 backdrop-blur-md border border-white/70 rounded-2xl px-4 flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-800 shadow-md shrink-0 mb-3">
        {/* Tên Tổ */}
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
          <span className="font-extrabold text-sky-900">{teamName}</span>
        </div>

        {/* Điểm Số */}
        <div className="flex items-center gap-1.5 font-mono">
          <span className="text-slate-500 text-xs">Điểm:</span>
          <span className="font-black text-amber-600 text-base">{score}</span>
          <span className="text-slate-500 text-xs">đ</span>
        </div>

        {/* Đồng Hồ Đếm Ngược Game Hiện Tại */}
        <div className="flex items-center gap-1.5 bg-sky-100 text-sky-900 px-3 py-1 rounded-xl font-mono font-black text-xs sm:text-sm border border-sky-200">
          <span>⏱</span>
          <span>{formatTimer(timerSeconds)}</span>
        </div>

        {/* Quick Debug Switcher giữa 5 Game (Dành cho kiểm thử static HTML) */}
        <div className="hidden md:flex items-center gap-1 text-[11px] font-mono">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setActiveGame(num)}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                activeGame === num ? 'bg-sky-600 text-white font-bold' : 'text-slate-500 hover:bg-slate-200'
              }`}
            >
              G{num}
            </button>
          ))}
        </div>
      </header>

      {/* 2. KHUNG NỘI DUNG CHÍNH (GLASSMORPHISM PANEL) */}
      <main className="w-full max-w-4xl mx-auto flex-1 flex flex-col justify-center min-h-0">
        <div className="bg-white/88 backdrop-blur-md border border-white/80 rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl space-y-4">

          {/* =========================================================================
              GAME 1: KÉO THẢ DÀN Ý (BÀI 1 & 4)
             ========================================================================= */}
          <div id="game-1" className={activeGame === 1 ? 'block space-y-5' : 'hidden'}>
            <div className="text-center space-y-1">
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-3 py-0.5 rounded-full border border-sky-200">
                Minigame 1 • Định Dạng Văn Bản (Bài 1)
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Kéo Thả Dàn Ý Cẩm Nang Phú Quốc
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
                Kéo các thẻ Style ở trên thả vào đúng 3 câu văn bản bên dưới để xây dựng dàn ý chuẩn.
              </p>
            </div>

            {/* 3 Khối Style: Heading 1, Heading 2, Normal */}
            <div className="p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Các Thẻ Kiểu Mẫu (Kéo hoặc Chạm):
              </div>
              <div className="grid grid-cols-3 gap-2.5" id="game1-tags">
                <div
                  draggable
                  id="tag-heading-1"
                  className="bg-blue-600 text-white font-bold py-2.5 px-3 rounded-xl text-center text-xs sm:text-sm cursor-grab active:cursor-grabbing shadow-sm border border-blue-700 hover:brightness-105"
                >
                  Heading 1
                </div>
                <div
                  draggable
                  id="tag-heading-2"
                  className="bg-teal-600 text-white font-bold py-2.5 px-3 rounded-xl text-center text-xs sm:text-sm cursor-grab active:cursor-grabbing shadow-sm border border-teal-700 hover:brightness-105"
                >
                  Heading 2
                </div>
                <div
                  draggable
                  id="tag-normal"
                  className="bg-slate-700 text-white font-bold py-2.5 px-3 rounded-xl text-center text-xs sm:text-sm cursor-grab active:cursor-grabbing shadow-sm border border-slate-800 hover:brightness-105"
                >
                  Normal
                </div>
              </div>
            </div>

            {/* 3 Vùng Trống Dàn Ý Cẩm Nang */}
            <div className="space-y-3" id="game1-dropzones">
              {/* Vùng 1: Cần Heading 1 */}
              <div
                data-expected="Heading 1"
                className="p-3.5 rounded-2xl border-2 border-dashed border-slate-300 bg-white hover:border-sky-500 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="text-xs sm:text-sm font-semibold text-slate-800">
                  &quot;1. VỊ TRÍ ĐỊA LÝ VÀ KHÍ HẬU ĐẢO NGỌC&quot;
                </div>
                <div className="min-w-[120px] h-9 border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-center text-xs text-slate-400 font-medium px-3 shrink-0">
                  Thả thẻ vào đây...
                </div>
              </div>

              {/* Vùng 2: Cần Heading 2 */}
              <div
                data-expected="Heading 2"
                className="p-3.5 rounded-2xl border-2 border-dashed border-slate-300 bg-white hover:border-sky-500 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="text-xs sm:text-sm font-semibold text-slate-800 pl-3 border-l-2 border-teal-400">
                  &quot;1.1. Khí hậu nhiệt đới gió mùa biển đảo&quot;
                </div>
                <div className="min-w-[120px] h-9 border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-center text-xs text-slate-400 font-medium px-3 shrink-0">
                  Thả thẻ vào đây...
                </div>
              </div>

              {/* Vùng 3: Cần Normal */}
              <div
                data-expected="Normal"
                className="p-3.5 rounded-2xl border-2 border-dashed border-slate-300 bg-white hover:border-sky-500 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="text-xs sm:text-sm text-slate-600 pl-3 italic">
                  &quot;Phú Quốc sở hữu nhiệt độ trung bình 27°C mát mẻ quanh năm.&quot;
                </div>
                <div className="min-w-[120px] h-9 border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-center text-xs text-slate-400 font-medium px-3 shrink-0">
                  Thả thẻ vào đây...
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              GAME 2: CẮT ẢNH THẦN TỐC (BÀI 2 - XỬ LÝ HÌNH ẢNH)
             ========================================================================= */}
          <div id="game-2" className={activeGame === 2 ? 'block space-y-4' : 'hidden'}>
            <div className="text-center space-y-1">
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-100 px-3 py-0.5 rounded-full border border-teal-200">
                Minigame 2 • Cắt Cúp Ảnh Bãi Sao (Bài 2)
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Vẽ Khung Crop Box Cắt Bỏ Rác Thải
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
                Kéo chuột hoặc vuốt trên ảnh để vẽ khung nét đứt. Giữ trọn bờ cát và biển, loại bỏ thùng rác góc trái!
              </p>
            </div>

            {/* Container Ảnh Bãi Sao có thùng rác ở góc trái */}
            <div className="relative w-full aspect-[16/10] max-h-[380px] mx-auto rounded-2xl overflow-hidden border-2 border-slate-300 bg-slate-900 cursor-crosshair select-none shadow-inner" id="crop-canvas-wrapper">
              {/* Minh họa vector sắc nét bờ biển Bãi Sao */}
              <svg viewBox="0 0 800 500" className="w-full h-full object-cover">
                {/* Bầu trời & Mây */}
                <rect width="800" height="250" fill="#7dd3fc" />
                <circle cx="680" cy="70" r="40" fill="#fef08a" />
                <path d="M 120 70 Q 150 50 180 55 Q 210 40 240 60 Q 260 85 220 95 Q 160 100 120 70 Z" fill="#ffffff" opacity="0.85" />
                <path d="M 450 80 Q 480 65 510 70 Q 540 60 560 80 Q 550 100 480 105 Q 440 95 450 80 Z" fill="#ffffff" opacity="0.85" />
                {/* Biển xanh Phú Quốc */}
                <rect y="210" width="800" height="150" fill="#0284c7" />
                <path d="M 0 310 Q 200 300 400 315 T 800 310 L 800 500 L 0 500 Z" fill="#0ea5e9" opacity="0.4" />
                {/* Bờ cát trắng Bãi Sao */}
                <path d="M 0 330 Q 250 325 500 335 T 800 330 L 800 500 L 0 500 Z" fill="#fde047" />
                {/* Thuyền buồm */}
                <g transform="translate(420, 205)">
                  <path d="M 0 20 L 40 20 Q 50 25 45 30 L -5 30 Z" fill="#b45309" />
                  <polygon points="20,5 38,15 20,18" fill="#ef4444" />
                </g>
                {/* Hàng dừa nghiêng Bãi Sao (Phải) */}
                <g transform="translate(620, 130)">
                  <path d="M 45 370 Q 15 220 75 100" stroke="#78350f" strokeWidth="20" fill="none" strokeLinecap="round" />
                  <g fill="none" stroke="#15803d" strokeWidth="6">
                    <path d="M 75 100 Q 20 70 -40 90" />
                    <path d="M 75 100 Q 10 40 -25 20" />
                    <path d="M 75 100 Q 60 20 25 -30" />
                    <path d="M 75 100 Q 110 30 140 -15" />
                    <path d="M 75 100 Q 140 70 190 60" />
                  </g>
                </g>
                {/* THÙNG RÁC GÓC TRÁI (Cần loại bỏ khi crop) */}
                <g id="trash-target" transform="translate(40, 340)">
                  <rect x="25" y="25" width="45" height="55" rx="3" fill="#334155" />
                  <polygon points="22,25 32,15 62,15 72,25" fill="#475569" />
                  <ellipse cx="47" cy="85" rx="35" ry="15" fill="#ef4444" opacity="0.25" />
                  <text x="47" y="5" fill="#ef4444" fontSize="10" fontWeight="bold" textAnchor="middle">
                    RÁC THẢI
                  </text>
                </g>
              </svg>

              {/* Khung Crop Box nét đứt mô phỏng */}
              <div
                id="crop-box"
                className="absolute border-2 border-dashed border-amber-400 bg-amber-400/10 pointer-events-none"
                style={{ left: '22%', top: '8%', width: '74%', height: '84%' }}
              >
                <div className="absolute top-1 left-1 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  Crop Box: 74% x 84%
                </div>
              </div>
            </div>

            {/* Nút chốt vết cắt */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-500">Tọa độ chuẩn: Loại bỏ rác X &lt; 20%</span>
              <button
                type="button"
                id="btn-confirm-crop"
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm py-2.5 px-5 rounded-xl cursor-pointer shadow-sm"
              >
                Xác Nhận Vết Cắt ✓
              </button>
            </div>
          </div>

          {/* =========================================================================
              GAME 3: GEOGUESSR PHÚ QUỐC (ĐỊNH VỊ BẢN ĐỒ)
             ========================================================================= */}
          <div id="game-3" className={activeGame === 3 ? 'block space-y-4' : 'hidden'}>
            <div className="text-center space-y-1">
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-0.5 rounded-full border border-emerald-200">
                Minigame 3 • GeoGuessr Bản Đồ Phú Quốc
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Thả Ghim Định Vị Cáp Treo Hòn Thơm
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
                Chạm hoặc nhấp vào bản đồ Đảo Ngọc bên dưới để thả icon Ghim vị trí Hòn Thơm (Nam Đảo).
              </p>
            </div>

            {/* Khung Bản Đồ Phú Quốc Vector */}
            <div className="relative w-full aspect-[4/3] max-h-[380px] mx-auto rounded-2xl overflow-hidden border-2 border-slate-300 bg-sky-900/10 cursor-crosshair select-none shadow-inner" id="map-canvas-wrapper">
              <svg viewBox="0 0 600 650" className="w-full h-full object-contain pointer-events-none">
                {/* La bàn Bắc */}
                <g transform="translate(60, 60)" opacity="0.8">
                  <circle cx="0" cy="0" r="22" fill="none" stroke="#0284c7" strokeWidth="2" strokeDasharray="3 3" />
                  <polygon points="0,-20 5,-5 0,0" fill="#ef4444" />
                  <polygon points="0,20 5,5 0,0" fill="#94a3b8" />
                  <text x="0" y="-24" fill="#ef4444" fontSize="11" fontWeight="bold" textAnchor="middle">B</text>
                </g>
                {/* Dáng Đảo Ngọc Phú Quốc */}
                <path
                  d="M 280 40 C 350 50, 420 90, 440 160 C 460 230, 440 330, 420 420 C 400 500, 390 560, 360 600 C 330 610, 300 580, 290 540 C 270 480, 240 400, 220 330 C 200 240, 210 140, 240 70 Z"
                  fill="#047857"
                  stroke="#facc15"
                  strokeWidth="5"
                />
                {/* Quần đảo An Thới ở phía Nam (Nơi có Hòn Thơm) */}
                <ellipse cx="340" cy="625" rx="20" ry="14" fill="#047857" stroke="#facc15" strokeWidth="3" />
                <circle cx="310" cy="635" r="7" fill="#047857" />
                <circle cx="370" cy="640" r="9" fill="#047857" />
              </svg>

              {/* Icon Ghim Vị Trí (Location Pin) thả absolute */}
              <div
                id="map-pin"
                className="absolute -translate-x-1/2 -translate-y-full transition-all pointer-events-none"
                style={{ left: '56%', top: '92%' }}
              >
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs shadow-lg border-2 border-white">
                    📍
                  </div>
                  <span className="bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow mt-0.5 whitespace-nowrap">
                    Ghim Của Bạn
                  </span>
                </div>
              </div>
            </div>

            {/* Nút chốt tọa độ */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-500 font-mono">Tọa độ: X: 56% | Y: 92%</span>
              <button
                type="button"
                id="btn-confirm-pin"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm py-2.5 px-5 rounded-xl cursor-pointer shadow-sm"
              >
                Chốt Vị Trí Ghim ✓
              </button>
            </div>
          </div>

          {/* =========================================================================
              GAME 4: CỨU HỘ VĂN BẢN (BÀI 1 NÂNG CAO - SỬA LỖI ĐỊNH DẠNG)
             ========================================================================= */}
          <div id="game-4" className={activeGame === 4 ? 'block space-y-4' : 'hidden'}>
            <div className="text-center space-y-1">
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-3 py-0.5 rounded-full border border-purple-200">
                Minigame 4 • Cứu Hộ Văn Bản (Bài 1 Nâng Cao)
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Phát Hiện &amp; Sửa 3 Lỗi Định Dạng Sai
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
                Chạm vào các từ khóa bị lỗi (lệch font, sai màu, cỡ chữ bất thường) để mở công cụ Word sửa lại.
              </p>
            </div>

            {/* Đoạn văn bản chứa 3 từ khóa lỗi định dạng */}
            <div className="p-5 bg-white rounded-2xl border-2 border-slate-200 text-slate-800 leading-relaxed text-sm sm:text-base space-y-3 shadow-inner">
              <p>
                Phú Quốc là hòn đảo ngọc lớn nhất Việt Nam, thuộc tỉnh Kiên Giang. Nơi đây nổi tiếng với bãi biển cát trắng mịn màng mang tên{' '}
                {/* Lỗi 1: Sai màu đỏ chói & in nghiêng lố */}
                <span
                  id="error-word-1"
                  className="font-bold text-rose-600 underline decoration-wavy cursor-pointer bg-rose-50 px-1 rounded hover:bg-rose-100 border border-rose-300"
                >
                  BÃI SAO PHÚ QUỐC
                </span>
                . Du khách khi đến đây có thể trải nghiệm tuyến cáp treo vượt biển ba dây dài nhất thế giới nối từ An Thới ra đảo{' '}
                {/* Lỗi 2: Lệch font chữ Comic Sans / Cỡ chữ quá to */}
                <span
                  id="error-word-2"
                  className="font-serif italic text-xl text-purple-700 cursor-pointer bg-purple-50 px-1 rounded hover:bg-purple-100 border border-purple-300"
                >
                  Hòn Thơm xinh đẹp
                </span>
                . Về ẩm thực đặc sản, món ăn độc đáo bậc nhất mà ai cũng muốn thử là{' '}
                {/* Lỗi 3: Chữ Highlight nền xanh lè & lệch kích cỡ */}
                <span
                  id="error-word-3"
                  className="bg-yellow-300 text-slate-950 font-mono text-xs px-1.5 py-0.5 rounded cursor-pointer hover:bg-yellow-400 border border-yellow-400"
                >
                  bún quậy Kiến Xây
                </span>{' '}
                với chén nước chấm tự pha đậm đà.
              </p>
            </div>

            {/* Modal Pop-up Công Cụ Word Sửa Lỗi */}
            <div id="word-tool-modal" className="p-4 bg-slate-900 text-white rounded-2xl space-y-3 shadow-lg">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-300">Công cụ Microsoft Word / Google Docs:</span>
                <span className="text-slate-400">Chọn 1 thao tác đúng</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  className="bg-slate-800 hover:bg-sky-600 text-white text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-700 transition-colors text-left"
                >
                  1. Clear Formatting (Xóa định dạng rác)
                </button>
                <button
                  type="button"
                  className="bg-slate-800 hover:bg-sky-600 text-white text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-700 transition-colors text-left"
                >
                  2. Áp dụng Style chuẩn Normal
                </button>
                <button
                  type="button"
                  className="bg-slate-800 hover:bg-sky-600 text-white text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-700 transition-colors text-left"
                >
                  3. Đồng bộ Màu &amp; Cỡ chữ 14pt
                </button>
              </div>
            </div>
          </div>

          {/* =========================================================================
              GAME 5: KIẾN TRÚC SƯ CẨM NANG (TRƯỢT / HOÁN ĐỔI KHỐI 3X3 - BÀI 3)
             ========================================================================= */}
          <div id="game-5" className={activeGame === 5 ? 'block space-y-4' : 'hidden'}>
            <div className="text-center space-y-1">
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-0.5 rounded-full border border-amber-200">
                Minigame 5 • Bố Cục Trang In Cẩm Nang (Bài 3 &amp; 4)
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Sắp Xếp Lưới 3x3 Trang Cẩm Nang
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
                Chạm lần lượt vào 2 khối bất kỳ để hoán đổi vị trí (Swap) cho nhau, tạo thành bố cục cẩm nang hoàn chỉnh!
              </p>
            </div>

            {/* CSS Grid 3x3 Chứa 9 Khối Nội Dung & Ảnh */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 aspect-square max-w-[420px] mx-auto p-3 bg-slate-100 rounded-2xl border-2 border-slate-300" id="puzzle-grid">
              {/* Ô 1: Tiêu đề Bìa */}
              <div className="bg-sky-600 text-white rounded-xl p-2 sm:p-3 flex flex-col justify-center items-center text-center cursor-pointer shadow-sm hover:scale-[1.02] transition-transform">
                <span className="text-[10px] font-mono text-sky-200">#1</span>
                <span className="font-black text-xs sm:text-sm">TIÊU ĐỀ BÌA</span>
              </div>

              {/* Ô 2: Ảnh Bìa Bãi Sao */}
              <div className="bg-amber-500 text-white rounded-xl p-2 sm:p-3 flex flex-col justify-center items-center text-center cursor-pointer shadow-sm hover:scale-[1.02] transition-transform">
                <span className="text-[10px] font-mono text-amber-200">#2</span>
                <span className="font-black text-xs sm:text-sm">ẢNH BÌA BIỂN</span>
              </div>

              {/* Ô 3: Nhóm Biên Tập */}
              <div className="bg-slate-700 text-white rounded-xl p-2 sm:p-3 flex flex-col justify-center items-center text-center cursor-pointer shadow-sm hover:scale-[1.02] transition-transform">
                <span className="text-[10px] font-mono text-slate-400">#3</span>
                <span className="font-black text-xs sm:text-sm">TÁC GIẢ</span>
              </div>

              {/* Ô 4: Mục Lục */}
              <div className="bg-teal-600 text-white rounded-xl p-2 sm:p-3 flex flex-col justify-center items-center text-center cursor-pointer shadow-sm hover:scale-[1.02] transition-transform">
                <span className="text-[10px] font-mono text-teal-200">#4</span>
                <span className="font-black text-xs sm:text-sm">MỤC LỤC</span>
              </div>

              {/* Ô 5: Nội Dung Chương 1 */}
              <div className="bg-white border-2 border-slate-300 text-slate-800 rounded-xl p-2 sm:p-3 flex flex-col justify-center items-center text-center cursor-pointer shadow-sm hover:scale-[1.02] transition-transform">
                <span className="text-[10px] font-mono text-slate-400">#5</span>
                <span className="font-black text-xs sm:text-sm">ĐỊA LÝ</span>
              </div>

              {/* Ô 6: Ảnh Hòn Thơm */}
              <div className="bg-amber-600 text-white rounded-xl p-2 sm:p-3 flex flex-col justify-center items-center text-center cursor-pointer shadow-sm hover:scale-[1.02] transition-transform">
                <span className="text-[10px] font-mono text-amber-200">#6</span>
                <span className="font-black text-xs sm:text-sm">CÁP TREO</span>
              </div>

              {/* Ô 7: Nội Dung Ẩm Thực */}
              <div className="bg-white border-2 border-slate-300 text-slate-800 rounded-xl p-2 sm:p-3 flex flex-col justify-center items-center text-center cursor-pointer shadow-sm hover:scale-[1.02] transition-transform">
                <span className="text-[10px] font-mono text-slate-400">#7</span>
                <span className="font-black text-xs sm:text-sm">ẨM THỰC</span>
              </div>

              {/* Ô 8: Bản Đồ Phú Quốc */}
              <div className="bg-emerald-600 text-white rounded-xl p-2 sm:p-3 flex flex-col justify-center items-center text-center cursor-pointer shadow-sm hover:scale-[1.02] transition-transform">
                <span className="text-[10px] font-mono text-emerald-200">#8</span>
                <span className="font-black text-xs sm:text-sm">BẢN ĐỒ</span>
              </div>

              {/* Ô 9: Lời Kết &amp; Xuất PDF */}
              <div className="bg-sky-800 text-white rounded-xl p-2 sm:p-3 flex flex-col justify-center items-center text-center cursor-pointer shadow-sm hover:scale-[1.02] transition-transform">
                <span className="text-[10px] font-mono text-sky-300">#9</span>
                <span className="font-black text-xs sm:text-sm">XUẤT BẢN PDF</span>
              </div>
            </div>

            <div className="text-center pt-1">
              <span className="text-xs text-slate-500">Mục tiêu: Đưa đúng 9 phần tử vào lưới 3x3 trang cẩm nang</span>
            </div>
          </div>

        </div>
      </main>

      {/* 3. FOOTER ĐIỀU HƯỚNG CHUNG */}
      <footer className="w-full max-w-4xl mx-auto py-2 text-center text-xs text-white/90 font-medium drop-shadow shrink-0">
        Đấu trường thực hành Tin học 10 • Tự động chuyển màn khi hết giờ hoặc xong bài
      </footer>
    </div>
  );
};
