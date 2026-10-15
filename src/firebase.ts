import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, update, onValue, push, get } from 'firebase/database';

// Firebase configuration provided by user
const firebaseConfig = {
  apiKey: "AIzaSyAj3d81NiyD0O4X96-gma3If6QsKIFV0xI",
  authDomain: "gamephuquoc.firebaseapp.com",
  databaseURL: "https://gamephuquoc-default-rtdb.firebaseio.com",
  projectId: "gamephuquoc",
  storageBucket: "gamephuquoc.firebasestorage.app",
  messagingSenderId: "155186957229",
  appId: "1:155186957229:web:ec2c4af1dbd2dc213d6f24",
  measurementId: "G-BCRZQ58LPM"
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
export const rtdb = getDatabase(app);

export interface FirebasePlayer {
  id: string;
  name: string;
  score: number;
  finished?: boolean;
  currentGame?: number;
  joinedAt?: number;
}

export interface FirebaseRoom {
  status: 'waiting' | 'playing' | 'finished';
  startTime: number; // Target timestamp ms for 2 min countdown
  createdAt: number;
  players?: Record<string, FirebasePlayer>;
}

// Helpers for Room & Player actions
export const createRoomOnFirebase = async (pin: string): Promise<void> => {
  const roomRef = ref(rtdb, `rooms/${pin}`);
  await set(roomRef, {
    status: 'waiting',
    startTime: 0,
    createdAt: Date.now(),
    players: {},
  });
};

export const joinRoomOnFirebase = async (
  pin: string,
  playerName: string
): Promise<{ playerId: string }> => {
  const playersRef = ref(rtdb, `rooms/${pin}/players`);
  const newPlayerRef = push(playersRef);
  const playerId = newPlayerRef.key || `p_${Date.now()}`;

  const roomSnap = await get(ref(rtdb, `rooms/${pin}`));
  const roomData = roomSnap.val() as FirebaseRoom | null;

  const currentPlayers = roomData?.players ? Object.keys(roomData.players) : [];
  const isFirstPlayer = currentPlayers.length === 0;

  // Add the player
  await set(newPlayerRef, {
    id: playerId,
    name: playerName,
    score: 0,
    finished: false,
    currentGame: 1,
    joinedAt: Date.now(),
  });

  // If first player: set startTime = Date.now() + 120000 (2 minutes countdown)
  if (isFirstPlayer || !roomData?.startTime) {
    const roomRef = ref(rtdb, `rooms/${pin}`);
    await update(roomRef, {
      startTime: Date.now() + 120000,
    });
  }

  // If after adding, count reaches 8: trigger auto-start
  if (currentPlayers.length + 1 >= 8) {
    const roomRef = ref(rtdb, `rooms/${pin}`);
    await update(roomRef, {
      status: 'playing',
    });
  }

  return { playerId };
};

export const updatePlayerScoreOnFirebase = async (
  pin: string,
  playerId: string,
  score: number,
  currentGame?: number,
  finished?: boolean
): Promise<void> => {
  const playerRef = ref(rtdb, `rooms/${pin}/players/${playerId}`);
  const updates: Partial<FirebasePlayer> = { score };
  if (currentGame !== undefined) updates.currentGame = currentGame;
  if (finished !== undefined) updates.finished = finished;

  await update(playerRef, updates);
};

export const updateRoomStatusOnFirebase = async (
  pin: string,
  status: 'waiting' | 'playing' | 'finished'
): Promise<void> => {
  const roomRef = ref(rtdb, `rooms/${pin}`);
  await update(roomRef, { status });
};
