import { defineQuizManifestCollection } from '../../lib/quiz-manifest.ts'

export const quizManifests = defineQuizManifestCollection([
  {
    id: 'which-greek-god-would-block-you-on-slack',
    slug: 'which-greek-god-would-block-you-on-slack',
    status: 'published',
    title: 'Which Greek God Would Block You on Slack?',
    description:
      'A workplace personality quiz about communication style, conflict habits, and which Olympian would quietly decide your Slack privileges are over.',
    results: [
      {
        id: 'athena',
        title: 'Athena',
        description:
          'You are the person who turns panic into a plan. Athena blocks you only after you send the fourth clarifying question, because she respects your structure but refuses to join another planning thread.',
      },
      {
        id: 'dionysus',
        title: 'Dionysus',
        description:
          'You bring energy, jokes, and emotional momentum into rooms that were previously dying under a shared agenda. Dionysus blocks you when the bit becomes stronger than the meeting, but he checks back later because morale improved.',
      },
      {
        id: 'hades',
        title: 'Hades',
        description:
          'You keep your circle small, your receipts organized, and your boundaries beautifully immovable. Hades blocks you because you both know the conversation ended three messages ago and silence is the cleanest project management tool.',
      },
    ],
    questions: [
      {
        id: 'status-update',
        prompt: 'Your team asks for a quick status update. What do you send?',
        options: [
          {
            id: 'bullet-list',
            label: 'Three clear bullets: what changed, what is blocked, and what happens next.',
            weights: [{ resultId: 'athena', value: 3 }],
          },
          {
            id: 'voice-note',
            label: 'A lively voice note that gives context and somehow makes everyone less tense.',
            weights: [{ resultId: 'dionysus', value: 3 }],
          },
          {
            id: 'single-sentence',
            label: 'One careful sentence that answers the question and quietly closes the loop.',
            weights: [{ resultId: 'hades', value: 3 }],
          },
        ],
      },
      {
        id: 'meeting-vibe',
        prompt: 'A meeting starts drifting off the rails. What do you do first?',
        options: [
          {
            id: 'diagram-it',
            label: 'Name the decision, map the tradeoffs, and get everyone back to the point.',
            weights: [
              { resultId: 'athena', value: 2 },
              { resultId: 'hades', value: 1 },
            ],
          },
          {
            id: 'turn-it-into-a-bit',
            label: 'Use a well-timed joke to reset the room before everyone loses the will to live.',
            weights: [{ resultId: 'dionysus', value: 3 }],
          },
          {
            id: 'haunt-the-chat',
            label: 'Stay quiet in the room, then drop the exact right summary in the follow-up thread.',
            weights: [{ resultId: 'hades', value: 3 }],
          },
        ],
      },
      {
        id: 'calendar-crime',
        prompt: 'A coworker books a Friday 4:30 p.m. meeting. What is your move?',
        options: [
          {
            id: 'decline-with-context',
            label: 'Decline politely, suggest a better time, and explain what can be decided async.',
            weights: [{ resultId: 'athena', value: 3 }],
          },
          {
            id: 'arrive-with-snacks',
            label: 'Show up with charm, keep the mood alive, and make the best of a strange choice.',
            weights: [{ resultId: 'dionysus', value: 3 }],
          },
          {
            id: 'remember-forever',
            label: 'Accept it, say very little, and mentally update your trust model forever.',
            weights: [{ resultId: 'hades', value: 3 }],
          },
        ],
      },
      {
        id: 'desk-object',
        prompt: 'Which desk object best represents your work personality?',
        options: [
          {
            id: 'annotated-notebook',
            label: 'A notebook full of priorities, diagrams, and backup plans.',
            weights: [{ resultId: 'athena', value: 2 }],
          },
          {
            id: 'suspicious-mug',
            label: 'A mug that starts conversations and makes the desk feel less bleak.',
            weights: [
              { resultId: 'dionysus', value: 2 },
              { resultId: 'athena', value: 1 },
            ],
          },
          {
            id: 'very-good-pen',
            label: 'A very good pen that you do not lend out because trust has limits.',
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
      'A household loyalty quiz about pressure, grudges, and which appliance would absolutely pick a side if your kitchen turned political.',
    results: [
      {
        id: 'stand-mixer',
        title: 'Stand Mixer',
        description:
          'You are capable, impressive, and a little too aware of your own stage presence. The stand mixer betrays you because it loves competence, but it loves being central to the operation even more.',
      },
      {
        id: 'toaster',
        title: 'Toaster',
        description:
          'You are direct, fast, and occasionally powered by spite. The toaster betrays you in a small, decisive way: one lever, one spark, one perfectly timed denial that it was ever involved.',
      },
      {
        id: 'slow-cooker',
        title: 'Slow Cooker',
        description:
          'You are patient enough to look harmless while the whole situation quietly becomes yours. The slow cooker betrays you gradually, with warmth, plausible deniability, and a plan nobody notices until dinner.',
      },
    ],
    questions: [
      {
        id: 'marching-energy',
        prompt: 'A group project starts turning into two rival camps. What role do you take?',
        options: [
          {
            id: 'loudly-capable',
            label: 'Take charge of logistics and make sure everyone knows the plan is now serious.',
            weights: [{ resultId: 'stand-mixer', value: 3 }],
          },
          {
            id: 'small-and-sparking',
            label: 'Cut through the nonsense quickly, even if a few feelings get singed.',
            weights: [{ resultId: 'toaster', value: 3 }],
          },
          {
            id: 'steady-and-worrying',
            label: 'Stay calm, keep people talking, and slowly become the person holding the room together.',
            weights: [{ resultId: 'slow-cooker', value: 3 }],
          },
        ],
      },
      {
        id: 'suspicion-threshold',
        prompt: 'Someone on the other side is suddenly being very nice. How do you handle it?',
        options: [
          {
            id: 'document-everything',
            label: 'Keep records, compare motives, and prepare for the obvious twist.',
            weights: [
              { resultId: 'stand-mixer', value: 2 },
              { resultId: 'slow-cooker', value: 1 },
            ],
          },
          {
            id: 'smile-back',
            label: 'Smile back, stay loose, and wait for the exact moment to call it out.',
            weights: [{ resultId: 'toaster', value: 3 }],
          },
          {
            id: 'wait-them-out',
            label: 'Let them talk until they reveal what they actually want.',
            weights: [{ resultId: 'slow-cooker', value: 3 }],
          },
        ],
      },
      {
        id: 'fatal-flaw',
        prompt: 'What flaw would make you vulnerable to betrayal?',
        options: [
          {
            id: 'overconfidence',
            label: 'Assuming that being useful means people will stay loyal.',
            weights: [{ resultId: 'stand-mixer', value: 3 }],
          },
          {
            id: 'pettiness',
            label: 'Reacting fast when a slower response would have saved you trouble.',
            weights: [{ resultId: 'toaster', value: 3 }],
          },
          {
            id: 'long-memory',
            label: 'Holding onto every detail until the grudge has furniture.',
            weights: [{ resultId: 'slow-cooker', value: 3 }],
          },
        ],
      },
      {
        id: 'final-sign',
        prompt: 'What warning sign should have told you betrayal was coming?',
        options: [
          {
            id: 'too-helpful',
            label: 'They offered to organize everything before anyone asked them to.',
            weights: [{ resultId: 'stand-mixer', value: 2 }],
          },
          {
            id: 'burnt-smell',
            label: 'Small avoidable problems kept appearing near the same person.',
            weights: [
              { resultId: 'toaster', value: 2 },
              { resultId: 'stand-mixer', value: 1 },
            ],
          },
          {
            id: 'unnatural-calm',
            label: 'The calm lasted too long, like someone was waiting for a timer.',
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
      'A small-town folklore quiz about how your habits, timing, and social energy would accidentally turn into a story people repeat for years.',
    results: [
      {
        id: 'bridge-figure',
        title: 'The Figure on the Bridge',
        description:
          'You do not try to be mysterious; you just have strong timing and a habit of appearing where the lighting is dramatic. The town turns you into a bridge story because people need an explanation for your calm, distant energy.',
      },
      {
        id: 'polite-witch',
        title: 'The Polite Witch at the Edge of Town',
        description:
          'You are kind, observant, and slightly too accurate when people ask for advice. The town decides you are magical because admitting you are simply paying attention would make everyone else feel underprepared.',
      },
      {
        id: 'bell-tower-voice',
        title: 'The Voice in the Bell Tower',
        description:
          'You do not need to be seen to change the mood of a place. One comment, one song, or one perfectly timed announcement is enough for the town to build a legend around your voice.',
      },
    ],
    questions: [
      {
        id: 'first-rumor',
        prompt: 'What harmless habit accidentally starts the rumor about you?',
        options: [
          {
            id: 'seen-at-dusk',
            label: 'You take the same quiet walk at dusk and accidentally look symbolic.',
            weights: [{ resultId: 'bridge-figure', value: 3 }],
          },
          {
            id: 'too-accurate-advice',
            label: 'You give practical advice that keeps being annoyingly correct.',
            weights: [{ resultId: 'polite-witch', value: 3 }],
          },
          {
            id: 'voice-carried',
            label: 'You were overheard saying something memorable at exactly the wrong moment.',
            weights: [{ resultId: 'bell-tower-voice', value: 3 }],
          },
        ],
      },
      {
        id: 'signature-energy',
        prompt: 'What kind of attention do people tend to give you?',
        options: [
          {
            id: 'silent-silhouette',
            label: 'They notice where you are standing before they know what you are thinking.',
            weights: [{ resultId: 'bridge-figure', value: 3 }],
          },
          {
            id: 'kind-but-ominous',
            label: 'They ask for help, then tell everyone your advice felt strangely specific.',
            weights: [{ resultId: 'polite-witch', value: 3 }],
          },
          {
            id: 'beautiful-echo',
            label: 'They remember the exact thing you said and repeat it with extra drama.',
            weights: [{ resultId: 'bell-tower-voice', value: 3 }],
          },
        ],
      },
      {
        id: 'town-reaction',
        prompt: 'How does the story grow once people start repeating it?',
        options: [
          {
            id: 'invents-backstory',
            label: 'They add a tragic backstory even though you were probably just waiting for a ride.',
            weights: [{ resultId: 'bridge-figure', value: 2 }],
          },
          {
            id: 'brings-gifts',
            label: 'They start bringing you problems, small gifts, and rumors they want explained.',
            weights: [
              { resultId: 'polite-witch', value: 2 },
              { resultId: 'bridge-figure', value: 1 },
            ],
          },
          {
            id: 'looks-up-when-windy',
            label: 'They repeat your words whenever the weather gets dramatic.',
            weights: [{ resultId: 'bell-tower-voice', value: 2 }],
          },
        ],
      },
      {
        id: 'true-motive',
        prompt: 'What are you actually trying to do while the legend forms?',
        options: [
          {
            id: 'mind-my-business',
            label: 'Mind your business and enjoy a route with a nice view.',
            weights: [{ resultId: 'bridge-figure', value: 2 }],
          },
          {
            id: 'be-helpful',
            label: 'Help people solve normal problems without making it a whole thing.',
            weights: [{ resultId: 'polite-witch', value: 2 }],
          },
          {
            id: 'set-the-tone',
            label: 'Say what needs saying, then leave before anyone asks follow-up questions.',
            weights: [{ resultId: 'bell-tower-voice', value: 2 }],
          },
        ],
      },
    ],
  },
])
