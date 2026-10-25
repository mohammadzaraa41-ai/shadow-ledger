import { useEffect, useState } from 'react';
import { AlertTriangle, Clock, ShieldAlert, Sparkles, X } from 'lucide-react';
import { sensoryAudio } from '../game/audioEngine';
import { FaceCard } from './shared';
import type { Region } from '../game/types';
import { REGION_NAME } from '../game/data';
import { useLang } from '../i18n';

interface LindBroadcastModalProps {
  region: Region;
  countdownSec?: number;
  onExecute: () => void;
  onIgnore: () => void;
}

export function LindBroadcastModal({
  region,
  countdownSec = 45,
  onExecute,
  onIgnore,
}: LindBroadcastModalProps) {
  const { lang } = useLang();
  const isRtl = lang === 'ar';
  const [timeLeft, setTimeLeft] = useState(countdownSec);
  const [stage, setStage] = useState<'BROADCAST' | 'KILLED_STING' | 'IGNORED'>('BROADCAST');

  useEffect(() => {
    sensoryAudio.playEmergencyBroadcastSting();

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setStage('IGNORED');
          setTimeout(() => onIgnore(), 2000);
          return 0;
        }
        if (prev % 5 === 0) {
          sensoryAudio.playClockTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onIgnore]);

  const handleWriteName = () => {
    sensoryAudio.playThunder();
    setStage('KILLED_STING');
    sensoryAudio.playScrambledVoice(
      isRtl
        ? 'ذلك لم يكن أنا.. كان ذلك مجرماً محكوماً بالإعدام سراً! وبقتلك له، أثبتت وجودك وحددت قطاعك بدقة يا كيرا!'
        : 'That was not me.. that was a condemned death row convict! By killing him, you proved your existence and exact sector, Kira!'
    );

    setTimeout(() => {
      onExecute();
    }, 4500);
  };

  const handleIgnore = () => {
    setStage('IGNORED');
    setTimeout(() => {
      onIgnore();
    }, 1200);
  };

  return (
    <div className="modal-overlay emergency-overlay" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="lind-broadcast-card">
        {/* Top Emergency Flash Tape */}
        <div className="emergency-tape">
          <AlertTriangle size={15} />
          <span>{isRtl ? '🚨 بث تلفزيوني طارئ وفوري — هيئة الإذاعة الدولية (ICPO)' : '🚨 BREAKING NEWS EMERGENCY BROADCAST — ICPO SPECIAL'}</span>
          <AlertTriangle size={15} />
        </div>

        {stage === 'BROADCAST' && (
          <div className="lind-broadcast-body">
            <div className="broadcast-headline-row">
              <h2>{isRtl ? 'المحقق L يظهر للعالم لأول مرة ويتحدى KIRA!' : 'Detective L reveals himself to challenge KIRA!'}</h2>
              <div className="broadcast-timer-badge">
                <Clock size={14} className="pulse-icon" />
                <span>00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</span>
              </div>
            </div>

            <p className="broadcast-region-scope">
              {isRtl
                ? `📺 يتم البث حالياً بشكل حي ومباشر في: قطاع ${REGION_NAME[region].ar}`
                : `📺 Live broadcast exclusive to sector: ${REGION_NAME[region].en}`}
            </p>

            {/* Video Monitor Frame */}
            <div className="broadcast-monitor-frame">
              <div className="monitor-tv-noise" />
              <div className="monitor-speaker-badge">
                <span className="live-dot" />
                <span>{isRtl ? 'بث مباشر — استوديو العاصمة' : 'LIVE — Tokyo Studio'}</span>
              </div>

              <div className="monitor-actor-row">
                <FaceCard faceId="f-lind" size={105} active />
                <div className="monitor-speech-quote">
                  <div className="quote-speaker-title">{isRtl ? 'ليند إل. تايلور (يزعم أنه المحقق L):' : 'Lind L. Tailor (Claims to be L):'}</div>
                  <blockquote>
                    {isRtl
                      ? '«أنا هو L.. القاتل KIRA، لقد أزهقت أرواح الكثيرين مدعياً أنك إله العدالة! إن كنت حقاً قادراً على القتل عن بُعد وبلا لمس، فأنا جالس أمامك الآن على الهواء مباشرة.. اقتلني الآن إن استطعت!»'
                      : '«I am L.. Killer KIRA, you have slain countless lives claiming to be a god of justice! If you can truly kill at a distance without touching, I am sitting right before you on live TV.. kill me now if you can!»'}
                  </blockquote>
                </div>
              </div>
            </div>

            {/* Mind Game Tactical Choices for Light */}
            <div className="broadcast-action-bar">
              <button
                type="button"
                className="btn-emergency-execute"
                onClick={handleWriteName}
              >
                {isRtl ? '✍️ تدوين اسم (ليند إل. تايلور) في الدفتر فوراً!' : '✍️ Write "Lind L. Tailor" in Ledger Now!'}
              </button>
              <button
                type="button"
                className="btn-emergency-ignore"
                onClick={handleIgnore}
              >
                {isRtl ? '🧠 تمالك النفس وتجاهل البث (أعلم أنه فخ استدراج!)' : '🧠 Maintain Composure & Ignore (It is a sting!)'}
              </button>
            </div>
          </div>
        )}

        {stage === 'KILLED_STING' && (
          <div className="lind-sting-reveal">
            <div className="gothic-l-emblem">L</div>
            <h3>{isRtl ? '🚨 لقد وقعت في الفخ التكتيكي للمحقق L!' : '🚨 You walked straight into L’s tactical trap!'}</h3>
            <p className="sting-explanation">
              {isRtl
                ? '«ذلك الشخص لم يكن أنا.. بل مجرم محكوم بالإعدام سراً تم بثه حصرياً في قطاعك! وبقتلك له في هذه اللحظة، أثبتت أنك قادر على القتل عن بُعد، وحددت موقعك السكني بدقة!»'
                : '«That man was not me.. but a condemned death-row convict broadcast solely to your sector! By killing him now, you proved you can kill at a distance, and revealed your exact location!»'}
            </p>
            <div className="sting-suspicion-spike">
              <span>{isRtl ? 'قفزة الشبهة الإقليمية:' : 'Regional Suspicion Spike:'}</span>
              <b>+45% ⚠️ (95% الشبهة الإجمالية)</b>
            </div>
          </div>
        )}

        {stage === 'IGNORED' && (
          <div className="lind-ignored-reveal">
            <ShieldAlert size={42} className="shield-safe-icon" />
            <h3>{isRtl ? 'قرار ذكي! تم تفادي الفخ الاستدراجي بنجاح' : 'Wise Move! Trap Successfully Avoided'}</h3>
            <p>
              {isRtl
                ? 'تمالكت أعصابك ولم تبتلع الطُعم.. لم يتمكن المحقق L من حصر قطاعك، وانخفضت الشبهة بنسبة 5% بفضل هدوءك التكتيكي.'
                : 'You kept your cool and refused the bait.. L failed to pinpoint your sector, reducing suspicion by 5%.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
