# Landing Page Direction

## Goal

Shift Just Quiz Me toward a simpler, text-first landing page that feels calm and deliberate. The page should read like a clear introduction to one playable quiz, not a framed marketing composition.

## Research Summary

References reviewed on March 13, 2026:

- GOV.UK Design System page template: https://design-system.service.gov.uk/styles/page-template/
- GOV.UK guidance for writing user interfaces: https://www.gov.uk/service-manual/design/writing-for-user-interfaces
- HEY homepage: https://www.hey.com/
- Basecamp homepage: https://basecamp.com/
- Aesop homepage: https://www.aesop.com/

Patterns worth carrying into Just Quiz Me:

- Strong pages can rely on width, spacing, and type hierarchy instead of boxes. GOV.UK's page template is a good reminder that a constrained content column and clear heading structure already create enough shape.
- Copy should explain the product quickly without extra decorative scaffolding. GOV.UK's UI writing guidance reinforces that short, direct language lowers cognitive load.
- Text-forward marketing can still feel warm when the background stays quiet. HEY and Basecamp both let headline, paragraph rhythm, and a single primary action do most of the work.
- Restraint reads as refinement when surfaces are reduced. Aesop shows that a muted palette, generous white space, and careful typography can carry tone without obvious gradients or stacked cards.

## Direction For Just Quiz Me

Recommended visual principles:

- Use one primary content column for the landing page.
- Remove the large glass container and secondary framed illustration panel.
- Keep the page background nearly flat, with only a subtle tonal wash if needed.
- Let typography, spacing, and one strong call to action create emphasis.
- Use simple dividers and small metadata lines instead of cards.
- Preserve high contrast, readable line length, obvious focus states, and comfortable mobile spacing.

## Applied In JUS-50

This ticket should move the current homepage toward that direction by:

- replacing the boxed hero with an open text-first layout
- removing the decorative SVG illustration
- softening the global background treatment
- reducing the not-found state's card styling so the shell stays visually consistent

## Follow-Up Scope

Subsequent polish work should stay inside this direction:

- refine type scale and copy, not container complexity
- tune spacing and measure across breakpoints
- decide whether the eyebrow label is still needed once the full product framing is clearer
- keep future supporting content as simple text sections or inline lists before introducing any new panel treatment
