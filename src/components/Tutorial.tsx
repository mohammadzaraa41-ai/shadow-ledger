import { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Award,
  BookOpen,
  Camera,
  CheckCircle,
  Crosshair,
  Eye,
  FileText,
  Flame,
  Radio,
  Search,
  Shield,
  ShieldAlert,
  Skull,
  UserCheck,
  Zap,
} from 'lucide-react';
import { sensoryAudio } from '../game/audioEngine';
import { useLang } from '../i18n';

interface TutorialStep {
  id: number;
  badge: { ar: string; en: string };
  title: { ar: string; en: string };
  desc: { ar: string; en: string };
  tip: { ar: string; en: string };
  iconType: string;
}

const KILLER_STEPS: TutorialStep[] = [
  {
    id: 1,
    badge: { ar: 'القاعدة الذهبية للدفتر', en: 'Golden Notebook Rule' },
    title: { ar: 'الاسم الحقيقي والوجه في الذهن', en: 'True Name & Face Imprint' },
    desc: {
      ar: 'لإنهاء حياة أي شخص، يجب معرفة اسمه الكامل الصحيح وملامح وجهه. اكتب الاسم في صفحة الدفتر وثبّت بطاقة وجهه في ذهنك. تحذير: إذا أخطأت في كتابة الاسم 4 مرات، يصبح ذلك الشخص محصناً ضد الدفتر للأبد!',
      en: 'To eliminate any target, you must possess their verified full name and facial likeness. Inscribe the name into the ledger and attach their face. Warning: 4 spelling mistakes render the target permanently immune!',
    },
    tip: {
      ar: '💡 انقر على أسماء المجرمين وصورهم في شاشات الأخبار والتلفاز لنسخها فوراً إلى ذاكرتك.',
      en: '💡 Tap names and portraits in the news feed to instantly memorize and copy them.',
    },
    iconType: 'ledger_rule',
  },
  {
    id: 2,
    badge: { ar: 'أساليب الإعدام والتلاعب النفسي', en: 'Execution Rituals & Mind Games' },
    title: { ar: '5 أساليب تكتيكية للسيطرة والتضليل', en: '5 Strategic Execution Methods' },
    desc: {
      ar: '• السكتة القلبية المميزة (+12% شك): بصمتك الصريحة لفرض الهيبة، فورية ومضمونة 100%.\n• الحادث وحجة الغياب (0% شك): يطابق روتين الهدف. إذا اخترت ساعة تقع أثناء انشغالك (خارج وقت فراغك)، تصنع حجة غياب قاطعة (-4% شك) تحطم نموذج المحقق الزمني!\n• تسريب الوثائق (+3% شك): إجبار الضحية على اختراق خوادم المباحث وسرقة وثيقة سرية عن المحقق L قبل انتحارها (تكسب شظية هوية عن L مجاناً)!\n• رسالة الدم (+2% شك): كتابة لغز دامي ينقل 40% من رادار وشكوك المحقق الجغرافية نحو قطاع وهمي تختاره.\n• حرب العصابات (-6% شك): دفع الضحية لمهاجمة فصيل معادي لإغراق الشرطة في فوضى شوارع وتخفيض الشك العام.',
      en: '• Signature Cardiac Arrest (+12% susp): Instant, absolute shock value.\n• Staged Accident & Alibi (0% susp): Matches routine. Timing it during your busy hours crafts an airtight alibi (-4% susp) that shatters the detective’s timetable correlation!\n• Coerced Intel Leak (+3% susp): Forces the victim to exfiltrate classified police dossiers on Detective L before dying, granting free identity intel!\n• Cryptic Blood Message (+2% susp): Scrawls a riddle in blood diverting 40% of detective radar to a decoy sector.\n• Faction Crossfire (-6% susp): Ignites a violent turf war, overwhelming police resources and dropping suspicion.',
    },
    tip: {
      ar: '💡 استخدم حجة الغياب ورسالة الدم للتلاعب بتفكير المحقق وحماية نفسك من المداهمة.',
      en: '💡 Leverage Alibi Timing and Blood Riddles to manipulate the detective’s deductions.',
    },
    iconType: 'methods',
  },
  {
    id: 3,
    badge: { ar: 'كاميرات المراقبة المنزلية', en: 'Bedroom Wiretaps & CCTV' },
    title: { ar: 'حيلة التمويه (Potato Chip Trick)', en: 'Potato Chip Camouflage' },
    desc: {
      ar: 'عندما يرتاب المحقق سايفر في قطاعك السكني، يقوم بزرع كاميرات مراقبة وتنصت سري داخل غرفتك. إذا كتبت في الدفتر دون تمويه، ستُضبط متلبساً بالجرم المشهود وتُعتقل فوراً! انقر على زر «🍿 حيلة التمويه» (شاشة صغيرة مخبأة) لتكتب بأمان تام لمدة 4 ساعات.',
      en: 'When Detective Cipher suspects your sector, hidden night-vision cameras and wiretaps are deployed. Writing without camouflage triggers an instant SWAT raid! Tap "🍿 Camouflage Trick" to write safely under surveillance for 4 hours.',
    },
    tip: {
      ar: '💡 راقب شريط التنبيه الأحمر أعلى الدفتر؛ إذا ظهر، فعّل التمويه قبل لمس القلم!',
      en: '💡 Watch the red surveillance warning banner above the ledger. If active, turn on camouflage first!',
    },
    iconType: 'camouflage',
  },
  {
    id: 4,
    badge: { ar: 'الهدف الحاسم للنصر', en: 'Ultimate Victory Condition' },
    title: { ar: 'صيد المحقق سايفر (L)', en: 'Hunt Detective Cipher (L)' },
    desc: {
      ar: 'افتح تبويب «صيد المحقق L» في التيرمينال:\n1. اخترق سيرفرات الإنتربول الدولية لكشف اسم عائلته السري (ماستودا).\n2. باغت عملاء الـ FBI السريين لإسقاط قناعه وكشف وجهه.\nبمجرد اكتمال ملفه 100%، اكتب اسمه «ريوجي ماستودا» في الدفتر لتنطلق ذروة الـ 40 ثانية وتفوز باللعبة!',
      en: 'Open the "Hunt Detective L" tab in the Terminal:\n1. Breach Interpol databases to extract his secret family surname (Matsuda).\n2. Ambush covert FBI surveillance agents to unmask his face.\nOnce his dossier hits 100%, write "Ryoji Matsuda" in the ledger to trigger the fatal 40-second climax and win!',
    },
    tip: {
      ar: '💡 اختراق الإنتربول يرفع الشك؛ اختر التوقيت المناسب عندما تكون نسبة الشك منخفضة.',
      en: '💡 Hacking Interpol raises suspicion; execute covert ops when your heat level is manageable.',
    },
    iconType: 'hunt_l',
  },
  {
    id: 5,
    badge: { ar: 'الفخاخ الإعلامية', en: 'Media Decoys & Sting Traps' },
    title: { ar: 'فخ الطُعم الإقليمي وتحدي ليند', en: 'Regional Baits & Lind L. Tailor' },
    desc: {
      ar: 'المحقق ليس غبياً! سيقوم ببث أخبار مجرمين وهميين (DECOY) حصرياً في منطقتك، أو يطلق بث "ليند إل. تايلور" الذي يتطاول عليك. إذا تسرعت وقتلت الطُعم الحصري، ستثبت للمحقق مكان إقامتك وسيقوم بتطويق قطاعك.',
      en: 'The detective will broadcast fake criminals (DECOY) exclusively in your region, or air Lind L. Tailor’s challenge. If you eliminate an exclusive regional broadcast, you confirm your residential sector instantly!',
    },
    tip: {
      ar: '💡 تأكد من مصداقية الخبر: الأخبار غير الموثقة (UNVERIFIED) قد تكون فخاً منصوباً لك.',
      en: '💡 Scrutinize the news scope: unverified local reports are frequently planted traps.',
    },
    iconType: 'decoys',
  },
  {
    id: 6,
    badge: { ar: 'صفقة القوة المحرمة', en: 'Forbidden Dark Pact' },
    title: { ar: 'عقد صفقة عيون الشينيغامي', en: 'Shinigami Eyes Pact' },
    desc: {
      ar: 'إذا تعثرت في معرفة أسماء المجرمين ووجوههم، يمكنك عقد صفقة عيون الشينيغامي من داخل الدفتر. ستكشف لك العيون أسماء ووجوه الجميع بنسبة 100% فوراً وبشكل دائم، ولكن الثمن باهظ: التضحية بـ 3 أيام كاملة من عمرك المتبقي!',
      en: 'If target identities elude you, negotiate the Shinigami Eye Deal from the ledger. It unlocks 100% of all target names and faces permanently, but sacrifices 3 full days of your lifespan countdown!',
    },
    tip: {
      ar: '💡 استخدم الصفقة كحل أخير عندما تقترب نهاية اللعبة وتحتاج لإنهاء الأهداف بسرعة.',
      en: '💡 Reserve the eye deal as an endgame trump card when time is running out.',
    },
    iconType: 'eyes',
  },
];

const DETECTIVE_STEPS: TutorialStep[] = [
  {
    id: 1,
    badge: { ar: 'مهمة المحقق سايفر', en: "Detective Cipher's Mission" },
    title: { ar: 'حصر القطاع وفك شفرة القاتل', en: 'Geographic & Behavioral Profiling' },
    desc: {
      ar: 'القاتل يعيش بين المدنيين في أحد قطاعات طوكيو الخمسة (الشمال، الغرب، المركز، الشرق، الجنوب). كل جريمة ينفذها ترسل نبضات إلى رادارك التكتيكي لحساب الاحتمال الجغرافي (`geoBelief`)، وساعات التنفيذ تكشف جدول فراغه ونومه.',
      en: 'The killer lives in one of five Tokyo sectors (North, West, Central, East, South). Every murder feeds the tactical radar to calculate geographic belief, while execution timestamps expose their daily schedule and free hours.',
    },
    tip: {
      ar: '💡 راقب القطاع الذي تتصاعد فيه نسبة الاحتمال؛ هذا هو نطاق البحث الأساسي.',
      en: '💡 Focus on the sector with peaking probability on the Tactical Radar.',
    },
    iconType: 'radar',
  },
  {
    id: 2,
    badge: { ar: 'العملية 1: الفخ الإعلامي', en: 'Operation 1: Broadcast Hook' },
    title: { ar: 'بث الطُعم التلفزيوني الحصري', en: 'Regional Decoy Broadcast' },
    desc: {
      ar: 'اختر قطاعاً مشبوهاً واضغط «بث الطُعم التلفزيوني» لنشر خبر مجرم وهمي حصرياً على تلفزيون ذلك القطاع فقط دون غيره. إذا مات هذا المجرم الوهمي، فإنك تثبت بما لا يدع مجالاً للشك أن القاتل يشاهد تلفاز ذلك القطاع ويعيش هناك!',
      en: 'Select a suspected sector and deploy an exclusive television decoy broadcast. If the fake criminal dies, you prove conclusively that the killer resides in that exact sector!',
    },
    tip: {
      ar: '💡 بعد نجاح الطُعم، ستتحول نسبة دقة تحديد القطاع إلى 100%.',
      en: '💡 A successful decoy hook narrows down the killer’s sanctuary with 100% certainty.',
    },
    iconType: 'decoy_tv',
  },
  {
    id: 3,
    badge: { ar: 'العملية 2: المراقبة الليلية', en: 'Operation 2: Night Surveillance' },
    title: { ar: 'زرع كاميرات المراقبة والتنصت', en: 'Secret Bedroom Wiretaps & CCTV' },
    desc: {
      ar: 'اضغط «تفعيل الكاميرات» لزرع كاميرات دقيقة بالرؤية الليلية وتنصت إلكتروني داخل غرف المشتبه بهم في القطاع. إذا قام القاتل بكتابة أي اسم في دفتره دون استخدام حيلة التمويه، سيُسجل بالصوت والصورة، وتقتحم قوات SWAT مقره لتفوز بالقضية فوراً!',
      en: 'Activate CCTV to plant secret night-vision bugs and wiretaps across residential blocks. If the killer writes in the ledger without camouflage, they are caught red-handed for an immediate SWAT arrest victory!',
    },
    tip: {
      ar: '💡 ازرع الكاميرات في القطاع صاحب أعلى احتمالية لإجبار القاتل على ارتكاب خطأ قاتل.',
      en: '💡 Place cameras in the highest-probability region to trap the killer in a fatal mistake.',
    },
    iconType: 'cctv',
  },
  {
    id: 4,
    badge: { ar: 'العملية 4: عزل المعلومات', en: 'Operation 4: Information Quarantine' },
    title: { ar: 'التعتيم الإعلامي التكتيكي', en: 'Tactical Media Blackout' },
    desc: {
      ar: 'افرض حظراً إعلامياً على قطاع لمنع وصول أخبار الجرائم التلفزيونية إلى سكانه. إذا وقعت وفاة لمجرم في ذلك القطاع رغم التعتيم، يثبت لديك فوراً أن القاتل لا يعتمد على التلفاز بل يخترق حواسيب الشرطة سراً!',
      en: 'Impose a blackout on a sector to block TV criminal reports. If a criminal still dies there during blackout, you gain concrete forensic proof that Kira is hacking police mainframes!',
    },
    tip: {
      ar: '💡 التعتيم وسيلة عبقرية لكشف ما إذا كان القاتل طالباً أو موظفاً له صلة بأجهزة الأمن.',
      en: '💡 Blackout proves whether the culprit has police database insider access.',
    },
    iconType: 'blackout',
  },
  {
    id: 5,
    badge: { ar: 'العملية 5: التحقيق الحي', en: 'Operation 5: Heartbeat Interrogation' },
    title: { ar: 'غرفة استجواب المشتبه بهم', en: 'Interrogation Chamber & ECG' },
    desc: {
      ar: 'استدعِ 3 مشتبه بهم في القطاع إلى غرفة التحقيق السرية لمراقبة نبضات قلوبهم لحظة بلحظة (ECG & BPM). وجّه لهم 3 أسئلة تكتيكية ضاغطة؛ الشخص الحقيقي سيتناقض ويتعرق وترتفع ضربات قلبه فوق 130 BPM إلى المنطقة الحمراء. هنا، اضغط «إصدار أمر المداهمة» فوراً!',
      en: 'Summon 3 suspects into the interrogation chamber with live ECG telemetry. Fire 3 tactical questions; the actual killer will display physiological panic and heart rate spikes over 130 BPM. Hit "Issue Indictment" to raid them!',
    },
    tip: {
      ar: '💡 انتبه لإفادات المشتبه بهم: المجرم العادي هادئ، بينما القاتل الحقيقي يظهر ارتباكاً عند سؤاله عن جدول فراغه.',
      en: '💡 Watch the heart monitor: normal suspects stay steady; Kira spikes under schedule pressure.',
    },
    iconType: 'interrogation',
  },
  {
    id: 6,
    badge: { ar: 'العملية 6: الضربة القاضية', en: 'Operation 6: Decisive Strike' },
    title: { ar: 'فخ ليند إل. تايلور والمداهمة النهائية', en: 'Lind L. Tailor & Final Raid' },
    desc: {
      ar: '• فخ ليند إل. تايلور: أطلق بث التحدي العالمي للمحكوم بالإعدام الذي يدّعي أنه أنت. إذا قتله، يمنحك موقعه الإقليمي فوراً.\n• المداهمة النهائية: عندما تصبح متأكداً من القطاع، اضغط «تنفيذ المداهمة». تحذير: مداهمة القطاع الخاطئ تفشل التحقيق وتكلفك عزلك من القضية!',
      en: '• Lind L. Tailor Live Trap: Broadcast a death-row inmate posing as you. If killed, Kira reveals his sector on live TV.\n• Final SWAT Raid: When certain of the sector, execute the raid. Warning: raiding the wrong sector blows the investigation and ends in defeat!',
    },
    tip: {
      ar: '💡 لا تداهم عشوائياً! تأكد أولاً بواسطة الطُعم التلفزيوني أو غرفة الاستجواب لضمان النجاح 100%.',
      en: '💡 Never raid blindly! Confirm via Decoys or Interrogation before issuing the final raid warrant.',
    },
    iconType: 'raid',
  },
];

export function Tutorial({ onClose }: { onClose: () => void }) {
  const { lang } = useLang();
  const isRtl = lang === 'ar';
  const [activeRole, setActiveRole] = useState<'KILLER' | 'DETECTIVE'>('KILLER');
  const [stepIndex, setStepIndex] = useState(0);

  const steps = activeRole === 'KILLER' ? KILLER_STEPS : DETECTIVE_STEPS;
  const current = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;

  const handleRoleChange = (role: 'KILLER' | 'DETECTIVE') => {
    sensoryAudio.playKeystroke();
    setActiveRole(role);
    setStepIndex(0);
  };

  const handleNext = () => {
    sensoryAudio.playKeystroke();
    if (isLast) {
      onClose();
    } else {
      setStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    sensoryAudio.playKeystroke();
    setStepIndex((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="overlay tut-overlay" role="dialog" aria-modal="true" aria-label={isRtl ? 'دليل كيف تلعب' : 'How to Play Guide'}>
      <div className="tut-enhanced-modal" dir={isRtl ? 'rtl' : 'ltr'}>
        {/* Header Bar */}
        <header className="tut-modal-header">
          <div className="tut-title-wrap">
            <BookOpen size={20} className="tut-header-icon" />
            <span className="tut-main-title">{isRtl ? 'أكاديمية دفتر الظل — كيف تلعب' : 'Shadow Ledger Academy — How to Play'}</span>
          </div>
          <button className="tut-close-btn" onClick={onClose} title={isRtl ? 'إغلاق' : 'Close'}>
            ✕
          </button>
        </header>

        {/* Role Switcher Nav */}
        <div className="tut-role-tabs-bar">
          <button
            type="button"
            className={`tut-role-tab ${activeRole === 'KILLER' ? 'active killer' : ''}`}
            onClick={() => handleRoleChange('KILLER')}
          >
            <Skull size={16} />
            <span>{isRtl ? '🗡️ دليل قاضي الظل (The Shadow)' : '🗡️ The Shadow Guide'}</span>
          </button>
          <button
            type="button"
            className={`tut-role-tab ${activeRole === 'DETECTIVE' ? 'active detective' : ''}`}
            onClick={() => handleRoleChange('DETECTIVE')}
          >
            <Search size={16} />
            <span>{isRtl ? '🔍 دليل المحقق سايفر (Detective L)' : '🔍 Detective Cipher Guide'}</span>
          </button>
        </div>

        {/* Active Step Visual Showcase Card */}
        <div className="tut-showcase-container">
          <div className="tut-step-badge-row">
            <span className={`step-pill ${activeRole.toLowerCase()}`}>
              {isRtl ? `الخطوة ${stepIndex + 1} من ${steps.length}` : `Step ${stepIndex + 1} of ${steps.length}`}
            </span>
            <span className="step-tag">{current.badge[lang]}</span>
          </div>

          <div className="tut-visual-art-box">
            {current.iconType === 'ledger_rule' && (
              <div className="art-item-glow red">
                <BookOpen size={48} />
                <span className="art-caption">{isRtl ? 'الاسم + صورة الوجه' : 'Name + Face Imprint'}</span>
              </div>
            )}
            {current.iconType === 'methods' && (
              <div className="art-item-glow amber">
                <Skull size={44} />
                <span className="art-caption">{isRtl ? 'سكتة (+15%) · حادث (0%) · تضليل (-3%)' : 'Cardiac · Accident · False Lead'}</span>
              </div>
            )}
            {current.iconType === 'camouflage' && (
              <div className="art-item-glow green">
                <Camera size={44} />
                <span className="art-caption">{isRtl ? '🍿 تمويه رقائق البطاطس مفعل' : 'Potato Chip Camouflage Active'}</span>
              </div>
            )}
            {current.iconType === 'hunt_l' && (
              <div className="art-item-glow red">
                <Flame size={48} />
                <span className="art-caption">{isRtl ? 'اختراق الإنتربول · كشف هوية L' : 'Interpol Breach · Unmask L'}</span>
              </div>
            )}
            {current.iconType === 'decoys' && (
              <div className="art-item-glow purple">
                <Radio size={46} />
                <span className="art-caption">{isRtl ? 'بث الطُعم الإقليمي الحصري' : 'Regional Decoy Trap'}</span>
              </div>
            )}
            {current.iconType === 'eyes' && (
              <div className="art-item-glow cyan">
                <Eye size={48} />
                <span className="art-caption">{isRtl ? '👁️ كشف الهويات فوراً (-3 أيام)' : 'Instant Sight (-3 Days)'}</span>
              </div>
            )}
            {current.iconType === 'radar' && (
              <div className="art-item-glow cyan">
                <Crosshair size={48} />
                <span className="art-caption">{isRtl ? 'رادار الاحتمال الإقليمي (geoBelief)' : 'Geographic Radar'}</span>
              </div>
            )}
            {current.iconType === 'decoy_tv' && (
              <div className="art-item-glow blue">
                <Radio size={48} />
                <span className="art-caption">{isRtl ? 'بث خبر حصري في قطاع واحد' : 'Exclusive Sector Broadcast'}</span>
              </div>
            )}
            {current.iconType === 'cctv' && (
              <div className="art-item-glow green">
                <Camera size={48} />
                <span className="art-caption">{isRtl ? 'مراقبة ليلية وتنصت منزلي' : 'Night-Vision Bugging'}</span>
              </div>
            )}
            {current.iconType === 'blackout' && (
              <div className="art-item-glow amber">
                <ShieldAlert size={48} />
                <span className="art-caption">{isRtl ? 'حجب الأخبار وعزل التلفاز' : 'News Media Blackout'}</span>
              </div>
            )}
            {current.iconType === 'interrogation' && (
              <div className="art-item-glow red">
                <Activity size={48} />
                <span className="art-caption">{isRtl ? 'رصد نبضات القلب الحية (BPM & ECG)' : 'Live Heart Telemetry'}</span>
              </div>
            )}
            {current.iconType === 'raid' && (
              <div className="art-item-glow purple">
                <AlertTriangle size={48} />
                <span className="art-caption">{isRtl ? 'مداهمة SWAT النهائية' : 'Decisive SWAT Raid'}</span>
              </div>
            )}
          </div>

          {/* Detailed Content */}
          <div className="tut-text-body">
            <h2 className="tut-step-headline">{current.title[lang]}</h2>
            <p className="tut-step-paragraphs">{current.desc[lang]}</p>
            <div className="tut-pro-tip-box">
              <span className="pro-tip-text">{current.tip[lang]}</span>
            </div>
          </div>
        </div>

        {/* Step Dots Indicator */}
        <div className="tut-dots-row">
          {steps.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              className={`tut-dot-indicator ${idx === stepIndex ? 'active' : ''}`}
              onClick={() => {
                sensoryAudio.playKeystroke();
                setStepIndex(idx);
              }}
              title={isRtl ? `الانتقال للخطوة ${idx + 1}` : `Go to Step ${idx + 1}`}
            />
          ))}
        </div>

        {/* Footer Navigation */}
        <footer className="tut-modal-footer">
          <button
            type="button"
            className="btn-tut-nav secondary"
            disabled={stepIndex === 0}
            onClick={handlePrev}
          >
            {isRtl ? '‹ الخطوة السابقة' : '‹ Previous'}
          </button>
          <button
            type="button"
            className={`btn-tut-nav primary ${activeRole.toLowerCase()} ${isLast ? 'finish' : ''}`}
            onClick={handleNext}
          >
            {isLast
              ? isRtl
                ? 'جاهز، لنبدأ التحدي! ⚔️'
                : 'Ready, Enter the Mind-Game! ⚔️'
              : isRtl
                ? 'الخطوة التالية ›'
                : 'Next Step ›'}
          </button>
        </footer>
      </div>
    </div>
  );
}
