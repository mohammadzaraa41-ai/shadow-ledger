import { X } from 'lucide-react';
import { sensoryAudio } from '../../game/audioEngine';
import type { Action } from '../../game/store';

export function ShinigamiDealModal({
  lang,
  dispatch,
  onClose,
}: {
  lang: 'ar' | 'en';
  dispatch: (a: Action) => void;
  onClose: () => void;
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="shinigami-deal-card" onClick={(e) => e.stopPropagation()} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="shinigami-card-header">
          <div className="shinigami-title-group">
            <span className="shinigami-creepy-glyph">👁️</span>
            <h3>{lang === 'ar' ? 'صفقة عين الظل المحرمة' : 'Forbidden Eye Deal'}</h3>
          </div>
          <button className="btn-close-modal" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="shinigami-card-body">
          <p className="shinigami-warning-text">
            {lang === 'ar'
              ? '«هل تضحي بـ 3 أيام من مهلتك الزمنية مقابل امتلاك عيون الظل؟ ستكشف لك هذه الصفقة الاسم الحقيقي والوجه لأي مشتبه به في المدينة فوراً، مع حمايتك من أي فخاخ!»'
              : '«Do you sacrifice 3 days of your deadline to possess the Eyes of the Shadow? This pact will immediately reveal the real legal name and face of any target in the city!»'}
          </p>
          <div className="shinigami-trade-box">
            <div className="trade-item cost">
              <span className="trade-label">{lang === 'ar' ? 'التضحية المطلوبة' : 'Required Cost'}</span>
              <b className="trade-val">{lang === 'ar' ? '🔻 3 أيام من الوقت + 10% شبهة' : '🔻 3 Days Time + 10% Suspicion'}</b>
            </div>
            <div className="trade-item gain">
              <span className="trade-label">{lang === 'ar' ? 'القوة المكتسبة' : 'Gained Power'}</span>
              <b className="trade-val">{lang === 'ar' ? '✨ كشف أسماء ووجوه الجميع فوراً' : '✨ Instant Full Target Reveal'}</b>
            </div>
          </div>
        </div>
        <div className="shinigami-card-footer">
          <button
            type="button"
            id="btn-confirm-eye-deal"
            className="btn-confirm-deal"
            onClick={() => {
              sensoryAudio.playShinigamiDeal();
              dispatch({ type: 'SHINIGAMI_EYE_DEAL' });
              onClose();
            }}
          >
            {lang === 'ar' ? '🩸 إبرام الصفقة بدمك' : '🩸 Seal the Blood Pact'}
          </button>
          <button type="button" className="btn-cancel-deal" onClick={onClose}>
            {lang === 'ar' ? 'تراجع' : 'Decline'}
          </button>
        </div>
      </div>
    </div>
  );
}
