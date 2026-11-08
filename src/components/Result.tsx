import { useEffect, useMemo, useState } from 'react';
import { showRoundInterstitialAd } from '../game/ads';
import { fireConfetti } from '../game/confetti';
import { hostLine, speak } from '../game/host';
import { sound } from '../game/sound';
import type { Outcome, Player, Round, Settings } from '../game/types';
import { useLang } from '../i18n';
import { ArcadeModal } from './ArcadeModes';
import { PunishmentWheel } from './PunishmentWheel';

interface ResultProps {
  round: Round;
  players: Player[];
  losers: Player[];
  smartSurvivors?: Player[];
  votesMap?: Record<number, number>;
  outcome: Outcome;
  settings: Settings;
  onAgainSame: () => void;
  onChangeSetup: () => void;
  onHome: () => void;
}

export function Result({
  round,
  players,
  losers,
  smartSurvivors = [],
  votesMap = {},
  outcome,
  settings,
  onAgainSame,
  onChangeSetup,
  onHome,
}: ResultProps) {
  const { t, lang } = useLang();
  const [stage, setStage] = useState(0);
  const [wheelStartIdx, setWheelStartIdx] = useState<number | null>(null);
  const [redeemIdx, setRedeemIdx] = useState<number | null>(null);
  const [assignedDares, setAssignedDares] = useState<Record<number, string>>({});
  const [redeemedIds, setRedeemedIds] = useState<Record<number, boolean>>({});

  const names = (ids: number[]) => ids.map((id) => players.find((p) => p.id === id)?.name ?? '').join(' + ');
  const jesterName = round.jesterId != null ? players.find((p) => p.id === round.jesterId)?.name ?? '' : '';

  const line = useMemo(() => {
    switch (outcome) {
      case 'LIAR_LOST':
        return hostLine('liarLost', lang, names(round.liars));
      case 'GROUP_LOST_GUESSED':
        return hostLine('guessRight', lang);
      case 'GROUP_LOST_JESTER':
        return hostLine('jesterWin', lang, jesterName);
      case 'GROUP_LOST_ESCAPED':
      default:
        return hostLine('escaped', lang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    sound.drumroll();
    const a = setTimeout(() => {
      setStage(1);
      if (outcome === 'LIAR_LOST') {
        sound.win();
        fireConfetti(3000);
      } else if (outcome === 'GROUP_LOST_JESTER') {
        sound.jesterHorn();
      } else {
        sound.evilLaugh();
      }
    }, 1400);
    const b = setTimeout(() => {
      setStage(2);
      speak(line, lang, settings.voice);
    }, 2400);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const recordDare = (playerId: number, dareText: string) => {
    setAssignedDares((prev) => ({ ...prev, [playerId]: dareText }));
  };

  return (
    <div className="screen center">
      <p className="kicker">{round.liars.length > 1 ? t('res.liarsWere') : t('res.liarWas')}</p>

      <div className={`reveal-box ${stage >= 1 ? 'show' : ''}`}>
        {stage < 1 ? <span className="dots">• • •</span> : <h2 className="big-name">🤥 {names(round.liars)}</h2>}
      </div>

      {stage >= 2 && (
        <div className="result-details">
          <div className="word-reveal">
            {t('res.word')}: <b>{round.word[lang]}</b>
            {round.chaos === 'DECOY' && round.decoyWord && (
              <small>
                {' '}
                · {t('res.decoy')}: <b>{round.decoyWord[lang]}</b>
              </small>
            )}
          </div>

          {jesterName && <p className="muted small">{t('res.jesterWas', { name: jesterName })}</p>}

          <div className="host-bubble">🎙️ {line}</div>
          <p className="outcome outcome-alert">{t(`out.${outcome}`)}</p>

          {/* Vote Breakdown Panel: Who voted for whom? */}
          {Object.keys(votesMap).length > 0 && (
            <div className="votes-breakdown-panel">
              <h3>{t('res.votesHeader')}</h3>
              <div className="score-list">
                {players.map((voter) => {
                  const targetId = votesMap[voter.id];
                  const target = players.find((p) => p.id === targetId);
                  if (!target) return null;
                  const voterIsLiar = round.liars.includes(voter.id);
                  const hitLiar = !voterIsLiar && round.liars.includes(target.id);
                  return (
                    <div key={voter.id} className="vote-log-row">
                      <span className="vote-log-names">
                        <b>{voter.avatar} {voter.name}</b>
                        <span className="vote-arrow">⬅️</span>
                        <span>{target.avatar} {target.name}</span>
                      </span>
                      <span className={`delta ${voterIsLiar ? 'neutral' : hitLiar ? 'pos' : 'neg'}`}>
                        {voterIsLiar
                          ? t('res.voteBluff')
                          : hitLiar
                            ? t('res.voteHit')
                            : t('res.voteMiss')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Smart Survivors Exempted Panel */}
          {smartSurvivors.length > 0 && (
            <div className="survivors-panel">
              <h3>{t('res.survivorsHeader', { n: smartSurvivors.length })}</h3>
              <div className="chips center-chips">
                {smartSurvivors.map((s) => (
                  <span key={s.id} className="survivor-chip">
                    🛡️ {s.avatar} {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Party MVP Awards / Recap */}
          {(() => {
            const innocentSuspectCounts: Record<number, number> = {};
            for (const [, targetId] of Object.entries(votesMap)) {
              if (!round.liars.includes(targetId)) {
                innocentSuspectCounts[targetId] = (innocentSuspectCounts[targetId] ?? 0) + 1;
              }
            }
            let scapegoatId: number | null = null;
            let maxInnocentVotes = 0;
            for (const [idStr, count] of Object.entries(innocentSuspectCounts)) {
              if (count > maxInnocentVotes) {
                maxInnocentVotes = count;
                scapegoatId = Number(idStr);
              }
            }
            const scapegoat = scapegoatId !== null ? players.find((p) => p.id === scapegoatId) : null;
            const smartMvp = smartSurvivors.length > 0 ? smartSurvivors[0] : null;

            if (!smartMvp && !scapegoat) return null;

            return (
              <div className="party-awards-card">
                <h3>🏆 {t('res.awardsTitle')}</h3>
                <div className="awards-grid">
                  {smartMvp && (
                    <div className="award-item detective">
                      <span className="award-icon">🕵️‍♂️</span>
                      <div>
                        <b>{smartMvp.avatar} {smartMvp.name}</b>
                        <small>{t('res.awardDetectiveSub')}</small>
                      </div>
                    </div>
                  )}
                  {scapegoat && (
                    <div className="award-item victim">
                      <span className="award-icon">🥺</span>
                      <div>
                        <b>{scapegoat.avatar} {scapegoat.name}</b>
                        <small>{t('res.awardVictimSub')}</small>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          <div className="losers-panel">
            <h3>{t('res.losersHeader', { n: losers.length })}</h3>
            <div className="score-list">
              {losers.map((p, idx) => {
                const dare = assignedDares[p.id];
                const isRedeemed = redeemedIds[p.id];
                const isDone = Boolean(dare || isRedeemed);
                return (
                  <div
                    className="loser-row"
                    key={p.id}
                    onClick={() => {
                      sound.tap();
                      setWheelStartIdx(idx);
                    }}
                  >
                    <div className="loser-row-top">
                      <span className="avatar">{p.avatar ?? p.name.slice(0, 1).toUpperCase()}</span>
                      <span className="grow">{p.name}</span>
                      <span className={`delta ${isDone ? 'pos' : 'neg'}`}>
                        {isRedeemed
                          ? t('res.redeemedBadge')
                          : dare
                          ? t('res.punishedBadge')
                          : t('res.pendingBadge')}
                      </span>
                    </div>
                    {isRedeemed ? (
                      <p className="loser-dare-text">{t('res.redeemedText')}</p>
                    ) : (
                      dare && <p className="loser-dare-text">⚖️ {dare}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {(() => {
            const nextUnresolvedIdx = losers.findIndex((p) => !assignedDares[p.id] && !redeemedIds[p.id]);
            const targetIdx = nextUnresolvedIdx >= 0 ? nextUnresolvedIdx : 0;
            const targetPlayer = losers[targetIdx];
            return (
              <div className="stack">
                {targetPlayer && (
                  <button
                    type="button"
                    className="btn btn-redeem btn-xl"
                    onClick={() => {
                      sound.flip();
                      setRedeemIdx(targetIdx);
                    }}
                  >
                    {t('res.redeemBtn', { name: targetPlayer.name })}
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-accent btn-xl"
                  onClick={() => {
                    sound.tap();
                    setWheelStartIdx(targetIdx);
                  }}
                >
                  {t('res.wheelBtn')}
                </button>
              </div>
            );
          })()}

          <div className="stack">
            <button
              id="btn-next-round"
              className="btn btn-primary btn-xl"
              onClick={async () => {
                sound.flip();
                await showRoundInterstitialAd();
                onAgainSame();
              }}
            >
              {t('res.againSame')}
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => {
                sound.tap();
                onChangeSetup();
              }}
            >
              {t('res.changeSetup')}
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => {
                sound.tap();
                onHome();
              }}
            >
              {t('res.home')}
            </button>
          </div>
        </div>
      )}

      {redeemIdx !== null && losers[redeemIdx] && (
        <ArcadeModal
          initialMode="charades"
          isRedemption={true}
          playerName={losers[redeemIdx].name}
          onClose={() => setRedeemIdx(null)}
          onRedeemSuccess={() => {
            const p = losers[redeemIdx];
            if (p) {
              setRedeemedIds((prev) => ({ ...prev, [p.id]: true }));
              fireConfetti(2500);
            }
            setRedeemIdx(null);
          }}
          onRedeemFail={() => {
            const failedIdx = redeemIdx;
            setRedeemIdx(null);
            setWheelStartIdx(failedIdx);
          }}
        />
      )}

      {wheelStartIdx !== null && (
        <PunishmentWheel
          losers={losers}
          initialIdx={wheelStartIdx}
          onAssignDare={recordDare}
          onClose={() => setWheelStartIdx(null)}
        />
      )}
    </div>
  );
}
