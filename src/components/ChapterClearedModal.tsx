import { Award, ChevronRight, ShieldCheck, Sparkles, Trophy, X } from 'lucide-react';
import { sensoryAudio } from '../game/audioEngine';
import { STORY_CHAPTERS, type StoryChapter } from '../game/chapters';
import { useLang } from '../i18n';

export function ChapterClearedModal({
  chapterId,
  rank,
  suspicion,
  clearedAtDay,
  onProceed,
  onClose,
}: {
  chapterId: number;
  rank: 'S' | 'A' | 'B';
  suspicion: number;
  clearedAtDay: number;
  onProceed: () => void;
  onClose: () => void;
}) {
  const { lang } = useLang();
  const isRtl = lang === 'ar';
  const chapter: StoryChapter | undefined = STORY_CHAPTERS.find((c) => c.id === chapterId);

  if (!chapter) return null;

  const isLastChapter = chapterId >= STORY_CHAPTERS.length;

  return (
    <div className="chapter-cleared-overlay" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="chapter-cleared-modal">
        <div className="crt-scanline-overlay" />

        {/* Close Icon */}
        <button
          type="button"
          className="btn-close-cleared"
          onClick={() => {
            sensoryAudio.playKeystroke();
            onClose();
          }}
        >
          <X size={18} />
        </button>

        {/* Celebration Header */}
        <div className="cleared-celebration-head">
          <div className="cleared-trophy-ring">
            <Trophy size={36} className="trophy-pulse" />
          </div>
          <span className="cleared-tagline">
            <Sparkles size={13} />
            {isRtl ? 'تم اجتياز الفصل بنجاح ساحق!' : 'CHAPTER CONQUERED & CHECKPOINTED!'}
          </span>
          <h2 className="cleared-chapter-title">{chapter.title[lang]}</h2>
        </div>

        {/* Rank Showcase */}
        <div className={`cleared-rank-box rank-badge-${rank}`}>
          <div className="rank-letter-container">
            <span className="rank-label">{isRtl ? 'تقييم الدهاء' : 'TACTICAL RANK'}</span>
            <b className="rank-char">{rank}</b>
          </div>
          <div className="rank-desc-container">
            <p className="rank-desc-title">
              {rank === 'S'
                ? (isRtl ? 'عبقرية مطلقة (The True God of Mind Games)' : 'God-tier Mastermind (Pure Precision)')
                : rank === 'A'
                ? (isRtl ? 'مخطط تكتيكي بارع (Masterful Strategist)' : 'Masterful Strategist (Calculated)')
                : (isRtl ? 'نجاة بشق الأنفس (Close Call)' : 'Narrow Escape (Relentless Survivor)')}
            </p>
            <div className="rank-stats-row">
              <span>{isRtl ? `مؤشر الشك: ${suspicion}%` : `Heat Level: ${suspicion}%`}</span>
              <span>•</span>
              <span>{isRtl ? `اليوم: ${clearedAtDay}` : `Day: ${clearedAtDay}`}</span>
            </div>
          </div>
        </div>

        {/* Story Narrative Box */}
        <div className="cleared-story-box">
          <div className="story-box-title">
            <ShieldCheck size={14} />
            <span>{isRtl ? 'تداعيات التحقيق الدولية والميدانية:' : 'Global Investigation Intelligence Report:'}</span>
          </div>
          <p className="story-narrative-text">
            "{chapter.clearNarrative[lang]}"
          </p>
        </div>

        {/* Action Button */}
        <div className="cleared-modal-actions">
          <button
            type="button"
            className="btn-continue-next-chapter"
            onClick={() => {
              sensoryAudio.playLetterScratch();
              sensoryAudio.playThunder();
              onProceed();
            }}
          >
            <span>
              {isLastChapter
                ? (isRtl ? '🏆 العالم الجديد بين يديك (النصر النهائي)' : '🏆 Rule The New World (Final Victory)')
                : (isRtl ? `الانتقال إلى الفصل ${chapterId + 1}` : `Advance to Chapter ${chapterId + 1}`)}
            </span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
