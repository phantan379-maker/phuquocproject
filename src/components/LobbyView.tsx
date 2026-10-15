import React, { useState, useEffect } from 'react';
import { Team } from '../types/game';
import {
  Clock,
  Play,
  Sparkles,
  Layers,
  Crop,
  MapPin,
  FileCheck,
  CheckCircle2,
  Tv,
} from 'lucide-react';
import { sounds } from '../utils/sound';

interface LobbyViewProps {
  roomCode: string;
  teams: Team[];
  activeTeamId: string;
  onSelectTeam: (teamId: string) => void;
  onStartGame: () => void;
  timerSecondsRemaining: number;
  isProjectorView: boolean;
}

export const LobbyView: React.FC<LobbyViewProps> = ({
  roomCode,
  teams,
  activeTeamId,
  onSelectTeam,
  onStartGame,
  timerSecondsRemaining,
  isProjectorView,
}) => {
  const [customTeamName, setCustomTeamName] = useState('');
  const [editingCustom, setEditingCustom] = useState(false);

  // Play tick sound when timer reaches last 5 seconds
  useEffect(() => {
    if (timerSecondsRemaining <= 5 && timerSecondsRemaining > 0) {
      sounds.playTick();
    } else if (timerSecondsRemaining === 0) {
      sounds.playWhistle();
    }
  }, [timerSecondsRemaining]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const activeTeam = teams.find((t) => t.id === activeTeamId);

  return (
    <div className="space-y-6 md:space-y-8 animate-fadeIn">
      {/* Hero Banner with Kahoot/Quizizz ocean vibe */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-900/60 via-slate-900/90 to-blue-950/80 border border-cyan-500/30 p-6 md:p-10 shadow-2xl shadow-cyan-950/60">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="text-center lg:text-left space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Chuyên Đề Dự Án: Cẩm Nang Du Lịch Phú Quốc</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
              ĐẤU TRƯỜNG BIÊN TẬP{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                TIN HỌC 10
              </span>
            </h1>

            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Mô phỏng quy trình sản xuất ấn phẩm Cẩm nang du lịch Đảo Ngọc Phú Quốc qua 3 vòng minigame
              kéo thả - cắt ảnh - định vị bản đồ và tự động xuất bản file PDF!
            </p>
          </div>

          {/* Global Sync Timer Card */}
          <div className="w-full sm:w-auto bg-slate-950/80 border-2 border-cyan-500/40 rounded-2xl p-5 md:p-6 text-center shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
              <Clock className="w-4 h-4 animate-spin-slow" />
              <span>Global Sync Timer</span>
            </div>

            <div className="font-mono text-4xl md:text-5xl font-black tracking-widest text-white mb-2 text-glow">
              {formatTimer(timerSecondsRemaining)}
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Tự động bắt đầu trận đấu khi đồng hồ về 00:00
            </p>

            <button
              type="button"
              onClick={() => {
                sounds.playWhistle();
                onStartGame();
              }}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black py-3 px-6 rounded-xl transition-all shadow-lg shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>BẮT ĐẦU NGAY (START NOW)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Classroom Setup & PIN Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black text-xl">
            #
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase font-semibold">Mã phòng thi đấu (PIN)</div>
            <div className="text-xl font-mono font-black text-amber-300 tracking-wider">{roomCode}</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black text-xl">
            <Tv className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase font-semibold">Chế độ hiển thị</div>
            <div className="text-sm font-bold text-slate-200">
              {isProjectorView ? 'Màn hình Máy Chiếu Lớp Học' : 'Màn hình Học sinh / Nhóm làm bài'}
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-xl">
            4
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase font-semibold">Số tổ tham gia đua tranh</div>
            <div className="text-sm font-bold text-emerald-300">4 Tổ thi đua trực tiếp</div>
          </div>
        </div>
      </div>

      {/* Choose Team Section */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
              <span>Đội Ngũ Biên Tập Các Tổ</span>
            </h2>
            <p className="text-xs md:text-sm text-slate-400">
              Nhấp chọn tổ của bạn trước khi trận đấu bắt đầu. Điểm số của tổ sẽ được đua thời gian thực!
            </p>
          </div>

          {activeTeam && (
            <div className="flex items-center gap-2 bg-cyan-500/15 border border-cyan-500/30 px-3 py-1.5 rounded-xl text-xs font-bold text-cyan-300">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Đang chọn: {activeTeam.name}</span>
            </div>
          )}
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {teams.map((team) => {
            const isSelected = team.id === activeTeamId;
            return (
              <button
                key={team.id}
                type="button"
                onClick={() => {
                  sounds.playTick();
                  onSelectTeam(team.id);
                }}
                className={`relative p-5 rounded-2xl text-left transition-all duration-200 border-2 cursor-pointer flex flex-col justify-between h-44 ${
                  isSelected
                    ? 'bg-gradient-to-b from-cyan-950/90 to-slate-900 border-cyan-400 shadow-xl shadow-cyan-500/20 scale-[1.03]'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl p-2 rounded-xl bg-slate-800/80 shadow-inner">
                      {team.avatarIcon}
                    </span>
                    {isSelected && (
                      <span className="bg-cyan-500 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                        Tổ của bạn
                      </span>
                    )}
                  </div>
                  <h3 className="font-extrabold text-base text-white">{team.name}</h3>
                  <p className="text-xs text-slate-400 font-medium">{team.mascot}</p>
                </div>

                <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-800/60 font-mono">
                  <span className="text-slate-400">Trạng thái:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Sẵn sàng
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4 Lessons Integration Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase">
            <Layers className="w-4 h-4" />
            <span>Vòng 1 (Bài 1 & 4)</span>
          </div>
          <h4 className="font-extrabold text-sm text-white">Kéo thả Dàn ý (Styles)</h4>
          <p className="text-xs text-slate-400">
            Ráp đúng các thẻ Title, Heading 1, Heading 2, Normal vào văn bản thô để chuẩn bị mục lục tự động.
          </p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-teal-400 font-bold text-xs uppercase">
            <Crop className="w-4 h-4" />
            <span>Vòng 2 (Bài 2)</span>
          </div>
          <h4 className="font-extrabold text-sm text-white">Cắt ảnh Thần Tốc (Crop)</h4>
          <p className="text-xs text-slate-400">
            Dùng chuột kéo khung crop box loại bỏ thùng rác góc trái, giữ bờ cát trắng và biển xanh ngọc.
          </p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase">
            <MapPin className="w-4 h-4" />
            <span>Vòng 3 (Địa danh)</span>
          </div>
          <h4 className="font-extrabold text-sm text-white">GeoGuessr Phú Quốc</h4>
          <p className="text-xs text-slate-400">
            Thả ghim định vị Cáp treo Hòn Thơm và các địa danh trên bản đồ Đảo Ngọc không tên.
          </p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase">
            <FileCheck className="w-4 h-4" />
            <span>Chung cuộc (Bài 4)</span>
          </div>
          <h4 className="font-extrabold text-sm text-white">Xuất bản Cẩm nang PDF</h4>
          <p className="text-xs text-slate-400">
            Bảng xếp hạng trực tiếp dạng đua xe và xuất bản ngay file PDF ấn phẩm hoàn chỉnh để nộp bài!
          </p>
        </div>
      </div>
    </div>
  );
};
