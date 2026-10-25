import { useState } from 'react';
import { useLang } from '../i18n';

const STEPS = [1, 2, 3, 4, 5, 6, 7];

/** Illustrated step-by-step "how to play" overlay. */
export function Tutorial({ onClose }: { onClose: () => void }) {
  const { t, lang } = useLang();
  const [i, setI] = useState(0);
  const n = STEPS[i];
  const last = i === STEPS.length - 1;
  const prevLabel = lang === 'ar' ? '›' : '‹';
  const nextLabel = lang === 'ar' ? '‹' : '›';

  return (
    <div className="overlay tut-overlay" role="dialog" aria-label={t('tut.title')}>
      <div className="tut">
        <div className="tut-top">
          <span className="tut-kicker">{t('tut.title')} · {i + 1}/{STEPS.length}</span>
          <button className="tut-x" id="btn-tut-close" onClick={onClose}>{t('tut.skip')} ✕</button>
        </div>

        <div className="tut-art" aria-hidden>
          {n === 1 && <span className="art-big">☠</span>}
          {n === 2 && (
            <>
              <span className="tok tok-name on-demo">{lang === 'ar' ? 'تاكيدا سيجي' : 'Takeda Seiji'}</span>
              <span className="art-photo" />
            </>
          )}
          {n === 3 && <span className="art-write">{lang === 'ar' ? 'تاكيدا سيجي' : 'Takeda Seiji'}</span>}
          {n === 4 && <span className="art-risk"><b>+15%</b><b>0%</b><b>−3%</b></span>}
          {n === 5 && <span className="art-eye">👁</span>}
          {n === 6 && <span className="art-trap">{t('unverified')}</span>}
          {n === 7 && <span className="art-big">24</span>}
        </div>

        <h2>{t(`tut.${n}.t`)}</h2>
        <p>{t(`tut.${n}.b`)}</p>

        <div className="dots">{STEPS.map((s, k) => <i key={s} className={k === i ? 'on' : ''} />)}</div>
        <div className="tut-nav">
          <button className="pen-btn" disabled={i === 0} onClick={() => setI(i - 1)}>{prevLabel} {t('tut.prev')}</button>
          {last
            ? <button id="btn-tut-done" className="seal small" onClick={onClose}>{t('tut.done')}</button>
            : <button id="btn-tut-next" className="pen-btn red" onClick={() => setI(i + 1)}>{t('tut.next')} {nextLabel}</button>}
        </div>
      </div>
    </div>
  );
}
