import React, { useState } from 'react';

interface OnlinePlayerViewProps {
  roomPin: string;
  isJoined: boolean;
  playerName: string;
  players: string[];
  timerSeconds: number;
  isTimerRunning: boolean;
  onJoin: (name: string) => void;
}

export const OnlinePlayerView: React.FC<OnlinePlayerViewProps> = ({
  roomPin,
  isJoined,
  playerName,
  players,
  timerSeconds,
  isTimerRunning,
  onJoin,
}) => {
  const [teamNameInput, setTeamNameInput] = useState('');
  const [error, setError] = useState('');

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = teamNameInput.trim();
    if (!clean) {
      setError('Vui lòng ghi tên tổ của bạn trước khi bấm tham gia.');
      return;
    }
    setError('');
    onJoin(clean);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Room Header Info */}
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-3 py-1 rounded-full">
            Tham Gia Chơi Online
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-2">
            Phòng Thi Đấu #{roomPin}
          </h1>
          <p className="text-slate-500 text-xs">
            Cẩm Nang Du Lịch Phú Quốc • Đấu Trường Tin Học 10
          </p>
        </div>

        {/* STATE 1: FORM NHẬP TÊN TỔ (KHI CHƯA THAM GIA) */}
        {!isJoined ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="team-name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                (Ghi tên tổ)
              </label>
              <input
                id="team-name"
                type="text"
                maxLength={24}
                autoFocus
                placeholder="Ví dụ: Tổ 1, Tổ 2..."
                value={teamNameInput}
                onChange={(e) => {
                  setTeamNameInput(e.target.value);
                  setError('');
                }}
                className="w-full text-base font-semibold text-slate-900 bg-slate-50 border-2 border-slate-200 focus:border-sky-600 focus:bg-white rounded-2xl py-3.5 px-4 outline-none transition-all placeholder:text-slate-400"
              />
              {error && (
                <p className="text-rose-600 text-xs font-medium mt-1.5">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-bold py-4 rounded-xl shadow-sm text-base transition-all cursor-pointer"
            >
              THAM GIA
            </button>

            <p className="text-[11px] text-slate-400 text-center">
              Khi bạn bấm tham gia, tên tổ sẽ hiện online và bắt đầu tính giờ 2 phút hoặc đủ 8 tổ sẽ tự động vào game.
            </p>
          </form>
        ) : (
          /* STATE 2: ĐÃ THAM GIA -> HIỆN TRẠNG THÁI ONLINE & ĐỒNG HỒ 2 PHÚT */
          <div className="space-y-5 text-center">
            {/* Joined Confirmation Badge */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Đã tham gia, chuẩn bị bắt đầu...
              </span>
              <div className="text-2xl font-black text-emerald-900">
                {playerName}
              </div>
            </div>

            {/* Live 2-minute Countdown Box */}
            <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-800 block">
                Thời Gian Xuất Phát (Đếm ngược 2 phút)
              </span>
              <div className="font-mono text-4xl sm:text-5xl font-black text-sky-700 tracking-wider">
                {formatTimer(timerSeconds)}
              </div>
              <p className="text-xs text-sky-600">
                {isTimerRunning
                  ? 'Đồng hồ đếm ngược đang chạy, hãy sẵn sàng...'
                  : 'Chờ tổ đầu tiên tham gia để bắt đầu 2 phút...'}
              </p>
            </div>

            {/* Current Online Teams List in Room */}
            <div className="text-left bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Các tổ đang online ({players.length}/8 tổ):</span>
                <span className="text-emerald-600">Realtime ✓</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {players.map((name, idx) => (
                  <span
                    key={idx}
                    className={`text-xs px-2.5 py-1 rounded-lg font-semibold border ${
                      name === playerName
                        ? 'bg-sky-600 text-white border-sky-600'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-500 italic">
              Vui lòng giữ nguyên màn hình này. Khi đủ 8 tổ hoặc hết 2 phút, trò chơi sẽ tự động xuất hiện!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
