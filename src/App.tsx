/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ref, onValue, update } from 'firebase/database';
import {
  rtdb,
  createRoomOnFirebase,
  joinRoomOnFirebase,
  updatePlayerScoreOnFirebase,
  updateRoomStatusOnFirebase,
  FirebasePlayer,
  FirebaseRoom,
} from './firebase';
import { HostRoomView } from './components/HostRoomView';
import { HostPlayingView } from './components/HostPlayingView';
import { HostLeaderboardView } from './components/HostLeaderboardView';
import { OnlinePlayerView } from './components/OnlinePlayerView';
import { ActiveGameArena } from './components/ActiveGameArena';
import { PlayerCompletionView } from './components/PlayerCompletionView';

export default function App() {
  // Kiểm tra URL Parameter ?room=XXXX để phân luồng Host và Player
  const [urlRoomPin] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('room');
    }
    return null;
  });

  // =========================================================================
  // STATE CỦA QUẢN TRÒ (HOST)
  // =========================================================================
  const [isHostRoomCreated, setIsHostRoomCreated] = useState(false);
  const [hostRoomPin, setHostRoomPin] = useState<string>('');
  const [hostRoomData, setHostRoomData] = useState<FirebaseRoom | null>(null);
  const [hostCountdown, setHostCountdown] = useState<number>(120);

  // =========================================================================
  // STATE CỦA NGƯỜI CHƠI (PLAYER - CÓ ?room= TRONG URL)
  // =========================================================================
  const [playerId, setPlayerId] = useState<string>(() => {
    if (typeof window !== 'undefined' && urlRoomPin) {
      return sessionStorage.getItem(`pq_player_id_${urlRoomPin}`) || '';
    }
    return '';
  });
  const [playerName, setPlayerName] = useState<string>(() => {
    if (typeof window !== 'undefined' && urlRoomPin) {
      return sessionStorage.getItem(`pq_player_name_${urlRoomPin}`) || '';
    }
    return '';
  });
  const [isPlayerJoined, setIsPlayerJoined] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && urlRoomPin) {
      return !!sessionStorage.getItem(`pq_player_id_${urlRoomPin}`);
    }
    return false;
  });
  const [playerRoomData, setPlayerRoomData] = useState<FirebaseRoom | null>(null);
  const [playerCountdown, setPlayerCountdown] = useState<number>(120);
  const [playerFinalScore, setPlayerFinalScore] = useState<number | null>(null);

  // Lấy đường dẫn chia sẻ cho người chơi
  const getPlayerUrl = (pin: string) => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}${window.location.pathname}?room=${pin}`;
  };

  // =========================================================================
  // FIREBASE REALTIME LISTENER CHO HOST
  // =========================================================================
  useEffect(() => {
    if (urlRoomPin || !hostRoomPin || !isHostRoomCreated) return;

    const roomRef = ref(rtdb, `rooms/${hostRoomPin}`);
    const unsubscribe = onValue(roomRef, (snapshot) => {
      const data = snapshot.val() as FirebaseRoom | null;
      if (!data) return;

      setHostRoomData(data);

      const playersCount = data.players ? Object.keys(data.players).length : 0;

      // Tính đồng hồ đếm ngược từ startTime lưu trên Firebase
      if (data.startTime > 0) {
        const remaining = Math.max(0, Math.ceil((data.startTime - Date.now()) / 1000));
        setHostCountdown(remaining);

        // AUTO-START: Khi đồng hồ về 0 hoặc đủ 8 người chơi -> Chuyển sang status = 'playing'
        if (data.status === 'waiting') {
          if (remaining <= 0 || playersCount >= 8) {
            update(roomRef, { status: 'playing' });
          }
        }
      } else {
        setHostCountdown(120);
      }
    });

    return () => unsubscribe();
  }, [urlRoomPin, hostRoomPin, isHostRoomCreated]);

  // Interval chạy countdown mượt mà từng giây cho Host
  useEffect(() => {
    if (!hostRoomData || hostRoomData.status !== 'waiting' || !hostRoomData.startTime) return;

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((hostRoomData.startTime - Date.now()) / 1000));
      setHostCountdown(remaining);

      if (remaining <= 0 && hostRoomPin) {
        clearInterval(interval);
        update(ref(rtdb, `rooms/${hostRoomPin}`), { status: 'playing' });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [hostRoomData, hostRoomPin]);

  // Hành động Host bấm TẠO PHÒNG
  const handleHostCreateRoom = async () => {
    // Random mã PIN 4 số ngẫu nhiên
    const newPin = Math.floor(1000 + Math.random() * 9000).toString();
    setHostRoomPin(newPin);
    setIsHostRoomCreated(true);
    setHostCountdown(120);

    // Khởi tạo data trên Firebase Realtime Database: rooms/[PIN]
    await createRoomOnFirebase(newPin);
  };

  // Host mở tab người chơi để test
  const handleOpenPlayerTab = () => {
    if (typeof window !== 'undefined') {
      window.open(getPlayerUrl(hostRoomPin), '_blank');
    }
  };

  // =========================================================================
  // FIREBASE REALTIME LISTENER CHO PLAYER (?room=XXXX)
  // =========================================================================
  useEffect(() => {
    if (!urlRoomPin) return;

    const roomRef = ref(rtdb, `rooms/${urlRoomPin}`);
    const unsubscribe = onValue(roomRef, (snapshot) => {
      const data = snapshot.val() as FirebaseRoom | null;
      if (!data) return;

      setPlayerRoomData(data);

      const playersCount = data.players ? Object.keys(data.players).length : 0;

      // Tính đồng hồ đếm ngược từ startTime
      if (data.startTime > 0) {
        const remaining = Math.max(0, Math.ceil((data.startTime - Date.now()) / 1000));
        setPlayerCountdown(remaining);

        // AUTO-START: Đồng hồ về 0 hoặc đủ 8 người -> Chuyển sang playing
        if (data.status === 'waiting') {
          if (remaining <= 0 || playersCount >= 8) {
            update(roomRef, { status: 'playing' });
          }
        }
      } else {
        setPlayerCountdown(120);
      }
    });

    return () => unsubscribe();
  }, [urlRoomPin]);

  // Interval chạy countdown mượt mà từng giây cho Player
  useEffect(() => {
    if (!playerRoomData || playerRoomData.status !== 'waiting' || !playerRoomData.startTime) return;

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((playerRoomData.startTime - Date.now()) / 1000));
      setPlayerCountdown(remaining);

      if (remaining <= 0 && urlRoomPin) {
        clearInterval(interval);
        update(ref(rtdb, `rooms/${urlRoomPin}`), { status: 'playing' });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [playerRoomData, urlRoomPin]);

  // Hành động Player nhập tên tổ và bấm THAM GIA
  const handlePlayerJoin = async (name: string) => {
    if (!urlRoomPin) return;
    try {
      const { playerId: newId } = await joinRoomOnFirebase(urlRoomPin, name);
      setPlayerId(newId);
      setPlayerName(name);
      setIsPlayerJoined(true);

      if (typeof window !== 'undefined') {
        sessionStorage.setItem(`pq_player_id_${urlRoomPin}`, newId);
        sessionStorage.setItem(`pq_player_name_${urlRoomPin}`, name);
      }
    } catch (err) {
      console.error('Error joining room:', err);
    }
  };

  // Cập nhật điểm của Player lên Firebase Realtime Database
  const handlePlayerScoreUpdate = (newScore: number, currentGame: number) => {
    if (!urlRoomPin || !playerId) return;
    updatePlayerScoreOnFirebase(urlRoomPin, playerId, newScore, currentGame, false);
  };

  // Player hoàn thành xong cả 5 Game -> Cập nhật finished: true và hiển thị màn hình chúc mừng
  const handlePlayerFinishAllGames = (finalScore: number) => {
    setPlayerFinalScore(finalScore);
    if (!urlRoomPin || !playerId) return;
    updatePlayerScoreOnFirebase(urlRoomPin, playerId, finalScore, 5, true);
  };

  /* =========================================================================
     2. LUỒNG PLAYER (CÓ ?room=[PIN] TRONG URL)
     Ẩn hoàn toàn giao diện Home/Lobby của Host.
     TUYỆT ĐỐI KHÔNG CÓ NÚT QUAY LẠI TRANG CHỦ.
     ========================================================================= */
  if (urlRoomPin) {
    const onlinePlayerNames = playerRoomData?.players
      ? Object.values(playerRoomData.players).map((p) => p.name)
      : [];

    // TRƯỜNG HỢP: NGƯỜI CHƠI ĐÃ HOÀN THÀNH TẤT CẢ 5 GAME
    // Hiển thị màn hình vinh danh cực đẹp kèm hiệu ứng bắn mưa icon rau má!
    if (playerFinalScore !== null) {
      // Tính thứ hạng hiện tại của người chơi
      const allSorted = playerRoomData?.players
        ? Object.values(playerRoomData.players).sort((a, b) => (b.score || 0) - (a.score || 0))
        : [];
      const myRank = allSorted.findIndex((p) => p.id === playerId) + 1;

      return (
        <PlayerCompletionView
          teamName={playerName || 'Tổ Của Bạn'}
          finalScore={playerFinalScore}
          rank={myRank > 0 ? myRank : 1}
        />
      );
    }

    // TRƯỜNG HỢP: TRẬN ĐẤU ĐÃ BẮT ĐẦU (status === 'playing' hoặc 'finished') VÀ ĐÃ THAM GIA
    if (isPlayerJoined && (playerRoomData?.status === 'playing' || playerRoomData?.status === 'finished')) {
      return (
        <ActiveGameArena
          teamName={playerName || 'Tổ 1'}
          joinedPlayers={onlinePlayerNames.length > 0 ? onlinePlayerNames : [playerName || 'Tổ 1']}
          firebasePlayers={playerRoomData?.players}
          onScoreUpdate={handlePlayerScoreUpdate}
          onFinishAllGames={handlePlayerFinishAllGames}
        />
      );
    }

    // TRƯỜNG HỢP: CHƯA THAM GIA HOẶC ĐANG CHỜ (status === 'waiting')
    return (
      <OnlinePlayerView
        roomPin={urlRoomPin}
        isJoined={isPlayerJoined}
        playerName={playerName}
        players={onlinePlayerNames}
        timerSeconds={playerCountdown}
        isTimerRunning={!!playerRoomData?.startTime && playerRoomData.startTime > 0}
        onJoin={handlePlayerJoin}
      />
    );
  }

  /* =========================================================================
     1. LUỒNG HOST (KHÔNG CÓ ?room= TRONG URL)
     ========================================================================= */

  // Host View: Khi trận đấu kết thúc (status === 'finished') -> Bảng Xếp Hạng Chung Cuộc
  if (isHostRoomCreated && hostRoomData?.status === 'finished') {
    return (
      <HostLeaderboardView
        roomPin={hostRoomPin}
        players={hostRoomData.players || {}}
        onNewGame={() => {
          setIsHostRoomCreated(false);
          setHostRoomPin('');
          setHostRoomData(null);
        }}
      />
    );
  }

  // Host View: Khi đang thi đấu (status === 'playing') -> Đường đua điểm Real-time
  if (isHostRoomCreated && hostRoomData?.status === 'playing') {
    return (
      <HostPlayingView
        roomPin={hostRoomPin}
        players={hostRoomData.players || {}}
        onEndGame={() => {
          updateRoomStatusOnFirebase(hostRoomPin, 'finished');
        }}
      />
    );
  }

  // Host View: Ban đầu hoặc phòng chờ (status === 'waiting')
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-600 text-white font-black text-sm flex items-center justify-center">
              PQ
            </div>
            <span className="font-extrabold text-base text-slate-900 tracking-tight">
              Đấu Trường Tin Học 10 • Phú Quốc
            </span>
          </div>

          {isHostRoomCreated && (
            <span className="text-xs font-bold text-sky-800 bg-sky-50 px-3 py-1 rounded-full border border-sky-200 font-mono">
              Phòng: #{hostRoomPin}
            </span>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center py-6">
        {!isHostRoomCreated ? (
          /* TRANG CHỦ BAN ĐẦU: CHỈ CÓ ĐÚNG 1 NÚT TẠO PHÒNG! */
          <div className="w-full max-w-md mx-auto px-4 text-center space-y-6">
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
                Quản Trò (Host)
              </span>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Cẩm Nang Du Lịch Phú Quốc
              </h1>
              <p className="text-slate-600 text-sm">
                Bấm nút bên dưới để tạo phòng thi đấu mới trên Firebase và lấy đường link cho các tổ vào chơi online.
              </p>
            </div>

            {/* CHỈ CÓ ĐÚNG 1 NÚT TẠO PHÒNG THÔI */}
            <button
              type="button"
              onClick={handleHostCreateRoom}
              className="w-full bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-extrabold py-5 px-8 rounded-2xl shadow-md text-lg tracking-wide transition-all cursor-pointer hover:shadow-lg active:scale-[0.99]"
            >
              TẠO PHÒNG
            </button>
          </div>
        ) : (
          /* KHI ĐÃ TẠO PHÒNG: LOBBY CHỜ NGƯỜI CHƠI (STATUS == 'WAITING') */
          <HostRoomView
            roomPin={hostRoomPin}
            playerUrl={getPlayerUrl(hostRoomPin)}
            players={
              hostRoomData?.players
                ? Object.values(hostRoomData.players).map((p) => p.name)
                : []
            }
            timerSeconds={hostCountdown}
            isTimerRunning={!!hostRoomData?.startTime && hostRoomData.startTime > 0}
            onOpenPlayerTab={handleOpenPlayerTab}
          />
        )}
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-200 bg-white py-3.5 px-6 text-center text-xs text-slate-500">
        Đấu trường Tin học 10 • Tự động tính giờ 2 phút khi có người đầu tiên hoặc đủ 8 tổ qua Firebase Realtime Database
      </footer>
    </div>
  );
}
