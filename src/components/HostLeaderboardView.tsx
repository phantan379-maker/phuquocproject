import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { FirebasePlayer } from '../firebase';
import { sounds } from '../utils/sound';
import { RauMaIcon } from './PlayerCompletionView';

interface HostLeaderboardViewProps {
  roomPin: string;
  players: Record<string, FirebasePlayer>;
  onNewGame: () => void;
}

export const HostLeaderboardView: React.FC<HostLeaderboardViewProps> = ({
  roomPin,
  players,
  onNewGame,
}) => {
  // Chuyển object players sang array và sắp xếp giảm dần theo điểm
  const sortedPlayers = Object.values(players || {}).sort((a, b) => (b.score || 0) - (a.score || 0));

  const top1 = sortedPlayers[0];
  const top2 = sortedPlayers[1];
  const top3 = sortedPlayers[2];

  useEffect(() => {
    sounds.playFanfare();
    try {
      confetti({
        particleCount: 100,
        spread: 120,
        origin: { y: 0.5 },
        colors: ['#22c55e', '#eab308', '#06b6d4', '#f43f5e', '#a855f7'],
      });
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-4 sm:p-8 font-sans select-none">
      {/* Header */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg">
            🏆
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Bảng Tổng Sắp Chung Cuộc • Phòng #{roomPin}
            </h1>
            <p className="text-xs text-slate-400">
              Đấu Trường Tin Học 10 • Biên Tập Cẩm Nang Du Lịch Phú Quốc
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onNewGame}
          className="bg-sky-600 hover:bg-sky-500 active:scale-95 text-white font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl cursor-pointer shadow-lg transition-all"
        >
          + Tạo Phòng Thi Mới
        </button>
      </header>

      {/* Main Content: Podium Top 3 & Full Rankings */}
      <main className="max-w-6xl w-full mx-auto flex-1 py-8 space-y-10 flex flex-col justify-center">
        {/* BỤC VINH DANH PODIUM TOP 3 */}
        {sortedPlayers.length > 0 && (
          <div className="flex justify-center items-end gap-3 sm:gap-6 pt-10 pb-4">
            {/* HẠNG 2 (Bên trái) */}
            {top2 ? (
              <div className="flex flex-col items-center w-28 sm:w-40 animate-fadeIn">
                <div className="text-3xl sm:text-4xl mb-1">🥈</div>
                <div className="text-xs sm:text-sm font-extrabold text-slate-200 text-center truncate max-w-full">
                  {top2.name}
                </div>
                <div className="font-mono text-sm sm:text-base font-black text-slate-300">
                  {top2.score} đ
                </div>
                <div className="w-full h-32 sm:h-44 bg-gradient-to-t from-slate-800 to-slate-700 rounded-t-3xl border-t-4 border-slate-400 flex flex-col items-center justify-center shadow-2xl mt-2">
                  <span className="text-3xl sm:text-5xl font-black text-slate-400 font-mono">2</span>
                  <span className="text-[10px] uppercase font-bold text-slate-300 mt-1">HẠNG NHÌ</span>
                </div>
              </div>
            ) : (
              <div className="w-28 sm:w-40 h-28 bg-slate-900/40 rounded-t-3xl border-t border-slate-800 flex items-center justify-center text-xs text-slate-600">
                Trống
              </div>
            )}

            {/* HẠNG 1 (Ở giữa - Cao nhất & Rực rỡ nhất) */}
            {top1 && (
              <div className="flex flex-col items-center w-36 sm:w-52 z-10 animate-bounce">
                <div className="relative">
                  <div className="text-5xl sm:text-6xl mb-1">👑</div>
                  <div className="absolute -top-1 -right-2">
                    <RauMaIcon size={28} />
                  </div>
                </div>
                <div className="text-sm sm:text-base font-black text-amber-300 text-center truncate max-w-full">
                  {top1.name}
                </div>
                <div className="font-mono text-base sm:text-xl font-black text-amber-400">
                  {top1.score} đ
                </div>
                <div className="w-full h-44 sm:h-60 bg-gradient-to-t from-amber-600 to-amber-500 rounded-t-3xl border-t-4 border-yellow-200 flex flex-col items-center justify-center shadow-2xl mt-2 text-slate-950">
                  <span className="text-4xl sm:text-6xl font-black font-mono">1</span>
                  <span className="text-xs uppercase font-black tracking-widest mt-1">QUÁN QUÂN 🏆</span>
                  <span className="text-[10px] font-bold opacity-80">Xuất Sắc Nhất</span>
                </div>
              </div>
            )}

            {/* HẠNG 3 (Bên phải) */}
            {top3 ? (
              <div className="flex flex-col items-center w-28 sm:w-40 animate-fadeIn">
                <div className="text-3xl sm:text-4xl mb-1">🥉</div>
                <div className="text-xs sm:text-sm font-extrabold text-amber-600 text-center truncate max-w-full">
                  {top3.name}
                </div>
                <div className="font-mono text-sm sm:text-base font-black text-amber-500">
                  {top3.score} đ
                </div>
                <div className="w-full h-24 sm:h-36 bg-gradient-to-t from-amber-900/80 to-amber-800/80 rounded-t-3xl border-t-4 border-amber-600 flex flex-col items-center justify-center shadow-2xl mt-2">
                  <span className="text-3xl sm:text-5xl font-black text-amber-500 font-mono">3</span>
                  <span className="text-[10px] uppercase font-bold text-amber-400 mt-1">HẠNG BA</span>
                </div>
              </div>
            ) : (
              <div className="w-28 sm:w-40 h-24 bg-slate-900/40 rounded-t-3xl border-t border-slate-800 flex items-center justify-center text-xs text-slate-600">
                Trống
              </div>
            )}
          </div>
        )}

        {/* BẢNG DANH SÁCH TẤT CẢ CÁC TỔ THI ĐẤU */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Chi Tiết Xếp Hạng Toàn Bộ Các Tổ ({sortedPlayers.length} tổ)
            </h3>
            <span className="text-xs text-emerald-400 font-mono font-bold">
              Đồng bộ Realtime ✓
            </span>
          </div>

          <div className="divide-y divide-slate-800/60 max-h-[360px] overflow-y-auto pr-2">
            {sortedPlayers.map((player, idx) => {
              const rank = idx + 1;
              const isTop3 = rank <= 3;

              return (
                <div
                  key={player.id}
                  className={`flex items-center justify-between py-3 px-3 sm:px-4 rounded-xl transition-all ${
                    rank === 1
                      ? 'bg-amber-500/10 border border-amber-500/30 font-bold'
                      : isTop3
                      ? 'bg-slate-800/40'
                      : 'hover:bg-slate-800/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-lg font-mono text-xs font-black flex items-center justify-center ${
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

                    <span className="text-sm sm:text-base font-extrabold text-white">
                      {player.name}
                    </span>

                    {player.finished && (
                      <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                        Đã nộp bài ✓
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="font-mono text-base sm:text-lg font-black text-amber-400">
                        {player.score}
                      </span>
                      <span className="text-xs text-slate-400 ml-1">điểm</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto pt-4 text-center text-xs text-slate-500 border-t border-slate-900">
        Đấu trường Tin học 10 • Kết quả được cập nhật trực tiếp qua Firebase Realtime Database
      </footer>
    </div>
  );
};
