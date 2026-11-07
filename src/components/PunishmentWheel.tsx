import { useRef, useState } from 'react';
import { filterDares, pick } from '../game/engine';
import { sound } from '../game/sound';
import type { Dare, DareKind, Player } from '../game/types';
import { useLang } from '../i18n';

interface Props {
  losers: Player[];
  initialIdx?: number;
  onAssignDare?: (playerId: number, dareText: string) => void;
  onClose: () => void;
}

export function PunishmentWheel({ losers, initialIdx = 0, onAssignDare, onClose }: Props) {
  const { t, lang } = useLang();
  const [idx, setIdx] = useState(initialIdx);
  const [kind, setKind] = useState<DareKind | 'all'>('all');
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [currentDare, setCurrentDare] = useState<Dare | null>(null);
  const usedDares = useRef<Set<string>>(new Set());

  const currentLoser = losers[idx] ?? losers[0];
  const nextLoser = idx + 1 < losers.length ? losers[idx + 1] : null;

  const spin = () => {
    if (spinning || !currentLoser) return;
    setSpinning(true);
    setCurrentDare(null);
    sound.drumroll();

    const pool = filterDares(kind);
    const freshPool = pool.filter((d) => !usedDares.current.has(d.ar));
    const chosen = pick(freshPool.length > 0 ? freshPool : pool);
    usedDares.current.add(chosen.ar);

    const extraTurns = 1440 + Math.floor(Math.random() * 720);
    setRotation((r) => r + extraTurns);

    setTimeout(() => sound.tick(), 600);
    setTimeout(() => sound.tick(), 1100);
    setTimeout(() => {
      setSpinning(false);
      setCurrentDare(chosen);
      onAssignDare?.(currentLoser.id, chosen[lang]);
      sound.chaos();
    }, 1800);
  };

  const advanceToNextLoser = () => {
    sound.tap();
    if (nextLoser) {
      setIdx(idx + 1);
      setCurrentDare(null);
    } else {
      onClose();
    }
  };

  return (
    <div className="overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="sheet center-text" onClick={(e) => e.stopPropagation()}>
        <h2 className="sheet-title">{t('wheel.title')}</h2>

        <div className="loser-banner">
          <span className="avatar big">{currentLoser?.avatar ?? '😈'}</span>
          <div>
            <b>{t('wheel.step', { cur: idx + 1, total: losers.length, name: currentLoser?.name ?? '' })}</b>
          </div>
        </div>

        <div className="chips center-chips">
          {(['all', 'funny', 'acting', 'spicy'] as const).map((k) => (
            <button
              key={k}
              type="button"
              className={`chip ${kind === k ? 'on' : ''}`}
              disabled={spinning}
              onClick={() => {
                sound.tap();
                setKind(k);
              }}
            >
              {t(`wheel.kind.${k}`)}
            </button>
          ))}
        </div>

        <div className="wheel-stage">
          <div className="wheel-pointer">▼</div>
          <div className="wheel-disc" style={{ transform: `rotate(${rotation}deg)` }} onClick={spin}>
            <span className="wheel-center-icon">🎡</span>
          </div>
        </div>

        {currentDare && (
          <div className="dare-result-box">
            <p className="dare-text">{currentDare[lang]}</p>
          </div>
        )}

        <div className="stack">
          <button className="btn btn-accent btn-xl" disabled={spinning} onClick={spin}>
            {spinning
              ? t('wheel.spinning')
              : currentDare === null
                ? t('wheel.spin', { name: currentLoser?.name ?? '' })
                : t('wheel.again')}
          </button>

          {currentDare !== null && nextLoser && (
            <button type="button" className="btn btn-primary btn-xl" onClick={advanceToNextLoser}>
              {t('wheel.nextLoser', { next: nextLoser.name })}
            </button>
          )}

          <button
            type="button"
            className={currentDare !== null && !nextLoser ? 'btn btn-primary btn-xl' : 'btn btn-ghost'}
            onClick={() => {
              sound.tap();
              onClose();
            }}
          >
            {t('wheel.done')}
          </button>
        </div>
      </div>
    </div>
  );
}
