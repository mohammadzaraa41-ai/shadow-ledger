import { useLang } from '../i18n';
import { LangToggle } from './shared';

interface Props {
  onStart: () => void;
  onHowTo?: () => void;
  onMultiplayer?: () => void;
  ended?: { title: string; desc: string } | null;
  onRestart?: () => void;
}

/** Title / ending screen built around the key art. */
export function Splash({ onStart, onHowTo, onMultiplayer, ended, onRestart }: Props) {
  const { t, lang } = useLang();
  return (
    <div className={`splash ${ended ? 'ended' : ''}`}>
      <div className="splash-art" />
      <div className="splash-shade" />
      {!ended && <div className="splash-lang"><LangToggle /></div>}
      <div className="splash-content">
        <small className="latin">— PSYCHOLOGICAL DEDUCTION —</small>
        <h1 className="title-jag">{ended ? ended.title : t('splash.title')}</h1>
        <p className="splash-sub">{ended ? ended.desc : t('splash.sub')}</p>
        {ended ? (
          <button id="btn-restart" className="stamp" onClick={onRestart}>{t('splash.restart')}</button>
        ) : (
          <>
            <ul className="rules">
              <li>{t('splash.r1')}</li>
              <li>{t('splash.r2')}</li>
              <li>{t('splash.r3')}</li>
            </ul>
            <div className="splash-buttons-col">
              <button id="btn-start" className="stamp" onClick={onStart}>{t('splash.start')}</button>
              {onMultiplayer && (
                <button
                  id="btn-multiplayer-start"
                  className="stamp stamp-duel"
                  onClick={onMultiplayer}
                >
                  👥 {lang === 'ar' ? 'تحدي قاضي الظل ضد المحقق (1v1 أونلاين)' : 'Shadow vs Detective (1v1 Online Duel)'}
                </button>
              )}
              <button id="btn-howto" className="link-btn" onClick={onHowTo}>{t('splash.howto')}</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
