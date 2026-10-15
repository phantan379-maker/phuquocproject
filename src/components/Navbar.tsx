import React from 'react';
import { GameRound, Team } from '../types/game';
import {
  Volume2,
  VolumeX,
  Compass,
  FileText,
  Crop,
  MapPin,
  Trophy,
  RotateCcw,
  Presentation,
  Users,
} from 'lucide-react';
import { sounds } from '../utils/sound';

interface NavbarProps {
  currentRound: GameRound;
  roomCode: string;
  activeTeam?: Team;
  isMuted: boolean;
  onToggleMute: () => void;
  onRestart: () => void;
  isProjectorView: boolean;
  onToggleProjectorView: () => void;
  onSelectRound?: (round: GameRound) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRound,
  roomCode,
  activeTeam,
  isMuted,
  onToggleMute,
  onRestart,
  isProjectorView,
  onToggleProjectorView,
  onSelectRound,
}) => {
  const steps: { round: GameRound; label: string; icon: React.ReactNode; shortLabel: string }[] = [
    { round: 'LOBBY', label: 'Phòng chờ (Lobby)', icon: <Users className="w-3.5 h-3.5" />, shortLabel: 'Lobby' },
    { round: 'ROUND_1', label: 'V1: Dàn ý (Styles)', icon: <FileText className="w-3.5 h-3.5" />, shortLabel: 'V1 Dàn ý' },
    { round: 'ROUND_2', label: 'V2: Cắt ảnh (Crop)', icon: <Crop className="w-3.5 h-3.5" />, shortLabel: 'V2 Cắt ảnh' },
    { round: 'ROUND_3', label: 'V3: GeoGuessr', icon: <MapPin className="w-3.5 h-3.5" />, shortLabel: 'V3 Bản đồ' },
    { round: 'LEADERBOARD', label: 'Bảng xếp hạng & PDF', icon: <Trophy className="w-3.5 h-3.5" />, shortLabel: 'BXH & PDF' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-xl border-b border-cyan-500/20 px-3 md:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Room PIN */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-cyan-500/30">
              <Compass className="w-5 h-5 text-slate-950 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm md:text-base tracking-tight bg-gradient-to-r from-cyan-300 via-teal-200 to-emerald-300 bg-clip-text text-transparent">
                  Đấu Trường Phú Quốc
                </span>
                <span className="bg-cyan-500/20 text-cyan-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-cyan-500/30">
                  Tin học 10
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Mã phòng:</span>
                <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20 tracking-wider">
                  {roomCode}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Round Progress Breadcrumb */}
        <nav aria-label="Tiến trình vòng thi" className="hidden lg:flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 rounded-xl p-1 shadow-inner">
          {steps.map((s, idx) => {
            const isActive = currentRound === s.round;
            return (
              <button
                key={s.round}
                type="button"
                onClick={() => onSelectRound && onSelectRound(s.round)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 shadow-md shadow-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span>{s.icon}</span>
                <span>{s.shortLabel}</span>
              </button>
            );
          })}
        </nav>

        {/* Team indicator & Controls */}
        <div className="flex items-center gap-2">
          {activeTeam && (
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-xl text-xs">
              <span className="text-base">{activeTeam.avatarIcon}</span>
              <span className="font-bold text-slate-200 hidden sm:inline">{activeTeam.name}</span>
              <span className="font-mono text-cyan-400 font-bold ml-1">{activeTeam.totalScore} đ</span>
            </div>
          )}

          {/* Projector / Host view toggle */}
          <button
            type="button"
            onClick={onToggleProjectorView}
            title={isProjectorView ? 'Chuyển sang Chế độ Tổ làm bài' : 'Chuyển sang Màn hình Máy chiếu'}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              isProjectorView
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Presentation className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{isProjectorView ? 'Máy chiếu ON' : 'Máy chiếu'}</span>
          </button>

          {/* Sound Mute */}
          <button
            type="button"
            onClick={onToggleMute}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-300 transition-colors"
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* Reset */}
          <button
            type="button"
            onClick={onRestart}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 transition-colors"
            title="Làm mới trận đấu"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
