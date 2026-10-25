import { useState } from 'react';
import { Activity, HelpCircle, MessageSquare, ShieldCheck, UserCheck, X } from 'lucide-react';
import { sensoryAudio } from '../../game/audioEngine';
import { REGION_NAME } from '../../game/data';
import type { Region } from '../../game/types';
import { useLang } from '../../i18n';

interface Suspect {
  id: string;
  name: { ar: string; en: string };
  role: { ar: string; en: string };
  bpm: number;
  isKiller: boolean;
  answers: {
    alibi: { ar: string; en: string };
    opinion: { ar: string; en: string };
    search: { ar: string; en: string };
  };
}

export function InterrogationModal({
  region,
  isKillerInRegion,
  onClose,
  onAccuse,
}: {
  region: Region;
  isKillerInRegion: boolean;
  onClose: () => void;
  onAccuse?: (suspectId: string) => void;
}) {
  const { lang } = useLang();
  const isRtl = lang === 'ar';
  const [selectedSuspectId, setSelectedSuspectId] = useState<string>('s1');
  const [activeQuestion, setActiveQuestion] = useState<'alibi' | 'opinion' | 'search' | null>(null);

  const suspects: Suspect[] = [
    {
      id: 's1',
      name: isKillerInRegion
        ? { ar: 'لايت ياسين (طالب متميز)', en: 'Light Yassin (Top Honor Student)' }
        : { ar: 'كينجي موراكامي (طالب)', en: 'Kenji Murakami (Student)' },
      role: { ar: 'شاب مقيد بجداول دراسية حادة', en: 'Youth with strict daily study schedule' },
      bpm: isKillerInRegion ? 68 : 98,
      isKiller: isKillerInRegion,
      answers: {
        alibi: isKillerInRegion
          ? {
              ar: 'كنت في غرفتي أستذكر اختبارات القبول حتى العاشرة مساءً، يمكنكم فحص درجاتي وجدولي الدراسي بدقة.',
              en: 'I was in my room reviewing for entrance exams until 10 PM. You are welcome to inspect my grade records.',
            }
          : {
              ar: 'كنت ألعب ألعاب الفيديو مع زملائي على الإنترنت.. لا أفهم سبب استدعائي إلى هنا!',
              en: 'I was playing online video games with friends. I don’t understand why I was dragged here!',
            },
        opinion: isKillerInRegion
          ? {
              ar: 'قاضي الظل مجرم في نظر القانون.. لكن ألا تعتقد أن الجريمة قد انخفضت في المدينة بسببه؟ مجرد ملاحظة موضوعية.',
              en: 'The Shadow is an outlaw under the code. Yet hasn’t crime plummeted because of him? Merely an objective observation.',
            }
          : {
              ar: 'إنه مخيف جداً.. الجميع في حارتنا يخشون ذكر اسمه حتى لا يموتوا بسكتة قلبية!',
              en: 'He terrifies me. Everyone on our block fears speaking his name lest they collapse of heart failure!',
            },
        search: isKillerInRegion
          ? {
              ar: 'تفضلوا بالتفتيش في أي وقت.. ليس لدي ما أخفيه، وأقدر جهودكم في حفظ النظام.',
              en: 'You are welcome to inspect anytime. I have nothing to conceal and respect the Task Force.',
            }
          : {
              ar: 'هذا تعدٍّ على خصوصيتي! أين إذن التفتيش القضائي الرسمي الصادر عن المحكمة؟',
              en: 'This infringes on my civil rights! Where is the formal judicial search warrant?',
            },
      },
    },
    {
      id: 's2',
      name: { ar: 'شينسوكي كاتو (وسيط تجاري)', en: 'Shinsuke Kato (Broker)' },
      role: { ar: 'رجل أعمال يتنقل بسيارات مستأجرة', en: 'Business agent traveling in rented vehicles' },
      bpm: 118,
      isKiller: false,
      answers: {
        alibi: {
          ar: 'كنت في مطعم الحارة أعقد صفقة عقارية.. النادل شاهد على وجودي!',
          en: 'I was at the local diner closing a real estate deal; the waiter can testify!',
        },
        opinion: {
          ar: 'لا أهتم بالسياسة ولا بقاضي الظل، كل ما يعنيني هو ألا تتضرر أرباحي التجارية.',
          en: 'I care nothing for politics or The Shadow. I only care that my financial yields stay safe.',
        },
        search: {
          ar: 'حقيبتي تحتوي على عقود تجارية سرية.. أرجو ألا تسربوها للصحافة!',
          en: 'My briefcase contains proprietary client contracts; please do not leak them to press!',
        },
      },
    },
    {
      id: 's3',
      name: { ar: 'تاتسويا أوجيما (حارس مستودع)', en: 'Tatsuya Ojima (Warehouse Guard)' },
      role: { ar: 'متقاعد سابق يعمل في نوبات ليلية', en: 'Former serviceman working night shifts' },
      bpm: 84,
      isKiller: false,
      answers: {
        alibi: {
          ar: 'كنت أقوم بجولة تفقدية على بوابات المستودع الغربي حتى السابعة صباحاً.',
          en: 'I was patrolling warehouse gates on the night shift until 7 AM.',
        },
        opinion: {
          ar: 'لو كان الأمر بيدي لمنحت هذا القاتل وساماً.. لقد طهر شوارعنا من اللصوص.',
          en: 'If it were up to me, I’d pin a medal on him. He swept the thieves off our corners.',
        },
        search: {
          ar: 'فتشوا كما تشاؤون.. جيوبي لا يوجد فيها إلا مفاتيح وسيجارة.',
          en: 'Search whatever you like. My pockets contain only rusty keys and tobacco.',
        },
      },
    },
  ];

  const currentSuspect = suspects.find((s) => s.id === selectedSuspectId) || suspects[0];

  const handleAsk = (q: 'alibi' | 'opinion' | 'search') => {
    sensoryAudio.playKeystroke();
    setActiveQuestion(q);
  };

  return (
    <div className="interrogation-modal-overlay" onClick={onClose}>
      <div className="interrogation-card" onClick={(e) => e.stopPropagation()} dir={isRtl ? 'rtl' : 'ltr'}>
        <header className="interrogation-header">
          <div className="title-group">
            <UserCheck size={18} className="text-cyan" />
            <div>
              <h3>{isRtl ? 'غرفة الاستجواب التكتيكية المشفرة' : 'Tactical Interrogation Chamber'}</h3>
              <small className="text-dim">
                {isRtl
                  ? `استجواب المشتبه بهم في قطاع ${REGION_NAME[region].ar} برصد المؤشرات الحيوية`
                  : `Interrogating suspects in Sector ${REGION_NAME[region].en} with live biometric telemetry`}
              </small>
            </div>
          </div>
          <button type="button" className="btn-close-modal" onClick={onClose}>
            <X size={18} />
          </button>
        </header>

        {/* Suspect Selector Tabs */}
        <div className="suspect-tabs-row">
          {suspects.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`suspect-tab-btn ${s.id === selectedSuspectId ? 'active' : ''}`}
              onClick={() => {
                sensoryAudio.playLetterScratch();
                setSelectedSuspectId(s.id);
                setActiveQuestion(null);
              }}
            >
              <b>{s.name[lang]}</b>
              <span className="suspect-tab-bpm">
                <Activity size={11} className={s.bpm > 100 ? 'text-red' : 'text-green'} />
                {s.bpm} BPM
              </span>
            </button>
          ))}
        </div>

        {/* Suspect Profile & Biometrics */}
        <div className="suspect-profile-pane">
          <div className="profile-badge-row">
            <div>
              <h4 className="suspect-full-name">{currentSuspect.name[lang]}</h4>
              <p className="suspect-role-tag">{currentSuspect.role[lang]}</p>
            </div>
            <div className="biometric-heart-monitor">
              <Activity size={16} className={`pulse-icon ${currentSuspect.bpm > 100 ? 'text-red' : 'text-cyan'}`} />
              <div className="bpm-display">
                <b>{currentSuspect.bpm}</b>
                <small>BPM (النبض)</small>
              </div>
            </div>
          </div>

          {/* Interrogation Questions */}
          <div className="questions-deck">
            <button
              type="button"
              className={`btn-interrogate-q ${activeQuestion === 'alibi' ? 'selected' : ''}`}
              onClick={() => handleAsk('alibi')}
            >
              <HelpCircle size={14} />
              <span>{isRtl ? '1. أين كنت بالتحديد ليلة أمس بين 8 و 10 مساءً؟' : '1. Where were you between 8 PM and 10 PM?'}</span>
            </button>
            <button
              type="button"
              className={`btn-interrogate-q ${activeQuestion === 'opinion' ? 'selected' : ''}`}
              onClick={() => handleAsk('opinion')}
            >
              <MessageSquare size={14} />
              <span>{isRtl ? '2. ما رأيك في قاضي الظل وتصفيته للمجرمين؟' : '2. What is your judgment on The Shadow?'}</span>
            </button>
            <button
              type="button"
              className={`btn-interrogate-q ${activeQuestion === 'search' ? 'selected' : ''}`}
              onClick={() => handleAsk('search')}
            >
              <ShieldCheck size={14} />
              <span>{isRtl ? '3. هل توافق على تفتيش حقيبتك وغرفتك فوراً؟' : '3. Do you consent to search of your room?'}</span>
            </button>
          </div>

          {/* Statement Answer Bubble */}
          {activeQuestion && (
            <div className="suspect-statement-bubble">
              <div className="statement-meta">
                <b>{currentSuspect.name[lang]}</b>
                <small>{isRtl ? 'إفادة مسجلة رسمياً تحت القسم' : 'Sworn statement on police record'}</small>
              </div>
              <p className="statement-text">"{currentSuspect.answers[activeQuestion][lang]}"</p>
            </div>
          )}

          {/* Accuse / Arrest Button */}
          {onAccuse && (
            <div className="suspect-verdict-footer">
              <button
                type="button"
                className="btn-accuse-suspect"
                onClick={() => onAccuse(currentSuspect.id)}
              >
                {isRtl ? `🚨 توجيه الاتهام واعتقال ${currentSuspect.name[lang]}` : `🚨 Indict and Arrest ${currentSuspect.name[lang]}`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
