import { useEffect, useState } from 'react';
import { Atmosphere } from './components/Atmosphere';
import { BreakingNewsTicker } from './components/BreakingNewsTicker';
import { DetectiveConsole } from './components/DetectiveConsole';
import { Ledger } from './components/Ledger';
import { LindBroadcastModal } from './components/LindBroadcastModal';
import { MorningTabloid } from './components/MorningTabloid';
import { MultiplayerModal } from './components/MultiplayerModal';
import { PsychologicalChat } from './components/PsychologicalChat';
import { SoloRoleModal } from './components/SoloRoleModal';
import { Splash } from './components/Splash';
import { StatusBar } from './components/StatusBar';
import { SteamHubModal, SteamOverlayToast } from './components/SteamOverlay';
import { Terminal } from './components/Terminal';
import { Tutorial } from './components/Tutorial';
import { sensoryAudio } from './game/audioEngine';
import { createKiraAI, executeKiraAITurn, type KiraMastermindState } from './game/kiraAI';
import { multiplayer, type ChatMessage, type PlayerRole } from './game/multiplayer';
import { unlockSteamAchievement } from './game/steam';
import type { Action } from './game/store';
import { useGame } from './game/store';
import type { Region } from './game/types';
import { useLang } from './i18n';

export default function App() {
  const { t, tx, lang } = useLang();
  const [state, dispatch] = useGame();
  const [started, setStarted] = useState(false);
  const [help, setHelp] = useState(false);
  const [showSteam, setShowSteam] = useState(false);
  const [showMultiplayer, setShowMultiplayer] = useState(false);
  const [showSoloRoleModal, setShowSoloRoleModal] = useState(false);
  const [kiraAIState, setKiraAIState] = useState<KiraMastermindState>(() => createKiraAI());

  const [activeLindBroadcast, setActiveLindBroadcast] = useState<{
    region: Region;
    timerSec: number;
  } | null>(null);

  const [multiplayerConfig, setMultiplayerConfig] = useState<{
    active: boolean;
    role: PlayerRole;
    myName: string;
    opponentName: string;
    roomCode: string;
  }>({
    active: false,
    role: 'KILLER',
    myName: 'قاضي الظل (The Shadow)',
    opponentName: 'المحقق سايفر (Detective Cipher)',
    roomCode: '',
  });

  const wrappedDispatch = (a: Action) => {
    dispatch(a);
    if (multiplayerConfig.active) {
      multiplayer.send({ type: 'ACTION', action: a });
    }
  };

  useEffect(() => {
    const unsub = multiplayer.onMessage((msg) => {
      if (msg.type === 'ACTION') {
        dispatch(msg.action);
      } else if (msg.type === 'LIND_L_BROADCAST') {
        setActiveLindBroadcast({
          region: msg.region,
          timerSec: msg.timerSec || 45,
        });
      }
    });
    return () => unsub();
  }, [dispatch]);

  const end = state.status !== 'PLAYING'
    ? multiplayerConfig.role === 'DETECTIVE'
      ? state.status === 'WON'
        ? {
            title: lang === 'ar' ? 'كش ملك.. انتصر المحقق L!' : 'Checkmate.. Detective L Triumphs!',
            desc: lang === 'ar' ? 'تم تطويق مقر كيرا السري ومصادرة الدفتر وإلقاء القبض عليه متلبساً!' : 'Kira raided, ledger seized, justice prevails!',
          }
        : {
            title: lang === 'ar' ? 'أفلت القاتل.. انتهت المهلة' : 'Kira Evaded Justice',
            desc: lang === 'ar' ? 'استطاع كيرا تصفية أهدافه بالكامل وتشتيت التحقيق.' : 'Kira purged the city and escaped Interpol.',
          }
      : { title: t(`end.${state.status}.t`), desc: t(`end.${state.status}.d`) }
    : null;

  const handleStartSoloRole = (chosenRole: PlayerRole) => {
    setShowSoloRoleModal(false);
    if (chosenRole === 'DETECTIVE') {
      const newKira = createKiraAI();
      setKiraAIState(newKira);
      setMultiplayerConfig({
        active: false,
        role: 'DETECTIVE',
        myName: lang === 'ar' ? 'المحقق L' : 'Detective L',
        opponentName: lang === 'ar' ? 'كيرا (KIRA AI)' : 'Kira (AI)',
        roomCode: '',
      });
    } else {
      setMultiplayerConfig({
        active: false,
        role: 'KILLER',
        myName: lang === 'ar' ? 'قاضي الظل (The Shadow)' : 'The Shadow',
        opponentName: lang === 'ar' ? 'المحقق سايفر (Detective Cipher)' : 'Detective Cipher',
        roomCode: '',
      });
    }
    setStarted(true);
    sensoryAudio.startRain();
    if (!localStorage.getItem('seenTutorial')) {
      setHelp(true);
      localStorage.setItem('seenTutorial', '1');
    }
  };

  const handleAdvanceDayForDetective = () => {
    sensoryAudio.playClockTick();
    sensoryAudio.playLetterScratch();

    const turnRes = executeKiraAITurn(state, kiraAIState, activeLindBroadcast?.region);

    if (turnRes.commands.length > 0) {
      dispatch({ type: 'DETECTIVE_ADVANCE_DAY', kiraCommands: turnRes.commands });
    } else {
      dispatch({ type: 'ADVANCE_HOUR' });
    }

    if (turnRes.lindKilled) {
      sensoryAudio.playThunder();
      sensoryAudio.playScrambledVoice(
        lang === 'ar'
          ? 'لقد وقعت في الفخ التكتيكي يا كيرا! حددت منطقتك بدقة!'
          : 'You fell right into my trap, Kira! Your sector is pinpointed!'
      );
      unlockSteamAchievement('ACH_OUTSMART_L');
      multiplayer.send({
        type: 'LIND_L_RESOLVE',
        wasKilled: true,
        killerRegion: kiraAIState.homeRegion,
      });
      setActiveLindBroadcast(null);
    }

    if (turnRes.taunt) {
      const chatMsg: ChatMessage = {
        id: `chat-kira-${Date.now()}`,
        senderName: multiplayerConfig.opponentName || 'كيرا (KIRA)',
        senderRole: 'KILLER',
        text: turnRes.taunt,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      multiplayer.send({ type: 'CHAT', message: chatMsg });
    }
  };

  const handleLaunchLindInSolo = (region: Region) => {
    setActiveLindBroadcast({ region, timerSec: 45 });
    if (!multiplayerConfig.active) {
      setTimeout(() => {
        if (region === kiraAIState.homeRegion) {
          sensoryAudio.playThunder();
          sensoryAudio.playScrambledVoice(
            lang === 'ar'
              ? 'لقد سقطت في الفخ التكتيكي يا كيرا! حددت منطقتك بدقة!'
              : 'You fell into the tactical trap, Kira!'
          );
          multiplayer.send({
            type: 'LIND_L_RESOLVE',
            wasKilled: true,
            killerRegion: kiraAIState.homeRegion,
          });
          setActiveLindBroadcast(null);
        } else {
          multiplayer.send({
            type: 'LIND_L_RESOLVE',
            wasKilled: false,
          });
          setActiveLindBroadcast(null);
        }
      }, 3000);
    }
  };

  useEffect(() => {
    if (state.status === 'WON') {
      if (state.player.suspicion <= 35) {
        unlockSteamAchievement('ACH_CLEAN_HANDS');
      }
    }
    if (state.player.suspicion === 0 && state.player.day > 1) {
      unlockSteamAchievement('ACH_GHOST');
    }
  }, [state.status, state.player.suspicion, state.player.day]);

  if (!started) {
    return (
      <div className="app">
        <Atmosphere suspicion={0} />
        <SteamOverlayToast />
        <Splash
          onStart={() => setShowSoloRoleModal(true)}
          onHowTo={() => setHelp(true)}
          onMultiplayer={() => setShowMultiplayer(true)}
        />
        {showSoloRoleModal && (
          <SoloRoleModal
            onSelectRole={handleStartSoloRole}
            onClose={() => setShowSoloRoleModal(false)}
          />
        )}
        {help && <Tutorial onClose={() => setHelp(false)} />}
        {showSteam && <SteamHubModal onClose={() => setShowSteam(false)} />}
        {showMultiplayer && (
          <MultiplayerModal
            onClose={() => setShowMultiplayer(false)}
            onStartGame={(role, myName, opponentName, roomCode) => {
              setMultiplayerConfig({
                active: true,
                role,
                myName,
                opponentName,
                roomCode,
              });
              setStarted(true);
              sensoryAudio.startRain();
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className={`app ${multiplayerConfig.role === 'DETECTIVE' ? 'role-detective' : 'role-killer'}`}>
      {/* Cinematic & Sensory Atmosphere */}
      <Atmosphere suspicion={state.player.suspicion} />

      {/* Steam Achievement Toast Notifications */}
      <SteamOverlayToast />

      {/* Status Bar with Sound & Steam Hub */}
      <StatusBar
        state={state}
        onAdvance={() => wrappedDispatch({ type: 'ADVANCE_HOUR' })}
        onEndDay={() => {
          if (multiplayerConfig.role === 'DETECTIVE' && !multiplayerConfig.active) {
            handleAdvanceDayForDetective();
          } else {
            wrappedDispatch({ type: 'END_DAY' });
          }
        }}
        onHelp={() => setHelp(true)}
        onOpenSteam={() => setShowSteam(true)}
        onOpenMultiplayer={() => setShowMultiplayer(true)}
      />

      {/* Live Breaking News Ticker Bar */}
      <BreakingNewsTicker state={state} lang={lang} />

      {multiplayerConfig.role === 'DETECTIVE' ? (
        /* Detective Command Center for L */
        <DetectiveConsole
          state={state}
          dispatch={wrappedDispatch}
          detectiveName={multiplayerConfig.myName}
          killerName={multiplayerConfig.opponentName}
          onLaunchLindBroadcast={handleLaunchLindInSolo}
        />
      ) : (
        /* The Death Ledger & Terminal for Killer / Kira */
        <>
          <Terminal state={state} dispatch={wrappedDispatch} />
          <Ledger state={state} dispatch={wrappedDispatch} />
        </>
      )}

      {/* Live Psychological Mind-Game Chat */}
      <PsychologicalChat
        myName={multiplayerConfig.myName}
        opponentName={multiplayerConfig.opponentName}
        myRole={multiplayerConfig.role}
      />

      {/* Morning Tabloid Breaking News Cutscene */}
      {state.report && !end && (
        <MorningTabloid
          report={state.report}
          targets={state.targets}
          onDismiss={() => wrappedDispatch({ type: 'DISMISS_REPORT' })}
        />
      )}

      {/* Game Over / Victory Screen */}
      {end && (
        <div className="overlay end" data-lang={lang}>
          <Splash ended={end} onStart={() => {}} onRestart={() => wrappedDispatch({ type: 'RESET' })} />
        </div>
      )}

      {/* Live Lind L. Tailor Sting Broadcast for Killer */}
      {activeLindBroadcast && multiplayerConfig.role === 'KILLER' && (
        <LindBroadcastModal
          region={activeLindBroadcast.region}
          countdownSec={activeLindBroadcast.timerSec}
          onExecute={() => {
            const lindTarget = state.targets.find((t) => t.id === 'lind-l-tailor');
            if (lindTarget) {
              wrappedDispatch({
                type: 'SUBMIT',
                input: {
                  name: lindTarget.name.ar,
                  faceTargetId: 'lind-l-tailor',
                  method: 'CARDIAC',
                },
              });
            }
            multiplayer.send({
              type: 'LIND_L_RESOLVE',
              wasKilled: true,
              killerRegion: state.player.homeRegion,
            });
            setActiveLindBroadcast(null);
          }}
          onIgnore={() => {
            multiplayer.send({
              type: 'LIND_L_RESOLVE',
              wasKilled: false,
            });
            setActiveLindBroadcast(null);
          }}
        />
      )}

      {/* Tutorial */}
      {help && <Tutorial onClose={() => setHelp(false)} />}

      {/* Steam Community Hub Modal */}
      {showSteam && <SteamHubModal onClose={() => setShowSteam(false)} />}

      {/* 1v1 Multiplayer Modal */}
      {showMultiplayer && (
        <MultiplayerModal
          onClose={() => setShowMultiplayer(false)}
          onStartGame={(role, myName, opponentName, roomCode) => {
            setMultiplayerConfig({
              active: true,
              role,
              myName,
              opponentName,
              roomCode,
            });
            setStarted(true);
            sensoryAudio.startRain();
          }}
        />
      )}
    </div>
  );
}
