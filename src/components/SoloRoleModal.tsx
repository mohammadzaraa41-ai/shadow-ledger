import { Award, BookOpen, Crosshair, Feather, Shield, Sparkles, X } from 'lucide-react';
import { sensoryAudio } from '../game/audioEngine';
import type { PlayerRole } from '../game/multiplayer';
import { useLang } from '../i18n';

export function SoloRoleModal({
  onSelectRole,
  onClose,
}: {
  onSelectRole: (role: PlayerRole) => void;
  onClose: () => void;
}) {
  const { lang } = useLang();
  const isRtl = lang === 'ar';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="solo-role-card" onClick={(e) => e.stopPropagation()} dir={isRtl ? 'rtl' : 'ltr'}>
        <header className="solo-role-header">
          <div className="role-title-group">
            <Sparkles size={16} className="gold-sparkle" />
            <h3>{isRtl ? 'اختر مسارك في هذه المعركة العقلية' : 'Choose Your Path in this Mental Duel'}</h3>
          </div>
          <button className="btn-close-modal" onClick={onClose}>
            <X size={18} />
          </button>
        </header>

        <p className="solo-role-sub">
          {isRtl
            ? 'يمكنك خوض التحدي منفرداً؛ اختر الجانب الذي تريد قيادته ضد الذكاء الاصطناعي:'
            : 'Play solo against dynamic AI. Select the mastermind you want to control:'}
        </p>

        <div className="role-cards-grid">
          {/* Option 1: KIRA / KILLER */}
          <div
            className="role-selection-box role-kira-box"
            onClick={() => {
              sensoryAudio.playLetterScratch();
              sensoryAudio.playThunder();
              onSelectRole('KILLER');
            }}
          >
            <div className="role-box-top">
              <span className="role-glyph-crest">🖋️</span>
              <span className="role-badge kira-badge">KIRA // GOD OF THE NEW WORLD</span>
            </div>
            <h4>{isRtl ? 'لايت (كيرا) — قاضي العالم الجديد' : 'Light (KIRA) — God of the New World'}</h4>
            <p>
              {isRtl
                ? 'املك دفتر الظل، دوّن أسماء المجرمين، واكشف روتين الفاسدين. راوغ تحريات L وتفادَ فخاخه التلفزيونية لتبني عالمك الخالي من الفساد.'
                : 'Wield the Shadow Ledger, eliminate the corrupt, and evade L’s deductive traps to birth a new world.'}
            </p>
            <ul className="role-perks-list">
              <li>{isRtl ? '✓ التحكم الكامل بدفتر الموت وقلم الحبر' : '✓ Full control of Death Ledger & Pen'}</li>
              <li>{isRtl ? '✓ فك شفرات الروتين عبر كاميرات المراقبة' : '✓ Crack routine intel via CCTV surveillance'}</li>
              <li>{isRtl ? '✓ مواجهة ذكاء L البايزي والاستدلالي' : '✓ Face dynamic Bayesian AI Detective L'}</li>
            </ul>
            <button className="btn-confirm-role btn-kira-role">
              <Feather size={14} />
              <span>{isRtl ? 'ابدأ كـ كيرا (KIRA)' : 'Play as KIRA'}</span>
            </button>
          </div>

          {/* Option 2: DETECTIVE L */}
          <div
            className="role-selection-box role-l-box"
            onClick={() => {
              sensoryAudio.playRadioStatic(1.5);
              onSelectRole('DETECTIVE');
            }}
          >
            <div className="role-box-top">
              <span className="role-glyph-crest gothic-l">L</span>
              <span className="role-badge l-badge">INTERPOL // MASTER DETECTIVE</span>
            </div>
            <h4>{isRtl ? 'المحقق العبقري L — قاهر المستحيل' : 'Master Detective L — Chief Investigator'}</h4>
            <p>
              {isRtl
                ? 'قُد فرقة التحقيق الخاصة، انصب الطعوم التلفزيونية الإقليمية، أطلق بث Lind L. Tailor الحي، واحصر قطاع كيرا السكني لتداهمه وتعتقله.'
                : 'Command Interpol Task Force, broadcast regional decoys, bait Kira with live TV sting, and raid his hideout.'}
            </p>
            <ul className="role-perks-list">
              <li>{isRtl ? '✓ رادار استدلال بايزي مباشر يحلل كل جريمة' : '✓ Live Bayesian heatmap & time profiler'}</li>
              <li>{isRtl ? '✓ إطلاق فخ Lind L. Tailor الحي تلفزيونياً' : '✓ Launch Lind L. Tailor live TV bait trap'}</li>
              <li>{isRtl ? '✓ مواجهة ذكاء كيرا الخفي ومداهمة مقره' : '✓ Track and raid autonomous AI Kira'}</li>
            </ul>
            <button className="btn-confirm-role btn-l-role">
              <Crosshair size={14} />
              <span>{isRtl ? 'ابدأ كـ المحقق L' : 'Play as Detective L'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
