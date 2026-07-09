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
            label: 'Three bullets: what changed, what is blocked, and what happens next.',
            weights: [{ resultId: 'athena', value: 3 }],
          },
          {
            id: 'voice-note',
            label: 'A short voice note with context, tone, and one useful joke.',
            weights: [{ resultId: 'dionysus', value: 3 }],
          },
          {
            id: 'single-sentence',
            label: 'One careful sentence that answers the question and closes the loop.',
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
            label: 'Make one well-timed joke, then use the laugh to reset the room.',
            weights: [{ resultId: 'dionysus', value: 3 }],
          },
          {
            id: 'haunt-the-chat',
            label: 'Listen quietly, then send the useful summary after the meeting.',
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
            label: 'Show up, keep the mood decent, and try to make the time useful.',
            weights: [{ resultId: 'dionysus', value: 3 }],
          },
          {
            id: 'remember-forever',
            label: 'Accept it, say very little, and remember who did this.',
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
            label: 'A mug that starts conversations and makes the desk feel friendlier.',
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
      {
        id: 'feedback-request',
        prompt: 'Someone asks for honest feedback five minutes before logging off. You...',
        options: [
          {
            id: 'organize-the-truth',
            label: 'Give them the truth, separated into what matters now and what can wait.',
            weights: [{ resultId: 'athena', value: 3 }],
          },
          {
            id: 'soften-with-a-bit',
            label: 'Say the real thing, then add one joke so nobody has to sit in silence.',
            weights: [{ resultId: 'dionysus', value: 3 }],
          },
          {
            id: 'surgical-sentence',
            label: 'Send one exact sentence and let the period do the rest.',
            weights: [{ resultId: 'hades', value: 3 }],
          },
        ],
      },
      {
        id: 'slack-status',
        prompt: 'What Slack status would quietly explain why a god blocked you?',
        options: [
          {
            id: 'aligning-on-scope',
            label: 'Aligning on scope before anyone touches the lightning.',
            weights: [{ resultId: 'athena', value: 2 }],
          },
          {
            id: 'morale-side-quest',
            label: 'Taking a morale side quest. Back when the room feels human.',
            weights: [{ resultId: 'dionysus', value: 2 }],
          },
          {
            id: 'done-here',
            label: 'Done here. Please respect the underworld office hours.',
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
            label: 'Take charge of logistics and turn the argument into a plan.',
            weights: [{ resultId: 'stand-mixer', value: 3 }],
          },
          {
            id: 'small-and-sparking',
            label: 'Say the direct thing everyone is avoiding, even if it lands sharply.',
            weights: [{ resultId: 'toaster', value: 3 }],
          },
          {
            id: 'steady-and-worrying',
            label: 'Stay calm, keep people talking, and quietly become the mediator.',
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
            label: 'Smile back, keep it light, and call out the tactic when it matters.',
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
            label: 'Remembering every detail long after the original problem is over.',
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
            label: 'Small avoidable problems kept showing up around the same person.',
            weights: [
              { resultId: 'toaster', value: 2 },
              { resultId: 'stand-mixer', value: 1 },
            ],
          },
          {
            id: 'unnatural-calm',
            label: 'They stayed calm for so long that it started to feel planned.',
            weights: [{ resultId: 'slow-cooker', value: 2 }],
          },
        ],
      },
      {
        id: 'kitchen-truce',
        prompt: 'The kitchen calls a temporary truce. What job do you take?',
        options: [
          {
            id: 'coordinate-supplies',
            label: 'Assign stations, inventory supplies, and pretend this is not a leadership moment.',
            weights: [{ resultId: 'stand-mixer', value: 3 }],
          },
          {
            id: 'guard-the-exit',
            label: 'Stand by the door and say the thing everyone else is whispering.',
            weights: [{ resultId: 'toaster', value: 3 }],
          },
          {
            id: 'watch-the-room',
            label: 'Keep stirring, keep listening, and notice who relaxes too soon.',
            weights: [{ resultId: 'slow-cooker', value: 3 }],
          },
        ],
      },
      {
        id: 'historical-evidence',
        prompt: 'A historian finds one clue after the betrayal. What is it?',
        options: [
          {
            id: 'annotated-recipe',
            label: 'A recipe covered in notes, arrows, and suspiciously excellent planning.',
            weights: [{ resultId: 'stand-mixer', value: 2 }],
          },
          {
            id: 'burn-mark',
            label: 'A tiny burn mark exactly where someone claimed nothing happened.',
            weights: [{ resultId: 'toaster', value: 2 }],
          },
          {
            id: 'timer-set-early',
            label: 'A timer set hours ago by someone patient enough to look innocent.',
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
            label: 'You take the same quiet walk every evening and people start noticing.',
            weights: [{ resultId: 'bridge-figure', value: 3 }],
          },
          {
            id: 'too-accurate-advice',
            label: 'You give practical advice that keeps turning out to be correct.',
            weights: [{ resultId: 'polite-witch', value: 3 }],
          },
          {
            id: 'voice-carried',
            label: 'You say something memorable where half the town can hear it.',
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
            label: 'They notice where you are standing before they know why you are there.',
            weights: [{ resultId: 'bridge-figure', value: 3 }],
          },
          {
            id: 'kind-but-ominous',
            label: 'They ask for help, then tell everyone your advice was too accurate.',
            weights: [{ resultId: 'polite-witch', value: 3 }],
          },
          {
            id: 'beautiful-echo',
            label: 'They remember the exact thing you said and repeat it for effect.',
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
            label: 'They add a tragic backstory even though you were waiting for a ride.',
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
            label: 'They quote you whenever the weather makes the story feel bigger.',
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
            label: 'Mind your business and take the route with the best view.',
            weights: [{ resultId: 'bridge-figure', value: 2 }],
          },
          {
            id: 'be-helpful',
            label: 'Help people solve normal problems without making it a whole thing.',
            weights: [{ resultId: 'polite-witch', value: 2 }],
          },
          {
            id: 'set-the-tone',
            label: 'Say what needs saying, then leave before it becomes a discussion.',
            weights: [{ resultId: 'bell-tower-voice', value: 2 }],
          },
        ],
      },
      {
        id: 'too-accurate-detail',
        prompt: 'Which detail makes the town decide the story must be supernatural?',
        options: [
          {
            id: 'same-bridge-time',
            label: 'You keep crossing the bridge at the exact moment fog gets theatrical.',
            weights: [{ resultId: 'bridge-figure', value: 3 }],
          },
          {
            id: 'advice-worked',
            label: 'Your boring practical advice works three times in a row.',
            weights: [{ resultId: 'polite-witch', value: 3 }],
          },
          {
            id: 'voice-carried-again',
            label: 'Someone quotes you from a place you did not realize could hear you.',
            weights: [{ resultId: 'bell-tower-voice', value: 3 }],
          },
        ],
      },
      {
        id: 'historical-marker',
        prompt: 'Years later, what does the little historical marker say?',
        options: [
          {
            id: 'seen-here-at-dusk',
            label: 'Seen here at dusk, minding business in a way locals found suspicious.',
            weights: [{ resultId: 'bridge-figure', value: 2 }],
          },
          {
            id: 'helped-too-well',
            label: 'Helped too accurately and was therefore accused of knowing things.',
            weights: [{ resultId: 'polite-witch', value: 2 }],
          },
          {
            id: 'said-one-sentence',
            label: 'Said one sentence so clearly the town made it everyone else’s problem.',
            weights: [{ resultId: 'bell-tower-voice', value: 2 }],
          },
        ],
      },
    ],
  },
  {
    id: 'which-email-signoff-is-your-villain-origin',
    slug: 'which-email-signoff-is-your-villain-origin',
    status: 'published',
    title: 'Which Email Sign-Off Is Your Villain Origin?',
    description:
      'A workplace etiquette quiz about tone, restraint, and the tiny phrase that would finally push your professional patience into folklore.',
    results: [
      {
        id: 'regards',
        title: 'Regards',
        description:
          'Your villain origin is crisp, chilly, and impossible to misread. You tried warmth, you tried context, and now the temperature has dropped three degrees at the bottom of the email.',
      },
      {
        id: 'thanks-in-advance',
        title: 'Thanks in advance',
        description:
          'Your villain origin is momentum disguised as manners. You are already moving the task forward, and everyone else is discovering they were invited to agree with you.',
      },
      {
        id: 'best',
        title: 'Best',
        description:
          'Your villain origin is elegant restraint. Nobody can prove you meant anything by it, which is exactly why the whole thread gets quiet after your reply.',
      },
    ],
    questions: [
      {
        id: 'ignored-request',
        prompt: 'You sent a clear request and got no response. What is your follow-up?',
        options: [
          {
            id: 'short-and-dated',
            label: 'A short note with the original deadline restated in unmistakable language.',
            weights: [{ resultId: 'regards', value: 3 }],
          },
          {
            id: 'assume-progress',
            label: 'A cheerful check-in that assumes the work is already underway.',
            weights: [{ resultId: 'thanks-in-advance', value: 3 }],
          },
          {
            id: 'single-line',
            label: 'One polished sentence that makes the missed deadline obvious.',
            weights: [{ resultId: 'best', value: 3 }],
          },
        ],
      },
      {
        id: 'thread-derailed',
        prompt: 'A simple email thread becomes a festival of unrelated opinions. What do you do?',
        options: [
          {
            id: 'return-to-facts',
            label: 'Summarize the decision, name the owner, and remove the ambiguity.',
            weights: [
              { resultId: 'regards', value: 2 },
              { resultId: 'best', value: 1 },
            ],
          },
          {
            id: 'assign-next-step',
            label: 'Thank everyone, then assign the obvious next step before the thread can recover.',
            weights: [{ resultId: 'thanks-in-advance', value: 3 }],
          },
          {
            id: 'remove-air',
            label: 'Reply with one clean sentence that ends the extra commentary.',
            weights: [{ resultId: 'best', value: 3 }],
          },
        ],
      },
      {
        id: 'calendar-pressure',
        prompt: 'Someone proposes a meeting for something that should be two bullets. Your move?',
        options: [
          {
            id: 'decline-with-evidence',
            label: 'Decline and attach the two bullets that answer the question.',
            weights: [{ resultId: 'regards', value: 3 }],
          },
          {
            id: 'send-agenda-first',
            label: 'Send a pre-read and ask people to add comments by noon.',
            weights: [{ resultId: 'thanks-in-advance', value: 3 }],
          },
          {
            id: 'accept-but-shorten',
            label: 'Accept, quietly cut it to fifteen minutes, and make the invite title better.',
            weights: [{ resultId: 'best', value: 3 }],
          },
        ],
      },
      {
        id: 'final-energy',
        prompt: 'What feeling do you want your final email of the day to leave behind?',
        options: [
          {
            id: 'boundary',
            label: 'A clear boundary with no loose handles for follow-up chaos.',
            weights: [{ resultId: 'regards', value: 2 }],
          },
          {
            id: 'movement',
            label: 'A sense that the next step is already moving.',
            weights: [{ resultId: 'thanks-in-advance', value: 2 }],
          },
          {
            id: 'mystique',
            label: 'A little restraint and absolutely no extra words.',
            weights: [
              { resultId: 'best', value: 2 },
              { resultId: 'regards', value: 1 },
            ],
          },
        ],
      },
      {
        id: 'reply-all-crime',
        prompt: 'Someone hits reply-all with a thought that should have stayed private. You...',
        options: [
          {
            id: 'restore-order',
            label: 'Reply with the facts, the owner, and a colder subject line.',
            weights: [{ resultId: 'regards', value: 3 }],
          },
          {
            id: 'move-task-forward',
            label: 'Thank them, extract the task, and make forward motion legally unavoidable.',
            weights: [{ resultId: 'thanks-in-advance', value: 3 }],
          },
          {
            id: 'surgical-acknowledgment',
            label: 'Acknowledge only what matters and leave the rest floating in space.',
            weights: [{ resultId: 'best', value: 3 }],
          },
        ],
      },
      {
        id: 'sent-folder-evidence',
        prompt: 'Future historians open your sent folder. What line do they underline?',
        options: [
          {
            id: 'as-previously-noted',
            label: 'As previously noted, the deadline remains Friday.',
            weights: [{ resultId: 'regards', value: 2 }],
          },
          {
            id: 'looking-forward',
            label: 'Looking forward to your update by end of day.',
            weights: [{ resultId: 'thanks-in-advance', value: 2 }],
          },
          {
            id: 'that-works',
            label: 'That works.',
            weights: [{ resultId: 'best', value: 2 }],
          },
        ],
      },
    ],
  },
  {
    id: 'what-kind-of-group-chat-chaos-are-you',
    slug: 'what-kind-of-group-chat-chaos-are-you',
    status: 'published',
    title: 'What Kind of Group Chat Chaos Are You?',
    description:
      'A friendship logistics quiz about notifications, timing, and the specific way you make seven people open their phones at once.',
    results: [
      {
        id: 'weather-event',
        title: 'Weather Event',
        description:
          'You enter the chat with a sudden pressure change. Everyone notices, someone checks in, and the forecast is emotionally complicated for the next twenty minutes.',
      },
      {
        id: 'archivist',
        title: 'Archivist',
        description:
          'You remember every plan, quote, screenshot, and abandoned restaurant idea. Your chaos is not loud; it is documented, searchable, and devastatingly accurate.',
      },
      {
        id: 'soft-launch',
        title: 'Soft Launch',
        description:
          'You reveal major life information in fragments and let the chat assemble the puzzle. It is elegant, stressful, and probably accompanied by a vague photo.',
      },
    ],
    questions: [
      {
        id: 'entrance',
        prompt: 'How do you usually enter an active group chat?',
        options: [
          {
            id: 'burst-in',
            label: 'Drop a big feeling with no preface and let everyone catch up.',
            weights: [{ resultId: 'weather-event', value: 3 }],
          },
          {
            id: 'quote-the-past',
            label: 'Reply to something from yesterday because the record matters.',
            weights: [{ resultId: 'archivist', value: 3 }],
          },
          {
            id: 'hint-at-news',
            label: 'Mention big news casually, then reveal only part of the story.',
            weights: [{ resultId: 'soft-launch', value: 3 }],
          },
        ],
      },
      {
        id: 'planning-dinner',
        prompt: 'The chat is trying to pick dinner. What do you contribute?',
        options: [
          {
            id: 'vibe-check',
            label: 'You name what everyone seems to want but has not said clearly.',
            weights: [{ resultId: 'weather-event', value: 3 }],
          },
          {
            id: 'spreadsheet-memory',
            label: 'A reminder of who disliked which place last time, with evidence.',
            weights: [{ resultId: 'archivist', value: 3 }],
          },
          {
            id: 'mysterious-constraint',
            label: 'A vague constraint that forces everyone to ask for context.',
            weights: [{ resultId: 'soft-launch', value: 3 }],
          },
        ],
      },
      {
        id: 'notification-style',
        prompt: 'What notification pattern best represents you?',
        options: [
          {
            id: 'thunderstorm',
            label: 'Seven messages in two minutes, then a long quiet stretch.',
            weights: [{ resultId: 'weather-event', value: 2 }],
          },
          {
            id: 'single-receipt',
            label: 'One perfectly timed screenshot that changes the case.',
            weights: [
              { resultId: 'archivist', value: 2 },
              { resultId: 'weather-event', value: 1 },
            ],
          },
          {
            id: 'slow-drip',
            label: 'One detail at a time, just enough to keep people asking.',
            weights: [{ resultId: 'soft-launch', value: 2 }],
          },
        ],
      },
      {
        id: 'apology',
        prompt: 'You accidentally caused a chat spiral. How do you recover?',
        options: [
          {
            id: 'own-the-vibe',
            label: 'Admit the energy got too big and redirect everyone toward snacks.',
            weights: [{ resultId: 'weather-event', value: 2 }],
          },
          {
            id: 'summarize-cleanly',
            label: 'Summarize what happened so nobody has to scroll back through the storm.',
            weights: [{ resultId: 'archivist', value: 2 }],
          },
          {
            id: 'promise-context',
            label: 'Promise context later, which makes everyone more curious.',
            weights: [{ resultId: 'soft-launch', value: 2 }],
          },
        ],
      },
      {
        id: 'private-dm-check',
        prompt: 'A friend DMs, "Wait, are you okay?" What caused the concern?',
        options: [
          {
            id: 'emotional-barometer',
            label: 'You dropped one feeling too honestly and changed the weather.',
            weights: [{ resultId: 'weather-event', value: 3 }],
          },
          {
            id: 'ancient-receipt',
            label: 'You produced a receipt from 2019 with alarming speed.',
            weights: [{ resultId: 'archivist', value: 3 }],
          },
          {
            id: 'major-minor-detail',
            label: 'You mentioned a major life detail like it was a weather update.',
            weights: [{ resultId: 'soft-launch', value: 3 }],
          },
        ],
      },
      {
        id: 'notification-omen',
        prompt: 'What notification makes everyone know you have arrived?',
        options: [
          {
            id: 'three-in-a-row',
            label: 'Three messages in a row, each more emotionally specific than the last.',
            weights: [{ resultId: 'weather-event', value: 2 }],
          },
          {
            id: 'image-from-archive',
            label: 'An image attachment from deep storage with no greeting.',
            weights: [{ resultId: 'archivist', value: 2 }],
          },
          {
            id: 'soft-context-soon',
            label: 'A calm "context soon" that immediately makes context impossible to ignore.',
            weights: [{ resultId: 'soft-launch', value: 2 }],
          },
        ],
      },
    ],
  },
  {
    id: 'which-minor-office-object-would-haunt-you',
    slug: 'which-minor-office-object-would-haunt-you',
    status: 'published',
    title: 'Which Minor Office Object Would Haunt You?',
    description:
      'A low-stakes supernatural quiz about routines, workplace anxiety, and the tiny object most likely to become your personal ghost.',
    results: [
      {
        id: 'stapler',
        title: 'Stapler',
        description:
          'You are haunted by order almost working. The stapler appears when the papers are stacked, the meeting is ending, and one crooked edge threatens the whole illusion.',
      },
      {
        id: 'badge-lanyard',
        title: 'Badge Lanyard',
        description:
          'You are haunted by access, identity, and the fear of being one pocket away from inconvenience. The lanyard knows every door you have ever approached with false confidence.',
      },
      {
        id: 'conference-room-remote',
        title: 'Conference Room Remote',
        description:
          'You are haunted by tools that promise control and deliver twelve unlabeled buttons. The remote appears whenever a roomful of people starts watching you troubleshoot.',
      },
    ],
    questions: [
      {
        id: 'office-stress',
        prompt: 'Which tiny office stress gets under your skin fastest?',
        options: [
          {
            id: 'messy-stack',
            label: 'A stack of papers that should be simple but refuses to align.',
            weights: [{ resultId: 'stapler', value: 3 }],
          },
          {
            id: 'missing-badge',
            label: 'The moment you pat the wrong pocket near a locked door.',
            weights: [{ resultId: 'badge-lanyard', value: 3 }],
          },
          {
            id: 'screen-wont-share',
            label: 'A screen-share setup that turns everyone into silent witnesses.',
            weights: [{ resultId: 'conference-room-remote', value: 3 }],
          },
        ],
      },
      {
        id: 'haunting-location',
        prompt: 'Where would your office ghost reveal itself?',
        options: [
          {
            id: 'supply-closet',
            label: 'The supply closet, where one missing item becomes everyone’s problem.',
            weights: [{ resultId: 'stapler', value: 3 }],
          },
          {
            id: 'elevator-bank',
            label: 'The elevator bank, right when someone important is also waiting.',
            weights: [{ resultId: 'badge-lanyard', value: 3 }],
          },
          {
            id: 'conference-table',
            label: 'The conference table, beside a cable nobody wants to touch.',
            weights: [{ resultId: 'conference-room-remote', value: 3 }],
          },
        ],
      },
      {
        id: 'coping-style',
        prompt: 'How do you handle a small problem that becomes weirdly public?',
        options: [
          {
            id: 'restore-order',
            label: 'Fix the physical details first so your brain can come back online.',
            weights: [{ resultId: 'stapler', value: 2 }],
          },
          {
            id: 'laugh-through-it',
            label: 'Laugh, explain too much, and keep checking your pockets.',
            weights: [
              { resultId: 'badge-lanyard', value: 2 },
              { resultId: 'conference-room-remote', value: 1 },
            ],
          },
          {
            id: 'become-tech-support',
            label: 'Take responsibility for a device you have never seen before.',
            weights: [{ resultId: 'conference-room-remote', value: 2 }],
          },
        ],
      },
      {
        id: 'ghost-message',
        prompt: 'What message would the haunting be trying to send?',
        options: [
          {
            id: 'finish-the-stack',
            label: 'Small unfinished things are still taking up room in your head.',
            weights: [{ resultId: 'stapler', value: 2 }],
          },
          {
            id: 'know-your-access',
            label: 'Belonging feels fragile when the door needs proof.',
            weights: [{ resultId: 'badge-lanyard', value: 2 }],
          },
          {
            id: 'control-is-fake',
            label: 'Some problems do not care how prepared you are.',
            weights: [{ resultId: 'conference-room-remote', value: 2 }],
          },
        ],
      },
      {
        id: 'witness-count',
        prompt: 'What makes the haunting worse is that someone else saw it. Who?',
        options: [
          {
            id: 'person-waiting-for-papers',
            label: 'The person waiting politely while your neat stack slowly loses integrity.',
            weights: [{ resultId: 'stapler', value: 3 }],
          },
          {
            id: 'security-desk',
            label: 'The security desk watching you prove you belong here again.',
            weights: [{ resultId: 'badge-lanyard', value: 3 }],
          },
          {
            id: 'full-meeting-room',
            label: 'A full meeting room watching the screen remain aggressively blank.',
            weights: [{ resultId: 'conference-room-remote', value: 3 }],
          },
        ],
      },
      {
        id: 'supply-closet-note',
        prompt: 'The ghost leaves a final note in the supply closet. What does it say?',
        options: [
          {
            id: 'almost-straight',
            label: 'Almost straight is still crooked.',
            weights: [{ resultId: 'stapler', value: 2 }],
          },
          {
            id: 'check-your-pocket',
            label: 'Check the pocket you already checked.',
            weights: [{ resultId: 'badge-lanyard', value: 2 }],
          },
          {
            id: 'input-three',
            label: 'Try input three. Everyone is watching.',
            weights: [{ resultId: 'conference-room-remote', value: 2 }],
          },
        ],
      },
    ],
  },
  {
    id: 'which-parking-lot-bird-is-judging-you',
    slug: 'which-parking-lot-bird-is-judging-you',
    status: 'published',
    title: 'Which Parking Lot Bird Is Judging You?',
    description:
      'A public errand energy quiz about snacks, confidence, and the bird most qualified to assess your choices from beside a cart return.',
    results: [
      {
        id: 'seagull',
        title: 'Seagull',
        description:
          'The seagull judges you loudly and without legal standing. It respects confidence, notices hesitation, and believes every snack is community property.',
      },
      {
        id: 'grackle',
        title: 'Grackle',
        description:
          'The grackle judges you like an auditor with feathers. It is stylish, suspicious, and absolutely aware that you parked slightly over the line.',
      },
      {
        id: 'pigeon',
        title: 'Pigeon',
        description:
          'The pigeon judges you with weary kindness. It has seen enough errands to know most people are doing their best, but it still has notes.',
      },
    ],
    questions: [
      {
        id: 'cart-return',
        prompt: 'You finish loading groceries. What happens with the cart?',
        options: [
          {
            id: 'bold-return',
            label: 'You return it fast and confidently, even from the far side of the lot.',
            weights: [{ resultId: 'seagull', value: 3 }],
          },
          {
            id: 'precise-return',
            label: 'You return it neatly and notice every cart that is out of place.',
            weights: [{ resultId: 'grackle', value: 3 }],
          },
          {
            id: 'gentle-return',
            label: 'You return it, grab a stray cart too, and feel useful for one minute.',
            weights: [{ resultId: 'pigeon', value: 3 }],
          },
        ],
      },
      {
        id: 'snack-threat',
        prompt: 'A snack is visible in your hand. What is your defensive posture?',
        options: [
          {
            id: 'public-challenge',
            label: 'Hold it confidently and keep walking like you are not worried.',
            weights: [{ resultId: 'seagull', value: 3 }],
          },
          {
            id: 'secure-perimeter',
            label: 'Scan the area and identify every bird within snack distance.',
            weights: [{ resultId: 'grackle', value: 3 }],
          },
          {
            id: 'share-a-crumb',
            label: 'Accept that one crumb will probably become public property.',
            weights: [{ resultId: 'pigeon', value: 3 }],
          },
        ],
      },
      {
        id: 'parking-style',
        prompt: 'Which parking lot moment most reveals your character?',
        options: [
          {
            id: 'commit-to-spot',
            label: 'Committing to a spot everyone else seems afraid to try.',
            weights: [{ resultId: 'seagull', value: 2 }],
          },
          {
            id: 'line-analysis',
            label: 'Noticing someone parked over the line and forming an opinion.',
            weights: [
              { resultId: 'grackle', value: 2 },
              { resultId: 'pigeon', value: 1 },
            ],
          },
          {
            id: 'patient-wait',
            label: 'Waiting patiently while someone loads a trunk very, very slowly.',
            weights: [{ resultId: 'pigeon', value: 2 }],
          },
        ],
      },
      {
        id: 'bird-verdict',
        prompt: 'What would the bird write in its final report?',
        options: [
          {
            id: 'too-visible',
            label: 'Subject carried fries in public and underestimated the audience.',
            weights: [{ resultId: 'seagull', value: 2 }],
          },
          {
            id: 'procedural-concerns',
            label: 'Subject means well but shows inconsistent lane discipline.',
            weights: [{ resultId: 'grackle', value: 2 }],
          },
          {
            id: 'doing-best',
            label: 'Subject is tired, trying, and probably deserves the good parking spot.',
            weights: [{ resultId: 'pigeon', value: 2 }],
          },
        ],
      },
      {
        id: 'errand-flaw',
        prompt: 'What errand habit would the bird find most revealing?',
        options: [
          {
            id: 'public-confidence',
            label: 'You commit loudly before checking whether the door says push or pull.',
            weights: [{ resultId: 'seagull', value: 3 }],
          },
          {
            id: 'rule-observation',
            label: 'You notice every minor rule violation and pretend you are above caring.',
            weights: [{ resultId: 'grackle', value: 3 }],
          },
          {
            id: 'soft-delay',
            label: 'You wait too long because someone else looks like they need the space more.',
            weights: [{ resultId: 'pigeon', value: 3 }],
          },
        ],
      },
      {
        id: 'parking-lot-citation',
        prompt: 'The bird issues you a tiny citation. What is the charge?',
        options: [
          {
            id: 'snack-negligence',
            label: 'Possession of fries with insufficient situational awareness.',
            weights: [{ resultId: 'seagull', value: 2 }],
          },
          {
            id: 'cart-return-commentary',
            label: 'Forming a strong opinion within fifteen feet of a cart return.',
            weights: [{ resultId: 'grackle', value: 2 }],
          },
          {
            id: 'overly-considerate',
            label: 'Making eye contact with a pigeon and briefly considering its feelings.',
            weights: [{ resultId: 'pigeon', value: 2 }],
          },
        ],
      },
    ],
  },
  {
    id: 'which-haunted-spreadsheet-tab-are-you',
    slug: 'which-haunted-spreadsheet-tab-are-you',
    status: 'published',
    title: 'Which Haunted Spreadsheet Tab Are You?',
    description:
      'A productivity horror quiz about formulas, hidden columns, and the specific way your planning instincts become a ghost story.',
    results: [
      {
        id: 'budget-tab',
        title: 'Budget Tab',
        description:
          'You are haunted by math that is technically correct and emotionally expensive. The budget tab rattles its cells whenever optimism gets ahead of the numbers.',
      },
      {
        id: 'hidden-assumptions',
        title: 'Hidden Assumptions',
        description:
          'You are haunted by context nobody wrote down. The hidden assumptions tab waits quietly until someone says the plan is simple, then opens by itself.',
      },
      {
        id: 'old-pivot-table',
        title: 'Old Pivot Table',
        description:
          'You are haunted by legacy knowledge. The old pivot table still works, mostly, but nobody alive can explain why the totals feel judgmental.',
      },
    ],
    questions: [
      {
        id: 'first-warning',
        prompt: 'A shared spreadsheet starts acting cursed. What is the first warning sign?',
        options: [
          {
            id: 'totals-shift',
            label: 'The totals change after one tiny edit and everyone gets quiet.',
            weights: [{ resultId: 'budget-tab', value: 3 }],
          },
          {
            id: 'blank-column',
            label: 'A blank column is being used for a decision nobody has named.',
            weights: [{ resultId: 'hidden-assumptions', value: 3 }],
          },
          {
            id: 'ancient-filter',
            label: 'A filter from 2021 is still active and changing what everyone sees.',
            weights: [{ resultId: 'old-pivot-table', value: 3 }],
          },
        ],
      },
      {
        id: 'planning-style',
        prompt: 'How do you usually make a messy plan feel manageable?',
        options: [
          {
            id: 'price-it-out',
            label: 'Put numbers beside the idea so people can see the tradeoffs.',
            weights: [{ resultId: 'budget-tab', value: 3 }],
          },
          {
            id: 'ask-the-question',
            label: 'Ask the obvious question that reveals three missing decisions.',
            weights: [{ resultId: 'hidden-assumptions', value: 3 }],
          },
          {
            id: 'rebuild-from-history',
            label: 'Find the old file, reverse-engineer it, and pretend this is normal.',
            weights: [{ resultId: 'old-pivot-table', value: 3 }],
          },
        ],
      },
      {
        id: 'sheet-conflict',
        prompt: 'Someone says, "Can we just make this quick?" What happens inside you?',
        options: [
          {
            id: 'cost-awareness',
            label: 'You immediately wonder what the shortcut will cost later.',
            weights: [{ resultId: 'budget-tab', value: 2 }],
          },
          {
            id: 'scope-sense',
            label: 'You hear the scope expanding before anyone admits it.',
            weights: [
              { resultId: 'hidden-assumptions', value: 2 },
              { resultId: 'budget-tab', value: 1 },
            ],
          },
          {
            id: 'version-memory',
            label: 'You remember the last time "quick" produced six file versions.',
            weights: [{ resultId: 'old-pivot-table', value: 2 }],
          },
        ],
      },
      {
        id: 'final-haunting',
        prompt: 'What does your spreadsheet ghost want people to understand?',
        options: [
          {
            id: 'resources-are-real',
            label: 'Resources are real, even when the idea is exciting.',
            weights: [{ resultId: 'budget-tab', value: 2 }],
          },
          {
            id: 'write-it-down',
            label: 'If everyone knows it, someone still has to write it down.',
            weights: [{ resultId: 'hidden-assumptions', value: 2 }],
          },
          {
            id: 'history-matters',
            label: 'The old system may be ugly, but it survived for reasons.',
            weights: [{ resultId: 'old-pivot-table', value: 2 }],
          },
        ],
      },
      {
        id: 'meeting-confession',
        prompt: 'In the planning meeting, what spreadsheet sentence exposes you?',
        options: [
          {
            id: 'what-does-that-cost',
            label: 'I just want to understand what this costs if it works.',
            weights: [{ resultId: 'budget-tab', value: 3 }],
          },
          {
            id: 'who-owns-this',
            label: 'Who owns that decision after everyone leaves this call?',
            weights: [{ resultId: 'hidden-assumptions', value: 3 }],
          },
          {
            id: 'old-version-question',
            label: 'Before we rebuild it, can I see the old version?',
            weights: [{ resultId: 'old-pivot-table', value: 3 }],
          },
        ],
      },
      {
        id: 'cell-note',
        prompt: 'What note does the haunted tab leave in cell A1?',
        options: [
          {
            id: 'optimism-is-not-a-line-item',
            label: 'Optimism is not a line item.',
            weights: [{ resultId: 'budget-tab', value: 2 }],
          },
          {
            id: 'someone-knows-this',
            label: 'If everyone knows this, write it down anyway.',
            weights: [{ resultId: 'hidden-assumptions', value: 2 }],
          },
          {
            id: 'do-not-delete',
            label: 'Do not delete the ugly tab until you know what it feeds.',
            weights: [{ resultId: 'old-pivot-table', value: 2 }],
          },
        ],
      },
    ],
  },
  {
    id: 'which-soup-are-you-in-a-crisis',
    slug: 'which-soup-are-you-in-a-crisis',
    status: 'published',
    title: 'Which Soup Are You in a Crisis?',
    description:
      'A comfort-food personality quiz about pressure, caretaking, and what kind of warm bowl you become when the day starts throwing chairs.',
    results: [
      {
        id: 'tomato-soup',
        title: 'Tomato Soup',
        description:
          'You are direct comfort with a clean edge. Tomato soup shows up fast, keeps the message simple, and pairs beautifully with a boundary.',
      },
      {
        id: 'chicken-noodle',
        title: 'Chicken Noodle',
        description:
          'You are practical care in motion. Chicken noodle does not make a speech; it finds the blanket, names the next step, and checks the stove.',
      },
      {
        id: 'miso-soup',
        title: 'Miso Soup',
        description:
          'You are quiet restoration. Miso soup lowers the volume, brings everyone back to themselves, and refuses to turn healing into a committee.',
      },
    ],
    questions: [
      {
        id: 'crisis-entry',
        prompt: 'A normal day suddenly becomes a situation. How do you enter the room?',
        options: [
          {
            id: 'clear-and-warm',
            label: 'You name what is happening and say what needs to happen next.',
            weights: [{ resultId: 'tomato-soup', value: 3 }],
          },
          {
            id: 'hands-full',
            label: 'You arrive with water, chargers, and a practical next step.',
            weights: [{ resultId: 'chicken-noodle', value: 3 }],
          },
          {
            id: 'lower-the-volume',
            label: 'You speak quietly, slow the pace, and give people room to breathe.',
            weights: [{ resultId: 'miso-soup', value: 3 }],
          },
        ],
      },
      {
        id: 'comfort-method',
        prompt: 'What kind of support do you trust most?',
        options: [
          {
            id: 'simple-truth',
            label: 'A simple truth said kindly, without pretending it is fine.',
            weights: [{ resultId: 'tomato-soup', value: 3 }],
          },
          {
            id: 'useful-action',
            label: 'Useful action that makes the next ten minutes less awful.',
            weights: [{ resultId: 'chicken-noodle', value: 3 }],
          },
          {
            id: 'gentle-presence',
            label: 'Quiet presence that lets people recover without explaining themselves.',
            weights: [{ resultId: 'miso-soup', value: 3 }],
          },
        ],
      },
      {
        id: 'stress-flaw',
        prompt: 'What is your least helpful crisis habit?',
        options: [
          {
            id: 'too-blunt',
            label: 'Being so clear that someone briefly misses the care underneath.',
            weights: [{ resultId: 'tomato-soup', value: 2 }],
          },
          {
            id: 'over-functioning',
            label: 'Doing six useful things before admitting you also need help.',
            weights: [{ resultId: 'chicken-noodle', value: 2 }],
          },
          {
            id: 'disappearing-act',
            label: 'Staying so quiet that people forget to check on you.',
            weights: [
              { resultId: 'miso-soup', value: 2 },
              { resultId: 'chicken-noodle', value: 1 },
            ],
          },
        ],
      },
      {
        id: 'aftercare',
        prompt: 'When the worst part passes, what do you want everyone to do?',
        options: [
          {
            id: 'say-the-thing',
            label: 'Say what happened plainly so nobody has to guess.',
            weights: [{ resultId: 'tomato-soup', value: 2 }],
          },
          {
            id: 'eat-and-reset',
            label: 'Eat something, reset the room, and make a realistic list.',
            weights: [{ resultId: 'chicken-noodle', value: 2 }],
          },
          {
            id: 'be-quiet-together',
            label: 'Sit quietly until everyone has enough room to think again.',
            weights: [{ resultId: 'miso-soup', value: 2 }],
          },
        ],
      },
      {
        id: 'misread-comfort',
        prompt: 'What do people misunderstand about the comfort you offer?',
        options: [
          {
            id: 'clarity-is-care',
            label: 'They think your directness is impatience instead of care with edges.',
            weights: [{ resultId: 'tomato-soup', value: 3 }],
          },
          {
            id: 'helping-is-not-infinite',
            label: 'They mistake your usefulness for unlimited emotional staffing.',
            weights: [{ resultId: 'chicken-noodle', value: 3 }],
          },
          {
            id: 'quiet-is-active',
            label: 'They assume quiet means absent, not actively making the room safer.',
            weights: [{ resultId: 'miso-soup', value: 3 }],
          },
        ],
      },
      {
        id: 'bowl-left-behind',
        prompt: 'After the crisis, what is left beside the bowl?',
        options: [
          {
            id: 'single-clear-note',
            label: 'A note with one true sentence and no decorative panic.',
            weights: [{ resultId: 'tomato-soup', value: 2 }],
          },
          {
            id: 'charger-and-list',
            label: 'A phone charger, a realistic list, and someone finally sitting down.',
            weights: [{ resultId: 'chicken-noodle', value: 2 }],
          },
          {
            id: 'quiet-room',
            label: 'A quieter room where nobody has to perform being okay.',
            weights: [{ resultId: 'miso-soup', value: 2 }],
          },
        ],
      },
    ],
  },
  {
    id: 'which-cryptid-would-borrow-your-hoodie',
    slug: 'which-cryptid-would-borrow-your-hoodie',
    status: 'published',
    title: 'Which Cryptid Would Borrow Your Hoodie?',
    description:
      'A friendship-boundaries quiz about trust, weird roommates, and the creature most likely to return your favorite hoodie smelling like pine needles.',
    results: [
      {
        id: 'mothman',
        title: 'Mothman',
        description:
          'Mothman borrows your hoodie because you both understand dramatic timing. It comes back clean, folded badly, and carrying a warning you did not ask for.',
      },
      {
        id: 'bigfoot',
        title: 'Bigfoot',
        description:
          'Bigfoot borrows your hoodie because you are safe to be quiet around. It returns the hoodie late, warm, and somehow improved by forest air.',
      },
      {
        id: 'lake-monster',
        title: 'Lake Monster',
        description:
          'The lake monster borrows your hoodie because it likes your softness and ignores your laundry instructions. The hoodie returns damp, stretched, and emotionally complicated.',
      },
    ],
    questions: [
      {
        id: 'loan-policy',
        prompt: 'A friend asks to borrow your favorite hoodie. What is your policy?',
        options: [
          {
            id: 'dramatic-exception',
            label: 'You allow it if the reason is specific, urgent, and slightly theatrical.',
            weights: [{ resultId: 'mothman', value: 3 }],
          },
          {
            id: 'trusted-silence',
            label: 'You hand it over because trust is sometimes quiet and practical.',
            weights: [{ resultId: 'bigfoot', value: 3 }],
          },
          {
            id: 'soft-hearted-risk',
            label: 'You say yes while already imagining the fabric returning different.',
            weights: [{ resultId: 'lake-monster', value: 3 }],
          },
        ],
      },
      {
        id: 'borrower-red-flag',
        prompt: 'What borrower behavior makes you most nervous?',
        options: [
          {
            id: 'ominous-vague',
            label: 'They need it tonight, but will not say where they are going.',
            weights: [{ resultId: 'mothman', value: 3 }],
          },
          {
            id: 'vanishing',
            label: 'They are careful with things, but very bad at replying on time.',
            weights: [{ resultId: 'bigfoot', value: 3 }],
          },
          {
            id: 'near-water',
            label: 'They promise to keep it clean, then wear it near a lake.',
            weights: [{ resultId: 'lake-monster', value: 3 }],
          },
        ],
      },
      {
        id: 'friendship-style',
        prompt: 'What kind of friendship makes you feel safest?',
        options: [
          {
            id: 'truth-with-flair',
            label: 'Someone who tells the truth, even when they make an entrance doing it.',
            weights: [{ resultId: 'mothman', value: 2 }],
          },
          {
            id: 'steady-room',
            label: 'Someone who does not require performance to prove closeness.',
            weights: [{ resultId: 'bigfoot', value: 2 }],
          },
          {
            id: 'deep-feeling',
            label: 'Someone who feels things deeply and means well, even when it is messy.',
            weights: [
              { resultId: 'lake-monster', value: 2 },
              { resultId: 'mothman', value: 1 },
            ],
          },
        ],
      },
      {
        id: 'return-condition',
        prompt: 'The hoodie comes back. What condition tells you everything?',
        options: [
          {
            id: 'creased-note',
            label: 'There is a note in the pocket explaining why they needed it.',
            weights: [{ resultId: 'mothman', value: 2 }],
          },
          {
            id: 'pine-clean',
            label: 'It smells like cedar, campfire, and careful outdoor use.',
            weights: [{ resultId: 'bigfoot', value: 2 }],
          },
          {
            id: 'damp-legend',
            label: 'It is clean enough, but unmistakably damp.',
            weights: [{ resultId: 'lake-monster', value: 2 }],
          },
        ],
      },
      {
        id: 'loan-terms',
        prompt: 'What clause do you wish you had added before lending it out?',
        options: [
          {
            id: 'no-omens-after-midnight',
            label: 'No omens after midnight unless they directly concern my safety.',
            weights: [{ resultId: 'mothman', value: 3 }],
          },
          {
            id: 'text-before-disappearing',
            label: 'Text once before disappearing into any forested area.',
            weights: [{ resultId: 'bigfoot', value: 3 }],
          },
          {
            id: 'define-dry',
            label: 'Dry means dry, not emotionally damp with good intentions.',
            weights: [{ resultId: 'lake-monster', value: 3 }],
          },
        ],
      },
      {
        id: 'friend-retelling',
        prompt: 'A friend retells the hoodie story later. What detail do they emphasize?',
        options: [
          {
            id: 'note-in-pocket',
            label: 'The note in the pocket that made the whole thing feel foretold.',
            weights: [{ resultId: 'mothman', value: 2 }],
          },
          {
            id: 'warmer-somehow',
            label: 'The annoying fact that it came back late but somehow warmer.',
            weights: [{ resultId: 'bigfoot', value: 2 }],
          },
          {
            id: 'damp-but-sincere',
            label: 'The dampness, obviously, but also how sincere the apology was.',
            weights: [{ resultId: 'lake-monster', value: 2 }],
          },
        ],
      },
    ],
  },
])
