import { defineQuizManifestCollection } from '../../lib/quiz-manifest.ts'

export const quizManifests = defineQuizManifestCollection([
  {
    id: 'which-greek-god-would-block-you-on-slack',
    slug: 'which-greek-god-would-block-you-on-slack',
    status: 'published',
    title: 'Which Greek God Would Block You on Slack?',
    description:
      'A workplace mythology quiz about tone, boundaries, and the exact moment a teammate decides you are no longer their problem.',
    results: [
      {
        id: 'athena',
        title: 'Athena',
        description:
          'You are correct, organized, and a little too calm while everyone else is improvising a disaster around you.',
      },
      {
        id: 'dionysus',
        title: 'Dionysus',
        description:
          'You keep morale alive through charm, menace, and the suggestion that no policy document can truly contain you.',
      },
      {
        id: 'hades',
        title: 'Hades',
        description:
          'You are reserved, observant, and somehow always the person with the final say when things get weird.',
      },
    ],
    questions: [
      {
        id: 'status-update',
        prompt: 'Your team asks for a quick status update. You reply with...',
        options: [
          {
            id: 'bullet-list',
            label: 'Three tidy bullets, one risk, and a next step.',
            weights: [{ resultId: 'athena', value: 3 }],
          },
          {
            id: 'voice-note',
            label: 'A voice note with energy, context, and one avoidable tangent.',
            weights: [{ resultId: 'dionysus', value: 3 }],
          },
          {
            id: 'single-sentence',
            label: 'One sentence so dense it counts as a minor spell.',
            weights: [{ resultId: 'hades', value: 3 }],
          },
        ],
      },
      {
        id: 'meeting-vibe',
        prompt: 'In a bad meeting, your survival strategy is...',
        options: [
          {
            id: 'diagram-it',
            label: 'Draw the hidden structure and make the room face it.',
            weights: [
              { resultId: 'athena', value: 2 },
              { resultId: 'hades', value: 1 },
            ],
          },
          {
            id: 'turn-it-into-a-bit',
            label: 'Turn it into a bit and see who deserves to keep up.',
            weights: [{ resultId: 'dionysus', value: 3 }],
          },
          {
            id: 'haunt-the-chat',
            label: 'Say very little now and become unforgettable later in the thread.',
            weights: [{ resultId: 'hades', value: 3 }],
          },
        ],
      },
      {
        id: 'calendar-crime',
        prompt: 'A coworker books a Friday 4:30 p.m. meeting. Your first instinct is...',
        options: [
          {
            id: 'decline-with-context',
            label: 'Decline with a polite explanation and a better alternative.',
            weights: [{ resultId: 'athena', value: 3 }],
          },
          {
            id: 'arrive-with-snacks',
            label: 'Attend purely for the spectacle and maybe bring snacks.',
            weights: [{ resultId: 'dionysus', value: 3 }],
          },
          {
            id: 'remember-forever',
            label: 'Say nothing, but the ledger is updated internally.',
            weights: [{ resultId: 'hades', value: 3 }],
          },
        ],
      },
      {
        id: 'desk-object',
        prompt: 'Pick the desk object that feels spiritually correct.',
        options: [
          {
            id: 'annotated-notebook',
            label: 'A notebook full of plans, arrows, and judgment.',
            weights: [{ resultId: 'athena', value: 2 }],
          },
          {
            id: 'suspicious-mug',
            label: 'A suspicious mug with a surprisingly strong point of view.',
            weights: [
              { resultId: 'dionysus', value: 2 },
              { resultId: 'athena', value: 1 },
            ],
          },
          {
            id: 'very-good-pen',
            label: 'A very good pen you do not lend to just anyone.',
            weights: [{ resultId: 'hades', value: 2 }],
          },
        ],
      },
    ],
  },
  {
    id: 'which-kitchen-appliance-would-betray-you-in-the-civil-war',
    slug: 'which-kitchen-appliance-would-betray-you-in-the-civil-war',
    status: 'published',
    title: 'Which Kitchen Appliance Would Betray You in the Civil War?',
    description:
      'A deeply unserious historical personality quiz about trust, pressure, and the household object most likely to sell you out dramatically.',
    results: [
      {
        id: 'stand-mixer',
        title: 'Stand Mixer',
        description:
          'Powerful, theatrical, and absolutely prepared to switch sides if the vibes improve by even fifteen percent.',
      },
      {
        id: 'toaster',
        title: 'Toaster',
        description:
          'Compact, efficient, and weirdly eager to create a small disaster the second nobody is looking.',
      },
      {
        id: 'slow-cooker',
        title: 'Slow Cooker',
        description:
          'Patient, charming, and fully willing to ruin you over the course of several extremely polite hours.',
      },
    ],
    questions: [
      {
        id: 'marching-energy',
        prompt: 'When a group project gets tense, you become...',
        options: [
          {
            id: 'loudly-capable',
            label: 'Loudly capable and a little too pleased with your own logistics.',
            weights: [{ resultId: 'stand-mixer', value: 3 }],
          },
          {
            id: 'small-and-sparking',
            label: 'Small, intense, and one bad comment away from sparks.',
            weights: [{ resultId: 'toaster', value: 3 }],
          },
          {
            id: 'steady-and-worrying',
            label: 'Steady, soothing, and somehow the most worrying person present.',
            weights: [{ resultId: 'slow-cooker', value: 3 }],
          },
        ],
      },
      {
        id: 'suspicion-threshold',
        prompt: 'How do you handle a suspiciously kind rival?',
        options: [
          {
            id: 'document-everything',
            label: 'Document everything and prepare three outcomes in advance.',
            weights: [
              { resultId: 'stand-mixer', value: 2 },
              { resultId: 'slow-cooker', value: 1 },
            ],
          },
          {
            id: 'smile-back',
            label: 'Smile back. If treachery comes, let it be interesting.',
            weights: [{ resultId: 'toaster', value: 3 }],
          },
          {
            id: 'wait-them-out',
            label: 'Wait them out with terrifying patience.',
            weights: [{ resultId: 'slow-cooker', value: 3 }],
          },
        ],
      },
      {
        id: 'fatal-flaw',
        prompt: 'Your fatal flaw in a melodrama is...',
        options: [
          {
            id: 'overconfidence',
            label: 'Overconfidence with excellent posture.',
            weights: [{ resultId: 'stand-mixer', value: 3 }],
          },
          {
            id: 'pettiness',
            label: 'A pettiness so efficient it almost counts as elegance.',
            weights: [{ resultId: 'toaster', value: 3 }],
          },
          {
            id: 'long-memory',
            label: 'A long memory and the ability to weaponize silence.',
            weights: [{ resultId: 'slow-cooker', value: 3 }],
          },
        ],
      },
      {
        id: 'final-sign',
        prompt: 'What sign should have told you betrayal was coming?',
        options: [
          {
            id: 'too-helpful',
            label: 'They were just a little too helpful, a little too early.',
            weights: [{ resultId: 'stand-mixer', value: 2 }],
          },
          {
            id: 'burnt-smell',
            label: 'There was a faint burnt smell around the whole enterprise.',
            weights: [
              { resultId: 'toaster', value: 2 },
              { resultId: 'stand-mixer', value: 1 },
            ],
          },
          {
            id: 'unnatural-calm',
            label: 'Everything was far too calm for far too long.',
            weights: [{ resultId: 'slow-cooker', value: 2 }],
          },
        ],
      },
    ],
  },
  {
    id: 'what-kind-of-town-legend-would-you-accidentally-become',
    slug: 'what-kind-of-town-legend-would-you-accidentally-become',
    status: 'published',
    title: 'What Kind of Town Legend Would You Accidentally Become?',
    description:
      'A quiz about aura management, unfortunate symbolism, and the exact folklore niche you were born to occupy by mistake.',
    results: [
      {
        id: 'bridge-figure',
        title: 'The Figure on the Bridge',
        description:
          'You did one mysterious thing at dusk and now the local teens have made you everybody’s problem forever.',
      },
      {
        id: 'polite-witch',
        title: 'The Polite Witch at the Edge of Town',
        description:
          'You are helpful, unsettling, and somehow always holding exactly the herb bundle the moment requires.',
      },
      {
        id: 'bell-tower-voice',
        title: 'The Voice in the Bell Tower',
        description:
          'You are dramatic, intermittent, and capable of changing the emotional weather of a whole neighborhood.',
      },
    ],
    questions: [
      {
        id: 'first-rumor',
        prompt: 'What starts the rumor about you?',
        options: [
          {
            id: 'seen-at-dusk',
            label: 'Someone saw you standing somewhere cinematic at dusk.',
            weights: [{ resultId: 'bridge-figure', value: 3 }],
          },
          {
            id: 'too-accurate-advice',
            label: 'Your advice worked a little too well a little too often.',
            weights: [{ resultId: 'polite-witch', value: 3 }],
          },
          {
            id: 'voice-carried',
            label: 'Your voice carried once, and now everyone is making it medieval.',
            weights: [{ resultId: 'bell-tower-voice', value: 3 }],
          },
        ],
      },
      {
        id: 'signature-energy',
        prompt: 'Pick your preferred unsettling energy.',
        options: [
          {
            id: 'silent-silhouette',
            label: 'Silent silhouette with excellent posture.',
            weights: [{ resultId: 'bridge-figure', value: 3 }],
          },
          {
            id: 'kind-but-ominous',
            label: 'Kind but ominous, like a recipe card with secrets.',
            weights: [{ resultId: 'polite-witch', value: 3 }],
          },
          {
            id: 'beautiful-echo',
            label: 'Beautiful echo that raises more questions than it answers.',
            weights: [{ resultId: 'bell-tower-voice', value: 3 }],
          },
        ],
      },
      {
        id: 'town-reaction',
        prompt: 'How does the town react to you over time?',
        options: [
          {
            id: 'invents-backstory',
            label: 'They invent a backstory so specific it becomes civic infrastructure.',
            weights: [{ resultId: 'bridge-figure', value: 2 }],
          },
          {
            id: 'brings-gifts',
            label: 'They bring gifts, gossip, and tomatoes from troubled gardens.',
            weights: [
              { resultId: 'polite-witch', value: 2 },
              { resultId: 'bridge-figure', value: 1 },
            ],
          },
          {
            id: 'looks-up-when-windy',
            label: 'They start looking up whenever the wind changes.',
            weights: [{ resultId: 'bell-tower-voice', value: 2 }],
          },
        ],
      },
      {
        id: 'true-motive',
        prompt: 'What are you actually trying to do this whole time?',
        options: [
          {
            id: 'mind-my-business',
            label: 'Mind your business, but with excellent silhouette work.',
            weights: [{ resultId: 'bridge-figure', value: 2 }],
          },
          {
            id: 'be-helpful',
            label: 'Be helpful while preserving a reasonable amount of mystique.',
            weights: [{ resultId: 'polite-witch', value: 2 }],
          },
          {
            id: 'set-the-tone',
            label: 'Set the tone and then leave people to process it.',
            weights: [{ resultId: 'bell-tower-voice', value: 2 }],
          },
        ],
      },
    ],
  },
])
