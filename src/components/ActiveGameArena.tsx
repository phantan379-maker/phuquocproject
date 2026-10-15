import React, { useState, useRef, useEffect } from 'react';
import { sounds } from '../utils/sound';

interface ActiveGameArenaProps {
  teamName: string;
  joinedPlayers?: string[];
  firebasePlayers?: Record<string, { id: string; name: string; score: number; finished?: boolean }>;
  onScoreUpdate?: (newScore: number, currentGame: number) => void;
  onFinishAllGames: (finalScore: number) => void;
}

// 9 ô chuẩn vị trí từ 1 đến 9 theo yêu cầu Game 5
const GAME5_STANDARD_ITEMS = [
  { id: 1, label: 'Bìa Cẩm Nang (Logo & Tên)', color: 'bg-sky-600 text-white' },
  { id: 2, label: 'Lời Mở Đầu', color: 'bg-emerald-600 text-white' },
  { id: 3, label: 'Mục Lục Cẩm Nang', color: 'bg-teal-600 text-white' },
  { id: 4, label: '1. Vị trí địa lý', color: 'bg-indigo-600 text-white' },
  { id: 5, label: 'Hình ảnh bản đồ đảo', color: 'bg-amber-600 text-white' },
  { id: 6, label: '2. Đặc sản ẩm thực', color: 'bg-rose-600 text-white' },
  { id: 7, label: 'Hình ảnh món Bún Quậy', color: 'bg-orange-600 text-white' },
  { id: 8, label: '3. Lịch trình gợi ý', color: 'bg-violet-600 text-white' },
  { id: 9, label: 'Lời Kết & Thông tin Tác giả', color: 'bg-slate-800 text-white' },
];

// Hàm shuffle ngẫu nhiên mảng
function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  // Đảm bảo không trùng 100% với mảng ban đầu
  if (copy.every((item, idx) => (item as unknown as { id: number }).id === idx + 1)) {
    [copy[0], copy[1]] = [copy[1], copy[0]];
  }
  return copy;
}

export const ActiveGameArena: React.FC<ActiveGameArenaProps> = ({
  teamName = 'Tổ 1',
  joinedPlayers = ['Tổ 1'],
  firebasePlayers,
  onScoreUpdate,
  onFinishAllGames,
}) => {
  // Điểm số và vòng chơi hiện tại
  const [totalScore, setTotalScore] = useState<number>(0);
  const [currentGame, setCurrentGame] = useState<number>(1); // 1 đến 5

  // Danh sách tiến trình chỉ chứa các tổ đã thực sự tham gia
  const validPlayers = joinedPlayers.length > 0 ? joinedPlayers : [teamName || 'Tổ 1'];
  const [teamsProgress, setTeamsProgress] = useState<
    { id: string | number; name: string; score: number; finished?: boolean }[]
  >(
    validPlayers.map((name, idx) => ({
      id: idx + 1,
      name,
      score: 0,
      finished: false,
    }))
  );

  const addScore = (pts: number) => {
    setTotalScore((prev) => {
      const nextScore = prev + pts;
      setTeamsProgress((prevTeams) =>
        prevTeams.map((t) => (t.name === teamName ? { ...t, score: nextScore } : t))
      );
      onScoreUpdate?.(nextScore, currentGame);
      return nextScore;
    });
  };

  // =========================================================================
  // GAME 1: KÉO THẢ DÀN Ý (KHÔNG TỰ SKIP KHI XONG THEO YÊU CẦU)
  // =========================================================================
  const [game1SelectedTag, setGame1SelectedTag] = useState<string | null>(null);
  const [game1Finished, setGame1Finished] = useState(false);
  const [game1Items, setGame1Items] = useState([
    { id: 1, text: 'CẨM NANG DU LỊCH ĐẢO NGỌC PHÚ QUỐC 2026', expected: 'Title', assigned: null as string | null, isCorrect: false },
    { id: 2, text: '1. VỊ TRÍ ĐỊA LÝ VÀ KHÍ HẬU ĐẢO NGỌC', expected: 'Heading 1', assigned: null as string | null, isCorrect: false },
    { id: 3, text: '1.1. Khí hậu nhiệt đới gió mùa biển đảo', expected: 'Heading 2', assigned: null as string | null, isCorrect: false },
    { id: 4, text: 'Nằm trong vịnh Thái Lan, Phú Quốc có khí hậu ấm áp quanh năm với nước biển xanh ngọc.', expected: 'Normal', assigned: null as string | null, isCorrect: false },
    { id: 5, text: '2. THIÊN ĐƯỜNG VUI CHƠI VÀ TRẢI NGHIỆM', expected: 'Heading 1', assigned: null as string | null, isCorrect: false },
    { id: 6, text: '2.1. Tuyến cáp treo Hòn Thơm vượt biển dài nhất', expected: 'Heading 2', assigned: null as string | null, isCorrect: false },
    { id: 7, text: '2.2. Bãi Sao - Dải cát trắng mịn màng như kem', expected: 'Heading 2', assigned: null as string | null, isCorrect: false },
  ]);

  const handleGame1Drop = (itemId: number, tag: string) => {
    setGame1Items((prev) => {
      const updated = prev.map((item) => {
        if (item.id === itemId) {
          const isCorrect = item.expected === tag;
          if (isCorrect && !item.isCorrect) {
            sounds.playSuccess();
            addScore(100);
          } else if (!isCorrect) {
            sounds.playError();
          }
          return { ...item, assigned: tag, isCorrect };
        }
        return item;
      });

      const allCorrect = updated.every((item) => item.isCorrect);
      if (allCorrect) {
        sounds.playSuccess();
        // KHÔNG TỰ SKIP NỮA - HIỆN BANNER VÀ NÚT TIẾP TỤC
        setGame1Finished(true);
      }
      return updated;
    });
    setGame1SelectedTag(null);
  };

  // =========================================================================
  // GAME 2: CẮT ẢNH BÃI SAO (KHÔNG ĐỂ SẴN KHUNG CẮT)
  // =========================================================================
  const cropWrapperRef = useRef<HTMLDivElement>(null);
  const [cropBox, setCropBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [isDrawingCrop, setIsDrawingCrop] = useState(false);
  const [cropStart, setCropStart] = useState<{ x: number; y: number } | null>(null);
  const [cropFeedback, setCropFeedback] = useState<string>('Kéo chuột hoặc vuốt trên ảnh để tự vẽ khung cắt crop box');
  const [cropConfirmed, setCropConfirmed] = useState(false);

  const getPointerCoords = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cropWrapperRef.current) return null;
    const rect = cropWrapperRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    return { x, y };
  };

  const handleCropPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const coords = getPointerCoords(e);
    if (!coords) return;
    setIsDrawingCrop(true);
    setCropStart(coords);
    setCropBox({ x: coords.x, y: coords.y, w: 0, h: 0 });
  };

  const handleCropPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDrawingCrop || !cropStart) return;
    const coords = getPointerCoords(e);
    if (!coords) return;

    const x = Math.min(cropStart.x, coords.x);
    const y = Math.min(cropStart.y, coords.y);
    const w = Math.abs(coords.x - cropStart.x);
    const h = Math.abs(coords.y - cropStart.y);
    setCropBox({ x, y, w, h });
  };

  const handleCropPointerUp = () => {
    if (!isDrawingCrop || !cropBox) return;
    setIsDrawingCrop(false);
    setCropStart(null);

    const overlapsTrash = cropBox.x < 22 && cropBox.y + cropBox.h > 65;
    if (overlapsTrash) {
      sounds.playError();
      setCropFeedback('⚠️ Vẫn còn dính thùng rác ở góc trái! Hãy vẽ dịch sang phải (X > 22%).');
    } else if (cropBox.w > 30 && cropBox.h > 30) {
      sounds.playSuccess();
      addScore(500);
      setCropFeedback('🌟 Xuất sắc! Loại bỏ hoàn toàn thùng rác và giữ trọn bờ biển Bãi Sao (+500đ).');
      setCropConfirmed(true);
    } else {
      setCropFeedback('Khung cắt hơi nhỏ, hãy vẽ bao trọn cảnh bờ cát và biển.');
    }
  };

  // =========================================================================
  // GAME 3: BẢN ĐỒ TO LÊN & CÓ DẤU CHẤM RÕ RÀNG
  // =========================================================================
  const mapWrapperRef = useRef<HTMLDivElement>(null);
  const [mapPin, setMapPin] = useState<{ x: number; y: number } | null>(null);
  const [mapFeedback, setMapFeedback] = useState<string>('');
  const [isPinLocked, setIsPinLocked] = useState(false);

  const handleMapPointerDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPinLocked) return;
    if (!mapWrapperRef.current) return;
    const rect = mapWrapperRef.current.getBoundingClientRect();
    const x = Math.max(3, Math.min(97, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(3, Math.min(97, ((e.clientY - rect.top) / rect.height) * 100));

    setMapPin({ x, y });
    sounds.playPinDrop();
  };

  const handleLockPin = () => {
    if (!mapPin || isPinLocked) return;
    setIsPinLocked(true);

    const targetX = 56;
    const targetY = 92;
    const dxKm = (mapPin.x - targetX) * 0.3;
    const dyKm = (mapPin.y - targetY) * 0.55;
    const dist = Math.round(Math.hypot(dxKm, dyKm) * 10) / 10;

    if (dist <= 4.0) {
      sounds.playSuccess();
      addScore(500);
      setMapFeedback(`🌟 Xuất sắc! Sai lệch chỉ ${dist} km ngay khu vực Hòn Thơm (+500đ)!`);
    } else if (dist <= 10.0) {
      sounds.playSuccess();
      addScore(300);
      setMapFeedback(`👏 Rất gần! Sai lệch ${dist} km khu vực Nam Đảo (+300đ).`);
    } else {
      sounds.playError();
      setMapFeedback(`⚠️ Sai lệch ${dist} km! Hòn Thơm nằm ở cực Nam đảo, bạn đã ghim lệch.`);
    }
  };

  // =========================================================================
  // REWORK GAME 4: CỨU HỘ VĂN BẢN (NỘI DUNG VÀ MODAL ĐÚNG CHÍNH XÁC YÊU CẦU)
  // =========================================================================
  const [activeErrorModal, setActiveErrorModal] = useState<number | null>(null);
  const [shuffledModalOptions, setShuffledModalOptions] = useState<
    { key: string; label: string; isCorrect: boolean }[]
  >([]);
  const [modalFeedback, setModalFeedback] = useState<string>('');

  // Trạng thái đã sửa của 3 lỗi
  const [errorStatus, setErrorStatus] = useState<{ [key: number]: boolean }>({
    1: false,
    2: false,
    3: false,
  });

  // Dữ liệu đúng chuẩn theo yêu cầu chính xác 100% của User:
  const GAME4_ERROR_DATA: {
    [key: number]: {
      title: string;
      desc: string;
      options: { key: string; label: string; isCorrect: boolean }[];
    };
  } = {
    1: {
      title: 'Lỗi 1: BÃI SAO PHÚ QUỐC',
      desc: 'Cụm từ đang bị bôi đỏ, gạch chân dợn sóng sai chuẩn.',
      options: [
        { key: 'A', label: 'Dùng công cụ Font Color -> Automatic', isCorrect: true },
        { key: 'B', label: 'Dùng công cụ Text Highlight Color', isCorrect: false },
        { key: 'C', label: 'Dùng công cụ Decrease Font Size', isCorrect: false },
      ],
    },
    2: {
      title: 'Lỗi 2: Hòn Thơm',
      desc: 'Cụm từ đang bị dính style Heading to chà bá (text-4xl).',
      options: [
        { key: 'A', label: 'Dùng công cụ Change Case', isCorrect: false },
        { key: 'B', label: 'Chuyển thẻ Style từ Heading 1 về Normal', isCorrect: true },
        { key: 'C', label: 'Dùng công cụ Italic', isCorrect: false },
      ],
    },
    3: {
      title: 'Lỗi 3: bún quậy Kiến Xây',
      desc: 'Cụm từ đang bị gạch ngang chữ (Strikethrough).',
      options: [
        { key: 'A', label: 'Click lại công cụ Strikethrough (ab) để tắt', isCorrect: true },
        { key: 'B', label: 'Dùng công cụ Underline', isCorrect: false },
        { key: 'C', label: 'Dùng công cụ Clear Formatting', isCorrect: false },
      ],
    },
  };

  // Mở modal và XÁO TRỘN (Shuffle) ngẫu nhiên 3 đáp án A B C
  const handleOpenErrorModal = (errorId: number) => {
    if (errorStatus[errorId]) return; // Đã sửa rồi thì bỏ qua
    setActiveErrorModal(errorId);
    setModalFeedback('');
    const rawOptions = GAME4_ERROR_DATA[errorId].options;
    setShuffledModalOptions(shuffleArray(rawOptions));
  };

  // Xử lý chọn đáp án trong Modal Game 4
  const handleChooseWordOption = (isCorrect: boolean) => {
    if (isCorrect) {
      sounds.playSuccess();
      addScore(200);
      setModalFeedback('✓ Chính xác! Đã khôi phục định dạng chuẩn Microsoft Word (+200đ).');

      setErrorStatus((prev) => {
        const next = { ...prev, [activeErrorModal!]: true };
        return next;
      });

      setTimeout(() => {
        setActiveErrorModal(null);
      }, 700);
    } else {
      sounds.playError();
      setModalFeedback('✗ Sai công cụ Word! Hãy xem kỹ lỗi và chọn lại.');
    }
  };

  const isAllErrorsFixed = errorStatus[1] && errorStatus[2] && errorStatus[3];

  // =========================================================================
  // REWORK GAME 5: SẮP XẾP BỐ CỤC 3X3 (9 Ô CHUẨN VỊ TRÍ + SWAP + CHỐT ĐÁP ÁN)
  // =========================================================================
  // Khởi tạo ban đầu bị XÁO TRỘN (Shuffle) ngẫu nhiên
  const [puzzleGrid, setPuzzleGrid] = useState<{ id: number; label: string; color: string }[]>(() =>
    shuffleArray(GAME5_STANDARD_ITEMS)
  );
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [swappingIndices, setSwappingIndices] = useState<[number, number] | null>(null);
  const [puzzleResultFeedback, setPuzzleResultFeedback] = useState<string>('');
  const [isPuzzleWon, setIsPuzzleWon] = useState(false);

  // Click Box 1 -> Click Box 2 -> Swap nội dung và màu sắc với hiệu ứng
  const handleBoxClick = (index: number) => {
    if (isPuzzleWon) return;

    if (selectedBox === null) {
      sounds.playTick();
      setSelectedBox(index);
    } else if (selectedBox === index) {
      setSelectedBox(null);
    } else {
      // Bắt đầu hiệu ứng hoán đổi
      setSwappingIndices([selectedBox, index]);
      sounds.playCropSnap();

      setTimeout(() => {
        setPuzzleGrid((prev) => {
          const next = [...prev];
          const temp = next[selectedBox];
          next[selectedBox] = next[index];
          next[index] = temp;
          return next;
        });
        setSelectedBox(null);
        setSwappingIndices(null);
        setPuzzleResultFeedback('');
      }, 200);
    }
  };

  // Nút [ CHỐT ĐÁP ÁN ] kiểm tra đúng 100% từ 1 đến 9
  const handleFinalCheckPuzzle = () => {
    // Kiểm tra xem ID của từng ô có khớp đúng thứ tự 1 -> 9 không
    let correctCount = 0;
    const isPerfect = puzzleGrid.every((box, idx) => {
      const match = box.id === idx + 1;
      if (match) correctCount++;
      return match;
    });

    if (isPerfect) {
      sounds.playFanfare();
      addScore(600);
      setIsPuzzleWon(true);
      setPuzzleResultFeedback('🎉 HOÀN THÀNH XUẤT SẮC! Cả 9 phần tử đã khớp 100% cấu trúc Dàn ý Cẩm nang (+600đ)!');
    } else {
      sounds.playError();
      setPuzzleResultFeedback(`Chưa hoàn hảo! Hiện tại đang đúng ${correctCount}/9 vị trí. Hãy tiếp tục chạm các ô để đổi chỗ cho chuẩn.`);
    }
  };

  return (
    <div
      id="game-container"
      className="relative min-h-screen w-full flex flex-col justify-between p-3 sm:p-5 select-none font-sans overflow-x-hidden bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.5), rgba(15, 23, 42, 0.5)), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80')`,
      }}
    >
      {/* 1. THANH TRẠNG THÁI TRÊN CÙNG: [Tên Tổ] | Điểm: [X] */}
      <header className="w-full max-w-6xl mx-auto h-12 bg-white/95 backdrop-blur-md border border-white/80 rounded-2xl px-4 flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-800 shadow-md shrink-0 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse"></span>
          <span className="font-extrabold text-sky-900">{teamName}</span>
        </div>

        <div className="flex items-center gap-1.5 font-mono">
          <span className="text-slate-500 text-xs">Tổng điểm:</span>
          <span className="font-black text-amber-600 text-base">{totalScore}</span>
          <span className="text-slate-500 text-xs">đ</span>
        </div>

        {/* Nút chuyển màn chơi */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setCurrentGame(num)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                currentGame === num
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-500 hover:bg-slate-200'
              }`}
            >
              G{num}
            </button>
          ))}
        </div>
      </header>

      {/* 2. KHUNG NỘI DUNG CHÍNH (TRÁI: GAME - PHẢI: TIẾN TRÌNH CÁC TỔ THAM GIA) */}
      <main className="w-full max-w-6xl mx-auto flex-1 flex flex-col justify-center min-h-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">

          {/* VÙNG CHỨA GAME HIỆN TẠI (GLASSMORPHISM) */}
          <div className="lg:col-span-8 bg-white/90 backdrop-blur-md border border-white/80 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4">

            {/* =================================================================
                GAME 1: KÉO THẢ DÀN Ý (KHÔNG TỰ SKIP KHI XONG)
               ================================================================= */}
            {currentGame === 1 && (
              <div id="game-1" className="space-y-4">
                <div className="text-center space-y-1">
                  <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-3 py-0.5 rounded-full border border-sky-200">
                    Minigame 1 • Định Dạng Văn Bản (Bài 1)
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    Kéo Thả Dàn Ý Cẩm Nang Phú Quốc
                  </h2>
                  <p className="text-xs text-slate-600">
                    Kéo thẻ hoặc chạm chọn thẻ rồi chạm vào dòng bên dưới để gán style.
                  </p>
                </div>

                {/* Khay 4 thẻ Style */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="grid grid-cols-4 gap-2">
                    {['Title', 'Heading 1', 'Heading 2', 'Normal'].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        draggable
                        onDragStart={(e) => e.dataTransfer.setData('text/plain', tag)}
                        onClick={() => {
                          sounds.playTick();
                          setGame1SelectedTag(game1SelectedTag === tag ? null : tag);
                        }}
                        className={`py-2 px-2 rounded-xl text-center font-bold text-xs cursor-pointer transition-all shadow-xs ${
                          game1SelectedTag === tag ? 'ring-2 ring-sky-500 scale-105' : ''
                        } ${
                          tag === 'Title'
                            ? 'bg-purple-600 text-white'
                            : tag === 'Heading 1'
                            ? 'bg-blue-600 text-white'
                            : tag === 'Heading 2'
                            ? 'bg-teal-600 text-white'
                            : 'bg-slate-700 text-white'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                  {game1SelectedTag && (
                    <div className="text-center text-[11px] text-sky-700 font-bold mt-1.5">
                      Đang chọn: <strong>{game1SelectedTag}</strong> • Chạm vào dòng bên dưới để gán!
                    </div>
                  )}
                </div>

                {/* Danh sách 7 câu */}
                <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                  {game1Items.map((item) => (
                    <div
                      key={item.id}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const tag = e.dataTransfer.getData('text/plain');
                        if (tag) handleGame1Drop(item.id, tag);
                      }}
                      onClick={() => {
                        if (game1SelectedTag) handleGame1Drop(item.id, game1SelectedTag);
                      }}
                      className={`p-2.5 rounded-xl border-2 transition-all flex items-center justify-between gap-2 cursor-pointer ${
                        item.isCorrect
                          ? 'border-emerald-500 bg-emerald-50/80'
                          : item.assigned
                          ? 'border-rose-400 bg-rose-50/60'
                          : 'border-dashed border-slate-300 bg-white hover:border-sky-400'
                      }`}
                    >
                      <div className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                        {item.text}
                      </div>

                      <div className="shrink-0 min-w-[90px] text-center">
                        {item.assigned ? (
                          <span
                            className={`text-xs font-black px-2.5 py-1 rounded-lg ${
                              item.isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                            }`}
                          >
                            {item.assigned} {item.isCorrect ? '✓' : '✗'}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic bg-slate-50 px-2 py-1 rounded border border-slate-200">
                            Thả Style
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* BANNER KHI HOÀN THÀNH GAME 1: CÓ NÚT BẤM, KHÔNG TỰ SKIP NỮA */}
                {game1Finished && (
                  <div className="p-3.5 bg-emerald-50 border-2 border-emerald-400 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
                    <span className="text-xs sm:text-sm font-bold text-emerald-800">
                      ✓ Hoàn thành xuất sắc Dàn ý Cẩm nang! Cả 7 mục đã gán Style chuẩn xác.
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentGame(2)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md cursor-pointer whitespace-nowrap active:scale-95 transition-all"
                    >
                      TIẾP TỤC QUA GAME 2 (CẮT ẢNH) →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* =================================================================
                GAME 2: CẮT ẢNH BÃI SAO (KHÔNG ĐỂ SẴN KHUNG CẮT)
               ================================================================= */}
            {currentGame === 2 && (
              <div id="game-2" className="space-y-4">
                <div className="text-center space-y-1">
                  <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-100 px-3 py-0.5 rounded-full border border-teal-200">
                    Minigame 2 • Cắt Cúp Ảnh Bãi Sao (Bài 2)
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    Kéo Khung Crop Box Loại Bỏ Thùng Rác
                  </h2>
                  <p className="text-xs text-slate-600">
                    <strong>Tự dùng chuột hoặc vuốt tay</strong> để vẽ khung chữ nhật trên ảnh bờ biển.
                  </p>
                </div>

                <div
                  ref={cropWrapperRef}
                  onPointerDown={handleCropPointerDown}
                  onPointerMove={handleCropPointerMove}
                  onPointerUp={handleCropPointerUp}
                  className="relative w-full aspect-[16/10] max-h-[350px] mx-auto rounded-2xl overflow-hidden border-2 border-slate-300 bg-slate-900 cursor-crosshair select-none shadow-inner"
                >
                  <svg viewBox="0 0 800 500" className="w-full h-full object-cover pointer-events-none">
                    <rect width="800" height="250" fill="#7dd3fc" />
                    <circle cx="680" cy="70" r="40" fill="#fef08a" />
                    <rect y="210" width="800" height="150" fill="#0284c7" />
                    <path d="M 0 330 Q 250 325 500 335 T 800 330 L 800 500 L 0 500 Z" fill="#fde047" />
                    <g transform="translate(620, 130)">
                      <path d="M 45 370 Q 15 220 75 100" stroke="#78350f" strokeWidth="20" fill="none" strokeLinecap="round" />
                      <g fill="none" stroke="#15803d" strokeWidth="6">
                        <path d="M 75 100 Q 20 70 -40 90" />
                        <path d="M 75 100 Q 10 40 -25 20" />
                        <path d="M 75 100 Q 110 30 140 -15" />
                      </g>
                    </g>
                    {/* Thùng rác góc trái */}
                    <g transform="translate(40, 340)">
                      <rect x="25" y="25" width="45" height="55" rx="3" fill="#334155" />
                      <polygon points="22,25 32,15 62,15 72,25" fill="#475569" />
                      <text x="47" y="5" fill="#ef4444" fontSize="10" fontWeight="bold" textAnchor="middle">
                        RÁC THẢI
                      </text>
                    </g>
                  </svg>

                  {/* Khung crop box vẽ tay */}
                  {cropBox && (
                    <div
                      className="absolute border-2 border-dashed border-amber-400 bg-amber-400/15 pointer-events-none"
                      style={{
                        left: `${cropBox.x}%`,
                        top: `${cropBox.y}%`,
                        width: `${cropBox.w}%`,
                        height: `${cropBox.h}%`,
                      }}
                    >
                      <div className="absolute top-1 left-1 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                        {Math.round(cropBox.w)}% x {Math.round(cropBox.h)}%
                      </div>
                    </div>
                  )}

                  {!cropBox && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                      <span className="bg-slate-900/80 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow border border-white/20">
                        Kéo chuột hoặc vuốt tại đây để vẽ vết cắt
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-slate-700">{cropFeedback}</span>
                  <button
                    type="button"
                    onClick={() => setCurrentGame(3)}
                    disabled={!cropConfirmed}
                    className={`font-bold py-2 px-4 rounded-xl transition-all cursor-pointer ${
                      cropConfirmed
                        ? 'bg-teal-600 hover:bg-teal-700 text-white'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Xác Nhận & Qua Game 3 →
                  </button>
                </div>
              </div>
            )}

            {/* =================================================================
                GAME 3: BẢN ĐỒ TO LÊN & CÓ DẤU CHẤM RÕ RÀNG
               ================================================================= */}
            {currentGame === 3 && (
              <div id="game-3" className="space-y-4">
                <div className="text-center space-y-1">
                  <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-0.5 rounded-full border border-emerald-200">
                    Minigame 3 • GeoGuessr Bản Đồ Phú Quốc
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    Định Vị Tuyến Cáp Treo Hòn Thơm (Nam Đảo)
                  </h2>
                  <p className="text-xs text-slate-600">
                    Chạm vào bản đồ Đảo Ngọc to bên dưới để thả dấu chấm ghim vị trí bạn đoán.
                  </p>
                </div>

                <div
                  ref={mapWrapperRef}
                  onClick={handleMapPointerDown}
                  className="relative w-full h-[400px] sm:h-[440px] mx-auto rounded-3xl overflow-hidden border-2 border-slate-300 bg-sky-950/10 cursor-crosshair select-none shadow-inner"
                >
                  <svg viewBox="0 0 600 680" className="w-full h-full object-contain pointer-events-none">
                    <g transform="translate(60, 60)" opacity="0.85">
                      <circle cx="0" cy="0" r="24" fill="none" stroke="#0284c7" strokeWidth="2" strokeDasharray="3 3" />
                      <polygon points="0,-22 6,-6 0,0" fill="#ef4444" />
                      <text x="0" y="-26" fill="#ef4444" fontSize="12" fontWeight="bold" textAnchor="middle">BẮC</text>
                    </g>

                    <path
                      d="M 280 40 C 350 50, 430 90, 450 160 C 470 230, 450 330, 430 420 C 410 500, 400 560, 370 600 C 340 610, 310 580, 300 540 C 280 480, 250 400, 230 330 C 210 240, 220 140, 250 70 Z"
                      fill="#047857"
                      stroke="#facc15"
                      strokeWidth="6"
                    />

                    <ellipse cx="350" cy="628" rx="22" ry="16" fill="#047857" stroke="#facc15" strokeWidth="4" />
                    <circle cx="318" cy="640" r="8" fill="#047857" />
                    <circle cx="382" cy="645" r="10" fill="#047857" />
                  </svg>

                  {/* Dấu chấm đỏ rõ ràng */}
                  {mapPin ? (
                    <div
                      className="absolute -translate-x-1/2 -translate-y-1/2 transition-all pointer-events-none z-20"
                      style={{ left: `${mapPin.x}%`, top: `${mapPin.y}%` }}
                    >
                      <span className="absolute -inset-3 rounded-full bg-rose-500/35 animate-ping"></span>
                      <div className="w-5 h-5 rounded-full bg-rose-600 border-2 border-white shadow-xl flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                      </div>
                      <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white font-mono text-[10px] font-black px-2 py-0.5 rounded shadow whitespace-nowrap">
                        📍 Đã ghim ({Math.round(mapPin.x)}%, {Math.round(mapPin.y)}%)
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="bg-slate-900/80 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow border border-white/20">
                        Chạm vào bản đồ để cắm ghim dự đoán
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1 text-xs">
                  <span className="font-mono text-slate-700 font-semibold">
                    {mapFeedback || (mapPin ? `Tọa độ bạn đã ghim: X: ${Math.round(mapPin.x)}% | Y: ${Math.round(mapPin.y)}%` : 'Chưa thả ghim')}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleLockPin}
                      disabled={!mapPin || isPinLocked}
                      className={`font-bold py-2.5 px-5 rounded-xl transition-all shadow-sm ${
                        mapPin && !isPinLocked
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      Chốt Vị Trí Ghim ✓
                    </button>
                    {isPinLocked && (
                      <button
                        type="button"
                        onClick={() => setCurrentGame(4)}
                        className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 px-4 rounded-xl cursor-pointer shadow-sm"
                      >
                        Qua Game 4 →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* =================================================================
                REWORK GAME 4: CỨU HỘ VĂN BẢN (CHÍNH XÁC NỘI DUNG & MODAL 3 ĐÁP ÁN ĐẢO VỊ TRÍ)
               ================================================================= */}
            {currentGame === 4 && (
              <div id="game-4" className="space-y-4">
                <div className="text-center space-y-1">
                  <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-3 py-0.5 rounded-full border border-purple-200">
                    Minigame 4 • Cứu Hộ Văn Bản (Soi Lỗi Định Dạng)
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    Tìm & Sửa 3 Cụm Từ Bị Định Dạng Xấu Xí
                  </h2>
                  <p className="text-xs text-slate-600">
                    Nhấp vào cụm từ lỗi để mở bảng công cụ Microsoft Word tương ứng và sửa lại chuẩn.
                  </p>
                </div>

                {/* ĐOẠN VĂN BẢN CHÍNH XÁC THEO YÊU CẦU CỦA BẠN */}
                <div className="p-5 bg-white rounded-2xl border-2 border-slate-200 text-slate-800 leading-relaxed text-sm sm:text-base space-y-3 shadow-inner">
                  <p>
                    Phú Quốc là hòn đảo ngọc lớn nhất Việt Nam. Nơi đây nổi tiếng với{' '}
                    {/* LỖI 1: BÃI SAO PHÚ QUỐC (Đang bị bôi đỏ, gạch chân dợn sóng) */}
                    <span
                      id="error-1"
                      onClick={() => handleOpenErrorModal(1)}
                      className={
                        errorStatus[1]
                          ? 'font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-300'
                          : 'text-red-600 font-bold underline decoration-wavy cursor-pointer hover:bg-red-50 px-1 rounded transition-colors'
                      }
                    >
                      BÃI SAO PHÚ QUỐC {errorStatus[1] ? '✓' : ''}
                    </span>
                    . Du khách có thể trải nghiệm tuyến cáp treo vượt biển ra{' '}
                    {/* LỖI 2: Hòn Thơm (Đang bị dính style Heading to chà bá text-4xl) */}
                    <span
                      id="error-2"
                      onClick={() => handleOpenErrorModal(2)}
                      className={
                        errorStatus[2]
                          ? 'font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-300 text-base'
                          : 'text-4xl font-black cursor-pointer hover:bg-slate-100 px-1 rounded transition-colors inline-block'
                      }
                    >
                      Hòn Thơm {errorStatus[2] ? '✓' : ''}
                    </span>
                    . Về ẩm thực, món ăn độc đáo bậc nhất là{' '}
                    {/* LỖI 3: bún quậy Kiến Xây (Đang bị gạch ngang chữ Strikethrough) */}
                    <span
                      id="error-3"
                      onClick={() => handleOpenErrorModal(3)}
                      className={
                        errorStatus[3]
                          ? 'font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-300'
                          : 'line-through text-gray-500 cursor-pointer hover:bg-gray-100 px-1 rounded transition-colors'
                      }
                    >
                      bún quậy Kiến Xây {errorStatus[3] ? '✓' : ''}
                    </span>{' '}
                    với nước chấm tự pha.
                  </p>
                </div>

                {/* Thanh trạng thái Game 4 */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                  <span className="font-bold text-slate-700">
                    Tiến độ sửa lỗi: {[1, 2, 3].filter((i) => errorStatus[i]).length}/3 cụm từ (+200đ/từ)
                  </span>

                  {isAllErrorsFixed ? (
                    <button
                      type="button"
                      onClick={() => setCurrentGame(5)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-4 py-2 rounded-xl cursor-pointer shadow-sm active:scale-95 transition-all"
                    >
                      TIẾP TỤC QUA GAME 5 (SẮP XẾP BỐ CỤC) →
                    </button>
                  ) : (
                    <span className="text-purple-700 font-semibold italic">
                      Nhấp vào từng từ bị lỗi để chọn công cụ sửa
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* =================================================================
                REWORK GAME 5: SẮP XẾP BỐ CỤC 3X3 (9 Ô CHUẨN + SWAP + CHỐT ĐÁP ÁN)
               ================================================================= */}
            {currentGame === 5 && (
              <div id="game-5" className="space-y-4">
                <div className="text-center space-y-1">
                  <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-0.5 rounded-full border border-amber-200">
                    Minigame 5 • Sắp Xếp Bố Cục Cẩm Nang (Lưới 3x3)
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    Xếp Chuẩn Dàn Ý 9 Ô Từ 1 Đến 9
                  </h2>
                  <p className="text-xs text-slate-600">
                    Chạm ô A rồi chạm ô B để hoán đổi (Swap) vị trí. Xếp xong bấm <strong>CHỐT ĐÁP ÁN</strong> để kiểm tra!
                  </p>
                </div>

                {/* Lưới 3x3 Với 9 Ô Nội Dung & Màu Sắc Riêng Biệt */}
                <div className="grid grid-cols-3 gap-2.5 sm:gap-3 aspect-square max-w-[420px] mx-auto p-3 sm:p-4 bg-slate-100/90 rounded-3xl border-2 border-slate-300 shadow-inner">
                  {puzzleGrid.map((box, idx) => {
                    const isSelected = selectedBox === idx;
                    const isSwapping = swappingIndices && (swappingIndices[0] === idx || swappingIndices[1] === idx);

                    return (
                      <div
                        key={box.id}
                        onClick={() => handleBoxClick(idx)}
                        className={`rounded-2xl p-2.5 sm:p-3 flex flex-col justify-between items-center text-center cursor-pointer select-none transition-all duration-200 shadow-sm ${
                          box.color
                        } ${
                          isSelected
                            ? 'ring-4 ring-amber-400 scale-105 z-20 shadow-xl animate-pulse'
                            : 'hover:scale-[1.02]'
                        } ${
                          isSwapping ? 'opacity-50 scale-90 rotate-2' : ''
                        }`}
                      >
                        {/* Vị trí hiện tại trên lưới (Ô số 1 đến 9) */}
                        <span className="text-[10px] font-mono font-bold opacity-80 self-start bg-black/25 px-1.5 py-0.2 rounded">
                          Vị trí #{idx + 1}
                        </span>

                        {/* Nội dung chuẩn của ô */}
                        <span className="font-extrabold text-xs sm:text-sm leading-tight my-auto">
                          {box.label}
                        </span>

                        {/* Mục tiêu vị trí chuẩn */}
                        <span className="text-[9px] font-mono opacity-70">
                          {isPuzzleWon ? '✓ Chuẩn' : `[Chuẩn: #${box.id}]`}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Phản hồi kiểm tra & Nút CHỐT ĐÁP ÁN */}
                <div className="space-y-2 text-center pt-1">
                  {puzzleResultFeedback && (
                    <div
                      className={`p-3 rounded-2xl text-xs sm:text-sm font-bold border transition-all ${
                        isPuzzleWon
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-400'
                          : 'bg-rose-50 text-rose-800 border-rose-300'
                      }`}
                    >
                      {puzzleResultFeedback}
                    </div>
                  )}

                  {!isPuzzleWon ? (
                    <button
                      type="button"
                      onClick={handleFinalCheckPuzzle}
                      className="bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-black text-sm sm:text-base py-3.5 px-8 rounded-2xl shadow-md cursor-pointer transition-transform active:scale-95"
                    >
                      CHỐT ĐÁP ÁN (KIỂM TRA 9 VỊ TRÍ)
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onFinishAllGames(totalScore)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm sm:text-base py-3.5 px-8 rounded-2xl shadow-lg cursor-pointer transition-transform active:scale-95 animate-bounce"
                    >
                      TỔNG KẾT & XUẤT BẢN THÀNH CÔNG 🏆
                    </button>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* CỘT BÊN CẠNH: TIẾN TRÌNH CÁC TỔ THAM GIA THỰC TẾ (CHỈ HIỆN TÊN, ĐIỂM) */}
          <div className="lg:col-span-4 bg-white/95 backdrop-blur-md border border-white/80 rounded-3xl p-4 sm:p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wide">
                  Tiến Trình Các Tổ
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                {teamsProgress.length} Tổ Đang Đua
              </span>
            </div>

            {/* CHỈ HIỆN ĐÚNG CÁC TỔ ĐÃ VÀO PHÒNG */}
            <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
              {(firebasePlayers
                ? Object.values(firebasePlayers).sort((a, b) => (b.score || 0) - (a.score || 0))
                : teamsProgress
              ).map((team, idx) => {
                const isCurrentTeam = team.name === teamName;
                return (
                  <div
                    key={team.id}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border transition-all ${
                      isCurrentTeam
                        ? 'bg-sky-50 border-sky-400 text-sky-950 font-bold shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-slate-400">#{idx + 1}</span>
                      <span className="text-xs sm:text-sm font-bold">
                        {team.name}
                      </span>
                      {isCurrentTeam && (
                        <span className="bg-sky-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">
                          Bạn
                        </span>
                      )}
                      {team.finished && (
                        <span className="text-[10px] text-emerald-600 font-bold">
                          ✓ Xong
                        </span>
                      )}
                    </div>

                    <div className="font-mono text-xs sm:text-sm font-black text-amber-600">
                      {team.score} đ
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] text-slate-400 text-center italic pt-1">
              Điểm số các tổ được đồng bộ Realtime từ Firebase
            </p>
          </div>

        </div>
      </main>

      {/* =====================================================================
          MODAL ĐỘNG GAME 4: 3 ĐÁP ÁN ĐƯỢC SHUFFLE ĐẢO VỊ TRÍ NGẪU NHIÊN
         ===================================================================== */}
      {activeErrorModal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white text-slate-900 rounded-3xl p-5 sm:p-6 shadow-2xl border-2 border-purple-500 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
                Khắc Phục Lỗi Định Dạng Word
              </span>
              <button
                type="button"
                onClick={() => setActiveErrorModal(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-xs cursor-pointer px-2 py-1 rounded"
              >
                ✕ Đóng
              </button>
            </div>

            {/* Chi tiết lỗi */}
            <div className="space-y-1">
              <h4 className="text-sm font-black text-slate-900">
                {GAME4_ERROR_DATA[activeErrorModal]?.title}
              </h4>
              <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                {GAME4_ERROR_DATA[activeErrorModal]?.desc}
              </p>
            </div>

            {/* Phản hồi đúng/sai */}
            {modalFeedback && (
              <div
                className={`p-2.5 rounded-xl text-xs font-bold text-center border ${
                  modalFeedback.startsWith('✓')
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-rose-50 text-rose-800 border-rose-300'
                }`}
              >
                {modalFeedback}
              </div>
            )}

            {/* 3 ĐÁP ÁN A, B, C ĐÃ ĐƯỢC ĐẢO LỘN (SHUFFLE) VỊ TRÍ */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-700">
                Chọn công cụ xử lý chuẩn xác nhất:
              </p>

              {shuffledModalOptions.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleChooseWordOption(opt.isCorrect)}
                  className="w-full text-left p-3.5 rounded-2xl border-2 border-slate-200 hover:border-purple-500 hover:bg-purple-50 text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-between group active:scale-[0.99]"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 group-hover:bg-purple-200 text-slate-700 font-bold text-[11px] flex items-center justify-center shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt.label}</span>
                  </span>
                  <span className="text-purple-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="w-full max-w-6xl mx-auto py-2 text-center text-xs text-white/90 font-medium drop-shadow shrink-0">
        Đấu trường thực hành Tin học 10 • Điểm tổng tích lũy: {totalScore} đ
      </footer>
    </div>
  );
};
