import { useEffect, useState } from 'react';
import { sound } from '../game/sound';
import type { Player, Round } from '../game/types';
import { useLang } from '../i18n';

interface Props {
  round: Round;
  players: Player[];
  votesMap: Record<number, number>;
  accusedId: number;
  onDone: () => void;
}

export function DramaticVoteReveal({
  players,
  votesMap,
  accusedId,
  onDone,
}: Props) {
  const { t } = useLang();
  const voterEntries = Object.entries(votesMap).map(([voterId, targetId]) => ({
    voter: players.find((p) => p.id === Number(voterId)),
    target: players.find((p) => p.id === targetId),
  }));

  const [revealedCount, setRevealedCount] = useState(0);
  const [showVerdict, setShowVerdict] = useState(false);

  const topAccused = players.find((p) => p.id === accusedId);
  const totalVotesOnAccused = Object.values(votesMap).filter((id) => id === accusedId).length;

  useEffect(() => {
    // Reveal votes one by one with a heartbeat sound
    const interval = setInterval(() => {
      setRevealedCount((prev) => {
        if (prev < voterEntries.length) {
          sound.heartbeat();
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 700);

    return () => clearInterval(interval);
  }, [voterEntries.length]);

  useEffect(() => {
    if (revealedCount === voterEntries.length && voterEntries.length > 0) {
      const timer = setTimeout(() => {
        sound.siren();
        setShowVerdict(true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [revealedCount, voterEntries.length]);

  return (
    <div className="screen center dramatic-reveal-screen">
      <h2 className="screen-title">{t('vote.tallyTitle')}</h2>
      <p className="muted">{t('vote.tallySub')}</p>

      <div className="dramatic-votes-list">
        {voterEntries.slice(0, revealedCount).map((entry, idx) => {
          if (!entry.voter || !entry.target) return null;
          return (
            <div key={idx} className="dramatic-vote-item animate-pop">
              <span className="voter-tag">
                {entry.voter.avatar} {entry.voter.name}
              </span>
              <span className="vote-arrow-icon">🗳️ ➔</span>
              <span className="target-tag">
                {entry.target.avatar} {entry.target.name}
              </span>
            </div>
          );
        })}
      </div>

      {showVerdict && topAccused && (
        <div className="dramatic-verdict-card animate-zoom">
          <small className="verdict-kicker">{t('vote.topAccusedKicker')}</small>
          <div className="verdict-avatar">{topAccused.avatar}</div>
          <h2 className="verdict-name">{topAccused.name}</h2>
          <span className="verdict-badge">
            {t('vote.votesCountBadge', { count: totalVotesOnAccused })}
          </span>

          <button
            type="button"
            className="btn btn-danger btn-xl"
            style={{ marginTop: 14 }}
            onClick={() => {
              sound.tap();
              onDone();
            }}
          >
            {t('vote.proceedToVerdict')}
          </button>
        </div>
      )}
    </div>
  );
}

