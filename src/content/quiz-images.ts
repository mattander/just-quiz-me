export type QuizImage = {
  src: string
  alt: string
  width: number
  height: number
  smallSrc?: string
}

type QuizImageSet = {
  cover: QuizImage
  results: Readonly<Record<string, QuizImage>>
  questions: Readonly<Record<string, QuizImage>>
}

function createImage(
  quizSlug: string,
  fileName: string,
  alt: string,
  smallFileName?: string,
): QuizImage {
  return {
    src: `/images/quizzes/${quizSlug}/${fileName}.webp`,
    alt,
    width: 1200,
    height: 800,
    ...(smallFileName
      ? { smallSrc: `/images/quizzes/${quizSlug}/${smallFileName}.webp` }
      : {}),
  }
}

const quizImages: Readonly<Record<string, QuizImageSet>> = {
  'which-greek-god-would-block-you-on-slack': {
    cover: createImage(
      'which-greek-god-would-block-you-on-slack',
      'cover',
      'An owl strategist handles a mythic office chat from a marble desk on Mount Olympus.',
      'cover-480',
    ),
    results: {
      athena: createImage(
        'which-greek-god-would-block-you-on-slack',
        'result-athena',
        'Athena calmly turns a storm of office messages into one precise plan.',
      ),
      dionysus: createImage(
        'which-greek-god-would-block-you-on-slack',
        'result-dionysus',
        'Dionysus transforms a bleak meeting into a small, unruly celebration.',
      ),
      hades: createImage(
        'which-greek-god-would-block-you-on-slack',
        'result-hades',
        'Hades quietly files the final message away beside a sleeping three-headed office dog.',
      ),
    },
    questions: {
      'meeting-vibe': createImage(
        'which-greek-god-would-block-you-on-slack',
        'question-meeting-vibe',
        'A mythic office meeting literally drifts off course into the mountains.',
      ),
      'feedback-request': createImage(
        'which-greek-god-would-block-you-on-slack',
        'question-feedback-request',
        'An office clock nears closing time beside organized notes, a comic mask, and one sealed message.',
      ),
    },
  },
  'which-kitchen-appliance-would-betray-you-in-the-civil-war': {
    cover: createImage(
      'which-kitchen-appliance-would-betray-you-in-the-civil-war',
      'cover',
      'A stand mixer, toaster, and slow cooker face off across a kitchen divided into rival camps.',
      'cover-480',
    ),
    results: {
      'stand-mixer': createImage(
        'which-kitchen-appliance-would-betray-you-in-the-civil-war',
        'result-stand-mixer',
        'A proud stand mixer takes the spotlight at a countertop strategy table.',
      ),
      toaster: createImage(
        'which-kitchen-appliance-would-betray-you-in-the-civil-war',
        'result-toaster',
        'A defiant toaster launches one decisive piece of toast into the air.',
      ),
      'slow-cooker': createImage(
        'which-kitchen-appliance-would-betray-you-in-the-civil-war',
        'result-slow-cooker',
        'A slow cooker quietly simmers while its steam forms an unnoticed master plan.',
      ),
    },
    questions: {
      'suspicion-threshold': createImage(
        'which-kitchen-appliance-would-betray-you-in-the-civil-war',
        'question-suspicion-threshold',
        'A rival toaster offers one perfect slice across a suspicious kitchen boundary.',
      ),
      'kitchen-truce': createImage(
        'which-kitchen-appliance-would-betray-you-in-the-civil-war',
        'question-kitchen-truce',
        'Rival kitchen appliances divide up jobs around a neutral cutting board.',
      ),
    },
  },
  'what-kind-of-town-legend-would-you-accidentally-become': {
    cover: createImage(
      'what-kind-of-town-legend-would-you-accidentally-become',
      'cover',
      'A mysterious figure stands between a moonlit bridge, cottage garden, and small-town bell tower.',
      'cover-480',
    ),
    results: {
      'bridge-figure': createImage(
        'what-kind-of-town-legend-would-you-accidentally-become',
        'result-bridge-figure',
        'A calm figure stands beneath one streetlamp on a misty small-town bridge.',
      ),
      'polite-witch': createImage(
        'what-kind-of-town-legend-would-you-accidentally-become',
        'result-polite-witch',
        'An observant gardener offers uncannily useful advice at a cottage gate.',
      ),
      'bell-tower-voice': createImage(
        'what-kind-of-town-legend-would-you-accidentally-become',
        'result-bell-tower-voice',
        'A luminous song travels from an old bell tower across a sleeping town.',
      ),
    },
    questions: {
      'signature-energy': createImage(
        'what-kind-of-town-legend-would-you-accidentally-become',
        'question-signature-energy',
        'Three different spotlights follow an ordinary person through a small-town square.',
      ),
      'too-accurate-detail': createImage(
        'what-kind-of-town-legend-would-you-accidentally-become',
        'question-too-accurate-detail',
        'Townspeople study a moon phase, an out-of-season flower, and a bell ringing by itself.',
      ),
    },
  },
  'which-email-signoff-is-your-villain-origin': {
    cover: createImage(
      'which-email-signoff-is-your-villain-origin',
      'cover',
      'A neat outgoing envelope casts a huge theatrical villain shadow across an office desk.',
      'cover-480',
    ),
    results: {
      regards: createImage(
        'which-email-signoff-is-your-villain-origin',
        'result-regards',
        'A crisp office figure seals an envelope as the room turns visibly colder.',
      ),
      'thanks-in-advance': createImage(
        'which-email-signoff-is-your-villain-origin',
        'result-thanks-in-advance',
        'A smiling strategist moves a task forward before the surprised team has agreed.',
      ),
      best: createImage(
        'which-email-signoff-is-your-villain-origin',
        'result-best',
        'One immaculate envelope sits on a huge conference table in a suddenly silent room.',
      ),
    },
    questions: {
      'thread-derailed': createImage(
        'which-email-signoff-is-your-villain-origin',
        'question-thread-derailed',
        'A neat email trail bursts into a parade of unrelated opinions and side quests.',
      ),
      'reply-all-crime': createImage(
        'which-email-signoff-is-your-villain-origin',
        'question-reply-all-crime',
        'One tiny envelope duplicates across an office like a flock of startled birds.',
      ),
    },
  },
  'what-kind-of-group-chat-chaos-are-you': {
    cover: createImage(
      'what-kind-of-group-chat-chaos-are-you',
      'cover',
      'A phone erupts into a tiny weather system of messages, dinner plans, and mysterious photos.',
      'cover-480',
    ),
    results: {
      'weather-event': createImage(
        'what-kind-of-group-chat-chaos-are-you',
        'result-weather-event',
        'A tiny thunderstorm bursts from a phone and blows message bubbles around a kitchen table.',
      ),
      archivist: createImage(
        'what-kind-of-group-chat-chaos-are-you',
        'result-archivist',
        'A calm archivist organizes old screenshots, plans, and reaction symbols with perfect accuracy.',
      ),
      'soft-launch': createImage(
        'what-kind-of-group-chat-chaos-are-you',
        'result-soft-launch',
        'Friends assemble three vague photo fragments into one major life update.',
      ),
    },
    questions: {
      'planning-dinner': createImage(
        'what-kind-of-group-chat-chaos-are-you',
        'question-planning-dinner',
        'A phone is surrounded by a storm cloud, archived menus, and one vague food photo.',
      ),
      'private-dm-check': createImage(
        'what-kind-of-group-chat-chaos-are-you',
        'question-private-dm-check',
        'A caring friend leans toward a phone spilling alarming clues and a tiny pressure cloud.',
      ),
    },
  },
  'which-minor-office-object-would-haunt-you': {
    cover: createImage(
      'which-minor-office-object-would-haunt-you',
      'cover',
      'A stapler, badge lanyard, and conference-room remote haunt an empty office after dark.',
      'cover-480',
    ),
    results: {
      stapler: createImage(
        'which-minor-office-object-would-haunt-you',
        'result-stapler',
        'A red stapler floats above one nearly perfect stack of papers with a crooked corner.',
      ),
      'badge-lanyard': createImage(
        'which-minor-office-object-would-haunt-you',
        'result-badge-lanyard',
        'An empty badge lanyard coils through a row of locked office doors.',
      ),
      'conference-room-remote': createImage(
        'which-minor-office-object-would-haunt-you',
        'result-conference-room-remote',
        'A remote with twelve mysterious blank buttons hovers above a waiting conference room.',
      ),
    },
    questions: {
      'haunting-location': createImage(
        'which-minor-office-object-would-haunt-you',
        'question-haunting-location',
        'A supply closet, locked badge door, and dark conference room each hold one ghostly clue.',
      ),
      'witness-count': createImage(
        'which-minor-office-object-would-haunt-you',
        'question-witness-count',
        'Three coworkers turn toward a stapler frozen in midair.',
      ),
    },
  },
  'which-parking-lot-bird-is-judging-you': {
    cover: createImage(
      'which-parking-lot-bird-is-judging-you',
      'cover',
      'A seagull, grackle, and pigeon form a stern judging panel above a grocery-store parking lot.',
      'cover-480',
    ),
    results: {
      seagull: createImage(
        'which-parking-lot-bird-is-judging-you',
        'result-seagull',
        'A seagull stands on a shopping cart like a loud, unauthorized judge.',
      ),
      grackle: createImage(
        'which-parking-lot-bird-is-judging-you',
        'result-grackle',
        'An iridescent grackle audits a car parked slightly over the line.',
      ),
      pigeon: createImage(
        'which-parking-lot-bird-is-judging-you',
        'result-pigeon',
        'A weary pigeon studies a grocery receipt and returned cart with gentle disappointment.',
      ),
    },
    questions: {
      'snack-threat': createImage(
        'which-parking-lot-bird-is-judging-you',
        'question-snack-threat',
        'Three parking-lot birds close in on a shopper holding one french fry.',
      ),
      'errand-flaw': createImage(
        'which-parking-lot-bird-is-judging-you',
        'question-errand-flaw',
        'Judging birds observe an abandoned cart, crooked parking job, and prematurely eaten snack.',
      ),
    },
  },
  'which-haunted-spreadsheet-tab-are-you': {
    cover: createImage(
      'which-haunted-spreadsheet-tab-are-you',
      'cover',
      'Ghostly grid cells, hidden notes, and an ancient pivot machine emerge from a midnight spreadsheet.',
      'cover-480',
    ),
    results: {
      'budget-tab': createImage(
        'which-haunted-spreadsheet-tab-are-you',
        'result-budget-tab',
        'A spectral calculator compares cheerful plans with a much smaller stack of coins.',
      ),
      'hidden-assumptions': createImage(
        'which-haunted-spreadsheet-tab-are-you',
        'result-hidden-assumptions',
        'A hidden spreadsheet tab opens beneath a simple plan and releases unwritten notes.',
      ),
      'old-pivot-table': createImage(
        'which-haunted-spreadsheet-tab-are-you',
        'result-old-pivot-table',
        'An ancient brass office machine produces a mysterious total for baffled coworkers.',
      ),
    },
    questions: {
      'planning-style': createImage(
        'which-haunted-spreadsheet-tab-are-you',
        'question-planning-style',
        'A chaotic plan divides into a budget grid, hidden notes, and an antique summary machine.',
      ),
      'meeting-confession': createImage(
        'which-haunted-spreadsheet-tab-are-you',
        'question-meeting-confession',
        'A glowing spreadsheet cell reveals coins, hidden notes, and antique pivot gears.',
      ),
    },
  },
  'which-soup-are-you-in-a-crisis': {
    cover: createImage(
      'which-soup-are-you-in-a-crisis',
      'cover',
      'Three warm bowls of soup form a tiny emergency response team around a ringing phone.',
      'cover-480',
    ),
    results: {
      'tomato-soup': createImage(
        'which-soup-are-you-in-a-crisis',
        'result-tomato-soup',
        'A bright bowl of tomato soup arrives quickly beside grilled cheese and a clear boundary line.',
      ),
      'chicken-noodle': createImage(
        'which-soup-are-you-in-a-crisis',
        'result-chicken-noodle',
        'A practical bowl of chicken noodle soup organizes a blanket, kettle, and medicine spoon.',
      ),
      'miso-soup': createImage(
        'which-soup-are-you-in-a-crisis',
        'result-miso-soup',
        'A quiet bowl of miso sends calm rings of steam through a busy room.',
      ),
    },
    questions: {
      'comfort-method': createImage(
        'which-soup-are-you-in-a-crisis',
        'question-comfort-method',
        'Tomato, chicken noodle, and miso soup offer three distinct kinds of comfort.',
      ),
      'misread-comfort': createImage(
        'which-soup-are-you-in-a-crisis',
        'question-misread-comfort',
        'A caring person offers three soups while onlookers misunderstand the gesture in different ways.',
      ),
    },
  },
  'which-cryptid-would-borrow-your-hoodie': {
    cover: createImage(
      'which-cryptid-would-borrow-your-hoodie',
      'cover',
      'A moth creature, forest giant, and lake monster pass one cozy red hoodie between them.',
      'cover-480',
    ),
    results: {
      mothman: createImage(
        'which-cryptid-would-borrow-your-hoodie',
        'result-mothman',
        'Mothman returns a clean hoodie at dawn, folded terribly and carrying an omen.',
      ),
      bigfoot: createImage(
        'which-cryptid-would-borrow-your-hoodie',
        'result-bigfoot',
        'A gentle forest giant returns a warm borrowed hoodie to a cabin porch.',
      ),
      'lake-monster': createImage(
        'which-cryptid-would-borrow-your-hoodie',
        'result-lake-monster',
        'A friendly lake monster proudly returns a damp, stretched hoodie from the water.',
      ),
    },
    questions: {
      'borrower-red-flag': createImage(
        'which-cryptid-would-borrow-your-hoodie',
        'question-borrower-red-flag',
        'A favorite hoodie hangs between three cryptids displaying very different warning signs.',
      ),
      'loan-terms': createImage(
        'which-cryptid-would-borrow-your-hoodie',
        'question-loan-terms',
        'Three cryptids study symbolic hoodie rules for timing, folding, dryness, and stretching.',
      ),
    },
  },
}

export function getQuizCoverImage(quizSlug: string): QuizImage | null {
  return quizImages[quizSlug]?.cover ?? null
}

export function getQuizResultImage(
  quizSlug: string,
  resultId: string,
): QuizImage | null {
  return quizImages[quizSlug]?.results[resultId] ?? null
}

export function getQuizQuestionImage(
  quizSlug: string,
  questionId: string,
): QuizImage | null {
  return quizImages[quizSlug]?.questions[questionId] ?? null
}
