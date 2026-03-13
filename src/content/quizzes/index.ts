import { defineQuizManifestCollection } from '../../lib/quiz-manifest.ts'

export const quizManifests = defineQuizManifestCollection([
  {
    id: 'which-chaotic-breakfast-are-you',
    slug: 'which-chaotic-breakfast-are-you',
    status: 'published',
    title: 'Which Chaotic Breakfast Are You?',
    description:
      'A politely unhinged breakfast quiz about coping styles, social energy, and how much structure your morning can survive.',
    results: [
      {
        id: 'buttered-toast',
        title: 'Buttered Toast',
        description:
          'You look simple from across the room, but you are carrying more warmth, competence, and emotional ballast than anyone expects.',
      },
      {
        id: 'cereal-at-midnight',
        title: 'Cereal at Midnight',
        description:
          'You are improvisational, suspicious of rules, and somehow still thriving while everyone else is looking for a spreadsheet.',
      },
      {
        id: 'overbuilt-omelette',
        title: 'Overbuilt Omelette',
        description:
          'You believe commitment is beautiful, details matter, and almost every situation could be improved with one more deliberate layer.',
      },
    ],
    questions: [
      {
        id: 'alarm-style',
        prompt: 'How does your ideal morning begin?',
        options: [
          {
            id: 'one-alarm-and-up',
            label: 'One alarm, one stretch, immediate competence.',
            weights: [{ resultId: 'buttered-toast', value: 3 }],
          },
          {
            id: 'wake-up-when-vibes-arrive',
            label: 'I wake up when the vibes arrive and negotiate from there.',
            weights: [{ resultId: 'cereal-at-midnight', value: 3 }],
          },
          {
            id: 'ritualized-launch-sequence',
            label: 'A ritualized launch sequence with optional soundtrack.',
            weights: [{ resultId: 'overbuilt-omelette', value: 3 }],
          },
        ],
      },
      {
        id: 'kitchen-energy',
        prompt: 'What is your kitchen energy before noon?',
        options: [
          {
            id: 'calm-and-capable',
            label: 'Calm, capable, and quietly getting it done.',
            weights: [
              { resultId: 'buttered-toast', value: 2 },
              { resultId: 'overbuilt-omelette', value: 1 },
            ],
          },
          {
            id: 'cupboard-chaos',
            label: 'Cupboard doors open, three spoons involved, no regrets.',
            weights: [{ resultId: 'cereal-at-midnight', value: 3 }],
          },
          {
            id: 'mise-en-place-theatrics',
            label: 'Measured, curated, and slightly too ambitious for a weekday.',
            weights: [{ resultId: 'overbuilt-omelette', value: 3 }],
          },
        ],
      },
      {
        id: 'social-bite',
        prompt: 'Someone interrupts your breakfast with a strong opinion. You...',
        options: [
          {
            id: 'nod-and-continue',
            label: 'Nod kindly and continue being correct in private.',
            weights: [{ resultId: 'buttered-toast', value: 3 }],
          },
          {
            id: 'make-it-a-bit',
            label: 'Turn it into a bit and see whether the room can keep up.',
            weights: [{ resultId: 'cereal-at-midnight', value: 3 }],
          },
          {
            id: 'deliver-a-framework',
            label: 'Offer a framework, examples, and a better plan.',
            weights: [{ resultId: 'overbuilt-omelette', value: 3 }],
          },
        ],
      },
      {
        id: 'comfort-object',
        prompt: 'Pick the breakfast accessory that feels most like you.',
        options: [
          {
            id: 'good-knife',
            label: 'A very good knife that solves problems cleanly.',
            weights: [{ resultId: 'buttered-toast', value: 2 }],
          },
          {
            id: 'mismatched-bowl',
            label: 'A slightly cursed bowl with a surprisingly rich backstory.',
            weights: [
              { resultId: 'cereal-at-midnight', value: 2 },
              { resultId: 'buttered-toast', value: 1 },
            ],
          },
          {
            id: 'cast-iron-pan',
            label: 'A cast-iron pan that rewards loyalty and planning.',
            weights: [{ resultId: 'overbuilt-omelette', value: 2 }],
          },
        ],
      },
    ],
  },
])
