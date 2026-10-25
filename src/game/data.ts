import type { DeathMethod, Faction, L10n, NewsItem, Region, TargetProfile } from './types';

export const MAX_DAYS = 30;

export const REGION_NAME: Record<Region, L10n> = {
  NORTH: { ar: 'الشمال', en: 'North' },
  WEST: { ar: 'الغرب', en: 'West' },
  EAST: { ar: 'الشرق', en: 'East' },
  SOUTH: { ar: 'الجنوب', en: 'South' },
  CENTRAL: { ar: 'الوسط', en: 'Central' },
};

export const FACTION_NAME: Record<Faction, L10n> = {
  SYNDICATE: { ar: 'عصابة الميناء', en: 'Harbor Syndicate' },
  RADICALS: { ar: 'جماعة متطرفة', en: 'Radical Cell' },
  CORPORATE: { ar: 'كارتل الشركات', en: 'Corporate Cartel' },
};

export const METHODS: DeathMethod[] = ['CARDIAC', 'ACCIDENT', 'FALSE_LEAD'];

interface TargetSpec {
  profile: Omit<TargetProfile, 'alive'>;
  news?: { headline: L10n; body: L10n; source: L10n; scope: 'NATIONAL' | 'REGIONAL' };
  police: L10n;
  camera: L10n;
}

const SPECS: TargetSpec[] = [
  {
    profile: {
      id: 'c1', name: { ar: 'تاكيدا سيجي', en: 'Takeda Seiji' }, faceId: 'f-c1',
      title: { ar: 'وزير فاسد', en: 'Corrupt Minister' }, region: 'CENTRAL',
      precinct: { ar: 'قسم الوسط 1', en: 'Central Precinct 1' }, priority: 'CORRUPT',
      routine: { place: { ar: 'موقف سيارات مقر الحزب', en: 'Party HQ parking lot' }, window: { from: 20, to: 22 } },
    },
    news: {
      headline: { ar: 'تحقيق: صفقات مشبوهة في وزارة الأشغال', en: 'Probe: shady deals at the Public Works Ministry' },
      body: { ar: 'كشفت مصادر أن الوزير {name} حوّل ملايين المشاريع لشركات مقرّبة منه.', en: 'Sources reveal Minister {name} funneled millions in projects to companies close to him.' },
      source: { ar: 'الصحيفة الوطنية', en: 'National Gazette' }, scope: 'NATIONAL',
    },
    police: { ar: 'ملف سري: وزير بلا ملاحقة قضائية رغم 14 شكوى. ممنوع التداول.', en: 'Classified file: a minister never prosecuted despite 14 complaints. Do not circulate.' },
    camera: { ar: 'موقف سيارات المقر الحزبي — سيارة سوداء مصفحة', en: 'Party HQ parking lot — black armored car' },
  },
  {
    profile: {
      id: 'c2', name: { ar: 'موريموتو غينزو', en: 'Morimoto Genzo' }, faceId: 'f-c2',
      title: { ar: 'قاضٍ مرتشٍ', en: 'Bribed Judge' }, region: 'WEST',
      precinct: { ar: 'قسم الغرب 3', en: 'West Precinct 3' }, priority: 'CORRUPT',
      routine: { place: { ar: 'نادي الرماية الغربي', en: 'Western Shooting Club' }, window: { from: 19, to: 21 } },
    },
    news: {
      headline: { ar: 'تبرئة مفاجئة لمتهم بالاتجار', en: 'Sudden acquittal of trafficking suspect' },
      body: { ar: 'القاضي {name} يبرّئ زعيم شبكة تهريب وسط شكوك بتلقّيه رشوة.', en: 'Judge {name} acquits a smuggling ring leader amid suspicions he took a bribe.' },
      source: { ar: 'قناة الغرب المحلية', en: 'West Local TV' }, scope: 'REGIONAL',
    },
    police: { ar: 'تسجيل مسرّب: قاضٍ في محكمة الغرب يتفاوض على مبلغ مقابل حكم.', en: 'Leaked recording: a West court judge negotiates a sum in exchange for a verdict.' },
    camera: { ar: 'نادي الرماية الغربي — مدخل كبار الشخصيات', en: 'Western Shooting Club — VIP entrance' },
  },
  {
    profile: {
      id: 'c3', name: { ar: 'ياماغوتشي دايسوكي', en: 'Yamaguchi Daisuke' }, faceId: 'f-c3',
      title: { ar: 'مدير شرطة فاسد', en: 'Corrupt Police Chief' }, region: 'EAST',
      precinct: { ar: 'قسم الشرق 2', en: 'East Precinct 2' }, priority: 'CORRUPT',
      routine: { place: { ar: 'ممشى الكورنيش الشرقي', en: 'Eastern Corniche promenade' }, window: { from: 22, to: 24 } },
    },
    news: {
      headline: { ar: 'اختفاء أدلة من مخزن الشرطة', en: 'Evidence vanishes from police storage' },
      body: { ar: 'مدير الأمن {name} ينفي علاقته باختفاء 40 كغ من المخدرات المضبوطة.', en: 'Security chief {name} denies any link to 40 kg of seized drugs going missing.' },
      source: { ar: 'إذاعة الشرق', en: 'East Radio' }, scope: 'REGIONAL',
    },
    police: { ar: 'ملف داخلي: مدير شرطة مشتبه بحمايته لشبكة مخدرات.', en: 'Internal file: a police chief suspected of shielding a drug network.' },
    camera: { ar: 'كورنيش الشرق — يمشي وحيداً بعد منتصف الليل', en: 'East Corniche — walks alone after midnight' },
  },
  {
    profile: {
      id: 'k1', name: { ar: 'كوروساوا ريوجي', en: 'Kurosawa Ryoji' }, faceId: 'f-k1',
      title: { ar: 'مجرم هارب', en: 'Fugitive Convict' }, region: 'SOUTH',
      precinct: { ar: 'قسم الجنوب 5', en: 'South Precinct 5' }, priority: 'CRIMINAL',
      routine: { place: { ar: 'رصيف الميناء الجنوبي', en: 'South harbor pier' }, window: { from: 21, to: 23 } },
    },
    news: {
      headline: { ar: 'هروب سجين خطر من سجن الجنوب', en: 'Dangerous inmate escapes South prison' },
      body: { ar: 'السلطات تبحث عن {name} المدان بثلاث جرائم قتل بعد فراره أمس.', en: 'Authorities search for {name}, convicted of three murders, after his escape yesterday.' },
      source: { ar: 'الأخبار العاجلة', en: 'Breaking News' }, scope: 'NATIONAL',
    },
    police: { ar: 'مذكرة توقيف حمراء: مدان بجرائم قتل، فرّ من سجن الجنوب.', en: 'Red notice: convicted murderer, escaped South prison.' },
    camera: { ar: 'ميناء الجنوب — رجل ملثم قرب المستودعات', en: 'South Harbor — masked man near the warehouses' },
  },
  {
    profile: {
      id: 'k2', name: { ar: 'شيراكاوا ماساميتشي', en: 'Shirakawa Masamichi' }, faceId: 'f-k2',
      title: { ar: 'زعيم عصابة', en: 'Gang Boss' }, region: 'NORTH',
      precinct: { ar: 'قسم الشمال 4', en: 'North Precinct 4' }, priority: 'CRIMINAL',
      routine: { place: { ar: 'محطة القطار الشمالية', en: 'North train station' }, window: { from: 17, to: 19 } },
    },
    news: {
      headline: { ar: 'رعب في أسواق الشمال', en: 'Terror in the North markets' },
      body: { ar: 'شهود: {name} يفرض إتاوات على التجار بحماية رجاله.', en: "Witnesses: {name} extorts shopkeepers under his men's protection." },
      source: { ar: 'صحيفة الشمال', en: 'North Daily' }, scope: 'REGIONAL',
    },
    police: { ar: 'قاعدة بيانات الجريمة المنظمة: زعيم عصابة، 9 قضايا مغلقة بالتواطؤ.', en: 'Organized-crime database: gang boss, 9 cases closed through collusion.' },
    camera: { ar: 'محطة القطار الشمالية — اجتماع قصير على الرصيف', en: 'North Station — brief meeting on the platform' },
  },
  {
    profile: {
      id: 'k3', name: { ar: 'تاكاشي إندو', en: 'Takashi Endo' }, faceId: 'f-k3',
      title: { ar: 'مهرب أسلحة دولي (العقرب)', en: 'Arms Dealer (The Scorpion)' }, region: 'EAST',
      precinct: { ar: 'قسم الشرق 1', en: 'East Precinct 1' }, priority: 'CRIMINAL',
      routine: { place: { ar: 'مستودع الميناء الشرقي', en: 'East harbor warehouse' }, window: { from: 18, to: 20 } },
    },
    news: {
      headline: { ar: 'شحنة متفجرات غامضة في الشرق', en: 'Mysterious explosives shipment in East' },
      body: { ar: 'الأمن يحبط تهريب أسلحة ثقيلة للمتهم {name} الملقب بالعقرب.', en: 'Security intercepts heavy arms shipment linked to {name}, alias The Scorpion.' },
      source: { ar: 'أخبار الشرق المسائية', en: 'East Evening News' }, scope: 'REGIONAL',
    },
    police: { ar: 'مذكرة أمنية: الملقب بالعقرب اسمه تاكاشي إندو، يتحرك في مستودعات الميناء.', en: 'Security memo: "The Scorpion" is Takashi Endo, moves around harbor warehouses.' },
    camera: { ar: 'مستودع الميناء الشرقي — تسليم حقائب مشبوهة', en: 'East harbor warehouse — suspicious briefcase handover' },
  },
  {
    profile: {
      id: 'c4', name: { ar: 'كينوشيتا ريوتارو', en: 'Kinoshita Ryotaro' }, faceId: 'f-c4',
      title: { ar: 'رئيس بنك متورط بغسيل الأموال', en: 'Bank Director (Money Laundering)' }, region: 'SOUTH',
      precinct: { ar: 'قسم الجنوب 2', en: 'South Precinct 2' }, priority: 'CORRUPT',
      routine: { place: { ar: 'برج البنك المركزي الجنوبي', en: 'South Central Bank Tower' }, window: { from: 18, to: 20 } },
    },
    news: {
      headline: { ar: 'اختلاس مليارات من حسابات المودعين', en: 'Billions embezzled from depositor funds' },
      body: { ar: 'وثائق سرية تتهم {name} بتحويل أصول مصرفية لملاذات خارجية لصالح كارتل الجريمة.', en: 'Classified audits accuse {name} of offshore asset transfers for crime cartels.' },
      source: { ar: 'جريدة المال والاقتصاد', en: 'Financial Chronicle' }, scope: 'REGIONAL',
    },
    police: { ar: 'تقرير وحدة الجرائم المالية: مدير بنك محمي بحصانات مصرفية عليا.', en: 'Financial crimes report: Bank director shielded by executive immunity.' },
    camera: { ar: 'برج البنك الجنوبي — مكتب الطابق العلوي ذو الواجهة الزجاجية', en: 'South Bank Tower — top penthouse glass office' },
  },
  {
    profile: {
      id: 'k4', name: { ar: 'شيندو كازوكي', en: 'Shindo Kazuki' }, faceId: 'f-k4',
      title: { ar: 'قرصان إلكتروني ومبتز أمني', en: 'Cyber Syndicate Blackmailer' }, region: 'WEST',
      precinct: { ar: 'قسم الغرب 1', en: 'West Precinct 1' }, priority: 'CRIMINAL',
      routine: { place: { ar: 'مقهى الإنترنت الليلي بالغرب', en: 'West Cyber Cafe Underground' }, window: { from: 21, to: 23 } },
    },
    news: {
      headline: { ar: 'اختراق منظومة كاميرات المدينة وتسريب هويات الشهود', en: 'City CCTV hacked and witness identities leaked' },
      body: { ar: 'الشرطة تطارد القرصان {name} بعد ابتزازه لمستشفيات العاصمة بفيروس فدية.', en: 'Police track hacker {name} after municipal hospital ransomware extortion.' },
      source: { ar: 'شبكة الأمن السيبراني', en: 'Cybersecurity Alert' }, scope: 'NATIONAL',
    },
    police: { ar: 'إشعار ضبط دولي: خبير برمجيات مشبوه بابتزاز مسؤولي الدولة.', en: 'Wanted notice: Software engineer suspected of state extortion.' },
    camera: { ar: 'مقهى الإنترنت بالغرب — غرفة الخوادم السفلية', en: 'West Cyber Cafe — basement server room' },
  },
  {
    profile: {
      id: 'fbi1', name: { ar: 'راي بنبر', en: 'Ray Penber' }, faceId: 'f-fbi',
      title: { ar: 'عميل استخبارات سري مكلف بمساعدة L', en: 'Undercover FBI Agent aiding L' }, region: 'CENTRAL',
      precinct: { ar: 'فرقة التتبع الاستخباراتية', en: 'Federal Intelligence Detail' }, priority: 'CORRUPT',
      routine: { place: { ar: 'محطة قطار الأنفاق المركزية', en: 'Central Subway Terminal' }, window: { from: 17, to: 19 } },
    },
    news: {
      headline: { ar: 'رصد عملاء استخبارات أجانب يراقبون العاصمة', en: 'Foreign covert agents spotted monitoring capital' },
      body: { ar: 'تسريبات تكشف أن العميل {name} يراقب سراً عائلات ضباط الشرطة لكشف ثغرات القاتل.', en: 'Leaks disclose agent {name} covertly surveilling task force households.' },
      source: { ar: 'صحافة التحقيقات السرية', en: 'Investigative Tribune' }, scope: 'REGIONAL',
    },
    police: { ar: 'بطاقة أمنية: عميل فيدرالي يعمل تحت إمرة L المباشرة لتعقب المشتبه بهم.', en: 'Security badge: Federal agent operating directly under L to tail suspects.' },
    camera: { ar: 'محطة الأنفاق المركزية — رجل بسترة رمادية يدوّن في مذكرة', en: 'Central Subway — man in gray coat taking surveillance notes' },
  },
  {
    profile: {
      id: 'd1', name: { ar: 'تاكاهيرو ساتو', en: 'Takahiro Sato' }, faceId: 'f-d1',
      title: { ar: 'سجين محكوم بالإعدام (طُعم L)', en: 'Death-row Inmate (L Decoy)' }, region: 'CENTRAL',
      precinct: { ar: 'الرئاسة العامة للأمن', en: 'General Security Command' }, priority: 'DECOY',
      routine: { place: { ar: 'استوديو البث التلفزيوني المركزي', en: 'Central TV studio' }, window: { from: 19, to: 21 } },
    },
    news: {
      headline: { ar: 'بث مباشر عاجل: متهم يتحدى القاتل المجهول على الهواء!', en: 'Live Emergency Broadcast: Inmate dares the unseen killer on air!' },
      body: { ar: 'في بث حصري، يصرخ {name} مهدداً بفضح القاتل ويدعي أنه لا يخشى الموت.', en: 'In an exclusive broadcast, {name} dares the unseen killer to stop him on air.' },
      source: { ar: 'البث التلفزيوني الخاص — عاجل', en: 'Special TV Broadcast — LIVE' }, scope: 'REGIONAL',
    },
    police: { ar: 'سري للغاية: هذا البث طُعم مباشر بإشراف L لاختبار قدرة الفاعل على القتل عن بُعد.', en: 'Top Secret: This broadcast is a trap engineered by L to test range.' },
    camera: { ar: 'استوديو القناة الخاصة — حراسة أمنية مشددة وفريق بث حي', en: 'Special Channel Studio — heavy security & live camera crew' },
  },
  {
    profile: {
      id: 'lind-l-tailor',
      name: { ar: 'ليند إل. تايلور', en: 'Lind L. Tailor' },
      faceId: 'f-lind',
      title: { ar: 'الواجهة المستعارة للمحقق L (سجين محكوم بالإعدام)', en: 'L Decoy Persona (Death-Row Convict)' },
      region: 'WEST',
      precinct: { ar: 'السجن المركزي الفيدرالي', en: 'Federal Central Penitentiary' },
      priority: 'DECOY',
      routine: { place: { ar: 'استوديو البث التلفزيوني الخاص', en: 'Special Broadcast Studio' }, window: { from: 18, to: 22 } },
    },
    news: {
      headline: { ar: '🚨 بث تلفزيوني عاجل: المحقق L يظهر للعالم لأول مرة ويتحدى KIRA!', en: '🚨 Breaking Live Broadcast: Detective L reveals himself to challenge KIRA!' },
      body: { ar: 'أنا L.. القاتل KIRA، إن كنت حقاً قادراً على القتل بلا لمس، فأرني قوتك واقتلني أمام شاشات العالم الآن!', en: 'I am L.. Killer KIRA, if you can truly kill without touching, show your power and kill me live on world television right now!' },
      source: { ar: 'هيئة البث التلفزيوني العالمية (NHK/ICPO Special)', en: 'Global TV Network / ICPO Special' },
      scope: 'REGIONAL',
    },
    police: { ar: 'برقية سرية: هذا البث طُعم مباشر منصوب لاصطياد KIRA في القطاع المختار.', en: 'Classified memo: This broadcast is a live sting to trap KIRA in the chosen sector.' },
    camera: { ar: 'استوديو البث الإقليمي المشفر', en: 'Encrypted Studio Transmission' },
  },
  {
    profile: {
      id: 'target-detective-l',
      name: { ar: 'ريوجي ماستودا', en: 'Ryoji Matsuda' },
      faceId: 'f-detective-l',
      title: { ar: 'المحقق سايفر — القائد السري للتحريات (L)', en: 'Detective Cipher — Secret Task Force Commander (L)' },
      region: 'CENTRAL',
      precinct: { ar: 'غرفة العمليات المشفرة التابعة للإنتربول', en: 'Interpol Encrypted Command' },
      priority: 'DETECTIVE',
      routine: { place: { ar: 'المقر السري للشرطة الدولية', en: 'Interpol Classified Bunker' }, window: { from: 0, to: 24 } },
    },
    police: { ar: 'ملف سري للغاية برمز تصنيف أحمر: هوية المحقق L محصنة وتخضع لأعلى درجات السرية الوطنية.', en: 'Classified Level-Red: Detective L real identity encrypted under state secrecy act.' },
    camera: { ar: 'شاشة حاسوب تكتيكي تعرض الحرف اللاتيني Σ بصوت مشوش.', en: 'Tactical monitor with gothic letter sigil and scrambled audio feed.' },
  },
  {
    profile: {
      id: 'k5', name: { ar: 'هيجيكاتا رين', en: 'Hijikata Ren' }, faceId: 'f-k5',
      title: { ar: 'سفاح مأجور في حلبات القتال', en: 'Underground Syndicate Hitman' }, region: 'NORTH',
      precinct: { ar: 'قسم الشمال 1', en: 'North Precinct 1' }, priority: 'CRIMINAL',
      routine: { place: { ar: 'حلبة الملاكمة السرية بالشمال', en: 'North Underground Boxing Ring' }, window: { from: 22, to: 24 } },
    },
    news: {
      headline: { ar: 'اغتيال 3 من قادة العصابات في الشمال', en: '3 gang leaders assassinated in North' },
      body: { ar: 'تحريات تشير لضلوع القاتل المأجور {name} في سلسلة تصفيات دموية بحماية كارتل الشمال.', en: 'Detectives link hitman {name} to a string of contract executions for the North Cartel.' },
      source: { ar: 'صحيفة الشمال المسائية', en: 'North Evening Herald' }, scope: 'REGIONAL',
    },
    police: { ar: 'ملف جنائي أسود: متهم بـ 7 اغتيالات مدفوعة الأجر لصالح عصابات التهريب.', en: 'Black dossier: Indicted in 7 contract murders for smuggling syndicates.' },
    camera: { ar: 'حلبة الملاكمة بالشمال — يغادر عبر المخرج الخلفي بعد النزالات', en: 'North Boxing Ring — exits via back alley following matches' },
  },
  {
    profile: {
      id: 'k6', name: { ar: 'أوزاوا كازوما', en: 'Ozawa Kazuma' }, faceId: 'f-k6',
      title: { ar: 'رئيس نقابة التهريب البحري', en: 'Maritime Smuggling Kingpin' }, region: 'SOUTH',
      precinct: { ar: 'قسم الجنوب 3', en: 'South Precinct 3' }, priority: 'CRIMINAL',
      routine: { place: { ar: 'حوض بناء السفن القديم بالجنوب', en: 'Old South Shipyard Docks' }, window: { from: 19, to: 21 } },
    },
    news: {
      headline: { ar: 'ضبط حاويات محملة بمهربات دولية في الجنوب', en: 'Containers of illicit contraband seized in South' },
      body: { ar: 'سلطات الموانئ تشتبه في تورط زعيم النقابة {name} بشحنات مريبة قادمة من الخارج.', en: 'Port authorities probe smuggling boss {name} over suspicious foreign container cargo.' },
      source: { ar: 'إذاعة الميناء الجنوبي', en: 'South Harbor Radio' }, scope: 'REGIONAL',
    },
    police: { ar: 'مذكرة تحرٍّ سرية: بارون تهريب دولي يدير أرصفة الشحن غير القانونية منذ عقد.', en: 'Classified memo: International smuggler controlling illicit berths for over a decade.' },
    camera: { ar: 'حوض السفن الجنوبي — يتفقد الحاويات المشبوهة عند الرصيف 4', en: 'South Shipyard — inspects cargo containers at Berth 4' },
  },
  {
    profile: {
      id: 'c5', name: { ar: 'ناكاياما إيجي', en: 'Nakayama Eiji' }, faceId: 'f-c5',
      title: { ar: 'محافظ العاصمة الفاسد', en: 'Corrupt Metropolitan Governor' }, region: 'CENTRAL',
      precinct: { ar: 'قسم الوسط 4', en: 'Central Precinct 4' }, priority: 'CORRUPT',
      routine: { place: { ar: 'فندق القصر الملكي بالوسط', en: 'Royal Palace Hotel Gala' }, window: { from: 19, to: 21 } },
    },
    news: {
      headline: { ar: 'فضيحة فساد كبرى: اختفاء مخصصات تطوير المستشفيات', en: 'Major Scandal: Hospital development funds missing' },
      body: { ar: 'أصابع الاتهام تتجه نحو المحافظ {name} بعد كشف عقود وهمية بمليارات الميزانية العامة.', en: 'Auditors target Governor {name} over phantom municipal construction contracts.' },
      source: { ar: 'الجريدة المركزية', en: 'Central Gazette' }, scope: 'NATIONAL',
    },
    police: { ar: 'ملف رقابي محظور: تستر على ثغرات مالية هائلة لصالح شركات يملكها المحافظ وأقاربه.', en: 'Restricted audit: Embezzlement shielded through shell firms owned by governor.' },
    camera: { ar: 'فندق القصر بالوسط — سيارة الليموزين الرسمية للمحافظ عند البوابة الملكية', en: 'Royal Palace Hotel — official gubernatorial limousine at VIP portal' },
  },
  {
    profile: {
      id: 'c6', name: { ar: 'فوجيتا هيتوشي', en: 'Fujita Hitoshi' }, faceId: 'f-c6',
      title: { ar: 'رئيس مصلحة الجمارك المرتشي', en: 'Bribed Customs Inspector' }, region: 'EAST',
      precinct: { ar: 'قسم الشرق 3', en: 'East Precinct 3' }, priority: 'CORRUPT',
      routine: { place: { ar: 'نادي اليخوت الشرقي', en: 'East Marina Yacht Club' }, window: { from: 18, to: 20 } },
    },
    news: {
      headline: { ar: 'تحقيق دولي في تيسير خروج أموال الجريمة المنظمة', en: 'Probe into customs facilitating cartel capital flight' },
      body: { ar: 'مفتش الجمارك {name} يواجه اتهامات بتسهيل عبور شحنات غير خاضعة للتفتيش.', en: 'Customs chief {name} accused of waving through uninspected syndicate cargo.' },
      source: { ar: 'أخبار الشرق الاقتصادية', en: 'East Financial News' }, scope: 'REGIONAL',
    },
    police: { ar: 'إفادة مسربة: مسؤول الجمارك يتلقى عمولات بالملايين عبر حسابات خارجية مشبوهة.', en: 'Leaked memo: Customs official received kickbacks through offshore accounts.' },
    camera: { ar: 'نادي اليخوت بالشرق — اجتماع سري على متن يخت خاص في المرسى', en: 'East Yacht Club — covert rendezvous on private yacht at marina' },
  },
  {
    profile: {
      id: 'k7', name: { ar: 'إيواساكي شينيتشي', en: 'Iwasaki Shinichi' }, faceId: 'f-k7',
      title: { ar: 'زعيم كارتل الياكوزا (التنين الأسود)', en: 'Yakuza Syndicate Godfather' }, region: 'WEST',
      precinct: { ar: 'قسم الغرب 4', en: 'West Precinct 4' }, priority: 'CRIMINAL',
      routine: { place: { ar: 'صالة القمار السرية تحت الأرض بالغرب', en: 'West Underground Casino' }, window: { from: 21, to: 23 } },
    },
    news: {
      headline: { ar: 'حرب شوارع واشتباكات مسلحة في ضواحي الغرب', en: 'Turf war and armed clashes in West suburbs' },
      body: { ar: 'شهود يؤكدون تحرك عناصر كارتل التنين الأسود بقيادة العراب {name}.', en: 'Eyewitnesses report Black Dragon syndicate soldiers mobilizing under godfather {name}.' },
      source: { ar: 'صوت الغرب الحرة', en: 'Voice of the West' }, scope: 'REGIONAL',
    },
    police: { ar: 'أخطر المطلوبين: زعيم مافيا يملك حراسة مدججة ونفوذاً يمتد للجهاز القضائي.', en: 'Top Priority Wanted: Mafia don shielded by armed escorts and judicial ties.' },
    camera: { ar: 'صالة القمار بالغرب — يرافقه حراس مسلحون عند المدخل السري المغلق', en: 'West Casino — entering heavily guarded underground reinforced bulkhead' },
  },
  {
    profile: {
      id: 'k8', name: { ar: 'كاوامورا تاتسويا', en: 'Kawamura Tatsuya' }, faceId: 'f-k8',
      title: { ar: 'خبير المتفجرات والتخريب الإرهابي', en: 'Explosives Demolition Expert' }, region: 'NORTH',
      precinct: { ar: 'قسم الشمال 3', en: 'North Precinct 3' }, priority: 'CRIMINAL',
      routine: { place: { ar: 'المصنع المهجور بالمنطقة الصناعية الشمالية', en: 'North Industrial Abandoned Factory' }, window: { from: 16, to: 18 } },
    },
    news: {
      headline: { ar: 'إنذار أحمر: هجمات تفجيرية تهدد منشآت النفط الشمالية', en: 'Red Alert: Bombing attacks threaten North oil depots' },
      body: { ar: 'قوات مكافحة الإرهاب تتعقب صانع القنابل المحترف {name} بعد فراره من الطوق الأمني.', en: 'Counter-terror squads track bomb maker {name} following security perimeter breach.' },
      source: { ar: 'نشرة الطوارئ الوطنية', en: 'National Emergency Dispatch' }, scope: 'NATIONAL',
    },
    police: { ar: 'سجل إرهابي خطير: كيميائي مطلوب بموجب أمر قبض عسكري بتهمة تصنيع عبوات ناسفة.', en: 'Critical threat: Chemist wanted under military warrant for bomb manufacturing.' },
    camera: { ar: 'المصنع المهجور بالشمال — رصد شاحنات تنقل براميل كيميائية في الغسق', en: 'North Abandoned Factory — trucks offloading chemical drums at dusk' },
  },
  {
    profile: {
      id: 'c7', name: { ar: 'هوندا كينسكي', en: 'Honda Kensuke' }, faceId: 'f-c7',
      title: { ar: 'قطب الإعلام الفاسد ومضلل الرأي العام', en: 'Corrupt Media Mogul' }, region: 'CENTRAL',
      precinct: { ar: 'قسم الوسط 2', en: 'Central Precinct 2' }, priority: 'CORRUPT',
      routine: { place: { ar: 'برج البث التلفزيوني المركزي - الطابق 30', en: 'Central TV Tower Penthouse' }, window: { from: 14, to: 16 } },
    },
    news: {
      headline: { ar: 'تسريبات تكشف تلاعب شبكة قنوات كبرى بالرأي العام', en: 'Leaks expose major network orchestrating propaganda' },
      body: { ar: 'المالك الإعلامي {name} متهم بابتزاز سياسيين والتعتيم على فضائح الكارتلات.', en: 'Broadcasting mogul {name} accused of extorting politicians and suppressing cartel exposés.' },
      source: { ar: 'وكالة الأنباء المستقلة', en: 'Independent Press Agency' }, scope: 'NATIONAL',
    },
    police: { ar: 'شكاوى ابتزاز إعلامي: مالك قنوات يستخدم برامجه لتبييض سمعة شبكات الفساد.', en: 'Extortion probe: Network owner utilizes broadcasts to launder cartel reputations.' },
    camera: { ar: 'برج البث بالوسط — يدخل استوديوهات الأخبار بحراسة شخصية مشددة', en: 'Central TV Tower — entering news studios surrounded by bodyguards' },
  },
  {
    profile: {
      id: 'fbi2', name: { ar: 'ستيف لوجان', en: 'Steve Logan' }, faceId: 'f-fbi2',
      title: { ar: 'محقق استخباراتي ومسؤول التنصت الميداني لـ L', en: 'FBI Intelligence Specialist aiding L' }, region: 'WEST',
      precinct: { ar: 'فرقة التتبع الاستخباراتية', en: 'Federal Intelligence Detail' }, priority: 'CORRUPT',
      routine: { place: { ar: 'فان المراقبة المتنقل بشارع السفارات بالغرب', en: 'West Mobile Surveillance Van' }, window: { from: 18, to: 20 } },
    },
    news: {
      headline: { ar: 'رصد سيارات تنصت أجنبية تجوب شوارع العاصمة', en: 'Foreign surveillance vehicles roaming capital streets' },
      body: { ar: 'تقارير أمنية تؤكد وجود سيارات تنصت يديرها المحقق {name} بتكليف مباشر من L.', en: 'Intelligence logs confirm electronic intercept vans operated by {name} under L command.' },
      source: { ar: 'مرصد الاتصالات والترددات', en: 'Signal Frequency Monitor' }, scope: 'REGIONAL',
    },
    police: { ar: 'تصريح أمني مشفر: ضابط اتصال فيدرالي يراقب الترددات الحضرية لصالح فرقة التحقيق.', en: 'Encrypted clearance: Federal liaison intercepting urban frequencies for Task Force.' },
    camera: { ar: 'شارع السفارات بالغرب — سيارة سوداء مجهزة بهوائيات رادار وتنصت رقمي', en: 'West Embassy Row — black van equipped with digital intercept radomes' },
  },
];

/** The lead detective: unlocked only after the player has proved himself. */
const DETECTIVE: TargetProfile = {
  id: 'L', name: { ar: 'المحقق L', en: 'Detective L' }, faceId: 'f-L',
  title: { ar: 'المحقق العبقري L', en: 'Master Detective L' }, region: 'CENTRAL',
  precinct: { ar: 'مقر فرقة التحقيق الخاصة', en: 'Special Task Force HQ' }, priority: 'DETECTIVE', alive: true,
  routine: { place: { ar: 'مقهى الجسر', en: 'Bridge Cafe' }, window: { from: 20, to: 22 } },
};

export const BASE_TARGETS: TargetProfile[] = [
  ...SPECS.map((s) => ({ ...s.profile, alive: true })),
  DETECTIVE,
];

export const DECOY_NAMES: L10n[] = [
  { ar: 'ناكامورا هيديو', en: 'Nakamura Hideo' },
  { ar: 'ساساكي جونيا', en: 'Sasaki Junya' },
  { ar: 'فوجيوارا كينتارو', en: 'Fujiwara Kentaro' },
  { ar: 'إيتو شينيا', en: 'Ito Shinya' },
  { ar: 'ميزوشيما تاكيرو', en: 'Mizushima Takeru' },
  { ar: 'كاتو يوسوكي', en: 'Kato Yusuke' },
  { ar: 'أوكادا رين', en: 'Okada Ren' },
  { ar: 'سوغيموتو كازوما', en: 'Sugimoto Kazuma' },
];

const split = (l: L10n): [L10n, L10n] => {
  const [a1, a2] = l.ar.split('{name}');
  const [e1, e2] = l.en.split('{name}');
  return [{ ar: a1, en: e1 }, { ar: a2, en: e2 }];
};

/** Builds the initial OSINT feed from the target specs. */
export function buildBaseFeed(): NewsItem[] {
  const feed: NewsItem[] = [];
  for (const s of SPECS) {
    const p = s.profile;
    const isDecoy = p.priority === 'DECOY';
    if (s.news) {
      const [pre, post] = split(s.news.body);
      feed.push({
        id: `news-${p.id}`, day: 1, channel: 'NEWS', scope: s.news.scope,
        region: s.news.scope === 'REGIONAL' ? p.region : undefined,
        source: s.news.source, headline: s.news.headline, verified: !isDecoy, isDecoy,
        segments: [
          { kind: 'text', text: pre },
          { kind: 'name', targetId: p.id },
          { kind: 'text', text: post },
        ],
      });
    }
    feed.push({
      id: `pol-${p.id}`, day: 1, channel: 'POLICE', scope: 'REGIONAL', region: p.region,
      source: { ar: `قاعدة بيانات ${p.precinct.ar}`, en: `${p.precinct.en} database` },
      headline: { ar: `ملف مسرّب — ${p.title.ar}`, en: `Leaked file — ${p.title.en}` },
      verified: !isDecoy, isDecoy,
      segments: [
        { kind: 'face', targetId: p.id, caption: { k: isDecoy ? 'face.tv' : 'face.hidden' } },
        { kind: 'text', text: s.police },
      ],
    });
    feed.push({
      id: `cam-${p.id}`, day: 1, channel: 'CAMERA', scope: 'REGIONAL', region: p.region,
      source: { ar: 'كاميرا مراقبة حضرية', en: 'City surveillance camera' },
      headline: s.camera, verified: !isDecoy, isDecoy,
      segments: [
        { kind: 'text', text: { k: 'cam.spotted', p: { title: p.title } } },
        { kind: 'routine', targetId: p.id },
      ],
    });
  }

  // --- POLICE WIRETAP / INTERCEPTED RADIO CHATTER (IMMERSIVE MYSTERY SYSTEM) ---
  feed.push(
    {
      id: 'wire-1', day: 1, channel: 'WIRETAP', scope: 'NATIONAL',
      source: { ar: 'تردد طوارئ 142.8 MHz — شرطة الوسط', en: 'Emergency 142.8 MHz — Central Police' },
      headline: { ar: 'تسجيل مسرّب: ذعر في مديرية الأمن من تكرار السكتات القلبية', en: 'Wiretap: Panic at HQ over repeating cardiac arrests' },
      verified: true, isDecoy: false,
      segments: [
        {
          kind: 'text',
          text: {
            ar: 'الملازم تاكاهاشي: "الأطباء عاجزون عن تفسير السكتات القلبية المتزامنة للشخصيات الفاسدة.. هل يعقل أن تكون هناك قوة خفية تُنزل العقاب؟"',
            en: 'Lt. Takahashi: "Forensics cannot explain concurrent heart attacks of corrupt officials.. Could an unseen entity be passing judgment?"',
          },
        },
      ],
    },
    {
      id: 'wire-2', day: 1, channel: 'WIRETAP', scope: 'NATIONAL',
      source: { ar: 'قناة التشفير ألفا — فرقة التحقيق الخاصة', en: 'Encrypted Alpha Channel — Task Force' },
      headline: { ar: 'المحقق L يتولى القضية: "لا وجود للصدف المتكررة"', en: 'Master Detective L steps in: "Coincidences do not repeat"' },
      verified: true, isDecoy: false, unlockKills: 1,
      segments: [
        {
          kind: 'text',
          text: {
            ar: 'المحقق L: "أيها الضباط، هذا ليس عملاً إلهياً. الفاعل بشري يمتلك وسيلة قتل دقيقة ويقرأ بياناتنا الآن.. سأستدرجه ليرتكب خطأه الأول."',
            en: 'L: "Officers, this is no miracle. The killer is human, uses a precise method, and is reading our feeds right now.. I will lure him into his first mistake."',
          },
        },
      ],
    },
    {
      id: 'wire-3', day: 1, channel: 'WIRETAP', scope: 'REGIONAL', region: 'CENTRAL',
      source: { ar: 'اتصال مشفر — مكتب المحقق L', en: 'Encrypted Dispatch — L Direct Line' },
      headline: { ar: 'تحذير مسرّب: L يجهز بثاً تلفزيونياً استدراجياً (طُعم)', en: 'Leaked Memo: L authorizes a televised decoy broadcast' },
      verified: true, isDecoy: false, unlockKills: 2,
      segments: [
        {
          kind: 'text',
          text: {
            ar: 'الملازم: "سيدي L، هل نبث تحدي السجين في كل المناطق؟" — L: "كلا، سنبثه في منطقة واحدة محددة.. إذا سقط فوراً، سنعرف بالضبط في أي منطقة يسكن الفاعل!"',
            en: 'Deputy: "Sir, do we air the inmate challenge nationally?" — L: "No, in one specific region.. If he dies instantly, we will know precisely where the killer resides!"',
          },
        },
      ],
    },
    {
      id: 'wire-4', day: 1, channel: 'WIRETAP', scope: 'NATIONAL',
      source: { ar: 'تقييم جنائي — فريق التحليل السلوكي', en: 'Forensic Behavioral Analysis — Task Force' },
      headline: { ar: 'المحقق L يضيق حلقة الشبهة حول جدول الفاعل', en: 'Detective L narrows down the suspect daily timetable' },
      verified: true, isDecoy: false, unlockKills: 3,
      segments: [
        {
          kind: 'text',
          text: {
            ar: 'المحقق L: "الوفيات تقع بنمط محدد خلال ساعات معينة.. الفاعل لديه جدول يومي كطالب أو موظف. راقبوا سجلات الاتصال في هذا التوقيت."',
            en: 'L: "Deaths occur at precise hours.. The killer lives an ordinary life as a student or employee. Trace network activity during those specific hours."',
          },
        },
      ],
    },
    {
      id: 'wire-5', day: 1, channel: 'WIRETAP', scope: 'NATIONAL',
      source: { ar: 'رسالة شخصية مفتوحة من المحقق L', en: 'Direct Challenge Transmission from L' },
      headline: { ar: 'L يتحدى القاتل علناً: "أنا في مقهى الجسر.. لن تنال من قلبي بالسكتة!"', en: 'L public challenge: "I am at Bridge Cafe.. you cannot stop my heart!"' },
      verified: true, isDecoy: false, unlockKills: 4,
      segments: [
        {
          kind: 'text',
          text: {
            ar: 'المحقق L: "أعلم أنك تتنصت على هذه الإشارة.. اسمي ووجهي لن ينفعاك بالسكتة القلبية. إذا أردت إسقاطي، فسيتطلب ذلك حادثاً مدبراً لا مفر منه."',
            en: 'L: "I know you are intercepting this frequency.. cardiac arrest will not work on me. If you seek to bring me down, only a staged accident can seal my fate."',
          },
        },
      ],
    },
  );

  // Detective L Dossier Items
  feed.push(
    {
      id: 'pol-L', day: 1, channel: 'POLICE', scope: 'NATIONAL',
      source: { ar: 'قاعدة بيانات الشرطة — داخلي', en: 'Police database — internal' },
      headline: { ar: 'تسريب: هوية قائد فرقة التحقيق', en: 'Leak: identity of the task force chief' },
      verified: true, isDecoy: false, unlockKills: 3,
      segments: [
        { kind: 'text', text: { k: 'roster.lead' } },
        { kind: 'name', targetId: 'L' },
        { kind: 'face', targetId: 'L', caption: { k: 'face.mask' } },
      ],
    },
    {
      id: 'cam-L', day: 1, channel: 'CAMERA', scope: 'REGIONAL', region: 'CENTRAL',
      source: { ar: 'كاميرا مراقبة حضرية', en: 'City surveillance camera' },
      headline: { ar: 'مقهى الجسر — رجل يجلس وحيداً ويأكل السكر', en: 'Bridge Cafe — a man sits alone eating sugar' },
      verified: true, isDecoy: false, unlockKills: 3,
      segments: [
        { kind: 'text', text: { k: 'cam.pattern' } },
        { kind: 'routine', targetId: 'L' },
      ],
    },
  );
  return feed;
}
