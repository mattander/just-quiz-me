---
name: quiz-writing
description: Write, revise, evaluate, or generate Just Quiz Me quiz content, including quiz titles, descriptions, questions, answer options, result names, result writeups, share text, and LLM quiz-generation prompts. Use for any task that creates or improves absurd-but-grounded personality quizzes, BuzzFeed-style entertainment quizzes, horoscope-like result copy, or the project's quiz voice and quality rubric.
---

# Quiz Writing

## Core Principle

Make the premise absurd, but make the psychology real.

Just Quiz Me quizzes are entertainment, not true assessments. They should still feel accurate in the horoscope sense: no matter which result a player gets, the result should make them think, "unfortunately, yes." The quiz should feel like it caught the player in a small recognizable behavior and turned it into a funny identity badge.

For the full rubric, read [quiz-craft.md](references/quiz-craft.md) before drafting or substantially revising quiz content.

## Default Shape

- Use 6 questions by default.
- Use 3 results by default unless the prompt explicitly asks for a wider result set.
- Use 3 answer options per question by default, one strongly aligned with each result.
- Keep the quiz bite-sized, but give it enough time to earn the result. Four questions usually feels too thin; six creates suspicion, rhythm, and payoff without becoming homework.
- Keep answer options short enough to scan, but specific enough to recognize. Prefer one vivid behavior over a polished personality summary.

## Workflow

1. Identify the funny contract.
   - Name the ordinary human behavior underneath the absurd premise.
   - Name the social context where a friend would recognize the player.
   - Decide what players will want to share: a roast, a badge, a confession, or a weirdly flattering label.

2. Define result archetypes.
   - Make each result distinct in behavior, not just vibe.
   - Give each result a generous truth, a comic flaw, and a shareable one-line identity.
   - Avoid pure insults. The tone is affectionate, specific, and lightly incriminating.

3. Write the six-question arc.
   - Q1: easy recognition, low friction.
   - Q2: social behavior or public choice.
   - Q3: pressure, conflict, or mild stakes.
   - Q4: a specific object, habit, or scene.
   - Q5: the player's gently incriminating flaw.
   - Q6: final image, verdict, or absurdly specific payoff.

4. Write answer options.
   - Make each option something a real person might do, say, avoid, overthink, or justify.
   - Use concrete scenes and objects. Avoid abstract traits when a behavior can carry the idea.
   - Distinguish options quickly. A player should not need to decode which answer fits them.
   - Let one answer per question be a little too revealing.

5. Write result copy.
   - Start with recognition, not explanation.
   - Include the result's evidence from the quiz world.
   - Add a comic consequence.
   - End with a line that feels screenshot-worthy or sendable.

6. Self-edit against the house voice.
   - Remove generic archetype language.
   - Replace "random zany" lines with socially legible specificity.
   - Keep the copy clean, modern, and calm enough for the joke to land.
   - Do not make every line quippy. Let the premise and recognition do the work.

## Voice Rules

- Be weird by being precise, not by being noisy.
- Write like an observant friend with excellent timing, not a brand trying to sound Gen Z.
- Keep the emotional posture warm, amused, and slightly incriminating.
- Use ordinary modern language. Avoid forced slang, meme-stacking, and over-explaining the joke.
- Make results flattering enough to share, but sharp enough to feel personally called out.
- Let specificity create comedy: the cart return, the Friday 4:30 meeting, the damp hoodie, the ancient spreadsheet filter.

## LLM Generation Prompts

When writing or revising prompts for an automated quiz generator, include the core craft constraints directly in the prompt:

- Generate 6 questions, 3 results, and 3 answer options per question unless the caller requests otherwise.
- Treat the quiz as horoscope-style entertainment, not assessment.
- Make every result feel plausibly true and shareable.
- Require concrete behavior, social stakes, escalation, and a final verdict question.
- Ban random zany answers, forced slang, and options that do not make sense.
- Require a share line for each result.
- Ask the model to self-check against [quiz-craft.md](references/quiz-craft.md) before returning content.

## Hard Avoids

- Do not write nonsense answers that only exist to sound absurd.
- Do not make every option the same tidy sentence in three archetype flavors.
- Do not rely on "chaotic," "unhinged," "feral," "vibes," or "cursed" as a substitute for an actual joke.
- Do not write results as clinical personality summaries.
- Do not make players feel trapped by a fixed identity. Horoscope logic should feel expansive: "this is one funny lens on me," not "this is all I am."
- Do not punch down, shame ordinary vulnerability, or make cruelty the joke.

## Quality Bar

Before considering quiz content ready, every quiz must pass these checks:

- The title is immediately understandable and funny out of context.
- A player can answer each question quickly without confusion.
- Every answer option maps to a plausible behavior.
- At least two answer options make someone think, "I know exactly who would pick that."
- Every result has a compact share line.
- The result writeup makes any result feel true enough to share.
- The quiz has escalation from easy recognition to final comic verdict.
- The copy sounds like Just Quiz Me, not a generic AI quiz generator.
