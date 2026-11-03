import { MAX_PLAYERS, MIN_PLAYERS } from '../game/engine';
import { sound } from '../game/sound';
import type { Player, Settings } from '../game/types';
import { CATEGORIES } from '../game/words';
import { useLang } from '../i18n';
import { TopBar } from './Home';

interface Props {
  players: Player[];
  setPlayers: (p: Player[]) => void;
  settings: Settings;
  setSettings: (s: Settings) => void;
  onStart: () => void;
  onBack: () => void;
}

export function Setup({ players, setPlayers, settings, setSettings, onStart, onBack }: Props) {
  const { t, lang } = useLang();

  const rename = (id: number, name: string) => setPlayers(players.map((p) => (p.id === id ? { ...p, name } : p)));
  const add = () => {
    if (players.length >= MAX_PLAYERS) return;
    sound.tap();
    const nextId = Math.max(0, ...players.map((p) => p.id)) + 1;
    setPlayers([...players, { id: nextId, name: '', score: 0 }]);
  };
  const remove = (id: number) => {
    if (players.length <= MIN_PLAYERS) return;
    sound.tap();
    setPlayers(players.filter((p) => p.id !== id));
  };
  const toggleCat = (id: string) => {
    sound.tap();
    const has = settings.cats.includes(id);
    const cats = has ? settings.cats.filter((c) => c !== id) : [...settings.cats, id];
    setSettings({ ...settings, cats });
  };
  const set = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    sound.tap();
    setSettings({ ...settings, [key]: value });
  };

  const noCat = settings.cats.length === 0;
  const tooFew = players.length < MIN_PLAYERS;

  return (
    <div className="screen setup">
      <TopBar />
      <h2 className="screen-title">{t('setup.title')}</h2>

      <section className="panel">
        <h3>{t('setup.players')} <small>({players.length}/{MAX_PLAYERS})</small></h3>
        <div className="player-list">
          {players.map((p, i) => (
            <div className="player-row" key={p.id}>
              <span className="avatar">{i + 1}</span>
              <input
                className="input"
                value={p.name}
                maxLength={14}
                placeholder={t('setup.player', { n: i + 1 })}
                onChange={(e) => rename(p.id, e.target.value)}
              />
              {players.length > MIN_PLAYERS && (
                <button className="icon-btn" aria-label="Remove" onClick={() => remove(p.id)}>×</button>
              )}
            </div>
          ))}
        </div>
        {players.length < MAX_PLAYERS && (
          <button className="btn btn-ghost btn-sm" onClick={add}>＋ {t('setup.add')}</button>
        )}
      </section>

      <section className="panel">
        <h3>{t('setup.cats')}</h3>
        <div className="chips">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              className={`chip ${settings.cats.includes(c.id) ? 'on' : ''}`}
              onClick={() => toggleCat(c.id)}
            >
              {c.emoji} {c.name[lang]}
            </button>
          ))}
        </div>
      </section>

      <section className="panel">
        <h3>{t('setup.rounds')}</h3>
        <div className="seg">
          {[3, 5, 8].map((n) => (
            <button key={n} className={settings.rounds === n ? 'on' : ''} onClick={() => set('rounds', n)}>{n}</button>
          ))}
        </div>
        <h3>{t('setup.time')}</h3>
        <div className="seg">
          {[60, 90, 120].map((n) => (
            <button key={n} className={settings.discussSec === n ? 'on' : ''} onClick={() => set('discussSec', n)}>
              {t('setup.sec', { n })}
            </button>
          ))}
        </div>
      </section>

      <section className="panel">
        <label className="toggle-row">
          <div>
            <b>{t('setup.chaos')}</b>
            <small>{t('setup.chaosHint')}</small>
          </div>
          <input type="checkbox" checked={settings.chaos} onChange={(e) => set('chaos', e.target.checked)} />
        </label>
        <label className="toggle-row">
          <div>
            <b>{t('setup.voice')}</b>
            <small>{t('setup.voiceHint')}</small>
          </div>
          <input type="checkbox" checked={settings.voice} onChange={(e) => set('voice', e.target.checked)} />
        </label>
      </section>

      {(noCat || tooFew) && (
        <p className="warn">{noCat ? t('setup.needCat') : t('setup.min', { n: MIN_PLAYERS })}</p>
      )}

      <div className="stack sticky-actions">
        <button
          id="btn-start-game"
          className="btn btn-primary btn-xl"
          disabled={noCat || tooFew}
          onClick={() => {
            sound.flip();
            onStart();
          }}
        >
          {t('setup.start')}
        </button>
        <button className="btn btn-ghost" onClick={() => { sound.tap(); onBack(); }}>{t('setup.back')}</button>
      </div>
    </div>
  );
}

