import { AlertTriangle, Clock, FileCode2, HeartCrack, ScrollText, Swords } from 'lucide-react';
import { sensoryAudio } from '../../game/audioEngine';
import { CRYPTIC_PRESETS, FACTION_NAME, METHODS, REGION_NAME } from '../../game/data';
import type { DeathMethod, Faction, L10n, Region, TimeWindow } from '../../game/types';
import { useLang } from '../../i18n';

export interface ScheduledKillItem {
  id: string;
  name: string;
  secondsLeft: number;
}

const ALL_REGIONS: Region[] = ['NORTH', 'WEST', 'EAST', 'SOUTH', 'CENTRAL'];

export function DeathMethodSelector({
  method,
  onSelectMethod,
  routine,
  hour,
  onSelectHour,
  faction,
  onSelectFaction,
  targetRegion = 'WEST',
  onSelectTargetRegion,
  crypticNote,
  onSelectCrypticNote,
  playerSchedule,
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
  targetRegion?: Region;
  onSelectTargetRegion?: (r: Region) => void;
  crypticNote?: string;
  onSelectCrypticNote?: (note: string) => void;
  playerSchedule?: { freeHours: number[] };
  delayMode: 'INSTANT' | 'DELAY_60S';
  onSelectDelayMode: (m: 'INSTANT' | 'DELAY_60S') => void;
  scheduledKills: ScheduledKillItem[];
}) {
  const { t, lang } = useLang();
  const hours = routine
    ? Array.from({ length: routine.window.to - routine.window.from }, (_, i) => routine.window.from + i)
    : [];

  const getMethodIcon = (m: DeathMethod) => {
    switch (m) {
      case 'CARDIAC':
        return <HeartCrack size={14} className="method-glyph" />;
      case 'ACCIDENT':
        return <AlertTriangle size={14} className="method-glyph" />;
      case 'COERCED_LEAK':
        return <FileCode2 size={14} className="method-glyph" />;
      case 'CRYPTIC_MSG':
        return <ScrollText size={14} className="method-glyph" />;
      case 'GANG_WAR':
      case 'FALSE_LEAD':
        return <Swords size={14} className="method-glyph" />;
    }
  };

  return (
    <>
      <span className="ruled">{t('led.cause')}</span>
      <div className="methods methods-grid-5">
        {METHODS.map((m) => (
          <button
            key={m}
            id={`method-${m}`}
            type="button"
            className={`method ${method === m ? 'on' : ''}`}
            onClick={() => onSelectMethod(m)}
          >
            <div className="method-header">
              {getMethodIcon(m)}
              <b>{t(`method.${m}.title`)}</b>
            </div>
            <small>{t(`method.${m}.desc`)}</small>
            <em>{t(`method.${m}.risk`)}</em>
          </button>
        ))}
      </div>

      {/* 1. CARDIAC TACTICAL BANNER */}
      {method === 'CARDIAC' && (
        <div className="sub method-sub-panel">
          <div className="tactical-banner">
            <HeartCrack size={15} className="text-red-pulse" />
            <span>
              {lang === 'ar'
                ? '⚡ توقيع قاضي الظل الرسمي: وفاة مفاجئة في 40 ثانية. تفرض هيبة العدالة وتثبت السيطرة، لكن تكرارها بالساعة نفسها يمنح المحقق تحليلاً زمنياً.'
                : '⚡ The Shadow Signature: Sudden heart failure in 40s. Proves absolute dominion, but repeated hours give the detective timetable intel.'}
            </span>
          </div>
        </div>
      )}

      {/* 2. ACCIDENT & ALIBI */}
      {method === 'ACCIDENT' && (
        <div className="sub method-sub-panel">
          {routine ? (
            <>
              <div className="routine-header-row">
                <span>{t('led.place', { p: routine.place })}</span>
                <span className="alibi-badge">
                  {lang === 'ar' ? '🛡️ ميزة حجة الغياب متوفرة' : '🛡️ Alibi Crafting Available'}
                </span>
              </div>
              <div className="hours">
                {hours.map((h) => {
                  const isAlibiHour = playerSchedule?.freeHours && !playerSchedule.freeHours.includes(h);
                  return (
                    <button
                      key={h}
                      type="button"
                      className={`${hour === h ? 'on' : ''} ${isAlibiHour ? 'alibi-hour' : ''}`}
                      onClick={() => {
                        sensoryAudio.playKeystroke();
                        onSelectHour(h);
                      }}
                    >
                      <span>{h}:00</span>
                      {isAlibiHour && <small className="alibi-tag">{lang === 'ar' ? 'حجة' : 'Alibi'}</small>}
                    </button>
                  );
                })}
              </div>
              {hour !== undefined && playerSchedule?.freeHours && !playerSchedule.freeHours.includes(hour) && (
                <div className="alibi-success-tip">
                  🛡️ {lang === 'ar'
                    ? `توقيت العبقرية: الساعة ${hour}:00 تقع أثناء دوامك/دراستك! ستحصل على حجة غياب قاطعة (-4% شك) وتدمر استنتاج المحقق لجدولك!`
                    : `Genius Alibi: ${hour}:00 occurs while you are occupied! Grants an airtight alibi (-4% suspicion) and shatters detective timetable model!`}
                </div>
              )}
            </>
          ) : (
            <span className="need-routine-warning">
              ⚠️ {t('led.needRoutine')} ({lang === 'ar' ? 'افحص كاميرات المراقبة بالتحري' : 'Check CCTV feeds'})
            </span>
          )}
        </div>
      )}

      {/* 3. COERCED INTEL LEAK */}
      {method === 'COERCED_LEAK' && (
        <div className="sub method-sub-panel">
          <div className="tactical-banner leak-banner">
            <FileCode2 size={16} />
            <div>
              <b>{lang === 'ar' ? '📂 التحكم بسلوك الضحية قبل الموت:' : '📂 Pre-mortem Mind Coercion:'}</b>
              <p>
                {lang === 'ar'
                  ? 'يُجبر الهدف على اختراق خوادم الشرطة وسرقة وثيقة سرية عن المحقق سايفر (L) قبل انتحاره. ستكسب شظية هوية عن المحقق فورياً (+3% شك فقط)!'
                  : 'Target is forced to breach police servers and exfiltrate a classified Cipher (L) dossier before dying. Yields instant intel on Detective (+3% susp)!'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. CRYPTIC BLOOD MESSAGE */}
      {method === 'CRYPTIC_MSG' && (
        <div className="sub method-sub-panel">
          <div className="sub-section-title">
            <ScrollText size={14} />
            <span>{lang === 'ar' ? 'القطاع المستهدف بالتضليل الجغرافي:' : 'Target Decoy Sector:'}</span>
          </div>
          <div className="hours sector-buttons">
            {ALL_REGIONS.map((r) => (
              <button
                key={r}
                type="button"
                className={targetRegion === r ? 'on' : ''}
                onClick={() => {
                  sensoryAudio.playKeystroke();
                  onSelectTargetRegion?.(r);
                }}
              >
                {REGION_NAME[r][lang]}
              </button>
            ))}
          </div>

          <div className="sub-section-title" style={{ marginTop: '10px' }}>
            <span>{lang === 'ar' ? 'الرسالة المكتوبة بدم الضحية:' : 'Blood Inscription Riddle:'}</span>
          </div>
          <div className="cryptic-presets">
            {CRYPTIC_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                className={`preset-msg-btn ${crypticNote === preset[lang] ? 'on' : ''}`}
                onClick={() => {
                  sensoryAudio.playKeystroke();
                  onSelectCrypticNote?.(preset[lang]);
                }}
              >
                "{preset[lang]}"
              </button>
            ))}
          </div>
          <p className="cryptic-impact-hint">
            🩸 {lang === 'ar'
              ? `سينقل 40% من رادار وشكوك المحقق الجغرافية مباشرة إلى قطاع ${REGION_NAME[targetRegion][lang]}!`
              : `Transfers 40% of the detective's geographic suspicion directly to ${REGION_NAME[targetRegion][lang]}!`}
          </p>
        </div>
      )}

      {/* 5. GANG WAR / CROSSFIRE */}
      {(method === 'GANG_WAR' || method === 'FALSE_LEAD') && (
        <div className="sub method-sub-panel">
          <div className="sub-section-title">
            <Swords size={14} />
            <span>{lang === 'ar' ? 'الفصيل المستهدف بالإشعال والتوريط:' : 'Target Faction to Embroil:'}</span>
          </div>
          <div className="hours">
            {(Object.keys(FACTION_NAME) as Faction[]).map((f) => (
              <button
                key={f}
                type="button"
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
          <p className="cryptic-impact-hint">
            💥 {lang === 'ar'
              ? 'الضحية ستشن هجوماً انتحارياً على هذا الفصيل قبل مصرعها، ما يُغرق الشرطة في حرب شوارع ويخفض الشك العام (-6%).'
              : 'Victim launches a hit against this faction before expiring, miring police in syndicate warfare and lowering suspicion (-6%).'}
          </p>
        </div>
      )}

      {/* TIMING SELECTION */}
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
