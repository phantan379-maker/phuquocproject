export type GameRound =
  | 'waiting'
  | 'game1'
  | 'game2'
  | 'game3'
  | 'game4'
  | 'leaderboard'
  | 'LOBBY'
  | 'ROUND_1'
  | 'ROUND_2'
  | 'ROUND_3'
  | 'LEADERBOARD';

export type TextStyleTag = 'Heading 1' | 'Heading 2' | 'Normal' | 'Title';

export interface OutlineItem {
  id: string;
  rawText: string;
  expectedStyle: TextStyleTag;
  assignedStyle?: TextStyleTag;
  hint: string;
  explanation: string;
}

export interface Team {
  id: string;
  name: string; // "Tổ 1", "Tổ 2", ...
  mascot: string;
  avatarIcon: string;
  color: string;
  score: number;
  totalScore: number;
  currentRank: number;
  isReady: boolean;
  progress: number;
  round1Score: number;
  round2Score: number;
  round3Score: number;
  round1Progress: number;
  round2Progress: number;
  round3Progress: number;
  completedRounds: number;
}

export interface CropBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface MapChallenge {
  id: string;
  title: string;
  targetName: string;
  prompt: string;
  hint: string;
  targetX: number;
  targetY: number;
  description: string;
}

export interface TableOfContentItem {
  id: string;
  order: number;
  title: string;
  correctIndex: number;
}

export interface RoomFirebaseState {
  status: GameRound;
  startTime: number;
  players: Record<string, Team>;
}
