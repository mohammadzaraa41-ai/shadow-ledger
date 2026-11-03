import { useState } from 'react';
import { PUNISHMENTS } from '../game/engine';
import { sound } from '../game/sound';
import { useLang } from '../i18n';

interface Props {
  loserName: string;
  onClose: () => void;
}

export function PunishmentWheel({ loserName, onClose }: Props) {
  const { t, lang } = useLang();
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setSelectedIdx(null);
    sound.drumroll();

    const nextIdx = Math.floor(Math.random() * PUNISHMENTS.length);
    const extraTurns = 1440 + Math.floor(Math.random() * 720);
    const nextRot = rotation + extraTurns + nextIdx * (360 / PUNISHMENTS.length);
    setRotation(nextRot);

    setTimeout(() => {
      sound.tick();
    }, 600);
    setTimeout(() => {
      sound.tick();
    }, 1100);
    setTimeout(() => {
      setSpinning(false);
      setSelectedIdx(nextIdx);
      sound.chaos();
    }, 1800);
  };

  return (
    <div className="overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="sheet center-text" onClick={(e) => e.stopPropagation()}>
        <h2 className="sheet-title">{t('wheel.title')}</h2>
        <p className="kicker">{t('wheel.loser', { name: loserName })}</p>

        <div className="wheel-stage">
          <div className="wheel-pointer">▼</div>
          <div
            className="wheel-disc"
            style={{ transform: `rotate(${rotation}deg)` }}
            onClick={spin}
          >
            <span className="wheel-center-icon">🎡</span>
          </div>
        </div>

        {selectedIdx !== null && (
          <div className="dare-result-box">
            <p className="dare-text">{PUNISHMENTS[selectedIdx][lang]}</p>
          </div>
        )}

        <div className="stack">
          <button className="btn btn-accent btn-xl" disabled={spinning} onClick={spin}>
            {spinning ? t('wheel.spinning') : selectedIdx === null ? t('wheel.spin') : t('wheel.again')}
          </button>
          <button
            className="btn btn-ghost"
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
