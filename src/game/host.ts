import { pick } from './engine';
import type { Lang, L10n } from './types';

/** The sarcastic host. Each event has several lines; {name} is replaced at runtime. */
type HostEvent =
  | 'intro'
  | 'discuss'
  | 'timeUp'
  | 'caught'
  | 'escaped'
  | 'guessRight'
  | 'guessWrong'
  | 'noLiarOk'
  | 'noLiarWrong'
  | 'winner';

const LINES: Record<HostEvent, L10n[]> = {
  intro: [
    { ar: 'أهلاً بالمحتالين المحترفين.. أقصد اللاعبين! 😏', en: 'Welcome, professional fraudsters.. I mean players! 😏' },
    { ar: 'واحد منكم يكذب علينا. أنا أعرف مين، بس ما راح أقول.', en: 'One of you is lying. I know who. I’m not telling.' },
  ],
  discuss: [
    { ar: 'تكلموا! اللي يسكت أكثر من غيره مشبوه.', en: 'Talk! Whoever stays quiet is suspicious.' },
    { ar: 'ابتسموا.. الكذّاب يتعرق الحين 😅', en: 'Smile.. the liar is sweating right now 😅' },
    { ar: 'لا تقولوا الكلمة مباشرة، لا تفضحوا نفسكم!', en: 'Don’t say the word directly, don’t expose yourselves!' },
  ],
  timeUp: [
    { ar: 'خلص الوقت! كلكم مشبوهين الحين.', en: 'Time’s up! You are all suspects now.' },
    { ar: 'وقت التصويت.. اختاروا بحكمة (أو لا).', en: 'Voting time.. choose wisely (or don’t).' },
  ],
  caught: [
    { ar: 'انكشفت يا {name}! حتى الكاميرا ضحكت عليك.', en: 'Busted, {name}! Even the camera laughed at you.' },
    { ar: '{name} كان الكذّاب! الصدمة ما كانت كبيرة صراحة.', en: '{name} was the liar! Honestly, not that shocking.' },
  ],
  escaped: [
    { ar: 'كذّاب محترف! أصحابك صدقوك وأنا مصدوم 👏', en: 'A pro liar! Your friends believed you and I’m shocked 👏' },
    { ar: 'اتهمتوا الشخص الغلط.. أنتم أسوأ محققين شفتهم.', en: 'You accused the wrong person.. worst detectives ever.' },
  ],
  guessRight: [
    { ar: 'يا ذكي! خمّنت الكلمة وسرقت النصر 😎', en: 'Clever! You guessed the word and stole the win 😎' },
  ],
  guessWrong: [
    { ar: 'خمّنت غلط! الكلمة أبعد عنك من عقلك الحين.', en: 'Wrong guess! The word is farther away than your common sense.' },
  ],
  noLiarOk: [
    { ar: 'ما كان في كذّاب! ذكاء جماعي نادر 🧠', en: 'There was no liar! Rare collective intelligence 🧠' },
  ],
  noLiarWrong: [
    { ar: 'ما كان في كذّاب أصلاً! ظلمتوا {name} على الفاضي 🤦', en: 'There was no liar at all! You wrongly accused {name} 🤦' },
  ],
  winner: [
    { ar: 'الفائز {name}! والباقي؟ كملوا حظوظكم.', en: 'The winner is {name}! The rest? Better luck next time.' },
    { ar: '{name} يتربع على القمة.. اعتبروه ملك الكذب (أو الصدق).', en: '{name} takes the crown.. king of lying (or honesty).' },
  ],
};

export function hostLine(event: HostEvent, lang: Lang, name = ''): string {
  return pick(LINES[event])[lang].split('{name}').join(name);
}

/** Conversation starters shown during the discussion phase. */
const PROMPTS: L10n[] = [
  { ar: 'صِف الشيء بدون ما تقول اسمه.', en: 'Describe it without saying its name.' },
  { ar: 'ايش أول شيء يجي ببالك لما تسمع الكلمة؟', en: 'What is the first thing that comes to mind?' },
  { ar: 'قيّم الكلمة من 1 إلى 10.', en: 'Rate it from 1 to 10.' },
  { ar: 'متى آخر مرة استخدمتها أو شفتها؟', en: 'When did you last use or see it?' },
  { ar: 'لو الكلمة شخص، كيف شكله؟', en: 'If it were a person, what would they look like?' },
  { ar: 'اسأل لاعباً سؤال نعم/لا عن الكلمة.', en: 'Ask a player a yes/no question about it.' },
  { ar: 'لمّح للكلمة بكلمة واحدة فقط.', en: 'Hint at the word with a single word only.' },
  { ar: 'مين بالجلسة أكثر واحد يحبها؟', en: 'Who here likes it the most?' },
];

export const randomPrompt = (lang: Lang): string => pick(PROMPTS)[lang];

let speaking = false;

/** Reads the host line aloud using the device voice (optional, silent when unsupported). */
export function speak(text: string, lang: Lang, enabled: boolean): void {
  if (!enabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    if (speaking) window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/[\u{1F300}-\u{1FAFF}]/gu, ''));
    u.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
    u.rate = 1.05;
    u.pitch = 1.25;
    u.onend = () => (speaking = false);
    speaking = true;
    window.speechSynthesis.speak(u);
  } catch {
    speaking = false;
  }
}

