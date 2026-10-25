import type { ReactElement } from 'react';
import { Camera, Newspaper, Radio, ShieldAlert } from 'lucide-react';
import { REGION_NAME } from '../game/data';
import type { Channel, NewsItem, Text } from '../game/types';
import { useLang } from '../i18n';

const FACE_INDEX: Record<string, number> = {
  'f-c1': 0, 'f-c2': 1, 'f-c3': 2,
  'f-k1': 3, 'f-k2': 4, 'f-k3': 5,
  'f-d1': 6, 'f-lind': 7,
  'f-c4': 0, 'f-k4': 3, 'f-fbi': 1,
  'f-k5': 2, 'f-k6': 5, 'f-c5': 8,
  'f-c6': 1, 'f-k7': 4, 'f-k8': 6,
  'f-c7': 0, 'f-fbi2': 7,
};

function spriteIndex(faceId: string) {
  if (faceId in FACE_INDEX) return FACE_INDEX[faceId];
  const h = [...faceId].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  return (h % 8); // fallback
}

/** Anime ID-photo from a 3x3 sprite sheet (public/faces_grid.jpg). */
export function FaceCard({ faceId, caption, size = 84, active, onClick }: {
  faceId: string; caption?: Text; size?: number; active?: boolean; onClick?: () => void;
}) {
  const { t, tx } = useLang();
  const isL = faceId === 'f-L';
  const i = spriteIndex(faceId);
  const style = isL
    ? { backgroundImage: 'url(/detective_avatar.jpg)', backgroundSize: 'cover', backgroundPosition: 'center 20%' }
    : { backgroundImage: 'url(/faces_grid.jpg)', backgroundSize: '300% 300%', backgroundPosition: `${(i % 3) * 50}% ${Math.floor(i / 3) * 50}%` };
  return (
    <button className={`face ${active ? 'on' : ''}`} onClick={onClick} aria-label={t('face.default')}>
      <i className="tape" />
      <span className="photo" style={{ width: size, height: size, ...style }} />
      <span className="face-id">{caption ? tx(caption) : t('face.default')}</span>
    </button>
  );
}

export const CH_ICON: Record<Channel, ReactElement> = {
  NEWS: <Newspaper size={14} />,
  POLICE: <ShieldAlert size={14} />,
  CAMERA: <Camera size={14} />,
  WIRETAP: <Radio size={14} />,
};

export function useScopeTag() {
  const { t, lang } = useLang();
  return (i: NewsItem) =>
    i.scope === 'NATIONAL' ? t('scope.national') : t('scope.local', { r: i.region ? REGION_NAME[i.region][lang] : '' });
}

export function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <button className="lang-btn" id="btn-lang" onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} aria-label="Language">
      {lang === 'ar' ? 'EN' : 'عربي'}
    </button>
  );
}
