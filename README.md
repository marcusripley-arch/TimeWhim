# TimeWhim — Public Playtest Lab

TimeWhim is an experimental mobile-first collection of short browser games built around one idea: make a spare few minutes genuinely fun.

The current public playtest contains seven prototypes and is focused on finding which mechanics deserve further development.

## Public playtest

Canonical entry point:

`https://time-whim.vercel.app/playtest/`

Russian lab:

`https://time-whim.vercel.app/lab/`

English lab:

`https://time-whim.vercel.app/lab/en/`

The legacy root tester remains available separately for earlier concept validation.

## Current prototypes

- Confidence Duel
- 3 Moves
- Match 2.0
- Contact!
- Microgame Rush
- Broken Telephone
- Wrong Question

## Validation goal

The playtest measures whether a game is understandable without explanation, whether people finish a round, whether they want another round, and what they say in lightweight feedback.

The product deliberately avoids ads, forced sign-up, streak pressure, loot-box mechanics, and other dark-pattern retention loops.

## Analytics and privacy

The public playtest uses an anonymous browser-session ID for aggregate product analytics.

- no name or email is requested;
- IP anonymization is enabled in PostHog;
- session recording is disabled;
- QA and automation traffic is excluded from the launch dashboard;
- free-text feedback asks testers not to include personal information.

## Browser QA

The repository includes an automated browser QA harness covering all seven games plus mobile layout and the English build.

GitHub Actions runs the Playwright browser gate only when relevant playtest, lab, QA, test, or workflow files change. New commits cancel stale runs. CI analytics requests are intercepted so automated tests do not contaminate production product data.

Current gate target: **11/11 browser tests passing**.

## Hosting

Canonical public host:

`https://time-whim.vercel.app/`

GitHub Pages is retained as a fallback deployment.

## Status

The project is in public prototype validation. TimeWhim is a working name, not a cleared final brand.
