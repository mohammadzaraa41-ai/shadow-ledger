import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Lang } from './game/types';

export type { Lang };

type Dict = Record<string, string>;

const ar: Dict = {
  'app.name': 'الكذّاب بيننا',
  'app.tag': 'واحد منكم يكذب.. اكشفه قبل ما يخدعكم!',
  'home.play': 'ابدأ اللعب',
  'home.how': '📖 شرح اللعب وتجربة تفاعلية',
  'home.footer': 'لعبة جلسات للأصدقاء والعائلة · جوال واحد أو عدة جوالات بكود غرفة',

  'setup.title': 'جهّز الجلسة',
  'setup.players': 'اللاعبون (اضغط على الإيموجي لتغييره)',
  'setup.player': 'لاعب {n}',
  'setup.add': 'إضافة لاعب',
  'setup.min': 'تحتاجون {n} لاعبين على الأقل',
  'setup.cats': 'الفئات',
  'setup.customTitle': '✨ كلماتكم الخاصة (أضف كلمات من جوّ شلّتكم)',
  'setup.customPlace': 'اكتب كلمة أو سالفة خاصة...',
  'setup.customAdd': 'إضافة',
  'setup.customHint': 'تحتاج 4 كلمات على الأقل لتفعيل فئة كلماتكم الخاصة',
  'setup.rounds': 'عدد الجولات',
  'setup.time': 'وقت النقاش',
  'setup.sec': '{n} ث',
  'setup.chaos': 'بطاقات الفوضى 🌪️',
  'setup.chaosHint': 'مفاجآت عشوائية تقلب الجولة (كذّابان، كلمة مخادعة، همس...)',
  'setup.roles': 'الأدوار الخاصة 🎭 (المهرّج والشاهد)',
  'setup.rolesHint': 'لـ 4 لاعبين فأكثر: المهرّج يربح إذا اتهمتموه، والشاهد يرى مشتبهين!',
  'setup.voice': 'صوت المذيع الساخر 🎙️',
  'setup.voiceHint': 'يعلّق بصوت الجهاز',
  'setup.roomTitle': '🌐 طريقة اللعب (جوال واحد أو عدة جوالات عن بُعد)',
  'setup.roomHint': 'اتركه فارغاً لتمرير جوال واحد، أو اكتبوا نفس الكود في كل جوال للعب معاً عن بُعد بنفس الكلمة والأدوار!',
  'setup.roomPlace': 'كود الغرفة (مثال: K7M2)',
  'setup.roomGen': 'توليد كود',
  'setup.roomClear': 'إلغاء الكود',
  'setup.start': 'يلا نبدأ!',
  'setup.back': 'رجوع',
  'setup.needCat': 'اختر فئة واحدة على الأقل',

  'hand.round': 'الجولة {n} من {total}',
  'hand.pass': 'مرّر الجوال إلى',
  'hand.roomBanner': '🌐 غرفة موحّدة ({code}) — اختر اسمك مباشرة أو مرّر الجوال:',
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
  'hand.jesterBadge': '🤡 دورك الإضافي: المهرّج المخادع!',
  'hand.jesterHint': 'تعرف الكلمة، لكن إذا جعلت المجموعة تشك فيك وتصوّت ضدك تربح +3 نقاط لوحدك!',
  'hand.witnessBadge': '🔮 دورك الإضافي: الشاهد السري!',
  'hand.witnessHint': 'معلومة سرية: الكذّاب الحقيقي هو أحد هذين الاثنين: ({pair})!',

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
  'res.jesterWas': '🤡 المهرّج كان: {name}',
  'res.next': 'الجولة التالية',
  'res.final': 'النتيجة النهائية',
  'res.scores': 'النقاط',
  'res.wheelBtn': '🎡 عجلة العقوبات للخاسر!',

  'out.CAUGHT_GUESS_WRONG': 'انكشف الكذّاب وفشل بالتخمين! الصادقون +1',
  'out.CAUGHT_GUESS_RIGHT': 'انكشف لكنه خمّن الكلمة! سرق النصر (+2)',
  'out.ESCAPED': 'الكذّاب نجا وخدعكم! كسب النقاط (+3)',
  'out.NO_LIAR_OK': 'ذكاء جماعي! الكل +2',
  'out.NO_LIAR_WRONG': 'اتهمتوا بريئاً! خسر نقطة',
  'out.JESTER_WIN': '🤡 فخ المهرّج! اتهمتم المهرّج عن قصد فسرق الفوز (+3)!',

  'wheel.title': '🎡 عجلة العقوبات المضحكة',
  'wheel.loser': 'العقوبة من نصيب: {name}',
  'wheel.spin': 'أدِر العجلة الآن! 🎲',
  'wheel.spinning': 'تدور العجلة...',
  'wheel.again': 'حكم آخر 🔄',
  'wheel.done': 'تم تنفيذ الحكم! ✅',

  'final.title': 'النتيجة النهائية',
  'final.winner': 'البطل',
  'final.again': 'جولة جديدة بنفس اللاعبين',
  'final.home': 'القائمة الرئيسية',
  'final.share': 'شارك النتيجة',
  'final.copied': 'تم نسخ النتيجة!',
  'final.shareText': '🤥 «الكذّاب بيننا» — البطل: {winner} بـ {pts} نقطة! جرّبوا تغلبوني.',

  'how.title': 'كيف تلعب «الكذّاب بيننا»؟',
  'how.tab1': '1. الأساسيات',
  'how.tab2': '2. الأدوار والفوضى',
  'how.tab3': '3. اللعب عن بُعد',
  'how.tryTitle': '👇 جرّب كشف البطاقة السرية بنفسك الآن!',
  'how.tryHold': 'اضغط مطوّلاً هنا لتجربة كشف الكلمة السرية 👆',
  'how.tryWord': 'كبسة دجاج 🍗',
  'how.trySub': 'هكذا يرى كل لاعب كلمته بالسر، وعند رفع إصبعه تختفي فوراً!',
  'how.1t': 'الكل يعرف الكلمة… إلا الكذّاب',
  'how.1b': 'مرّروا الجوال، وكل لاعب يضغط مطولاً ليرى دوره سراً. واحد فقط لا يعرف الكلمة، وهو الكذّاب.',
  'how.2t': 'تكلموا وتلمّحوا بذكاء',
  'how.2b': 'كل واحد يلمّح للكلمة بدون أن يفضحها للكذّاب. الكذّاب يحاول يخمّن ويتصرف وكأنه يعرفها.',
  'how.3t': 'صوّتوا + الفرصة الأخيرة',
  'how.3b': 'اتفقوا على المتهم. إذا كشفتم الكذّاب، يحصل على فرصة أخيرة لتخمين الكلمة من 6 خيارات ليسرق الفوز!',
  'how.4t': 'احذروا بطاقات الفوضى 🌪️',
  'how.4b': 'مفاجآت عشوائية: كذّابان، كلمة مخادعة قريبة من الكلمة الحقيقية، جولة همس، أو جولة بلا كذّاب!',
  'how.5t': 'النقاط وعجلة العقوبات 🎡',
  'how.5b': 'الكذّاب الناجي +3، الصادقون +1، المهرّج المتهم +3. وفي نهاية كل جولة تدور عجلة العقوبات المضحكة للخاسر!',
  'how.rolesTitle': 'الأدوار الخاصة 🎭',
  'how.roleLiar': '🤥 الكذّاب: لا يعرف الكلمة السرية، وهدفه الخداع أو تخمين الكلمة في النهاية.',
  'how.roleJester': '🤡 المهرّج المخادع: يعرف الكلمة، لكنه يتظاهر بالشبهة لكي تصوّتوا ضده ويكسب +3 نقاط!',
  'how.roleWitness': '🔮 الشاهد السري: يعرف الكلمة، ويخبره الهاتف باسمَي لاعبين أحدهما هو الكذّاب الحقيقي!',
  'how.remoteTitle': 'اللعب بجوال واحد أو عدة جوالات 🌐',
  'how.remote1': '📱 جوال واحد (في نفس الغرفة): اترك حقل كود الغرفة فارغاً ومرّروا الجوال بينكم.',
  'how.remote2': '🌐 عدة جوالات (أونلاين / مكالمة صوتية): اكتبوا نفس أسماء اللاعبين بنفس الترتيب ونفس «كود الغرفة» في كل جوال، وستظهر نفس الكلمة ونفس الكذّاب عند الجميع تلقائياً!',
  'how.close': 'فهمت، يلا نلعب! 🚀',

  'common.mute': 'الصوت',
};

const en: Dict = {
  'app.name': 'The Liar Among Us',
  'app.tag': 'One of you is lying.. expose them before they fool you!',
  'home.play': 'Play Now',
  'home.how': '📖 How to Play & Interactive Demo',
  'home.footer': 'Party game for friends & family · Pass one phone or sync multiple phones',

  'setup.title': 'Set up the session',
  'setup.players': 'Players (tap emoji to change avatar)',
  'setup.player': 'Player {n}',
  'setup.add': 'Add player',
  'setup.min': 'You need at least {n} players',
  'setup.cats': 'Categories',
  'setup.customTitle': '✨ Custom Words (add your group’s inside jokes)',
  'setup.customPlace': 'Type a custom word or topic...',
  'setup.customAdd': 'Add',
  'setup.customHint': 'Add at least 4 words to play with your custom pack',
  'setup.rounds': 'Rounds',
  'setup.time': 'Discussion time',
  'setup.sec': '{n}s',
  'setup.chaos': 'Chaos cards 🌪️',
  'setup.chaosHint': 'Random twists (Two liars, Decoy word, Whisper, Speed...)',
  'setup.roles': 'Special Roles 🎭 (Jester & Witness)',
  'setup.rolesHint': 'For 4+ players: Jester wins if voted out, Witness sees 2 suspects!',
  'setup.voice': 'Sarcastic host voice 🎙️',
  'setup.voiceHint': 'Comments using your device voice',
  'setup.roomTitle': '🌐 Play Mode (One Phone vs Multi-Phone Room Code)',
  'setup.roomHint': 'Leave empty for single-phone pass & play, or enter the same Room Code on multiple phones to sync words & roles!',
  'setup.roomPlace': 'Room Code (e.g. K7M2)',
  'setup.roomGen': 'Generate',
  'setup.roomClear': 'Clear',
  'setup.start': 'Let’s go!',
  'setup.back': 'Back',
  'setup.needCat': 'Pick at least one category',

  'hand.round': 'Round {n} of {total}',
  'hand.pass': 'Pass the phone to',
  'hand.roomBanner': '🌐 Synced Room ({code}) — Tap your name or pass the phone:',
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
  'hand.jesterBadge': '🤡 Bonus Role: The Jester!',
  'hand.jesterHint': 'You know the word, but if you trick the group into voting you out, you steal +3 points!',
  'hand.witnessBadge': '🔮 Bonus Role: The Secret Witness!',
  'hand.witnessHint': 'Secret intel: The real liar is one of these two: ({pair})!',

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
  'res.jesterWas': '🤡 The Jester was: {name}',
  'res.next': 'Next round',
  'res.final': 'Final results',
  'res.scores': 'Scores',
  'res.wheelBtn': '🎡 Punishment Wheel for the Loser!',

  'out.CAUGHT_GUESS_WRONG': 'Liar caught and guessed wrong! Honest players +1',
  'out.CAUGHT_GUESS_RIGHT': 'Caught, but guessed the word! Steals the win (+2)',
  'out.ESCAPED': 'The liar got away! Points earned (+3)',
  'out.NO_LIAR_OK': 'Collective genius! Everyone +2',
  'out.NO_LIAR_WRONG': 'You accused an innocent! They lose a point',
  'out.JESTER_WIN': '🤡 Jester Trap! You voted out the Jester, who steals +3 points!',

  'wheel.title': '🎡 Party Punishment Wheel',
  'wheel.loser': 'Dare for: {name}',
  'wheel.spin': 'Spin the Wheel! 🎲',
  'wheel.spinning': 'Spinning...',
  'wheel.again': 'Spin Again 🔄',
  'wheel.done': 'Dare Completed! ✅',

  'final.title': 'Final results',
  'final.winner': 'Champion',
  'final.again': 'New game, same players',
  'final.home': 'Main menu',
  'final.share': 'Share result',
  'final.copied': 'Result copied!',
  'final.shareText': '🤥 “The Liar Among Us” — Champion: {winner} with {pts} points! Try to beat me.',

  'how.title': 'How to Play',
  'how.tab1': '1. Basics',
  'how.tab2': '2. Roles & Chaos',
  'how.tab3': '3. Multi-Phone',
  'how.tryTitle': '👇 Try Revealing the Secret Card Yourself!',
  'how.tryHold': 'Press and hold here to test revealing the secret word 👆',
  'how.tryWord': 'Chicken Shawarma 🌯',
  'how.trySub': 'Each player holds to peek at their secret role, and releasing hides it immediately!',
  'how.1t': 'Everyone knows the word… except the liar',
  'how.1b': 'Pass the phone around. Each player press-and-holds to see their role secretly. Only one doesn’t know the word: the liar.',
  'how.2t': 'Talk and hint cleverly',
  'how.2b': 'Everyone hints at the word without giving it away. The liar tries to figure it out and blend in.',
  'how.3t': 'Vote + Last Chance',
  'how.3b': 'Agree on who you think the liar is. If caught, the liar gets one last chance to guess the word from 6 options!',
  'how.4t': 'Beware of Chaos Cards 🌪️',
  'how.4b': 'Random twists: Two Liars, Decoy Word, Speed Round, Whisper Round, or even No Liar!',
  'how.5t': 'Scoring & Punishment Wheel 🎡',
  'how.5b': 'Escaped Liar +3, Honest +1, Accused Jester +3. Spin the funny Punishment Wheel for the round loser!',
  'how.rolesTitle': 'Special Roles 🎭',
  'how.roleLiar': '🤥 The Liar: Doesn’t know the secret word; must blend in or guess it if caught.',
  'how.roleJester': '🤡 The Jester: Knows the word, but acts suspicious so the group votes them out for +3 points!',
  'how.roleWitness': '🔮 The Secret Witness: Knows the word AND sees two suspect names (one is the true Liar)!',
  'how.remoteTitle': 'One Phone vs Multi-Phone Sync 🌐',
  'how.remote1': '📱 One Phone (Same Room): Leave the Room Code empty and pass the phone around.',
  'how.remote2': '🌐 Multiple Phones (Voice Call / Big Room): Enter the same player list order and the same 4-letter Room Code on each phone—every phone will generate the exact same word & roles automatically!',
  'how.close': 'Got it, let’s play! 🚀',

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
