import React, { useState, useRef, useEffect } from 'react';
import { Team, MapChallenge } from '../types/game';
import { MAP_CHALLENGES } from '../data/gameData';
import { sounds } from '../utils/sound';
import { LiveRacingBar } from './LiveRacingBar';
import {
  MapPin,
  Navigation,
  Compass,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Clock,
  Sparkles,
  Trophy,
  Target,
  RotateCcw,
} from 'lucide-react';

interface Round3GeoMapProps {
  teams: Team[];
  activeTeamId: string;
  onUpdateTeamProgress: (progress: number, scoreIncrement: number) => void;
  onFinishRound: (finalRoundScore: number) => void;
}

export const Round3GeoMap: React.FC<Round3GeoMapProps> = ({
  teams,
  activeTeamId,
  onUpdateTeamProgress,
  onFinishRound,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Active challenge (starts with Hon Thom as primary)
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const challenge = MAP_CHALLENGES[currentChallengeIndex];

  // User pinned coordinates in percentage (0 - 100)
  const [userPin, setUserPin] = useState<{ x: number; y: number } | null>(null);
  const [isLockedIn, setIsLockedIn] = useState(false);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [roundScore, setRoundScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // 60s countdown
  const [feedback, setFeedback] = useState<{ title: string; desc: string; type: 'gold' | 'good' | 'miss' } | null>(null);

  // Countdown timer
  useEffect(() => {
    if (isLockedIn) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (userPin) handleLockIn();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isLockedIn, userPin]);

  // Click on map to place pin
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isLockedIn) return;
    if (!mapContainerRef.current) return;

    const rect = mapContainerRef.current.getBoundingClientRect();
    const x = Math.max(2, Math.min(98, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(2, Math.min(98, ((e.clientY - rect.top) / rect.height) * 100));

    setUserPin({ x, y });
    sounds.playPinDrop();
  };

  // Lock in position and calculate distance
  const handleLockIn = () => {
    if (!userPin) return;

    setIsLockedIn(true);
    sounds.playCropSnap();

    // Calculate real-world approximate distance on Phu Quoc Island:
    // Phu Quoc length is ~50 km (North-South, 100% Y ~= 50 km -> 1% Y ~= 0.5 km)
    // Phu Quoc width is ~25 km (West-East, 100% X ~= 25 km -> 1% X ~= 0.25 km)
    const dxKm = (userPin.x - challenge.targetX) * 0.28;
    const dyKm = (userPin.y - challenge.targetY) * 0.52;
    const dist = Math.round(Math.hypot(dxKm, dyKm) * 10) / 10;
    setDistanceKm(dist);

    // Score based on distance
    let calculatedScore = 0;
    let feedbackInfo: { title: string; desc: string; type: 'gold' | 'good' | 'miss' };

    if (dist <= 3.5) {
      // Golden accuracy
      calculatedScore = 1000 + Math.floor(timeLeft * 2);
      feedbackInfo = {
        title: '🌟 XUẤT SẮC! ĐỘ CHÍNH XÁC KINH NGẠC!',
        desc: `Sai lệch chỉ ${dist} km! Bạn đã cắm ghim chuẩn xác ngay khu vực ${challenge.targetName}.`,
        type: 'gold',
      };
      sounds.playSuccess();
    } else if (dist <= 8) {
      // Very close
      calculatedScore = 800 + Math.floor(timeLeft * 1.5);
      feedbackInfo = {
        title: '👏 RẤT GẦN VỚI TỌA ĐỘ CHUẨN!',
        desc: `Sai lệch ${dist} km. Vị trí thuộc khu vực phụ cận của ${challenge.targetName}.`,
        type: 'good',
      };
      sounds.playSuccess();
    } else if (dist <= 18) {
      // Moderate
      calculatedScore = 500;
      feedbackInfo = {
        title: '⚠️ LỆCH KHU VỰC ĐỊA BÀN!',
        desc: `Sai lệch ${dist} km. Bạn đã cắm lệch sang khu vực lân cận của Đảo Phú Quốc.`,
        type: 'miss',
      };
      sounds.playError();
    } else {
      // Completely wrong (e.g. pinned North instead of South)
      calculatedScore = 0;
      feedbackInfo = {
        title: '❌ 0 ĐIỂM! LẠC HƯỚNG HOÀN TOÀN!',
        desc: `Sai lệch tới ${dist} km! Hòn Thơm nằm ở cực Nam đảo, bạn đã thả ghim nhầm ra tận Bắc Đảo (Gành Dầu / Rạch Vẹm)!`,
        type: 'miss',
      };
      sounds.playError();
    }

    setRoundScore(calculatedScore);
    setFeedback(feedbackInfo);

    const progress = Math.max(10, Math.min(100, Math.round(100 - (dist * 2))));
    onUpdateTeamProgress(progress, calculatedScore);
  };

  const handleFinish = () => {
    onFinishRound(roundScore);
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Live Racing Bar */}
      <LiveRacingBar teams={teams} currentRound="ROUND_3" activeTeamId={activeTeamId} />

      {/* Round Header & GeoGuessr Challenge Banner */}
      <div className="bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-4 md:p-6 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                VÒNG 3: GEOGUESSR ĐỊNH VỊ PHÚ QUỐC
              </span>
              <span className="text-xs text-slate-400">• Tích hợp kiến thức địa danh Đảo Ngọc</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white">
              {challenge.title}
            </h2>
            <div className="mt-2 bg-emerald-950/60 border border-emerald-500/40 p-3 rounded-xl">
              <p className="text-sm md:text-base font-extrabold text-emerald-200 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>&quot;{challenge.prompt}&quot;</span>
              </p>
              <p className="text-xs text-slate-300 mt-1 italic">
                💡 Gợi ý: {challenge.hint}
              </p>
            </div>
          </div>

          {/* Timer & Live Round Score Box */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-medium">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Thời gian</span>
              </div>
              <div className={`font-mono text-xl font-black ${timeLeft <= 15 ? 'text-rose-400 animate-pulse' : 'text-white'}`}>
                {timeLeft}s
              </div>
            </div>

            <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl px-4 py-2 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-medium">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Điểm vòng 3</span>
              </div>
              <div className="font-mono text-xl font-black text-emerald-300">
                {roundScore} đ
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Map Arena & Evaluation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Phu Quoc Blank Island Map */}
        <div className="lg:col-span-8">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-extrabold text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                Bản đồ Đảo Ngọc Phú Quốc (Nhấp để cắm ghim dự đoán)
              </span>
              {userPin && !isLockedIn && (
                <span className="text-xs text-amber-400 font-bold animate-pulse">
                  Đã cắm ghim! Nhấp nút Chốt vị trí bên phải.
                </span>
              )}
            </div>

            {/* Interactive Vector Map Container */}
            <div
              ref={mapContainerRef}
              onClick={handleMapClick}
              className="relative w-full aspect-[4/5] sm:aspect-[1/1] max-h-[550px] mx-auto rounded-xl overflow-hidden cursor-crosshair select-none bg-slate-950 border-2 border-slate-800 shadow-2xl"
            >
              {/* Sea Waves Subtle Background Grid */}
              <div className="absolute inset-0 bg-[radial-gradient(#0e7490_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />

              {/* Phu Quoc Island High-Fidelity Silhouette SVG */}
              <svg viewBox="0 0 600 750" className="w-full h-full object-contain pointer-events-none">
                <defs>
                  {/* Island Land Gradient */}
                  <linearGradient id="islandLandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#064e3b" />
                    <stop offset="50%" stopColor="#065f46" />
                    <stop offset="100%" stopColor="#047857" />
                  </linearGradient>

                  {/* Sand Coast Outline Gradient */}
                  <linearGradient id="coastGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>

                {/* Ocean Ambient Glow */}
                <rect width="600" height="750" fill="#082f49" opacity="0.4" />

                {/* Compass Rose in upper left (Biển Tây) */}
                <g transform="translate(70, 70)" opacity="0.75">
                  <circle cx="0" cy="0" r="26" fill="none" stroke="#0891b2" strokeWidth="1.5" strokeDasharray="3 3" />
                  <polygon points="0,-24 6,-6 0,0" fill="#ef4444" />
                  <polygon points="0,-24 -6,-6 0,0" fill="#f87171" />
                  <polygon points="0,24 6,6 0,0" fill="#94a3b8" />
                  <polygon points="0,24 -6,6 0,0" fill="#cbd5e1" />
                  <polygon points="24,0 6,6 0,0" fill="#94a3b8" />
                  <polygon points="-24,0 -6,6 0,0" fill="#cbd5e1" />
                  <text x="0" y="-28" fill="#ef4444" fontSize="12" fontWeight="bold" textAnchor="middle">B</text>
                  <text x="0" y="38" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">N</text>
                  <text x="32" y="4" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">Đ</text>
                  <text x="-32" y="4" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">T</text>
                </g>

                {/* Scale Bar in lower left */}
                <g transform="translate(40, 700)" opacity="0.8">
                  <line x1="0" y1="0" x2="120" y2="0" stroke="#38bdf8" strokeWidth="3" />
                  <line x1="0" y1="-5" x2="0" y2="5" stroke="#38bdf8" strokeWidth="2" />
                  <line x1="60" y1="-3" x2="60" y2="3" stroke="#38bdf8" strokeWidth="2" />
                  <line x1="120" y1="-5" x2="120" y2="5" stroke="#38bdf8" strokeWidth="2" />
                  <text x="0" y="-8" fill="#94a3b8" fontSize="9" textAnchor="middle">0</text>
                  <text x="60" y="-8" fill="#94a3b8" fontSize="9" textAnchor="middle">10km</text>
                  <text x="120" y="-8" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">20 km</text>
                  <text x="60" y="16" fill="#64748b" fontSize="9" textAnchor="middle">Tỷ lệ xích đảo Phú Quốc</text>
                </g>

                {/* MAIN PHU QUOC ISLAND SILHOUETTE (Iconic Teardrop Shape) */}
                <g>
                  {/* Sandy Beach Coastline border */}
                  <path
                    d="M 280 40 
                       C 320 40, 390 60, 430 110
                       C 470 160, 480 230, 470 290
                       C 460 340, 430 380, 420 430
                       C 410 480, 420 540, 410 580
                       C 400 620, 360 650, 330 650
                       C 310 650, 290 620, 280 570
                       C 270 520, 260 480, 250 440
                       C 230 400, 210 360, 200 320
                       C 180 260, 190 200, 200 150
                       C 210 100, 240 50, 280 40 Z"
                    fill="url(#coastGrad)"
                    opacity="0.9"
                  />

                  {/* Lush Forest Core */}
                  <path
                    d="M 280 48 
                       C 315 48, 380 68, 418 115
                       C 455 162, 465 228, 455 285
                       C 445 332, 418 372, 408 422
                       C 398 472, 408 530, 398 570
                       C 388 608, 352 638, 325 638
                       C 305 638, 288 608, 278 560
                       C 268 512, 258 472, 248 432
                       C 230 395, 210 355, 200 315
                       C 182 258, 192 202, 202 155
                       C 212 108, 242 58, 280 48 Z"
                    fill="url(#islandLandGrad)"
                  />

                  {/* Topographic Mountain Ridges (Dãy núi Hàm Ninh & Vườn quốc gia) */}
                  <path
                    d="M 320 80 Q 360 160 350 250 Q 340 340 330 440"
                    stroke="#022c22"
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                    opacity="0.4"
                  />
                  <path
                    d="M 270 120 Q 290 200 280 290"
                    stroke="#022c22"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    opacity="0.3"
                  />
                </g>

                {/* SOUTHERN ARCHIPELAGO (Quần đảo An Thới & Hòn Thơm ở cực Nam!) */}
                <g id="an-thoi-islands">
                  {/* Hòn Thơm (Lớn nhất cụm đảo Nam) */}
                  <ellipse cx="312" cy="675" rx="22" ry="16" fill="url(#coastGrad)" />
                  <ellipse cx="312" cy="675" rx="19" ry="13" fill="url(#islandLandGrad)" />

                  {/* Hòn Móng Tay */}
                  <circle cx="270" cy="685" r="7" fill="url(#islandLandGrad)" />

                  {/* Hòn Gầm Ghì */}
                  <circle cx="345" cy="695" r="9" fill="url(#islandLandGrad)" />

                  {/* Hòn Mây Rút */}
                  <circle cx="320" cy="715" r="10" fill="url(#islandLandGrad)" />

                  {/* Hòn Dừa & Hòn Rỏi */}
                  <circle cx="310" cy="652" r="5" fill="url(#islandLandGrad)" />
                </g>

                {/* Northern Islets (Đảo Đồi Mồi & Mũi Gành Dầu) */}
                <circle cx="170" cy="190" r="5" fill="url(#islandLandGrad)" />
              </svg>

              {/* USER'S DROPPED PIN (Animated red map marker) */}
              {userPin && (
                <div
                  className="absolute pointer-events-none transition-all duration-200 -translate-x-1/2 -translate-y-full z-20"
                  style={{
                    left: `${userPin.x}%`,
                    top: `${userPin.y}%`,
                  }}
                >
                  <div className="relative flex flex-col items-center">
                    <span className="animate-ping absolute -bottom-1 w-4 h-4 rounded-full bg-rose-500 opacity-75"></span>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-600 to-red-400 border-2 border-white flex items-center justify-center text-white shadow-xl shadow-rose-600/60">
                      <MapPin className="w-5 h-5 fill-current" />
                    </div>
                    <div className="bg-slate-900/90 text-white font-mono text-[10px] font-black px-1.5 py-0.5 rounded border border-rose-500 mt-0.5 shadow">
                      Ghim của bạn
                    </div>
                  </div>
                </div>
              )}

              {/* TRUE TARGET PIN (Revealed when locked in) */}
              {isLockedIn && (
                <div
                  className="absolute pointer-events-none transition-all duration-300 -translate-x-1/2 -translate-y-full z-30 animate-bounce"
                  style={{
                    left: `${challenge.targetX}%`,
                    top: `${challenge.targetY}%`,
                  }}
                >
                  <div className="relative flex flex-col items-center">
                    <span className="animate-ping absolute -bottom-1 w-6 h-6 rounded-full bg-amber-400 opacity-90"></span>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 border-2 border-slate-950 flex items-center justify-center text-slate-950 shadow-2xl shadow-amber-400/80">
                      <Target className="w-6 h-6 stroke-[2.5]" />
                    </div>
                    <div className="bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap mt-0.5">
                      ★ {challenge.targetName}
                    </div>
                  </div>
                </div>
              )}

              {/* SVG Dashed Line connecting user pin to target when locked in */}
              {isLockedIn && userPin && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-15">
                  <line
                    x1={`${userPin.x}%`}
                    y1={`${userPin.y}%`}
                    x2={`${challenge.targetX}%`}
                    y2={`${challenge.targetY}%`}
                    stroke="#f59e0b"
                    strokeWidth="3"
                    strokeDasharray="6 6"
                  />
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* Right: Locking in & Evaluation Results */}
        <div className="lg:col-span-4 space-y-4">
          {/* Target Requirement Info */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                Mục tiêu định vị
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">
                {currentChallengeIndex + 1}/{MAP_CHALLENGES.length}
              </span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <h4 className="font-extrabold text-sm text-white">
                {challenge.targetName}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {challenge.description}
              </p>
            </div>

            {/* Instruction or Action Button */}
            {!isLockedIn ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-400">
                  {userPin
                    ? 'Bạn đã chọn xong vị trí. Hãy bấm "Chốt Vị Trí Ghim" để đối chiếu với tọa độ thật của Phú Quốc!'
                    : 'Hãy nhấp chuột vào một vị trí trên bản đồ đảo Phú Quốc bên trái.'}
                </p>

                <button
                  type="button"
                  disabled={!userPin}
                  onClick={handleLockIn}
                  className={`w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-black transition-all cursor-pointer shadow-lg ${
                    userPin
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-emerald-500/30 hover:scale-[1.02]'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>CHỐT VỊ TRÍ GHIM (LOCK IN)</span>
                </button>
              </div>
            ) : (
              /* Evaluation Feedback Screen */
              <div className="space-y-3">
                {feedback && (
                  <div
                    className={`p-3.5 rounded-xl border space-y-1.5 ${
                      feedback.type === 'gold'
                        ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                        : feedback.type === 'good'
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                        : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                    }`}
                  >
                    <div className="font-extrabold text-xs flex items-center gap-1.5">
                      <span>{feedback.title}</span>
                    </div>
                    <p className="text-xs leading-relaxed">{feedback.desc}</p>
                  </div>
                )}

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Khoảng cách sai lệch:</span>
                  <span className="font-mono text-base font-black text-cyan-300">
                    {distanceKm} km
                  </span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Điểm số nhận được:</span>
                  <span className="font-mono text-base font-black text-amber-300">
                    +{roundScore} đ
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleFinish}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-black py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-amber-500/30 hover:scale-[1.02] cursor-pointer"
                >
                  <Trophy className="w-4 h-4" />
                  <span>XEM BẢNG XẾP HẠNG & XUẤT PDF</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Quick geographical reminder for students */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 space-y-1.5">
            <div className="font-bold text-slate-200 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ghi nhớ địa lý Phú Quốc (Cẩm nang du lịch):</span>
            </div>
            <p>• <strong>Bắc Đảo:</strong> Vườn quốc gia, Bãi Dài, Gành Dầu, Rạch Vẹm.</p>
            <p>• <strong>Trung tâm:</strong> Phường Dương Đông, Dinh Cậu, Chợ đêm.</p>
            <p>• <strong>Nam Đảo:</strong> Quần đảo An Thới, Cáp treo Hòn Thơm, Bãi Sao, Bãi Khem.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
