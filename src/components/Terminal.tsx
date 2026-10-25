import { useState } from 'react';
import { Radio } from 'lucide-react';
import { sensoryAudio } from '../game/audioEngine';
import type { Action, GameState } from '../game/store';
import { useLang } from '../i18n';
import { TerminalDeductions } from './terminal/TerminalDeductions';
import { TerminalFeeds } from './terminal/TerminalFeeds';

export function Terminal({
  state,
  dispatch,
}: {
  state: GameState;
  dispatch: (a: Action) => void;
}) {
  const { t, lang } = useLang();
  const [tab, setTab] = useState<'osint' | 'deduce'>('osint');

  return (
    <section className={`terminal ${tab}`}>
      <div className="tabs" role="tablist">
        <button
          id="tab-osint"
          role="tab"
          className={tab === 'osint' ? 'on' : ''}
          onClick={() => {
            sensoryAudio.playKeystroke();
            setTab('osint');
          }}
        >
          <Radio size={16} /> {t('tab.investigate')}
        </button>
        <button
          id="tab-deduce"
          role="tab"
          className={tab === 'deduce' ? 'on' : ''}
          onClick={() => {
            sensoryAudio.playKeystroke();
            setTab('deduce');
          }}
        >
          <span className="avatar sm" /> {lang === 'ar' ? 'المحقق L' : 'Detective L'}
        </button>
      </div>
      <div className="screen">
        {tab === 'osint' ? (
          <TerminalFeeds state={state} dispatch={dispatch} />
        ) : (
          <TerminalDeductions state={state} />
        )}
      </div>
    </section>
  );
}
