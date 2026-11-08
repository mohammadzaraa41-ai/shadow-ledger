import { useEffect, useRef, useState } from 'react';
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

const CUSTOM_DARES_KEY = 'customDares:v1';

function loadCustomDares(): string[] {
  try {
    const raw = localStorage.getItem(CUSTOM_DARES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function PunishmentWheel({ losers, initialIdx = 0, onAssignDare, onClose }: Props) {
  const { t, lang } = useLang();
  const [idx, setIdx] = useState(initialIdx);
  const [kind, setKind] = useState<DareKind | 'all' | 'custom'>('all');
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [currentDare, setCurrentDare] = useState<Dare | null>(null);
  const [customDares, setCustomDares] = useState<string[]>(loadCustomDares);
  const [customInput, setCustomInput] = useState('');
  const [sharedOk, setSharedOk] = useState(false);
  const usedDares = useRef<Set<string>>(new Set());
  const timeoutsRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      // Clear all pending spin timeouts on modal unmount
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  const currentLoser = losers[idx] ?? losers[0];
  const nextLoser = idx + 1 < losers.length ? losers[idx + 1] : null;

  const saveCustomDares = (next: string[]) => {
    setCustomDares(next);
    try {
      localStorage.setItem(CUSTOM_DARES_KEY, JSON.stringify(next));
    } catch {
      // ignore storage quota errors
    }
  };

  const addCustomDare = () => {
    const trimmed = customInput.trim();
    if (!trimmed) return;
    sound.tap();
    const next = [...customDares, trimmed];
    saveCustomDares(next);
    setCustomInput('');
    setKind('custom');
  };

  const removeCustomDare = (removeIdx: number) => {
    sound.tap();
    const next = customDares.filter((_, i) => i !== removeIdx);
    saveCustomDares(next);
    if (next.length === 0 && kind === 'custom') setKind('all');
  };

  const spin = () => {
    if (spinning || !currentLoser) return;
    setSpinning(true);
    setCurrentDare(null);
    setSharedOk(false);
    sound.drumroll();

    const customObjs: Dare[] = customDares.map((text) => ({
      kind: 'spicy',
      ar: text,
      en: text,
    }));

    let pool: Dare[];
    if (kind === 'custom' && customObjs.length > 0) {
      pool = customObjs;
    } else if (kind === 'all') {
      pool = [...customObjs, ...filterDares('all')];
    } else {
      pool = filterDares(kind === 'custom' ? 'all' : kind);
    }

    const freshPool = pool.filter((d) => !usedDares.current.has(d.ar));
    const chosen = pick(freshPool.length > 0 ? freshPool : pool);
    usedDares.current.add(chosen.ar);

    const extraTurns = 1440 + Math.floor(Math.random() * 720);
    setRotation((r) => r + extraTurns);

    timeoutsRef.current.push(window.setTimeout(() => sound.tick(), 600));
    timeoutsRef.current.push(window.setTimeout(() => sound.tick(), 1100));
    timeoutsRef.current.push(
      window.setTimeout(() => {
        setSpinning(false);
        setCurrentDare(chosen);
        onAssignDare?.(currentLoser.id, chosen[lang]);
        sound.chaos();
      }, 1800),
    );
  };

  const shareDare = async () => {
    if (!currentDare || !currentLoser) return;
    sound.tap();
    const text = t('wheel.shareTemplate', {
      name: currentLoser.name,
      dare: currentDare[lang],
    });
    try {
      if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
        await navigator.share({ title: t('app.name'), text });
        setSharedOk(true);
        return;
      }
    } catch {
      // fallback to clipboard
    }
    try {
      await navigator.clipboard?.writeText(text);
      setSharedOk(true);
      setTimeout(() => setSharedOk(false), 2500);
    } catch {
      setSharedOk(true);
    }
  };

  const advanceToNextLoser = () => {
    sound.tap();
    setSharedOk(false);
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
          {(['all', 'funny', 'acting', 'spicy', 'custom'] as const).map((k) => (
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
              {k === 'custom' && customDares.length > 0 ? ` (${customDares.length})` : ''}
            </button>
          ))}
        </div>

        {/* Custom Punishments Box */}
        <div className="custom-words-box">
          <div className="row">
            <input
              className="input grow"
              value={customInput}
              maxLength={80}
              placeholder={t('wheel.customPlace')}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') addCustomDare();
              }}
            />
            <button type="button" className="btn btn-ghost btn-sm" onClick={addCustomDare}>
              + {t('setup.customAdd')}
            </button>
          </div>
          {customDares.length > 0 && (
            <div className="chips center-chips">
              {customDares.map((d, i) => (
                <span key={i} className="custom-tag">
                  {d}
                  <button type="button" onClick={() => removeCustomDare(i)}>
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
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
            <button type="button" className="btn btn-ghost btn-sm share-dare-btn" onClick={shareDare}>
              {sharedOk ? t('wheel.sharedOk') : t('wheel.shareBtn')}
            </button>
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
