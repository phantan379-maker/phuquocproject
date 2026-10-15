import React from 'react';

interface CleanPlayerWaitingProps {
  pin: string;
  playerName: string;
  onLeaveRoom: () => void;
}

export const CleanPlayerWaiting: React.FC<CleanPlayerWaitingProps> = ({
  pin,
  playerName,
  onLeaveRoom,
}) => {
  return (
    <div className="w-full max-w-md mx-auto py-8 sm:py-16 px-4">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm text-center space-y-6">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Đã Kết Nối Thành Công</span>
        </div>

        {/* Player & Room Info */}
        <div className="space-y-1">
          <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
            Tổ Của Bạn
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {playerName}
          </h2>
        </div>

        {/* PIN Box */}
        <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4">
          <div className="text-xs text-sky-800 font-semibold">Phòng Thi Đấu</div>
          <div className="font-mono text-3xl font-black text-sky-700 tracking-wider mt-0.5">
            {pin}
          </div>
        </div>

        {/* Waiting Message */}
        <div className="space-y-2 py-2">
          <p className="text-sm font-semibold text-slate-800">
            Đang chờ Quản trò bắt đầu trận đấu...
          </p>
          <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
            Vui lòng giữ nguyên màn hình này. Khi Quản trò bấm bắt đầu trên máy chiếu, trò chơi sẽ tự động hiển thị.
          </p>
        </div>

        {/* Leave button */}
        <button
          type="button"
          onClick={onLeaveRoom}
          className="text-xs font-semibold text-slate-400 hover:text-slate-600 cursor-pointer pt-2"
        >
          Rời khỏi phòng
        </button>
      </div>
    </div>
  );
};
