import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CropBoundingBox, Team } from '../types/game';
import { CROP_CHALLENGE } from '../data/gameData';
import { sounds } from '../utils/sound';
import { LiveRacingBar } from './LiveRacingBar';
import {
  Crop,
  Check,
  AlertTriangle,
  RotateCcw,
  Eye,
  ArrowRight,
  Clock,
  Sparkles,
  Scissors,
  HelpCircle,
  Camera,
} from 'lucide-react';

interface Round2ImageCropProps {
  teams: Team[];
  activeTeamId: string;
  onUpdateTeamProgress: (progress: number, scoreIncrement: number) => void;
  onFinishRound: (finalRoundScore: number) => void;
}

export const Round2ImageCrop: React.FC<Round2ImageCropProps> = ({
  teams,
  activeTeamId,
  onUpdateTeamProgress,
  onFinishRound,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Crop box state in percentage (0 to 100)
  const [cropBox, setCropBox] = useState<CropBoundingBox | null>({
    x: 23,
    y: 8,
    width: 72,
    height: 84,
  });

  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [score, setScore] = useState(0);
  const [matchPercent, setMatchPercent] = useState(0);
  const [hasTrash, setHasTrash] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(75); // 75s countdown
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');

  // Countdown timer
  useEffect(() => {
    if (isConfirmed) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleConfirm();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isConfirmed]);

  // Compute evaluation when cropBox changes
  const evaluateCrop = useCallback((box: CropBoundingBox) => {
    const trash = CROP_CHALLENGE.trashZone;

    // Check if crop box intersects with trash zone
    const boxRight = box.x + box.width;
    const boxBottom = box.y + box.height;
    const trashRight = trash.x + trash.width;
    const trashBottom = trash.y + trash.height;

    const overlapsTrash = !(
      boxRight <= trash.x ||
      box.x >= trashRight ||
      boxBottom <= trash.y ||
      box.y >= trashBottom
    );

    setHasTrash(overlapsTrash);

    // Calculate match with ideal area
    // Ideal: X around 22-26, Y around 5-10, Width around 70-76, Height around 80-90
    let match = 0;
    if (overlapsTrash) {
      // Penalty for including trash
      match = Math.max(15, Math.min(45, Math.round(box.width * 0.4)));
      setFeedbackMsg('⚠️ Vẫn còn dính THÙNG RÁC ở góc dưới bên trái! Hãy thu hẹp mép trái sang phải (X > 22%).');
    } else {
      // Trash is cleanly avoided!
      // Evaluate coverage of beautiful scenic beach
      const xDiff = Math.abs(box.x - 24);
      const yDiff = Math.abs(box.y - 8);
      const wDiff = Math.abs(box.width - 72);
      const hDiff = Math.abs(box.height - 84);

      const penalty = (xDiff * 0.8) + (yDiff * 0.5) + (wDiff * 0.7) + (hDiff * 0.6);
      match = Math.max(50, Math.min(100, Math.round(100 - penalty)));

      if (match >= 90) {
        setFeedbackMsg('🌟 Xuất sắc! Đã loại bỏ hoàn toàn thùng rác và giữ trọn tỷ lệ vàng bờ biển Bãi Sao!');
      } else if (match >= 75) {
        setFeedbackMsg('👍 Tốt! Đã cắt bỏ được rác, khung hình tương đối hài hòa.');
      } else {
        setFeedbackMsg('ℹ️ Đã tránh được rác, nhưng khung hình hơi hẹp hoặc cắt mất hàng dừa.');
      }
    }

    setMatchPercent(match);
    const calculatedScore = Math.round(match * 9.5) + Math.floor(timeLeft * 1.5);
    setScore(calculatedScore);
    onUpdateTeamProgress(match, calculatedScore);
  }, [timeLeft, onUpdateTeamProgress]);

  // Initial evaluation
  useEffect(() => {
    if (cropBox) {
      evaluateCrop(cropBox);
    }
  }, []);

  // Mouse / Touch drawing handlers
  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return null;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
    return { x, y };
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (isConfirmed) return;
    const coords = getCoordinates(e);
    if (!coords) return;
    setIsDrawing(true);
    setStartPoint(coords);
    setCropBox({
      x: coords.x,
      y: coords.y,
      width: 0,
      height: 0,
    });
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !startPoint) return;
    const coords = getCoordinates(e);
    if (!coords) return;

    const x = Math.min(startPoint.x, coords.x);
    const y = Math.min(startPoint.y, coords.y);
    const width = Math.abs(coords.x - startPoint.x);
    const height = Math.abs(coords.y - startPoint.y);

    const newBox = { x, y, width, height };
    setCropBox(newBox);
  };

  const handlePointerUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setStartPoint(null);
    if (cropBox && (cropBox.width > 5 && cropBox.height > 5)) {
      evaluateCrop(cropBox);
      sounds.playCropSnap();
    }
  };

  const handleConfirm = () => {
    setIsConfirmed(true);
    sounds.playCropSnap();
    sounds.playSuccess();
    onFinishRound(score);
  };

  const resetToOptimal = () => {
    const optimal: CropBoundingBox = {
      x: 23,
      y: 7,
      width: 73,
      height: 86,
    };
    setCropBox(optimal);
    evaluateCrop(optimal);
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Live Racing Bar */}
      <LiveRacingBar teams={teams} currentRound="ROUND_2" activeTeamId={activeTeamId} />

      {/* Round Header & Instructions */}
      <div className="bg-slate-900/80 border border-teal-500/30 rounded-2xl p-4 md:p-6 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-teal-500/20 text-teal-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-teal-500/30">
                VÒNG 2: KIỂM TRA BÀI 2 TIN HỌC 10
              </span>
              <span className="text-xs text-slate-400">• Cắt ảnh thần tốc (Crop Box Simulator)</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white">
              Cắt Cúp Ảnh Bìa Bãi Sao Phú Quốc - Loại Bỏ Thùng Rác
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1">
              Dùng chuột <strong>vẽ khung chữ nhật (Crop box)</strong> trên bức ảnh để lấy trọn bờ biển cát trắng, hàng dừa xanh và <strong>LOẠI BỎ thùng rác góc trái</strong>!
            </p>
          </div>

          {/* Timer & Live Score Box */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-medium">
                <Clock className="w-3.5 h-3.5 text-teal-400" />
                <span>Thời gian</span>
              </div>
              <div className={`font-mono text-xl font-black ${timeLeft <= 15 ? 'text-rose-400 animate-pulse' : 'text-white'}`}>
                {timeLeft}s
              </div>
            </div>

            <div className="bg-slate-950/80 border border-teal-500/30 rounded-xl px-4 py-2 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-teal-400 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Độ chính xác</span>
              </div>
              <div className="font-mono text-xl font-black text-teal-300">
                {matchPercent}% ({score} đ)
              </div>
            </div>
          </div>
        </div>

        {/* Live Feedback banner */}
        <div className={`mt-3 p-3 rounded-xl border flex items-center justify-between text-xs font-medium ${
          hasTrash
            ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
            : matchPercent >= 85
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
            : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
        }`}>
          <div className="flex items-center gap-2">
            {hasTrash ? <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" /> : <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
            <span>{feedbackMsg}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetToOptimal}
              className="text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Gợi ý chuẩn</span>
            </button>
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="text-cyan-300 hover:text-white flex items-center gap-1 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-500/40 cursor-pointer"
            >
              <Eye className="w-3 h-3" />
              <span>{showPreview ? 'Xem ảnh gốc' : 'Xem ảnh sau cắt'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Interactive Canvas Viewport */}
        <div className="lg:col-span-8">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 md:p-4 shadow-xl">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs uppercase font-extrabold text-slate-400 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-teal-400" />
                Ảnh chụp Bãi Sao (Phú Quốc) - Kéo chuột để vẽ khung Crop
              </span>
              {cropBox && (
                <span className="font-mono text-xs text-cyan-400 font-bold">
                  Tọa độ: X:{Math.round(cropBox.x)}% Y:{Math.round(cropBox.y)}% | {Math.round(cropBox.width)}x{Math.round(cropBox.height)}%
                </span>
              )}
            </div>

            {/* Interactive Image Container */}
            <div
              ref={containerRef}
              onMouseDown={handlePointerDown}
              onMouseMove={handlePointerMove}
              onMouseUp={handlePointerUp}
              onTouchStart={handlePointerDown}
              onTouchMove={handlePointerMove}
              onTouchEnd={handlePointerUp}
              className="relative w-full aspect-[16/10] rounded-xl overflow-hidden cursor-crosshair select-none bg-slate-950 border border-slate-700 shadow-inner"
            >
              {/* High-Fidelity Scenic SVG Illustration of Bãi Sao with Beach, Palm Tree, and Trash Can */}
              <svg viewBox="0 0 800 500" className="w-full h-full object-cover">
                <defs>
                  {/* Sky gradient */}
                  <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="50%" stopColor="#7dd3fc" />
                    <stop offset="100%" stopColor="#bae6fd" />
                  </linearGradient>

                  {/* Ocean gradient */}
                  <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0284c7" />
                    <stop offset="40%" stopColor="#0ea5e9" />
                    <stop offset="80%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#2dd4bf" />
                  </linearGradient>

                  {/* Sand gradient */}
                  <linearGradient id="sandGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="60%" stopColor="#fde047" />
                    <stop offset="100%" stopColor="#facc15" />
                  </linearGradient>

                  {/* Trash can metallic/plastic gradient */}
                  <linearGradient id="trashGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#334155" />
                    <stop offset="50%" stopColor="#64748b" />
                    <stop offset="100%" stopColor="#1e293b" />
                  </linearGradient>
                </defs>

                {/* Sky */}
                <rect width="800" height="260" fill="url(#skyGrad)" />

                {/* Sun */}
                <circle cx="680" cy="80" r="45" fill="#fef08a" opacity="0.9" />
                <circle cx="680" cy="80" r="60" fill="#fef08a" opacity="0.3" />

                {/* Fluffy Clouds */}
                <g fill="#ffffff" opacity="0.85">
                  <path d="M 120 70 Q 140 50 170 55 Q 200 40 230 60 Q 260 55 270 75 Q 280 90 260 100 Q 230 105 180 100 Q 130 105 120 70 Z" />
                  <path d="M 450 90 Q 470 75 500 80 Q 530 65 560 85 Q 580 95 560 110 Q 520 115 460 110 Q 440 105 450 90 Z" />
                </g>

                {/* Distant Islet in Gulf of Thailand */}
                <path d="M 520 230 Q 580 205 640 230 Z" fill="#047857" opacity="0.7" />
                <path d="M 620 232 Q 670 215 720 232 Z" fill="#065f46" opacity="0.6" />

                {/* Ocean */}
                <rect y="220" width="800" height="150" fill="url(#oceanGrad)" />

                {/* Sea waves gentle curves */}
                <path d="M 0 250 Q 200 240 400 250 T 800 250 L 800 370 L 0 370 Z" fill="#0ea5e9" opacity="0.5" />
                <path d="M 0 290 Q 250 280 500 290 T 800 290 L 800 370 L 0 370 Z" fill="#06b6d4" opacity="0.6" />
                <path d="M 0 325 Q 200 315 450 330 T 800 325 L 800 370 L 0 370 Z" fill="#2dd4bf" opacity="0.7" />

                {/* White foamy shoreline */}
                <path d="M 0 348 Q 200 340 400 352 T 800 345" stroke="#ffffff" strokeWidth="6" fill="none" opacity="0.8" />
                <path d="M 0 355 Q 300 348 600 358 T 800 352" stroke="#ffffff" strokeWidth="4" fill="none" opacity="0.6" />

                {/* White Sandy Beach of Bãi Sao */}
                <path d="M 0 350 Q 250 345 500 355 T 800 350 L 800 500 L 0 500 Z" fill="url(#sandGrad)" />

                {/* Cute Wooden Fishing Boat */}
                <g transform="translate(420, 215)">
                  <path d="M 0 20 L 45 20 Q 55 25 50 32 L -5 32 Q -10 25 0 20 Z" fill="#b45309" />
                  <line x1="22" y1="20" x2="22" y2="2" stroke="#78350f" strokeWidth="2" />
                  <polygon points="23,3 42,12 23,17" fill="#ef4444" />
                </g>

                {/* Scenic Leaning Coconut Palm Tree (Right side - iconic Bãi Sao photo spot) */}
                <g transform="translate(620, 140)">
                  {/* Curved trunk */}
                  <path d="M 50 360 Q 20 220 80 100" stroke="#78350f" strokeWidth="24" fill="none" strokeLinecap="round" />
                  <path d="M 50 360 Q 20 220 80 100" stroke="#92400e" strokeWidth="18" fill="none" strokeLinecap="round" />

                  {/* Trunk texture rings */}
                  <circle cx="38" cy="270" r="10" fill="#451a03" opacity="0.2" />
                  <circle cx="48" cy="190" r="9" fill="#451a03" opacity="0.2" />
                  <circle cx="68" cy="130" r="8" fill="#451a03" opacity="0.2" />

                  {/* Palm fronds / leaves */}
                  <g fill="none" stroke="#15803d" strokeWidth="7" strokeLinecap="round">
                    <path d="M 80 100 Q 20 70 -50 90" />
                    <path d="M 80 100 Q 10 40 -30 20" />
                    <path d="M 80 100 Q 60 20 30 -40" />
                    <path d="M 80 100 Q 110 30 140 -20" />
                    <path d="M 80 100 Q 140 70 190 60" />
                    <path d="M 80 100 Q 150 110 210 130" />
                    <path d="M 80 100 Q 100 130 80 180" />
                    <path d="M 80 100 Q 40 140 -10 160" />
                  </g>

                  {/* Coconuts */}
                  <circle cx="75" cy="108" r="7" fill="#3f6212" />
                  <circle cx="88" cy="104" r="7" fill="#4d7c0f" />
                  <circle cx="82" cy="116" r="6" fill="#365314" />
                </g>

                {/* THE UGLY TRASH CAN & SCATTERED WASTE (Bottom-Left Corner: X: 25 to 160, Y: 335 to 470) */}
                <g id="ugly-trash-can" transform="translate(35, 345)">
                  {/* Warning highlight aura for classroom visualization */}
                  <ellipse cx="65" cy="75" rx="60" ry="35" fill="#ef4444" opacity="0.15" />

                  {/* Spilled garbage bags */}
                  <ellipse cx="20" cy="90" rx="18" ry="12" fill="#1e293b" />
                  <ellipse cx="110" cy="95" rx="14" ry="10" fill="#e2e8f0" />
                  <polygon points="105,90 120,85 115,100" fill="#cbd5e1" opacity="0.7" />
                  <circle cx="32" cy="98" r="5" fill="#f87171" />
                  <rect x="95" y="88" width="8" height="14" fill="#38bdf8" rx="2" transform="rotate(25 95 88)" />

                  {/* Trash Can Body */}
                  <rect x="40" y="30" width="50" height="65" rx="4" fill="url(#trashGrad)" />
                  <rect x="36" y="24" width="58" height="8" rx="2" fill="#475569" />
                  <line x1="50" y1="40" x2="50" y2="85" stroke="#1e293b" strokeWidth="2" />
                  <line x1="65" y1="40" x2="65" y2="85" stroke="#1e293b" strokeWidth="2" />
                  <line x1="80" y1="40" x2="80" y2="85" stroke="#1e293b" strokeWidth="2" />

                  {/* Trash Can Lid */}
                  <polygon points="38,24 50,12 80,12 92,24" fill="#334155" />
                  <rect x="58" y="8" width="14" height="4" rx="2" fill="#64748b" />

                  {/* Biohazard/Trash Symbol */}
                  <circle cx="65" cy="55" r="9" fill="#10b981" opacity="0.7" />
                  <path d="M 61 55 L 69 55 M 65 51 L 65 59" stroke="#ffffff" strokeWidth="2" />

                  {/* Floating Label: "VẬT THỂ THỪA / RÁC THẢI" */}
                  <g transform="translate(15, 0)">
                    <rect x="0" y="-18" width="105" height="18" rx="4" fill="#ef4444" opacity="0.9" />
                    <text x="52" y="-5" fill="#ffffff" fontSize="9" fontWeight="900" textAnchor="middle">
                      RÁC THẢI CẦN CẮT BỎ
                    </text>
                  </g>
                </g>
              </svg>

              {/* OVERLAY: Crop Box with Marching Ants & Rule of Thirds */}
              {cropBox && cropBox.width > 2 && cropBox.height > 2 && (
                <div
                  className="absolute pointer-events-none transition-all duration-75"
                  style={{
                    left: `${cropBox.x}%`,
                    top: `${cropBox.y}%`,
                    width: `${cropBox.width}%`,
                    height: `${cropBox.height}%`,
                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.65)',
                    border: '2px dashed #38bdf8',
                  }}
                >
                  {/* Rule of Thirds Grid (Bài 2: Bố cục 1/3) */}
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40">
                    <div className="border-r border-b border-white/60"></div>
                    <div className="border-r border-b border-white/60"></div>
                    <div className="border-b border-white/60"></div>
                    <div className="border-r border-b border-white/60"></div>
                    <div className="border-r border-b border-white/60"></div>
                    <div className="border-b border-white/60"></div>
                    <div className="border-r border-white/60"></div>
                    <div className="border-r border-white/60"></div>
                    <div></div>
                  </div>

                  {/* Corner Anchors */}
                  <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-cyan-500 rounded-sm"></div>
                  <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-cyan-500 rounded-sm"></div>
                  <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-cyan-500 rounded-sm"></div>
                  <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-cyan-500 rounded-sm"></div>

                  {/* Center Badge */}
                  <div className="absolute top-2 left-2 bg-slate-900/90 border border-cyan-400 text-cyan-300 font-mono text-[10px] font-black px-1.5 py-0.5 rounded shadow">
                    Crop Box
                  </div>
                </div>
              )}

              {/* Instructions Overlay if not drawn yet */}
              {!cropBox && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
                  <div className="bg-slate-900/90 border border-cyan-400 p-4 rounded-2xl text-center shadow-xl">
                    <Crop className="w-8 h-8 text-cyan-400 mx-auto mb-2 animate-bounce" />
                    <p className="font-extrabold text-sm text-white">Click và Kéo chuột để vẽ khung Crop</p>
                    <p className="text-xs text-slate-400">Loại bỏ thùng rác góc trái, lấy trọn vẻ đẹp Bãi Sao</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Real-time Evaluation, Cropped Preview & Confirmation */}
        <div className="lg:col-span-4 space-y-4">
          {/* Cropped Preview Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-wider text-teal-400 flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5" />
                Kết Quả Cắt Ảnh (Preview)
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                hasTrash ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                {hasTrash ? 'Dính Rác ❌' : 'Sạch Đẹp ✨'}
              </span>
            </div>

            {/* Live Cropped Viewport */}
            <div className="w-full aspect-[16/10] bg-slate-950 rounded-xl overflow-hidden border border-slate-700 relative flex items-center justify-center shadow-inner">
              {cropBox && cropBox.width > 10 ? (
                <div
                  className="w-full h-full relative overflow-hidden"
                  style={{
                    transform: 'scale(1)',
                  }}
                >
                  <svg
                    viewBox={`${(cropBox.x / 100) * 800} ${(cropBox.y / 100) * 500} ${(cropBox.width / 100) * 800} ${(cropBox.height / 100) * 500}`}
                    className="w-full h-full object-cover"
                  >
                    {/* Re-use vector graphics */}
                    <rect width="800" height="260" fill="url(#skyGrad)" />
                    <circle cx="680" cy="80" r="45" fill="#fef08a" opacity="0.9" />
                    <g fill="#ffffff" opacity="0.85">
                      <path d="M 120 70 Q 140 50 170 55 Q 200 40 230 60 Q 260 55 270 75 Q 280 90 260 100 Q 230 105 180 100 Q 130 105 120 70 Z" />
                      <path d="M 450 90 Q 470 75 500 80 Q 530 65 560 85 Q 580 95 560 110 Q 520 115 460 110 Q 440 105 450 90 Z" />
                    </g>
                    <path d="M 520 230 Q 580 205 640 230 Z" fill="#047857" opacity="0.7" />
                    <rect y="220" width="800" height="150" fill="url(#oceanGrad)" />
                    <path d="M 0 350 Q 250 345 500 355 T 800 350 L 800 500 L 0 500 Z" fill="url(#sandGrad)" />
                    <g transform="translate(420, 215)">
                      <path d="M 0 20 L 45 20 Q 55 25 50 32 L -5 32 Q -10 25 0 20 Z" fill="#b45309" />
                      <polygon points="23,3 42,12 23,17" fill="#ef4444" />
                    </g>
                    <g transform="translate(620, 140)">
                      <path d="M 50 360 Q 20 220 80 100" stroke="#78350f" strokeWidth="24" fill="none" strokeLinecap="round" />
                      <g fill="none" stroke="#15803d" strokeWidth="7" strokeLinecap="round">
                        <path d="M 80 100 Q 20 70 -50 90" />
                        <path d="M 80 100 Q 10 40 -30 20" />
                        <path d="M 80 100 Q 60 20 30 -40" />
                        <path d="M 80 100 Q 110 30 140 -20" />
                        <path d="M 80 100 Q 140 70 190 60" />
                        <path d="M 80 100 Q 150 110 210 130" />
                      </g>
                    </g>
                    {/* Trash can rendered only if cropped inside */}
                    <g transform="translate(35, 345)">
                      <rect x="40" y="30" width="50" height="65" rx="4" fill="#334155" />
                    </g>
                  </svg>
                </div>
              ) : (
                <span className="text-xs text-slate-500">Chưa vẽ vùng cắt</span>
              )}
            </div>

            {/* Evaluation Metrics Breakdown */}
            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Loại bỏ thùng rác:</span>
                <span className={`font-bold font-mono ${hasTrash ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {hasTrash ? 'Thất bại (-400đ)' : 'Hoàn hảo (+500đ)'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Bảo toàn cảnh biển & dừa:</span>
                <span className="font-bold text-cyan-300 font-mono">
                  {matchPercent}% khớp chuẩn
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Bonus Bố cục 1/3 (Bài 2):</span>
                <span className="font-bold text-amber-300 font-mono">
                  {matchPercent >= 80 ? '+150đ Đạt chuẩn' : '+50đ'}
                </span>
              </div>
            </div>
          </div>

          {/* Confirm Button Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Điểm chốt vòng 2:</span>
              <span className="font-mono text-xl font-black text-amber-300">{score} đ</span>
            </div>

            <button
              type="button"
              onClick={handleConfirm}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-400 hover:to-cyan-300 text-slate-950 font-black py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-teal-500/30 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Scissors className="w-4 h-4" />
              <span>CHỐT VẾT CẮT & TIẾP TỤC (VÒNG 3)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[11px] text-center text-slate-400">
              Ảnh sau cắt sẽ được đưa trực tiếp vào Bìa Cẩm nang PDF ở phần kết!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
