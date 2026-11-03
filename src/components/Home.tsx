import { useState } from 'react';
import { sound } from '../game/sound';
import { useLang } from '../i18n';

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
        <button
          className="btn btn-ghost"
          onClick={() => {
            sound.tap();
            onHow();
          }}
        >
          {t('home.how')}
        </button>
      </div>
      <p className="footer">{t('home.footer')}</p>
    </div>
  );
}

export function HowTo({ onClose }: { onClose: () => void }) {
  const { t } = useLang();
  const [tab, setTab] = useState<1 | 2 | 3>(1);
  const [holdingDemo, setHoldingDemo] = useState(false);

  return (
    <div className="overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <h2 className="sheet-title">{t('how.title')}</h2>

        <div className="seg">
          {([1, 2, 3] as const).map((n) => (
            <button
              key={n}
              className={tab === n ? 'on' : ''}
              onClick={() => {
                sound.tap();
                setTab(n);
              }}
            >
              {t(`how.tab${n}`)}
            </button>
          ))}
        </div>

        {tab === 1 && (
          <>
            <div className="demo-card-box">
              <small className="demo-label">{t('how.tryTitle')}</small>
              <div
                className={`demo-secret-card ${holdingDemo ? 'open' : ''}`}
                onPointerDown={() => {
                  sound.flip();
                  setHoldingDemo(true);
                }}
                onPointerUp={() => setHoldingDemo(false)}
                onPointerLeave={() => setHoldingDemo(false)}
                onPointerCancel={() => setHoldingDemo(false)}
                onContextMenu={(e) => e.preventDefault()}
              >
                {holdingDemo ? (
                  <>
                    <span className="demo-word">🤫 {t('how.tryWord')}</span>
                    <small>{t('how.trySub')}</small>
                  </>
                ) : (
                  <span>{t('how.tryHold')}</span>
                )}
              </div>
            </div>

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
          </>
        )}

        {tab === 2 && (
          <div className="how-cards">
            <div className="info-card">
              <h3>{t('how.rolesTitle')}</h3>
              <p>{t('how.roleLiar')}</p>
              <p>{t('how.roleJester')}</p>
              <p>{t('how.roleWitness')}</p>
            </div>
            <div className="info-card">
              <h3>{t('setup.chaos')}</h3>
              <p><b>{t('chaos.DOUBLE')}</b> — {t('chaos.DOUBLEd')}</p>
              <p><b>{t('chaos.SPEED')}</b> — {t('chaos.SPEEDd')}</p>
              <p><b>{t('chaos.WHISPER')}</b> — {t('chaos.WHISPERd')}</p>
            </div>
          </div>
        )}

        {tab === 3 && (
          <div className="how-cards">
            <div className="info-card">
              <h3>{t('how.remoteTitle')}</h3>
              <p>{t('how.remote1')}</p>
              <p>{t('how.remote2')}</p>
            </div>
          </div>
        )}

        <button
          className="btn btn-primary"
          onClick={() => {
            sound.tap();
            onClose();
          }}
        >
          {t('how.close')}
        </button>
      </div>
    </div>
  );
}
