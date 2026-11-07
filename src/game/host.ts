import { pick } from './engine';
import type { Lang, L10n } from './types';

/** The sarcastic host. Each event has several lines; {name} is replaced at runtime. */
type HostEvent =
  | 'intro'
  | 'discuss'
  | 'timeUp'
  | 'liarLost'
  | 'escaped'
  | 'guessRight'
  | 'jesterWin';

const LINES: Record<HostEvent, L10n[]> = {
  intro: [
    { ar: 'جولة واحدة حاسمة.. لا يوجد فائزون اليوم، يوجد فقط خاسر ينفّذ الحكم! 😈', en: 'One decisive round.. no winners today, only losers who face the punishment! 😈' },
    { ar: 'واحد منكم يكذب علينا الآن.. لو فلت منكم كلكم بتنفذون أحكام! 🤥', en: 'One of you is lying right now.. if they escape, ALL of you face punishments! 🤥' },
  ],
  discuss: [
    { ar: 'اسألوا بذكاء! اللي يجاوب إجابة عامة زيادة عن اللزوم هو الكذّاب.', en: 'Ask smart questions! Anyone giving super vague answers is the liar.' },
    { ar: 'ابتسموا.. الكذّاب يتعرق الآن ويحاول يلقط أي طرف خيط 😅', en: 'Smile.. the liar is sweating right now trying to catch any clue 😅' },
    { ar: 'لا تلمّحوا بوضوح فتسهلوها على الكذّاب فيخمّن الكلمة!', en: 'Don’t make your hints too obvious or the liar will guess the word!' },
  ],
  timeUp: [
    { ar: 'انتهى الوقت! لحظة الحقيقة: إما تكشفونه أو تنفذون الأحكام كلكم!', en: 'Time’s up! Moment of truth: expose the liar or ALL of you get punished!' },
    { ar: 'وقفوا كلام! حان وقت الاتهام الحاسم.', en: 'Stop talking! It’s time for the final accusation.' },
  ],
  liarLost: [
    { ar: 'انكشفت يا {name} وفشلت بالتخمين! جهّز نفسك لعجلة العقوبات 😂🎡', en: 'Busted, {name}, and wrong guess! Get ready for the Punishment Wheel 😂🎡' },
    { ar: 'صادوه! {name} هو الخاسر الوحيد في هذه الجولة.. هاتوا العجلة!', en: 'Got ’em! {name} is the sole loser this round.. spin the wheel!' },
  ],
  escaped: [
    { ar: 'يا للفضيحة! الكذّاب خدعكم كلكم.. الآن كل واحد منكم ينفّذ حكماً! 👏😈', en: 'What a disaster! The liar fooled you all.. now EVERY one of you gets a dare! 👏😈' },
    { ar: 'اتهمتوا البريء وتركتوا الكذّاب يسرح ويمرح! عجلة العقوبات تنتظركم واحداً واحداً!', en: 'You accused an innocent and let the liar walk free! The wheel awaits you all!' },
  ],
  guessRight: [
    { ar: 'كشفتوه لكنه عرف الكلمة السرية من تلميحاتكم المكشوفة! كلكم خاسرون الآن 😎🎡', en: 'You caught them, but your hints were too obvious! They guessed the word—you all get punished! 😎🎡' },
  ],
  jesterWin: [
    { ar: 'وقعتوا في فخ المهرّج {name}! صوّتوا ضده عن قصد فخسرتم كلكم! 🤡🎡', en: 'You fell right into Jester {name}’s trap! Everyone else faces the wheel! 🤡🎡' },
  ],
};

export function hostLine(event: HostEvent, lang: Lang, name = ''): string {
  return pick(LINES[event])[lang].split('{name}').join(name);
}

/** 24 universal bluff-catching questions + category-specific questions. */
const GENERAL_PROMPTS: L10n[] = [
  { ar: 'لو هذه الكلمة تباع بفلوس، كم تتوقع سعرها تقريباً ولماذا؟', en: 'If this thing had a price tag, roughly how much would it cost and why?' },
  { ar: 'في أي وقت من اليوم (صباح، ظهر، ليل) نتعامل مع هذه الكلمة أكثر؟', en: 'At what time of day (morning, afternoon, night) does this usually come up?' },
  { ar: 'هل هذه الكلمة تفضّلها لوحدك أم مع مجموعة ناس؟', en: 'Is this something better experienced alone or with a group of people?' },
  { ar: 'صف لنا صوت أو رائحة أو ملمس مرتبط بهذه الكلمة بدون ذكر اسمها!', en: 'Describe a sound, smell, or texture linked to it without naming it!' },
  { ar: 'لو أهديت هذا الشيء لصديقك في الجلسة، هل سيفرح أم ينصدم؟', en: 'If you gifted this to the person next to you, would they be happy or shocked?' },
  { ar: 'متى آخر مرة صادفت أو جربت أو شفت هذا الشيء في الواقع؟', en: 'When was the last time you saw, used, or experienced this in real life?' },
  { ar: 'هل هذا الشيء يناسب الأطفال أم الكبار أكثر؟ ولماذا؟', en: 'Is this more for kids, adults, or everyone? Why?' },
  { ar: 'ما هو أكثر مكان يخطر ببالك فوراً عند سماع هذه الكلمة؟', en: 'What is the very first place that comes to mind when you think of it?' },
  { ar: 'قيّم حبّك لهذه الكلمة من 1 إلى 10 مع ذكر سبب واحد غامض!', en: 'Rate how much you like it from 1 to 10 and give one mysterious reason!' },
  { ar: 'هل هذا الشيء يتحرك أم ثابت؟ وكيف يتغير مع الوقت؟', en: 'Does it move or stay still? How does it change over time?' },
  { ar: 'لو اختفى هذا الشيء من العالم غداً، ما الذي سيتغير في حياتنا؟', en: 'If this vanished from the world tomorrow, what would change in our lives?' },
  { ar: 'ما هو أكثر لون يرتبط في ذهنك بهذه الكلمة؟', en: 'What color do you associate most strongly with this?' },
  { ar: 'هل يرتبط هذا الشيء بالصيف أم الشتاء أم كل الفصول؟', en: 'Is it more connected to summer, winter, or all year round?' },
  { ar: 'لو كان هذا الشيء في حقيبتك الآن، هل سيكون طبيعياً أم مستحيلاً؟', en: 'If this were inside your backpack right now, would that be normal or impossible?' },
  { ar: 'من في هذه الجلسة أكثر شخص يناسبه هذا الشيء برأيك؟', en: 'Who in this room is the most connected to this thing in your opinion?' },
  { ar: 'هل يحتاج هذا الشيء إلى مهارة وتدريب أم أي شخص يقدر عليه؟', en: 'Does it require skill and practice, or can anyone do/use it?' },
  { ar: 'أعطنا 3 صفات فقط (بدون أسماء) تلمّح لهذه الكلمة!', en: 'Give us 3 adjectives only (no nouns) that hint at this word!' },
  { ar: 'هل هذا الشيء يسبب الإزعاج والضوضاء أم الهدوء والراحة؟', en: 'Does it bring noise and chaos, or peace and comfort?' },
  { ar: 'لو صوّرت فيديو تيك توك عن هذه الكلمة، ماذا سيكون عنوان الفيديو؟', en: 'If you filmed a viral video about it, what would the caption be?' },
  { ar: 'هل هذا الشيء قديم وتقليدي أم حديث وعصري؟', en: 'Is it old-school and traditional, or modern and trendy?' },
];

const CATEGORY_PROMPTS: Record<string, L10n[]> = {
  food: [
    { ar: 'هل تؤكل هذه الأكلة ساخنة أم باردة؟ وبـالملعقة أم باليد؟', en: 'Is it eaten hot or cold? With a spoon, fork, or hands?' },
    { ar: 'هل تصلح للفطور الصباحي أم لوليمة عشاء ثقيلة؟', en: 'Is it more of a quick breakfast or a heavy dinner feast?' },
    { ar: 'ما هي الإضافة أو المشروب الذي لا تكتمل هذه الأكلة بدونه؟', en: 'What side dish or drink is an absolute must with it?' },
    { ar: 'لو طلبتها من مطعم، كم دقيقة تستغرق لتجهز تقريباً؟', en: 'If you ordered it at a restaurant, how long would it take to arrive?' },
    { ar: 'هل تحضّرها في البيت بسهولة أم الأفضل شراؤها جاهزة؟', en: 'Is it easy to make at home or much better bought from outside?' },
  ],
  animals: [
    { ar: 'لو واجهت هذا الحيوان فجأة، هل تهرب فوراً أم تصوره؟', en: 'If you met this animal suddenly, would you run away or take a photo?' },
    { ar: 'ما هو حجمه مقارنة بقطة منزلية؟ وأين يعيش غالباً؟', en: 'How big is it compared to a house cat, and where does it live?' },
    { ar: 'هل هذا الحيوان سريع ونشيط أم بطيء وهادئ؟', en: 'Is it fast and hyper, or slow and chill?' },
    { ar: 'هل يطير أم يسبح أم يمشي على أربع؟ ولمّح بدون كشفه!', en: 'How does it move around, and what is its most famous trait?' },
  ],
  places: [
    { ar: 'ماذا يرتدي الناس عادة عند الذهاب إلى هذا المكان؟', en: 'What do people usually wear when they go to this place?' },
    { ar: 'هل تذهب لهذا المكان مجبراً للضرورة أم للاستمتاع والترفيه؟', en: 'Do people go there because they have to, or for fun?' },
    { ar: 'كم ساعة يقضيها الشخص العادي داخل هذا المكان في الزيارة الواحدة؟', en: 'How many hours does a person typically spend there in one visit?' },
    { ar: 'هل هذا المكان مزدحم وصاخب أم هادئ ومنظم؟', en: 'Is this place usually crowded and loud, or quiet and strict?' },
  ],
  jobs: [
    { ar: 'ما هي أهم أداة أو جهاز لا يستطيع صاحب هذه المهنة العمل بدونه؟', en: 'What is the #1 tool this professional cannot work without?' },
    { ar: 'هل تتطلب هذه المهنة مجهوداً بدنياً شاقاً أم تركيزاً ذهنياً؟', en: 'Does this job require heavy physical effort or mental focus?' },
    { ar: 'هل يلبس صاحب هذه المهنة زياً رسمياً خاصاً أم ملابس عادية؟', en: 'Does this job have a recognizable uniform or casual clothes?' },
    { ar: 'في أي ساعة يبدأ يوم العمل في هذه المهنة غالباً؟', en: 'What does a typical workday schedule look like in this job?' },
  ],
  home: [
    { ar: 'في أي غرفة من البيت يوجد هذا الشيء غالباً؟', en: 'Which room of the house is this usually found in?' },
    { ar: 'هل يشتغل بالكهرباء أم بدون كهرباء؟ وكم مرة نستخدمه يومياً؟', en: 'Does it plug into electricity, and how often do we use it daily?' },
    { ar: 'هل يمكن حمله بيد واحدة بسهولة أم يحتاج شخصين؟', en: 'Can you carry it with one hand or does it take two people to move?' },
  ],
  fun: [
    { ar: 'هل تُمارس هذه الهواية في الهواء الطلق أم داخل غرفة مغلقة؟', en: 'Is this done outdoors in the open air or indoors?' },
    { ar: 'كم لاعباً تحتاج لممارستها؟ وهل فيها تعرق وتعب بدني؟', en: 'How many players does it take, and do you break a sweat doing it?' },
    { ar: 'ما هي المعدات أو الأدوات اللازمة للبدء فيها؟', en: 'What gear or equipment do you need to start playing?' },
  ],
  moments: [
    { ar: 'عندما يحصل هذا الموقف، هل أول ردة فعل هي الضحك أم العصبية والتوتر؟', en: 'When this happens, is your first reaction to laugh or panic?' },
    { ar: 'كم مرة حصل لك هذا الموقف خلال السنة الماضية؟', en: 'How many times has this happened to you in the past year?' },
    { ar: 'لو حصل لك هذا الموقف الآن، من أول شخص ستتصل به؟', en: 'If this happened to you right now, who would you call first?' },
  ],
  cities: [
    { ar: 'بماذا تشتهر هذه الوجهة سياحياً أو ثقافياً بدون ذكر اسمها؟', en: 'What is this destination most famous for culturally or for tourists?' },
    { ar: 'كيف يكون الطقس هناك غالباً؟ وكم ساعة طيران تبعد عنا؟', en: 'What is the weather like there, and how long is the flight?' },
    { ar: 'ما هي أول أكلة أو معلم يخطر ببالك عند زيارة هذا المكان؟', en: 'What food or landmark comes to mind when visiting there?' },
  ],
};

export function randomPrompt(lang: Lang, catId?: string, exclude?: string): string {
  const specific = catId && CATEGORY_PROMPTS[catId] ? CATEGORY_PROMPTS[catId] : [];
  // Weight category-specific questions higher while keeping variety from general prompts
  const pool = [...specific, ...specific, ...GENERAL_PROMPTS];
  for (let i = 0; i < 6; i++) {
    const candidate = pick(pool)[lang];
    if (candidate !== exclude) return candidate;
  }
  return pick(pool)[lang];
}

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
