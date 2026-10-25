import { useState } from 'react';
import { FileText, X } from 'lucide-react';
import { REGION_NAME } from '../../game/data';
import type { GameState } from '../../game/store';
import type { DeathRecord, TargetProfile } from '../../game/types';
import { useLang } from '../../i18n';
import { FaceCard } from '../shared';

export function DetectiveDossiersTab({
  state,
}: {
  state: GameState;
}) {
  const { lang, tx } = useLang();
  const isRtl = lang === 'ar';
  const [selectedTargetDossier, setSelectedTargetDossier] = useState<TargetProfile | null>(null);

  return (
    <div className="detective-panel dossiers-view-panel">
      <div className="panel-header">
        <FileText size={15} />
        <h3>{isRtl ? 'قاعدة بيانات المستهدفين والتقارير الجنائية (National Criminal Registry)' : 'National Criminal Registry & Forensic Autopsies'}</h3>
      </div>

      <div className="dossiers-grid-wrapper">
        {state.targets.map((tgt: TargetProfile) => {
          const isDead = !tgt.alive;
          const deathRecord = state.records.find((r: DeathRecord) => r.targetId === tgt.id);
          return (
            <div
              key={tgt.id}
              className={`dossier-target-card ${isDead ? 'dead-target' : 'active-target'} ${tgt.priority === 'DETECTIVE' ? 'is-l-card' : ''}`}
              onClick={() => setSelectedTargetDossier(tgt)}
            >
              <div className="dossier-card-top">
                <span className="dossier-id-code">ID: #{tgt.id.toUpperCase()}</span>
                <span className={`status-pill ${isDead ? 'dead' : 'alive'}`}>
                  {isDead ? (isRtl ? '☠️ متوفى (سقط)' : '☠️ Deceased') : isRtl ? '🟢 على قيد الحياة' : '🟢 Alive'}
                </span>
              </div>

              <b className="dossier-name">{tgt.name[lang]}</b>
              <span className="dossier-role">{tgt.title[lang]}</span>
              <span className="dossier-region">{REGION_NAME[tgt.region][lang]}</span>

              {isDead && deathRecord && (
                <div className="death-autopsy-badge">
                  <small>{isRtl ? `سبب الوفاة: ${deathRecord.method}` : `Cause: ${deathRecord.method}`}</small>
                  <small>{isRtl ? `اليوم ${deathRecord.day} // الساعة ${deathRecord.hour}:00` : `Day ${deathRecord.day} // ${deathRecord.hour}:00`}</small>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Target Detail Modal */}
      {selectedTargetDossier && (
        <div className="modal-overlay" onClick={() => setSelectedTargetDossier(null)}>
          <div className="dossier-modal-card" onClick={(e) => e.stopPropagation()} dir={isRtl ? 'rtl' : 'ltr'}>
            <header className="modal-card-header">
              <b>{isRtl ? 'ملف التحقيق الجنائي الشامل' : 'Full Forensic Dossier'}</b>
              <button className="btn-close-modal" onClick={() => setSelectedTargetDossier(null)}>
                <X size={18} />
              </button>
            </header>
            <div className="modal-card-body">
              <div className="dossier-identity-row">
                <FaceCard faceId={selectedTargetDossier.faceId} size={70} active />
                <div className="dossier-main-meta">
                  <h3>{selectedTargetDossier.name[lang]}</h3>
                  <p>{selectedTargetDossier.title[lang]}</p>
                  <span className="meta-tag">{REGION_NAME[selectedTargetDossier.region][lang]}</span>
                  <span className="meta-tag">{tx(selectedTargetDossier.precinct)}</span>
                </div>
              </div>

              <div className="dossier-details-table">
                <div className="detail-row">
                  <span>{isRtl ? 'الحالة الحيوية:' : 'Vital Status:'}</span>
                  <b className={selectedTargetDossier.alive ? 'alive' : 'dead'}>
                    {selectedTargetDossier.alive ? (isRtl ? 'على قيد الحياة' : 'Alive') : isRtl ? 'متوفى ☠️' : 'Deceased ☠️'}
                  </b>
                </div>
                <div className="detail-row">
                  <span>{isRtl ? 'تصنيف الأولوية:' : 'Priority Class:'}</span>
                  <b>{selectedTargetDossier.priority}</b>
                </div>
                <div className="detail-row">
                  <span>{isRtl ? 'الروتين المعتاد:' : 'Usual Routine:'}</span>
                  <span>{tx(selectedTargetDossier.routine.place)} ({selectedTargetDossier.routine.window.from}:00 - {selectedTargetDossier.routine.window.to}:00)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
