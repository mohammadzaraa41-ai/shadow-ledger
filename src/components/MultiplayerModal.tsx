import { useEffect, useState } from 'react';
import { Check, Copy, Flame, Play, ShieldAlert, Sparkles, Users, X, User } from 'lucide-react';
import { sensoryAudio } from '../game/audioEngine';
import { multiplayer, type PlayerRole } from '../game/multiplayer';
import { useLang } from '../i18n';

export function MultiplayerModal({
  onClose,
  onStartGame,
}: {
  onClose: () => void;
  onStartGame: (role: PlayerRole, myName: string, opponentName: string, roomCode: string) => void;
}) {
  const { lang } = useLang();
  const isRtl = lang === 'ar';

  const [tab, setTab] = useState<'CREATE' | 'JOIN'>('CREATE');
  const [role, setRole] = useState<PlayerRole>('KILLER');
  const [name, setName] = useState(role === 'KILLER' ? 'قاضي الظل (The Shadow)' : 'المحقق سايفر (Detective Cipher)');
  const [roomCode, setRoomCode] = useState(() => `ROOM-${Math.floor(100 + Math.random() * 900)}`);
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [opponentName, setOpponentName] = useState('');

  // Update default name placeholder when role changes if user hasn't heavily customized
  const handleRoleSelect = (newRole: PlayerRole) => {
    setRole(newRole);
    if (name === 'قاضي الظل (The Shadow)' || name === 'المحقق سايفر (Detective Cipher)' || name === 'لايت (KIRA)' || name === 'المحقق L') {
      setName(newRole === 'KILLER' ? 'قاضي الظل (The Shadow)' : 'المحقق سايفر (Detective Cipher)');
    }
  };

  useEffect(() => {
    multiplayer.onStatus((connected, oppName) => {
      setIsConnected(connected);
      if (oppName) setOpponentName(oppName);
    });
  }, []);

  const handleCreateRoom = () => {
    sensoryAudio.playKeystroke();
    multiplayer.initRoom(roomCode, name, role, true);
  };

  const handleJoinRoom = () => {
    if (!joinCodeInput.trim()) return;
    sensoryAudio.playKeystroke();
    const code = joinCodeInput.trim().toUpperCase();
    multiplayer.initRoom(code, name, role, false);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleLaunch = () => {
    sensoryAudio.playThunder();
    onStartGame(role, name, opponentName || (role === 'KILLER' ? 'المحقق سايفر (Detective Cipher)' : 'قاضي الظل (The Shadow)'), tab === 'CREATE' ? roomCode : joinCodeInput);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="multiplayer-modal-card" onClick={(e) => e.stopPropagation()}>
        <header className="multiplayer-modal-header">
          <div className="header-title-group">
            <span className="mp-crest">1v1 ONLINE DUEL</span>
            <h2>{isRtl ? 'مواجهة قاضي الظل ضد المحقق — تحدي هاتفين' : 'Shadow vs Detective — 1v1 Online Duel'}</h2>
          </div>
          <button className="btn-close-modal" onClick={onClose}>
            <X size={18} />
          </button>
        </header>

        {/* Player Name Input */}
        <div className="mp-field-group">
          <label className="mp-label">{isRtl ? 'اسمك المستعار في المواجهة:' : 'Your Display Name:'}</label>
          <div className="mp-input-wrapper">
            <User size={16} className="mp-field-icon" />
            <input
              type="text"
              className="mp-text-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isRtl ? 'أدخل اسمك (مثال: الظل، سايفر، المحقق، ريان)' : 'Enter your name'}
            />
          </div>
        </div>

        {/* Role Selector */}
        <div className="mp-field-group">
          <label className="mp-label">{isRtl ? 'اختر دورك في اللعبة:' : 'Choose Your Role:'}</label>
          <div className="role-selector-grid">
            <button
              type="button"
              className={`role-choice-card ${role === 'KILLER' ? 'selected killer' : ''}`}
              onClick={() => handleRoleSelect('KILLER')}
            >
              <div className="role-icon">🗡️</div>
              <div className="role-meta">
                <b>{isRtl ? 'قاضي الظل (The Shadow)' : 'The Shadow (Mastermind)'}</b>
                <small>{isRtl ? 'ينفذ الأحكام بالدفتر، يضلل المحقق، ويطهر المدينة' : 'Wields the Shadow Ledger & escapes justice'}</small>
              </div>
            </button>

            <button
              type="button"
              className={`role-choice-card ${role === 'DETECTIVE' ? 'selected detective' : ''}`}
              onClick={() => handleRoleSelect('DETECTIVE')}
            >
              <div className="role-icon">🔍</div>
              <div className="role-meta">
                <b>{isRtl ? 'المحقق سايفر (Detective Cipher)' : 'Detective Cipher (Chief)'}</b>
                <small>{isRtl ? 'يبث الطعوم، يراقب الكاميرات، ويصطاد الفاعل' : 'Plants decoys, tracks hours, issues arrests'}</small>
              </div>
            </button>
          </div>
        </div>

        {/* Create / Join Tabs */}
        <div className="mp-tabs-bar">
          <button
            type="button"
            className={`mp-tab-btn ${tab === 'CREATE' ? 'active' : ''}`}
            onClick={() => setTab('CREATE')}
          >
            {isRtl ? '🎲 إنشاء غرفة جديدة' : 'Create Room'}
          </button>
          <button
            type="button"
            className={`mp-tab-btn ${tab === 'JOIN' ? 'active' : ''}`}
            onClick={() => setTab('JOIN')}
          >
            {isRtl ? '🔑 الانضمام لغرفة بكود' : 'Join Room'}
          </button>
        </div>

        {/* Tab 1: Create Room */}
        {tab === 'CREATE' && (
          <div className="mp-tab-content">
            <p className="tab-instructions">
              {isRtl
                ? 'شارك هذا الكود مع صديقك ليدخله في هاتفه ويبدأ التحدي بينكما:'
                : 'Share this room code with your friend to connect instantly:'}
            </p>

            <div className="room-code-display-box">
              <span className="code-digits">{roomCode}</span>
              <button type="button" className="btn-copy-code" onClick={handleCopyCode}>
                {isCopied ? <Check size={14} color="#38e07b" /> : <Copy size={14} />}
                <span>{isCopied ? (isRtl ? 'تم النسخ!' : 'Copied!') : (isRtl ? 'نسخ الكود' : 'Copy')}</span>
              </button>
            </div>

            <div className="connection-status-pill">
              <span className={`status-dot ${isConnected ? 'connected' : 'waiting'}`} />
              <span>
                {isConnected
                  ? isRtl
                    ? `متصل بالخصم (${opponentName || (role === 'KILLER' ? 'المحقق سايفر' : 'قاضي الظل')})`
                    : `Connected with (${opponentName || 'Opponent'})`
                  : isRtl
                  ? 'بانتظار دخول اللاعب الثاني...'
                  : 'Waiting for player 2 to join...'}
              </span>
            </div>
          </div>
        )}

        {/* Tab 2: Join Room */}
        {tab === 'JOIN' && (
          <div className="mp-tab-content">
            <p className="tab-instructions">
              {isRtl
                ? 'أدخل كود الغرفة الذي أنشأه صديقك (مثال: ROOM-774):'
                : 'Enter the room code provided by your opponent:'}
            </p>

            <div className="join-code-input-row">
              <input
                type="text"
                className="join-text-input"
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                placeholder="ROOM-774"
              />
              <button type="button" className="btn-connect-room" onClick={handleJoinRoom}>
                {isRtl ? 'اتصال' : 'Connect'}
              </button>
            </div>

            {isConnected && (
              <div className="connection-status-pill">
                <span className="status-dot connected" />
                <span>{isRtl ? `متصل بالغرفة بنجاح مع (${opponentName})!` : `Connected with ${opponentName}!`}</span>
              </div>
            )}
          </div>
        )}

        {/* Footer Action Button */}
        <footer className="mp-modal-footer">
          <button
            type="button"
            className="btn-start-duel"
            onClick={handleLaunch}
          >
            <Play size={15} />
            <span>
              {isConnected
                ? isRtl ? '⚔️ بدء المواجهة الثنائية المباشرة!' : '⚔️ Start Live 1v1 Match!'
                : isRtl ? 'بدء اللعب بهذا الدور' : 'Start Match with this Role'}
            </span>
          </button>
        </footer>
      </div>
    </div>
  );
}
