import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/sound';

interface PlayerCompletionViewProps {
  teamName: string;
  finalScore: number;
  rank?: number;
  onReset?: () => void;
}

interface RauMaParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
}

// Icon Lá Rau Má (Centella Asiatica) đặc trưng: hình cánh quạt/thận khía viền răng cưa, gân lá toả tròn
export const RauMaIcon: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block drop-shadow-sm select-none ${className}`}
  >
    {/* Cuống lá rau má */}
    <path
      d="M 32 46 Q 34 56 36 62"
      stroke="#16a34a"
      strokeWidth="3.5"
      strokeLinecap="round"
      fill="none"
    />
    {/* Phiến lá hình thận xoè tròn mép khía lượn sóng */}
    <path
      d="M 32 46 
         C 26 47, 18 45, 12 39 
         C 6 33, 4 23, 10 15 
         C 15 7, 26 5, 32 10 
         C 38 5, 49 7, 54 15 
         C 60 23, 58 33, 52 39 
         C 46 45, 38 47, 32 46 Z"
      fill="#22c55e"
      stroke="#15803d"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    {/* Vệt sáng bóng trên mặt lá */}
    <path
      d="M 18 19 C 24 12, 30 11, 33 13 C 28 17, 20 23, 18 19 Z"
      fill="#86efac"
      opacity="0.8"
    />
    {/* Gân lá toả tròn từ gốc lá */}
    <path
      d="M 32 45 Q 32 25 32 12"
      stroke="#15803d"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M 32 43 Q 22 30 15 20"
      stroke="#15803d"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M 32 43 Q 42 30 49 20"
      stroke="#15803d"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M 32 45 Q 20 40 12 33"
      stroke="#15803d"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M 32 45 Q 44 40 52 33"
      stroke="#15803d"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const PlayerCompletionView: React.FC<PlayerCompletionViewProps> = ({
  teamName,
  finalScore,
  rank,
  onReset,
}) => {
  const [particles, setParticles] = useState<RauMaParticle[]>([]);

  // Hàm bắn chùm icon rau má bay tứ phía
  const blastRauMa = (count = 35) => {
    sounds.playFanfare();
    const newBatch: RauMaParticle[] = [];
    const originX = window.innerWidth / 2;
    const originY = window.innerHeight * 0.7;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 7 + Math.random() * 14;
      newBatch.push({
        id: Math.random() + Date.now(),
        x: originX + (Math.random() - 0.5) * 120,
        y: originY + (Math.random() - 0.5) * 60,
        size: 28 + Math.random() * 32,
        vx: Math.cos(angle) * speed,
        vy: -Math.abs(Math.sin(angle) * speed * 1.3) - 3,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 15,
        opacity: 1,
      });
    }

    setParticles((prev) => [...prev.slice(-80), ...newBatch]);

    // Bắn thêm confetti màu xanh lá & vàng
    try {
      confetti({
        particleCount: 50,
        spread: 100,
        origin: { y: 0.7 },
        colors: ['#22c55e', '#16a34a', '#86efac', '#eab308', '#38bdf8'],
      });
    } catch {
      // ignore
    }
  };

  // Khởi động khi load trang
  useEffect(() => {
    blastRauMa(45);
    const t = setTimeout(() => blastRauMa(30), 1200);
    return () => clearTimeout(t);
  }, []);

  // Vòng lặp vật lý rơi của các icon rau má
  useEffect(() => {
    if (particles.length === 0) return;

    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.38, // Trọng lực
            vx: p.vx * 0.98, // Ma sát không khí
            rotation: p.rotation + p.rotationSpeed,
            opacity: p.y > window.innerHeight * 0.9 ? p.opacity - 0.04 : p.opacity,
          }))
          .filter((p) => p.opacity > 0 && p.y < window.innerHeight + 100)
      );
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [particles]);

  return (
    <div
      className="relative min-h-screen w-full flex flex-col justify-center items-center p-4 sm:p-6 overflow-hidden select-none bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(6, 78, 59, 0.88), rgba(15, 23, 42, 0.95)), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80')`,
      }}
    >
      {/* Container hiển thị các icon rau má đang bay & rơi lơ lửng */}
      <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute transition-transform will-change-transform"
            style={{
              left: `${p.x}px`,
              top: `${p.y}px`,
              opacity: p.opacity,
              transform: `translate(-50%, -50%) rotate(${p.rotation}deg)`,
            }}
          >
            <RauMaIcon size={p.size} />
          </div>
        ))}
      </div>

      {/* Thẻ vinh danh chính giữa màn hình (Glassmorphism & Viền Ngọc Lục Bảo) */}
      <div className="relative z-20 w-full max-w-lg bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-emerald-400 text-center space-y-5 animate-fadeIn">
        {/* Huy hiệu đỉnh */}
        <div className="relative inline-block mx-auto">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-xl mx-auto ring-4 ring-emerald-200">
            <RauMaIcon size={64} className="animate-bounce" />
          </div>
          <span className="absolute -bottom-2 -right-2 bg-amber-400 text-slate-950 font-black text-xs px-2.5 py-1 rounded-full shadow-md border-2 border-white">
            100% HOÀN TẤT
          </span>
        </div>

        {/* Tiêu đề chúc mừng */}
        <div className="space-y-1.5">
          <span className="inline-block text-[11px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3.5 py-1 rounded-full border border-emerald-300">
            Đảo Ngọc Phú Quốc • Đấu Trường Tin Học 10
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Chúc Mừng {teamName}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Tổ của bạn đã xuất sắc vượt qua toàn bộ 5 thử thách biên tập Cẩm Nang Du Lịch Phú Quốc!
          </p>
        </div>

        {/* Khung điểm số & danh hiệu */}
        <div className="grid grid-cols-2 gap-3 p-4 bg-emerald-50/90 rounded-2xl border border-emerald-200">
          <div className="text-center space-y-0.5">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
              Tổng Điểm Chung Cuộc
            </span>
            <div className="font-mono text-3xl sm:text-4xl font-black text-emerald-700">
              {finalScore} <span className="text-base font-normal">đ</span>
            </div>
          </div>

          <div className="text-center space-y-0.5 border-l border-emerald-200 pl-3">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
              Danh Hiệu Vinh Danh
            </span>
            <div className="text-xs sm:text-sm font-black text-amber-700 pt-1">
              {rank && rank <= 3 ? `Top ${rank} Xuất Chúng` : 'Biên Tập Viên Xuất Sắc'}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold block">
              Huy hiệu Lá Rau Má Vàng 🍀
            </span>
          </div>
        </div>

        {/* 5 huy hiệu bài học đã đạt */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Kỹ năng Tin Học 10 đã áp dụng thành công:
          </span>
          <div className="flex flex-wrap justify-center gap-1.5 text-[11px] font-bold">
            <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-lg border border-purple-200">
              ✓ Định dạng Styles
            </span>
            <span className="bg-sky-100 text-sky-800 px-2 py-0.5 rounded-lg border border-sky-200">
              ✓ Cắt cúp ảnh Bãi Sao
            </span>
            <span className="bg-teal-100 text-teal-800 px-2 py-0.5 rounded-lg border border-teal-200">
              ✓ Định vị Hòn Thơm
            </span>
            <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-lg border border-indigo-200">
              ✓ Cứu hộ định dạng Word
            </span>
            <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-lg border border-amber-200">
              ✓ Cấu trúc 3x3 Cẩm nang
            </span>
          </div>
        </div>

        {/* Nút hành động tương tác: Bắn icon rau má */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <button
            type="button"
            onClick={() => blastRauMa(40)}
            className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 active:scale-95 text-white font-black text-sm py-3.5 px-4 rounded-2xl shadow-lg cursor-pointer transition-all flex items-center justify-center gap-2"
          >
            <RauMaIcon size={20} />
            <span>BẮN MƯA RAU MÁ! 🍀</span>
          </button>

          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="bg-slate-800 hover:bg-slate-900 active:scale-95 text-white font-bold text-xs sm:text-sm py-3.5 px-4 rounded-2xl transition-all cursor-pointer whitespace-nowrap"
            >
              Chơi Lại Trận Mới
            </button>
          )}
        </div>

        <p className="text-[11px] text-slate-400 italic">
          Điểm số của bạn đã được cập nhật trực tiếp lên Màn hình Bảng Xếp Hạng của Quản trò!
        </p>
      </div>
    </div>
  );
};
