import { useState } from 'react';
import { REGION_NAME } from '../../game/data';
import type { GameState } from '../../game/store';
import type { DeathRecord, Region } from '../../game/types';
import { useLang } from '../../i18n';

const MAP_POS: Record<Region, { x: number; y: number }> = {
  NORTH: { x: 50, y: 16 },
  WEST: { x: 17, y: 50 },
  EAST: { x: 83, y: 50 },
  SOUTH: { x: 50, y: 84 },
  CENTRAL: { x: 50, y: 50 },
};

export function TerminalDeductions({ state }: { state: GameState }) {
  const { t, tx, lang } = useLang();
  const d = state.deduction;
  const [sel, setSel] = useState<Region | null>(null);
  const killsIn = (r: Region) => state.records.filter((x: DeathRecord) => x.region === r && !x.decoy).length;

  return (
    <>
      <div className="chat">
        <div className="chat-head">
          <span className="avatar" />
          <div>
            <b>{lang === 'ar' ? 'المحقق L' : 'Detective L'}</b>
            <small>{t('l.typing')}</small>
          </div>
        </div>
        {[...d.notes].reverse().map((n, i) => (
          <p key={i} className="bubble">
            {tx(n)}
          </p>
        ))}
      </div>

      <div className="case">
        <h3>{t('case.title')}</h3>
        <p className="profile">
          {d.profile.window
            ? t('case.profile', { occ: d.profile.label, from: d.profile.window.from % 24, to: d.profile.window.to % 24 })
            : t('case.none')}
        </p>
        <div className="meter-small">
          <i style={{ width: `${d.profile.confidence * 100}%` }} />
        </div>
        <small>{t('case.conf', { n: Math.round(d.profile.confidence * 100) })}</small>
      </div>

      <div className="case">
        <h3>{t('map.title')}</h3>
        <div className="map">
          <svg viewBox="0 0 100 100" className="map-lines" preserveAspectRatio="none">
            {[20, 40, 60, 80].map((v) => (
              <g key={v}>
                <line x1={v} y1="0" x2={v} y2="100" />
                <line x1="0" y1={v} x2="100" y2={v} />
              </g>
            ))}
          </svg>
          {(Object.keys(MAP_POS) as Region[]).map((r) => {
            const b = d.geoBelief[r];
            return (
              <button
                key={r}
                className={`node ${sel === r ? 'sel' : ''}`}
                onClick={() => setSel(r)}
                style={{ left: `${MAP_POS[r].x}%`, top: `${MAP_POS[r].y}%` }}
              >
                <i className="heat" style={{ width: 26 + b * 100, height: 26 + b * 100, opacity: 0.3 + b * 0.7 }} />
                <span>{REGION_NAME[r][lang]}</span>
              </button>
            );
          })}
        </div>
        <p className="map-info">
          {sel ? t('map.info', { r: REGION_NAME[sel], p: Math.round(d.geoBelief[sel] * 100), k: killsIn(sel) }) : t('map.hint')}
        </p>
        {d.narrowedRegion && <p className="danger">{t('map.narrowed', { r: REGION_NAME[d.narrowedRegion] })}</p>}
      </div>

      <div className="case">
        <h3>{t('hist.title')}</h3>
        <div className="hist">
          {d.hourHistogram.map((v: number, h: number) => (
            <div key={h} className="bar" title={`${h}:00`}>
              <i style={{ height: `${(v / Math.max(1, ...d.hourHistogram)) * 100}%` }} />
              <em>{h}</em>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
