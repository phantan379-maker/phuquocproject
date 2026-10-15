import React from 'react';
import { Team, GameRound } from '../types/game';
import { Flame, Trophy } from 'lucide-react';

interface LiveRacingBarProps {
  teams: Team[];
  currentRound: GameRound;
  activeTeamId?: string;
}

export const LiveRacingBar: React.FC<LiveRacingBarProps> = ({
  teams,
  currentRound,
  activeTeamId,
}) => {
  // Determine progress key based on current round
  const getProgress = (team: Team) => {
    if (currentRound === 'ROUND_1') return team.round1Progress;
    if (currentRound === 'ROUND_2') return team.round2Progress;
    if (currentRound === 'ROUND_3') return team.round3Progress;
    return team.completedRounds * 33.3;
  };

  const getRoundLabel = () => {
    switch (currentRound) {
      case 'ROUND_1':
        return 'Vòng 1: Kéo thả Dàn ý (Styles)';
      case 'ROUND_2':
        return 'Vòng 2: Cắt ảnh thần tốc (Crop)';
      case 'ROUND_3':
        return 'Vòng 3: GeoGuessr Phú Quốc (Bản đồ)';
      default:
        return 'Đang thi đấu';
    }
  };

  return (
    <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-3 md:p-4 backdrop-blur-md shadow-lg shadow-cyan-950/40 mb-5">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
          </span>
          <span className="text-xs uppercase font-extrabold tracking-wider text-cyan-400">
            Cuộc Đua Tiến Độ Trực Tiếp (Live Race)
          </span>
          <span className="text-xs text-slate-400 hidden sm:inline">•</span>
          <span className="text-xs font-medium text-slate-300 hidden sm:inline">{getRoundLabel()}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
          <Trophy className="w-3.5 h-3.5" />
          <span>Điểm số cao nhất: {Math.max(...teams.map((t) => t.totalScore))} đ</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {teams.map((team) => {
          const progress = Math.min(100, Math.max(0, getProgress(team)));
          const isUser = team.id === activeTeamId;

          return (
            <div
              key={team.id}
              className={`p-2 rounded-xl transition-all ${
                isUser
                  ? 'bg-cyan-950/60 border border-cyan-400/50 shadow-sm'
                  : 'bg-slate-950/50 border border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">{team.avatarIcon}</span>
                  <span className={`font-bold ${isUser ? 'text-cyan-300' : 'text-slate-200'}`}>
                    {team.name}
                  </span>
                  {isUser && (
                    <span className="bg-cyan-500 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                      Tổ của bạn
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-cyan-400 font-bold">{team.totalScore} đ</span>
                  <span className="text-slate-400 text-[11px] font-mono">{Math.round(progress)}%</span>
                </div>
              </div>

              {/* Race Track Bar */}
              <div className="relative w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-0.5"
                  style={{
                    width: `${Math.max(5, progress)}%`,
                    backgroundColor: team.color,
                    boxShadow: `0 0 10px ${team.color}66`,
                  }}
                >
                  {progress > 15 && <Flame className="w-2.5 h-2.5 text-white animate-pulse" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
