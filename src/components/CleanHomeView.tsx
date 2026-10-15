import React from 'react';

interface CleanHomeViewProps {
  onCreateRoom: () => void;
  onJoinWithPin?: () => void;
}

export const CleanHomeView: React.FC<CleanHomeViewProps> = ({
  onCreateRoom,
  onJoinWithPin,
}) => {
  return (
    <div className="w-full max-w-lg mx-auto py-12 sm:py-20 px-4 text-center">
      {/* Brand Header */}
      <div className="space-y-3 mb-10">
        <span className="inline-block px-3.5 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
          Chủ đề Dự án Tin học 10
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Cẩm Nang Du Lịch Phú Quốc
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-md mx-auto">
          Hệ thống đấu trường thực hành Tin học 10. Tạo phòng thi đấu trên máy chiếu và kết nối các tổ học sinh.
        </p>
      </div>

      {/* ONLY ONE PRIMARY ACTION BUTTON: TẠO PHÒNG */}
      <div className="space-y-4">
        <button
          type="button"
          onClick={onCreateRoom}
          className="w-full bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-bold py-5 px-8 rounded-2xl shadow-sm text-lg sm:text-xl transition-all cursor-pointer border border-sky-600 hover:shadow-md active:scale-[0.99]"
        >
          TẠO PHÒNG THI ĐẤU
        </button>

        <p className="text-xs text-slate-500">
          Khi tạo phòng thành công, mã PIN 4 số sẽ xuất hiện. Trận đấu tự động đếm ngược 2 phút khi đội đầu tiên vào phòng hoặc tự bắt đầu khi đủ 8 đội.
        </p>
      </div>

      {/* Subtle Player Join Option if opening from student phone */}
      {onJoinWithPin && (
        <div className="mt-12 pt-6 border-t border-slate-200">
          <button
            type="button"
            onClick={onJoinWithPin}
            className="text-xs font-semibold text-slate-500 hover:text-sky-700 cursor-pointer underline underline-offset-4"
          >
            Học sinh vào phòng bằng mã PIN →
          </button>
        </div>
      )}
    </div>
  );
};
