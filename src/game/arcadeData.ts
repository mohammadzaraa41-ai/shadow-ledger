import type { Lang } from './types';

export type CharadeCatId = 'all' | 'ar_movies' | 'en_movies' | 'cartoon' | 'sports' | 'funny_acts';
export type HeadsUpCatId =
  | 'all'
  | 'sports'
  | 'ar_movies'
  | 'en_movies'
  | 'cartoon'
  | 'animals'
  | 'food'
  | 'jobs_actions';

export interface ArcadeCatMeta<T extends string> {
  id: T;
  emoji: string;
  ar: string;
  en: string;
}

export const CHARADE_CATS: ArcadeCatMeta<CharadeCatId>[] = [
  { id: 'all', emoji: '🎲', ar: 'كوكتيل شامل', en: 'All Mix' },
  { id: 'ar_movies', emoji: '🇪🇬', ar: 'أفلام ومسلسلات عربية', en: 'Arabic Movies & TV' },
  { id: 'en_movies', emoji: '🍿', ar: 'أفلام أجنبية وعالمية', en: 'Global Movies' },
  { id: 'cartoon', emoji: '🦸', ar: 'كرتون وأنمي', en: 'Cartoons & Anime' },
  { id: 'sports', emoji: '⚽', ar: 'رياضة ومباريات', en: 'Sports & Matches' },
  { id: 'funny_acts', emoji: '🤪', ar: 'مواقف مضحكة', en: 'Funny Situations' },
];

export const HEADSUP_CATS: ArcadeCatMeta<HeadsUpCatId>[] = [
  { id: 'all', emoji: '🎲', ar: 'كوكتيل شامل', en: 'All Mix' },
  { id: 'sports', emoji: '⚽', ar: 'رياضة ولاعبين', en: 'Sports & Stars' },
  { id: 'ar_movies', emoji: '🎬', ar: 'أفلام ونجوم عرب', en: 'Arabic Cinema' },
  { id: 'en_movies', emoji: '🍿', ar: 'أفلام وأبطال عالميين', en: 'Global Heroes' },
  { id: 'cartoon', emoji: '🧸', ar: 'كرتون وأنمي', en: 'Cartoons & Anime' },
  { id: 'animals', emoji: '🦁', ar: 'حيوانات وطيور', en: 'Animals' },
  { id: 'food', emoji: '🍔', ar: 'أكلات ومشروبات', en: 'Food & Drinks' },
  { id: 'jobs_actions', emoji: '🎭', ar: 'مهن وحركات', en: 'Jobs & Actions' },
];

export interface ArcadeCard {
  emoji: string;
  cat: string;
  tag: Record<Lang, string>;
  ar: string;
  en: string;
  hint: Record<Lang, string>;
}

/** 🎬 CHARADES DECK (بدون كلام: أفلام عربي، أفلام أجنبي، كرتون، رياضة، ومواقف مضحكة) */
export const CHARADES_DECK: ArcadeCard[] = [
  // 🇪🇬 Arabic Movies & TV (ar_movies)
  {
    emoji: '🕶️',
    cat: 'ar_movies',
    tag: { ar: '🎬 فيلم عربي', en: '🎬 Arabic Movie' },
    ar: 'اللمبي',
    en: 'El Lemby',
    hint: { ar: 'مثّل طريقة مشيته الشهيرة وتعديل النظارة وحركات يده بدون أي صوت!', en: 'Act out his iconic walk, glasses adjustment, and hand gestures silently!' },
  },
  {
    emoji: '🏫',
    cat: 'ar_movies',
    tag: { ar: '🎬 فيلم عربي', en: '🎬 Arabic Movie' },
    ar: 'الناظر',
    en: 'El Nazer (The Principal)',
    hint: { ar: 'مثّل مدير مدرسة صارم يمسك عصا ويفتش الطلاب المضحكين في الطابور!', en: 'Act out a strict school principal inspecting funny students in line!' },
  },
  {
    emoji: '✈️',
    cat: 'ar_movies',
    tag: { ar: '🎬 فيلم عربي', en: '🎬 Arabic Movie' },
    ar: 'عسل أسود',
    en: 'Assal Eswed',
    hint: { ar: 'مثّل شخص عائد من السفر يحمل جواز سفر وكاميرا وينصدم من الزحمة!', en: 'Act out a traveler arriving with a passport and camera, shocked by traffic!' },
  },
  {
    emoji: '🐘',
    cat: 'ar_movies',
    tag: { ar: '🎬 فيلم عربي', en: '🎬 Arabic Movie' },
    ar: 'الفيل الأزرق',
    en: 'The Blue Elephant',
    hint: { ar: 'مثّل طبيب نفسي يبتلع حبة سحرية ويرى هلوسات مرعبة وفيل!', en: 'Act out a psychiatrist taking a mysterious pill and seeing spooky visions!' },
  },
  {
    emoji: '🥢',
    cat: 'ar_movies',
    tag: { ar: '🎬 فيلم عربي', en: '🎬 Arabic Movie' },
    ar: 'فول الصين العظيم',
    en: 'The Great Beans of China',
    hint: { ar: 'مثّل طباخ خائف يسافر للصين ويأكل بعيدان الخشب ويواجه الكونغ فو!', en: 'Act out a scared chef in China eating with chopsticks and dodging Kung Fu!' },
  },
  {
    emoji: '🥩',
    cat: 'ar_movies',
    tag: { ar: '🎬 فيلم عربي', en: '🎬 Arabic Movie' },
    ar: 'بوحة الجزار',
    en: 'Boha the Butcher',
    hint: { ar: 'مثّل جزاراً يمسك ساطورين في الهواء ويرقص بطريقة كوميدية!', en: 'Act out a funny butcher waving two imaginary cleavers and dancing!' },
  },
  {
    emoji: '🎭',
    cat: 'ar_movies',
    tag: { ar: '📺 مسرحية عربية', en: '📺 Arabic Play' },
    ar: 'مدرسة المشاغبين',
    en: 'School of Mischief',
    hint: { ar: 'مثّل طلاب مشاغبين في الفصل يضحكون ويقلدون المدرّسة!', en: 'Act out rowdy students in a classroom pranking their teacher!' },
  },
  {
    emoji: '🥸',
    cat: 'ar_movies',
    tag: { ar: '📺 مسلسل عربي', en: '📺 Arabic Series' },
    ar: 'باب الحارة',
    en: 'Bab Al-Hara',
    hint: { ar: 'مثّل فتل الشوارب الطويلة وفتح بوابة الحارة الكبيرة والقبضايات!', en: 'Act out twirling a big mustache, opening a grand gate, and standing tough!' },
  },
  {
    emoji: '👯‍♂️',
    cat: 'ar_movies',
    tag: { ar: '🎬 فيلم عربي', en: '🎬 Arabic Movie' },
    ar: 'كده رضا (ثلاثة توائم)',
    en: 'Keda Reda (Triplets)',
    hint: { ar: 'مثّل ثلاثة توائم يبدّلون ملابسهم ونظاراتهم لخداع الناس!', en: 'Act out three identical triplets swapping glasses and clothes to trick people!' },
  },
  {
    emoji: '🦹‍♂️',
    cat: 'ar_movies',
    tag: { ar: '🎬 فيلم عربي', en: '🎬 Arabic Movie' },
    ar: 'غبي منه فيه',
    en: 'Ghabi Menno Feeh',
    hint: { ar: 'مثّل لصاً غبياً يتسلل لسرقة شقة فيسقط ويكسر كل شيء حوله!', en: 'Act out a clumsy thief sneaking into a house and tripping over everything!' },
  },
  {
    emoji: '📺',
    cat: 'ar_movies',
    tag: { ar: '📺 مسلسل خليجي', en: '📺 Khaleeji Series' },
    ar: 'طاش ما طاش',
    en: 'Tash Ma Tash',
    hint: { ar: 'مثّل شخصيتين كوميديتين في مواقف يومية ساخرة وتعديل الشماغ!', en: 'Act out two classic comedy characters adjusting their ghutra in funny skits!' },
  },
  {
    emoji: '👑',
    cat: 'ar_movies',
    tag: { ar: '📺 مسلسل عربي', en: '📺 Arabic Series' },
    ar: 'الكبير أوي',
    en: 'El Kabeer Awy',
    hint: { ar: 'مثّل عمدة القرية بشاربه الكبير وهو يمسك العصا ويوبخ الغفر!', en: 'Act out a village mayor with a huge mustache scolding his guards!' },
  },

  // 🍿 Global & Foreign Movies (en_movies)
  {
    emoji: '🚢',
    cat: 'en_movies',
    tag: { ar: '🍿 فيلم عالمي', en: '🍿 Global Movie' },
    ar: 'تايتانيك (Titanic)',
    en: 'Titanic',
    hint: { ar: 'افرد ذراعيك في مقدمة السفينة ثم مثّل اصطدام الجبل الجليدي والغرق!', en: 'Spread your arms at the ship bow, then act out hitting the iceberg and sinking!' },
  },
  {
    emoji: '🕸️',
    cat: 'en_movies',
    tag: { ar: '🍿 فيلم عالمي', en: '🍿 Global Movie' },
    ar: 'سبايدرمان (الرجل العنكبوت)',
    en: 'Spider-Man',
    hint: { ar: 'أطلق شباك العنكبوت من معصمك وتسلّق الجدران واقفز بين المباني!', en: 'Shoot webs from your wrists, climb walls, and swing between buildings!' },
  },
  {
    emoji: '🪄',
    cat: 'en_movies',
    tag: { ar: '🍿 فيلم عالمي', en: '🍿 Global Movie' },
    ar: 'هاري بوتر (Harry Potter)',
    en: 'Harry Potter',
    hint: { ar: 'ارسم النظارة الدائرية والندبة على الجبين، ولوّح بالعصا السحرية وطِر بالمقشة!', en: 'Show round glasses and forehead scar, wave a magic wand, and fly on a broom!' },
  },
  {
    emoji: '🦇',
    cat: 'en_movies',
    tag: { ar: '🍿 فيلم عالمي', en: '🍿 Global Movie' },
    ar: 'باتمان (الرجل الوطواط)',
    en: 'Batman',
    hint: { ar: 'افرد عباءة الخفاش السوداء وأشر لأذني القناع وقيادة سيارة باتمان!', en: 'Spread your dark cape, point to pointed mask ears, and drive the Batmobile!' },
  },
  {
    emoji: '🤡',
    cat: 'en_movies',
    tag: { ar: '🍿 فيلم عالمي', en: '🍿 Global Movie' },
    ar: 'الجوكر (Joker)',
    en: 'Joker',
    hint: { ar: 'ارسم ابتسامة عريضة بأصابعك على وجهك وارقص على الدرج بشكل درامي!', en: 'Draw a wide smile on your face with your fingers and dance down the stairs!' },
  },
  {
    emoji: '🥊',
    cat: 'en_movies',
    tag: { ar: '🍿 فيلم عالمي', en: '🍿 Global Movie' },
    ar: 'روكي (Rocky)',
    en: 'Rocky',
    hint: { ar: 'ملاكم يتدرب ويلكم في الهواء ثم يركض صاعداً الدرج ويرفع يديه منتصراً!', en: 'Shadowbox in the air, run up the steps, and raise both fists in victory!' },
  },
  {
    emoji: '🕶️',
    cat: 'en_movies',
    tag: { ar: '🍿 فيلم عالمي', en: '🍿 Global Movie' },
    ar: 'ماتريكس (The Matrix)',
    en: 'The Matrix',
    hint: { ar: 'تفادَ الرصاص بالانحناء للخلف ببطء شديد (Slow Motion)!', en: 'Dodge imaginary bullets in ultra slow-motion by leaning all the way back!' },
  },
  {
    emoji: '🏴‍☠️',
    cat: 'en_movies',
    tag: { ar: '🍿 فيلم عالمي', en: '🍿 Global Movie' },
    ar: 'قراصنة الكاريبي (جاك سبارو)',
    en: 'Pirates of the Caribbean',
    hint: { ar: 'مثّل مشية القرصان جاك سبارو المتأرجحة وعيناً مغطاة والمبارزة بالسيف!', en: 'Act out Captain Jack Sparrow’s wobbly run, eye patch, and sword fight!' },
  },
  {
    emoji: '😱',
    cat: 'en_movies',
    tag: { ar: '🍿 فيلم عالمي', en: '🍿 Global Movie' },
    ar: 'وحدي في المنزل (Home Alone)',
    en: 'Home Alone',
    hint: { ar: 'ضع يديك على خديك وافتح فمك بصدمة ثم انصب فخاخاً للصوص!', en: 'Slap both hands on your cheeks in shock, then set booby traps for burglars!' },
  },
  {
    emoji: '🏎️',
    cat: 'en_movies',
    tag: { ar: '🍿 فيلم عالمي', en: '🍿 Global Movie' },
    ar: 'فاست أند فيوريوس (Fast & Furious)',
    en: 'Fast & Furious',
    hint: { ar: 'مثّل سباق سيارات جنوني وتبديل الغيارات بسرعة وتشغيل النيترو!', en: 'Act out street racing, shifting gears furiously, and hitting the nitro boost!' },
  },
  {
    emoji: '🧸',
    cat: 'en_movies',
    tag: { ar: '🍿 كوميديا عالمية', en: '🍿 Global Comedy' },
    ar: 'مستر بين (Mr. Bean)',
    en: 'Mr. Bean',
    hint: { ar: 'مثّل حركات وجه مستر بين المضحكة وهو يحتضن دبدوبه الصغير!', en: 'Make Mr. Bean’s quirky facial expressions and hug your tiny teddy bear!' },
  },
  {
    emoji: '🦖',
    cat: 'en_movies',
    tag: { ar: '🍿 فيلم عالمي', en: '🍿 Global Movie' },
    ar: 'حديقة الديناصورات (Jurassic Park)',
    en: 'Jurassic Park',
    hint: { ar: 'مثّل ديناصور تي-ريكس بيدين قصيرتين وخطوات تهز الأرض وزئير صامت!', en: 'Act out a giant T-Rex with tiny arms, heavy stomps, and a silent roar!' },
  },

  // 🦸 Cartoons & Anime (cartoon)
  {
    emoji: '🦁',
    cat: 'cartoon',
    tag: { ar: '🦸 كرتون', en: '🦸 Cartoon' },
    ar: 'الأسد الملك (سيمبا)',
    en: 'The Lion King',
    hint: { ar: 'ارفع الشبل الصغير بيديك عالياً فوق الصخرة أمام كل الحيوانات!', en: 'Hold a baby lion cub high up in the air over Pride Rock!' },
  },
  {
    emoji: '🧽',
    cat: 'cartoon',
    tag: { ar: '🦸 كرتون', en: '🦸 Cartoon' },
    ar: 'سبونج بوب',
    en: 'SpongeBob SquarePants',
    hint: { ar: 'أشر لشكل مربع، واقلب برجر سلطع بالملعقة واضحك بحركات مضحكة!', en: 'Trace a square body, flip Krabby Patties on a grill, and do a goofy laugh!' },
  },
  {
    emoji: '🐱',
    cat: 'cartoon',
    tag: { ar: '🦸 كرتون', en: '🦸 Cartoon' },
    ar: 'توم وجيري',
    en: 'Tom and Jerry',
    hint: { ar: 'مثّل قطاً كبيراً يطارد فأراً صغيراً جداً ويصطدم بالجدار!', en: 'Act out a big cat chasing a tiny mouse and getting flattened by a frying pan!' },
  },
  {
    emoji: '🕵️',
    cat: 'cartoon',
    tag: { ar: '🦸 أنمي', en: '🦸 Anime' },
    ar: 'المحقق كونان',
    en: 'Detective Conan',
    hint: { ar: 'عدّل النظارة، أطلق إبرة التخدير من الساعة، وتحدث من ربطة العنق!', en: 'Adjust glasses, shoot a tranquilizer dart from your wristwatch, and use bowtie!' },
  },
  {
    emoji: '⚽',
    cat: 'cartoon',
    tag: { ar: '🦸 أنمي', en: '🦸 Anime' },
    ar: 'الكابتن ماجد',
    en: 'Captain Tsubasa',
    hint: { ar: 'اركض بالكرة طويلاً ثم اقفز في الهواء وسدّد ضربة النمر المزدوجة!', en: 'Dribble across a huge field, leap high in the air, and unleash a bicycle kick!' },
  },
  {
    emoji: '🍥',
    cat: 'cartoon',
    tag: { ar: '🦸 أنمي', en: '🦸 Anime' },
    ar: 'ناروتو (Naruto)',
    en: 'Naruto',
    hint: { ar: 'اربط عصابة الرأس، نفّذ حركات النينجا باليدين، واركض ويداك للخلف!', en: 'Tie a ninja headband, weave rapid hand signs, and run with arms behind your back!' },
  },
  {
    emoji: '🐢',
    cat: 'cartoon',
    tag: { ar: '🦸 كرتون', en: '🦸 Cartoon' },
    ar: 'سلاحف النينجا',
    en: 'Teenage Mutant Ninja Turtles',
    hint: { ar: 'أشر لصدفة على ظهرك، قاتل بالسيوف والننشاكو، ثم كل شريحة بيتزا!', en: 'Show a shell on your back, spin nunchucks, and eat a cheesy pizza slice!' },
  },
  {
    emoji: '🧞',
    cat: 'cartoon',
    tag: { ar: '🦸 كرتون', en: '🦸 Cartoon' },
    ar: 'علاء الدين والمصباح السحري',
    en: 'Aladdin & the Magic Lamp',
    hint: { ar: 'امسح المصباح السحري ثلاث مرات، أخرج المارد الضخم، وطِر على البساط!', en: 'Rub a magic lamp three times, emerge as a giant Genie, and ride a flying carpet!' },
  },
  {
    emoji: '🐉',
    cat: 'cartoon',
    tag: { ar: '🦸 أنمي', en: '🦸 Anime' },
    ar: 'دراغون بول (غوكو)',
    en: 'Dragon Ball Z (Goku)',
    hint: { ar: 'اشحن طاقة السوبر سايان ثم اجمع يديك عند خصرك وأطلق موجة كاميهاميها!', en: 'Power up into Super Saiyan and fire a giant Kamehameha energy wave!' },
  },
  {
    emoji: '🐠',
    cat: 'cartoon',
    tag: { ar: '🦸 كرتون', en: '🦸 Cartoon' },
    ar: 'البحث عن نيمو (Finding Nemo)',
    en: 'Finding Nemo',
    hint: { ar: 'مثّل سمكة صغيرة بزعنفة قصيرة تسبح وتضيع في المحيط!', en: 'Act out a little clownfish with one tiny fin swimming and getting lost!' },
  },

  // ⚽ Sports & Matches (sports)
  {
    emoji: '🐐',
    cat: 'sports',
    tag: { ar: '⚽ رياضة', en: '⚽ Sports' },
    ar: 'احتفالية كريستيانو رونالدو (Siuuu)',
    en: 'Cristiano Ronaldo Siuuu Celebration',
    hint: { ar: 'سجّل هدفاً ثم اركض للزاوية واقفز في الهواء مع الدوران وفتح الذراعين بصمت!', en: 'Score a goal, sprint to the corner, leap and spin mid-air with arms wide!' },
  },
  {
    emoji: '🏆',
    cat: 'sports',
    tag: { ar: '⚽ رياضة', en: '⚽ Sports' },
    ar: 'ميسي يرفع كأس العالم بالبشت',
    en: 'Messi Lifting the World Cup',
    hint: { ar: 'مثّل ارتداء البشت على الكتفين والمشي بخطوات قصيرة قبل رفع الكأس عالياً!', en: 'Put on the royal cloak, do the little shuffle walk, and hoist the trophy high!' },
  },
  {
    emoji: '🧤',
    cat: 'sports',
    tag: { ar: '⚽ رياضة', en: '⚽ Sports' },
    ar: 'حارس مرمى يصد ركلة جزاء في الدقيقة 90',
    en: 'Goalkeeper Saving a 90th-Minute Penalty',
    hint: { ar: 'قف على خط المرمى بتوتر، اقفز للزاوية لصد الكرة، ثم احتفل بجنون!', en: 'Bounce on the goal line nervously, dive to block the shot, and celebrate wildly!' },
  },
  {
    emoji: '🟥',
    cat: 'sports',
    tag: { ar: '⚽ رياضة', en: '⚽ Sports' },
    ar: 'حكم يراجع الفار (VAR) ويطرد لاعباً',
    en: 'Referee Checking VAR & Showing Red Card',
    hint: { ar: 'ارسم شاشة التلفزيون بيديك، اركض للشاشة، ثم ارفع البطاقة الحمراء وأشِر للخروج!', en: 'Draw the TV rectangle in the air, inspect the screen, and flash a red card!' },
  },
  {
    emoji: '🏋️',
    cat: 'sports',
    tag: { ar: '🏋️ رياضة', en: '🏋️ Sports' },
    ar: 'رافع أثقال يحاول رفع وزن ثقيل جداً',
    en: 'Weightlifter Struggling with Giant Barbell',
    hint: { ar: 'افرك يديك بالبودرة، امسك البار الثقيل، وارتجف أثناء رفعه فوق رأسك!', en: 'Chalk your hands, grip the heavy barbell, and tremble lifting it overhead!' },
  },
  {
    emoji: '🏀',
    cat: 'sports',
    tag: { ar: '🏀 رياضة', en: '🏀 Sports' },
    ar: 'لاعب كرة سلة يسجل رمية قاضية',
    en: 'Buzzer-Beater Basketball Dunk',
    hint: { ar: 'نطّط الكرة بين قدميك، اقفز عالياً وعلّق يديك في السلة (سلام دانك)!', en: 'Dribble between your legs, leap high, and slam-dunk into the rim!' },
  },
  {
    emoji: '🎾',
    cat: 'sports',
    tag: { ar: '🎾 رياضة', en: '🎾 Sports' },
    ar: 'لاعب تنس يخسر النقطة ويكسر مضربه',
    en: 'Tennis Player Smashing Racket in Anger',
    hint: { ar: 'اضرب الكرة بالمضرب، تفاجأ بخروجها، ثم حطّم المضرب على الأرض بغضب!', en: 'Serve the ball, watch it go out, and smash your racket on the ground!' },
  },
  {
    emoji: '🏊',
    cat: 'sports',
    tag: { ar: '🏊 رياضة', en: '🏊 Sports' },
    ar: 'سبّاح يقفز في مسبح بارد جداً',
    en: 'Swimmer Diving into Freezing Water',
    hint: { ar: 'استعد للقفز كالبطل، وبمجرد لمس الماء ارتجف من البرد واخرج هارباً!', en: 'Pose like an Olympic diver, jump in, and instantly shiver from freezing water!' },
  },

  // 🤪 Funny Situations (funny_acts)
  {
    emoji: '☕',
    cat: 'funny_acts',
    tag: { ar: '🤪 موقف مضحك', en: '🤪 Funny Act' },
    ar: 'واحد يشرب شاي حار جداً وسط ضيوف رسميين',
    en: 'Drinking Boiling Tea in Front of VIP Guests',
    hint: { ar: 'ارتشف الشاي فجأة، احترق لسانك، وحاول الابتسام بأدب أمام الضيوف!', en: 'Take a sip, burn your tongue badly, and try to smile politely!' },
  },
  {
    emoji: '🔥',
    cat: 'funny_acts',
    tag: { ar: '🤪 موقف مضحك', en: '🤪 Funny Act' },
    ar: 'واحد يمشي حافياً على رمل أو جمر حار',
    en: 'Walking Barefoot on Burning Hot Sand',
    hint: { ar: 'اقفز من قدم لأخرى وانفخ على قدميك بحركات سريعة ومضحكة!', en: 'Hop frantically from foot to foot and blow on your burning soles!' },
  },
  {
    emoji: '🐝',
    cat: 'funny_acts',
    tag: { ar: '🤪 موقف مضحك', en: '🤪 Funny Act' },
    ar: 'واحد تطارده نحلة في مكان عام',
    en: 'Being Chased by a Bee in Public',
    hint: { ar: 'انظر حول رأسك برعب ولوّح بيديك واهرب في كل الاتجاهات!', en: 'Track an invisible bee buzzing around your nose and swat wildly!' },
  },
  {
    emoji: '🎢',
    cat: 'funny_acts',
    tag: { ar: '🤪 موقف مضحك', en: '🤪 Funny Act' },
    ar: 'واحد راكب قطار الموت وهو مرعوب',
    en: 'Terrified on a Rollercoaster',
    hint: { ar: 'تمسّك بالحاجز الوهمي واهتز يميناً ويساراً واصرخ بدون أي صوت!', en: 'Grip the safety bar, whip side to side, and scream in total silence!' },
  },
  {
    emoji: '👓',
    cat: 'funny_acts',
    tag: { ar: '🤪 موقف مضحك', en: '🤪 Funny Act' },
    ar: 'واحد يبحث عن نظارته وهي فوق رأسه',
    en: 'Looking for Glasses While They Are on Your Head',
    hint: { ar: 'فتّش جيوبك وتحت الطاولة بعصبية ثم المس رأسك وتفاجأ!', en: 'Search pockets and tables frantically, then touch your head in shock!' },
  },
  {
    emoji: '🍋',
    cat: 'funny_acts',
    tag: { ar: '🤪 موقف مضحك', en: '🤪 Funny Act' },
    ar: 'واحد يأكل ليمونة حامضة جداً ويتظاهر أنها حلوة',
    en: 'Eating a Super Sour Lemon Pretending It’s Sweet',
    hint: { ar: 'اعصر ملامح وجهك من الحموضة ثم ارفع إبهامك بابتسامة مصطنعة!', en: 'Scrunch your whole face from the sourness, then give a fake thumbs-up!' },
  },
  {
    emoji: '🤳',
    cat: 'funny_acts',
    tag: { ar: '🤪 موقف مضحك', en: '🤪 Funny Act' },
    ar: 'واحد يلتقط سيلفي وهو مستلقٍ فيسقط الجوال على أنفه',
    en: 'Taking a Selfie in Bed and Dropping Phone on Nose',
    hint: { ar: 'ارفع الجوال فوق وجهك وتصنّع ابتسامة ثم أفلته وامسك أنفك من الألم!', en: 'Hold an imaginary phone high above your face, pose, drop it, and grab your nose!' },
  },
  {
    emoji: '🦶',
    cat: 'funny_acts',
    tag: { ar: '🤪 موقف مضحك', en: '🤪 Funny Act' },
    ar: 'واحد يمشي في الظلام ويصدم إصبعه الصغير بطرف الطاولة',
    en: 'Stubbing Your Little Toe in the Dark',
    hint: { ar: 'امشِ على أطراف أصابعك في الظلام ثم امسك قدمك واقفز من الألم بصمت!', en: 'Tiptoe in the dark, stub your toe, and hop on one leg holding your foot!' },
  },
];

/** 📱 HEADS-UP DECK (على جبينك: رياضة، أفلام عربي، أفلام أجنبي، كرتون، حيوانات، أكلات، مهن) */
export const HEADSUP_DECK: ArcadeCard[] = [
  // ⚽ Sports & Football Stars (sports)
  { emoji: '🐐', cat: 'sports', tag: { ar: '⚽ رياضة', en: '⚽ Sports' }, ar: 'كريستيانو رونالدو', en: 'Cristiano Ronaldo', hint: { ar: 'صفوه له بدون ذكر اسمه!', en: 'Describe him without saying his name!' } },
  { emoji: '🇦🇷', cat: 'sports', tag: { ar: '⚽ رياضة', en: '⚽ Sports' }, ar: 'ليونيل ميسي', en: 'Lionel Messi', hint: { ar: 'صفوه له بدون ذكر اسمه!', en: 'Describe him without saying his name!' } },
  { emoji: '👑', cat: 'sports', tag: { ar: '⚽ رياضة', en: '⚽ Sports' }, ar: 'محمد صلاح', en: 'Mohamed Salah', hint: { ar: 'صفوه له بدون ذكر اسمه!', en: 'Describe him without saying his name!' } },
  { emoji: '🐢', cat: 'sports', tag: { ar: '⚽ رياضة', en: '⚽ Sports' }, ar: 'كيليان مبابي', en: 'Kylian Mbappé', hint: { ar: 'صفوه له بدون ذكر اسمه!', en: 'Describe him without saying his name!' } },
  { emoji: '🌪️', cat: 'sports', tag: { ar: '⚽ رياضة', en: '⚽ Sports' }, ar: 'سالم الدوسري', en: 'Salem Al-Dawsari', hint: { ar: 'صفوه له بدون ذكر اسمه!', en: 'Describe him without saying his name!' } },
  { emoji: '🧤', cat: 'sports', tag: { ar: '⚽ رياضة', en: '⚽ Sports' }, ar: 'ياسين بونو', en: 'Yassine Bounou', hint: { ar: 'صفوه له بدون ذكر اسمه!', en: 'Describe him without saying his name!' } },
  { emoji: '🇧🇷', cat: 'sports', tag: { ar: '⚽ رياضة', en: '⚽ Sports' }, ar: 'نيمار', en: 'Neymar Jr.', hint: { ar: 'صفوه له بدون ذكر اسمه!', en: 'Describe him without saying his name!' } },
  { emoji: '👨‍🦲', cat: 'sports', tag: { ar: '⚽ رياضة', en: '⚽ Sports' }, ar: 'زين الدين زيدان', en: 'Zinedine Zidane', hint: { ar: 'صفوه له بدون ذكر اسمه!', en: 'Describe him without saying his name!' } },
  { emoji: '🤍', cat: 'sports', tag: { ar: '⚽ نادي', en: '⚽ Club' }, ar: 'ريال مدريد', en: 'Real Madrid', hint: { ar: 'صفوا النادي بدون ذكر اسمه!', en: 'Describe the club without saying its name!' } },
  { emoji: '🔵', cat: 'sports', tag: { ar: '⚽ نادي', en: '⚽ Club' }, ar: 'برشلونة', en: 'FC Barcelona', hint: { ar: 'صفوا النادي بدون ذكر اسمه!', en: 'Describe the club without saying its name!' } },
  { emoji: '🏆', cat: 'sports', tag: { ar: '⚽ بطولة', en: '⚽ Tournament' }, ar: 'كأس العالم', en: 'World Cup', hint: { ar: 'صفوا البطولة بدون ذكر الكلمة!', en: 'Describe it without saying the words!' } },
  { emoji: '🥊', cat: 'sports', tag: { ar: '🥊 رياضة', en: '🥊 Sport' }, ar: 'ملاكمة', en: 'Boxing', hint: { ar: 'صفوا الرياضة أو مثّلوها له!', en: 'Describe or act out the sport!' } },
  { emoji: '🏊', cat: 'sports', tag: { ar: '🏊 رياضة', en: '🏊 Sport' }, ar: 'سباحة', en: 'Swimming', hint: { ar: 'صفوا الرياضة أو مثّلوها له!', en: 'Describe or act out the sport!' } },
  { emoji: '🥅', cat: 'sports', tag: { ar: '⚽ كرة قدم', en: '⚽ Football' }, ar: 'ركلات الترجيح', en: 'Penalty Shootout', hint: { ar: 'صفوا الموقف بدون ذكر الكلمة!', en: 'Describe it without saying the words!' } },

  // 🎬 Arabic Cinema & Stars (ar_movies)
  { emoji: '🎭', cat: 'ar_movies', tag: { ar: '🎬 نجم عربي', en: '🎬 Arab Star' }, ar: 'عادل إمام', en: 'Adel Emam', hint: { ar: 'صفوا النجم بدون ذكر اسمه!', en: 'Describe the actor without saying his name!' } },
  { emoji: '😂', cat: 'ar_movies', tag: { ar: '🎬 نجم عربي', en: '🎬 Arab Star' }, ar: 'أحمد حلمي', en: 'Ahmed Helmy', hint: { ar: 'صفوا النجم بدون ذكر اسمه!', en: 'Describe the actor without saying his name!' } },
  { emoji: '🎤', cat: 'ar_movies', tag: { ar: '🎬 نجم عربي', en: '🎬 Arab Star' }, ar: 'محمد هنيدي', en: 'Mohamed Henedy', hint: { ar: 'صفوا النجم بدون ذكر اسمه!', en: 'Describe the actor without saying his name!' } },
  { emoji: '🕶️', cat: 'ar_movies', tag: { ar: '🎬 شخصية', en: '🎬 Character' }, ar: 'اللمبي', en: 'El Lemby', hint: { ar: 'صفوا الشخصية بدون ذكر اسمها!', en: 'Describe the character without saying the name!' } },
  { emoji: '📺', cat: 'ar_movies', tag: { ar: '🎬 نجم عربي', en: '🎬 Arab Star' }, ar: 'ناصر القصبي', en: 'Nasser Al-Qasabi', hint: { ar: 'صفوا النجم بدون ذكر اسمه!', en: 'Describe the star without saying his name!' } },
  { emoji: '🥸', cat: 'ar_movies', tag: { ar: '📺 مسلسل عربي', en: '📺 Arabic Series' }, ar: 'باب الحارة', en: 'Bab Al-Hara', hint: { ar: 'صفوا المسلسل بدون ذكر اسمه!', en: 'Describe the series without saying its name!' } },
  { emoji: '🏫', cat: 'ar_movies', tag: { ar: '🎭 مسرحية', en: '🎭 Play' }, ar: 'مدرسة المشاغبين', en: 'School of Mischief', hint: { ar: 'صفوا المسرحية بدون ذكر اسمها!', en: 'Describe the play without saying its name!' } },
  { emoji: '👑', cat: 'ar_movies', tag: { ar: '📺 مسلسل', en: '📺 Series' }, ar: 'الكبير أوي', en: 'El Kabeer Awy', hint: { ar: 'صفوا المسلسل بدون ذكر اسمه!', en: 'Describe the series without saying its name!' } },
  { emoji: '🐘', cat: 'ar_movies', tag: { ar: '🎬 فيلم عربي', en: '🎬 Arabic Movie' }, ar: 'الفيل الأزرق', en: 'The Blue Elephant', hint: { ar: 'صفوا الفيلم بدون ذكر اسمه!', en: 'Describe the movie without saying its name!' } },
  { emoji: '🧕', cat: 'ar_movies', tag: { ar: '🎬 نجمة عربية', en: '🎬 Arab Star' }, ar: 'عبلة كامل', en: 'Abla Kamel', hint: { ar: 'صفوا الممثلة بدون ذكر اسمها!', en: 'Describe the actress without saying her name!' } },

  // 🍿 Global Movies & Heroes (en_movies)
  { emoji: '🕸️', cat: 'en_movies', tag: { ar: '🍿 بطل خارق', en: '🍿 Superhero' }, ar: 'سبايدرمان', en: 'Spider-Man', hint: { ar: 'صفوا الشخصية بدون ذكر اسمها!', en: 'Describe the hero without saying the name!' } },
  { emoji: '🦇', cat: 'en_movies', tag: { ar: '🍿 بطل خارق', en: '🍿 Superhero' }, ar: 'باتمان', en: 'Batman', hint: { ar: 'صفوا الشخصية بدون ذكر اسمها!', en: 'Describe the hero without saying the name!' } },
  { emoji: '🤡', cat: 'en_movies', tag: { ar: '🍿 شخصية', en: '🍿 Villain' }, ar: 'الجوكر', en: 'The Joker', hint: { ar: 'صفوا الشخصية بدون ذكر اسمها!', en: 'Describe the character without saying the name!' } },
  { emoji: '🦸‍♂️', cat: 'en_movies', tag: { ar: '🍿 بطل خارق', en: '🍿 Superhero' }, ar: 'سوبرمان', en: 'Superman', hint: { ar: 'صفوا الشخصية بدون ذكر اسمها!', en: 'Describe the hero without saying the name!' } },
  { emoji: '🤖', cat: 'en_movies', tag: { ar: '🍿 بطل خارق', en: '🍿 Superhero' }, ar: 'آيرون مان (الرجل الحديدي)', en: 'Iron Man', hint: { ar: 'صفوا الشخصية بدون ذكر اسمها!', en: 'Describe the hero without saying the name!' } },
  { emoji: '🪄', cat: 'en_movies', tag: { ar: '🍿 شخصية', en: '🍿 Character' }, ar: 'هاري بوتر', en: 'Harry Potter', hint: { ar: 'صفوا الشخصية بدون ذكر اسمها!', en: 'Describe the character without saying the name!' } },
  { emoji: '🏴‍☠️', cat: 'en_movies', tag: { ar: '🍿 شخصية', en: '🍿 Character' }, ar: 'القبطان جاك سبارو', en: 'Captain Jack Sparrow', hint: { ar: 'صفوا الشخصية بدون ذكر اسمها!', en: 'Describe the character without saying the name!' } },
  { emoji: '🚢', cat: 'en_movies', tag: { ar: '🍿 فيلم عالمي', en: '🍿 Movie' }, ar: 'تايتانيك', en: 'Titanic', hint: { ar: 'صفوا الفيلم بدون ذكر اسمه!', en: 'Describe the movie without saying its name!' } },
  { emoji: '🧸', cat: 'en_movies', tag: { ar: '🍿 كوميديا', en: '🍿 Comedy' }, ar: 'مستر بين', en: 'Mr. Bean', hint: { ar: 'صفوا الشخصية بدون ذكر اسمها!', en: 'Describe the character without saying the name!' } },
  { emoji: '🟢', cat: 'en_movies', tag: { ar: '🍿 بطل خارق', en: '🍿 Superhero' }, ar: 'هالك (العملاق الأخضر)', en: 'The Hulk', hint: { ar: 'صفوا الشخصية بدون ذكر اسمها!', en: 'Describe the hero without saying the name!' } },

  // 🧸 Cartoons & Anime (cartoon)
  { emoji: '🧽', cat: 'cartoon', tag: { ar: '🧸 كرتون', en: '🧸 Cartoon' }, ar: 'سبونج بوب', en: 'SpongeBob', hint: { ar: 'صفوا الشخصية بدون ذكر اسمها!', en: 'Describe the character without saying the name!' } },
  { emoji: '🐱', cat: 'cartoon', tag: { ar: '🧸 كرتون', en: '🧸 Cartoon' }, ar: 'توم وجيري', en: 'Tom & Jerry', hint: { ar: 'صفوهما بدون ذكر الاسم!', en: 'Describe them without saying the names!' } },
  { emoji: '🕵️', cat: 'cartoon', tag: { ar: '🧸 أنمي', en: '🧸 Anime' }, ar: 'المحقق كونان', en: 'Detective Conan', hint: { ar: 'صفوا الشخصية بدون ذكر اسمها!', en: 'Describe the character without saying the name!' } },
  { emoji: '⚽', cat: 'cartoon', tag: { ar: '🧸 أنمي', en: '🧸 Anime' }, ar: 'الكابتن ماجد', en: 'Captain Tsubasa', hint: { ar: 'صفوا الشخصية بدون ذكر اسمها!', en: 'Describe the character without saying the name!' } },
  { emoji: '🍥', cat: 'cartoon', tag: { ar: '🧸 أنمي', en: '🧸 Anime' }, ar: 'ناروتو', en: 'Naruto', hint: { ar: 'صفوا الشخصية بدون ذكر اسمها!', en: 'Describe the character without saying the name!' } },
  { emoji: '⚡', cat: 'cartoon', tag: { ar: '🧸 أنمي', en: '🧸 Anime' }, ar: 'بيكاتشو (بوكيمون)', en: 'Pikachu', hint: { ar: 'صفوا الشخصية بدون ذكر اسمها!', en: 'Describe the character without saying the name!' } },
  { emoji: '🦁', cat: 'cartoon', tag: { ar: '🧸 كرتون', en: '🧸 Cartoon' }, ar: 'سيمبا (الأسد الملك)', en: 'Simba (Lion King)', hint: { ar: 'صفوا الشخصية بدون ذكر اسمها!', en: 'Describe the character without saying the name!' } },
  { emoji: '⭐', cat: 'cartoon', tag: { ar: '🧸 كرتون', en: '🧸 Cartoon' }, ar: 'بسيط نجم البحر', en: 'Patrick Star', hint: { ar: 'صفوا الشخصية بدون ذكر اسمها!', en: 'Describe the character without saying the name!' } },
  { emoji: '🐢', cat: 'cartoon', tag: { ar: '🧸 كرتون', en: '🧸 Cartoon' }, ar: 'سلاحف النينجا', en: 'Ninja Turtles', hint: { ar: 'صفوهم بدون ذكر الاسم!', en: 'Describe them without saying the name!' } },
  { emoji: '🐉', cat: 'cartoon', tag: { ar: '🧸 أنمي', en: '🧸 Anime' }, ar: 'غوكو (دراغون بول)', en: 'Goku (Dragon Ball)', hint: { ar: 'صفوا الشخصية بدون ذكر اسمها!', en: 'Describe the character without saying the name!' } },

  // 🦁 Animals (animals)
  { emoji: '🦁', cat: 'animals', tag: { ar: '🦁 حيوان', en: '🦁 Animal' }, ar: 'أسد', en: 'Lion', hint: { ar: 'أعطوه تلميحات أو قلّدوا صوته بدون ذكر اسمه!', en: 'Give clues or make its sound without saying the word!' } },
  { emoji: '🐒', cat: 'animals', tag: { ar: '🦁 حيوان', en: '🦁 Animal' }, ar: 'قرد', en: 'Monkey', hint: { ar: 'أعطوه تلميحات بدون ذكر الكلمة!', en: 'Give clues without saying the word!' } },
  { emoji: '🐧', cat: 'animals', tag: { ar: '🦁 حيوان', en: '🦁 Animal' }, ar: 'بطريق', en: 'Penguin', hint: { ar: 'أعطوه تلميحات بدون ذكر الكلمة!', en: 'Give clues without saying the word!' } },
  { emoji: '🦘', cat: 'animals', tag: { ar: '🦁 حيوان', en: '🦁 Animal' }, ar: 'كنغر', en: 'Kangaroo', hint: { ar: 'أعطوه تلميحات بدون ذكر الكلمة!', en: 'Give clues without saying the word!' } },
  { emoji: '🦒', cat: 'animals', tag: { ar: '🦁 حيوان', en: '🦁 Animal' }, ar: 'زرافة', en: 'Giraffe', hint: { ar: 'أعطوه تلميحات بدون ذكر الكلمة!', en: 'Give clues without saying the word!' } },
  { emoji: '🐘', cat: 'animals', tag: { ar: '🦁 حيوان', en: '🦁 Animal' }, ar: 'فيل', en: 'Elephant', hint: { ar: 'أعطوه تلميحات بدون ذكر الكلمة!', en: 'Give clues without saying the word!' } },
  { emoji: '🐊', cat: 'animals', tag: { ar: '🦁 حيوان', en: '🦁 Animal' }, ar: 'تمساح', en: 'Crocodile', hint: { ar: 'أعطوه تلميحات بدون ذكر الكلمة!', en: 'Give clues without saying the word!' } },
  { emoji: '🦜', cat: 'animals', tag: { ar: '🦁 طائر', en: '🦁 Bird' }, ar: 'ببغاء', en: 'Parrot', hint: { ar: 'أعطوه تلميحات بدون ذكر الكلمة!', en: 'Give clues without saying the word!' } },
  { emoji: '🦥', cat: 'animals', tag: { ar: '🦁 حيوان', en: '🦁 Animal' }, ar: 'حيوان الكسلان', en: 'Sloth', hint: { ar: 'أعطوه تلميحات بدون ذكر الكلمة!', en: 'Give clues without saying the word!' } },
  { emoji: '🐪', cat: 'animals', tag: { ar: '🦁 حيوان', en: '🦁 Animal' }, ar: 'جمل (سفينة الصحراء)', en: 'Camel', hint: { ar: 'أعطوه تلميحات بدون ذكر الكلمة!', en: 'Give clues without saying the word!' } },

  // 🍔 Food & Drinks (food)
  { emoji: '🌯', cat: 'food', tag: { ar: '🍔 أكلة', en: '🍔 Food' }, ar: 'شاورما بالثوم', en: 'Garlic Shawarma', hint: { ar: 'صفوا الأكلة بدون نطق اسمها!', en: 'Describe the food without saying its name!' } },
  { emoji: '🍗', cat: 'food', tag: { ar: '🍔 أكلة', en: '🍔 Food' }, ar: 'كبسة دجاج', en: 'Chicken Kabsa', hint: { ar: 'صفوا الأكلة بدون نطق اسمها!', en: 'Describe the food without saying its name!' } },
  { emoji: '🍕', cat: 'food', tag: { ar: '🍔 أكلة', en: '🍔 Food' }, ar: 'بيتزا بالجبن', en: 'Cheese Pizza', hint: { ar: 'صفوا الأكلة بدون نطق اسمها!', en: 'Describe the food without saying its name!' } },
  { emoji: '🍜', cat: 'food', tag: { ar: '🍔 أكلة', en: '🍔 Food' }, ar: 'إندومي آخر الليل', en: 'Instant Noodles (Indomie)', hint: { ar: 'صفوا الأكلة بدون نطق اسمها!', en: 'Describe the food without saying its name!' } },
  { emoji: '🧆', cat: 'food', tag: { ar: '🍔 أكلة', en: '🍔 Food' }, ar: 'فلافل ساخنة', en: 'Hot Falafel', hint: { ar: 'صفوا الأكلة بدون نطق اسمها!', en: 'Describe the food without saying its name!' } },
  { emoji: '☕', cat: 'food', tag: { ar: '🍔 مشروب', en: '🍔 Drink' }, ar: 'قهوة عربية وتمر', en: 'Arabic Coffee & Dates', hint: { ar: 'صفوا المشروب بدون نطق اسمه!', en: 'Describe it without saying the words!' } },
  { emoji: '🍦', cat: 'food', tag: { ar: '🍔 حلى', en: '🍔 Dessert' }, ar: 'آيس كريم يذوب', en: 'Melting Ice Cream', hint: { ar: 'صفوا الحلى بدون نطق اسمه!', en: 'Describe it without saying the words!' } },
  { emoji: '🍉', cat: 'food', tag: { ar: '🍔 فاكهة', en: '🍔 Fruit' }, ar: 'بطيخ بارد', en: 'Cold Watermelon', hint: { ar: 'صفوا الفاكهة بدون نطق اسمها!', en: 'Describe the fruit without saying its name!' } },

  // 🎭 Jobs & Actions (jobs_actions)
  { emoji: '🦷', cat: 'jobs_actions', tag: { ar: '🎭 مهنة', en: '🎭 Job' }, ar: 'طبيب أسنان', en: 'Dentist', hint: { ar: 'صفوا المهنة بدون نطق اسمها!', en: 'Describe the job without saying the words!' } },
  { emoji: '💈', cat: 'jobs_actions', tag: { ar: '🎭 مهنة', en: '🎭 Job' }, ar: 'حلاق', en: 'Barber', hint: { ar: 'صفوا المهنة بدون نطق اسمها!', en: 'Describe the job without saying the words!' } },
  { emoji: '👨‍✈️', cat: 'jobs_actions', tag: { ar: '🎭 مهنة', en: '🎭 Job' }, ar: 'طيار', en: 'Airplane Pilot', hint: { ar: 'صفوا المهنة بدون نطق اسمها!', en: 'Describe the job without saying the words!' } },
  { emoji: '👨‍🚀', cat: 'jobs_actions', tag: { ar: '🎭 مهنة', en: '🎭 Job' }, ar: 'رائد فضاء', en: 'Astronaut', hint: { ar: 'صفوا المهنة بدون نطق اسمها!', en: 'Describe the job without saying the words!' } },
  { emoji: '🪥', cat: 'jobs_actions', tag: { ar: '🎭 حركة', en: '🎭 Action' }, ar: 'يفرش أسنانه', en: 'Brushing Teeth', hint: { ar: 'مثّلوا الحركة أمامه ليحزرها!', en: 'Act out or describe the action!' } },
  { emoji: '🤧', cat: 'jobs_actions', tag: { ar: '🎭 حركة', en: '🎭 Action' }, ar: 'يعطس بقوة', en: 'Sneezing Loudly', hint: { ar: 'مثّلوا الحركة أمامه ليحزرها!', en: 'Act out or describe the action!' } },
  { emoji: '🧅', cat: 'jobs_actions', tag: { ar: '🎭 حركة', en: '🎭 Action' }, ar: 'يقطّع بصل ويبكي', en: 'Chopping Onions & Crying', hint: { ar: 'صفوا الموقف بدون نطق الكلمات!', en: 'Describe it without saying the words!' } },
  { emoji: '🕺', cat: 'jobs_actions', tag: { ar: '🎭 حركة', en: '🎭 Action' }, ar: 'يرقص الدبكة', en: 'Dancing Dabke', hint: { ar: 'صفوا الرقصة بدون نطق اسمها!', en: 'Describe the dance without saying its name!' } },
];

const usedCharades = new Set<string>();
const usedHeadsUp = new Set<string>();

export function pickCharadeCard(cat: CharadeCatId = 'all'): ArcadeCard {
  const catPool = cat === 'all' ? CHARADES_DECK : CHARADES_DECK.filter((c) => c.cat === cat);
  const basePool = catPool.length > 0 ? catPool : CHARADES_DECK;
  const fresh = basePool.filter((c) => !usedCharades.has(c.ar));
  const pool = fresh.length > 0 ? fresh : basePool;
  if (fresh.length === 0) {
    for (const c of basePool) usedCharades.delete(c.ar);
  }
  const picked = pool[Math.floor(Math.random() * pool.length)];
  usedCharades.add(picked.ar);
  return picked;
}

export function buildHeadsUpDeck(cat: HeadsUpCatId = 'all', count = 20): ArcadeCard[] {
  const catPool = cat === 'all' ? HEADSUP_DECK : HEADSUP_DECK.filter((c) => c.cat === cat);
  const basePool = catPool.length > 0 ? catPool : HEADSUP_DECK;
  const fresh = basePool.filter((c) => !usedHeadsUp.has(c.ar));
  const source = fresh.length >= count ? fresh : [...basePool];
  if (fresh.length < count) {
    for (const c of basePool) usedHeadsUp.delete(c.ar);
  }
  for (let i = source.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [source[i], source[j]] = [source[j], source[i]];
  }
  const slice = source.slice(0, Math.min(count, source.length));
  slice.forEach((c) => usedHeadsUp.add(c.ar));
  return slice;
}
