import type { Category, Word } from './types';

/** Compact helper: [arabic, english] pairs. */
const w = (pairs: [string, string][]): Word[] => pairs.map(([ar, en]) => ({ ar, en }));

export const CATEGORIES: Category[] = [
  {
    id: 'food',
    emoji: '🍕',
    name: { ar: 'أكل', en: 'Food' },
    words: w([
      ['كبسة', 'Kabsa'], ['شاورما', 'Shawarma'], ['بيتزا', 'Pizza'], ['فلافل', 'Falafel'],
      ['مندي', 'Mandi'], ['سوشي', 'Sushi'], ['همبرغر', 'Burger'], ['كنافة', 'Kunafa'],
      ['مقلوبة', 'Maqluba'], ['حمص', 'Hummus'], ['برياني', 'Biryani'], ['بسبوسة', 'Basbousa'],
      ['شوربة عدس', 'Lentil soup'], ['مكرونة', 'Pasta'], ['دجاج مقلي', 'Fried chicken'],
      ['فول', 'Fava beans'], ['كشري', 'Koshari'], ['مشاوي', 'Grilled meat'],
      ['بطاطس', 'French fries'], ['آيس كريم', 'Ice cream'], ['قهوة عربية', 'Arabic coffee'],
      ['شاي بالنعناع', 'Mint tea'], ['عصير مانجو', 'Mango juice'], ['بيض مقلي', 'Fried eggs'],
    ]),
  },
  {
    id: 'animals',
    emoji: '🐪',
    name: { ar: 'حيوانات', en: 'Animals' },
    words: w([
      ['جمل', 'Camel'], ['قطة', 'Cat'], ['أسد', 'Lion'], ['حصان', 'Horse'], ['فيل', 'Elephant'],
      ['صقر', 'Falcon'], ['دلفين', 'Dolphin'], ['قرد', 'Monkey'], ['زرافة', 'Giraffe'],
      ['ذئب', 'Wolf'], ['ببغاء', 'Parrot'], ['تمساح', 'Crocodile'], ['بطريق', 'Penguin'],
      ['نحلة', 'Bee'], ['أرنب', 'Rabbit'], ['ثعلب', 'Fox'], ['سلحفاة', 'Turtle'],
      ['خروف', 'Sheep'], ['حمار', 'Donkey'], ['نمر', 'Tiger'], ['دب', 'Bear'],
      ['غراب', 'Crow'], ['عقرب', 'Scorpion'], ['أخطبوط', 'Octopus'],
    ]),
  },
  {
    id: 'places',
    emoji: '📍',
    name: { ar: 'أماكن', en: 'Places' },
    words: w([
      ['مطار', 'Airport'], ['مستشفى', 'Hospital'], ['سوبرماركت', 'Supermarket'], ['مدرسة', 'School'],
      ['شاطئ', 'Beach'], ['مول', 'Mall'], ['ملعب', 'Stadium'], ['مطعم', 'Restaurant'],
      ['حديقة', 'Park'], ['سينما', 'Cinema'], ['مكتبة', 'Library'], ['محطة بنزين', 'Gas station'],
      ['جامعة', 'University'], ['صالون حلاقة', 'Barber shop'], ['مزرعة', 'Farm'], ['فندق', 'Hotel'],
      ['صحراء', 'Desert'], ['جبل', 'Mountain'], ['مخبز', 'Bakery'], ['بنك', 'Bank'],
      ['سيرك', 'Circus'], ['حديقة حيوان', 'Zoo'], ['مغسلة سيارات', 'Car wash'], ['ملاهي', 'Theme park'],
    ]),
  },
  {
    id: 'jobs',
    emoji: '👷',
    name: { ar: 'مهن', en: 'Jobs' },
    words: w([
      ['طبيب', 'Doctor'], ['معلم', 'Teacher'], ['طيار', 'Pilot'], ['طباخ', 'Chef'],
      ['شرطي', 'Police officer'], ['مهندس', 'Engineer'], ['سائق تاكسي', 'Taxi driver'], ['حلاق', 'Barber'],
      ['نجار', 'Carpenter'], ['صحفي', 'Journalist'], ['ممثل', 'Actor'], ['رسام', 'Painter'],
      ['مزارع', 'Farmer'], ['محامي', 'Lawyer'], ['لاعب كرة', 'Footballer'], ['رائد فضاء', 'Astronaut'],
      ['إطفائي', 'Firefighter'], ['صيدلي', 'Pharmacist'], ['مصور', 'Photographer'],
      ['ساعي بريد', 'Mail carrier'], ['مبرمج', 'Programmer'], ['خياط', 'Tailor'],
      ['صياد سمك', 'Fisherman'], ['ميكانيكي', 'Mechanic'],
    ]),
  },
  {
    id: 'home',
    emoji: '🏠',
    name: { ar: 'أشياء بالبيت', en: 'Around the house' },
    lockedByDefault: true,
    words: w([
      ['ثلاجة', 'Fridge'], ['مكيف', 'Air conditioner'], ['سجادة', 'Carpet'], ['مرآة', 'Mirror'],
      ['فرشاة أسنان', 'Toothbrush'], ['ريموت', 'Remote control'], ['مخدة', 'Pillow'], ['غسالة', 'Washing machine'],
      ['مفتاح', 'Key'], ['ساعة حائط', 'Wall clock'], ['مكنسة', 'Vacuum cleaner'], ['شباك', 'Window'],
      ['سرير', 'Bed'], ['طاولة', 'Table'], ['كرسي', 'Chair'], ['مصباح', 'Lamp'],
      ['مظلة', 'Umbrella'], ['حقيبة', 'Bag'], ['شاحن', 'Charger'], ['نظارة', 'Glasses'],
      ['منشفة', 'Towel'], ['قدر ضغط', 'Pressure cooker'], ['ميكروويف', 'Microwave'], ['مروحة', 'Fan'],
    ]),
  },
  {
    id: 'fun',
    emoji: '⚽',
    name: { ar: 'رياضة وهوايات', en: 'Sports & hobbies' },
    lockedByDefault: true,
    words: w([
      ['كرة قدم', 'Football'], ['سباحة', 'Swimming'], ['كرة سلة', 'Basketball'], ['تنس', 'Tennis'],
      ['ملاكمة', 'Boxing'], ['جري', 'Running'], ['شطرنج', 'Chess'], ['بلياردو', 'Billiards'],
      ['ركوب خيل', 'Horse riding'], ['غوص', 'Diving'], ['تزلج', 'Skiing'], ['كاراتيه', 'Karate'],
      ['دراجة', 'Cycling'], ['بولينج', 'Bowling'], ['بلايستيشن', 'PlayStation'], ['ورق شدة', 'Playing cards'],
      ['لودو', 'Ludo'], ['طيارة ورقية', 'Kite flying'], ['رماية', 'Archery'], ['تسلق', 'Climbing'],
      ['يوغا', 'Yoga'], ['تنس طاولة', 'Ping pong'], ['كرة طائرة', 'Volleyball'], ['تصوير', 'Photography'],
    ]),
  },
  {
    id: 'moments',
    emoji: '😅',
    name: { ar: 'مواقف محرجة', en: 'Awkward moments' },
    lockedByDefault: true,
    words: w([
      ['عالق في الزحمة', 'Stuck in traffic'], ['نسيت المحفظة', 'Forgot your wallet'],
      ['فاتتك الطيارة', 'Missed your flight'], ['انقطع النت', 'Internet went down'],
      ['تأخرت عن الدوام', 'Late for work'], ['بطارية الجوال خلصت', 'Phone battery died'],
      ['انسكبت القهوة على القميص', 'Spilled coffee on your shirt'], ['ضيعت المفتاح', 'Lost your keys'],
      ['مقلب من صديق', 'Prank from a friend'], ['حفلة مفاجأة', 'Surprise party'],
      ['طابور طويل', 'Very long queue'], ['نمت في الصف', 'Fell asleep in class'],
      ['نسيت اسم أحد', 'Forgot someone’s name'], ['رسالة بالغلط', 'Texted the wrong person'],
      ['مصعد عالق', 'Stuck in an elevator'], ['ركبت الباص الغلط', 'Took the wrong bus'],
      ['دخلت غرفة غلط', 'Walked into the wrong room'], ['اكتشفت أن اليوم إجازة', 'Found out it is a day off'],
      ['مطر مفاجئ', 'Sudden rain'], ['انقطعت الكهرباء', 'Power outage'],
      ['ضيعت الطريق', 'Got lost on the road'], ['حذفت صورة بالغلط', 'Deleted a photo by mistake'],
      ['ضحكت بوقت غلط', 'Laughed at the wrong time'], ['نسيت كلمة السر', 'Forgot your password'],
    ]),
  },
  {
    id: 'cities',
    emoji: '🌍',
    name: { ar: 'مدن ودول', en: 'Cities & countries' },
    lockedByDefault: true,
    words: w([
      ['دبي', 'Dubai'], ['القاهرة', 'Cairo'], ['إسطنبول', 'Istanbul'], ['باريس', 'Paris'],
      ['لندن', 'London'], ['طوكيو', 'Tokyo'], ['الرياض', 'Riyadh'], ['بيروت', 'Beirut'],
      ['عمّان', 'Amman'], ['الدوحة', 'Doha'], ['مراكش', 'Marrakech'], ['نيويورك', 'New York'],
      ['روما', 'Rome'], ['مدريد', 'Madrid'], ['برلين', 'Berlin'], ['سيدني', 'Sydney'],
      ['المالديف', 'Maldives'], ['سويسرا', 'Switzerland'], ['ماليزيا', 'Malaysia'], ['تونس', 'Tunis'],
      ['مسقط', 'Muscat'], ['الكويت', 'Kuwait City'], ['الجزائر', 'Algiers'], ['البرازيل', 'Brazil'],
    ]),
  },
];

export const getCategory = (id: string): Category | undefined => CATEGORIES.find((c) => c.id === id);

