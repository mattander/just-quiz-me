export type ResultEnhancement = {
  detail: string
  shareText: string
}

const fallbackEnhancement: ResultEnhancement = {
  detail:
    'This result is less a diagnosis than a tiny internet mirror held at a strange angle. Send it to someone who will either feel seen, mildly accused, or both.',
  shareText: 'I took a Just Quiz Me quiz and got a deeply specific result.',
}

const resultEnhancementsByKey: Record<string, ResultEnhancement> = {
  'which-greek-god-would-block-you-on-slack:athena': {
    detail:
      'You are useful in exactly the way group projects pretend to reward: you clarify the decision, name the risk, and somehow remember the doc everyone else lost. Your danger is that you can turn a casual chat into a governance model before anyone has finished coffee. Athena respects the competence. She simply refuses to be pulled into another thread called "quick sync".',
    shareText: 'Apparently Athena would block me on Slack, which feels rude and researched.',
  },
  'which-greek-god-would-block-you-on-slack:dionysus': {
    detail:
      'You have the rare ability to make a bleak workplace moment briefly human again. The room needs your chaos more than it admits, but your comedy can become load-bearing fast. Dionysus blocks you when the bit starts managing the roadmap, then quietly unblocks you after morale improves by 18 percent.',
    shareText: 'Dionysus would block me on Slack, but probably after laughing first.',
  },
  'which-greek-god-would-block-you-on-slack:hades': {
    detail:
      'You are not cold; you are conserving energy for conversations that have earned oxygen. Your boundaries have a velvet rope and a clipboard. Hades blocks you because both of you understand that closure does not always need a final message, especially when silence is already doing excellent work.',
    shareText: 'Hades would block me on Slack, and honestly the boundary work is elegant.',
  },
  'which-kitchen-appliance-would-betray-you-in-the-civil-war:stand-mixer': {
    detail:
      'You are built for high-stakes usefulness: heavy base, clear purpose, suspicious confidence. The betrayal comes because competence has a spotlight problem. The stand mixer would claim it is serving the cause, but somehow every plan ends with it in the center of the counter, humming like history depends on it.',
    shareText: 'A stand mixer would betray me in the Civil War. Disturbingly plausible.',
  },
  'which-kitchen-appliance-would-betray-you-in-the-civil-war:toaster': {
    detail:
      'Your style is direct, fast, and powered by a private outlet of spite. The toaster respects that. It also recognizes an opening. Its betrayal would not be grand or theatrical. It would be one tiny lever, one suspicious smell, and one burned piece of evidence that everyone pretends is normal.',
    shareText: 'A toaster would betray me in the Civil War. Small appliance, huge nerve.',
  },
  'which-kitchen-appliance-would-betray-you-in-the-civil-war:slow-cooker': {
    detail:
      'You understand that patience is not passivity. It is strategy with a lid on. The slow cooker betrays you gradually, with warmth and plausible deniability, until everyone realizes the whole room has been operating on its schedule. You should have noticed the timer. Nobody ever notices the timer.',
    shareText: 'A slow cooker would betray me in the Civil War. I should have watched the timer.',
  },
  'what-kind-of-town-legend-would-you-accidentally-become:bridge-figure': {
    detail:
      'You are not trying to be mysterious. You just keep appearing at narratively inconvenient times. A town can only see someone standing near water at dusk so many times before it invents a cautionary tale. Your legend is mostly lighting, timing, and other people needing a hobby.',
    shareText: 'I would accidentally become the figure on the bridge. Very normal news.',
  },
  'what-kind-of-town-legend-would-you-accidentally-become:polite-witch': {
    detail:
      'You notice patterns before people have admitted there is a pattern. Then you say something practical, it works, and everyone decides the only explanation is folk magic. Your legend grows because "they pay attention" is apparently less interesting than "they cursed my begonias".',
    shareText: 'I would become the polite witch at the edge of town. Finally, a career path.',
  },
  'what-kind-of-town-legend-would-you-accidentally-become:bell-tower-voice': {
    detail:
      'Some people need a spotlight. You need acoustics. Your words travel farther than you intended and arrive with extra drama attached. The town remembers the quote, misquotes it twice, and by autumn someone is claiming they heard you from the bell tower during a storm.',
    shareText: 'I would become the voice in the bell tower. The acoustics chose me.',
  },
  'which-email-signoff-is-your-villain-origin:regards': {
    detail:
      'You are not angry. You are formatted. Your villain origin begins when someone ignores three clear emails and forces you to discover the emotional range of punctuation. "Regards" becomes your cape, your mask, and your very small office thunderstorm.',
    shareText: 'My email sign-off villain origin is "Regards." The temperature dropped.',
  },
  'which-email-signoff-is-your-villain-origin:thanks-in-advance': {
    detail:
      'You believe in momentum, implied deadlines, and the gentle power of making a request sound already approved. Your villain arc is efficient, calendar-aware, and terrifyingly polite. No one knows if they agreed, but somehow the task is due Thursday.',
    shareText: 'My email sign-off villain origin is "Thanks in advance." Efficient menace.',
  },
  'which-email-signoff-is-your-villain-origin:best': {
    detail:
      'You prefer elegance over noise. Your villain origin is not explosive; it is a beautifully trimmed sentence that makes everyone reread the thread. "Best" gives nothing away. That is the point. The ambiguity does the cardio for you.',
    shareText: 'My email sign-off villain origin is "Best." Minimalist threat design.',
  },
  'what-kind-of-group-chat-chaos-are-you:weather-event': {
    detail:
      'You arrive with sudden energy, change the pressure in the room, and leave everyone checking the emotional forecast. The group chat needs your weather. It also occasionally needs a basement. Your chaos is survivable, memorable, and best enjoyed with notifications on silent.',
    shareText: 'I am a group chat weather event. Bring snacks and a basement.',
  },
  'what-kind-of-group-chat-chaos-are-you:archivist': {
    detail:
      'You remember the message from 2021, the context, the screenshot, and the name of the restaurant everyone swore was "fine". Your chaos is archival. People fear you because receipts appear exactly when history tries to become convenient.',
    shareText: 'I am the group chat archivist. I have the receipts and the emotional metadata.',
  },
  'what-kind-of-group-chat-chaos-are-you:soft-launch': {
    detail:
      'You drop life updates like movie trailers: partial, tasteful, and impossible not to analyze. The group chat becomes a team of unpaid detectives because you said "interesting week" and refused to elaborate for 47 minutes.',
    shareText: 'I am the group chat soft launch. Please respect my mysterious rollout.',
  },
  'which-minor-office-object-would-haunt-you:stapler': {
    detail:
      'You are haunted by the stapler because it recognizes your attachment to order. It appears when systems are almost working, daring you to care about the last crooked edge. The haunting is not violent. It is administrative.',
    shareText: 'A stapler would haunt me. The office supplies know too much.',
  },
  'which-minor-office-object-would-haunt-you:badge-lanyard': {
    detail:
      'The badge lanyard haunts you because identity should not be this easy to misplace. It swings from chairs, hides in bags, and appears in dreams where every door beeps red. Your ghost story is about access, belonging, and checking the wrong pocket.',
    shareText: 'A badge lanyard would haunt me. Access denied, emotionally.',
  },
  'which-minor-office-object-would-haunt-you:conference-room-remote': {
    detail:
      'You are haunted by the conference room remote because you believe problems should have buttons. This one has twelve, none labeled honestly. Its ghostly purpose is to remind you that sometimes leadership means crawling under a table while everyone watches.',
    shareText: 'A conference room remote would haunt me. None of the buttons can be trusted.',
  },
  'which-parking-lot-bird-is-judging-you:seagull': {
    detail:
      'The seagull judges you with public confidence and no indoor voice. It sees your hesitation, your fries, and your entire decision history. Its verdict is loud, unfair, and somehow persuasive enough that strangers briefly take its side.',
    shareText: 'A parking lot seagull is judging me. I accept the ruling under protest.',
  },
  'which-parking-lot-bird-is-judging-you:grackle': {
    detail:
      'The grackle judges you like it has read the terms and conditions of your soul. It is glossy, strategic, and standing too close to the cart return. Its judgment is not emotional. It is procedural, which makes it worse.',
    shareText: 'A parking lot grackle is judging me. The audit has feathers.',
  },
  'which-parking-lot-bird-is-judging-you:pigeon': {
    detail:
      'The pigeon judges you gently, but it judges you with numbers. It knows the sidewalk, the crumbs, and the patterns you pretend are choices. Its verdict is mostly that you are doing your best, but also that you dropped the bagel inefficiently.',
    shareText: 'A parking lot pigeon is judging me. Honestly, fair.',
  },
  'which-haunted-spreadsheet-tab-are-you:budget-tab': {
    detail:
      'You are haunted by the budget tab because you can feel reality entering the room before anyone else hears the door. The numbers are not trying to ruin the idea; they are trying to save it from becoming a group text with invoices. Your gift is making optimism survivable. Your curse is that everyone learns this only after asking why you look concerned.',
    shareText: 'I am the haunted budget tab. The vibes have costs and I can see them.',
  },
  'which-haunted-spreadsheet-tab-are-you:hidden-assumptions': {
    detail:
      'You are haunted by hidden assumptions because you notice the sentence underneath the sentence. Someone says "easy," and you can already see the missing owner, the mystery deadline, and the silent dependency wearing a little hat. You are not being difficult. You are hearing the floorboards creak before the plan falls through them.',
    shareText: 'I am the hidden assumptions tab. Please write down the thing everyone knows.',
  },
  'which-haunted-spreadsheet-tab-are-you:old-pivot-table': {
    detail:
      'You are haunted by the old pivot table because you respect ugly systems that stayed alive for a reason. People want a clean rebuild. You want to know why column F has been load-bearing since 2021. Your result is not glamorous, but it is deeply useful: you understand that institutional memory often arrives wearing bad formatting.',
    shareText: 'I am the old pivot table. It still works and that should scare everyone.',
  },
  'which-soup-are-you-in-a-crisis:tomato-soup': {
    detail:
      'You become tomato soup in a crisis: warm, direct, and refreshingly uncomplicated. You do not need twelve emotional side quests before saying what is true. People come to you when they need comfort that still has a spine. The trick is remembering that your clarity is strongest when the kindness stays visible.',
    shareText: 'In a crisis, I am tomato soup. Comfort with boundaries.',
  },
  'which-soup-are-you-in-a-crisis:chicken-noodle': {
    detail:
      'You become chicken noodle in a crisis: practical care with sleeves rolled up. You notice who has eaten, whose phone is dying, and which next step would make the next ten minutes bearable. This is real tenderness, not performance. Just be careful not to become the entire emergency response system while everyone else applauds your competence.',
    shareText: 'In a crisis, I am chicken noodle soup. Useful, warm, slightly overextended.',
  },
  'which-soup-are-you-in-a-crisis:miso-soup': {
    detail:
      'You become miso soup in a crisis: quiet restoration, low lighting, no forced speeches. You help people return to themselves without turning recovery into a meeting. Your calm is not emptiness; it is structure at a gentler volume. The only danger is disappearing so gracefully that nobody realizes you could use care too.',
    shareText: 'In a crisis, I am miso soup. Gentle, restorative, hard to schedule.',
  },
  'which-cryptid-would-borrow-your-hoodie:mothman': {
    detail:
      'Mothman would borrow your hoodie because your friendship style has excellent dramatic tension. You believe in warnings, timing, and showing up when the lighting is unforgivable. The hoodie comes back folded in a way that suggests effort but no training. There is probably a note in the pocket. You should read it outside.',
    shareText: 'Mothman would borrow my hoodie. I accept the omen but want it back clean.',
  },
  'which-cryptid-would-borrow-your-hoodie:bigfoot': {
    detail:
      'Bigfoot would borrow your hoodie because you make quiet feel safe instead of awkward. You do not chase people through the emotional woods with a flashlight. You let trust be slow, practical, and a little covered in pine needles. The hoodie comes back late, but warmer than before, which is annoying because now you cannot stay mad.',
    shareText: 'Bigfoot would borrow my hoodie. Honestly, he seems respectful.',
  },
  'which-cryptid-would-borrow-your-hoodie:lake-monster': {
    detail:
      'The lake monster would borrow your hoodie because you are soft-hearted around sincere disasters. You knew there would be moisture. You knew the laundry instructions would become folklore. Still, some friendships are worth the dampness. The hoodie returns changed, but so do most things that spend time with creatures who feel deeply underwater.',
    shareText: 'The lake monster would borrow my hoodie. Damp, iconic, emotionally complicated.',
  },
}

export function getResultEnhancement(
  quizSlug: string,
  resultId: string,
): ResultEnhancement {
  return resultEnhancementsByKey[`${quizSlug}:${resultId}`] ?? fallbackEnhancement
}
