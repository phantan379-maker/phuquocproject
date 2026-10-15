import React from 'react';
import { Team } from '../types/game';

interface HostLobbyViewProps {
  roomCode: string;
  teams: Team[];
  timerSecondsRemaining: number;
  onStartNow: () => void;
}

export const HostLobbyView: React.FC<HostLobbyViewProps> = ({
  roomCode,
  teams,
  timerSecondsRemaining,
  onStartNow,
}) => {
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const readyCount = teams.filter((t) => t.isReady).length;

  return (
    <div className="w-full min-h-[calc(100vh-60px)] flex flex-col justify-between p-4 md:p-8 space-y-6">
      {/* Top Bar: Room PIN, Title, Ready Count */}
      <header className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-4 md:p-6 backdrop-blur-md neon-border-cyan">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-400/50 flex items-center justify-center text-cyan-400 font-black text-2xl shadow-lg">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-cyan-400">
                MÁY CHIẾU LỚP HỌC (HOST VIEW)
              </span>
              <span className="bg-cyan-500/20 text-cyan-300 text-[10px] font-mono px-2 py-0.5 rounded-full border border-cyan-500/40">
                TIN HỌC 10
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
              ĐẤU TRƯỜNG BIÊN TẬP • CẨM NANG PHÚ QUỐC
            </h1>
          </div>
        </div>

        {/* PIN & Player URL info */}
        <div className="flex items-center gap-4">
          <div className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-right">
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Mã PIN Tham Gia</div>
            <div className="font-mono text-2xl font-black text-amber-300 tracking-wider neon-glow-amber">
              {roomCode}
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-right">
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Trạng Thái Sẵn Sàng</div>
            <div className="font-mono text-xl font-bold text-emerald-400">
              {readyCount}/{teams.length} Tổ
            </div>
          </div>
        </div>
      </header>

      {/* Centerpiece: Giant Countdown Clock & Global Sync */}
      <section className="flex flex-col items-center justify-center text-center py-6 md:py-10">
        <div className="inline-flex items-center gap-2 bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 text-xs md:text-sm font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4 shadow-lg shadow-cyan-500/10">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span>GLOBAL SYNC TIMER • ĐẾM NGƯỢC XUẤT PHÁT</span>
        </div>

        {/* Giant Timer Display */}
        <div className="font-mono text-7xl sm:text-8xl md:text-9xl font-black tracking-widest text-white mb-4 neon-glow-cyan">
          {formatTimer(timerSecondsRemaining)}
        </div>

        <p className="text-slate-400 text-sm md:text-base max-w-xl mb-6">
          Hệ thống tự động kích hoạt <strong className="text-cyan-300">Game 1: Dàn ý (Drag & Drop)</strong> cho tất cả các tổ khi đồng hồ về <span className="font-mono text-amber-400 font-bold">00:00</span> mà không cần host bấm nút!
        </p>

        <button
          type="button"
          onClick={onStartNow}
          className="cursor-pointer bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black py-3.5 px-8 rounded-2xl transition-all shadow-xl shadow-cyan-500/30 hover:scale-105 active:scale-95 text-base tracking-wide"
        >
          BẮT ĐẦU NGAY (START NOW) 🚀
        </button>
      </section>

      {/* Bottom Section: Real-time Live Progress Bar of all 8 Teams */}
      <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 md:p-6 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-cyan-400">
              ĐƯỜNG ĐUA TIẾN ĐỘ 8 TỔ THI ĐẤU (LIVE TEAM TRACK)
            </span>
          </div>
          <span className="text-xs text-slate-400">8/8 Vị trí xuất phát</span>
        </div>

        {/* 8 Teams Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {teams.map((team, idx) => {
            return (
              <div
                key={team.id}
                className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 flex flex-col justify-between transition-all hover:border-slate-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{team.avatarIcon}</span>
                    <div>
                      <div className="font-extrabold text-sm text-white flex items-center gap-1.5">
                        <span>{team.name}</span>
                        <span className="text-[10px] text-slate-400">#{idx + 1}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">{team.mascot}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        team.isReady
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {team.isReady ? 'Sẵn sàng ✓' : 'Đang vào...'}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Điểm: {team.score}đ</span>
                    <span>Tiến độ: {team.progress}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.max(5, team.progress)}%`,
                        backgroundColor: team.color,
                        boxShadow: `0 0 8px ${team.color}88`,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
