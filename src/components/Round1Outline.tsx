import React, { useState, useEffect } from 'react';
import { TextStyleTag, OutlineItem, Team } from '../types/game';
import { ROUND_1_ITEMS } from '../data/gameData';
import { sounds } from '../utils/sound';
import { LiveRacingBar } from './LiveRacingBar';
import {
  Check,
  X,
  HelpCircle,
  ArrowRight,
  Flame,
  Clock,
  Sparkles,
  BookOpen,
  Info,
} from 'lucide-react';

interface Round1OutlineProps {
  teams: Team[];
  activeTeamId: string;
  onUpdateTeamProgress: (progress: number, scoreIncrement: number) => void;
  onFinishRound: (finalRoundScore: number) => void;
}

export const Round1Outline: React.FC<Round1OutlineProps> = ({
  teams,
  activeTeamId,
  onUpdateTeamProgress,
  onFinishRound,
}) => {
  const [items, setItems] = useState<OutlineItem[]>(ROUND_1_ITEMS);
  const [selectedTag, setSelectedTag] = useState<TextStyleTag | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90); // 90s countdown for speed bonus
  const [showPedagogyHint, setShowPedagogyHint] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (isCompleted) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          checkAllAndFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isCompleted]);

  // Handle Drag & Drop
  const handleDragStart = (e: React.DragEvent, tag: TextStyleTag) => {
    e.dataTransfer.setData('text/plain', tag);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, itemId: string) => {
    e.preventDefault();
    const tag = e.dataTransfer.getData('text/plain') as TextStyleTag;
    if (tag) {
      applyStyle(itemId, tag);
    }
  };

  // Apply style to item
  const applyStyle = (itemId: string, styleTag: TextStyleTag) => {
    setItems((prev) => {
      const updated = prev.map((it) => {
        if (it.id === itemId) {
          const isCorrect = it.expectedStyle === styleTag;
          if (isCorrect && it.assignedStyle !== styleTag) {
            sounds.playSuccess();
          } else if (!isCorrect) {
            sounds.playError();
          }
          return { ...it, assignedStyle: styleTag };
        }
        return it;
      });

      // Calculate progress and live score
      const correctCount = updated.filter((it) => it.assignedStyle === it.expectedStyle).length;
      const progressPercent = Math.round((correctCount / updated.length) * 100);
      const currentScore = correctCount * 120 + Math.floor(timeLeft * 2.5);
      setScore(currentScore);

      onUpdateTeamProgress(progressPercent, currentScore);

      // Check if all correct
      if (correctCount === updated.length) {
        setIsCompleted(true);
        sounds.playSuccess();
      }

      return updated;
    });

    setSelectedTag(null);
  };

  const checkAllAndFinish = () => {
    const correctCount = items.filter((it) => it.assignedStyle === it.expectedStyle).length;
    const finalScore = correctCount * 120 + Math.floor(timeLeft * 2.5);
    setIsCompleted(true);
    onFinishRound(finalScore);
  };

  const tagsList: { tag: TextStyleTag; label: string; desc: string; color: string; badgeClass: string }[] = [
    {
      tag: 'Title',
      label: 'Title',
      desc: 'Tiêu đề lớn nhất toàn bộ cẩm nang',
      color: 'from-purple-600 to-indigo-600',
      badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    },
    {
      tag: 'Heading 1',
      label: 'Heading 1',
      desc: 'Đề mục lớn cấp 1 (Tên chương / Mục chính)',
      color: 'from-cyan-600 to-blue-600',
      badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    },
    {
      tag: 'Heading 2',
      label: 'Heading 2',
      desc: 'Đề mục con cấp 2 (Mục chi tiết bên dưới H1)',
      color: 'from-emerald-600 to-teal-600',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    },
    {
      tag: 'Normal',
      label: 'Normal',
      desc: 'Đoạn văn nội dung thông thường',
      color: 'from-slate-700 to-slate-600',
      badgeClass: 'bg-slate-700/30 text-slate-300 border-slate-600',
    },
  ];

  const getStylePreviewClass = (style?: TextStyleTag) => {
    switch (style) {
      case 'Title':
        return 'text-xl md:text-2xl font-black text-center uppercase tracking-wider bg-gradient-to-r from-purple-300 via-pink-200 to-cyan-300 bg-clip-text text-transparent py-2 border-b border-purple-500/30';
      case 'Heading 1':
        return 'text-lg md:text-xl font-extrabold text-cyan-300 border-l-4 border-cyan-400 pl-3 py-1 bg-cyan-950/20 rounded-r';
      case 'Heading 2':
        return 'text-base md:text-lg font-bold text-emerald-300 pl-6 border-l-2 border-emerald-500/40 py-0.5';
      case 'Normal':
        return 'text-sm text-slate-300 pl-6 leading-relaxed italic';
      default:
        return 'text-sm text-slate-400 font-mono';
    }
  };

  const correctCount = items.filter((it) => it.assignedStyle === it.expectedStyle).length;

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Live Racing Bar */}
      <LiveRacingBar teams={teams} currentRound="ROUND_1" activeTeamId={activeTeamId} />

      {/* Round Header & Instructions */}
      <div className="bg-slate-900/80 border border-cyan-500/30 rounded-2xl p-4 md:p-6 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-cyan-500/20 text-cyan-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                VÒNG 1: KIỂM TRA BÀI 1 & BÀI 4
              </span>
              <span className="text-xs text-slate-400">• Định dạng Styles & Dàn ý</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white">
              Kéo Thả Định Dạng Dàn Ý Cẩm Nang Phú Quốc
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1">
              Dùng chuột <strong>kéo thả thẻ Style</strong> từ bên trái hoặc <strong>click chọn thẻ rồi click vào dòng</strong> để gán kiểu định dạng chuẩn xác!
            </p>
          </div>

          {/* Timer & Score Box */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-medium">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Thời gian</span>
              </div>
              <div className={`font-mono text-xl font-black ${timeLeft <= 15 ? 'text-rose-400 animate-pulse' : 'text-white'}`}>
                {timeLeft}s
              </div>
            </div>

            <div className="bg-slate-950/80 border border-cyan-500/30 rounded-xl px-4 py-2 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-cyan-400 font-medium">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Điểm vòng 1</span>
              </div>
              <div className="font-mono text-xl font-black text-amber-300">
                {score} đ
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar of user's team */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            Tiến độ hoàn thành: <strong className="text-cyan-300">{correctCount}/{items.length} dòng</strong>
          </span>
          <button
            type="button"
            onClick={() => setShowPedagogyHint(!showPedagogyHint)}
            className="flex items-center gap-1 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" />
            <span>{showPedagogyHint ? 'Ẩn mẹo Tin học 10' : 'Mẹo Tin học 10'}</span>
          </button>
        </div>

        {showPedagogyHint && (
          <div className="mt-3 bg-cyan-950/40 border border-cyan-500/30 rounded-xl p-3 text-xs text-cyan-200 space-y-1">
            <p>
              💡 <strong>Kiến thức Bài 1 & 4 Tin học 10:</strong> Thay vì bôi đen từng dòng và chỉnh cỡ chữ thủ công, việc sử dụng các <em>Styles chuẩn (Title, Heading 1, Heading 2, Normal)</em> giúp văn bản đồng nhất phong cách chuyên nghiệp và là điều kiện tiên quyết để máy tính tự động xuất <strong>Mục lục tự động (Table of Contents)</strong> chỉ trong 1 thao tác ở Bài 4!
            </p>
          </div>
        )}
      </div>

      {/* Main Gameplay Layout: Left Tags & Right Raw Outline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Side: Lego Style Blocks */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sticky top-16">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-extrabold tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Thẻ Tag Định Dạng (Lego Styles)
              </span>
              <span className="text-[11px] text-slate-400">Kéo hoặc Click</span>
            </div>

            <div className="space-y-2.5">
              {tagsList.map((t) => {
                const isSelected = selectedTag === t.tag;
                return (
                  <div
                    key={t.tag}
                    draggable
                    onDragStart={(e) => handleDragStart(e, t.tag)}
                    onClick={() => {
                      sounds.playTick();
                      setSelectedTag(isSelected ? null : t.tag);
                    }}
                    className={`group p-3.5 rounded-xl border-2 cursor-grab active:cursor-grabbing transition-all select-none shadow-md ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-950/70 scale-[1.02] shadow-cyan-500/30'
                        : 'border-slate-700/80 bg-slate-950 hover:border-slate-500 hover:bg-slate-900/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-md border ${t.badgeClass}`}>
                        {t.label}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono group-hover:text-cyan-400 transition-colors">
                        Kéo thả ⠿
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium">{t.desc}</p>
                  </div>
                );
              })}
            </div>

            {selectedTag && (
              <div className="mt-3 p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-300 flex items-center justify-between">
                <span>Đang chọn thẻ <strong>{selectedTag}</strong></span>
                <span className="text-[11px] text-cyan-400 font-semibold">Nhấp vào dòng bên phải để gán!</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Raw Phú Quốc Document with Dropzones */}
        <div className="lg:col-span-8 space-y-3">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 md:p-6 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-extrabold text-white">
                  Bản Thảo Thô Cẩm Nang Phú Quốc (Chưa Định Dạng)
                </span>
              </div>
              <span className="text-xs text-slate-400">
                Thả đúng {items.length} vị trí
              </span>
            </div>

            <div className="space-y-3">
              {items.map((item, idx) => {
                const isAssigned = !!item.assignedStyle;
                const isCorrect = item.assignedStyle === item.expectedStyle;

                return (
                  <div
                    key={item.id}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, item.id)}
                    onClick={() => {
                      if (selectedTag) {
                        applyStyle(item.id, selectedTag);
                      }
                    }}
                    className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                      !isAssigned
                        ? 'border-dashed border-slate-700 bg-slate-950/40 hover:border-cyan-500/60 hover:bg-slate-900/60'
                        : isCorrect
                        ? 'border-emerald-500/60 bg-emerald-950/20 shadow-sm'
                        : 'border-rose-500/60 bg-rose-950/20 shadow-sm'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-400">
                          #{idx + 1}
                        </span>
                        {isAssigned ? (
                          <span
                            className={`text-xs font-extrabold px-2.5 py-0.5 rounded-md border flex items-center gap-1 ${
                              isCorrect
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            }`}
                          >
                            {isCorrect ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                            <span>{item.assignedStyle}</span>
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 italic bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700">
                            Thả thẻ Style vào đây...
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-400">
                        {item.hint}
                      </div>
                    </div>

                    {/* Styled Text Preview */}
                    <div className={`transition-all duration-300 ${getStylePreviewClass(item.assignedStyle)}`}>
                      {item.rawText}
                    </div>

                    {/* Explanatory feedback if wrongly assigned */}
                    {isAssigned && !isCorrect && (
                      <div className="mt-2 text-xs text-rose-300 flex items-center gap-1 bg-rose-500/10 p-1.5 rounded-lg border border-rose-500/20">
                        <X className="w-3.5 h-3.5 shrink-0" />
                        <span>Chưa chính xác! Cần áp dụng đúng kiểu phân cấp. Hãy kéo thả lại thẻ khác.</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Completion or Submit Footer */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          {isCompleted ? (
            <div className="text-emerald-400 font-extrabold flex items-center gap-2 text-base">
              <Check className="w-5 h-5 bg-emerald-500/20 p-1 rounded-full border border-emerald-400" />
              <span>Hoàn thành xuất sắc Vòng 1! Dàn ý đã được định dạng chuẩn Styles bài Tin học 10.</span>
            </div>
          ) : (
            <div className="text-slate-300 text-sm">
              Ráp đủ và đúng các thẻ để nhận trọn vẹn điểm số và tiến tới Vòng 2!
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={checkAllAndFinish}
          className={`flex items-center gap-2 font-black py-3 px-6 rounded-xl transition-all cursor-pointer shadow-lg ${
            isCompleted
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-emerald-500/30 scale-105'
              : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/30'
          }`}
        >
          <span>{isCompleted ? 'TIẾP TỤC SANG VÒNG 2 (CẮT ẢNH)' : 'HOÀN THÀNH VÒNG 1'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
