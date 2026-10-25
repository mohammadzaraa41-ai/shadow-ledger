import { useMemo } from 'react';
import { Radio, AlertCircle } from 'lucide-react';
import type { GameState } from '../game/store';

export function BreakingNewsTicker({
  state,
  lang,
}: {
  state: GameState;
  lang: 'ar' | 'en';
}) {
  const isRtl = lang === 'ar';
  const { kills, suspicion, day, hasShinigamiEyes } = state.player;

  const tickerItems = useMemo(() => {
    const items: string[] = [];

    if (kills.length === 0) {
      items.push(
        isRtl
          ? 'المحقق L: "رصدنا تحركات مريبة وندعو المواطنين للإبلاغ عن أي سجلات مسربة"'
          : 'Detective L: "Suspicious data access detected; citizens advised to report leaks"',
      );
      items.push(
        isRtl
          ? 'استياء عام في شوارع العاصمة من تعطل قضايا الفساد المالي وتزايد نفوذ النقابات'
          : 'Public outcry grows over stalled white-collar corruption cases',
      );
      items.push(
        isRtl
          ? 'الشرطة تكثف دوريات المراقبة وتفحص كاميرات الأحياء السكنية'
          : 'Task force steps up urban CCTV surveillance across residential sectors',
      );
    } else {
      items.push(
        isRtl
          ? `عاجل | تأكيد سقوط ${kills.length} من الشخصيات المشبوهة.. ذعر في أوساط العصابات ونقابات الفساد!`
          : `BREAKING | ${kills.length} high-profile targets neutralized.. Panic sweeps through organized crime syndicates!`,
      );

      if (suspicion >= 50) {
        items.push(
          isRtl
          ? 'استنفار أمني شامل | المحقق L يعلن تضييق دائرة الاشتباه الجغرافي حول الفاعل!'
          : 'HIGH ALERT | L announces narrowed geographic profile of the hidden judge!',
        );
      } else {
        items.push(
          isRtl
          ? 'الطب الشرعي عاجز عن فك لغز الوفيات المتزامنة والشارع يطلق لقب "قاضي الظلال" على المنفّذ'
          : 'Forensics baffled by concurrent deaths; public dubs the unknown vigilante "Shadow Judge"',
        );
      }

      if (hasShinigamiEyes) {
        items.push(
          isRtl
          ? 'ظاهرة خارقة | شهود عيان يتحدثون عن هالات حمراء مرعبة تسبق سقوط الأهداف في المدينة!'
          : 'ANOMALY | Witnesses report ominous crimson auras appearing moments before verdicts!',
        );
      }

      items.push(
        isRtl
          ? `اليوم ${day} | استمرار العمليات في كافة القطاعات الأمنية.. وترقب لظهور المحقق L`
          : `Day ${day} | Operations active across all sectors.. L task force on stand-by`,
      );
    }

    return items;
  }, [kills.length, suspicion, day, hasShinigamiEyes, isRtl]);

  return (
    <div className="breaking-news-ticker-bar" dir={isRtl ? 'rtl' : 'ltr'} aria-label="Breaking News">
      <div className="ticker-badge">
        <span className="live-dot" />
        <Radio size={12} className="ticker-icon" />
        <b>{isRtl ? 'عاجل' : 'BREAKING'}</b>
      </div>
      <div className="ticker-track-wrapper">
        <div className="ticker-track">
          {tickerItems.concat(tickerItems).map((text, idx) => (
            <span key={idx} className="ticker-item">
              <AlertCircle size={11} className="ticker-bullet" />
              <span>{text}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
