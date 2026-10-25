import { useState } from 'react';
import { Radio, Skull } from 'lucide-react';
import { sensoryAudio } from '../game/audioEngine';
import type { Action, GameState } from '../game/store';
import { useLang } from '../i18n';
import { TerminalCounterIntel } from './terminal/TerminalCounterIntel';
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
  const [tab, setTab] = useState<'osint' | 'deduce' | 'hunt'>('osint');

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
          <span className="avatar sm" /> {lang === 'ar' ? 'رادار التحري' : 'Detective Radar'}
        </button>
        <button
          id="tab-hunt"
          role="tab"
          className={`tab-hunt-detective ${tab === 'hunt' ? 'on' : ''}`}
          onClick={() => {
            sensoryAudio.playLetterScratch();
            setTab('hunt');
          }}
        >
          <Skull size={15} className="text-red" /> {lang === 'ar' ? 'صيد المحقق L' : 'Hunt Detective L'}
        </button>
      </div>
      <div className="screen">
        {tab === 'osint' ? (
          <TerminalFeeds state={state} dispatch={dispatch} />
        ) : tab === 'deduce' ? (
          <TerminalDeductions state={state} />
        ) : (
          <TerminalCounterIntel state={state} dispatch={dispatch} />
        )}
      </div>
    </section>
  );
}
