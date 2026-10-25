import { useEffect, useState } from 'react';
import { Award, Layers, Trophy, X } from 'lucide-react';
import { sensoryAudio } from '../game/audioEngine';
import {
  STEAM_ACHIEVEMENTS_LIST,
  STEAM_TRADING_CARDS,
  getUnlockedAchievements,
  subscribeSteamAchievements,
  type SteamAchievement,
} from '../game/steam';
import { useLang } from '../i18n';

export function SteamOverlayToast() {
  const { lang } = useLang();
  const [toast, setToast] = useState<SteamAchievement | null>(null);

  useEffect(() => {
    return subscribeSteamAchievements((ach) => {
      sensoryAudio.playSteamChime();
      setToast(ach);
      const timer = setTimeout(() => setToast(null), 4500);
      return () => clearTimeout(timer);
    });
  }, []);

  if (!toast) return null;

  return (
    <aside className="steam-toast" role="alert" aria-live="assertive">
      <div className="steam-toast-icon">
        <span>{toast.icon}</span>
      </div>
      <div className="steam-toast-body">
        <span className="steam-toast-header">STEAM ACHIEVEMENT UNLOCKED</span>
        <b className="steam-toast-title">{toast.name[lang]}</b>
        <small className="steam-toast-desc">{toast.desc[lang]}</small>
      </div>
    </aside>
  );
}

export function SteamHubModal({ onClose }: { onClose: () => void }) {
  const { lang } = useLang();
  const [tab, setTab] = useState<'achievements' | 'cards'>('achievements');
  const unlockedSet = getUnlockedAchievements();

  return (
    <div className="overlay steam-modal-overlay" role="dialog" aria-modal="true" aria-label="Steam Community Hub">
      <div className="steam-hub">
        <div className="steam-hub-head">
          <div className="steam-logo-wrap">
            <span className="steam-dot" />
            <h3>STEAMWORKS COMMUNITY HUB</h3>
          </div>
          <button className="steam-close" onClick={onClose} aria-label="Close Steam Hub">
            <X size={18} />
          </button>
        </div>

        <div className="steam-hub-nav">
          <button
            className={`steam-nav-btn ${tab === 'achievements' ? 'on' : ''}`}
            onClick={() => setTab('achievements')}
          >
            <Trophy size={14} /> {lang === 'ar' ? 'الإنجازات (Achievements)' : 'Achievements'}
            <span className="steam-badge-count">{unlockedSet.size}/{STEAM_ACHIEVEMENTS_LIST.length}</span>
          </button>
          <button
            className={`steam-nav-btn ${tab === 'cards' ? 'on' : ''}`}
            onClick={() => setTab('cards')}
          >
            <Layers size={14} /> {lang === 'ar' ? 'كروت التداول (Trading Cards)' : 'Trading Cards'}
            <span className="steam-badge-count">6 Cards</span>
          </button>
        </div>

        <div className="steam-hub-content">
          {tab === 'achievements' ? (
            <div className="steam-ach-grid">
              {STEAM_ACHIEVEMENTS_LIST.map((ach) => {
                const isUnlocked = unlockedSet.has(ach.id);
                return (
                  <div key={ach.id} className={`steam-ach-card ${isUnlocked ? 'unlocked' : 'locked'}`}>
                    <div className="steam-ach-badge">{ach.icon}</div>
                    <div className="steam-ach-info">
                      <div className="steam-ach-row">
                        <b>{ach.name[lang]}</b>
                        <span className={`steam-rarity ${ach.rarity.toLowerCase().replace(' ', '-')}`}>
                          {ach.rarity}
                        </span>
                      </div>
                      <p>{ach.desc[lang]}</p>
                      <small>{isUnlocked ? (lang === 'ar' ? '✓ تم الفتح' : '✓ Unlocked') : (lang === 'ar' ? '🔒 مقفول' : '🔒 Locked')}</small>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="steam-cards-grid">
              {STEAM_TRADING_CARDS.map((card) => (
                <div key={card.id} className={`steam-trading-card ${card.rarity.toLowerCase()}`}>
                  <div className="steam-card-art">
                    <Award size={28} />
                    <span className="steam-card-rarity">{card.rarity}</span>
                  </div>
                  <b>{card.title[lang]}</b>
                  <p>{card.lore[lang]}</p>
                  <div className="steam-card-footer">
                    <span>Badge Lv.{card.badgeLevel}</span>
                    <em>Craftable</em>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
