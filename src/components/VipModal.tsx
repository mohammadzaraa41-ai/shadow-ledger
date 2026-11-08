import { useState } from 'react';
import { buyRemoveAds, isVipUnlocked, restoreVipPurchases } from '../game/purchase';
import { fireConfetti } from '../game/confetti';
import { sound } from '../game/sound';
import { useLang } from '../i18n';

interface Props {
  onSuccess?: () => void;
  onClose: () => void;
}

export function VipModal({ onSuccess, onClose }: Props) {
  const { t } = useLang();
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const isAlreadyVip = isVipUnlocked();

  const handleBuy = async () => {
    setLoading(true);
    sound.tap();
    const res = await buyRemoveAds();
    setLoading(false);
    if (res.success) {
      sound.win();
      fireConfetti(3000);
      setStatusMsg(t('vip.successMsg'));
      onSuccess?.();
    } else {
      setStatusMsg(t('vip.failMsg'));
    }
  };

  const handleRestore = async () => {
    setLoading(true);
    sound.tap();
    const res = await restoreVipPurchases();
    setLoading(false);
    if (res.restored) {
      sound.win();
      fireConfetti(2500);
      setStatusMsg(t('vip.restoredMsg'));
      onSuccess?.();
    } else {
      setStatusMsg(t('vip.noPurchasesMsg'));
    }
  };

  return (
    <div className="overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="sheet center-text vip-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="vip-crown-icon">👑</div>
        <h2 className="sheet-title vip-title">{t('vip.title')}</h2>
        <p className="vip-sub">{t('vip.sub')}</p>

        <div className="vip-perks-list">
          <div className="vip-perk-item">
            <span>🚫</span>
            <div>
              <b>{t('vip.perk1Title')}</b>
              <small>{t('vip.perk1Sub')}</small>
            </div>
          </div>
          <div className="vip-perk-item">
            <span>🔓</span>
            <div>
              <b>{t('vip.perk2Title')}</b>
              <small>{t('vip.perk2Sub')}</small>
            </div>
          </div>
          <div className="vip-perk-item">
            <span>⚡</span>
            <div>
              <b>{t('vip.perk3Title')}</b>
              <small>{t('vip.perk3Sub')}</small>
            </div>
          </div>
        </div>

        {statusMsg && <div className="vip-status-banner animate-pop">{statusMsg}</div>}

        <div className="stack" style={{ marginTop: 8 }}>
          {!isAlreadyVip ? (
            <button
              type="button"
              className="btn btn-accent btn-xl vip-buy-btn"
              disabled={loading}
              onClick={handleBuy}
            >
              {loading ? t('vip.loading') : t('vip.buyBtn')}
            </button>
          ) : (
            <div className="vip-status-banner">✅ {t('vip.alreadyActive')}</div>
          )}

          <button
            type="button"
            className="btn btn-ghost btn-sm"
            disabled={loading}
            onClick={handleRestore}
          >
            {t('vip.restoreBtn')}
          </button>

          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              sound.tap();
              onClose();
            }}
          >
            {t('setup.unlockCancel')}
          </button>
        </div>
      </div>
    </div>
  );
}

