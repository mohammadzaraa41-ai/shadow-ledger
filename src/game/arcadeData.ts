import { pick, shuffle } from './engine';
import type { L10n } from './types';

export interface ArcadeCard {
  emoji: string;
  tag: L10n;
  title: L10n;
  hint: L10n;
}

/** 36 iconic movies, series, cartoons, and hilarious silent-acting situations for Charades (بدون كلام). */
export const CHARADES_DECK: ArcadeCard[] = [
  {
    emoji: '🦁👑',
    tag: { ar: 'فيلم كرتون', en: 'Animated Movie' },
    title: { ar: 'الأسد الملك (سيمبا)', en: 'The Lion King' },
    hint: { ar: 'مثّل مشهد رفع الشبل الصغير فوق الصخرة!', en: 'Act out lifting the cub on Pride Rock!' },
  },
  {
    emoji: '🚢🧊',
    tag: { ar: 'فيلم عالمي', en: 'Classic Movie' },
    title: { ar: 'تايتانيك (Titanic)', en: 'Titanic' },
    hint: { ar: 'مثّل الوقوف في مقدمة السفينة وفرد اليدين ثم الغرق!', en: 'Arms spread at the bow of the ship, then sinking!' },
  },
  {
    emoji: '🕷️🕸️',
    tag: { ar: 'فيلم أبطال خارقين', en: 'Superhero Movie' },
    title: { ar: 'سبايدرمان (الرجل العنكبوت)', en: 'Spider-Man' },
    hint: { ar: 'مثّل إطلاق الشباك من المعصم والتسلق على الجدران!', en: 'Shoot webs from your wrists and climb walls!' },
  },
  {
    emoji: '⚡🧙‍♂️',
    tag: { ar: 'فيلم خيال', en: 'Fantasy Movie' },
    title: { ar: 'هاري بوتر (Harry Potter)', en: 'Harry Potter' },
    hint: { ar: 'مثّل النظارة الدائرية والعصا السحرية والطيران على المكنسة!', en: 'Round glasses, magic wand, and flying on a broom!' },
  },
  {
    emoji: '🔍👓',
    tag: { ar: 'أنمي مشهور', en: 'Famous Anime' },
    title: { ar: 'المحقق كونان', en: 'Detective Conan' },
    hint: { ar: 'مثّل ربطة العنق المغيرة للصوت وإبر التخدير في الساعة!', en: 'Bow-tie voice changer and wristwatch stun dart!' },
  },
  {
    emoji: '⚽🦅',
    tag: { ar: 'أنمي رياضي', en: 'Sports Anime' },
    title: { ar: 'الكابتن ماجد', en: 'Captain Tsubasa' },
    hint: { ar: 'مثّل الركض الطويل بالكرة وتسديدة النمر الخارقة في الهواء!', en: 'Endless running and a dramatic mid-air overhead kick!' },
  },
  {
    emoji: '🐱🐭',
    tag: { ar: 'كرتون كلاسيكي', en: 'Classic Cartoon' },
    title: { ar: 'توم وجيري (Tom & Jerry)', en: 'Tom & Jerry' },
    hint: { ar: 'مثّل مطاردة مجنونة ومقالب متبادلة بين قط وفأر!', en: 'Frantic cat-and-mouse chase with slapstick traps!' },
  },
  {
    emoji: '🧞‍♂️🪔',
    tag: { ar: 'فيلم كرتون', en: 'Animated Movie' },
    title: { ar: 'علاء الدين والمصباح السحري', en: 'Aladdin & The Magic Lamp' },
    hint: { ar: 'مثّل فرك المصباح السحري وخروج المارد العملاق والبساط الطائر!', en: 'Rub the lamp, summon the Genie, and ride a magic carpet!' },
  },
  {
    emoji: '🦇🚗',
    tag: { ar: 'فيلم أبطال خارقين', en: 'Superhero Movie' },
    title: { ar: 'باتمان (الرجل الوطواط)', en: 'Batman' },
    hint: { ar: 'مثّل الرداء الأسود والأذنين المدببتين والقفز من الأسطح!', en: 'Cape, pointy ears, and brooding rooftop jump!' },
  },
  {
    emoji: '🐠🌊',
    tag: { ar: 'فيلم كرتون', en: 'Animated Movie' },
    title: { ar: 'البحث عن نيمو (Finding Nemo)', en: 'Finding Nemo' },
    hint: { ar: 'مثّل سمكة صغيرة بزعنفة قصيرة تائهة في المحيط!', en: 'Little fish with a tiny fin lost in the ocean!' },
  },
  {
    emoji: '🧸🚗',
    tag: { ar: 'كوميديا صامتة', en: 'Comedy Show' },
    title: { ar: 'مستر بين (Mr. Bean)', en: 'Mr. Bean' },
    hint: { ar: 'مثّل تعابير الوجه المضحكة والدبدوب الصغير والقيادة الغريبة!', en: 'Goofy facial expressions and hugging a tiny teddy bear!' },
  },
  {
    emoji: '❄️👸',
    tag: { ar: 'فيلم كرتون', en: 'Animated Movie' },
    title: { ar: 'فروزن (ملكة الثلج)', en: 'Frozen' },
    hint: { ar: 'مثّل إطلاق الثلج من اليدين وبناء رجل ثلج متحرك!', en: 'Shoot ice magic from your hands and build a snowman!' },
  },
  {
    emoji: '🍄👨‍🔧',
    tag: { ar: 'فيلم وألعاب', en: 'Movie & Game' },
    title: { ar: 'سوبر ماريو (Super Mario)', en: 'Super Mario' },
    hint: { ar: 'مثّل القفز لضرب الصناديق بالرأس والدخول في الأنابيب!', en: 'Jump to punch blocks above your head and go down pipes!' },
  },
  {
    emoji: '🦖🚙',
    tag: { ar: 'فيلم مغامرات', en: 'Adventure Movie' },
    title: { ar: 'حديقة الديناصورات (Jurassic Park)', en: 'Jurassic Park' },
    hint: { ar: 'مثّل ديناصور تي ركس عملاق يطارد سيارة في الغابة!', en: 'Giant T-Rex chasing a jeep through the jungle!' },
  },
  {
    emoji: '🦈🏊',
    tag: { ar: 'فيلم تشويق', en: 'Thriller Movie' },
    title: { ar: 'الفك المفترس (Jaws)', en: 'Jaws' },
    hint: { ar: 'مثّل زعنفة قرش فوق الرأس ومهاجمة السباحين في البحر!', en: 'Shark fin on your head sneaking up on swimmers!' },
  },
  {
    emoji: '🥊🏆',
    tag: { ar: 'فيلم رياضي', en: 'Sports Movie' },
    title: { ar: 'روكي (Rocky)', en: 'Rocky' },
    hint: { ar: 'مثّل التدريب بالملاكمة وصعود الدرج والاحتفال برفع اليدين!', en: 'Shadowboxing, running up stairs, and arms raised in victory!' },
  },
  {
    emoji: '🏠👦',
    tag: { ar: 'فيلم عائلي', en: 'Family Movie' },
    title: { ar: 'وحدي في المنزل (Home Alone)', en: 'Home Alone' },
    hint: { ar: 'مثّل وضع اليدين على الخدين بصدمة ونصب الفخاخ للصوص!', en: 'Hands on cheeks screaming in shock and setting booby traps!' },
  },
  {
    emoji: '🕶️💊',
    tag: { ar: 'فيلم خيال علمي', en: 'Sci-Fi Movie' },
    title: { ar: 'ذا ماتريكس (The Matrix)', en: 'The Matrix' },
    hint: { ar: 'مثّل تفادي الرصاص بالانحناء للخلف بالحركة البطيئة!', en: 'Slow-motion backward bullet-dodge lean!' },
  },
  // تمثيل مواقف كوميدية صامتة
  {
    emoji: '🦟🌑',
    tag: { ar: 'موقف كوميدي', en: 'Funny Situation' },
    title: { ar: 'يحاول يصيد ناموسة في الظلام', en: 'Hunting a Mosquito in the Dark' },
    hint: { ar: 'مثّل سماع الطنين عند الأذن والتصفيق العشوائي في الهواء!', en: 'Hear buzzing by your ear and slap wildly in the air!' },
  },
  {
    emoji: '🏖️🔥',
    tag: { ar: 'موقف كوميدي', en: 'Funny Situation' },
    title: { ar: 'يمشي حافي على رمل الشاطئ الحار', en: 'Walking Barefoot on Burning Sand' },
    hint: { ar: 'مثّل القفز السريع من شدة حرارة الأرض والبحث عن ظل!', en: 'Hop frantically from foot to foot on scorching sand!' },
  },
  {
    emoji: '🍋😖',
    tag: { ar: 'موقف كوميدي', en: 'Funny Situation' },
    title: { ar: 'يأكل ليمونة حامضة ويحاول يبتسم للضيوف', en: 'Eating a Sour Lemon While Smiling Polite' },
    hint: { ar: 'مثّل عصر ملامح الوجه من الحموضة ثم التظاهر بابتسامة مؤدبة!', en: 'Wince from extreme sourness then force a polite smile!' },
  },
  {
    emoji: '🫙💪',
    tag: { ar: 'موقف كوميدي', en: 'Funny Situation' },
    title: { ar: 'يحاول يفتح علبة مخلل مستحيلة الفتح', en: 'Trying to Open a Stuck Pickle Jar' },
    hint: { ar: 'مثّل استعراض العضلات والمعاناة ثم إعطائها لشخص آخر يفتحها بسهولة!', en: 'Strain with all your might, fail, and hand it over!' },
  },
  {
    emoji: '🦶🪑',
    tag: { ar: 'موقف كوميدي', en: 'Funny Situation' },
    title: { ar: 'صدم إصبعه الصغير بطرف الطاولة بالليل', en: 'Stubbing Your Pinky Toe in the Dark' },
    hint: { ar: 'مثّل المشي بهدوء ثم الصدمة والقفز على رجل واحدة بصمت!', en: 'Tiptoe quietly, stub your toe, and hop in silent agony!' },
  },
  {
    emoji: '🍝👔',
    tag: { ar: 'موقف كوميدي', en: 'Funny Situation' },
    title: { ar: 'يسحب مكرونة سباغيتي وتنثر الصلصة على قميصه', en: 'Slurping Spaghetti & Splashing Sauce' },
    hint: { ar: 'مثّل لف الشوكة وشفط المكرونة ثم مسح البقعة بفزع!', en: 'Twirl the fork, slurp, and panic over a shirt stain!' },
  },
];

/** 48 fast-guess visual cards for Heads-Up / Forehead Mode (على جبينك). */
export const HEADSUP_DECK: ArcadeCard[] = [
  { emoji: '🦁', tag: { ar: 'حيوان', en: 'Animal' }, title: { ar: 'أسد', en: 'Lion' }, hint: { ar: 'ملك الغابة', en: 'King of the jungle' } },
  { emoji: '🐧', tag: { ar: 'حيوان', en: 'Animal' }, title: { ar: 'بطريق', en: 'Penguin' }, hint: { ar: 'طائر يمشي على الجليد ولا يطير', en: 'Tuxedo bird on ice' } },
  { emoji: '🦘', tag: { ar: 'حيوان', en: 'Animal' }, title: { ar: 'كنغر', en: 'Kangaroo' }, hint: { ar: 'يقفز ويحمل صغيره في جيبه', en: 'Jumps with a pouch' } },
  { emoji: '🦒', tag: { ar: 'حيوان', en: 'Animal' }, title: { ar: 'زرافة', en: 'Giraffe' }, hint: { ar: 'أطول رقبة في العالم', en: 'Tallest neck' } },
  { emoji: '🐙', tag: { ar: 'حيوان', en: 'Animal' }, title: { ar: 'أخطبوط', en: 'Octopus' }, hint: { ar: 'في البحر وله 8 أذرع', en: '8 tentacles in the sea' } },
  { emoji: '🦜', tag: { ar: 'حيوان', en: 'Animal' }, title: { ar: 'ببغاء', en: 'Parrot' }, hint: { ar: 'طائر ملون يعيد كلامك', en: 'Colorful bird that talks' } },
  { emoji: '🐪', tag: { ar: 'حيوان', en: 'Animal' }, title: { ar: 'جمل', en: 'Camel' }, hint: { ar: 'سفينة الصحراء وله سنام', en: 'Ship of the desert' } },
  { emoji: '🦥', tag: { ar: 'حيوان', en: 'Animal' }, title: { ar: 'حيوان الكسلان', en: 'Sloth' }, hint: { ar: 'أبطأ حيوان ويتعلق بالشجر', en: 'Slowest tree animal' } },

  { emoji: '👨‍🚀', tag: { ar: 'شخصية ومهنة', en: 'Role' }, title: { ar: 'رائد فضاء', en: 'Astronaut' }, hint: { ar: 'يسافر إلى القمر بدون جاذبية', en: 'Walks on the moon' } },
  { emoji: '🦷', tag: { ar: 'شخصية ومهنة', en: 'Role' }, title: { ar: 'طبيب أسنان', en: 'Dentist' }, hint: { ar: 'يقول لك افتح فمك!', en: 'Says open wide!' } },
  { emoji: '🕵️‍♂️', tag: { ar: 'شخصية ومهنة', en: 'Role' }, title: { ar: 'محقق سري', en: 'Secret Detective' }, hint: { ar: 'عدسة مكبرة ويبحث عن الأدلة', en: 'Magnifying glass & clues' } },
  { emoji: '🥷', tag: { ar: 'شخصية', en: 'Character' }, title: { ar: 'نينجا', en: 'Ninja' }, hint: { ar: 'متخفي بالأسود ويقفز بصمت', en: 'Stealth warrior in black' } },
  { emoji: '🧛‍♂️', tag: { ar: 'شخصية', en: 'Character' }, title: { ar: 'مصاص دماء (دراكولا)', en: 'Vampire' }, hint: { ar: 'أنياب طويلة ويخاف من الشمس والثوم', en: 'Fangs, cape, hates garlic' } },
  { emoji: '🧟‍♂️', tag: { ar: 'شخصية', en: 'Character' }, title: { ar: 'زومبي', en: 'Zombie' }, hint: { ar: 'يمشي ماداً يديه للأمام!', en: 'Walks with arms stretched out' } },
  { emoji: '🦸‍♂️', tag: { ar: 'شخصية', en: 'Character' }, title: { ar: 'سوبرمان', en: 'Superman' }, hint: { ar: 'يطير برداء أحمر وحرف S', en: 'Flies with a red cape' } },
  { emoji: '👶', tag: { ar: 'شخصية', en: 'Character' }, title: { ar: 'طفل رضيع يبكي', en: 'Crying Baby' }, hint: { ar: 'حليب ولهاية وبكاء بالليل', en: 'Pacifier, bottle, crying' } },

  { emoji: '🌯', tag: { ar: 'أكلة', en: 'Food' }, title: { ar: 'شاورما', en: 'Shawarma' }, hint: { ar: 'سيخ يدور وثوم ومخلل', en: 'Spinning spit & garlic sauce' } },
  { emoji: '🍕', tag: { ar: 'أكلة', en: 'Food' }, title: { ar: 'بيتزا', en: 'Pizza' }, hint: { ar: 'إيطالية دائرية مقسمة مثلثات بالجبن', en: 'Round cheesy triangles' } },
  { emoji: '🍿', tag: { ar: 'أكلة', en: 'Food' }, title: { ar: 'فشار (بوب كورن)', en: 'Popcorn' }, hint: { ar: 'يفرقع في القدر ونأكله بالسينما', en: 'Pops and eaten at the cinema' } },
  { emoji: '🍦', tag: { ar: 'أكلة', en: 'Food' }, title: { ar: 'آيس كريم', en: 'Ice Cream' }, hint: { ar: 'بارد جداً ويذوب في الحر', en: 'Cold scoop that melts fast' } },
  { emoji: '🍣', tag: { ar: 'أكلة', en: 'Food' }, title: { ar: 'سوشي', en: 'Sushi' }, hint: { ar: 'أكلة يابانية بالسمك والأرز والأعواد', en: 'Japanese rice & fish rolls' } },
  { emoji: '☕', tag: { ar: 'مشروب', en: 'Drink' }, title: { ar: 'قهوة عربية وهيل', en: 'Arabic Coffee' }, hint: { ar: 'دلة وفنجان وتمر', en: 'Served in a small cup with dates' } },

  { emoji: '🤳', tag: { ar: 'حركة وموقف', en: 'Action' }, title: { ar: 'يلتقط سيلفي', en: 'Taking a Selfie' }, hint: { ar: 'يمد يده بالجوال ويبتسم للكاميرا', en: 'Arm out posing for front camera' } },
  { emoji: '🏋️‍♂️', tag: { ar: 'حركة وموقف', en: 'Action' }, title: { ar: 'يرفع أثقال بالنادي', en: 'Lifting Heavy Weights' }, hint: { ar: 'عضلات وحديد ثقيل في الجيم', en: 'Gym barbell & muscles' } },
  { emoji: '🎣', tag: { ar: 'حركة وموقف', en: 'Action' }, title: { ar: 'يصيد سمك بالصنارة', en: 'Fishing with a Rod' }, hint: { ar: 'يرمي الصنارة في البحر وينتظر', en: 'Casting a line into water' } },
  { emoji: '🪂', tag: { ar: 'حركة وموقف', en: 'Action' }, title: { ar: 'يقفز بالمظلة من طائرة', en: 'Skydiving' }, hint: { ar: 'في الهواء ويفتح البارشوت', en: 'Jumping from a plane with parachute' } },
  { emoji: '🪥', tag: { ar: 'حركة وموقف', en: 'Action' }, title: { ar: 'يفرّش أسنانه', en: 'Brushing Teeth' }, hint: { ar: 'معجون وفرشاة قبل النوم', en: 'Toothpaste & mirror routine' } },
  { emoji: '🚗', tag: { ar: 'حركة وموقف', en: 'Action' }, title: { ar: 'يسوق سيارة في الزحمة', en: 'Driving in Traffic' }, hint: { ar: 'دركسون وبوري وإشارة حمراء', en: 'Steering wheel & honking horn' } },
  { emoji: '🎸', tag: { ar: 'حركة وموقف', en: 'Action' }, title: { ar: 'يعزف جيتار بحماس', en: 'Playing Electric Guitar' }, hint: { ar: 'أوتار وحفل روك صاخب', en: 'Strumming strings on stage' } },
  { emoji: '🤿', tag: { ar: 'حركة وموقف', en: 'Action' }, title: { ar: 'يغوص تحت الماء', en: 'Scuba Diving' }, hint: { ar: 'أسطوانة أكسجين ونظارة بحر', en: 'Oxygen tank underwater' } },
];

export function pickCharadeCard(excludeTitle?: string): ArcadeCard {
  const pool = CHARADES_DECK.filter((c) => c.title.ar !== excludeTitle);
  return pick(pool.length > 0 ? pool : CHARADES_DECK);
}

export function buildHeadsUpDeck(count = 20): ArcadeCard[] {
  return shuffle(HEADSUP_DECK).slice(0, count);
}
