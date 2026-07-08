---
name: quiz-writing
description: Write, revise, or review Just Quiz Me quiz content, including quiz premises, question prompts, answer options, result descriptions, scoring paths, generated draft review, and live quiz quality passes. Use when Codex is asked to make quizzes funnier, clearer, less random, less zany, more coherent, more shareable, or better aligned with Just Quiz Me's dry grounded absurdity.
---

# Quiz Writing

## Core Standard

Make the subject matter funny; do not make every sentence perform funny.

Just Quiz Me quizzes should feel like a person answering a recognizable situation, not decoding surreal punchlines. The best option is usually plain, concrete, and behavior-based with one specific comic edge.

Read `references/quiz-quality-rules.md` before large rewrites, prompt design, or reviewing generated quiz drafts.

## Workflow

1. Name the quiz's behavioral axis.
   - Example: "Greek God Slack" maps workplace communication styles.
   - Example: "Cryptid hoodie" maps friendship boundaries and borrower trust.
   - If the axis is unclear, rewrite the premise before rewriting options.

2. Define three distinct result identities.
   - Each result must describe a real pattern a person can recognize.
   - Avoid results that differ only by aesthetic noun.
   - Keep result descriptions shareable, specific, and mildly accusatory.

3. Write prompts as normal situations.
   - A reader should understand the prompt without seeing the answers.
   - Prefer "What do you do?" / "What worries you?" / "What role do you take?"
   - Avoid prompts that ask for random imagery unless the quiz is explicitly about imagery.

4. Write answer options as comparable behaviors.
   - Every option must directly answer the prompt.
   - All options should be similar in length, grammar, and level of detail.
   - Each option should point to a distinct result path.
   - If an option cannot be explained as a human behavior, rewrite it.

5. Add humor only after clarity.
   - Use one small joke, image, or turn of phrase per option at most.
   - Prefer concrete detail over slang, Gen Z tone, or forced weirdness.
   - Delete jokes that make the answer less true.

6. Validate the scoring path.
   - A user should be able to infer why their answers led to their result.
   - Mixed-weight answers are allowed only when the option genuinely bridges two result identities.
   - Keep 3 results, 4 questions, and 3 options unless there is a strong reason to expand.

## Rewrite Checklist

- Does the prompt ask one clear question?
- Can each option be chosen by a real person?
- Do all options answer the same prompt in the same category?
- Are the options mutually distinct without being random?
- Is the funniest part the premise/result fit, not noisy wording?
- Can someone explain the result mapping after reading the quiz?
- Would the option still make sense if read aloud without irony?

## Anti-Patterns

- Random lore: "They refuse to explain the sky" when the prompt asks about borrower behavior.
- Overwritten zaniness: every noun has a costume and every sentence winks.
- Vibe-only answers: options describe an aesthetic instead of an action.
- Mismatched options: one answer is a behavior, one is a joke, one is a metaphor.
- Internet voice filler: "iconic," "unhinged," "cryptid energy," "vibes" unless they add real meaning.
- Fake specificity: details that sound precise but do not clarify the choice.

## Quick Repair Pattern

When an answer is funny but incoherent:

1. Identify the real behavior hiding inside it.
2. Rewrite the option in plain language.
3. Add one domain-specific detail back in.

Example:

Bad: "They keep standing near water with the confidence of a lawsuit."

Better: "They promise to return it clean, but they keep bringing it to damp places."

Best: "They promise to return it clean, then wear it on a canoe trip."
