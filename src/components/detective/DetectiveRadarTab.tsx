import { useState } from 'react';
import {
  AlertTriangle,
  Camera,
  CheckCircle,
  Compass,
  Crosshair,
  HelpCircle,
  Info,
  MapPin,
  Radio,
  Shield,
  ShieldAlert,
  Video,
  Zap,
} from 'lucide-react';
import { REGION_NAME } from '../../game/data';
import type { GameState } from '../../game/store';
import type { DeathRecord, Region } from '../../game/types';
import { useLang } from '../../i18n';

// Sector metadata for atmospheric storytelling
const SECTOR_METADATA: Record<Region, { titleAr: string; titleEn: string; descAr: string; descEn: string }> = {
  NORTH: {
    titleAr: 'كانطو الشمالية (المحافظات والضواحي)',
    titleEn: 'North Kanto Suburbs',
    descAr: 'مناطق ريفية وهادئة تضم بلدات سكنية متفرقة ومحطات قطار إقليمية.',
    descEn: 'Quiet suburban towns, railway transit hubs, and rural zones.',
  },
  WEST: {
    titleAr: 'القطاع الغربي (تاما والتلال السكنية)',
    titleEn: 'West Tama Residential Hills',
    descAr: 'أحياء سكنية راقية وجامعات كبرى، بيئة خصبة للطلاب والكوادر.',
    descEn: 'High-density residential hills, universities, and student dorms.',
  },
  CENTRAL: {
    titleAr: 'قلب العاصمة طوكيو (شينجوكو وتشيدوا)',
    titleEn: 'Central Tokyo Metropolis',
    descAr: 'مركز البث الإعلامي ومقرات الشرطة والشركات؛ أعلى سرعة لتدفق الأخبار.',
    descEn: 'Media broadcast headquarters, police HQ, and ultra-fast news access.',
  },
  EAST: {
    titleAr: 'القطاع الشرقي (الميناء وخليج طوكيو)',
    titleEn: 'East Port & Tokyo Bay',
    descAr: 'مستودعات صناعية ومناطق تجارية وموانئ شحن بضائع.',
    descEn: 'Industrial warehouses, cargo shipping ports, and commerce docks.',
  },
  SOUTH: {
    titleAr: 'القطاع الجنوبي (يوكوهاما وكاناغاوا)',
    titleEn: 'South Kanagawa & Port Area',
    descAr: 'ميناء تجاري دولي ومراكز تسوق مزدحمة وشبكات طرق سريعة.',
    descEn: 'Metropolitan coastal cities, international shipping, and expressways.',
  },
};

const MAP_POS: Record<Region, { x: number; y: number }> = {
  NORTH: { x: 50, y: 16 },
  WEST: { x: 22, y: 50 },
  EAST: { x: 78, y: 50 },
  SOUTH: { x: 50, y: 84 },
  CENTRAL: { x: 50, y: 50 },
};

const ALL_REGIONS: Region[] = ['NORTH', 'WEST', 'CENTRAL', 'EAST', 'SOUTH'];

export function DetectiveRadarTab({
  state,
  selRegion,
  setSelRegion,
  killerName,
  decoySuccessMsg,
  isLindBroadcasting,
  lindCountdown,
  onPlantDecoy,
  onDeployCamera,
  onLaunchLindBroadcast,
  onToggleBlackout,
  onOpenInterrogation,
  onIssueArrest,
}: {
  state: GameState;
  selRegion: Region;
  setSelRegion: (r: Region) => void;
  killerName: string;
  decoySuccessMsg: string | null;
  isLindBroadcasting: boolean;
  lindCountdown: number;
  onPlantDecoy: () => void;
  onDeployCamera: () => void;
  onLaunchLindBroadcast: () => void;
  onToggleBlackout?: () => void;
  onOpenInterrogation?: () => void;
  onIssueArrest: () => void;
}) {
  const { lang, tx } = useLang();
  const isRtl = lang === 'ar';
  const d = state.deduction;
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const killsIn = (r: Region) => state.records.filter((x: DeathRecord) => x.region === r && !x.decoy).length;

  // Find the sector with maximum probability
  const highestProbRegion = ALL_REGIONS.reduce((maxR, currR) => {
    return (d.geoBelief[currR] || 0) > (d.geoBelief[maxR] || 0) ? currR : maxR;
  }, ALL_REGIONS[0]);

  const highestProbVal = Math.round((d.geoBelief[highestProbRegion] || 0) * 100);

  return (
    <div className="detective-panel radar-view-panel" dir={isRtl ? 'rtl' : 'ltr'}>
      {decoySuccessMsg && (
        <div className="tactical-toast-banner" role="alert">
          <CheckCircle size={16} />
          <span>{decoySuccessMsg}</span>
        </div>
      )}

      {/* Interactive Guide Banner: How the Map Works */}
      <div className="map-intel-guide-card">
        <div className="guide-header" onClick={() => setShowHowItWorks((prev) => !prev)}>
          <div className="guide-title">
            <Info size={16} className="guide-icon" />
            <b>{isRtl ? 'دليل قراءة الخريطة: كيف تستنتج موقع KIRA بدقة؟' : 'Detective Intel Guide: How Bayesian Tracking Works'}</b>
          </div>
          <button type="button" className="btn-toggle-guide" aria-label="Toggle Guide">
            {showHowItWorks ? (isRtl ? 'إخفاء الشرح ▲' : 'Hide Guide ▲') : (isRtl ? 'كيف تعمل الخريطة؟ ▼' : 'How it works? ▼')}
          </button>
        </div>

        {showHowItWorks && (
          <div className="guide-body">
            <div className="guide-step">
              <span className="step-num">1</span>
              <div>
                <b>{isRtl ? 'تحليل الوفيات البايزي (Bayesian Analysis):' : 'Bayesian Distribution:'}</b>
                <p>
                  {isRtl
                    ? 'كلما أعدم كيرا مجرماً بنوبة قلبية مفاجئة دون تحديد حادث، يسجل الحاسوب موقع بث الخبر ويرفع احتمال تمركز كيرا في ذلك القطاع.'
                    : 'Every uncamouflaged death increases the statistical likelihood that Kira operates from that broadcast sector.'}
                </p>
              </div>
            </div>

            <div className="guide-step">
              <span className="step-num">2</span>
              <div>
                <b>{isRtl ? 'الفخاخ التكتيكية الذكية:' : 'Deploy Tactical Traps:'}</b>
                <p>
                  {isRtl
                    ? 'انقر على أي قطاع ثم أطلق (بث الطُعم التلفزيوني 📺) أو (فخ ليند إل. تايلور 🎙️). إذا قتله كيرا، سيتأكد موقعه بنسبة 100%!'
                    : 'Select a suspected sector and launch a Decoy Broadcast or Lind L. Tailor trap to provoke Kira into revealing their base.'}
                </p>
              </div>
            </div>

            <div className="guide-step">
              <span className="step-num">3</span>
              <div>
                <b>{isRtl ? 'المداهمة الحاسمة (Checkmate):' : 'The Final Raid:'}</b>
                <p>
                  {isRtl
                    ? 'عندما ترتفع نسبة قطاع معين (باللون الأحمر 🔴)، اختر القطاع واضغط "تنفيذ المداهمة" لاعتقال كيرا وإنهاء القضية بانتصار L!'
                    : 'Once your confidence peaks in a sector (flashing Red 🔴), execute the raid to arrest Kira and win the game!'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Mobile Sector Selector Bar */}
      <div className="quick-sector-bar">
        <span className="quick-bar-label">
          <Compass size={13} />
          {isRtl ? 'التبديل السريع بين القطاعات:' : 'Quick Sector Bar:'}
        </span>
        <div className="quick-sector-pills">
          {ALL_REGIONS.map((r) => {
            const belief = d.geoBelief[r] || 0;
            const pct = Math.round(belief * 100);
            const isSelected = selRegion === r;
            const isTopSuspect = r === highestProbRegion && pct > 25;
            return (
              <button
                key={r}
                type="button"
                className={`quick-sector-pill ${isSelected ? 'selected' : ''} ${isTopSuspect ? 'top-suspect' : ''}`}
                onClick={() => setSelRegion(r)}
              >
                <span className="pill-name">{REGION_NAME[r][lang]}</span>
                <span className="pill-pct">{pct}%</span>
                {killsIn(r) > 0 && <span className="pill-kills">({killsIn(r)}☠️)</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="radar-layout-split">
        {/* Left Column: Tactical Map & Timetable Profiler */}
        <div className="radar-left-column">
          <div className="radar-card sector-map-card">
            <div className="card-top-bar">
              <div className="card-title">
                <MapPin size={15} />
                <span>{isRtl ? 'خريطة توزيع الاحتمال البايزي (Bayesian Heat Map)' : 'Bayesian Sector Heat Map'}</span>
              </div>
              <div className="top-status-badge">
                <span className="pulse-dot" />
                <span>
                  {isRtl
                    ? `أعلى اشتباه: ${REGION_NAME[highestProbRegion].ar} (${highestProbVal}%)`
                    : `Prime Suspect: ${REGION_NAME[highestProbRegion].en} (${highestProbVal}%)`}
                </span>
              </div>
            </div>

            {/* Tactical Map Container */}
            <div className="tactical-map-viewport">
              {/* Radar sweep beam animation */}
              <div className="radar-sweep-beam" />

              {/* Grid SVG Backdrop */}
              <svg viewBox="0 0 100 100" className="tactical-grid-svg" preserveAspectRatio="none">
                {/* Concentric distance radar rings */}
                <circle cx="50" cy="50" r="18" fill="none" stroke="#00f2fe" strokeWidth="0.3" strokeDasharray="1,2" opacity="0.3" />
                <circle cx="50" cy="50" r="34" fill="none" stroke="#00f2fe" strokeWidth="0.3" strokeDasharray="1,2" opacity="0.3" />
                <circle cx="50" cy="50" r="46" fill="none" stroke="#00f2fe" strokeWidth="0.3" strokeDasharray="1,2" opacity="0.2" />

                {/* Crosshairs */}
                <line x1="50" y1="0" x2="50" y2="100" stroke="#00f2fe" strokeWidth="0.3" strokeDasharray="2,3" opacity="0.25" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="#00f2fe" strokeWidth="0.3" strokeDasharray="2,3" opacity="0.25" />

                {/* Connection lines between sectors */}
                <line x1="50" y1="16" x2="50" y2="50" stroke="#00ff66" strokeWidth="0.4" strokeDasharray="1,2" opacity="0.3" />
                <line x1="22" y1="50" x2="50" y2="50" stroke="#00ff66" strokeWidth="0.4" strokeDasharray="1,2" opacity="0.3" />
                <line x1="78" y1="50" x2="50" y2="50" stroke="#00ff66" strokeWidth="0.4" strokeDasharray="1,2" opacity="0.3" />
                <line x1="50" y1="84" x2="50" y2="50" stroke="#00ff66" strokeWidth="0.4" strokeDasharray="1,2" opacity="0.3" />
              </svg>

              {/* 5 Geographic Sector Nodes */}
              {ALL_REGIONS.map((r) => {
                const belief = d.geoBelief[r] || 0;
                const pct = Math.round(belief * 100);
                const isSelected = selRegion === r;
                const isHighRisk = pct >= 40;
                const isMedRisk = pct >= 20 && pct < 40;
                const riskClass = isHighRisk ? 'risk-high' : isMedRisk ? 'risk-med' : 'risk-low';

                return (
                  <button
                    key={r}
                    type="button"
                    className={`tactical-sector-node ${isSelected ? 'selected' : ''} ${riskClass}`}
                    onClick={() => setSelRegion(r)}
                    style={{ left: `${MAP_POS[r].x}%`, top: `${MAP_POS[r].y}%` }}
                    aria-label={`Sector ${REGION_NAME[r][lang]}`}
                  >
                    {/* Animated Pulsing Heat Aura */}
                    <div
                      className="radar-ping-aura"
                      style={{
                        width: 32 + belief * 80,
                        height: 32 + belief * 80,
                        opacity: 0.2 + belief * 0.7,
                      }}
                    />

                    {/* Sector Content Card */}
                    <div className="node-inner-card">
                      <div className="node-header">
                        <span className="node-icon">{isHighRisk ? '🔴' : isMedRisk ? '🟡' : '🟢'}</span>
                        <span className="node-label">{REGION_NAME[r][lang]}</span>
                      </div>
                      <div className="node-metrics">
                        <b className="node-prob">{pct}%</b>
                        <span className="node-kills">{killsIn(r)} ☠️</span>
                      </div>
                      {isSelected && <div className="node-selected-bracket" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Detailed Selected Sector Summary Ribbon */}
            <div className="sector-info-ribbon">
              <div className="ribbon-main">
                <div className="ribbon-title-row">
                  <span className="ribbon-badge">{isRtl ? 'القطاع المحدد حالياً:' : 'Active Sector:'}</span>
                  <h4 className="ribbon-sector-name">
                    {SECTOR_METADATA[selRegion][isRtl ? 'titleAr' : 'titleEn']}
                  </h4>
                </div>
                <p className="ribbon-desc">{SECTOR_METADATA[selRegion][isRtl ? 'descAr' : 'descEn']}</p>
              </div>

              <div className="ribbon-stats-grid">
                <div className="ribbon-stat-item">
                  <small>{isRtl ? 'احتمال وجود كيرا' : 'Kira Presence Prob'}</small>
                  <b className={`stat-highlight ${Math.round((d.geoBelief[selRegion] || 0) * 100) >= 40 ? 'danger-color' : ''}`}>
                    {Math.round((d.geoBelief[selRegion] || 0) * 100)}%
                  </b>
                </div>
                <div className="ribbon-stat-item">
                  <small>{isRtl ? 'الوفيات المسجلة' : 'Recorded Deaths'}</small>
                  <b>{killsIn(selRegion)} ☠️</b>
                </div>
                <div className="ribbon-stat-item">
                  <small>{isRtl ? 'الحالة الميدانية' : 'Field Status'}</small>
                  <span className="stat-status-badge">
                    {isLindBroadcasting
                      ? (isRtl ? 'بث تايلور 🎙️' : 'Lind Broadcast 🎙️')
                      : (isRtl ? 'جاهز للعمليات 🛡️' : 'Ready for Operations 🛡️')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Timetable Histogram Profiler */}
          <div className="radar-card timetable-card">
            <div className="card-top-bar">
              <div className="card-title">
                <Crosshair size={15} />
                <span>{isRtl ? 'تحليل ساعات النشاط اليومي (Killer Active Hours)' : 'Killer Schedule Profiler'}</span>
              </div>
              <span className="profile-confidence-pill">
                {isRtl ? `دقة النمط: ${Math.round(d.profile.confidence * 100)}%` : `Pattern Confidence: ${Math.round(d.profile.confidence * 100)}%`}
              </span>
            </div>

            <div className="timetable-bars-stream">
              {d.hourHistogram.map((count: number, hour: number) => {
                const max = Math.max(1, ...d.hourHistogram);
                const heightPercent = (count / max) * 100;
                const isPeak = count === max && count > 0;
                return (
                  <div key={hour} className="timetable-col" title={`${hour}:00 — ${count} deaths`}>
                    <div className="bar-track">
                      <div className={`bar-fill ${isPeak ? 'peak-fill' : ''}`} style={{ height: `${heightPercent}%` }}>
                        {count > 0 && <span className="bar-count-tag">{count}</span>}
                      </div>
                    </div>
                    <span className="bar-hour-label">{hour % 3 === 0 ? `${hour}h` : ''}</span>
                  </div>
                );
              })}
            </div>

            <p className="timetable-profile-verdict">
              {d.profile.window ? (
                <>
                  🔍 {isRtl ? 'استنتاج L:' : "L's Deduction:"}{' '}
                  <b>
                    {isRtl
                      ? `القاتل ينشط في توقيت (${d.profile.window.from}:00 - ${d.profile.window.to}:00) بنمط ${tx(d.profile.label)}!`
                      : `Killer active during (${d.profile.window.from}:00 - ${d.profile.window.to}:00), matching ${tx(d.profile.label)}!`}
                  </b>
                </>
              ) : (
                <span>{isRtl ? 'لا يوجد نمط زمني كافٍ بعد؛ سأنتظر الوفيات القادمة.' : 'Insufficient data to deduce timetable profile.'}</span>
              )}
            </p>
          </div>

          {/* AI Case Notes Log */}
          <div className="radar-card deduction-notes-card">
            <div className="card-top-bar">
              <div className="card-title">
                <ShieldAlert size={15} />
                <span>{isRtl ? 'مذكرات L التحليلية الاستباقية' : 'Case Deduction Transcripts'}</span>
              </div>
            </div>
            <div className="notes-stream">
              {d.notes.length === 0 ? (
                <p className="empty-notes-hint">
                  {isRtl ? 'بانتظار تحركات كيرا الأولى لبدء استنتاج الهوية...' : 'Awaiting first moves by Kira to formulate deductions...'}
                </p>
              ) : (
                [...d.notes].reverse().map((note, idx) => (
                  <div key={idx} className="note-bubble">
                    <span className="note-seq">#{idx + 1}</span>
                    <p>{tx(note)}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Tactical Operations Deck */}
        <div className="radar-right-column">
          <div className="tactical-deck-header">
            <div className="deck-title-group">
              <Shield size={18} className="deck-icon" />
              <h4>{isRtl ? 'غرفة العمليات التكتيكية (Tactical Countermeasures)' : 'Tactical Operations Deck'}</h4>
            </div>
            <p className="deck-target-prompt">
              {isRtl
                ? `نفذ إجراءك في قطاع (${REGION_NAME[selRegion].ar}) المختار:`
                : `Target Sector: ${REGION_NAME[selRegion].en}`}
            </p>
          </div>

          <div className="tactical-actions-stack">
            {/* Operation 1: Plant Decoy */}
            <div className="tactical-card">
              <div className="card-icon-slot">
                <Radio size={20} className="op-icon decoy-icon" />
              </div>
              <div className="card-info">
                <b>{isRtl ? '📺 بث طُعم إعلامي كاذب (Decoy Broadcast)' : 'Broadcast Decoy Target'}</b>
                <p>
                  {isRtl
                    ? `بث خبر تلفزيوني عن مجرم وهمي حصرياً في قطاع ${REGION_NAME[selRegion].ar}. إذا قتله، نؤكد مكان إقامته!`
                    : `Broadcast fake criminal exclusively in ${REGION_NAME[selRegion].en}. If killed, verifies Kira's location!`}
                </p>
              </div>
              <button className="btn-tactical btn-decoy" onClick={onPlantDecoy}>
                {isRtl ? 'بث الطُعم التلفزيوني' : 'Deploy Decoy'}
              </button>
            </div>

            {/* Operation 2: Deploy CCTVs */}
            <div className="tactical-card">
              <div className="card-icon-slot">
                <Camera size={20} className="op-icon camera-icon" />
              </div>
              <div className="card-info">
                <b>{isRtl ? '📹 تشديد مراقبة الكاميرات (CCTV Sweep)' : 'Urban CCTV Surveillance'}</b>
                <p>
                  {isRtl
                    ? `نشر وحدات مراقبة ليلية وسرية في شوارع ${REGION_NAME[selRegion].ar} لكشف أي نشاط مريب.`
                    : `Deploy night-vision CCTV units across ${REGION_NAME[selRegion].en} streets.`}
                </p>
              </div>
              <button
                className={`btn-tactical btn-camera ${(state.surveillanceRegions || []).includes(selRegion) ? 'active' : ''}`}
                onClick={onDeployCamera}
              >
                {(state.surveillanceRegions || []).includes(selRegion)
                  ? (isRtl ? '✓ الكاميرات مفعلة' : '✓ CCTV Active')
                  : (isRtl ? 'تفعيل الكاميرات' : 'Activate CCTV')}
              </button>
            </div>

            {/* Operation 3: Lind L. Tailor Live Trap */}
            <div className="tactical-card lind-card">
              <div className="card-icon-slot">
                <Zap size={20} className="op-icon lind-icon" />
              </div>
              <div className="card-info">
                <b>{isRtl ? '🎙️ فخ ليند إل. تايلور الحي (Lind L. Tailor)' : 'Lind L. Tailor Live Challenge'}</b>
                <p>
                  {isRtl
                    ? `بث تحدي المحكوم بالإعدام "ليند إل. تايلور" مباشرة في ${REGION_NAME[selRegion].ar} لاستفزاز KIRA ليقضي عليه فوراً!`
                    : `Live TV challenge by death-row inmate posing as L in ${REGION_NAME[selRegion].en}!`
                  }
                </p>
              </div>
              <button
                className={`btn-tactical btn-lind ${isLindBroadcasting ? 'broadcasting' : ''}`}
                onClick={onLaunchLindBroadcast}
                disabled={isLindBroadcasting}
              >
                {isLindBroadcasting
                  ? `${isRtl ? 'البث جاري' : 'On Air'} (${lindCountdown}s)`
                  : isRtl ? 'إطلاق البث الحي' : 'Launch Broadcast'}
              </button>
            </div>

            {/* Operation 4: Media Blackout */}
            <div className="tactical-card blackout-card">
              <div className="card-icon-slot">
                <Radio size={20} className="op-icon blackout-icon text-yellow" />
              </div>
              <div className="card-info">
                <b>{isRtl ? '📡 تعتيم إعلامي تكتيكي (Media Blackout)' : 'Tactical Media Blackout'}</b>
                <p>
                  {isRtl
                    ? `حظر نشر أسماء المجرمين في تلفزيون ${REGION_NAME[selRegion].ar}. إذا مات مجرم هناك، نثبت أن القاتل يخترق حواسيب الشرطة!`
                    : `Censor criminal names on TV in ${REGION_NAME[selRegion].en}. If a criminal dies, proves Kira hacks police systems!`}
                </p>
              </div>
              <button
                className={`btn-tactical btn-blackout ${(state.mediaBlackoutRegions || []).includes(selRegion) ? 'active' : ''}`}
                onClick={onToggleBlackout}
              >
                {(state.mediaBlackoutRegions || []).includes(selRegion)
                  ? (isRtl ? '✓ التعتيم مفعل' : '✓ Blackout Active')
                  : (isRtl ? 'فرض التعتيم' : 'Impose Blackout')}
              </button>
            </div>

            {/* Operation 5: Tactical Interrogation Room */}
            <div className="tactical-card interrogation-card">
              <div className="card-icon-slot">
                <Compass size={20} className="op-icon text-cyan" />
              </div>
              <div className="card-info">
                <b>{isRtl ? '🔍 غرفة استجواب المشتبه بهم (Interrogation)' : 'Suspect Interrogation Chamber'}</b>
                <p>
                  {isRtl
                    ? `استدعاء 3 مشتبه بهم في قطاع ${REGION_NAME[selRegion].ar} والتحقيق معهم برصد نبضات القلب والمؤشرات الحيوية!`
                    : `Summon 3 suspects in ${REGION_NAME[selRegion].en} for interrogation with live heart rate telemetry!`}
                </p>
              </div>
              <button className="btn-tactical btn-interrogate" onClick={onOpenInterrogation}>
                {isRtl ? 'بدء الاستجواب' : 'Interrogate Suspects'}
              </button>
            </div>

            {/* Operation 6: Final Arrest Warrant */}
            <div className="tactical-card arrest-card">
              <div className="card-icon-slot">
                <AlertTriangle size={20} className="op-icon arrest-icon" />
              </div>
              <div className="card-info">
                <b>{isRtl ? '🚨 تنفيذ المداهمة النهائية (Final Raid)' : 'Issue Final Arrest Warrant'}</b>
                <p>
                  {isRtl
                    ? `مداهمة شاملة لقطاع ${REGION_NAME[selRegion].ar} ومحاصرة مقر ${killerName}! (تحذير: مداهمة القطاع الخاطئ تنهي التحقيق بالفشل!)`
                    : `Raid ${REGION_NAME[selRegion].en} to arrest ${killerName}! Warning: raiding wrong sector fails the case!`}
                </p>
              </div>
              <button className="btn-tactical btn-arrest" onClick={onIssueArrest}>
                {isRtl ? 'تنفيذ المداهمة' : 'Execute Raid'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
