import { Clock } from 'lucide-react';
import { sensoryAudio } from '../../game/audioEngine';
import { FACTION_NAME, METHODS } from '../../game/data';
import type { DeathMethod, Faction, L10n, TimeWindow } from '../../game/types';
import { useLang } from '../../i18n';

export interface ScheduledKillItem {
  id: string;
  name: string;
  secondsLeft: number;
}

export function DeathMethodSelector({
  method,
  onSelectMethod,
  routine,
  hour,
  onSelectHour,
  faction,
  onSelectFaction,
  delayMode,
  onSelectDelayMode,
  scheduledKills,
}: {
  method: DeathMethod;
  onSelectMethod: (m: DeathMethod) => void;
  routine?: { place: L10n; window: TimeWindow };
  hour?: number;
  onSelectHour: (h: number) => void;
  faction?: Faction;
  onSelectFaction: (f: Faction) => void;
  delayMode: 'INSTANT' | 'DELAY_60S';
  onSelectDelayMode: (m: 'INSTANT' | 'DELAY_60S') => void;
  scheduledKills: ScheduledKillItem[];
}) {
  const { t, lang } = useLang();
  const hours = routine
    ? Array.from({ length: routine.window.to - routine.window.from }, (_, i) => routine.window.from + i)
    : [];

  return (
    <>
      <span className="ruled">{t('led.cause')}</span>
      <div className="methods">
        {METHODS.map((m) => (
          <button
            key={m}
            id={`method-${m}`}
            className={`method ${method === m ? 'on' : ''}`}
            onClick={() => onSelectMethod(m)}
          >
            <b>{t(`method.${m}.title`)}</b>
            <small>{t(`method.${m}.desc`)}</small>
            <em>{t(`method.${m}.risk`)}</em>
          </button>
        ))}
      </div>

      {method === 'ACCIDENT' && (
        <div className="sub">
          {routine ? (
            <>
              <span>{t('led.place', { p: routine.place })}</span>
              <div className="hours">
                {hours.map((h) => (
                  <button
                    key={h}
                    className={hour === h ? 'on' : ''}
                    onClick={() => {
                      sensoryAudio.playKeystroke();
                      onSelectHour(h);
                    }}
                  >
                    {h}:00
                  </button>
                ))}
              </div>
            </>
          ) : (
            <span className="need-routine-warning">
              ⚠️ {t('led.needRoutine')} ({lang === 'ar' ? 'افحص كاميرات المراقبة بالتحري' : 'Check CCTV feeds'})
            </span>
          )}
        </div>
      )}

      {method === 'FALSE_LEAD' && (
        <div className="sub">
          <span>{t('led.frame')}</span>
          <div className="hours">
            {(Object.keys(FACTION_NAME) as Faction[]).map((f) => (
              <button
                key={f}
                className={faction === f ? 'on' : ''}
                onClick={() => {
                  sensoryAudio.playKeystroke();
                  onSelectFaction(f);
                }}
              >
                {FACTION_NAME[f][lang]}
              </button>
            ))}
          </div>
        </div>
      )}

      <span className="ruled">{lang === 'ar' ? 'توقيت تنفيذ الوفاة:' : 'Execution Timing:'}</span>
      <div className="timing-options-row">
        <button
          type="button"
          className={`btn-timing ${delayMode === 'INSTANT' ? 'on' : ''}`}
          onClick={() => {
            sensoryAudio.playKeystroke();
            onSelectDelayMode('INSTANT');
          }}
        >
          <b>{lang === 'ar' ? '⚡ فوري (40 ثانية)' : '⚡ Instant (40s)'}</b>
          <small>{lang === 'ar' ? 'تنفيذ مباشر على الفور' : 'Execute immediately'}</small>
        </button>
        <button
          type="button"
          className={`btn-timing ${delayMode === 'DELAY_60S' ? 'on' : ''}`}
          onClick={() => {
            sensoryAudio.playKeystroke();
            onSelectDelayMode('DELAY_60S');
          }}
        >
          <b>{lang === 'ar' ? '⏳ مؤجل (مجدول 60 ثانية)' : '⏳ Delayed (60s Trick)'}</b>
          <small>{lang === 'ar' ? 'تشتيت تحليل جدول L' : 'Disrupts L’s timetable tracker'}</small>
        </button>
      </div>

      {scheduledKills.length > 0 && (
        <div className="scheduled-kills-container">
          <span className="ruled">{lang === 'ar' ? 'الأحكام المؤجلة قيد العد التنازلي:' : 'Active Scheduled Executions:'}</span>
          {scheduledKills.map((sk) => (
            <div key={sk.id} className="scheduled-kill-item">
              <Clock size={13} className="pulse-icon" />
              <span className="scheduled-name">{sk.name}</span>
              <span className="scheduled-timer">
                00:{sk.secondsLeft < 10 ? `0${sk.secondsLeft}` : sk.secondsLeft}
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
