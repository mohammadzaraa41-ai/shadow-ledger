import { useState } from 'react';
import { Database, Eye, ShieldAlert, Skull, Terminal, UserX } from 'lucide-react';
import { sensoryAudio } from '../../game/audioEngine';
import { getTargetIntel, type Action, type GameState } from '../../game/store';
import { useLang } from '../../i18n';

export function TerminalCounterIntel({
  state,
  dispatch,
  onOpenLedgerWithDetective,
}: {
  state: GameState;
  dispatch: (a: Action) => void;
  onOpenLedgerWithDetective?: () => void;
}) {
  const { lang } = useLang();
  const isRtl = lang === 'ar';
  const detTarget = state.targets.find((t) => t.id === 'target-detective-l');
  const intel = detTarget ? getTargetIntel(state.player, detTarget.id) : { percent: 0, hasSurname: false, hasFace: false, hasFirstName: false };
  const [logMessage, setLogMessage] = useState<string | null>(null);

  const handleHackDB = () => {
    sensoryAudio.playKeystroke();
    dispatch({ type: 'HACK_POLICE_DATABASE' });
    setLogMessage(
      isRtl
        ? '🔓 تم اختراق خادم الإنتربول المشفر! تم استخراج اسم عائلة المحقق: [ماستودا / Matsuda] (+15% شبهة)'
        : '🔓 Interpol database breached! Detective surname decrypted: [Matsuda] (+15% suspicion)'
    );
  };

  const handleAmbushTail = () => {
    sensoryAudio.playRadioStatic(0.8);
    dispatch({ type: 'AMBUSH_FBI_TAIL' });
    setLogMessage(
      isRtl
        ? '📸 تم استدراج عميل المراقبة ومصادرة كاميرته السرية! تم كشف ملامح وجه المحقق واسمه الأول (+10% شبهة)'
        : '📸 FBI tail ambushed! Unmasked face photograph and first name recovered (+10% suspicion)'
    );
  };

  return (
    <div className="terminal-counter-intel" dir={isRtl ? 'rtl' : 'ltr'}>
      <header className="intel-header">
        <div className="intel-title-group">
          <Skull className="text-red animate-pulse" size={18} />
          <div>
            <h3>{isRtl ? 'مشروع صيد المحقق سايفر (L)' : 'Project Hunt: Detective Cipher (L)'}</h3>
            <span className="intel-subtitle">
              {isRtl
                ? 'الهدف الأسمى لقاضي الظل — كشف الاسم الحقيقي والوجه لإنهاء التحقيق'
                : 'The Ultimate Target — uncover the true name & face to end the hunt'}
            </span>
          </div>
        </div>
        <div className="intel-progress-badge">
          <span>{isRtl ? 'اكتمال الملف:' : 'Dossier Intel:'}</span>
          <b className={intel.percent >= 100 ? 'text-green' : 'text-red'}>{intel.percent}%</b>
        </div>
      </header>

      {/* Target Status Card */}
      <div className="detective-dossier-card">
        <div className="dossier-face-preview">
          {intel.hasFace ? (
            <div className="unmasked-face">
              <span className="face-tag">CONFIRMED PHOTO</span>
              <div className="face-avatar-cipher">Σ</div>
            </div>
          ) : (
            <div className="masked-face">
              <UserX size={36} className="text-dim" />
              <span>{isRtl ? 'الوجه مجهول ومحمي' : 'Face Encrypted'}</span>
            </div>
          )}
        </div>

        <div className="dossier-info-col">
          <div className="dossier-field">
            <label>{isRtl ? 'الاسم الرمزي:' : 'Codename:'}</label>
            <span className="text-cyan font-bold">{isRtl ? 'المحقق سايفر (L)' : 'Detective Cipher (L)'}</span>
          </div>

          <div className="dossier-field">
            <label>{isRtl ? 'الاسم الحقيقي الكامل:' : 'Real Legal Name:'}</label>
            <span className="name-reveal">
              {intel.percent >= 100 ? (
                <b className="text-red">{isRtl ? 'ريوجي ماستودا' : 'Ryoji Matsuda'}</b>
              ) : intel.hasSurname ? (
                <span className="text-yellow">???? {isRtl ? 'ماستودا' : 'Matsuda'}</span>
              ) : (
                <span className="text-dim">??????? ???????</span>
              )}
            </span>
          </div>

          <div className="dossier-field">
            <label>{isRtl ? 'مستوى الحصانة الأمنية:' : 'Security Clearance:'}</label>
            <span className="text-red">{isRtl ? 'الدرجة القصوى (الإنتربول)' : 'Level-Red (Interpol VIP)'}</span>
          </div>
        </div>
      </div>

      {logMessage && (
        <div className="terminal-intel-log">
          <Terminal size={14} />
          <span>{logMessage}</span>
        </div>
      )}

      {/* Cyber Actions Grid */}
      <div className="intel-actions-deck">
        <div className="action-card">
          <div className="action-header">
            <Database size={16} className="text-yellow" />
            <b>{isRtl ? 'اختراق خوادم الشرطة الدولية' : 'Interpol DB Cyber-Breach'}</b>
          </div>
          <p>
            {isRtl
              ? 'شن هجوم إلكتروني لاختراق سجلات التحريات وسحب اسم عائلة المحقق.'
              : 'Launch an encrypted brute-force attack to extract the Detective’s surname.'}
          </p>
          <button
            type="button"
            className="btn-intel-action"
            onClick={handleHackDB}
            disabled={Boolean(intel.hasSurname)}
          >
            {intel.hasSurname
              ? (isRtl ? '✓ تم فك اسم العائلة' : '✓ Surname Decrypted')
              : (isRtl ? 'تنفيذ الاختراق (+15% شبهة)' : 'Execute Breach (+15% Susp)')}
          </button>
        </div>

        <div className="action-card">
          <div className="action-header">
            <Eye size={16} className="text-purple" />
            <b>{isRtl ? 'نصب كمين للمخبر المتعقب' : 'Ambush FBI Covert Tail'}</b>
          </div>
          <p>
            {isRtl
              ? 'استدراج عميل الاستخبارات الذي يراقبك وسحب كاميرا التجسس لكشف وجه L.'
              : 'Counter-ambush the undercover agent tracking you to seize the unmasked face photograph.'}
          </p>
          <button
            type="button"
            className="btn-intel-action"
            onClick={handleAmbushTail}
            disabled={Boolean(intel.hasFace)}
          >
            {intel.hasFace
              ? (isRtl ? '✓ تم كشف ملامح الوجه' : '✓ Face Photograph Acquired')
              : (isRtl ? 'نصب الكمين (+10% شبهة)' : 'Ambush Tail (+10% Susp)')}
          </button>
        </div>
      </div>

      {/* Write In Ledger Execution Button */}
      {intel.percent >= 100 && (
        <div className="hunt-ready-banner">
          <ShieldAlert size={20} className="text-red animate-bounce" />
          <div className="banner-text">
            <b>{isRtl ? 'ملف المحقق L مكتمل 100%!' : 'Detective L Dossier 100% Complete!'}</b>
            <span>{isRtl ? 'يمكنك الآن فتح الدفتر وكتابة اسمه لبدء الإعدام الحتمي!' : 'You can now inscribe his true name in the Ledger for checkmate!'}</span>
          </div>
          {onOpenLedgerWithDetective && (
            <button type="button" className="btn-strike-detective" onClick={onOpenLedgerWithDetective}>
              {isRtl ? 'فتح الدفتر لإعدام المحقق L ✍️' : 'Inscribe Detective L ✍️'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
