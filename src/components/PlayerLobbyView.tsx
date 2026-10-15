import React from 'react';
import { Team } from '../types/game';

interface PlayerLobbyViewProps {
  teams: Team[];
  activeTeamId: string;
  onSelectTeam: (teamId: string) => void;
  onToggleReady: () => void;
  timerSecondsRemaining: number;
}

export const PlayerLobbyView: React.FC<PlayerLobbyViewProps> = ({
  teams,
  activeTeamId,
  onSelectTeam,
  onToggleReady,
  timerSecondsRemaining,
}) => {
  const activeTeam = teams.find((t) => t.id === activeTeamId) || teams[0];

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-[100dvh] w-full max-w-md mx-auto flex flex-col justify-between bg-slate-950 text-slate-100 overflow-hidden select-none p-3 pb-4">
      {/* 40PX SLIM HEADER (YÊU CẦU BẮT BUỘC: h-10/40px, NO SCROLL) */}
      <header className="h-10 w-full bg-slate-900/95 border-b border-cyan-500/30 px-3 flex items-center justify-between text-xs font-mono rounded-xl shrink-0">
        <div className="flex items-center gap-1.5 font-bold text-cyan-300 truncate">
          <span>{activeTeam.avatarIcon}</span>
          <span className="truncate">{activeTeam.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-amber-300 font-bold">{activeTeam.score} đ</span>
          <span className="text-emerald-400 font-extrabold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
            #{activeTeam.currentRank}
          </span>
        </div>
      </header>

      {/* COMPACT BODY: FITS COMPLETELY IN VIEWPORT WITHOUT SCROLLING */}
      <main className="flex-1 flex flex-col justify-around py-2 min-h-0 space-y-2">
        {/* Active Team Highlight Card */}
        <div
          className="p-3.5 rounded-2xl border-2 text-center transition-all bg-gradient-to-b from-slate-900 to-slate-950 shadow-xl"
          style={{ borderColor: activeTeam.color }}
        >
          <div className="text-4xl mb-1 filter drop-shadow-md">{activeTeam.avatarIcon}</div>
          <h2 className="text-lg font-black text-white tracking-wide">{activeTeam.name}</h2>
          <p className="text-xs text-slate-400 font-medium">{activeTeam.mascot}</p>
        </div>

        {/* 8-Team Selector Matrix (Compact 4x2 grid) */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 mb-1.5 flex items-center justify-between px-1">
            <span>CHỌN TỔ CỦA BẠN (8 TỔ)</span>
            <span className="text-slate-400 font-mono text-[10px]">Chạm để đổi</span>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {teams.map((team) => {
              const isSelected = team.id === activeTeamId;
              return (
                <button
                  key={team.id}
                  type="button"
                  onClick={() => onSelectTeam(team.id)}
                  className={`p-2 rounded-xl text-center transition-all border cursor-pointer flex flex-col items-center justify-center ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-950/80 text-white font-black shadow-md scale-102'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-lg mb-0.5">{team.avatarIcon}</span>
                  <span className="text-[11px] font-bold leading-none">{team.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sync Countdown Card */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-2.5 text-center">
          <div className="text-[10px] uppercase font-bold text-slate-400">Tự động bắt đầu sau</div>
          <div className="font-mono text-2xl font-black text-amber-300 neon-glow-amber">
            {formatTimer(timerSecondsRemaining)}
          </div>
          <p className="text-[10px] text-slate-500">Global Sync Timer đã đồng bộ với máy chiếu</p>
        </div>
      </main>

      {/* FOOTER ACTION BUTTON: TOGGLE READY */}
      <footer className="w-full shrink-0 pt-1">
        <button
          type="button"
          onClick={onToggleReady}
          className={`w-full py-3.5 px-4 rounded-xl font-black text-sm tracking-wide transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2 ${
            activeTeam.isReady
              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/30'
              : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/30'
          }`}
        >
          <span>{activeTeam.isReady ? 'ĐÃ SẴN SÀNG (READY) ✓' : 'BẤM ĐỂ SẴN SÀNG (READY)'}</span>
        </button>
      </footer>
    </div>
  );
};
