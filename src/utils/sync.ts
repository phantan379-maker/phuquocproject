export interface SyncMessage {
  type: 'UPDATE_TEAMS' | 'CHANGE_ROUND' | 'SYNC_TIMER' | 'PLAYER_JOINED' | 'START_GAME' | 'ROOM_SYNC';
  roomCode: string;
  players?: string[];
  playerName?: string;
  timerSeconds?: number;
  isTimerRunning?: boolean;
  isGameStarted?: boolean;
}

class ClassroomSyncManager {
  private channel: BroadcastChannel | null = null;
  private listeners: ((msg: SyncMessage) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel('phuquoc_tin10_room_channel');
        this.channel.onmessage = (event) => {
          this.notifyListeners(event.data);
        };
      } catch (err) {
        console.warn('BroadcastChannel error', err);
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === 'phuquoc_room_sync' && e.newValue) {
          try {
            const data = JSON.parse(e.newValue);
            this.notifyListeners(data);
          } catch {
            // ignore
          }
        }
      });
    }
  }

  broadcast(message: SyncMessage) {
    if (this.channel) {
      try {
        this.channel.postMessage(message);
      } catch {
        // ignore
      }
    }
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('phuquoc_room_sync', JSON.stringify({ ...message, _ts: Date.now() }));
      } catch {
        // ignore
      }
    }
  }

  subscribe(callback: (msg: SyncMessage) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private notifyListeners(msg: SyncMessage) {
    this.listeners.forEach((cb) => {
      try {
        cb(msg);
      } catch {
        // ignore
      }
    });
  }
}

export const syncManager = new ClassroomSyncManager();
