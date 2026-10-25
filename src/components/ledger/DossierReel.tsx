import { AlertTriangle, Car, CheckCircle2, FileText, Sparkles } from 'lucide-react';
import { REGION_NAME } from '../../game/data';
import { getTargetIntel } from '../../game/store';
import type { GameState } from '../../game/store';
import type { TargetProfile } from '../../game/types';
import { useLang } from '../../i18n';
import { FaceCard } from '../shared';

export type TargetCategory = 'ALL' | 'CORRUPT' | 'CRIMINAL' | 'DECOY';

export function DossierReel({
  state,
  selectedTargetId,
  targetCategory,
  onSelectCategory,
  onSelectTarget,
}: {
  state: GameState;
  selectedTargetId: string | null;
  targetCategory: TargetCategory;
  onSelectCategory: (cat: TargetCategory) => void;
  onSelectTarget: (tgt: TargetProfile) => void;
}) {
  const { lang, tx } = useLang();

  const filteredTargets = state.targets.filter((tgt) => {
    if (targetCategory === 'ALL') return true;
    if (targetCategory === 'CORRUPT') return tgt.priority === 'CORRUPT';
    if (targetCategory === 'CRIMINAL') return tgt.priority === 'CRIMINAL';
    if (targetCategory === 'DECOY') return tgt.priority === 'DECOY';
    return true;
  });

  return (
    <section className="target-dossiers-section" aria-label="Target Dossiers">
      <div className="dossiers-section-header">
        <div className="dossiers-title-group">
          <span className="dossiers-icon">📁</span>
          <h4>{lang === 'ar' ? 'سجل ملفات الأهداف والمطلوبين (انقر لاختيار الهدف)' : 'Target Dossiers Registry (Tap to Select)'}</h4>
        </div>
        <div className="dossiers-filter-chips">
          <button
            type="button"
            className={`dossier-chip ${targetCategory === 'ALL' ? 'active' : ''}`}
            onClick={() => onSelectCategory('ALL')}
          >
            {lang === 'ar' ? 'الكل' : 'All'}
          </button>
          <button
            type="button"
            className={`dossier-chip ${targetCategory === 'CORRUPT' ? 'active' : ''}`}
            onClick={() => onSelectCategory('CORRUPT')}
          >
            {lang === 'ar' ? 'الفاسدون 🏛️' : 'Corrupt'}
          </button>
          <button
            type="button"
            className={`dossier-chip ${targetCategory === 'CRIMINAL' ? 'active' : ''}`}
            onClick={() => onSelectCategory('CRIMINAL')}
          >
            {lang === 'ar' ? 'المجرمون 🗡️' : 'Criminals'}
          </button>
        </div>
      </div>

      <div className="dossiers-scroll-reel">
        {filteredTargets.map((tgt) => {
          const isSelected = selectedTargetId === tgt.id;
          const isDead = !tgt.alive;
          const isImmune = state.player.immuneTargets?.includes(tgt.id);
          const isDecoy = tgt.priority === 'DECOY';
          const knownRoutine = state.player.knownRoutines[tgt.id];
          const intel = getTargetIntel(state.player, tgt.id);

          return (
            <div
              key={tgt.id}
              id={`dossier-card-${tgt.id}`}
              className={`target-dossier-card ${isSelected ? 'selected' : ''} ${isDead ? 'dead' : ''} ${isDecoy ? 'decoy' : ''} ${intel.isComplete && !isDead ? 'dossier-ready-glow' : ''}`}
              onClick={() => !isDead && !isImmune && onSelectTarget(tgt)}
            >
              <div className="card-face-wrapper">
                <FaceCard faceId={tgt.faceId} size={54} active={isSelected} />
                {!isDead && !isImmune && (
                  <span className={`card-intel-pill ${intel.isComplete ? 'complete' : 'progress'}`}>
                    {intel.isComplete ? '✨ 100%' : `${intel.percent}%`}
                  </span>
                )}
                {isDead && (
                  <div className="stamp-dead-overlay">
                    <span>{lang === 'ar' ? 'مات ✕' : 'DEAD'}</span>
                  </div>
                )}
                {isImmune && (
                  <div className="stamp-immune-overlay">
                    <span>{lang === 'ar' ? 'محصن 🛡️' : 'IMMUNE'}</span>
                  </div>
                )}
              </div>

              <div className="card-meta">
                <b className="card-name">{tgt.name[lang]}</b>
                <span className="card-title-badge">
                  {tgt.title[lang]} · {REGION_NAME[tgt.region][lang]}
                </span>

                {/* Mini Intel Shards Indicator */}
                {!isDead && (
                  <div className="card-intel-shards-mini">
                    <span className={`mini-shard ${intel.hasSurname ? 'active' : ''}`} title={lang === 'ar' ? 'اللقب من الأخبار' : 'Surname clue'}>
                      {intel.hasSurname ? '✓' : '○'} {lang === 'ar' ? 'لقب' : 'Sur'}
                    </span>
                    <span className={`mini-shard ${intel.hasFace ? 'active' : ''}`} title={lang === 'ar' ? 'صورة الوجه من الشرطة' : 'Face clue'}>
                      {intel.hasFace ? '✓' : '○'} {lang === 'ar' ? 'وجه' : 'Face'}
                    </span>
                    <span className={`mini-shard ${intel.hasFirstName ? 'active' : ''}`} title={lang === 'ar' ? 'الروتين والاسم الأول من المراقبة' : 'Routine clue'}>
                      {intel.hasFirstName ? '✓' : '○'} {lang === 'ar' ? 'روتين' : 'Rout'}
                    </span>
                  </div>
                )}

                <div className="card-routine-status">
                  {knownRoutine ? (
                    <span className="routine-pill known" title={tx(knownRoutine.place)}>
                      <Car size={11} /> {lang === 'ar' ? 'الروتين معروف' : 'Routine known'}
                    </span>
                  ) : (
                    <span className="routine-pill unknown">
                      {lang === 'ar' ? 'الروتين مجهول' : 'Routine unknown'}
                    </span>
                  )}
                </div>
              </div>

              <div className="card-action-bar">
                {isDead ? (
                  <span className="status-label dead">{lang === 'ar' ? 'تم القضاء عليه' : 'Eliminated'}</span>
                ) : isImmune ? (
                  <span className="status-label immune">{lang === 'ar' ? 'محصن (4 أخطاء)' : 'Immune'}</span>
                ) : isSelected ? (
                  <span className="status-label selected">
                    <CheckCircle2 size={12} /> {lang === 'ar' ? 'محدد بالدفتر' : 'Selected'}
                  </span>
                ) : isDecoy ? (
                  <span className="status-label decoy">
                    <AlertTriangle size={11} /> {lang === 'ar' ? 'فخ محتمل' : 'Decoy'}
                  </span>
                ) : intel.isComplete ? (
                  <span className="status-label choose complete-ready">
                    <Sparkles size={11} /> {lang === 'ar' ? 'جاهز للحكم 100%' : 'Ready 100%'}
                  </span>
                ) : (
                  <span className="status-label choose gathering-status">
                    <FileText size={11} /> {lang === 'ar' ? `تحرٍ (${intel.percent}%)` : `Intel (${intel.percent}%)`}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
