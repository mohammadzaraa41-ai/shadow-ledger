import { useState } from 'react';
import { HelpCircle, Moon, ShieldAlert, Skull, Trophy, Users, Volume2, VolumeX } from 'lucide-react';
import { sensoryAudio } from '../game/audioEngine';
import { getUnlockedAchievements } from '../game/steam';
import type { GameState } from '../game/store';
import { useLang } from '../i18n';
import { LangToggle } from './shared';

const SEGS = 25;

export function StatusBar({
  state,
  onAdvance,
  onEndDay,
  onHelp,
  onOpenSteam,
  onOpenMultiplayer,
  activeChapter = 1,
  onOpenChapters,
}: {
  state: GameState;
  onAdvance: () => void;
  onEndDay: () => void;
  onHelp: () => void;
  onOpenSteam: () => void;
  onOpenMultiplayer?: () => void;
  activeChapter?: number;
  onOpenChapters?: () => void;
}) {
  const { t, tx, lang } = useLang();
  const { player, news } = state;
  const [muted, setMuted] = useState(sensoryAudio.getMuted());
  const unlockedCount = getUnlockedAchievements().size;

  const toggleSound = () => {
    const isNowMuted = sensoryAudio.toggleMute();
    setMuted(isNowMuted);
  };

  const s = player.suspicion;
  const lit = Math.round((s / 100) * SEGS);
  const level = s >= 75 ? 'crit' : s >= 40 ? 'warn' : 'ok';
  const ticker = news.filter((n) => !n.unlockKills || player.kills.length >= n.unlockKills).slice(0, 8);
  const text = ticker.map((n) => tx(n.headline)).join('  ✕  ');

  return (
    <header className="status">
      <div className="status-row">
        <div className="clock">
          <b>{t('st.day')} {String(player.day).padStart(2, '0')}</b>
          <span>{String(player.hour).padStart(2, '0')}:00</span>
        </div>

        <div className="kills" title={lang === 'ar' ? 'الأهداف التي تمت تصفيتها من إجمالي المطلوبين' : 'Targets eliminated out of total wanted'}>
          <Skull size={13} /> {player.kills.length}/{state.targets.filter((t) => t.priority !== 'DECOY').length}
        </div>

        {onOpenChapters && (
          <button
            id="btn-chapter-indicator"
            type="button"
            className="chapter-status-pill"
            onClick={onOpenChapters}
            title={lang === 'ar' ? 'خريطة فصول ومراحل القصة' : 'Story Chapters Map'}
          >
            <ShieldAlert size={12} className="chapter-pill-glyph" />
            <span>{lang === 'ar' ? `فصل ${activeChapter}` : `Ch. ${activeChapter}`}</span>
          </button>
        )}

        <div className="time-btns">
          {/* Steam Hub Button */}
          <button
            id="btn-steam-hub"
            className="steam-icon-btn"
            onClick={onOpenSteam}
            title={lang === 'ar' ? `إنجازات Steam (${unlockedCount}/7)` : `Steam Achievements (${unlockedCount}/7)`}
          >
            <Trophy size={13} />
            <span className="steam-micro-badge">{unlockedCount}</span>
          </button>

          {/* 1v1 Online Duel Button */}
          {onOpenMultiplayer && (
            <button
              id="btn-multiplayer-hub"
              className="steam-icon-btn mp-icon-btn"
              onClick={onOpenMultiplayer}
              title={lang === 'ar' ? 'تحدي قاضي الظل ضد المحقق (1v1 أونلاين)' : 'Shadow vs Detective (1v1 Online)'}
            >
              <Users size={13} />
            </button>
          )}

          {/* Sensory Ambient Sound Toggle */}
          <button
            id="btn-sound-toggle"
            className={`sound-toggle-btn ${muted ? 'muted' : 'active'}`}
            onClick={toggleSound}
            title={muted ? (lang === 'ar' ? 'تشغيل المؤثرات الصوتية والمطر' : 'Unmute ambient audio') : (lang === 'ar' ? 'كتم الصوت' : 'Mute audio')}
          >
            {muted ? <VolumeX size={13} /> : <Volume2 size={13} />}
          </button>

          <button id="btn-help" onClick={onHelp} aria-label={t('st.help')}>
            <HelpCircle size={14} />
          </button>

          <LangToggle />

          <button onClick={onAdvance} id="btn-advance-hour" disabled={player.hour >= 23}>
            +1H
          </button>

          <button onClick={onEndDay} id="btn-end-day" className="end">
            <Moon size={12} /> {t('st.endDay')}
          </button>
        </div>
      </div>

      <div className="susp" role="meter" aria-valuenow={s} aria-valuemin={0} aria-valuemax={100} aria-label={t('st.suspects')}>
        <span className="susp-name">{t('st.suspects')}</span>
        <div className="segs">
          {Array.from({ length: SEGS }, (_, i) => (
            <i key={i} className={i < lit ? `lit ${level}` : ''} />
          ))}
        </div>
        <b className={`susp-val ${level}`}>{s}%</b>
      </div>

      <div className="ticker" aria-live="polite">
        <span className="ticker-badge">NEWS</span>
        <div className="ticker-track">
          <div className="ticker-move" key={text}>{text}</div>
        </div>
      </div>
    </header>
  );
}
