import { useEffect, useRef, useState } from 'react';
import { MessageSquare, Radio, Send, Volume2, X } from 'lucide-react';
import { sensoryAudio } from '../game/audioEngine';
import { multiplayer, type ChatMessage } from '../game/multiplayer';
import { useLang } from '../i18n';

const KIRA_TAUNTS = [
  'ابحث عني إن استطعت.. العدالة أنا من يكتبها.',
  'كل فخاخك وبثوثك أراها قبل أن تنصبها يا L.',
  'أنت لست ندي.. لن تصل إلى هويتي أبداً.',
  'هذا العالم فاسد ويحتاج إلى قاضٍ ينزل العقاب الحتمي.',
  'راقب سجلك القادم.. ربما يكون اسمك هو التالي.',
];

export function PsychologicalChat({
  myName,
  opponentName,
  myRole,
}: {
  myName: string;
  opponentName: string;
  myRole: 'KILLER' | 'DETECTIVE';
}) {
  const { lang } = useLang();
  const isRtl = lang === 'ar';
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(() => [...multiplayer.state.chatMessages]);
  const streamEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial sync
    setMessages([...multiplayer.state.chatMessages]);

    // Live reactive subscription
    const unsub = multiplayer.onChat((msg, all) => {
      setMessages([...all]);
      if (msg.senderRole !== myRole) {
        sensoryAudio.playRadioStatic(0.6);
      }
    });

    return () => unsub();
  }, [myRole]);

  useEffect(() => {
    if (open) {
      streamEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, open]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend ?? input).trim();
    if (!text) return;

    sensoryAudio.playKeystroke();
    const msg: ChatMessage = {
      id: `chat-${Date.now()}-${Math.random()}`,
      senderName: myName,
      senderRole: myRole,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      hasAudioScramble: myRole === 'DETECTIVE',
    };

    multiplayer.send({ type: 'CHAT', message: msg });
    setInput('');
  };

  return (
    <>
      {/* Floating Trigger Bubble */}
      <button
        type="button"
        className="floating-chat-trigger"
        onClick={() => setOpen(true)}
        title={isRtl ? 'فتح شات الاستفزاز النفسي المباشر' : 'Open Mind-Game Chat'}
      >
        <MessageSquare size={16} />
        <span>{isRtl ? `شات ${opponentName}` : `Chat ${opponentName}`}</span>
        {messages.length > 0 && <span className="chat-badge-dot" />}
      </button>

      {/* Floating Chat Modal / Drawer */}
      {open && (
        <div className="chat-drawer-overlay" onClick={() => setOpen(false)}>
          <div className="chat-drawer-card" onClick={(e) => e.stopPropagation()} dir={isRtl ? 'rtl' : 'ltr'}>
            <header className="chat-drawer-header">
              <div className="drawer-title-group">
                <Radio size={14} className="pulse-icon" />
                <b>{isRtl ? `محادثة مشفرة: ${myName} ضد ${opponentName}` : `Duel: ${myName} vs ${opponentName}`}</b>
              </div>
              <button className="btn-close-modal" onClick={() => setOpen(false)}>
                <X size={18} />
              </button>
            </header>

            {/* Quick Taunts */}
            <div className="drawer-taunts-chips">
              {(myRole === 'KILLER' ? KIRA_TAUNTS : [
                'أعلم أنك في القطاع السكني.. خطوتك القادمة هي نهايتك!',
                'أنا هو L.. سأكشف وجهك أمام العالم.',
              ]).map((taunt, i) => (
                <button key={i} className="chip-taunt" onClick={() => handleSend(taunt)}>
                  {taunt}
                </button>
              ))}
            </div>

            {/* Messages Stream */}
            <div className="drawer-messages-stream">
              {messages.length === 0 && (
                <div className="empty-chat-hint">
                  <p>{isRtl ? 'لا توجد رسائل بعد.. ابدأ باستفزاز خصمك أو انتظر رده!' : 'No messages yet. Send a psychological taunt!'}</p>
                </div>
              )}
              {messages.map((m) => (
                <div key={m.id} className={`chat-bubble ${m.senderRole === myRole ? 'mine' : 'theirs'}`}>
                  <div className="bubble-meta">
                    <b>{m.senderName}</b>
                    <small>{m.timestamp}</small>
                    {m.hasAudioScramble && (
                      <button
                        className="btn-replay-scrambler"
                        onClick={() => sensoryAudio.playScrambledVoice(m.text)}
                        title={isRtl ? 'إعادة سماع الصوت المشوش' : 'Replay scrambled audio'}
                      >
                        <Volume2 size={11} />
                      </button>
                    )}
                  </div>
                  <p>{m.text}</p>
                </div>
              ))}
              <div ref={streamEndRef} />
            </div>

            {/* Input Bar */}
            <div className="drawer-input-bar">
              <input
                type="text"
                className="chat-text-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={isRtl ? `اكتب رسالة إلى ${opponentName}...` : `Message ${opponentName}...`}
              />
              <button className="btn-send-chat" onClick={() => handleSend()}>
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
