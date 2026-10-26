import { Award, CheckCircle2, ChevronRight, Lock, Play, ShieldAlert, Sparkles, X } from 'lucide-react';
import { sensoryAudio } from '../game/audioEngine';
import { STORY_CHAPTERS, type ChapterProgressState } from '../game/chapters';
import type { GameState } from '../game/store';
import { useLang } from '../i18n';

export function ChapterSelectModal({
  isOpen,
  onClose,
  gameState,
  progress,
  onSelectChapter,
}: {
  isOpen: boolean;
  onClose: () => void;
  gameState: GameState;
  progress: ChapterProgressState;
  onSelectChapter: (chapterId: number) => void;
}) {
  const { lang } = useLang();
  const isRtl = lang === 'ar';

  if (!isOpen) return null;

  return (
    <div className="chapter-modal-overlay" onClick={onClose} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="chapter-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="crt-scanline-overlay" />

        {/* Modal Header */}
        <header className="chapter-modal-header">
          <div className="chapter-header-title-row">
            <ShieldAlert size={20} className="chapter-shield-icon" />
            <div>
              <h3>{isRtl ? 'خريطة فصول قاضي الظل' : 'The Shadow Campaign Arcs'}</h3>
              <p>{isRtl ? 'مراحل الصراع من الأقل خطورة إلى صراع العقول الأقصى' : 'Escalating arcs from Low Danger to Ultimate Checkmate'}</p>
            </div>
          </div>
          <button
            type="button"
            className="btn-close-chapter-modal"
            onClick={() => {
              sensoryAudio.playKeystroke();
              onClose();
            }}
          >
            <X size={18} />
          </button>
        </header>

        {/* Chapters Cards List */}
        <div className="chapter-cards-scroll">
          {STORY_CHAPTERS.map((ch) => {
            const isUnlocked = ch.id <= progress.unlockedChapter;
            const isActive = ch.id === progress.activeChapter;
            const clearRecord = progress.completed[ch.id];
            const isCompleted = Boolean(clearRecord?.cleared);

            return (
              <div
                key={ch.id}
                className={`chapter-card ${!isUnlocked ? 'locked' : ''} ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              >
                {/* Top Badge & Danger Level */}
                <div className="chapter-card-top">
                  <span className="chapter-danger-tag" style={{ borderColor: ch.dangerColor, color: ch.dangerColor }}>
                    {ch.badge[lang]}
                  </span>
                  <span className="chapter-day-range">{ch.dayRange}</span>
                  {isCompleted && (
                    <span className={`chapter-rank-pill rank-${clearRecord.rank}`}>
                      RANK {clearRecord.rank}
                    </span>
                  )}
                  {!isUnlocked && (
                    <span className="chapter-locked-tag">
                      <Lock size={12} /> {isRtl ? 'مغلق' : 'Locked'}
                    </span>
                  )}
                </div>

                {/* Title & Subtitle */}
                <h4 className="chapter-title">{ch.title[lang]}</h4>
                <p className="chapter-subtitle">{ch.subtitle[lang]}</p>
                <p className="chapter-intro-text">{ch.intro[lang]}</p>

                {/* Objectives Checklist */}
                <div className="chapter-objectives-box">
                  <div className="obj-title-label">
                    <Sparkles size={12} />
                    <span>{isRtl ? 'شروط اجتياز الفصل:' : 'Chapter Objectives:'}</span>
                  </div>
                  <ul className="chapter-objectives-list">
                    {ch.objectives.map((obj) => {
                      const isMet = obj.check(gameState);
                      return (
                        <li key={obj.id} className={isMet ? 'met' : 'pending'}>
                          {isMet ? (
                            <CheckCircle2 size={13} className="obj-icon met" />
                          ) : (
                            <span className="obj-bullet" />
                          )}
                          <span>{obj.title[lang]}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Bottom Action Button */}
                <div className="chapter-card-actions">
                  {isUnlocked ? (
                    <button
                      type="button"
                      className={`btn-start-chapter ${isActive ? 'current' : ''}`}
                      onClick={() => {
                        sensoryAudio.playKeystroke();
                        sensoryAudio.playThunder();
                        onSelectChapter(ch.id);
                        onClose();
                      }}
                    >
                      {isActive ? (
                        <>
                          <Play size={13} />
                          <span>{isRtl ? 'الفصل النشط حالياً' : 'Active Chapter'}</span>
                        </>
                      ) : isCompleted ? (
                        <>
                          <Award size={13} />
                          <span>{isRtl ? 'إعادة خوض الفصل' : 'Replay Chapter'}</span>
                        </>
                      ) : (
                        <>
                          <ChevronRight size={13} />
                          <span>{isRtl ? 'بدء هذا الفصل' : 'Start Chapter'}</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="locked-placeholder">
                      <Lock size={13} />
                      <span>{isRtl ? 'أنهِ الفصل السابق لفتح هذا الطور' : 'Clear previous chapter to unlock'}</span>
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
