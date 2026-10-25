import { useEffect, useRef, useState } from 'react';
import { MessageSquare, Radio, Send, Volume2, X } from 'lucide-react';
import { sensoryAudio } from '../game/audioEngine';
import { multiplayer, type ChatMessage } from '../game/multiplayer';
import { generatePsychologicalReply } from '../game/psychologicalChatAI';
import type { GameState } from '../game/store';
import { useLang } from '../i18n';

const KILLER_TAUNTS = {
  ar: [
    'العدالة أنا من يكتبها بالظل.. وأنت عاجز عن رؤيتي.',
    'كل فخاخك ومراقبتك أراها قبل أن تبدأها أيها المحقق.',
    'أنت لست ندي.. لن تكتشف هويتي الحقيقية أبداً.',
    'العالم يتطهر من الفساد، ومحاكمك البيروقراطية عاجزة.',
    'افحص سجل الوفيات غداً.. قد تجد اسمك هو السطر التالي.',
  ],
  en: [
    'I write true justice in the shadows; you cannot perceive me.',
    'I see every wiretap and surveillance trap before you spring it.',
    'You are outmatched. My true identity will never be uncovered.',
    'The city is being cleansed while your bureaucracy stands paralyzed.',
    'Check tomorrow’s obituaries; your name may be the next headline.',
  ],
};

const DETECTIVE_TAUNTS = {
  ar: [
    'أعلم أنك مقيد بساعات فراغ محددة.. دائرة التحليل تضيق حولك!',
    'كل ضربة قلب تسجلها في دفترك تمنحنا إحداثيات أدق لموقعك.',
    'الغرور هو ثغرتك القاتلة.. وأنا هنا لأضع الأصفاد في يديك.',
    'مهما كان سلاحك غامضاً، فإن القانون والحساب الرياضي سيصلان إليك.',
    'أنا هو سايفر.. وخطوتك التالية ستكون دليلي القاطع للمداهمة.',
  ],
  en: [
    'I know you are bound by a rigid schedule; our grid is tightening!',
    'Every cardiac arrest telemetry gives us sharper geographic coordinates.',
    'Megalomania is your flaw; I am here to snap the handcuffs shut.',
    'No matter your supernatural tool, mathematical deduction will corner you.',
    'I am Cipher. Your very next move is the evidence for my raid.',
  ],
};

export function PsychologicalChat({
  myName,
  opponentName,
  myRole,
  isMultiplayer = false,
  gameState,
}: {
  myName: string;
  opponentName: string;
  myRole: 'KILLER' | 'DETECTIVE';
  isMultiplayer?: boolean;
  gameState?: GameState;
}) {
  const { lang } = useLang();
  const isRtl = lang === 'ar';
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(() => [...multiplayer.state.chatMessages]);
  const [isOpponentTyping, setIsOpponentTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const streamEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Initial sync
    setMessages([...multiplayer.state.chatMessages]);

    // Live reactive subscription to multiplayer/chat events
    const unsub = multiplayer.onChat((msg, all) => {
      setMessages([...all]);
      if (msg.senderRole !== myRole) {
        sensoryAudio.playRadioStatic(0.6);
        if (!open) {
          setUnreadCount((c) => c + 1);
        }
      }
    });

    return () => unsub();
  }, [myRole, open]);

  useEffect(() => {
    if (open) {
      setUnreadCount(0);
      streamEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, open, isOpponentTyping]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend ?? input).trim();
    if (!text) return;

    sensoryAudio.playKeystroke();
    const msg: ChatMessage = {
      id: `chat-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      senderName: myName,
      senderRole: myRole,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      hasAudioScramble: myRole === 'DETECTIVE',
    };

    multiplayer.send({ type: 'CHAT', message: msg });
    setInput('');

    // If Single Player mode: trigger intelligent, reactive psychological AI response
    if (!isMultiplayer) {
      triggerAIReply(text);
    }
  };

  const triggerAIReply = (playerText: string) => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Simulate realistic thinking & typing delay (1.4s - 2.6s)
    const typingDelay = 1400 + Math.floor(Math.random() * 1200);

    setTimeout(() => {
      setIsOpponentTyping(true);
    }, 400);

    typingTimeoutRef.current = setTimeout(() => {
      setIsOpponentTyping(false);

      const replyText = generatePsychologicalReply({
        playerMessage: playerText,
        playerRole: myRole,
        opponentName,
        lang,
        gameState,
      });

      const opponentRole = myRole === 'KILLER' ? 'DETECTIVE' : 'KILLER';
      const aiMsg: ChatMessage = {
        id: `chat-ai-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        senderName: opponentName,
        senderRole: opponentRole,
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        hasAudioScramble: opponentRole === 'DETECTIVE',
      };

      multiplayer.send({ type: 'CHAT', message: aiMsg });
      sensoryAudio.playRadioStatic(0.7);
      if (opponentRole === 'DETECTIVE') {
        sensoryAudio.playScrambledVoice(replyText);
      }
    }, typingDelay);
  };

  const tauntOptions = myRole === 'KILLER' ? (isRtl ? KILLER_TAUNTS.ar : KILLER_TAUNTS.en) : (isRtl ? DETECTIVE_TAUNTS.ar : DETECTIVE_TAUNTS.en);

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
        {unreadCount > 0 ? (
          <span className="chat-badge-counter">{unreadCount}</span>
        ) : (
          messages.length > 0 && <span className="chat-badge-dot" />
        )}
      </button>

      {/* Floating Chat Modal / Drawer */}
      {open && (
        <div className="chat-drawer-overlay" onClick={() => setOpen(false)}>
          <div className="chat-drawer-card" onClick={(e) => e.stopPropagation()} dir={isRtl ? 'rtl' : 'ltr'}>
            <header className="chat-drawer-header">
              <div className="drawer-title-group">
                <Radio size={15} className="pulse-icon text-cyan" />
                <div className="title-text-stack">
                  <b>{isRtl ? `محادثة مشفرة: ${myName} ضد ${opponentName}` : `Duel: ${myName} vs ${opponentName}`}</b>
                  <span className="channel-subtext">
                    {isMultiplayer
                      ? (isRtl ? 'اتصال P2P مباشر (لاعب ضد لاعب)' : 'Direct P2P Link (1v1 Live)')
                      : (isRtl ? 'قناة تفاوض استخباراتية مغلقة (ذكاء اصطناعي تفاعلي)' : 'Encrypted Tactical Link (AI Mind Game)')}
                  </span>
                </div>
              </div>
              <button className="btn-close-modal" onClick={() => setOpen(false)}>
                <X size={18} />
              </button>
            </header>

            {/* Quick Psychological Taunt Chips */}
            <div className="drawer-taunts-chips">
              <div className="chips-label">{isRtl ? 'استفزازات سريعة:' : 'Quick Taunts:'}</div>
              <div className="chips-scroll">
                {tauntOptions.map((taunt, i) => (
                  <button key={i} className="chip-taunt" onClick={() => handleSend(taunt)}>
                    {taunt}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages Stream */}
            <div className="drawer-messages-stream">
              {messages.length === 0 && !isOpponentTyping && (
                <div className="empty-chat-hint">
                  <p>
                    {isRtl
                      ? 'القناة المشفرة مفتوحة.. ابدأ باستفزاز خصمك أو انتظر رده وتحليله!'
                      : 'Tactical channel open. Taunt your nemesis or wait for their psychological reply!'}
                  </p>
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
                        <Volume2 size={12} />
                      </button>
                    )}
                  </div>
                  <p className="bubble-text">{m.text}</p>
                </div>
              ))}

              {/* Animated AI Typing Indicator */}
              {isOpponentTyping && (
                <div className="chat-bubble theirs typing-bubble">
                  <div className="bubble-meta">
                    <b>{opponentName}</b>
                    <small>{isRtl ? 'يكتب رداً نفسياً...' : 'analyzing & typing...'}</small>
                  </div>
                  <div className="typing-dots-animation">
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                  </div>
                </div>
              )}

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
                placeholder={isRtl ? `اكتب رسالة نفسية إلى ${opponentName}...` : `Type psychological message to ${opponentName}...`}
              />
              <button
                type="button"
                className="btn-send-chat"
                onClick={() => handleSend()}
                disabled={!input.trim()}
                title={isRtl ? 'إرسال الرسالة' : 'Send message'}
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
