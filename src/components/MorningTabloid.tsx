import { useEffect } from 'react';
import { AlertCircle, Camera, CheckCircle2, ShieldAlert, X } from 'lucide-react';
import { sensoryAudio } from '../game/audioEngine';
import type { DayReport } from '../game/store';
import type { TargetProfile } from '../game/types';
import { useLang } from '../i18n';
import { FaceCard } from './shared';

export function MorningTabloid({
  report,
  targets,
  onDismiss,
}: {
  report: DayReport;
  targets: TargetProfile[];
  onDismiss: () => void;
}) {
  const { t, tx, lang } = useLang();
  const isRtl = lang === 'ar';

  useEffect(() => {
    sensoryAudio.playCameraFlash();
  }, []);

  const successfulKills = report.lines.filter((l) => l.ok);

  return (
    <div className="tabloid-overlay" onClick={onDismiss} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Camera shutter flash effect */}
      <div className="camera-flash-fx" />

      <div className="tabloid-paper" onClick={(e) => e.stopPropagation()}>
        {/* Newspaper Masthead */}
        <header className="tabloid-masthead">
          <div className="masthead-top">
            <span>{isRtl ? 'العدد التذكاري' : 'SPECIAL EDITION'} #{report.day}</span>
            <span>{isRtl ? 'سعر النسخة: 50 يناً' : 'PRICE: 50 YEN'}</span>
            <span>{isRtl ? 'العاصمة — طبعة الصباح الأولى' : 'METRO FIRST MORNING EDITION'}</span>
          </div>
          <h1 className="masthead-title">
            {isRtl ? 'صحيفة العاصمة اليومية' : 'THE METRO CHRONICLE'}
          </h1>
          <div className="masthead-divider" />
        </header>

        {/* Big Bold Tabloid Headline */}
        <section className="tabloid-breaking-banner">
          <div className="breaking-stamp">
            <Camera size={14} />
            <span>{isRtl ? 'مانشيت عاجل' : 'BREAKING NEWS'}</span>
          </div>
          <h2 className="breaking-headline">
            {successfulKills.length > 0
              ? isRtl
                ? `العثور على ${successfulKills.map((k) => k.name.ar).join(' و ')} جثة هامدة!`
                : `${successfulKills.map((k) => k.name.en).join(' & ')} Found Deceased Under Mysterious Circumstances!`
              : isRtl
              ? 'هدوء حذر في شوارع العاصمة.. والمحقق L يستنفر فرق التحقيق'
              : 'Cautious Quiet Across the City.. Detective L Mobilizes Task Force'}
          </h2>
          <p className="breaking-subhead">
            {successfulKills.length > 0
              ? isRtl
                ? 'تقارير الطب الشرعي تؤكد استحالة وجود سبب عضوي طبيعي، والشارع يتداول شائعات حول "قاضٍ خفي" يُنزل العقاب!'
                : 'Coroners unable to identify natural causes; underground rumors spread of an unseen judge delivering retribution!'
              : isRtl
              ? 'أجهزة الأمن لم ترصد أي وفيات غير طبيعية الليلة الماضية، مع استمرار مراقبة السجلات الحضرية.'
              : 'Security services report zero unusual cardiac incidents overnight as surveillance continues.'}
          </p>
        </section>

        {/* Tabloid Front Page Articles & Photos */}
        <div className="tabloid-columns">
          {/* Main Story Column */}
          <div className="tabloid-main-col">
            <h3 className="section-title">{isRtl ? 'ملفات الوفيات والقرارات' : 'Official Case Records'}</h3>

            {report.lines.length === 0 && (
              <div className="tabloid-no-kills">
                <p>{isRtl ? 'لم تُسجّل أي أحكام اليوم.. مر اليوم دون إثارة شبهات إضافية.' : 'No verdicts carried out today. Quiet day.'}</p>
              </div>
            )}

            {report.lines.map((l, i) => {
              const matchedTarget = targets.find((t) => t.name.ar === l.name.ar || t.name.en === l.name.en);
              return (
                <div key={i} className={`tabloid-victim-card ${l.ok ? 'verdict-success' : 'verdict-failed'}`}>
                  {matchedTarget && (
                    <div className="victim-photo-wrapper">
                      <FaceCard faceId={matchedTarget.faceId} size={70} active />
                      {l.ok && (
                        <div className="stamp-deceased">
                          <span>{isRtl ? 'تأكدت الوفاة' : 'DECEASED'}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="victim-details">
                    <h4 className="victim-name">{isRtl ? l.name.ar : l.name.en}</h4>
                    <p className="victim-outcome">
                      {l.ok ? (
                        <span className="outcome-ok">
                          <CheckCircle2 size={13} /> {t('rep.ok', { name: l.name })}
                        </span>
                      ) : (
                        <span className="outcome-fail">
                          <AlertCircle size={13} /> {t('rep.fail', { name: l.name, reason: tx(l.reason) })}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detective Column & Suspicion Analysis */}
          <div className="tabloid-side-col">
            <div className="detective-memo-box">
              <div className="memo-header">
                <span className="detective-crest">L SPECIAL TASK FORCE BRIEFING</span>
                <h4>{isRtl ? 'مذكرة المحقق L' : "Detective L's Memo"}</h4>
              </div>

              {report.notes.map((n, i) => (
                <p key={i} className="detective-memo-quote">
                  «{tx(n)}»
                </p>
              ))}

              <div className="suspicion-ledger-summary">
                <span className="summary-title">{isRtl ? 'مؤشر شبهة المحقق:' : 'Suspicion Shift:'}</span>
                <b className={`summary-delta ${report.delta > 0 ? 'bad' : 'good'}`}>
                  {report.delta > 0 ? `+${report.delta}%` : `${report.delta}%`}
                </b>
              </div>

              <div className="suspicion-breakdown-list">
                {report.breakdown.map((b, i) => (
                  <div key={i} className="breakdown-item">
                    <span>{tx(b.label)}</span>
                    <strong className={b.value > 0 ? 'bad' : 'good'}>
                      {b.value > 0 ? `+${b.value}%` : `${b.value}%`}
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabloid Footer & Proceed Button */}
        <footer className="tabloid-footer">
          <button
            type="button"
            id="btn-tabloid-dismiss"
            className="btn-tabloid-proceed"
            onClick={() => {
              sensoryAudio.playKeystroke();
              onDismiss();
            }}
          >
            <span>{isRtl ? '📰 طي الصحيفة والانتقال لليوم التالي' : '📰 Fold Newspaper & Proceed to Next Day'}</span>
          </button>
        </footer>
      </div>
    </div>
  );
}
