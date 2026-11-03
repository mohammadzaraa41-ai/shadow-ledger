import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Lang } from './game/types';

export type { Lang };

type Dict = Record<string, string>;

const ar: Dict = {
  'app.name': 'الكذّاب بيننا',
  'app.tag': 'واحد منكم يكذب.. اكشفه قبل ما يخدعكم!',
  'home.play': 'ابدأ اللعب',
  'home.how': 'كيف تلعب؟',
  'home.footer': 'لعبة جلسات للأصدقاء والعائلة · مرّروا الجوال بينكم',

  'setup.title': 'جهّز الجلسة',
  'setup.players': 'اللاعبون',
  'setup.player': 'لاعب {n}',
  'setup.add': 'إضافة لاعب',
  'setup.min': 'تحتاجون {n} لاعبين على الأقل',
  'setup.cats': 'الفئات',
  'setup.rounds': 'عدد الجولات',
  'setup.time': 'وقت النقاش',
  'setup.sec': '{n} ث',
  'setup.chaos': 'بطاقات الفوضى 🌪️',
  'setup.chaosHint': 'مفاجآت عشوائية تقلب الجولة',
  'setup.voice': 'صوت المذيع الساخر 🎙️',
  'setup.voiceHint': 'يعلّق بصوت الجهاز',
  'setup.start': 'يلا نبدأ!',
  'setup.back': 'رجوع',
  'setup.needCat': 'اختر فئة واحدة على الأقل',

  'hand.round': 'الجولة {n} من {total}',
  'hand.pass': 'مرّر الجوال إلى',
  'hand.ready': 'أنا {name}، اعرض دوري',
  'hand.hold': 'اضغط مطولاً لتشوف دورك 👆',
  'hand.release': 'ارفع إصبعك لإخفاء الدور',
  'hand.done': 'تم، أخفِ ومرّر',
  'hand.start': 'ابدأوا النقاش!',
  'hand.liar': 'أنت الكذّاب! 🤥',
  'hand.liarHint': 'لا تعرف الكلمة. اسمع الباقين وتصرّف وكأنك تعرفها.',
  'hand.liarDecoyHint': 'اللعبة بدأت.. حاول تفهم إذا كلمتك مثل كلمة الباقين.',
  'hand.word': 'الكلمة السرية',
  'hand.cat': 'الفئة',
  'hand.wordHint': 'لا تقولها مباشرة! لمّح لها بذكاء.',

  'chaos.DOUBLE': 'كذّابان! 🤥🤥',
  'chaos.DOUBLEd': 'هذه الجولة فيها كذّابان، ولا يعرفان بعضهما!',
  'chaos.SPEED': 'جولة سريعة ⚡',
  'chaos.SPEEDd': 'وقت النقاش نصف المعتاد!',
  'chaos.WHISPER': 'جولة الهمس 🤫',
  'chaos.WHISPERd': 'الكل يتكلم بصوت منخفض جداً طوال الجولة.',

  'disc.starter': '{name} يبدأ الكلام',
  'disc.prompt': 'فكرة للنقاش',
  'disc.newPrompt': 'فكرة ثانية',
  'disc.vote': 'جاهزون للتصويت',
  'disc.liars1': 'يوجد كذّاب واحد بينكم',
  'disc.liars2': 'يوجد كذّابان بينكم',

  'vote.title': 'مين الكذّاب؟',
  'vote.sub': 'اتفقوا كمجموعة ثم اختاروا المتهم',
  'vote.none': 'ما في كذّاب 🤷',
  'vote.confirm': 'تأكيد الاتهام',
  'vote.pick': 'اختر متهماً',
  'vote.confirmNone': 'تأكيد: ما في كذّاب',

  'guess.pass': 'انكشفت! مرّر الجوال إلى {name}',
  'guess.ready': 'أنا {name}',
  'guess.title': 'آخر فرصة! خمّن الكلمة السرية',
  'guess.sub': 'إذا خمّنتها صح تسرق النصر',

  'res.liarWas': 'الكذّاب كان…',
  'res.liarsWere': 'الكذّابان كانا…',
  'res.nobody': 'ما كان في كذّاب أصلاً!',
  'res.word': 'الكلمة كانت',
  'res.decoy': 'وكلمة الكذّاب كانت',
  'res.next': 'الجولة التالية',
  'res.final': 'النتيجة النهائية',
  'res.scores': 'النقاط',

  'out.CAUGHT_GUESS_WRONG': 'انكشف الكذّاب وفشل بالتخمين! الصادقون +1',
  'out.CAUGHT_GUESS_RIGHT': 'انكشف لكنه خمّن الكلمة! سرق النصر',
  'out.ESCAPED': 'الكذّاب نجا! كسب النقاط',
  'out.NO_LIAR_OK': 'ذكاء جماعي! الكل +2',
  'out.NO_LIAR_WRONG': 'اتهمتوا بريئاً! خسر نقطة',

  'final.title': 'النتيجة النهائية',
  'final.winner': 'البطل',
  'final.again': 'جولة جديدة بنفس اللاعبين',
  'final.home': 'القائمة الرئيسية',
  'final.share': 'شارك النتيجة',
  'final.copied': 'تم نسخ النتيجة!',
  'final.shareText': '🤥 «الكذّاب بيننا» — البطل: {winner} بـ {pts} نقطة! جرّبوا تغلبوني.',

  'how.title': 'كيف تلعب؟',
  'how.1t': 'الكل يعرف الكلمة… إلا الكذّاب',
  'how.1b': 'مرّروا الجوال، وكل لاعب يضغط مطولاً ليرى دوره سراً. واحد فقط لا يعرف الكلمة، وهو الكذّاب.',
  'how.2t': 'تكلموا وتلمّحوا',
  'how.2b': 'كل واحد يلمّح للكلمة بدون ما يقولها. الكذّاب يحاول يخمّن ويتصرف وكأنه يعرفها.',
  'how.3t': 'صوّتوا',
  'how.3b': 'اتفقوا على من تظنونه الكذّاب. إذا انكشف يحصل على فرصة أخيرة لتخمين الكلمة.',
  'how.4t': 'احذروا الفوضى',
  'how.4b': 'أحياناً تظهر مفاجآت: كذّابان، وقت أقل، همس، أو حتى جولة بلا كذّاب!',
  'how.5t': 'النقاط',
  'how.5b': 'الكذّاب الناجي +3. الصادقون +1 إذا كشفوه. الكذّاب المكشوف +2 إذا خمّن الكلمة.',
  'how.close': 'فهمت!',

  'common.mute': 'الصوت',
};

const en: Dict = {
  'app.name': 'The Liar Among Us',
  'app.tag': 'One of you is lying.. expose them before they fool you!',
  'home.play': 'Play',
  'home.how': 'How to play',
  'home.footer': 'A party game for friends & family · pass the phone around',

  'setup.title': 'Set up the session',
  'setup.players': 'Players',
  'setup.player': 'Player {n}',
  'setup.add': 'Add player',
  'setup.min': 'You need at least {n} players',
  'setup.cats': 'Categories',
  'setup.rounds': 'Rounds',
  'setup.time': 'Discussion time',
  'setup.sec': '{n}s',
  'setup.chaos': 'Chaos cards 🌪️',
  'setup.chaosHint': 'Random twists that shake up the round',
  'setup.voice': 'Sarcastic host voice 🎙️',
  'setup.voiceHint': 'Comments using your device voice',
  'setup.start': 'Let’s go!',
  'setup.back': 'Back',
  'setup.needCat': 'Pick at least one category',

  'hand.round': 'Round {n} of {total}',
  'hand.pass': 'Pass the phone to',
  'hand.ready': 'I’m {name}, show my role',
  'hand.hold': 'Press and hold to see your role 👆',
  'hand.release': 'Release to hide your role',
  'hand.done': 'Done, hide & pass',
  'hand.start': 'Start talking!',
  'hand.liar': 'You are the liar! 🤥',
  'hand.liarHint': 'You don’t know the word. Listen and act like you do.',
  'hand.liarDecoyHint': 'The game is on.. figure out if your word matches the others.',
  'hand.word': 'Secret word',
  'hand.cat': 'Category',
  'hand.wordHint': 'Don’t say it directly! Hint cleverly.',

  'chaos.DOUBLE': 'Two liars! 🤥🤥',
  'chaos.DOUBLEd': 'This round has two liars, and they don’t know each other!',
  'chaos.SPEED': 'Speed round ⚡',
  'chaos.SPEEDd': 'Discussion time is cut in half!',
  'chaos.WHISPER': 'Whisper round 🤫',
  'chaos.WHISPERd': 'Everyone talks very quietly all round.',

  'disc.starter': '{name} speaks first',
  'disc.prompt': 'Conversation starter',
  'disc.newPrompt': 'Another one',
  'disc.vote': 'Ready to vote',
  'disc.liars1': 'There is one liar among you',
  'disc.liars2': 'There are two liars among you',

  'vote.title': 'Who is the liar?',
  'vote.sub': 'Agree as a group, then pick the suspect',
  'vote.none': 'No liar 🤷',
  'vote.confirm': 'Confirm accusation',
  'vote.pick': 'Pick a suspect',
  'vote.confirmNone': 'Confirm: no liar',

  'guess.pass': 'Busted! Pass the phone to {name}',
  'guess.ready': 'I’m {name}',
  'guess.title': 'Last chance! Guess the secret word',
  'guess.sub': 'Guess right and you steal the win',

  'res.liarWas': 'The liar was…',
  'res.liarsWere': 'The liars were…',
  'res.nobody': 'There was no liar at all!',
  'res.word': 'The word was',
  'res.decoy': 'and the liar’s word was',
  'res.next': 'Next round',
  'res.final': 'Final results',
  'res.scores': 'Scores',

  'out.CAUGHT_GUESS_WRONG': 'Liar caught and guessed wrong! Honest players +1',
  'out.CAUGHT_GUESS_RIGHT': 'Caught, but guessed the word! Steals the win',
  'out.ESCAPED': 'The liar got away! Points earned',
  'out.NO_LIAR_OK': 'Collective genius! Everyone +2',
  'out.NO_LIAR_WRONG': 'You accused an innocent! They lose a point',

  'final.title': 'Final results',
  'final.winner': 'Champion',
  'final.again': 'New game, same players',
  'final.home': 'Main menu',
  'final.share': 'Share result',
  'final.copied': 'Result copied!',
  'final.shareText': '🤥 “The Liar Among Us” — Champion: {winner} with {pts} points! Try to beat me.',

  'how.title': 'How to play',
  'how.1t': 'Everyone knows the word… except the liar',
  'how.1b': 'Pass the phone around. Each player press-and-holds to see their role secretly. Only one doesn’t know the word: the liar.',
  'how.2t': 'Talk and hint',
  'how.2b': 'Everyone hints at the word without saying it. The liar tries to guess and blend in.',
  'how.3t': 'Vote',
  'how.3b': 'Agree on who you think the liar is. If caught, they get a last chance to guess the word.',
  'how.4t': 'Beware of chaos',
  'how.4b': 'Sometimes twists appear: two liars, less time, whispering, or even a round with no liar!',
  'how.5t': 'Scoring',
  'how.5b': 'Liar escapes +3. Honest players +1 for catching them. A caught liar +2 for guessing the word.',
  'how.close': 'Got it!',

  'common.mute': 'Sound',
};

const dicts: Record<Lang, Dict> = { ar, en };

export function translate(lang: Lang, key: string, p?: Record<string, string | number>): string {
  let s = dicts[lang][key] ?? key;
  if (p) for (const [k, v] of Object.entries(p)) s = s.split(`{${k}}`).join(String(v));
  return s;
}

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, p?: Record<string, string | number>) => string;
}

const LangCtx = createContext<Ctx>(null!);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('lang') as Lang) || 'ar');
  useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);
  const t = useCallback((k: string, p?: Record<string, string | number>) => translate(lang, k, p), [lang]);
  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);
  return createElement(LangCtx.Provider, { value }, children);
}

export const useLang = () => useContext(LangCtx);

