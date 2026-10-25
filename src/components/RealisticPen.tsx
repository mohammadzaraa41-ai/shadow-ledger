export function RealisticPen({ phase }: { phase: 'slash1' | 'slash2' | 'slash3' | 'finish' }) {
  return (
    <div className={`real-pen-wrapper ${phase}`}>
      {/* Dynamic Pen Drop-Shadow on Paper */}
      <div className="real-pen-shadow" />

      {/* High-Fidelity Mastermind Fountain Pen with Anime Hand */}
      <svg
        viewBox="0 0 280 360"
        className="real-pen-svg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          {/* Obsidian Glossy Lacquer Barrel Gradient */}
          <linearGradient id="barrelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2c2d36" />
            <stop offset="25%" stopColor="#121319" />
            <stop offset="42%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="52%" stopColor="#0a0a0d" />
            <stop offset="85%" stopColor="#040406" />
            <stop offset="100%" stopColor="#1f2029" />
          </linearGradient>

          {/* 24K Gold Trim & Engravings */}
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffe07a" />
            <stop offset="30%" stopColor="#df9f2e" />
            <stop offset="55%" stopColor="#fff6c4" />
            <stop offset="80%" stopColor="#8c5809" />
            <stop offset="100%" stopColor="#ffd454" />
          </linearGradient>

          {/* Rhodium Silver Mirror Nib Inlay */}
          <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#eaeff3" />
            <stop offset="35%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#8291a0" />
            <stop offset="100%" stopColor="#d3dde6" />
          </linearGradient>

          {/* Grip Section Metal */}
          <linearGradient id="gripGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1a1b22" />
            <stop offset="35%" stopColor="#3d404f" />
            <stop offset="65%" stopColor="#0f1014" />
            <stop offset="100%" stopColor="#22232c" />
          </linearGradient>

          {/* Anime Hand Skin Gradient */}
          <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff2e2" />
            <stop offset="40%" stopColor="#f4d4b8" />
            <stop offset="75%" stopColor="#dca885" />
            <stop offset="100%" stopColor="#b37652" />
          </linearGradient>

          {/* Dark Charcoal Uniform Jacket Sleeve */}
          <linearGradient id="sleeveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2c2d38" />
            <stop offset="45%" stopColor="#14151c" />
            <stop offset="85%" stopColor="#08080c" />
            <stop offset="100%" stopColor="#1c1d26" />
          </linearGradient>

          {/* Nib Glow filter */}
          <filter id="nibGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ========================================================
            1. THE FOUNTAIN PEN BODY
            Nib Tip lands at exact coordinate (38, 332)
           ======================================================== */}
        <g id="pen-chassis" filter="drop-shadow(4px 6px 10px rgba(0,0,0,0.75))">
          {/* Main Upper Pen Barrel (Extending toward top-right) */}
          <path
            d="M 125 78 L 245 -42 L 275 -12 L 155 108 Z"
            fill="url(#barrelGrad)"
          />

          {/* Gold Pocket Clip along the barrel */}
          <path
            d="M 230 -25 L 140 65 C 135 70 142 75 145 72 L 235 -18 Z"
            fill="url(#goldGrad)"
          />

          {/* Triple Gold Filigree Rings */}
          <polygon points="120,83 148,111 142,117 114,89" fill="url(#goldGrad)" />
          <polygon points="112,91 140,119 137,122 109,94" fill="#4d3205" />
          <polygon points="107,96 135,124 130,129 102,101" fill="url(#goldGrad)" />

          {/* Ergonomic Contoured Grip Section */}
          <path
            d="M 116 87 L 76 178 C 73 195 66 220 54 246 L 80 272 C 108 260 134 252 150 250 L 146 117 Z"
            fill="url(#gripGrad)"
          />

          {/* Gold Nib Collar Ring */}
          <polygon points="54,246 80,272 74,278 48,252" fill="url(#goldGrad)" />

          {/* ========================================================
              2. THE 18K TWO-TONE GOTHIC FOUNTAIN PEN NIB
             ======================================================== */}
          {/* Gold Outer Flanges */}
          <path
            d="M 48 252 
               C 44 272 38 300 38 332 
               C 70 328 100 320 118 314 
               L 74 278 Z"
            fill="url(#goldGrad)"
          />

          {/* Rhodium Silver Center Mirror Inlay */}
          <path
            d="M 54 258 
               C 50 276 43 302 38 332 
               C 69 324 94 315 104 306 
               L 70 276 Z"
            fill="url(#silverGrad)"
            opacity="0.95"
          />

          {/* Heart-Shaped Breather Hole */}
          <circle cx="62" cy="298" r="3.5" fill="#060608" />
          <polygon points="60,299 64,299 62,304" fill="#060608" />

          {/* Nib Slit running from breather hole to writing tip */}
          <line
            x1="62"
            y1="302"
            x2="38"
            y2="332"
            stroke="#060608"
            strokeWidth="1.4"
            strokeLinecap="round"
          />

          {/* Intricate Filigree Scrollwork Engraving */}
          <path
            d="M 50 268 Q 48 285 43 308"
            stroke="#9e6812"
            strokeWidth="0.9"
            fill="none"
          />
          <path
            d="M 66 268 Q 82 284 94 306"
            stroke="#9e6812"
            strokeWidth="0.9"
            fill="none"
          />

          {/* Iridium Tipping Bead at absolute tip (38, 332) */}
          <ellipse
            cx="38"
            cy="332"
            rx="2.5"
            ry="3.2"
            fill="#ffffff"
            stroke="#9ba5af"
            strokeWidth="0.8"
          />

          {/* Wet black ink bead shining at the nib */}
          <circle cx="39" cy="331" r="3.8" fill="#040406" opacity="0.95" />
          <circle cx="40" cy="330" r="1.2" fill="#ffffff" opacity="0.85" />
        </g>

        {/* ========================================================
            3. ANIME MASTERMIND HAND (Light Yagami Style Grip)
           ======================================================== */}
        <g id="mastermind-hand" filter="drop-shadow(4px 10px 14px rgba(0,0,0,0.55))">
          {/* Black Uniform Jacket Sleeve with natural folds */}
          <path
            d="M 195 40 
               C 215 65 240 85 280 100 
               L 280 -10 
               L 165 -10 
               C 175 10 185 25 195 40 Z"
            fill="url(#sleeveGrad)"
          />
          {/* Sleeve Crease highlight */}
          <path
            d="M 195 40 C 220 60 250 75 275 80"
            stroke="#3e404f"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Crisp White Shirt Cuff Edge */}
          <polygon points="188,44 200,56 190,66 178,54" fill="#f0f3f8" stroke="#d5dae2" strokeWidth="0.8" />

          {/* Hand Wrist & Palm */}
          <path
            d="M 182 56 
               C 162 82 150 112 145 138 
               L 185 174 
               C 202 142 214 100 220 70 Z"
            fill="url(#skinGrad)"
          />

          {/* Middle Finger resting under the barrel */}
          <path
            d="M 112 142 
               C 102 158 98 178 105 192 
               C 112 205 128 200 138 184 
               L 145 158 Z"
            fill="url(#skinGrad)"
          />
          <path d="M 100 178 C 104 186 112 188 116 186" stroke="#9e633d" strokeWidth="1" fill="none" />

          {/* Index Finger firmly pressing down on the section */}
          <path
            d="M 150 120 
               C 138 142 125 172 112 198 
               C 104 212 92 208 88 196 
               C 82 180 98 148 122 122 Z"
            fill="url(#skinGrad)"
          />
          {/* Tense white knuckle highlight */}
          <ellipse cx="128" cy="146" rx="6" ry="4" fill="#fff5ec" opacity="0.65" transform="rotate(-32 128 146)" />
          {/* Index Fingernail */}
          <path d="M 92 194 C 95 190 102 191 104 196" stroke="#ffffff" strokeWidth="1.2" fill="none" opacity="0.8" />

          {/* Curved Thumb wrapping over the grip */}
          <path
            d="M 172 96 
               C 155 108 132 122 122 134 
               C 112 145 118 158 128 155 
               C 145 152 166 132 182 116 Z"
            fill="url(#skinGrad)"
          />
          {/* Thumb knuckle & nail */}
          <ellipse cx="132" cy="144" rx="5" ry="3" fill="#fffaee" opacity="0.75" />
          <path d="M 120 138 C 122 134 128 136 130 140" stroke="#a46a44" strokeWidth="1" fill="none" />
        </g>

        {/* Dynamic Specular Sparkle at Nib Tip (Flashing during strikes) */}
        <g className="pen-nib-sparkle" transform="translate(38, 332)">
          <circle cx="0" cy="0" r="7" fill="#e0303f" opacity="0.7" filter="url(#nibGlow)" />
          <polygon points="0,-14 3.5,-3.5 14,0 3.5,3.5 0,14 -3.5,3.5 -14,0 -3.5,-3.5" fill="#ffffff" />
        </g>
      </svg>
    </div>
  );
}
