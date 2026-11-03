import { useLang } from '../i18n';
import { sound } from '../game/sound';
import { useState } from 'react';

export function TopBar() {
  const { lang, setLang } = useLang();
  const [muted, setMuted] = useState(sound.isMuted());
  return (
    <div className="topbar">
      <button
        className="chip-btn"
        aria-label="Sound"
        onClick={() => {
          setMuted(sound.toggleMute());
          sound.tap();
        }}
      >
        {muted ? '🔇' : '🔊'}
      </button>
      <button
        className="chip-btn"
        aria-label="Language"
        onClick={() => {
          sound.tap();
          setLang(lang === 'ar' ? 'en' : 'ar');
        }}
      >
        {lang === 'ar' ? 'EN' : 'عربي'}
      </button>
    </div>
  );
}

export function Home({ onPlay, onHow }: { onPlay: () => void; onHow: () => void }) {
  const { t } = useLang();
  return (
    <div className="screen home">
      <TopBar />
      <div className="home-hero">
        <div className="logo-emoji" aria-hidden="true">🤥</div>
        <h1 className="title">{t('app.name')}</h1>
        <p className="tag">{t('app.tag')}</p>
      </div>
      <div className="stack">
        <button
          id="btn-play"
          className="btn btn-primary btn-xl"
          onClick={() => {
            sound.flip();
            onPlay();
          }}
        >
          {t('home.play')}
        </button>
        <button className="btn btn-ghost" onClick={() => { sound.tap(); onHow(); }}>
          {t('home.how')}
        </button>
      </div>
      <p className="footer">{t('home.footer')}</p>
    </div>
  );
}

export function HowTo({ onClose }: { onClose: () => void }) {
  const { t } = useLang();
  return (
    <div className="overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <h2 className="sheet-title">{t('how.title')}</h2>
        <ol className="how-list">
          {[1, 2, 3, 4, 5].map((n) => (
            <li key={n}>
              <span className="how-num">{n}</span>
              <div>
                <b>{t(`how.${n}t`)}</b>
                <p>{t(`how.${n}b`)}</p>
              </div>
            </li>
          ))}
        </ol>
        <button className="btn btn-primary" onClick={() => { sound.tap(); onClose(); }}>
          {t('how.close')}
        </button>
      </div>
    </div>
  );
}

