import React, { useState } from 'react';

interface HostRoomViewProps {
  roomPin: string;
  playerUrl: string;
  players: string[];
  timerSeconds: number;
  isTimerRunning: boolean;
  onOpenPlayerTab: () => void;
}

export const HostRoomView: React.FC<HostRoomViewProps> = ({
  roomPin,
  playerUrl,
  players,
  timerSeconds,
  isTimerRunning,
  onOpenPlayerTab,
}) => {
  const [copied, setCopied] = useState(false);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(playerUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-8 sm:py-12 px-4 space-y-6">
      {/* Top Banner */}
      <div className="text-center space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-3 py-1 rounded-full">
          Màn Hình Chủ Phòng (Host)
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Phòng Thi Đấu Đang Mở
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm">
          Gửi đường link bên dưới cho các tổ khác để tham gia trực tuyến.
        </p>
      </div>

      {/* Main Room Card: Mã PIN & Đồng hồ đếm ngược 2 phút */}
      <div className="bg-sky-700 text-white rounded-3xl p-6 sm:p-10 text-center shadow-sm space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          {/* PIN Display */}
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-widest text-sky-200 font-bold block">
              Mã Phòng
            </span>
            <div className="font-mono text-5xl sm:text-7xl font-black tracking-widest text-amber-300">
              {roomPin}
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="space-y-1 sm:border-l sm:border-sky-600/80 sm:pl-6">
            <span className="text-xs uppercase tracking-widest text-sky-200 font-bold block">
              Đồng Hồ 2 Phút
            </span>
            <div className={`font-mono text-5xl sm:text-7xl font-black tracking-widest ${
              isTimerRunning ? 'text-white' : 'text-sky-300/50'
            }`}>
              {formatTimer(timerSeconds)}
            </div>
          </div>
        </div>

        {/* Dynamic Condition Status */}
        <div className="pt-3 border-t border-sky-600/60 text-xs sm:text-sm">
          {players.length === 0 ? (
            <span className="bg-sky-800 text-sky-200 px-4 py-1.5 rounded-full inline-block font-medium">
              Chờ người đầu tiên bấm tham gia để bắt đầu tính giờ 2 phút...
            </span>
          ) : players.length >= 8 ? (
            <span className="bg-amber-400 text-slate-950 font-bold px-4 py-1.5 rounded-full inline-block animate-pulse">
              Đã đủ 8 tổ! Tự động bắt đầu trận đấu ngay bây giờ...
            </span>
          ) : (
            <span className="bg-emerald-500 text-white font-bold px-4 py-1.5 rounded-full inline-block">
              Đồng hồ đang đếm ngược • Tự bắt đầu khi hết 2 phút hoặc đủ 8 tổ ({players.length}/8)
            </span>
          )}
        </div>
      </div>

      {/* Share Link Box for Players */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
            Đường Link Dành Cho Các Tổ Tham Gia Online
          </label>
          <span className="text-xs text-sky-700 font-medium font-mono">
            Chỉ cần mở link và ghi tên tổ
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2">
          <input
            type="text"
            readOnly
            value={playerUrl}
            className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-xs sm:text-sm font-mono px-3.5 py-2.5 rounded-xl outline-none"
          />
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex-1 sm:flex-none bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              {copied ? 'Đã chép ✓' : 'Sao chép link'}
            </button>
            <button
              type="button"
              onClick={onOpenPlayerTab}
              className="flex-1 sm:flex-none bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
            >
              Mở tab người chơi ↗
            </button>
          </div>
        </div>
      </div>

      {/* Online Teams Roster (Realtime) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${
              players.length > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'
            }`}></span>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Danh Sách Các Tổ Đang Online ({players.length}/8 Tổ)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Cập nhật tự động</span>
        </div>

        {players.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs sm:text-sm border-2 border-dashed border-slate-200 rounded-xl">
            Chưa có tổ nào vào phòng. Hãy chia sẻ đường link ở trên cho các tổ.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {players.map((name, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-between"
              >
                <span>{name}</span>
                <span className="text-xs text-emerald-600 font-bold">Online ✓</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
