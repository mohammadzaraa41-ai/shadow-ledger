import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { L10n, Msg, TargetProfile, Text } from './game/types';

export type Lang = 'ar' | 'en';

type Dict = Record<string, string>;

const ar: Dict = {
  // splash
  'splash.title': 'دفتر الظل', 'splash.sub': 'كل اسم تكتبه… يقرؤه أحدهم.',
  'splash.r1': 'اكتب الاسم الصحيح مع وجهه، فيموت صاحبه.',
  'splash.r2': 'كل ميتة تترك أثراً. المحقق يراقب النمط.',
  'splash.r3': 'لا تثق بكل خبر. بعضه فخّ.',
  'splash.start': 'افتح الدفتر', 'splash.howto': 'كيف تلعب', 'splash.restart': 'ابدأ من جديد',
  // status
  'st.day': 'اليوم', 'st.endDay': 'إنهاء اليوم', 'st.suspects': 'اشتباه المحقق بك', 'st.help': 'شرح',
  // terminal
  'tab.investigate': 'التحرّي', 'chan.NEWS': 'الأخبار', 'chan.POLICE': 'الشرطة', 'chan.CAMERA': 'المراقبة', 'chan.WIRETAP': 'تنصت الشرطة 📡',
  'hint': 'المس الاسم أو الوجه أو الموقع لتدوينه. الخبر بلا ملف شرطة… قد يكون فخّاً.',
  'unverified': 'غير مؤكد', 'scope.national': 'وطني', 'scope.local': 'محلي · {r}',
  'l.typing': 'المحقق يحلل…', 'case.title': 'ملف القضية', 'case.none': 'لا يوجد نمط بعد.',
  'case.profile': 'الفاعل على الأرجح: {occ} — ينشط بين {from}:00 و{to}:00',
  'case.conf': 'ثقة المحقق: {n}%', 'map.title': 'خريطة الاشتباه', 'map.hint': 'المس منطقة لعرض التفاصيل.',
  'map.info': '{r}: اشتباه {p}% · وفيات: {k}', 'map.narrowed': '⚠ حصر المحقق منطقتك في {r}', 'hist.title': 'توقيت الوفيات',
  'face.default': 'صورة هوية', 'face.hidden': 'الاسم: [محجوب]', 'face.tv': 'صورة بثّتها القناة', 'face.mask': 'القناع سقط',
  // ledger
  'cover.pending': 'قيد التنفيذ {n}', 'cover.swipe': 'اسحب لأعلى',
  'led.name': 'الاسم', 'led.paste': 'استحضار الهوية 👁️', 'led.face': 'صورة الوجه', 'led.attach': 'تثبيت الوجه بالذاكرة', 'led.cause': 'سبب الوفاة',
  'led.place': 'المكان: {p}', 'led.needRoutine': 'اكتب الاسم، ثم اكتشف روتينه من المراقبة.',
  'led.frame': 'ألصق التهمة بـ', 'led.write': 'تنفيذ الحكم',
  'whisper.btn': 'همس الظل 👁️', 'whisper.title': 'همس قرين الظل',
  'rules.btn': 'قواعد الدفتر', 'rules.title': 'قواعد دفتر الظل المحرّمة',
  'method.CARDIAC.title': 'سكتة قلبية', 'method.CARDIAC.desc': 'فوري ومضمون 100%', 'method.CARDIAC.risk': '+15% شبهة',
  'method.ACCIDENT.title': 'حادث مُدبَّر', 'method.ACCIDENT.desc': 'يتطلب روتين الهدف — ينفذ غداً', 'method.ACCIDENT.risk': '0% شبهة',
  'method.FALSE_LEAD.title': 'انتحار / خيط كاذب', 'method.FALSE_LEAD.desc': 'يُلصق التهمة بفصيل آخر', 'method.FALSE_LEAD.risk': '−3% شبهة',
  // errors
  'err.empty': 'الدفتر فارغ. اكتب اسماً.', 'err.nomatch': 'لا هوية موثقة بهذا الاسم. الدفتر لا يستجيب.',
  'err.noface': 'أرفق صورة الوجه. الاسم وحده لا يكفي.', 'err.mismatch': 'الوجه لا يطابق الاسم. الدفتر يرفض.',
  'err.written': 'هذا الاسم مكتوب مسبقاً.', 'err.faction': 'اختر الفصيل الذي ستُلصق به التهمة.',
  'err.routine': 'لا تعرف روتين الهدف. ابحث في كاميرات المراقبة.', 'err.hour': 'اختر ساعة ضمن نافذة روتين الهدف.',
  // report
  'rep.title': 'اليوم {d} — انتهى', 'rep.none': 'لا أسماء كُتبت اليوم.', 'rep.susp': 'الشبهة', 'rep.continue': 'متابعة',
  'rep.ok': '✓ {name} — تم التنفيذ', 'rep.fail': '✗ {name} — {reason}',
  // endings
  'end.WON.t': 'العدالة تحققت', 'end.WON.d': 'سقط الفاسدون وسقط المحقق. العالم الجديد لك.',
  'end.ARRESTED.t': 'انتهى الأمر', 'end.ARRESTED.d': 'بلغت الشبهة 100%. اقتحمت الشرطة غرفتك.',
  'end.TRAPPED.t': 'وقعتَ في الفخ', 'end.TRAPPED.d': 'عضضتَ الطُّعم الإقليمي مرتين. المحقق عرف عنوانك.',
  'end.TIMEOUT.t': 'تلاشى الزخم', 'end.TIMEOUT.d': 'مرّت الأيام ولم تكتمل مهمتك.',
  // engine messages
  'f.detAttempt': 'محاولة فاشلة ضد المحقق', 'f.CARDIAC': 'أسلوب: سكتة قلبية', 'f.ACCIDENT': 'أسلوب: حادث مُدبَّر', 'f.FALSE_LEAD': 'أسلوب: خيط كاذب',
  'f.regional': 'فخ إقليمي: المنطقة كُشفت', 'f.national': 'استجاب لخبر وطني كاذب', 'f.mass': 'وفيات متزامنة كثيرة',
  'f.geo': 'تجمّع جغرافي للضحايا', 'f.time': 'ارتباط توقيت الوفيات بجدولك',
  'r.immune': 'المحقق محصّن ضد السكتة القلبية',
  'note.initial': 'لا بيانات كافية بعد. سأنتظر خطأك الأول.',
  'note.attempt': 'أحدهم حاول إيقاف قلبي… لكن ليس بهذه الطريقة. أنت تعرف اسمي إذن.',
  'note.regional': 'الخبر بُثّ في {r} فقط… والفاعل تصرّف بناءً عليه.',
  'note.national': 'الفاعل يتابع الإعلام الوطني. معلومة مفيدة.',
  'note.estimate': 'القاتل على الأرجح {occ}، من {r}، ينشط حوالي {h}:00.',
  'news.CARDIAC': 'وفاة مفاجئة بسكتة قلبية: {name}', 'news.ACCIDENT': 'مصرع {name} في حادث غامض عند {place}',
  'news.FALSE_LEAD': 'انتحار {name}.. والشرطة تحقق في صلة بـ{faction}', 'news.FALSE_LEAD.x': 'انتحار {name}.. والشرطة تحقق في صلة بجهة مجهولة',
  'news.body': '{precinct} تفتح ملفاً.',
  'news.decoy.n': 'عاجل وطنياً: {name} يفلت من العدالة', 'news.decoy.r': 'خبر محلي حصري في {r}: {name} يُطلق سراحه',
  'news.unconfirmed': 'مصدر غير مؤكد: ',
  'src.agency': 'وكالة الأنباء — عاجل', 'src.tv': 'القناة الوطنية — مباشر', 'src.radio': 'إذاعة {r} المحلية', 'src.presser': 'مؤتمر صحفي — فرقة التحقيق',
  'news.presser': 'المحقق يعلن ملامح الفاعل',
  'cam.spotted': 'رُصد {title} هنا: ', 'cam.pattern': 'نمط ثابت: ', 'roster.lead': 'كبير المحققين (Cipher): ',
  // tutorial
  'tut.title': 'كيف تلعب', 'tut.next': 'التالي', 'tut.prev': 'السابق', 'tut.done': 'ابدأ اللعب', 'tut.skip': 'إغلاق',
  'tut.1.t': 'هدفك', 'tut.1.b': 'أنت العقل المدبّر. تملك دفتراً يسقط من تُكتب هويته فيه. قضِ على كل الفاسدين (وزير، قاضٍ، مدير شرطة) ثم على المحقق، قبل أن تصل الشبهة إلى 100%.',
  'tut.2.t': 'اجمع الهوية', 'tut.2.b': 'لإسقاط أي هدف تحتاج شيئين: اسمه الكامل ووجهه. في تبويب «التحرّي» ابحث في الأخبار، ملفات الشرطة، وكاميرات المراقبة. المس الاسم (الدائرة الحمراء) والوجه (الصورة) لنسخهما.',
  'tut.3.t': 'اكتب في الدفتر', 'tut.3.b': 'اسحب الدفتر من الأسفل. الصق الاسم، أرفق الوجه، اختر سبب الوفاة ثم اضغط «اكتب». إن لم يتطابق الاسم مع الوجه يرفض الدفتر.',
  'tut.4.t': 'طرق الإسقاط', 'tut.4.b': 'سكتة قلبية: فورية لكن +15% شبهة. حادث مُدبَّر: بلا شبهة، لكنه يحتاج روتين الهدف (المس الموقع في المراقبة) وينفّذ غداً. خيط كاذب: يلصق التهمة بفصيل ويخفّض الشبهة قليلاً.',
  'tut.5.t': 'كيف يطاردك المحقق', 'tut.5.b': 'يحلل المحقق ساعات الوفيات فيستنتج جدولك، ويرصد تجمّع الضحايا في منطقة واحدة لتحديد مكانك. وزّع الأوقات والمناطق، وتابع «مرصد التحقيق» لتعرف ما يظنه عنك.',
  'tut.6.t': 'الفخاخ الإعلامية', 'tut.6.b': 'يبثّ المحقق أخباراً كاذبة. الخبر بلا ملف شرطة يؤكده فخ محتمل. تنفيذ خبر إقليمي كاذب يكشف منطقتك، والمرة الثانية تعني الهزيمة.',
  'tut.7.t': 'الوقت والفوز', 'tut.7.b': 'زر +1H يقدّم الساعة، و«إنهاء اليوم» ينفّذ الأسماء ويبدأ دور المحقق. المحقق محصّن ضد السكتة القلبية، فاقتله بحادث. تفوز بإسقاط كل الفاسدين والمحقق، وتخسر إن بلغت الشبهة 100% أو انتهت 24 يوماً.',
};

const en: Dict = {
  'splash.title': 'Shadow Ledger', 'splash.sub': 'Every name you write… someone reads.',
  'splash.r1': 'Write the right name with the right face, and its owner dies.',
  'splash.r2': 'Every death leaves a trace. The detective watches for patterns.',
  'splash.r3': "Don't trust every headline. Some are traps.",
  'splash.start': 'Open the ledger', 'splash.howto': 'How to play', 'splash.restart': 'Start over',
  // status
  'st.day': 'DAY', 'st.endDay': 'End day', 'st.suspects': 'DETECTIVE SUSPECTS YOU', 'st.help': 'Help',
  'tab.investigate': 'Investigate', 'chan.NEWS': 'News', 'chan.POLICE': 'Police', 'chan.CAMERA': 'Cameras', 'chan.WIRETAP': 'Police Wiretap 📡',
  'hint': 'Tap a name, face or location to copy it. A story with no police file… may be a trap.',
  'unverified': 'UNVERIFIED', 'scope.national': 'National', 'scope.local': 'Local · {r}',
  'l.typing': 'typing…', 'case.title': 'Case file', 'case.none': 'No pattern yet.',
  'case.profile': 'Likely culprit: {occ} — active between {from}:00 and {to}:00',
  'case.conf': "Detective's confidence: {n}%", 'map.title': 'Suspicion map', 'map.hint': 'Tap a region for details.',
  'map.info': '{r}: suspicion {p}% · deaths: {k}', 'map.narrowed': '⚠ Detective has narrowed you down to {r}', 'hist.title': 'Time of deaths',
  'face.default': 'ID PHOTO', 'face.hidden': 'Name: [REDACTED]', 'face.tv': 'Photo aired by the channel', 'face.mask': 'Mask is off',
  'cover.pending': '{n} pending', 'cover.swipe': 'Swipe up',
  'led.name': 'Name', 'led.paste': 'Channel Identity 👁️', 'led.face': 'Face ID', 'led.attach': 'Imprint in Mind', 'led.cause': 'Cause of death',
  'led.place': 'Place: {p}', 'led.needRoutine': 'Write a name, then discover its routine via the cameras.',
  'led.frame': 'Frame', 'led.write': 'EXECUTE VERDICT',
  'whisper.btn': 'Shadow Whisper 👁️', 'whisper.title': 'Whisper of the Shadow Entity',
  'rules.btn': 'Ledger Rules', 'rules.title': 'Forbidden Rules of the Shadow Ledger',
  'method.CARDIAC.title': 'Cardiac arrest', 'method.CARDIAC.desc': 'Instant, 100% success', 'method.CARDIAC.risk': '+15% suspicion',
  'method.ACCIDENT.title': 'Staged accident', 'method.ACCIDENT.desc': "Needs target's routine — happens tomorrow", 'method.ACCIDENT.risk': '0% suspicion',
  'method.FALSE_LEAD.title': 'Suicide / false lead', 'method.FALSE_LEAD.desc': 'Pins it on another faction', 'method.FALSE_LEAD.risk': '−3% suspicion',
  'err.empty': 'The ledger is empty. Write a name.', 'err.nomatch': 'No known identity with that name. The ledger stays silent.',
  'err.noface': 'Attach a face. A name alone is not enough.', 'err.mismatch': 'The face does not match the name. The ledger refuses.',
  'err.written': 'This name is already written.', 'err.faction': 'Choose a faction to frame.',
  'err.routine': "You don't know the target's routine. Check the cameras.", 'err.hour': "Pick an hour inside the target's routine window.",
  'rep.title': 'Day {d} — over', 'rep.none': 'No names written today.', 'rep.susp': 'Suspicion', 'rep.continue': 'Continue',
  'rep.ok': '✓ {name} — done', 'rep.fail': '✗ {name} — {reason}',
  'end.WON.t': 'Justice served', 'end.WON.d': 'The corrupt fell, and so did the detective. The new world is yours.',
  'end.ARRESTED.t': "It's over", 'end.ARRESTED.d': 'Suspicion hit 100%. The police burst into your room.',
  'end.TRAPPED.t': 'You fell for the trap', 'end.TRAPPED.d': 'You took the regional bait twice. The detective knows your address.',
  'end.TIMEOUT.t': 'Momentum lost', 'end.TIMEOUT.d': 'The days passed and your mission was never finished.',
  'f.detAttempt': 'Failed attempt on the detective', 'f.CARDIAC': 'Method: cardiac arrest', 'f.ACCIDENT': 'Method: staged accident', 'f.FALSE_LEAD': 'Method: false lead',
  'f.regional': 'Regional trap: your area exposed', 'f.national': 'Reacted to false national news', 'f.mass': 'Too many simultaneous deaths',
  'f.geo': 'Victims cluster geographically', 'f.time': 'Death times match your schedule',
  'r.immune': 'The detective is immune to cardiac arrest',
  'note.initial': "Not enough data yet. I'll wait for your first mistake.",
  'note.attempt': "Someone tried to stop my heart… but not like this. So you know my name.",
  'note.regional': 'That story aired only in {r}… and the culprit acted on it.',
  'note.national': 'The culprit follows national media. Useful.',
  'note.estimate': 'The killer is most likely {occ}, from {r}, active around {h}:00.',
  'news.CARDIAC': 'Sudden death by cardiac arrest: {name}', 'news.ACCIDENT': '{name} dies in mysterious accident at {place}',
  'news.FALSE_LEAD': 'Suicide of {name}.. police probe links to {faction}', 'news.FALSE_LEAD.x': 'Suicide of {name}.. police probe unknown links',
  'news.body': '{precinct} opens a file.',
  'news.decoy.n': 'BREAKING: {name} escapes justice', 'news.decoy.r': 'Exclusive local news in {r}: {name} released',
  'news.unconfirmed': 'Unconfirmed source: ',
  'src.agency': 'News Agency — Breaking', 'src.tv': 'National TV — Live', 'src.radio': '{r} Local Radio', 'src.presser': 'Press conference — Task force',
  'news.presser': 'Detective reveals culprit profile',
  'cam.spotted': '{title} spotted here: ', 'cam.pattern': 'Fixed pattern: ', 'roster.lead': 'Lead detective (Cipher): ',
  // tutorial
  'tut.title': 'How to play', 'tut.next': 'Next', 'tut.prev': 'Back', 'tut.done': 'Start playing', 'tut.skip': 'Close',
  'tut.1.t': 'Your goal', 'tut.1.b': 'You are the mastermind. Your ledger eliminates whoever’s identity is written in it. Eliminate every corrupt figure (minister, judge, police chief) and then the detective, before suspicion reaches 100%.',
  'tut.2.t': 'Gather the identity', 'tut.2.b': 'To eliminate a target you need two things: their full name and their face. In the “Investigate” tab, search the news, police files and surveillance cameras. Tap the name (red circle) and the face (photo) to copy them.',
  'tut.3.t': 'Write in the ledger', 'tut.3.b': 'Swipe the ledger up from the bottom. Paste the name, attach the face, pick a cause of death, then press “Write”. If name and face don’t match, the ledger refuses.',
  'tut.4.t': 'Methods of elimination', 'tut.4.b': 'Cardiac arrest: instant but +15% suspicion. Staged accident: no suspicion, but needs the target’s routine (tap the location in the cameras) and happens tomorrow. False lead: frames a faction and lowers suspicion slightly.',
  'tut.5.t': 'How Detective hunts you', 'tut.5.b': 'The detective studies the hours of the deaths to infer your schedule, and spots victims clustering in one region to locate you. Spread out your timing and places, and check the investigation tab to see what he thinks of you.',
  'tut.6.t': 'Media traps', 'tut.6.b': 'The detective broadcasts false stories. A story without a confirming police file is a possible trap. Acting on a false regional story exposes your region, and a second time means defeat.',
  'tut.7.t': 'Time & victory', 'tut.7.b': 'The +1H button advances the hour; “End day” executes the names and starts the detective’s turn. The detective is immune to cardiac arrest, so strike him with a staged accident. You win by eliminating every corrupt figure and the detective; you lose if suspicion hits 100% or 24 days pass.',
};

const dicts: Record<Lang, Dict> = { ar, en };

const isL10n = (v: unknown): v is L10n => typeof v === 'object' && v !== null && 'ar' in v && 'en' in v;

export function translate(lang: Lang, key: string, p?: Msg['p']): string {
  let s = dicts[lang][key] ?? key;
  if (p) for (const [k, v] of Object.entries(p)) s = s.split(`{${k}}`).join(isL10n(v) ? v[lang] : String(v));
  return s;
}

export function resolve(lang: Lang, x: Text | string | undefined): string {
  if (x === undefined) return '';
  if (typeof x === 'string') return x;
  return 'k' in x ? translate(lang, x.k, x.p) : x[lang];
}

/** Normalizes a typed name for matching (case/diacritics/Arabic letter variants/spaces). */
export const normName = (s: string) =>
  s
    .replace(/[\u0640\u064B-\u065F\u0670]/g, '') // Remove Tatweel and Tashkeel
    .replace(/[أإآٱ]/g, 'ا') // Normalize all Alef forms to plain Alef
    .replace(/ة/g, 'ه') // Normalize Taa Marbuta to Haa
    .replace(/[ىي]/g, 'ي') // Normalize Alef Maksura and Yaa
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

export const matchesName = (t: TargetProfile, input: string) =>
  normName(input) !== '' && (normName(t.name.ar) === normName(input) || normName(t.name.en) === normName(input));

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, p?: Msg['p']) => string;
  tx: (x: Text | string | undefined) => string;
}
const LangCtx = createContext<Ctx>(null!);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('lang') as Lang) || 'ar');
  useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);
  const t = useCallback((k: string, p?: Msg['p']) => translate(lang, k, p), [lang]);
  const tx = useCallback((x: Text | string | undefined) => resolve(lang, x), [lang]);
  const value = useMemo(() => ({ lang, setLang, t, tx }), [lang, t, tx]);
  return createElement(LangCtx.Provider, { value }, children);
}

export const useLang = () => useContext(LangCtx);
