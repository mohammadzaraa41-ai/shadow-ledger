import { useEffect, useState } from 'react';

interface Props {
  x: number;
  y: number;
  isWriting: boolean;
  isExecuting: boolean;
  isRtl?: boolean;
}

export function InteractiveDeathNotePen({ x, y, isWriting, isExecuting, isRtl = true }: Props) {
  const [scribbleOffset, setScribbleOffset] = useState({ rot: 0, dy: 0 });

  useEffect(() => {
    if (!isWriting && !isExecuting) {
      setScribbleOffset({ rot: 0, dy: 0 });
      return;
    }
    const interval = setInterval(() => {
      setScribbleOffset({
        rot: (Math.random() - 0.5) * 3.5,
        dy: (Math.random() - 0.5) * 1.5,
      });
    }, 45);
    return () => clearInterval(interval);
  }, [isWriting, isExecuting]);

  return (
    <div
      className="dn-interactive-pen"
      style={{
        transform: `translate3d(${x}px, ${y}px, 0px)`,
      }}
      aria-hidden="true"
    >
      <div
        className={`dn-pen-chassis ${isWriting ? 'writing' : ''} ${isExecuting ? 'executing' : ''}`}
        style={{
          transform: `rotate(${scribbleOffset.rot}deg) translateY(${scribbleOffset.dy}px)`,
        }}
      >
        {/* Contact Shadow under the nib tip on the paper */}
        <div className="pen-contact-shadow" />

        {/* Dynamic Wet Ink Stream Emerging from Nib Tip (at x:0, y:32) */}
        {(isWriting || isExecuting) && (
          <svg className="dn-ink-stream-svg" viewBox="-120 -20 240 80">
            <defs>
              <filter id="dnInkGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000000" floodOpacity="0.8" />
              </filter>
            </defs>
            <g filter="url(#dnInkGlow)">
              {/* Ink ribbon flowing back into the typed letters */}
              <path
                d={
                  isRtl
                    ? 'M 0 32 C 15 33, 40 31, 75 32 S 110 33, 140 32'
                    : 'M 0 32 C -15 33, -40 31, -75 32 S -110 33, -140 32'
                }
                stroke="#040407"
                strokeWidth="4"
                strokeLinecap="round"
                className="dn-ink-stream-line"
              />
              <path
                d={
                  isRtl
                    ? 'M 0 32 C 15 32.5, 35 31.8, 60 32'
                    : 'M 0 32 C -15 32.5, -35 31.8, -60 32'
                }
                stroke="#000000"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              {/* Dynamic flying ink micro-droplets escaping the scratching nib */}
              <circle cx={isRtl ? 18 : -18} cy="29" r="1.8" fill="#040407" className="dn-ink-spatter-1" />
              <circle cx={isRtl ? 38 : -38} cy="35" r="1.4" fill="#040407" className="dn-ink-spatter-2" />
              <circle cx={isRtl ? 62 : -62} cy="30" r="1.1" fill="#040407" className="dn-ink-spatter-3" />
            </g>

            {/* Violent Execution Slash Burst */}
            {isExecuting && (
              <g className="dn-slash-burst">
                <path d="M -50 20 L 70 44" stroke="#e0303f" strokeWidth="4.5" strokeLinecap="round" opacity="0.8" />
                <path d="M -40 22 L 60 42" stroke="#050508" strokeWidth="5.5" strokeLinecap="round" />
                <circle cx="0" cy="32" r="4.5" fill="#e0303f" />
              </g>
            )}
          </svg>
        )}

        {/* AUTHENTIC DEATH NOTE ANIME HAND & PEN SPRITE */}
        <img
          src="/death_note_anime_hand_master.png"
          alt="Death Note Writing Hand"
          className="dn-anime-hand-img"
          draggable={false}
        />
      </div>
    </div>
  );
}

