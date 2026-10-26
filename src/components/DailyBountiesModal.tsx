import { Award, Calendar, CheckCircle2, Clock, Crosshair, Flame, MapPin, ShieldAlert, Sparkles, X } from 'lucide-react';
import { sensoryAudio } from '../game/audioEngine';
import {
  claimBountyReward,
  getBountyProgress,
  getTodayBounty,
  type BountyProgressState,
  type DailyBounty,
} from '../game/bounties';
import { REGION_NAME } from '../game/data';
import { useLang } from '../i18n';
import { useState } from 'react';

export function DailyBountiesModal({
  isOpen,
  onClose,
  onTrackTarget,
}: {
  isOpen: boolean;
  onClose: () => void;
  onTrackTarget?: (bounty: DailyBounty) => void;
}) {
  const { lang } = useLang();
  const isRtl = lang === 'ar';
  const todayBounty = getTodayBounty();
  const [bountyState, setBountyState] = useState<BountyProgressState>(() => getBountyProgress());

  if (!isOpen) return null;

  const isClaimed = Boolean(bountyState.completedBounties[todayBounty.id]);

  const handleClaim = () => {
    sensoryAudio.playLetterScratch();
    sensoryAudio.playThunder();
    const updated = claimBountyReward(todayBounty.id, todayBounty.bountyXP, bountyState);
    setBountyState(updated);
  };

  const getRankBadgeTitle = (rank: BountyProgressState['hunterRank']) => {
    switch (rank) {
      case 'GOD_OF_DEATH':
        return isRtl ? '👑 إله الموت الأسطوري (God of Death)' : '👑 Legendary God of Death';
      case 'SHADOW_REAPER':
        return isRtl ? '⚡ حاصد الظلال الخبير (Shadow Reaper)' : '⚡ Shadow Reaper Elite';
      case 'VIGILANTE':
        return isRtl ? '🗡️ محقق عدالة مستقل (Vigilante)' : '🗡️ Vigilante Hunter';
      case 'NOVICE':
      default:
        return isRtl ? '🌱 مستجد الظل (Novice Seeker)' : '🌱 Novice Seeker';
    }
  };

  return (
    <div className="bounty-modal-overlay" onClick={onClose} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="bounty-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="crt-scanline-overlay" />

        {/* Modal Header */}
        <header className="bounty-modal-header">
          <div className="bounty-header-title-row">
            <Crosshair size={22} className="bounty-crosshair-icon" />
            <div>
              <h3>{isRtl ? 'عقود الإعدام اليومية المتجددة' : 'Daily Retribution Bounties'}</h3>
              <p>{isRtl ? 'مطلوب جنائي هارب جديد كل 24 ساعة لاختبار مهاراتك' : 'A fresh high-profile fugitive contract every 24 hours'}</p>
            </div>
          </div>
          <button
            type="button"
            className="btn-close-bounty-modal"
            onClick={() => {
              sensoryAudio.playKeystroke();
              onClose();
            }}
          >
            <X size={18} />
          </button>
        </header>

        {/* Hunter Status Banner */}
        <div className="hunter-profile-banner">
          <div className="hunter-rank-group">
            <span className="hunter-rank-label">{isRtl ? 'رتبتك الحالية في سجل الظل:' : 'Current Hunter Rank:'}</span>
            <b className="hunter-rank-val">{getRankBadgeTitle(bountyState.hunterRank)}</b>
          </div>
          <div className="hunter-xp-badge">
            <Sparkles size={13} />
            <span>{bountyState.totalHunterXP} XP</span>
          </div>
        </div>

        {/* Today's Contract Card */}
        <div className="bounty-contract-card">
          <div className="contract-header">
            <div className="contract-date-tag">
              <Calendar size={12} />
              <span>{isRtl ? `عقد تاريخ اليوم: ${todayBounty.dateKey}` : `Contract Date: ${todayBounty.dateKey}`}</span>
            </div>
            <span className="contract-reward-pill">
              +{todayBounty.bountyXP} XP
            </span>
          </div>

          <div className="contract-body">
            <div className="contract-photo-slot">
              <span className="bounty-photo-glyph">👤</span>
              <span className="bounty-target-alias">"{todayBounty.alias[lang]}"</span>
            </div>

            <div className="contract-intel">
              <h4 className="bounty-name">{todayBounty.name[lang]}</h4>
              <p className="bounty-crime">
                <b>{isRtl ? 'الجريمة المسجلة:' : 'Wanted for:'}</b> {todayBounty.crime[lang]}
              </p>

              <div className="bounty-meta-row">
                <span className="meta-item">
                  <MapPin size={11} /> {REGION_NAME[todayBounty.region][lang]} ({todayBounty.precinct[lang]})
                </span>
                <span className="meta-item">
                  <Clock size={11} /> {todayBounty.routine.window.from}:00 — {todayBounty.routine.window.to}:00
                </span>
              </div>

              <div className="bounty-clue-box">
                <span className="clue-tag">{isRtl ? 'خيط التحري السري:' : 'Intelligence Lead:'}</span>
                <p className="clue-text">{todayBounty.clue[lang]}</p>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="contract-footer">
            {isClaimed ? (
              <div className="contract-claimed-banner">
                <CheckCircle2 size={16} />
                <span>{isRtl ? 'تمت تصفية المطلوب والمطالبة بالمكافأة لليوم! ترقب العقد القادم غداً.' : 'Bounty executed & claimed! Check back tomorrow for the next contract.'}</span>
              </div>
            ) : (
              <div className="contract-actions-group">
                <button
                  type="button"
                  className="btn-track-bounty"
                  onClick={() => {
                    sensoryAudio.playKeystroke();
                    onTrackTarget?.(todayBounty);
                    onClose();
                  }}
                >
                  <Crosshair size={14} />
                  <span>{isRtl ? 'تتبع الهدف وتدوين اسمه في الدفتر' : 'Inscribe in Ledger'}</span>
                </button>
                <button
                  type="button"
                  className="btn-claim-bounty"
                  onClick={handleClaim}
                >
                  <Award size={14} />
                  <span>{isRtl ? 'المطالبة بـ 500 XP' : 'Claim 500 XP'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
