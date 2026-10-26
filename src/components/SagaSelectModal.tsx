import { Briefcase, CheckCircle2, ChevronRight, Clock, Flame, Lock, Play, ShieldAlert, Sparkles, X } from 'lucide-react';
import { sensoryAudio } from '../game/audioEngine';
import { MAJOR_SAGAS, type MajorSaga, type SagaProgressState } from '../game/sagas';
import { useLang } from '../i18n';

export function SagaSelectModal({
  isOpen,
  onClose,
  progress,
  onSelectSaga,
}: {
  isOpen: boolean;
  onClose: () => void;
  progress: SagaProgressState;
  onSelectSaga: (sagaId: string) => void;
}) {
  const { lang } = useLang();
  const isRtl = lang === 'ar';

  if (!isOpen) return null;

  return (
    <div className="saga-modal-overlay" onClick={onClose} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="saga-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="crt-scanline-overlay" />

        {/* Header */}
        <header className="saga-modal-header">
          <div className="saga-header-title-row">
            <Briefcase size={22} className="saga-briefcase-icon" />
            <div>
              <h3>{isRtl ? 'ملفات القضايا الكبرى الثلاث (Major Sagas)' : 'The 3 Major Investigation Sagas'}</h3>
              <p>{isRtl ? 'حملة سينمائية متكاملة تمتد لأكثر من ساعة ونصف من التحدي الاستخباراتي' : 'Epic campaign spanning over 1h 45m of high-stakes deductive warfare'}</p>
            </div>
          </div>
          <button
            type="button"
            className="btn-close-saga-modal"
            onClick={() => {
              sensoryAudio.playKeystroke();
              onClose();
            }}
          >
            <X size={18} />
          </button>
        </header>

        {/* Total Campaign Duration Banner */}
        <div className="saga-campaign-summary-bar">
          <div className="summary-item">
            <Clock size={13} />
            <span>{isRtl ? 'إجمالي وقت اللعب: ساعة و 45 دقيقة' : 'Total Campaign Time: ~1h 45m'}</span>
          </div>
          <div className="summary-item">
            <Flame size={13} />
            <span>{isRtl ? '3 خصوم استخباراتيين كبار' : '3 Mastermind Adversaries'}</span>
          </div>
          <div className="summary-item">
            <Sparkles size={13} />
            <span>{isRtl ? '34 هدفاً وفاسداً' : '34 High-Profile Targets'}</span>
          </div>
        </div>

        {/* Sagas List */}
        <div className="saga-cards-list">
          {MAJOR_SAGAS.map((saga: MajorSaga) => {
            const isUnlocked = saga.unlockedByDefault || progress.completedSagas['saga-1-cipher']?.cleared;
            const isActive = saga.id === progress.activeSagaId;
            const isCompleted = Boolean(progress.completedSagas[saga.id]?.cleared);

            return (
              <div
                key={saga.id}
                className={`saga-card ${!isUnlocked ? 'locked' : ''} ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              >
                <div className="saga-card-head">
                  <div className="saga-number-badge">CASE 0{saga.number}</div>
                  <span
                    className="saga-difficulty-pill"
                    style={{ borderColor: saga.difficultyColor, color: saga.difficultyColor }}
                  >
                    {saga.badge[lang]}
                  </span>
                  <span className="saga-duration-pill">
                    <Clock size={11} /> {saga.playtimeEst}
                  </span>
                  {isActive && (
                    <span className="saga-active-pill">
                      {isRtl ? '● جاري خوضها' : '● In Progress'}
                    </span>
                  )}
                  {isCompleted && (
                    <span className="saga-cleared-pill">
                      <CheckCircle2 size={11} /> {isRtl ? 'تم حل القضية' : 'Case Closed'}
                    </span>
                  )}
                </div>

                <h4 className="saga-title">{saga.title[lang]}</h4>
                <p className="saga-subtitle">{saga.subtitle[lang]}</p>

                <div className="saga-adversary-box">
                  <span className="adv-label">{isRtl ? 'الخصم الرئيسي:' : 'Lead Adversary:'}</span>
                  <b className="adv-name">{saga.adversary[lang]}</b>
                  <span className="target-count">
                    ({saga.targetCount} {isRtl ? 'هدفاً مطلوباً' : 'targets'})
                  </span>
                </div>

                <p className="saga-lore-text">{saga.lore[lang]}</p>

                {/* Key Features */}
                <ul className="saga-features-list">
                  {saga.features.map((feat, idx) => (
                    <li key={idx}>
                      <span className="feat-check">✓</span>
                      <span>{feat[lang]}</span>
                    </li>
                  ))}
                </ul>

                {/* Card Action */}
                <div className="saga-card-footer">
                  {isUnlocked ? (
                    <button
                      type="button"
                      className={`btn-select-saga ${isActive ? 'current' : ''}`}
                      onClick={() => {
                        sensoryAudio.playLetterScratch();
                        sensoryAudio.playThunder();
                        onSelectSaga(saga.id);
                        onClose();
                      }}
                    >
                      {isActive ? (
                        <>
                          <Play size={13} />
                          <span>{isRtl ? 'القضية النشطة حالياً' : 'Current Active Case'}</span>
                        </>
                      ) : (
                        <>
                          <ChevronRight size={13} />
                          <span>{isRtl ? 'فتح هذا الملف وبدء التحقيق' : 'Launch Investigation'}</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="saga-locked-info">
                      <Lock size={12} />
                      <span>{isRtl ? 'أنهِ القضية السابقة لفك تشفير هذا الملف' : 'Clear previous case to unlock dossier'}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
