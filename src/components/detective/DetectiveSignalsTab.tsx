import { useState } from 'react';
import { Activity, Radio, Volume2 } from 'lucide-react';
import { sensoryAudio } from '../../game/audioEngine';
import type { GameState } from '../../game/store';
import type { NewsItem } from '../../game/types';
import { useLang } from '../../i18n';

export function DetectiveSignalsTab({
  state,
}: {
  state: GameState;
}) {
  const { lang, tx } = useLang();
  const isRtl = lang === 'ar';
  const [playingSignalId, setPlayingSignalId] = useState<string | null>(null);

  const wiretapNews = state.news.filter((n: NewsItem) => n.channel === 'WIRETAP');

  const handlePlayWiretap = (id: string) => {
    setPlayingSignalId(id);
    sensoryAudio.playRadioStatic(2.5);
    window.setTimeout(() => {
      setPlayingSignalId((curr) => (curr === id ? null : curr));
    }, 2500);
  };

  return (
    <div className="detective-panel signals-view-panel">
      <div className="panel-header">
        <Activity size={15} />
        <h3>{isRtl ? 'مرصد الإشارات ورصد التنصت اللاسلكي (Radio Intercept Oscilloscope)' : 'Radio Telemetry & Intercept Oscilloscope'}</h3>
      </div>

      <div className="signals-content-box">
        <div className="oscilloscope-screen">
          <div className="oscilloscope-grid" />
          <div className="oscilloscope-wave-line" />
          <span className="oscilloscope-hud-tag">FREQ: 142.85 MHz // DECRYPTOR: ACTIVE</span>
        </div>

        <div className="signals-feed-list">
          {wiretapNews.length === 0 ? (
            <p className="no-signals-hint">
              {isRtl ? 'لا توجد تسجيلات مسرّبة حالياً على التردد.' : 'No active radio transmissions intercepted.'}
            </p>
          ) : (
            wiretapNews.map((wn: NewsItem) => (
              <div key={wn.id} className="signal-feed-row">
                <div className="signal-row-info">
                  <Radio size={13} className="pulse-icon" />
                  <b>{tx(wn.headline)}</b>
                </div>
                <button
                  className={`btn-play-wiretap ${playingSignalId === wn.id ? 'is-playing' : ''}`}
                  onClick={() => handlePlayWiretap(wn.id)}
                >
                  <Volume2 size={12} />
                  <span>{playingSignalId === wn.id ? (isRtl ? 'جارٍ البث...' : 'Playing...') : isRtl ? 'استمع للبث 🔊' : 'Play Audio 🔊'}</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
