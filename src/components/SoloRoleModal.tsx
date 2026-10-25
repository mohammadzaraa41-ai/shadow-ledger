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
          {/* Option 1: SHADOW MASTERMIND */}
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
              <span className="role-badge kira-badge">SHADOW // ARCHITECT OF RETRIBUTION</span>
            </div>
            <h4>{isRtl ? 'قاضي الظل (The Shadow) — مهندس العدالة الغامض' : 'The Shadow — Architect of Retribution'}</h4>
            <p>
              {isRtl
                ? 'املك دفتر الظل، دوّن أسماء المجرمين، واكشف روتين الفاسدين. راوغ تحريات المحقق وتفادَ فخاخه التلفزيونية لتطهير المدينة.'
                : 'Wield the Shadow Ledger, eliminate the corrupt, and evade the detective’s deductive traps to reshape the city.'}
            </p>
            <ul className="role-perks-list">
              <li>{isRtl ? '✓ التحكم الكامل بدفتر الظل وريشة الحبر' : '✓ Full control of Shadow Ledger & Quill'}</li>
              <li>{isRtl ? '✓ فك شفرات الروتين عبر كاميرات المراقبة' : '✓ Crack routine intel via CCTV surveillance'}</li>
              <li>{isRtl ? '✓ مواجهة ذكاء المحقق الاستدلالي المتقدم' : '✓ Face dynamic Bayesian AI Chief Detective'}</li>
            </ul>
            <button className="btn-confirm-role btn-kira-role">
              <Feather size={14} />
              <span>{isRtl ? 'ابدأ كـ قاضي الظل (The Shadow)' : 'Play as The Shadow'}</span>
            </button>
          </div>

          {/* Option 2: DETECTIVE CIPHER */}
          <div
            className="role-selection-box role-l-box"
            onClick={() => {
              sensoryAudio.playRadioStatic(1.5);
              onSelectRole('DETECTIVE');
            }}
          >
            <div className="role-box-top">
              <span className="role-glyph-crest gothic-l">Σ</span>
              <span className="role-badge l-badge">TASK FORCE // CHIEF INVESTIGATOR</span>
            </div>
            <h4>{isRtl ? 'المحقق سايفر (Detective Cipher) — قاهر الألغاز' : 'Detective Cipher — Chief Investigator'}</h4>
            <p>
              {isRtl
                ? 'قُد فرقة التحقيق الخاصة، انصب الطعوم التلفزيونية الإقليمية، أطلق بث التحدي الحي، واحصر قطاع الظل السكني لتداهمه وتعتقله.'
                : 'Command Interpol Task Force, broadcast regional decoys, bait the killer with live TV sting, and raid the hideout.'}
            </p>
            <ul className="role-perks-list">
              <li>{isRtl ? '✓ رادار استدلال بايزي مباشر يحلل كل جريمة' : '✓ Live Bayesian heatmap & time profiler'}</li>
              <li>{isRtl ? '✓ إطلاق فخ التحدي التلفزيوني الحي' : '✓ Launch live TV decoy bait trap'}</li>
              <li>{isRtl ? '✓ مواجهة ذكاء الظل الخفي ومداهمة مقره' : '✓ Track and raid autonomous Shadow AI'}</li>
            </ul>
            <button className="btn-confirm-role btn-l-role">
              <Crosshair size={14} />
              <span>{isRtl ? 'ابدأ كـ المحقق سايفر (Detective Cipher)' : 'Play as Detective Cipher'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
