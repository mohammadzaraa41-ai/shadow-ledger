import { useEffect, useState } from 'react';
import { Activity, Award, Crosshair, FileText, Shield } from 'lucide-react';
import { sensoryAudio } from '../game/audioEngine';
import { DECOY_NAMES, REGION_NAME } from '../game/data';
import { unlockDetectiveMedal } from '../game/detectiveMedals';
import { multiplayer } from '../game/multiplayer';
import type { Action, GameState } from '../game/store';
import type { Region } from '../game/types';
import { useLang } from '../i18n';
import { DetectiveMedalsModal, DetectiveMedalToast } from './DetectiveMedalsModal';
import { DetectiveDossiersTab } from './detective/DetectiveDossiersTab';
import { DetectiveRadarTab } from './detective/DetectiveRadarTab';
import { DetectiveSignalsTab } from './detective/DetectiveSignalsTab';
import { InterrogationModal } from './detective/InterrogationModal';

export function DetectiveConsole({
  state,
  dispatch,
  detectiveName,
  killerName,
  onLaunchLindBroadcast,
}: {
  state: GameState;
  dispatch: (a: Action) => void;
  detectiveName: string;
  killerName: string;
  onPenWrite?: (name: string) => void;
  onLaunchLindBroadcast?: (region: Region) => void;
}) {
  const { lang } = useLang();
  const isRtl = lang === 'ar';
  const d = state.deduction;

  const [activeTab, setActiveTab] = useState<'RADAR' | 'DOSSIERS' | 'SIGNALS'>('RADAR');
  const [selRegion, setSelRegion] = useState<Region>('CENTRAL');
  const [decoySuccessMsg, setDecoySuccessMsg] = useState<string | null>(null);
  const [isLindBroadcasting, setIsLindBroadcasting] = useState(false);
  const [lindCountdown, setLindCountdown] = useState(0);
  const [showMedalsModal, setShowMedalsModal] = useState(false);
  const [showInterrogationModal, setShowInterrogationModal] = useState(false);

  // Track and award Detective Medals dynamically
  useEffect(() => {
    // Sector Encirclement
    (['NORTH', 'WEST', 'EAST', 'SOUTH', 'CENTRAL'] as Region[]).forEach((r) => {
      if ((d.geoBelief[r] || 0) >= 0.75) {
        unlockDetectiveMedal('MEDAL_SECTOR_ENCIRCLE');
      }
    });

    // Schedule Cracking
    if (d.notes.length >= 2 || state.player.suspicion >= 50) {
      unlockDetectiveMedal('MEDAL_SCHEDULE_CRACK');
    }
  }, [d.geoBelief, d.notes, state.player.suspicion]);

  useEffect(() => {
    const unsub = multiplayer.onMessage((msg) => {
      if (msg.type === 'LIND_L_RESOLVE') {
        setIsLindBroadcasting(false);
        if (msg.wasKilled) {
          sensoryAudio.playThunder();
          sensoryAudio.playScrambledVoice(
            isRtl
              ? 'لقد وقعت في الفخ التكتيكي يا كيرا! حددت منطقتك بدقة!'
              : 'You fell right into my trap, Kira! Your sector is pinpointed!'
          );
          unlockDetectiveMedal('MEDAL_LIND_TRAP');
          setDecoySuccessMsg(
            isRtl
              ? `🚨 سقط الطُعم! القاتل نفذ حكمه في ليند إل. تايلور على الهواء! تم تأكيد وجود ${killerName} في قطاع ${REGION_NAME[selRegion].ar} بدقة!`
              : `🚨 Bait taken! Killer executed Lind L. Tailor! ${killerName} confirmed in ${REGION_NAME[selRegion].en}!`
          );
        } else {
          setDecoySuccessMsg(
            isRtl
              ? 'انتهى البث دون تفاعل.. القاتل كان حذراً وتفادى الفخ أو لا يقطن في هذا القطاع.'
              : 'Broadcast expired with no hit.. Killer avoided the trap or resides elsewhere.'
          );
        }
      }
    });
    return () => unsub();
  }, [selRegion, killerName, isRtl]);

  const handlePlantDecoy = () => {
    sensoryAudio.playRadioStatic(2.0);
    const randomDecoyName = DECOY_NAMES[Math.floor(Math.random() * DECOY_NAMES.length)];
    multiplayer.send({
      type: 'PLANT_DECOY',
      region: selRegion,
      fakeName: randomDecoyName[lang],
    });

    dispatch({
      type: 'PLANT_DECOY_TARGET',
      region: selRegion,
      fakeName: randomDecoyName,
    });

    unlockDetectiveMedal('MEDAL_DECOY_HOOK');

    setDecoySuccessMsg(
      isRtl
        ? `تم بث طُعم تلفزيوني باسم "${randomDecoyName.ar}" حصرياً في قطاع ${REGION_NAME[selRegion].ar}!`
        : `Decoy broadcast for "${randomDecoyName.en}" deployed to ${REGION_NAME[selRegion].en}!`,
    );

    setTimeout(() => setDecoySuccessMsg(null), 4000);
  };

  const handleDeployCamera = () => {
    sensoryAudio.playCctvSwitch();
    dispatch({ type: 'DEPLOY_CAMERAS', region: selRegion });
    multiplayer.send({
      type: 'DEPLOY_CAMERA',
      region: selRegion,
    });
    setDecoySuccessMsg(
      isRtl
        ? `📷 تم زرع كاميرات المراقبة بالرؤية الليلية والتنصت المنزلي في قطاع ${REGION_NAME[selRegion].ar}!`
        : `📷 Secret Bedroom Wiretaps & CCTV active in ${REGION_NAME[selRegion].en}!`,
    );
    setTimeout(() => setDecoySuccessMsg(null), 4000);
  };

  const handleToggleBlackout = () => {
    sensoryAudio.playRadioStatic(0.7);
    dispatch({ type: 'MEDIA_BLACKOUT', region: selRegion });
    const isNowBlackedOut = !state.mediaBlackoutRegions?.includes(selRegion);
    setDecoySuccessMsg(
      isRtl
        ? (isNowBlackedOut ? `📡 تم فرض التعتيم الإعلامي وحظر نشر الأخبار في قطاع ${REGION_NAME[selRegion].ar}!` : `📡 تم رفع التعتيم الإعلامي عن قطاع ${REGION_NAME[selRegion].ar}`)
        : (isNowBlackedOut ? `📡 Media Blackout imposed on ${REGION_NAME[selRegion].en}!` : `📡 Media Blackout lifted on ${REGION_NAME[selRegion].en}`),
    );
    setTimeout(() => setDecoySuccessMsg(null), 4000);
  };

  const handleInterrogationAccuse = (_suspectId: string) => {
    setShowInterrogationModal(false);
    handleIssueArrest();
  };

  const handleLaunchLindBroadcast = () => {
    sensoryAudio.playEmergencyBroadcastSting();
    setIsLindBroadcasting(true);
    setLindCountdown(45);

    multiplayer.send({
      type: 'LIND_L_BROADCAST',
      region: selRegion,
      decoyName: 'ليند إل. تايلور (Lind L. Tailor)',
      timerSec: 45,
    });

    if (onLaunchLindBroadcast) {
      onLaunchLindBroadcast(selRegion);
    }

    setDecoySuccessMsg(
      isRtl
        ? `📺 جاري الآن بث تحدي Lind L. Tailor الحي حصرياً في قطاع ${REGION_NAME[selRegion].ar} (45 ثانية)!`
        : `📺 Lind L. Tailor live sting broadcast active in ${REGION_NAME[selRegion].en} (45s)!`,
    );

    const timer = setInterval(() => {
      setLindCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsLindBroadcasting(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleIssueArrest = () => {
    sensoryAudio.playThunder();
    multiplayer.send({
      type: 'ARREST_WARRANT',
      region: selRegion,
    });

    if (state.player.homeRegion === selRegion) {
      unlockDetectiveMedal('MEDAL_CHECKMATE');
      dispatch({ type: 'SET_GAME_STATUS', status: 'WON' });
      setDecoySuccessMsg(
        isRtl
          ? `🚨 كش ملك! مداهمة ناجحة! تم تطويق منزل ${killerName} وإلقاء القبض عليه متلبساً! انتصر المحقق واستعاد العدالة!`
          : `🚨 Checkmate! Raid successful! ${killerName} arrested red-handed! Detective triumph!`
      );
    } else {
      setDecoySuccessMsg(
        isRtl
          ? `❌ المداهمة في قطاع ${REGION_NAME[selRegion].ar} باءت بالفشل! المشتبه به ليس هناك، وفقدت الشرطة مصداقيتها!`
          : `❌ Raid failed! Suspect is not in this sector!`
      );
    }
  };

  return (
    <section className="detective-console-v2" dir={isRtl ? 'rtl' : 'ltr'}>
      <DetectiveMedalToast />
      <div className="crt-scanline-overlay" />

      {/* Command Header */}
      <header className="detective-v2-header">
        <div className="task-force-identity">
          <div className="gothic-l-avatar">Σ</div>
          <div className="task-force-text">
            <div className="task-force-org-title">
              <Shield size={13} className="shield-icon" />
              <span>SPECIAL TASK FORCE // INVESTIGATION COMMAND</span>
            </div>
            <h2 className="detective-full-title">{detectiveName}</h2>
          </div>
        </div>

        <div className="task-force-status-cluster">
          <button
            type="button"
            className="btn-open-medals"
            onClick={() => {
              sensoryAudio.playKeystroke();
              setShowMedalsModal(true);
            }}
          >
            <Award size={15} />
            <span>{isRtl ? 'أوسمة وإنجازات المحقق' : 'Medals & Commendations'}</span>
          </button>

          <div className="suspicion-tracker-box">
            <span className="suspicion-label">{isRtl ? 'مؤشر ثبوت تهمة KIRA:' : 'KIRA Proof Index:'}</span>
            <div className="suspicion-hud-bar">
              <i style={{ width: `${state.player.suspicion}%` }} />
              <b>{state.player.suspicion}%</b>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="detective-v2-nav">
        <button
          className={`nav-v2-btn ${activeTab === 'RADAR' ? 'active' : ''}`}
          onClick={() => {
            sensoryAudio.playKeystroke();
            setActiveTab('RADAR');
          }}
        >
          <Crosshair size={14} />
          <span>{isRtl ? 'رادار التحري الإقليمي' : 'Tactical Radar'}</span>
        </button>
        <button
          className={`nav-v2-btn ${activeTab === 'DOSSIERS' ? 'active' : ''}`}
          onClick={() => {
            sensoryAudio.playKeystroke();
            setActiveTab('DOSSIERS');
          }}
        >
          <FileText size={14} />
          <span>{isRtl ? 'سجل ملفات الأهداف والمشتبه بهم' : 'Suspect Dossiers'}</span>
          <span className="count-pill">{state.targets.length}</span>
        </button>
        <button
          className={`nav-v2-btn ${activeTab === 'SIGNALS' ? 'active' : ''}`}
          onClick={() => {
            sensoryAudio.playKeystroke();
            setActiveTab('SIGNALS');
          }}
        >
          <Activity size={14} />
          <span>{isRtl ? 'مرصد الإشارات ورصد التنصت' : 'Signal Oscilloscope'}</span>
        </button>
      </nav>

      {/* Tab Views */}
      {activeTab === 'RADAR' && (
        <DetectiveRadarTab
          state={state}
          selRegion={selRegion}
          setSelRegion={setSelRegion}
          killerName={killerName}
          decoySuccessMsg={decoySuccessMsg}
          isLindBroadcasting={isLindBroadcasting}
          lindCountdown={lindCountdown}
          onPlantDecoy={handlePlantDecoy}
          onDeployCamera={handleDeployCamera}
          onToggleBlackout={handleToggleBlackout}
          onOpenInterrogation={() => setShowInterrogationModal(true)}
          onLaunchLindBroadcast={handleLaunchLindBroadcast}
          onIssueArrest={handleIssueArrest}
        />
      )}

      {activeTab === 'DOSSIERS' && (
        <DetectiveDossiersTab state={state} />
      )}

      {activeTab === 'SIGNALS' && (
        <DetectiveSignalsTab state={state} />
      )}

      {showMedalsModal && (
        <DetectiveMedalsModal onClose={() => setShowMedalsModal(false)} />
      )}

      {showInterrogationModal && (
        <InterrogationModal
          region={selRegion}
          isKillerInRegion={state.player.homeRegion === selRegion}
          onClose={() => setShowInterrogationModal(false)}
          onAccuse={handleInterrogationAccuse}
        />
      )}
    </section>
  );
}
