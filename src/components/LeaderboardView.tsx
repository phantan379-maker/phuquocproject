import React, { useEffect, useState } from 'react';
import { Team } from '../types/game';
import { sounds } from '../utils/sound';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Medal,
  Sparkles,
  FileText,
  Printer,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  MapPin,
  Flame,
  Award,
  Download,
} from 'lucide-react';

interface LeaderboardViewProps {
  teams: Team[];
  activeTeamId: string;
  onRestart: () => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  teams,
  activeTeamId,
  onRestart,
}) => {
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [animatedBars, setAnimatedBars] = useState(false);

  // Sort teams descending by total score
  const sortedTeams = [...teams].sort((a, b) => b.totalScore - a.totalScore);
  const winner = sortedTeams[0];
  const maxScore = Math.max(1, winner?.totalScore || 3000);

  // Trigger fireworks and sound fanfare on mount
  useEffect(() => {
    sounds.playFanfare();

    // Trigger multiple confetti bursts
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#06b6d4', '#10b981', '#f59e0b', '#ec4899'],
    });
    fire(0.2, {
      spread: 60,
      colors: ['#38bdf8', '#fbbf24', '#a855f7'],
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      colors: ['#22d3ee', '#34d399', '#f43f5e'],
    });

    // Animate score racing bars
    const timer = setTimeout(() => {
      setAnimatedBars(true);
    }, 250);

    return () => clearTimeout(timer);
  }, []);

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fadeIn pb-12">
      {/* GRAND CHAMPION CELEBRATION HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950/60 via-slate-900/95 to-cyan-950/70 border-2 border-amber-500/50 p-6 md:p-10 text-center shadow-2xl shadow-amber-500/20">
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl mx-auto">
          {/* Winner Trophy Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
            <Trophy className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>VINH DANH NHÀ VÔ ĐỊCH BIÊN TẬP</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-tight">
            ĐỘI NGŨ BIÊN TẬP XUẤT SẮC NHẤT
          </h1>

          <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-400/30 max-w-xl mx-auto shadow-inner">
            <div className="text-4xl sm:text-5xl mb-2">{winner.avatarIcon}</div>
            <div className="text-2xl sm:text-3xl font-black text-amber-300 tracking-wide">
              {winner.name}
            </div>
            <div className="font-mono text-xl sm:text-2xl font-black text-white mt-1">
              Tổng điểm: <span className="text-amber-400">{winner.totalScore}</span> điểm
            </div>
          </div>

          {/* Core Lesson 4 Connection Message */}
          <div className="bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-sm sm:text-base font-extrabold p-3.5 rounded-xl shadow">
            🎉 CẨM NANG ĐÃ ĐƯỢC XUẤT BẢN THÀNH FILE PDF HOÀN CHỈNH!
            <div className="text-xs font-normal text-slate-300 mt-1">
              Áp dụng thành công trọn vẹn 4 Bài Tin học 10: Định dạng Styles, Cắt cúp ảnh, Bản đồ tích hợp & Xuất bản PDF.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowPdfModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black py-3 px-6 rounded-xl transition-all shadow-lg shadow-cyan-500/30 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>XEM CẨM NANG DU LỊCH PDF</span>
            </button>

            <button
              type="button"
              onClick={handlePrintPdf}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 px-5 rounded-xl transition-all border border-slate-700 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>IN / TẢI VỀ PDF</span>
            </button>

            <button
              type="button"
              onClick={onRestart}
              className="flex items-center gap-2 bg-slate-900/90 hover:bg-slate-800 text-slate-300 font-bold py-3 px-5 rounded-xl transition-all border border-slate-800 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-cyan-400" />
              <span>ĐẤU TRẬN MỚI</span>
            </button>
          </div>
        </div>
      </div>

      {/* CAR RACING / SPEEDBOAT ANIMATED SCORE BARS */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              <span>Đường Đua Điểm Số Các Tổ (Car Race Standing)</span>
            </h2>
            <p className="text-xs md:text-sm text-slate-400">
              Mô phỏng đường đua canô biển Phú Quốc dựa trên tổng điểm 3 vòng thi.
            </p>
          </div>

          <div className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-3 py-1.5 rounded-xl border border-cyan-500/30">
            Chung kết 4 Tổ
          </div>
        </div>

        {/* Animated Horizontal Race Tracks */}
        <div className="space-y-4">
          {sortedTeams.map((team, index) => {
            const isUser = team.id === activeTeamId;
            const rank = index + 1;
            const progressPercent = Math.min(100, Math.max(8, (team.totalScore / maxScore) * 100));

            return (
              <div
                key={team.id}
                className={`p-4 rounded-2xl border transition-all ${
                  rank === 1
                    ? 'bg-amber-950/30 border-amber-500/50 shadow-lg shadow-amber-500/10'
                    : isUser
                    ? 'bg-cyan-950/40 border-cyan-500/50'
                    : 'bg-slate-950/60 border-slate-800/80'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {/* Rank Badge */}
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs ${
                        rank === 1
                          ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/50'
                          : rank === 2
                          ? 'bg-slate-300 text-slate-950'
                          : rank === 3
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      #{rank}
                    </span>

                    <span className="text-2xl">{team.avatarIcon}</span>

                    <div>
                      <span className={`font-extrabold text-sm md:text-base ${isUser ? 'text-cyan-300' : 'text-white'}`}>
                        {team.name}
                      </span>
                      {isUser && (
                        <span className="ml-2 text-[10px] bg-cyan-500 text-slate-950 font-black px-1.5 py-0.2 rounded-full uppercase">
                          Tổ của bạn
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="text-slate-400 hidden sm:inline">
                      V1: {team.round1Score}đ | V2: {team.round2Score}đ | V3: {team.round3Score}đ
                    </span>
                    <span className="text-base font-black text-amber-300">
                      {team.totalScore} đ
                    </span>
                  </div>
                </div>

                {/* Race Track with animated moving boat/car avatar */}
                <div className="relative w-full h-8 bg-slate-900 rounded-xl overflow-hidden p-1 border border-slate-800">
                  {/* Subtle finish line check pattern */}
                  <div className="absolute right-0 top-0 bottom-0 w-4 bg-[repeating-linear-gradient(45deg,#fff,#fff_4px,#000_4px,#000_8px)] opacity-30 pointer-events-none" />

                  {/* Animated progressing bar */}
                  <div
                    className="h-full rounded-lg transition-all duration-1000 ease-out flex items-center justify-end pr-2 relative"
                    style={{
                      width: animatedBars ? `${progressPercent}%` : '5%',
                      backgroundColor: team.color,
                      boxShadow: `0 0 15px ${team.color}88`,
                    }}
                  >
                    <span className="text-xs font-bold text-slate-950 drop-shadow-sm flex items-center gap-1">
                      <span>{team.avatarIcon}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DETAILED LESSON 4 PDF PREVIEW MODAL */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden my-auto border-4 border-cyan-500 print:border-none print:m-0 print:p-0">
            {/* Modal Top Bar (Hidden during print) */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between print:hidden">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                <span className="font-extrabold text-base">
                  Bản In Cẩm Nang Du Lịch Phú Quốc (Sản Phẩm Đồ Án Tin Học 10)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrintPdf}
                  className="flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer shadow"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>In / Lưu PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPdfModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>

            {/* A4 BROCHURE DOCUMENT CONTENT */}
            <div id="printable-brochure" className="p-6 sm:p-10 space-y-8 bg-slate-50 font-sans">
              {/* PAGE 1: COVER PAGE */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center space-y-6">
                <div className="text-xs font-bold uppercase tracking-widest text-cyan-700">
                  SỞ GIÁO DỤC VÀ ĐÀO TẠO • BÁO CÁO DỰ ÁN TIN HỌC 10
                </div>

                {/* Title styled from Round 1 */}
                <h1 className="text-3xl sm:text-4xl font-black uppercase text-slate-900 tracking-tight leading-tight">
                  CẨM NANG DU LỊCH ĐẢO NGỌC PHÚ QUỐC 2026
                </h1>

                <p className="text-sm text-slate-600 max-w-xl mx-auto italic">
                  Ấn phẩm tổng hợp trải nghiệm khám phá thiên đường nhiệt đới lớn nhất Việt Nam được biên tập dựa trên ứng dụng kỹ năng Tin học 10.
                </p>

                {/* The Cropped Image from Round 2 */}
                <div className="max-w-lg mx-auto aspect-[16/10] rounded-xl overflow-hidden shadow-md border-2 border-slate-300 relative">
                  <svg viewBox="184 35 580 430" className="w-full h-full object-cover">
                    {/* Sky & Sun */}
                    <rect width="800" height="260" fill="#7dd3fc" />
                    <circle cx="680" cy="80" r="45" fill="#fef08a" />
                    {/* Clouds */}
                    <path d="M 450 90 Q 470 75 500 80 Q 530 65 560 85 Q 580 95 560 110 Q 520 115 460 110 Q 440 105 450 90 Z" fill="#ffffff" />
                    {/* Ocean */}
                    <rect y="220" width="800" height="150" fill="#0284c7" />
                    <path d="M 0 350 Q 250 345 500 355 T 800 350 L 800 500 L 0 500 Z" fill="#fde047" />
                    {/* Boat */}
                    <g transform="translate(420, 215)">
                      <path d="M 0 20 L 45 20 Q 55 25 50 32 L -5 32 Q -10 25 0 20 Z" fill="#b45309" />
                      <polygon points="23,3 42,12 23,17" fill="#ef4444" />
                    </g>
                    {/* Leaning Palm Tree */}
                    <g transform="translate(620, 140)">
                      <path d="M 50 360 Q 20 220 80 100" stroke="#78350f" strokeWidth="22" fill="none" />
                      <g fill="none" stroke="#15803d" strokeWidth="6">
                        <path d="M 80 100 Q 20 70 -50 90" />
                        <path d="M 80 100 Q 10 40 -30 20" />
                        <path d="M 80 100 Q 60 20 30 -40" />
                        <path d="M 80 100 Q 110 30 140 -20" />
                        <path d="M 80 100 Q 140 70 190 60" />
                        <path d="M 80 100 Q 150 110 210 130" />
                      </g>
                    </g>
                  </svg>
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                    Ảnh Bãi Sao đã xử lý cắt cúp (Bài 2)
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500 max-w-lg mx-auto">
                  <span>Ban biên tập: <strong>{winner.name}</strong></span>
                  <span>Điểm xuất sắc: <strong>{winner.totalScore} điểm</strong></span>
                  <span>Năm thực hiện: <strong>2026</strong></span>
                </div>
              </div>

              {/* PAGE 2: TABLE OF CONTENTS & OUTLINE (Bài 1 & 4) */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
                <div className="border-b-2 border-cyan-600 pb-2">
                  <h2 className="text-xl font-black text-cyan-800 uppercase">
                    MỤC LỤC TỰ ĐỘNG (TABLE OF CONTENTS - BÀI 4)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Hệ thống tự động trích xuất các mục dựa vào các kiểu Style Heading 1 & Heading 2 của Bài 1:
                  </p>
                </div>

                <div className="space-y-3 font-mono text-sm">
                  <div className="flex items-center justify-between border-b border-dotted border-slate-300 pb-1 font-bold text-slate-900">
                    <span>1. Vị trí địa lý và Khí hậu Đảo Ngọc (Heading 1)</span>
                    <span>Trang 02</span>
                  </div>

                  <div className="flex items-center justify-between border-b border-dotted border-slate-300 pb-1 font-bold text-slate-900">
                    <span>2. Điểm đến nổi bật & Trải nghiệm (Heading 1)</span>
                    <span>Trang 03</span>
                  </div>

                  <div className="flex items-center justify-between border-b border-dotted border-slate-300 pb-1 pl-6 text-slate-700">
                    <span>2.1. Tuyến cáp treo Hòn Thơm vượt biển dài nhất (Heading 2)</span>
                    <span>Trang 03</span>
                  </div>

                  <div className="flex items-center justify-between border-b border-dotted border-slate-300 pb-1 pl-6 text-slate-700">
                    <span>2.2. Bãi Sao - Dải lụa cát trắng mịn như kem (Heading 2)</span>
                    <span>Trang 04</span>
                  </div>

                  <div className="flex items-center justify-between border-b border-dotted border-slate-300 pb-1 font-bold text-slate-900">
                    <span>3. Thiên đường Ẩm thực Phú Quốc (Heading 1)</span>
                    <span>Trang 05</span>
                  </div>

                  <div className="flex items-center justify-between border-b border-dotted border-slate-300 pb-1 pl-6 text-slate-700">
                    <span>3.1. Bún quậy Kiến Xây - Đậm đà tự pha nước chấm (Heading 2)</span>
                    <span>Trang 05</span>
                  </div>
                </div>

                {/* Geography Map Integration Note from Round 3 */}
                <div className="p-4 rounded-xl bg-cyan-50 border border-cyan-200 text-xs text-cyan-900 space-y-1">
                  <div className="font-bold flex items-center gap-1 text-cyan-800">
                    <MapPin className="w-4 h-4 text-cyan-700" />
                    <span>Tọa độ du lịch tích hợp (Vòng 3 - GeoGuessr):</span>
                  </div>
                  <p>
                    • Tuyến Cáp treo Hòn Thơm xuất phát từ Ga An Thới (Nam Đảo), băng qua các hòn đảo thuộc quần đảo An Thới.
                  </p>
                  <p>
                    • Bãi Sao tọa lạc tại phía Đông Nam đảo với làn nước êm ả quanh năm.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
