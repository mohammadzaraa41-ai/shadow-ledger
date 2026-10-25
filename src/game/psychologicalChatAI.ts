import type { GameState } from './store';
import type { PlayerRole } from './multiplayer';

export interface ReplyContext {
  playerMessage: string;
  playerRole: PlayerRole;
  opponentName: string;
  lang: 'ar' | 'en';
  gameState?: GameState;
}

export interface ProactiveContext {
  trigger: 'DAY_START' | 'HIGH_SUSPICION' | 'VICTIM_KILLED' | 'LIND_BROADCAST' | 'GAME_START';
  playerRole: PlayerRole;
  opponentName: string;
  lang: 'ar' | 'en';
  gameState?: GameState;
}

// Memory of recent replies to prevent immediate repetition
const recentReplies: string[] = [];
function pickUnique(pool: string[]): string {
  const available = pool.filter((msg) => !recentReplies.includes(msg));
  const chosen = (available.length > 0 ? available : pool)[Math.floor(Math.random() * (available.length > 0 ? available.length : pool.length))];
  recentReplies.push(chosen);
  if (recentReplies.length > 15) recentReplies.shift();
  return chosen;
}

/**
 * Generates an intelligent, psychological response when a player messages the AI in Solo mode.
 */
export function generatePsychologicalReply({
  playerMessage,
  playerRole,
  opponentName: _opponentName,
  lang,
  gameState,
}: ReplyContext): string {
  const msg = playerMessage.toLowerCase().trim();
  const isAr = lang === 'ar';
  const suspicion = gameState?.player?.suspicion ?? 0;

  // -------------------------------------------------------------
  // Scenario 1: Player is KILLER (The Shadow) -> AI is DETECTIVE (Cipher / L)
  // -------------------------------------------------------------
  if (playerRole === 'KILLER') {
    // 1. Player threatens or claims they will kill the detective
    if (
      msg.includes('ساقتلك') ||
      msg.includes('سأقتلك') ||
      msg.includes('موت') ||
      msg.includes('تموت') ||
      msg.includes('اسمك') ||
      msg.includes('دورك') ||
      msg.includes('kill you') ||
      msg.includes('die') ||
      msg.includes('next') ||
      msg.includes('dead')
    ) {
      return pickUnique(
        isAr
          ? [
              'التهديد المباشر هو الحيلة المفضلة لمن بدأ يشعر بحبل المشنقة يضيق. لتقتلني تحتاج لاسم ووجه.. وأنا لست سوى صوت وشاشة.',
              'تقول أنني الهدف التالي؟ ممتاز، هذا يثبت أنني أقض مضجعك. كلما حاولت استهدافي، اقتربت الشرطة خطوة من موقعك الحقيقي.',
              'حاول ما شئت.. حتى لو سقطت أنا، فإن الفريق الخاص يمتلك كل خوارزميات التتبع الجغرافي لتحركاتك.',
              'الغضب والتهديد بالقتل يفقدك تركيزك التحليلي. استمر في الانفعال، فالأخطاء هي كل ما أنتظره منك.',
            ]
          : [
              'Direct threats are the weapon of someone feeling the walls close in. To take my life, you need a name and a face—and I am merely a voice in the wire.',
              'You claim I am next? Splendid. It confirms I am getting under your skin. The closer you reach for me, the closer Interpol gets to your doorstep.',
              'Rage clouds deduction. Keep lashing out; emotional slip-ups are exactly what I am waiting for.',
              'Even if you could erase me, the Task Force already holds your behavioral timeline. You cannot execute an entire algorithm.',
            ]
      );
    }

    // 2. Player boasts about being God / Absolute Justice / Arrogant
    if (
      msg.includes('إله') ||
      msg.includes('اله') ||
      msg.includes('عدالة') ||
      msg.includes('قاضي') ||
      msg.includes('العدالة') ||
      msg.includes('فاشل') ||
      msg.includes('غبي') ||
      msg.includes('god') ||
      msg.includes('justice') ||
      msg.includes('fool') ||
      msg.includes('weak') ||
      msg.includes('judge')
    ) {
      return pickUnique(
        isAr
          ? [
              'تدّعي أنك إله العدالة، لكنك تختبئ كأي مجرم مذعور خلف شاشة ودفتر في غرفة مظلمة. العدالة الحقيقية لا تخشى النور.',
              'الغرور هو الثغرة الكبرى في عقلك. كل قاتل متسلسل ظن في بدايته أنه مختار من السماء.. وانتهى جميعهم بنفس الطريقة.',
              'أنت لست قاضياً، بل عارضاً لمرض جنون العظمة. ومهمتي ليست نقاشك فلسفياً، بل وضع الأصفاد في يديك.',
              'تسمي القتل العشوائي عدالة؟ لقد حللنا سجلات ضحاياك.. إنك تتبع نمطاً دنيوياً بشرياً يمكن التنبؤ به بنسبة 94%.',
            ]
          : [
              'You preach godhood, yet you cower behind a desk like any common fugitive. Real justice does not fear the daylight.',
              'Hubris is your fatal flaw. Every megalomaniac believes they are divine, right until the iron bars slam shut.',
              'You are no deity; you are a psychological subject with an inflated ego. My job is not debate—it is checkmate.',
              'You call execution justice? We analyzed your victim records. Your pattern is distinctly, predictably human.',
            ]
      );
    }

    // 3. Player asks where the detective is or tries to probe location
    if (
      msg.includes('وينك') ||
      msg.includes('أين أنت') ||
      msg.includes('اين انت') ||
      msg.includes('مكانك') ||
      msg.includes('من انت') ||
      msg.includes('من أنت') ||
      msg.includes('who are you') ||
      msg.includes('where are you') ||
      msg.includes('location')
    ) {
      return pickUnique(
        isAr
          ? [
              'أنا أقرب مما تتخيل.. ربما أمر بجانبك غداً، أو أكون المحلل الذي يراجع إحصاءات الكهرباء في حيك الآن.',
              'المكان ليس مهماً.. المهم هو أنني أرى كل سطر تكتبه وكل توقيت تختاره. عيناي في كل كاميرا مرورية بالمدينة.',
              'تسأل عن موقعي لتبحث عن اسمي؟ لن تجده. لكن أنا من سيسألك قريباً: هل فحصت نافذة غرفتك الليلة؟',
              'اسمي ومكاني محصنان ببروتوكولات سرية للغاية. ركز على إخفاء هويتك أنت، فدائرتك الجغرافية تضيق.',
            ]
          : [
              'I am closer than you think. Perhaps a commuter next to you, perhaps the analyst tracking power spikes on your block.',
              'My coordinates do not matter. What matters is that your schedule is mapped across our surveillance grid.',
              'Probing for my identity? You will find nothing. The question is: have you checked who is watching outside your window?',
              'My presence is encrypted under top-tier Interpol clearance. Focus on your own shadows; your sector is narrowing.',
            ]
      );
    }

    // 4. High suspicion context (> 60%)
    if (suspicion >= 60) {
      return pickUnique(
        isAr
          ? [
              `مؤشر الاشتباه وصل إلى ${Math.round(suspicion)}%.. ضربات قلبك متسارعة أليس كذلك؟ فريق التدخل السريع يضع اللمسات الأخيرة.`,
              'أشعر بارتباك كلماتك. حتى كتابتك أصبحت متوترة.. التحليل الصوتي واللغوي يؤكد أنك محاصر.',
              'المهلة تقترب من الصفر. يمكنك الاستمرار في إرسال الرسائل، لكن سيارات المداهمة بدأت بالتحرك بالفعل.',
            ]
          : [
              `Suspicion sits at ${Math.round(suspicion)}%. Your pulse is quickening, isn't it? The perimeter teams are standing by.`,
              'Your syntax is betraying panic. The behavioral algorithms show an 82% probability of imminent collapse.',
              'Time is running out. Send all the taunts you like—the tactical units have their warrants drafted.',
            ]
      );
    }

    // 5. Default psychological response from Detective Cipher
    return pickUnique(
      isAr
        ? [
            'سجلت ملاحظتك. كل رسالة ترسلها عبر هذه القناة تمنحنا بيانات زمنية تساعدنا في تقليص قائمة المشتبه بهم.',
            'تتحدث بثقة مفرطة، لكن الصمت بين جرائمك يكشف ترددك وخوفك الدائم من الخطوة الخاطئة.',
            'استمر في الكلام.. المحقق الماهر لا يستمع للكلمات فقط، بل يستمع لما تحاول جاهداً إخفاءه خلفها.',
            'المدينة تراقب.. وأنا لا أحتاج سوى زلة واحدة لإنهاء هذه المهزلة إلى الأبد.',
          ]
        : [
            'Noted. Every transmission across this encrypted feed provides latency data that narrows our search radius.',
            'You feign supreme confidence, but the gaps in your timeline reveal constant paranoia.',
            'Keep talking. A seasoned investigator does not just read your words; we decipher what you are desperately trying to conceal.',
            'The entire city is holding its breath. I only need one miscalculation to close this dossier permanently.',
          ]
    );
  }

  // -------------------------------------------------------------
  // Scenario 2: Player is DETECTIVE (Cipher / L) -> AI is KILLER (The Shadow / Kira)
  // -------------------------------------------------------------
  // 1. Detective commands surrender or claims checkmate
  if (
    msg.includes('استسلم') ||
    msg.includes('سلم') ||
    msg.includes('كشفتك') ||
    msg.includes('نهايتك') ||
    msg.includes('مداهمة') ||
    msg.includes('اعتقال') ||
    msg.includes('surrender') ||
    msg.includes('checkmate') ||
    msg.includes('arrest') ||
    msg.includes('caught')
  ) {
    return pickUnique(
      isAr
        ? [
            'استسلم؟ لمن؟ لقوانين عاجزة تحمي المجرمين خلف ثغرات المحامين؟ أنا من يمنح الضحايا حقوقهم الآن.',
            'تقول أنك كشفتني؟ ارفع أمر التوقيف وداهم إن كنت تجرؤ! ستجد فقط ظلاً يضحك على سذاجتك.',
            'كش ملك؟ أنت تلعب بأحجار من ورق، بينما أملك أنا سلطة الحياة والموت. فكر مجدداً في من يحاصر الآخر.',
            'لن تضع يدك عليّ أبداً يا سايفر. قبل أن تصل إلى بابي، سيكون قلمي قد خط نهاية مسيرتك البوليسية.',
          ]
        : [
            'Surrender? To whom? A bureaucratic system that shelters parasites behind legal loopholes? I deliver what you cannot.',
            'You claim you have caught me? Issue your warrant and raid! You will find nothing but smoke and your own humiliation.',
            'Checkmate? You are pushing pawns on a wooden board while I command life and death itself.',
            'You will never lay handcuffs on me, detective. Before you reach my doorstep, judgment will be signed.',
          ]
    );
  }

  // 2. Detective questions or taunts Kira about identity / hideout
  if (
    msg.includes('أين') ||
    msg.includes('اين') ||
    msg.includes('اسمك') ||
    msg.includes('من انت') ||
    msg.includes('من أنت') ||
    msg.includes('قطاع') ||
    msg.includes('where') ||
    msg.includes('who are you') ||
    msg.includes('sector') ||
    msg.includes('region')
  ) {
    return pickUnique(
      isAr
        ? [
            'تبحث في الخرائط كالأعمى.. أتحرك بين الملايين في هذه المدينة، وصورتي لا توجد في أي حاسوب لديك.',
            'سؤالي لك: هل تظن حقاً أن قطاعاً جغرافياً يمكنه احتواء فكرة؟ حتى لو فنيت أنا، العدالة لن تتوقف.',
            'تبحث عن اسمي؟ لو عرفت اسمك الحقيقي ورأيت وجهك الصريح لدقيقة واحدة، لانتهت هذه اللعبة قبل 40 ثانية.',
            'راقب الأخبار غداً صباحاً.. سترى ردي العملي على تساؤلاتك التافهة عن موقعي.',
          ]
        : [
            'Blindly scouring map grids. I walk among millions in this metropolis, uncatalogued and untouchable.',
            'Do you honestly believe a geographical sector can contain a divine ideal? Ideas do not bleed.',
            'Searching for my name? If I had your real name and an unmasked photograph, this duel would conclude in 40 seconds.',
            'Check tomorrow’s obituary column. That is my answer to your pathetic questions.',
          ]
    );
  }

  // 3. Default mocking from The Shadow / Kira
  return pickUnique(
    isAr
      ? [
          'استمر في كتابة التقارير وتحليل المؤشرات.. بينما أنت تطبع الأوراق، أنا أصنع تاريخاً جديداً بالكامل.',
          'هل تشعر بالعجز يا حضرة المحقق؟ الجريمة انخفضت بنسبة 70% منذ بدأت عملي.. العالم يحبني ويرفض عجزك.',
          'أنت تضيع وقتك الثمين في هذه المحادثة.. هناك اسم جديد يجف حبره في دفتري في هذه اللحظة.',
          'لست أول من حاول مطاردتي، لكن أعدك بأنك ستكون الأكثر ندماً على قبول هذه القضية.',
        ]
      : [
          'Continue typing your reports. While you shuffle bureaucracy, I am forging a new world with every stroke of ink.',
          'Do you feel the impotence of your office? Crime has plummeted 70% since I took up the mantle. Humanity welcomes me.',
          'You are wasting precious seconds here. Another target’s ink is drying in my ledger right now.',
          'You are not the first to attempt hunting me, but I promise you will regret taking this assignment most of all.',
        ]
  );
}

/**
 * Generates proactive, unprompted psychological taunts or warnings triggered by game events.
 */
export function generateProactiveAIMessage({
  trigger,
  playerRole,
  opponentName: _opponentName,
  lang,
  gameState,
}: ProactiveContext): string {
  const isAr = lang === 'ar';
  const day = gameState?.player?.day ?? 1;
  const suspicion = Math.round(gameState?.player?.suspicion ?? 0);

  if (playerRole === 'KILLER') {
    // Detective Cipher speaking to player Killer
    switch (trigger) {
      case 'GAME_START':
        return isAr
          ? 'المحقق سايفر متصل.. استمع إلي جيداً: مهما كانت القوة الخارقة التي تستخدمها، فإن خطأً إحصائياً واحداً سيكشف هويتك.'
          : 'Detective Cipher online. Listen closely: no matter your supernatural instrument, a single mathematical slip will deliver you to me.';
      case 'DAY_START':
        return isAr
          ? `اليوم ${day} يبدأ.. عيون المراقبة منتشرة في كل القطاعات. هل ستجرؤ على استخدام دفترك اليوم؟`
          : `Day ${day} dawns. The surveillance grid has been expanded. Do you dare write another name today?`;
      case 'HIGH_SUSPICION':
        return isAr
          ? `تنبيه: مؤشر الشبهة قفز إلى ${suspicion}%! ملامح المشتبه به ومواعيد فراغه أصبحت شبه مؤكدة لدينا.`
          : `Alert: Suspicion reached ${suspicion}%! Your schedule and habits are forming a lethal correlation on my board.`;
      case 'VICTIM_KILLED':
        return isAr
          ? 'رصدنا وفاة مفاجئة جديدة.. كل سكتة قلبية تسجلها تمنحنا إحداثيات توقيت دقيقة تثبت أنك لست شبحاً بل إنسان مقيد بالوقت.'
          : 'Another cardiac arrest reported. Each execution registers timestamp telemetry proving you are bound by human routine.';
      case 'LIND_BROADCAST':
        return isAr
          ? 'شاهد الشاشة الآن! البث التلفزيوني التكتيكي المباشر يعرض تحدياً صريحاً.. هل ستملك الجرأة لترد؟'
          : 'Check the television monitors! A direct live broadcast has been launched in your sector. Do you have the spine to answer?';
    }
  } else {
    // Killer / The Shadow speaking to player Detective
    switch (trigger) {
      case 'GAME_START':
        return isAr
          ? 'أهلاً بك في ساحتي أيها المحقق. ظننت أنك تستطيع حماية الفاسدين؟ افتح سجلك وراقب كيف أغير العالم.'
          : 'Welcome to my court, detective. You thought you could protect this rotten syndicate? Watch how I reshape reality.';
      case 'DAY_START':
        return isAr
          ? `الشمس أشرقت على اليوم ${day}.. والعدالة لا تنام. هناك أسماء فاسدة ستسقط قبل غروب هذا المساء.`
          : `Sunrise on Day ${day}. Divine justice never sleeps. Corrupt figureheads will collapse before twilight.`;
      case 'HIGH_SUSPICION':
        return isAr
          ? 'تظن أنك تقترب مني؟ حتى لو داهمت كل شارع في القطاع، فإنك تطارد طيفاً أعظم من خيالك.'
          : 'You believe you are cornering me? Raid every street in this sector; you are chasing an idea far beyond your grasp.';
      case 'VICTIM_KILLED':
        return isAr
          ? 'سقط رأس آخر من رؤوس الجريمة.. هل سمعت صفارات الإنذار؟ شرطتك تصل دائماً بعد فوات الأوان.'
          : 'Another corrupt titan has fallen. Hear the sirens? Your police force always arrives precisely too late.';
      case 'LIND_BROADCAST':
        return isAr
          ? 'بث تلفزيوني ساذج؟ تظن أنك ستستفزني بهذه الخدعة الطفولية؟ راقب ما سيحدث لمذيعك المتطوع.'
          : 'A childish television decoy? You think a staged television broadcast can rattle me? Watch what happens to your speaker.';
    }
  }
}
