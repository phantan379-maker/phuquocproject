import React, { useState } from 'react';

interface CleanHostLobbyProps {
  pin: string;
  players: string[];
  timerSeconds: number;
  isTimerRunning: boolean;
  onAddPlayer: (playerName: string) => void;
  onLeaveRoom: () => void;
}

export const CleanHostLobby: React.FC<CleanHostLobbyProps> = ({
  pin,
  players,
  timerSeconds,
  isTimerRunning,
  onAddPlayer,
  onLeaveRoom,
}) => {
  const [customName, setCustomName] = useState('');

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (customName.trim()) {
      onAddPlayer(customName.trim());
      setCustomName('');
    }
  };

  const handleQuickAddNext = () => {
    const nextNumber = players.length + 1;
    if (nextNumber <= 8) {
      onAddPlayer(`Tổ ${nextNumber}`);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-8 sm:py-10 px-4 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200">
            Phòng Thi Đấu Lớp Học
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Đấu Trường Tin Học 10 • Phú Quốc
          </h2>
        </div>

        <button
          type="button"
          onClick={onLeaveRoom}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          ← Đóng phòng
        </button>
      </div>

      {/* Main Board: PIN 4 số & Đồng hồ đếm ngược 2 phút */}
      <div className="bg-sky-700 text-white rounded-3xl p-6 sm:p-10 text-center shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
          {/* PIN Card */}
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-widest text-sky-200 font-bold block">
              Mã PIN Phòng
            </span>
            <div className="font-mono text-5xl sm:text-7xl font-black tracking-widest text-amber-300">
              {pin}
            </div>
          </div>

          <div className="hidden sm:block w-px h-20 bg-sky-600/80"></div>

          {/* Auto Countdown Timer */}
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-widest text-sky-200 font-bold block">
              Thời Gian Xuất Phát
            </span>
            <div className={`font-mono text-5xl sm:text-7xl font-black tracking-widest ${
              isTimerRunning ? 'text-white' : 'text-sky-300/60'
            }`}>
              {formatTimer(timerSeconds)}
            </div>
          </div>
        </div>

        {/* Dynamic Condition Banner */}
        <div className="pt-2 border-t border-sky-600/60 text-xs sm:text-sm text-sky-100">
          {players.length === 0 ? (
            <span className="bg-sky-800/80 px-4 py-1.5 rounded-full inline-block font-medium">
              Chờ đội đầu tiên vào phòng để bắt đầu đếm ngược 2 phút...
            </span>
          ) : players.length >= 8 ? (
            <span className="bg-amber-400 text-slate-950 font-bold px-4 py-1.5 rounded-full inline-block animate-pulse">
              Đã đủ 8 đội! Tự động chuyển vào trò chơi ngay lập tức...
            </span>
          ) : (
            <span className="bg-emerald-500 text-white font-bold px-4 py-1.5 rounded-full inline-block">
              Đồng hồ 2 phút đang chạy • Tự bắt đầu khi về 00:00 hoặc đủ 8 đội ({players.length}/8)
            </span>
          )}
        </div>
      </div>

      {/* Player Roster Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${
              players.length > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'
            }`}></span>
            <h3 className="font-bold text-sm sm:text-base text-slate-900">
              Các Đội Đã Tham Gia ({players.length}/8 Đội)
            </h3>
          </div>

          {players.length < 8 && (
            <button
              type="button"
              onClick={handleQuickAddNext}
              className="text-xs font-semibold text-sky-700 hover:text-sky-800 bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-200 hover:bg-sky-100 transition-colors cursor-pointer"
            >
              + Thêm nhanh Tổ {players.length + 1}
            </button>
          )}
        </div>

        {/* Grid of connected teams */}
        {players.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs sm:text-sm border-2 border-dashed border-slate-200 rounded-xl">
            Chưa có đội nào tham gia. Nhập tên đội bên dưới hoặc dùng điện thoại nhập PIN {pin} để vào.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {players.map((name, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-between shadow-2xs"
              >
                <span>{name}</span>
                <span className="text-xs text-emerald-600 font-extrabold">✓</span>
              </div>
            ))}
          </div>
        )}

        {/* Quick Add Form for Classroom Testing */}
        {players.length < 8 && (
          <form onSubmit={handleManualAdd} className="pt-2 border-t border-slate-100 flex items-center gap-2">
            <input
              type="text"
              placeholder="Nhập tên đội (Ví dụ: Tổ 1)..."
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="flex-1 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 outline-none focus:border-sky-500 focus:bg-white"
            />
            <button
              type="submit"
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl transition-colors cursor-pointer"
            >
              Thêm Đội
            </button>
          </form>
        )}
      </div>

      <div className="text-center text-xs text-slate-400">
        Cơ chế tự động: Quản trò không cần bấm bắt đầu thủ công
      </div>
    </div>
  );
};
