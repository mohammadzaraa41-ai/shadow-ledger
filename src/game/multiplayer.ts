import { Peer, type DataConnection } from 'peerjs';
import type { Action, GameState } from './store';
import type { Region } from './types';

export type PlayerRole = 'KILLER' | 'DETECTIVE';

export interface ChatMessage {
  id: string;
  senderName: string;
  senderRole: PlayerRole;
  text: string;
  timestamp: string;
  hasAudioScramble?: boolean;
}

export interface MultiplayerState {
  isConnected: boolean;
  isHost: boolean;
  roomCode: string;
  localName: string;
  localRole: PlayerRole;
  opponentName: string;
  opponentRole: PlayerRole;
  chatMessages: ChatMessage[];
}

export type NetMessage =
  | { type: 'HANDSHAKE'; name: string; role: PlayerRole }
  | { type: 'STATE_SYNC'; state: GameState }
  | { type: 'ACTION'; action: Action }
  | { type: 'CHAT'; message: ChatMessage }
  | { type: 'PLANT_DECOY'; region: Region; fakeName: string }
  | { type: 'DEPLOY_CAMERA'; region: Region }
  | { type: 'ARREST_WARRANT'; region: Region }
  | { type: 'LIND_L_BROADCAST'; region: Region; decoyName: string; timerSec: number }
  | { type: 'LIND_L_RESOLVE'; wasKilled: boolean; killerRegion?: Region }
  | { type: 'SHINIGAMI_EYES_TRIGGERED' }
  | { type: 'SCHEDULED_KILL'; targetName: string; delaySec: number };

type MessageCallback = (msg: NetMessage) => void;
type StatusCallback = (connected: boolean, opponentName?: string) => void;
type ChatCallback = (msg: ChatMessage, allMessages: ChatMessage[]) => void;

class MultiplayerService {
  private peer: Peer | null = null;
  private conn: DataConnection | null = null;
  private bc: BroadcastChannel | null = null;
  private messageListeners: Set<MessageCallback> = new Set();
  private statusListeners: Set<StatusCallback> = new Set();
  private chatListeners: Set<ChatCallback> = new Set();

  public state: MultiplayerState = {
    isConnected: false,
    isHost: false,
    roomCode: '',
    localName: 'قاضي الظل (The Shadow)',
    localRole: 'KILLER',
    opponentName: 'المحقق سايفر (Detective Cipher)',
    opponentRole: 'DETECTIVE',
    chatMessages: [],
  };

  public onMessage(cb: MessageCallback) {
    this.messageListeners.add(cb);
    return () => {
      this.messageListeners.delete(cb);
    };
  }

  public onStatus(cb: StatusCallback) {
    this.statusListeners.add(cb);
    return () => {
      this.statusListeners.delete(cb);
    };
  }

  public onChat(cb: ChatCallback) {
    this.chatListeners.add(cb);
    return () => {
      this.chatListeners.delete(cb);
    };
  }

  public initRoom(roomCode: string, name: string, role: PlayerRole, isHost: boolean) {
    this.cleanup();

    this.state.roomCode = roomCode.toUpperCase().trim();
    this.state.localName = name.trim() || (role === 'KILLER' ? 'قاضي الظل (The Shadow)' : 'المحقق سايفر (Detective Cipher)');
    this.state.localRole = role;
    this.state.isHost = isHost;
    this.state.opponentRole = role === 'KILLER' ? 'DETECTIVE' : 'KILLER';
    this.state.opponentName = role === 'KILLER' ? 'المحقق سايفر (Detective Cipher)' : 'قاضي الظل (The Shadow)';

    // 1. Setup local BroadcastChannel for instant testing across tabs on the same device
    try {
      this.bc = new BroadcastChannel(`shadow_ledger_${this.state.roomCode}`);
      this.bc.onmessage = (ev) => {
        const data = ev.data as NetMessage;
        this.handleIncoming(data);
      };
    } catch {}

    // 2. Setup PeerJS WebRTC P2P for cross-phone online connection
    const cleanCode = this.state.roomCode.replace(/[^A-Z0-9]/gi, '').toLowerCase();
    const myPeerId = isHost ? `shadow-ledger-${cleanCode}-host` : `shadow-ledger-${cleanCode}-guest-${Math.floor(Math.random() * 1000)}`;

    try {
      this.peer = new Peer(myPeerId, {
        debug: 1,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
            { urls: 'stun:stun3.l.google.com:19302' },
            { urls: 'stun:stun4.l.google.com:19302' },
            {
              urls: 'turn:openrelay.metered.ca:80',
              username: 'openrelayproject',
              credential: 'openrelayproject',
            },
            {
              urls: 'turn:openrelay.metered.ca:443',
              username: 'openrelayproject',
              credential: 'openrelayproject',
            },
            {
              urls: 'turn:openrelay.metered.ca:443?transport=tcp',
              username: 'openrelayproject',
              credential: 'openrelayproject',
            },
          ],
        },
      });

      this.peer.on('open', () => {
        if (!isHost) {
          // Connect to host
          const hostPeerId = `shadow-ledger-${cleanCode}-host`;
          const conn = this.peer!.connect(hostPeerId, { reliable: true });
          this.setupConnection(conn);
        }
      });

      this.peer.on('connection', (incomingConn) => {
        this.setupConnection(incomingConn);
      });

      this.peer.on('error', () => {
        // Fallback gracefully to BroadcastChannel
      });
    } catch {}

    // Broadcast Handshake to local channel
    setTimeout(() => {
      this.sendRaw({
        type: 'HANDSHAKE',
        name: this.state.localName,
        role: this.state.localRole,
      });
    }, 400);
  }

  private setupConnection(conn: DataConnection) {
    this.conn = conn;

    conn.on('open', () => {
      this.state.isConnected = true;
      this.statusListeners.forEach((cb) => cb(true));

      // Send Handshake
      this.sendRaw({
        type: 'HANDSHAKE',
        name: this.state.localName,
        role: this.state.localRole,
      });
    });

    conn.on('data', (data) => {
      this.handleIncoming(data as NetMessage);
    });

    conn.on('close', () => {
      this.state.isConnected = false;
      this.statusListeners.forEach((cb) => cb(false));
    });
  }

  private handleIncoming(data: NetMessage) {
    if (!data || !data.type) return;

    if (data.type === 'HANDSHAKE') {
      this.state.isConnected = true;
      this.state.opponentName = data.name;
      this.state.opponentRole = data.role;
      this.statusListeners.forEach((cb) => cb(true, data.name));
      return;
    }

    if (data.type === 'CHAT') {
      this.state.chatMessages.push(data.message);
      this.chatListeners.forEach((cb) => cb(data.message, this.state.chatMessages));
    }

    this.messageListeners.forEach((cb) => {
      try {
        cb(data);
      } catch (err) {
        console.error('[Multiplayer] Listener error:', err);
      }
    });
  }

  public send(msg: NetMessage) {
    if (msg.type === 'CHAT') {
      this.state.chatMessages.push(msg.message);
      this.chatListeners.forEach((cb) => cb(msg.message, this.state.chatMessages));
    }
    this.sendRaw(msg);
  }

  private sendRaw(msg: NetMessage) {
    // Send via PeerJS WebRTC
    if (this.conn && this.conn.open) {
      try {
        this.conn.send(msg);
      } catch {}
    }
    // Also send via local BroadcastChannel
    if (this.bc) {
      try {
        this.bc.postMessage(msg);
      } catch {}
    }
  }

  public cleanup() {
    if (this.conn) {
      try { this.conn.close(); } catch {}
      this.conn = null;
    }
    if (this.peer) {
      try { this.peer.destroy(); } catch {}
      this.peer = null;
    }
    if (this.bc) {
      try { this.bc.close(); } catch {}
      this.bc = null;
    }
    this.state.isConnected = false;
    this.state.chatMessages = [];
  }
}

export const multiplayer = new MultiplayerService();
