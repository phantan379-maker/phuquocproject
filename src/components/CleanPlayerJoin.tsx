import React, { useState } from 'react';

interface CleanPlayerJoinProps {
  onJoin: (pin: string, playerName: string) => void;
  onBack: () => void;
}

export const CleanPlayerJoin: React.FC<CleanPlayerJoinProps> = ({
  onJoin,
  onBack,
}) => {
  const [pin, setPin] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pin.trim();
    const cleanName = playerName.trim();

    if (cleanPin.length !== 4 || !/^\d{4}$/.test(cleanPin)) {
      setError('Vui lòng nhập đúng mã PIN gồm 4 chữ số.');
      return;
    }

    if (!cleanName) {
      setError('Vui lòng nhập tên đội hoặc tổ của bạn (Ví dụ: Tổ 1).');
      return;
    }

    setError('');
    onJoin(cleanPin, cleanName);
  };

  return (
    <div className="w-full max-w-md mx-auto py-8 sm:py-16 px-4">
      {/* Back button */}
      <div className="mb-6">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
        >
          ← Quay lại trang chủ
        </button>
      </div>

      {/* Main Join Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200">
            Học Sinh Tham Gia
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            Nhập Mã PIN & Tên Tổ
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            Xem mã PIN 4 chữ số trên màn hình máy chiếu của quản trò.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Field 1: Mã PIN 4 số */}
          <div>
            <label htmlFor="pin-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Mã PIN Phòng (4 Chữ Số)
            </label>
            <input
              id="pin-input"
              type="text"
              inputMode="numeric"
              maxLength={4}
              placeholder="VD: 8492"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value.replace(/\D/g, ''));
                setError('');
              }}
              className="w-full font-mono text-2xl sm:text-3xl font-extrabold tracking-widest text-center text-slate-900 bg-slate-50 border-2 border-slate-200 focus:border-sky-600 focus:bg-white rounded-2xl py-3 px-4 outline-none transition-all placeholder:text-slate-300 placeholder:font-normal placeholder:text-xl"
            />
          </div>

          {/* Field 2: Tên Đội / Tổ */}
          <div>
            <label htmlFor="name-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Tên Tổ / Tên Đội
            </label>
            <input
              id="name-input"
              type="text"
              maxLength={24}
              placeholder="Ví dụ: Tổ 1"
              value={playerName}
              onChange={(e) => {
                setPlayerName(e.target.value);
                setError('');
              }}
              className="w-full text-base font-semibold text-slate-900 bg-slate-50 border-2 border-slate-200 focus:border-sky-600 focus:bg-white rounded-2xl py-3.5 px-4 outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-bold py-4 rounded-xl shadow-sm text-base transition-all cursor-pointer mt-2"
          >
            VÀO PHÒNG THI ĐẤU
          </button>
        </form>
      </div>

      <p className="text-center text-xs text-slate-400 mt-6">
        Hệ thống tự động đồng bộ thời gian thực với máy chiếu của lớp
      </p>
    </div>
  );
};
