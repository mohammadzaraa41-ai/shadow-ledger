import { useEffect, useRef } from 'react';
import { Activity, AlertTriangle, Flame, ShieldAlert, Skull } from 'lucide-react';
import { sensoryAudio } from '../game/audioEngine';
import type { ClimaxState } from '../game/types';
import { useLang } from '../i18n';

export function ClimaxModal({
  climax,
  onDismiss,
}: {
  climax: ClimaxState;
  onDismiss?: () => void;
}) {
  const { lang } = useLang();
  const isRtl = lang === 'ar';
  const audioStartedRef = useRef(false);

  // Dynamic heartbeat acceleration as seconds wind down
  useEffect(() => {
    const sec = climax.secondsLeft;
    // Calculate BPM from 75 to 160
    const calculatedBpm = Math.min(160, Math.max(75, Math.round(160 - (sec / 40) * 85)));

    sensoryAudio.stopHeartbeat();
    sensoryAudio.startHeartbeat(calculatedBpm);

    if (!audioStartedRef.current) {
      audioStartedRef.current = true;
      sensoryAudio.playEmergencyBroadcastSting();
    }

    return () => {
      sensoryAudio.stopHeartbeat();
    };
  }, [climax.secondsLeft]);

  const sec = climax.secondsLeft;
  const isKillerWinImminent = climax.initiatedBy === 'KILLER';
  const progressPercent = Math.max(0, Math.min(100, (sec / 40) * 100));

  return (
    <div className="climax-modal-overlay" role="dialog" aria-modal="true">
      <div className="climax-pulse-vignette" />

      <div className="climax-card">
        {/* Header Badge */}
        <div className="climax-header-badge">
          {isKillerWinImminent ? (
            <>
              <Skull className="climax-icon-glow text-red-500" size={28} />
              <span className="climax-badge-text">
                {isRtl ? 'حُكم الموت الحتمي — قاعدة الـ 40 ثانية' : 'FATAL VERDICT — 40-SECOND RULE'}
              </span>
            </>
          ) : (
            <>
              <ShieldAlert className="climax-icon-glow text-amber-500" size={28} />
              <span className="climax-badge-text">
                {isRtl ? 'اقتحام الـ SWAT الحاسم — تطويق كامل' : 'TACTICAL SWAT BREACH — ENCIRCLED'}
              </span>
            </>
          )}
        </div>

        {/* Big Countdown Display */}
        <div className="climax-timer-container">
          <div className="climax-timer-ring">
            <svg viewBox="0 0 100 100" className="climax-svg-ring">
              <circle
                cx="50"
                cy="50"
                r="44"
                className="ring-bg"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                className="ring-progress"
                style={{
                  strokeDashoffset: `${276.46 * (1 - progressPercent / 100)}`,
                }}
              />
            </svg>
            <div className="climax-digital-time">
              <span className="seconds-digits">
                {sec < 10 ? `0${sec}` : sec}
              </span>
              <span className="seconds-unit">{isRtl ? 'ثانية' : 'SEC'}</span>
            </div>
          </div>
        </div>

        {/* Heartbeat Telemetry */}
        <div className="climax-bpm-bar">
          <Activity size={18} className="bpm-pulse-icon" />
          <span className="bpm-text">
            {isRtl
              ? `نبضات القلب المتسارعة: ${Math.round(160 - (sec / 40) * 85)} نبضة/دقيقة`
              : `Heart Rate Telemetry: ${Math.round(160 - (sec / 40) * 85)} BPM`}
          </span>
        </div>

        {/* Dramatic Narrative Context */}
        <div className="climax-narrative-box">
          <h2 className="climax-title">
            {isKillerWinImminent
              ? isRtl
                ? 'تم تقييد الاسم في دفتر الظل'
                : 'NAME INSCRIBED IN THE SHADOW LEDGER'
              : isRtl
                ? 'فخ أمني محكم يضيق الخناق'
                : 'CIPHER HAS PINPOINTED YOUR SANCTUARY'}
          </h2>
          <p className="climax-description">
            {climax.reason[lang]}
          </p>
          <div className="climax-subquote">
            {isKillerWinImminent
              ? isRtl
                ? '«الإنسان الذي يُكتب اسمه في هذا الدفتر سيموت... بسكتة قلبية بعد 40 ثانية بالضبط.»'
                : '"The human whose name is written in this note shall die... of a heart attack in exactly 40 seconds."'
              : isRtl
                ? '«لقد حددنا هويتك وموقعك بدقة لا تقبل الشك، استسلم فوراً وقوات الـ SWAT ستضمن سلامتك.»'
                : '"Your habits, schedule and location have given you away. Surrender peacefully or face immediate tactical breach."'}
          </div>
        </div>

        {/* Sensory Warning */}
        <div className="climax-footer-status">
          <Flame size={16} className="text-red-400" />
          <span>
            {isRtl
              ? 'العد التنازلي جاري... النتيجة ستُحسم تلقائياً عند الصفر!'
              : 'Tension peaking... Outcome will resolve at zero!'}
          </span>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="climax-cancel-btn"
              title={isRtl ? 'إغلاق المعاينة' : 'Dismiss Preview'}
            >
              <AlertTriangle size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
