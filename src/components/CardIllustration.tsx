import { useId } from 'react';
import type { ArcadeCard } from '../game/arcadeData';

interface Props {
  card: ArcadeCard;
  size?: 'md' | 'lg';
}

interface VisualTheme {
  bg1: string;
  bg2: string;
  accent: string;
  badge?: string;
  subIcon?: string;
  shirtColor?: string;
  shirtStripe?: string;
  number?: string;
}

function getCardTheme(card: ArcadeCard): VisualTheme {
  const name = card.en.toLowerCase();

  // Football stars with iconic kits & numbers
  if (name.includes('ronaldo')) {
    return { bg1: '#1e3a8a', bg2: '#facc15', accent: '#fde047', shirtColor: '#facc15', shirtStripe: '#1e40af', number: '7', subIcon: '⚽👑' };
  }
  if (name.includes('messi')) {
    return { bg1: '#0284c7', bg2: '#1e293b', accent: '#38bdf8', shirtColor: '#38bdf8', shirtStripe: '#ffffff', number: '10', subIcon: '🏆🇦🇷' };
  }
  if (name.includes('salah')) {
    return { bg1: '#991b1b', bg2: '#450a0a', accent: '#fca5a5', shirtColor: '#dc2626', shirtStripe: '#ffffff', number: '11', subIcon: '⚽👑' };
  }
  if (name.includes('mbapp')) {
    return { bg1: '#1e1b4b', bg2: '#1d4ed8', accent: '#93c5fd', shirtColor: '#ffffff', shirtStripe: '#eab308', number: '9', subIcon: '⚡⚽' };
  }
  if (name.includes('dawsari')) {
    return { bg1: '#065f46', bg2: '#1e3a8a', accent: '#34d399', shirtColor: '#1d4ed8', shirtStripe: '#ffffff', number: '10', subIcon: '🌪️🇸🇦' };
  }
  if (name.includes('bounou')) {
    return { bg1: '#7f1d1d', bg2: '#064e3b', accent: '#4ade80', shirtColor: '#16a34a', shirtStripe: '#dc2626', number: '1', subIcon: '🧤🇲🇦' };
  }
  if (name.includes('neymar')) {
    return { bg1: '#ca8a04', bg2: '#15803d', accent: '#fef08a', shirtColor: '#facc15', shirtStripe: '#16a34a', number: '10', subIcon: '🇧🇷⚽' };
  }
  if (name.includes('zidane')) {
    return { bg1: '#1e3a8a', bg2: '#0f172a', accent: '#e2e8f0', shirtColor: '#1d4ed8', shirtStripe: '#ef4444', number: '5', subIcon: '🎯⚽' };
  }

  // Superheroes & Global Movies
  if (name.includes('spider')) {
    return { bg1: '#b91c1c', bg2: '#1d4ed8', accent: '#93c5fd', badge: 'MARVEL', subIcon: '🕸️🏙️' };
  }
  if (name.includes('batman')) {
    return { bg1: '#0f172a', bg2: '#334155', accent: '#facc15', badge: 'GOTHAM', subIcon: '🦇🌙' };
  }
  if (name.includes('joker')) {
    return { bg1: '#581c87', bg2: '#14532d', accent: '#4ade80', badge: 'HA HA!', subIcon: '🃏🎭' };
  }
  if (name.includes('superman')) {
    return { bg1: '#1d4ed8', bg2: '#b91c1c', accent: '#facc15', badge: 'S', subIcon: '🦸‍♂️⚡' };
  }
  if (name.includes('iron man')) {
    return { bg1: '#991b1b', bg2: '#ca8a04', accent: '#fef08a', badge: 'ARK', subIcon: '🤖🚀' };
  }
  if (name.includes('harry potter')) {
    return { bg1: '#451a03', bg2: '#7f1d1d', accent: '#fbbf24', badge: '⚡', subIcon: '👓🪄' };
  }

  // Category-based vibrant palettes
  switch (card.cat) {
    case 'sports':
      return { bg1: '#065f46', bg2: '#064e3b', accent: '#34d399', subIcon: '🏟️🏆' };
    case 'ar_movies':
      return { bg1: '#7c2d12', bg2: '#431407', accent: '#fbbf24', subIcon: '🎬🌟' };
    case 'en_movies':
      return { bg1: '#1e1b4b', bg2: '#311042', accent: '#f472b6', subIcon: '🍿🎥' };
    case 'cartoon':
      return { bg1: '#0369a1', bg2: '#4c1d95', accent: '#fde047', subIcon: '✨📺' };
    case 'animals':
      return { bg1: '#14532d', bg2: '#064e3b', accent: '#86efac', subIcon: '🌿🐾' };
    case 'food':
      return { bg1: '#9a3412', bg2: '#7c2d12', accent: '#fde047', subIcon: '🍽️🔥' };
    default:
      return { bg1: '#4c1d95', bg2: '#1e1b4b', accent: '#ffd23f', subIcon: '🎭✨' };
  }
}

/**
 * Renders an illustrated SVG character / poster portrait card
 * so every card has a rich visual character picture that scales crisply on any screen.
 */
export function CardIllustration({ card, size = 'lg' }: Props) {
  const theme = getCardTheme(card);
  const gradId = useId();

  return (
    <div className={`card-portrait card-portrait-${size}`}>
      <svg
        viewBox="0 0 260 190"
        className="card-portrait-svg"
        role="img"
        aria-label={card.ar}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={theme.bg1} />
            <stop offset="100%" stopColor={theme.bg2} />
          </linearGradient>
          <radialGradient id={`spotlight-${gradId}`} cx="50%" cy="42%" r="55%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.28)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>

        {/* Poster Background */}
        <rect x="4" y="4" width="252" height="182" rx="26" fill={`url(#${gradId})`} stroke={theme.accent} strokeWidth="4" />
        <rect x="4" y="4" width="252" height="182" rx="26" fill={`url(#spotlight-${gradId})`} />

        {/* Decorative Stage Rays / Halos */}
        <circle cx="130" cy="88" r="64" fill="rgba(255,255,255,0.08)" stroke={theme.accent} strokeDasharray="6 6" strokeWidth="2" />
        <circle cx="130" cy="88" r="48" fill="rgba(0,0,0,0.22)" />

        {/* If player has an iconic sports jersey, draw the illustrated jersey & number */}
        {theme.shirtColor ? (
          <g transform="translate(80, 74)">
            {/* Illustrated Jersey Shoulders & Torso */}
            <path
              d="M20,10 L35,4 L65,4 L80,10 L94,32 L78,44 L72,30 L72,88 L28,88 L28,30 L22,44 L6,32 Z"
              fill={theme.shirtColor}
              stroke="#ffffff"
              strokeWidth="2.5"
            />
            {/* Jersey Collar */}
            <path d="M37,5 Q50,18 63,5" fill="none" stroke={theme.shirtStripe} strokeWidth="4" />
            {/* Jersey Number */}
            <text
              x="50"
              y="66"
              textAnchor="middle"
              fill={theme.shirtStripe}
              fontSize="34"
              fontWeight="900"
              fontFamily="sans-serif"
            >
              {theme.number}
            </text>
            {/* Character Head Portrait Above Jersey */}
            <circle cx="50" cy="-14" r="24" fill="#fde68a" stroke="#fff" strokeWidth="2.5" />
            <text x="50" y="-4" textAnchor="middle" fontSize="30">
              {card.emoji}
            </text>
          </g>
        ) : (
          /* Illustrated Character Bust & Main Visual Icon */
          <g>
            {/* Character Shoulders Silhouette */}
            <path
              d="M78,162 C78,126 182,126 182,162 Z"
              fill="rgba(255,255,255,0.14)"
              stroke={theme.accent}
              strokeWidth="2"
            />
            {/* Main Illustrated Figure / Emoji Centerpiece */}
            <text x="130" y="112" textAnchor="middle" fontSize="78">
              {card.emoji}
            </text>
          </g>
        )}

        {/* Corner Studio Badges */}
        {theme.subIcon && (
          <text x="28" y="38" fontSize="22">
            {theme.subIcon}
          </text>
        )}
        {theme.badge && (
          <g transform="translate(185, 16)">
            <rect x="0" y="0" width="58" height="24" rx="12" fill={theme.accent} />
            <text x="29" y="17" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="900">
              {theme.badge}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

