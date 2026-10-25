import { useEffect, useState } from 'react';
import { sensoryAudio } from '../game/audioEngine';

interface Props {
  suspicion: number;
}

export function Atmosphere({ suspicion }: Props) {
  const [flashing, setFlashing] = useState(false);

  // Occasional random lightning flash
  useEffect(() => {
    const triggerLightning = () => {
      setFlashing(true);
      sensoryAudio.playThunder();
      setTimeout(() => setFlashing(false), 350);
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.65) {
        triggerLightning();
      }
    }, 18000);

    return () => clearInterval(interval);
  }, []);

  // Police sirens and heartbeat when suspicion is high
  useEffect(() => {
    if (suspicion >= 70) {
      sensoryAudio.startHeartbeat(110);
      sensoryAudio.playPoliceSiren();
    } else if (suspicion >= 40) {
      sensoryAudio.startHeartbeat(80);
    } else {
      sensoryAudio.stopHeartbeat();
    }
  }, [suspicion]);

  return (
    <div className={`atmosphere-container ${flashing ? 'lightning-active' : ''} ${suspicion >= 70 ? 'danger-siren' : ''}`}>
      {/* Rain droplets layer */}
      <div className="rain-canvas" aria-hidden="true">
        <div className="rain-streak s1" />
        <div className="rain-streak s2" />
        <div className="rain-streak s3" />
        <div className="rain-streak s4" />
      </div>

      {/* Desk lamp vignette and dark bedroom shadow */}
      <div className="room-vignette" />

      {/* Lightning flash overlay */}
      {flashing && <div className="lightning-overlay" />}

      {/* Police siren red pulse when in critical danger */}
      {suspicion >= 70 && <div className="police-siren-glow" />}
    </div>
  );
}
