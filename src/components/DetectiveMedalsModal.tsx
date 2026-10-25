import { useState, useEffect } from 'react';
import { Award, CheckCircle, Shield, X } from 'lucide-react';
import { getDetectiveMedals, type DetectiveMedal } from '../game/detectiveMedals';
import { useLang } from '../i18n';
import { sensoryAudio } from '../game/audioEngine';

export function DetectiveMedalsModal({ onClose }: { onClose: () => void }) {
  const { lang } = useLang();
  const isRtl = lang === 'ar';
  const [medals, setMedals] = useState<DetectiveMedal[]>([]);

  useEffect(() => {
    setMedals(getDetectiveMedals());
  }, []);

  const unlockedCount = medals.filter((m) => m.unlocked).length;

  return (
    <div className="modal-overlay" onClick={onClose} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="detective-medals-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="medals-card-header">
          <div className="header-badge-group">
            <span className="gothic-l-mini">L</span>
            <div>
              <h3>{isRtl ? 'سجل تكريمات وأوسمة التحقيق الفيدرالية' : 'Interpol Task Force Commendations'}</h3>
              <span className="sub-badge">
                {isRtl ? `تم استحقاق ${unlockedCount} من أصل ${medals.length} أوسمة جنائية` : `${unlockedCount} of ${medals.length} Medals Awarded`}
              </span>
            </div>
          </div>
          <button className="btn-close-modal" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Medals List */}
        <div className="medals-grid-list">
          {medals.map((m) => (
            <div key={m.id} className={`medal-item-card ${m.unlocked ? 'unlocked' : 'locked'}`}>
              <div className="medal-icon-slot">
                <span>{m.icon}</span>
                {m.unlocked && <CheckCircle size={14} className="medal-check" />}
              </div>
              <div className="medal-info">
                <b className="medal-title">{m.title[lang]}</b>
                <p className="medal-desc">{m.desc[lang]}</p>
                {m.unlocked && m.unlockedAt && (
                  <span className="medal-awarded-stamp">
                    {isRtl ? `مُنح الوسام في: ${m.unlockedAt}` : `Awarded at: ${m.unlockedAt}`}
                  </span>
                )}
                {!m.unlocked && (
                  <span className="medal-locked-label">
                    {isRtl ? '🔒 قيد التحري والتحقيق' : '🔒 Classified / Locked'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="medals-card-footer">
          <Shield size={14} />
          <span>{isRtl ? 'فرقة التحقيق الخاصة لمكافحة الجرائم غير المفسرة — قيادة L' : 'Special Task Force for Unexplained Homicides — Commander L'}</span>
        </div>
      </div>
    </div>
  );
}

export function DetectiveMedalToast() {
  const { lang } = useLang();
  const isRtl = lang === 'ar';
  const [toast, setToast] = useState<DetectiveMedal | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<DetectiveMedal>;
      setToast(custom.detail);
      sensoryAudio.playThunder();
      const timer = setTimeout(() => {
        setToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    };

    window.addEventListener('detective-medal-unlocked', handler);
    return () => window.removeEventListener('detective-medal-unlocked', handler);
  }, []);

  if (!toast) return null;

  return (
    <div className="detective-medal-toast" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="toast-icon">{toast.icon}</div>
      <div className="toast-info">
        <span className="toast-tag">{isRtl ? '🎖️ وسام تحقيق جديد مُنح للمحقق L' : '🎖️ New Medal Awarded to L'}</span>
        <b>{toast.title[lang]}</b>
        <small>{toast.desc[lang]}</small>
      </div>
    </div>
  );
}
