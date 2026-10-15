import React from 'react';
import { FirebasePlayer } from '../firebase';
import { RauMaIcon } from './PlayerCompletionView';

interface HostPlayingViewProps {
  roomPin: string;
  players: Record<string, FirebasePlayer>;
  onEndGame: () => void;
}

export const HostPlayingView: React.FC<HostPlayingViewProps> = ({
  roomPin,
  players,
  onEndGame,
}) => {
  const playerList = Object.values(players || {});
  const sortedPlayers = [...playerList].sort((a, b) => (b.score || 0) - (a.score || 0));

  // Max score for progress calculation (assume max around 2500)
  const maxScore = Math.max(1000, ...playerList.map((p) => p.score || 0));

  const finishedCount = playerList.filter((p) => p.finished).length;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-4 sm:p-8 font-sans select-none">
      {/* Top Header */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-ping"></span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Trận Đấu Đang Diễn Ra • Phòng #{roomPin}
              </h1>
              <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                LIVE REALTIME
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Đồng bộ điểm số trực tiếp từ Firebase Realtime Database
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Tiến độ hoàn thành
            </span>
            <span className="font-mono text-sm font-bold text-amber-400">
              {finishedCount}/{playerList.length} Tổ đã nộp bài
            </span>
          </div>

          <button
            type="button"
            onClick={onEndGame}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm px-5 py-2.5 rounded-xl cursor-pointer shadow-lg transition-transform active:scale-95"
          >
            Xem Bảng Xếp Hạng 🏆
          </button>
        </div>
      </header>

      {/* Main Track: Live Score Race */}
      <main className="max-w-6xl w-full mx-auto flex-1 py-6 flex flex-col justify-center space-y-4">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Đường Đua Điểm Số Các Tổ ({playerList.length} tổ tham gia)
          </span>
          <span className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1">
            <RauMaIcon size={16} /> Đang cập nhật từng giây...
          </span>
        </div>

        <div className="space-y-3 bg-slate-900/80 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl">
          {sortedPlayers.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              Đang đợi các tổ gửi điểm số đầu tiên...
            </div>
          ) : (
            sortedPlayers.map((player, idx) => {
              const rank = idx + 1;
              const percent = Math.min(100, Math.round(((player.score || 0) / maxScore) * 100));

              return (
                <div key={player.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-6 h-6 rounded-md font-mono text-[11px] font-black flex items-center justify-center ${
                          rank === 1
                            ? 'bg-amber-400 text-slate-950'
                            : rank === 2
                            ? 'bg-slate-300 text-slate-950'
                            : rank === 3
                            ? 'bg-amber-700 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {rank}
                      </span>
                      <span className="text-white font-extrabold">{player.name}</span>
                      {player.finished && (
                        <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.2 rounded-full uppercase tracking-wider">
                          ĐÃ HOÀN THÀNH 🏆
                        </span>
                      )}
                    </div>

                    <div className="font-mono text-sm sm:text-base font-black text-amber-400">
                      {player.score || 0} đ
                    </div>
                  </div>

                  {/* Thanh Progress Bar đua điểm */}
                  <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                    <div
                      className={`h-full rounded-full transition-all duration-500 flex items-center justify-end pr-1 ${
                        rank === 1
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-300'
                          : rank === 2
                          ? 'bg-gradient-to-r from-cyan-500 to-sky-300'
                          : rank === 3
                          ? 'bg-gradient-to-r from-teal-500 to-emerald-300'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-400'
                      }`}
                      style={{ width: `${Math.max(4, percent)}%` }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto pt-4 text-center text-xs text-slate-500 border-t border-slate-900 flex items-center justify-between">
        <span>Đấu trường Tin học 10 • Màn hình Quản trò (Host Máy chiếu)</span>
        <button
          type="button"
          onClick={onEndGame}
          className="text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
        >
          Chuyển sang Bảng Xếp Hạng Chung Cuộc →
        </button>
      </footer>
    </div>
  );
};
