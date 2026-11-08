import { Capacitor } from '@capacitor/core';
import { AdMob, type AdOptions, type RewardAdOptions } from '@capacitor-community/admob';

/**
 * AdMob Configuration (iOS & Android)
 * Replace the IDs below with your production AdMob Unit IDs from Google AdMob Console.
 */
export const ADMOB_CONFIG = {
  ios: {
    appId: 'ca-app-pub-9742462967769652~9984075802',
    rewarded: 'ca-app-pub-9742462967769652/7077664684',
    interstitial: '',
  },
  android: {
    appId: 'ca-app-pub-9742462967769652~9984075802',
    rewarded: 'ca-app-pub-9742462967769652/7077664684',
    interstitial: '',
  },
  isTesting: false,
};

let initialized = false;

export async function initAds(): Promise<void> {
  if (initialized || !Capacitor.isNativePlatform()) return;
  try {
    await AdMob.initialize();
    if (Capacitor.getPlatform() === 'ios') {
      try {
        const status = await AdMob.trackingAuthorizationStatus();
        if (status.status === 'notDetermined') {
          await AdMob.requestTrackingAuthorization();
        }
      } catch {
        // Safe fallback if tracking authorization is denied or unavailable
      }
    }
    initialized = true;
  } catch {
    // Safe fallback if offline or blocked
  }
}

/**
 * Shows a Rewarded Video Ad to unlock a locked category.
 * If the user is offline, on web, or AdMob hasn't served an ad yet (e.g. during review),
 * it gracefully grants the reward so the user is NEVER stuck or rejected by Apple Review.
 */
export async function showRewardedUnlockAd(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return true;
  try {
    await initAds();
    const platform = Capacitor.getPlatform() === 'android' ? 'android' : 'ios';
    const options: RewardAdOptions = {
      adId: ADMOB_CONFIG[platform].rewarded,
      isTesting: ADMOB_CONFIG.isTesting,
    };
    await AdMob.prepareRewardVideoAd(options);
    await AdMob.showRewardVideoAd();
    return true;
  } catch {
    // Graceful fallback so Apple reviewers or offline players can still unlock the category
    return true;
  }
}

/**
 * Shows a quick Interstitial Ad between rounds.
 * Never blocks navigation if offline or unavailable.
 */
export async function showRoundInterstitialAd(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try {
    const platform = Capacitor.getPlatform() === 'android' ? 'android' : 'ios';
    const adId = ADMOB_CONFIG[platform].interstitial;
    if (!adId) return;
    await initAds();
    const options: AdOptions = {
      adId,
      isTesting: ADMOB_CONFIG.isTesting,
    };
    await AdMob.prepareInterstitial(options);
    await AdMob.showInterstitial();
  } catch {
    // Ignore errors silently so game flow continues smoothly
  }
}

