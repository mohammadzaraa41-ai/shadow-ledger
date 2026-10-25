import { AlertTriangle, Flame, HelpCircle, PenTool, Sparkles, UserCheck, X } from 'lucide-react';
import { REGION_NAME } from '../../game/data';
import type { L10n, TargetProfile, TimeWindow } from '../../game/types';
import { useLang } from '../../i18n';
import { FaceCard } from '../shared';

export function PinnedTargetBoard({
  selectedTarget,
  targetIntel,
  routine,
  hasShinigamiEyes,
  splitInfo,
  onClearTarget,
  onAppendShard,
  onInscribeFull,
}: {
  selectedTarget: TargetProfile | null;
  targetIntel: { isComplete: boolean; percent: number; hasSurname?: boolean; hasFace?: boolean; hasFirstName?: boolean } | null;
  routine?: { place: L10n; window: TimeWindow };
  hasShinigamiEyes?: boolean;
  splitInfo: { surname: string; firstName: string; full: string } | null;
  onClearTarget: () => void;
  onAppendShard: (shard: string) => void;
  onInscribeFull: (name: string) => void;
}) {
  const { lang, tx } = useLang();

  if (!selectedTarget) {
    return (
      <div className="no-target-banner">
        <HelpCircle size={18} />
        <div className="no-target-text">
          <b>{lang === 'ar' ? 'لم تختر أي هدف بعد!' : 'No target selected yet!'}</b>
          <span>
            {lang === 'ar'
              ? 'اضغط على بطاقة أي مجرم من السجل أعلاه لتثبيت صورته واسمه فوراً في الدفتر.'
              : 'Tap any target dossier card above to bind their face and name to the ledger.'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="pinned-target-card">
      <div className="pinned-target-header">
        <div className="pinned-badge">
          <UserCheck size={14} />
          <span>{lang === 'ar' ? 'الهدف المختار قيد الحكم:' : 'Selected Target for Verdict:'}</span>
        </div>
        <button
          type="button"
          className="btn-clear-target"
          onClick={onClearTarget}
          title={lang === 'ar' ? 'إلغاء التحديد واختيار شخص آخر' : 'Deselect target'}
        >
          <X size={14} /> {lang === 'ar' ? 'إلغاء التحديد' : 'Clear'}
        </button>
      </div>

      <div className="pinned-target-content">
        <div className="pinned-photo-frame">
          <FaceCard faceId={selectedTarget.faceId} size={64} active />
          <span className="photo-pin-clip">📎</span>
        </div>

        <div className="pinned-info">
          <div className="pinned-name-row">
            <h3 className="pinned-name">{selectedTarget.name[lang]}</h3>
            <span className={`pinned-intel-badge ${targetIntel?.isComplete ? 'complete' : 'gathering'}`}>
              {targetIntel?.isComplete
                ? (lang === 'ar' ? '✨ الهوية مكشوفة 100%' : '✨ 100% Unmasked')
                : (lang === 'ar' ? `🔍 التحري: ${targetIntel?.percent ?? 0}%` : `🔍 Intel: ${targetIntel?.percent ?? 0}%`)}
            </span>
          </div>

          <div className="pinned-meta-tags">
            <span className="tag-title">{selectedTarget.title[lang]}</span>
            <span className="tag-sector">{REGION_NAME[selectedTarget.region][lang]}</span>
            <span className="tag-precinct">{tx(selectedTarget.precinct)}</span>
          </div>

          <p className="pinned-routine-detail">
            {routine ? (
              <span>
                📍 <b>{lang === 'ar' ? 'الموقع المعتاد:' : 'Location:'}</b> {tx(routine.place)} (
                {routine.window.from}:00 – {routine.window.to}:00)
              </span>
            ) : (
              <span className="routine-hint">
                💡 {lang === 'ar' ? 'روتين الحادث غير معروف بعد (ابحث في كاميرات المراقبة)' : 'Routine unknown for accident (check CCTV)'}
              </span>
            )}
          </p>

          {/* If Dossier is Complete: Name Shards Palette for thrilling inscription! */}
          {targetIntel?.isComplete && splitInfo && (
            <div className="name-shards-panel">
              <div className="shards-header">
                <Sparkles size={13} className="gold-sparkle" />
                <b>{lang === 'ar' ? 'شظايا الاسم المكتشفة (انقر للتدوين بالريشة أو اكتب بيدك أدناه):' : 'Discovered Name Shards (Tap to inscribe or type below):'}</b>
              </div>
              <div className="shards-buttons-row">
                <button
                  type="button"
                  className="btn-shard"
                  onClick={() => onAppendShard(splitInfo.surname)}
                  title={lang === 'ar' ? 'تدوين اللقب بالريشة' : 'Inscribe surname with nib'}
                >
                  <PenTool size={12} />
                  <span>{lang === 'ar' ? `اللقب: [ ${splitInfo.surname} ]` : `Surname: [ ${splitInfo.surname} ]`}</span>
                </button>
                <button
                  type="button"
                  className="btn-shard"
                  onClick={() => onAppendShard(splitInfo.firstName)}
                  title={lang === 'ar' ? 'تدوين الاسم الأول بالريشة' : 'Inscribe first name with nib'}
                >
                  <PenTool size={12} />
                  <span>{lang === 'ar' ? `الاسم: [ ${splitInfo.firstName} ]` : `First: [ ${splitInfo.firstName} ]`}</span>
                </button>
                <button
                  type="button"
                  className="btn-shard btn-shard-full"
                  onClick={() => onInscribeFull(selectedTarget.name[lang])}
                  title={lang === 'ar' ? 'تدوين الاسم بالكامل دفعة واحدة بالريشة' : 'Inscribe full name with nib'}
                >
                  <Flame size={12} />
                  <span>{lang === 'ar' ? `🩸 الاسم الكامل: [ ${selectedTarget.name[lang]} ]` : `🩸 Full: [ ${selectedTarget.name[lang]} ]`}</span>
                </button>
              </div>
            </div>
          )}

          {/* If Dossier is Incomplete: Warning & Guidance */}
          {!targetIntel?.isComplete && !hasShinigamiEyes && (
            <div className="incomplete-dossier-warning">
              <div className="warning-title">
                <AlertTriangle size={13} />
                <b>{lang === 'ar' ? `⚠️ ملف التحري غير مكتمل (${targetIntel?.percent ?? 0}%)` : `⚠️ Dossier Incomplete (${targetIntel?.percent ?? 0}%)`}</b>
              </div>
              <p className="warning-text">
                {lang === 'ar'
                  ? 'لن يستجيب دفتر الموت ما لم تكتمل الهوية (اللقب، صورة الوجه، والروتين):'
                  : 'Death Note will not take effect without a complete identity:'}
              </p>
              <div className="missing-clues-list">
                {!targetIntel?.hasSurname && (
                  <span className="missing-tag">📰 {lang === 'ar' ? 'اللقب مفقود (راجع الأخبار)' : 'Surname missing'}</span>
                )}
                {!targetIntel?.hasFace && (
                  <span className="missing-tag">📷 {lang === 'ar' ? 'صورة الوجه مفقودة (ملفات الشرطة)' : 'Face missing'}</span>
                )}
                {!targetIntel?.hasFirstName && (
                  <span className="missing-tag">📡 {lang === 'ar' ? 'الروتين مفقود (كاميرات المراقبة)' : 'Routine missing'}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
