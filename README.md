# QA Automation Portfolio

![Playwright tests](https://github.com/AyhanYuseinov/playwright-qa-portfolio/actions/workflows/playwright.yml/badge.svg)

**[View the latest test report](https://AyhanYuseinov.github.io/playwright-qa-portfolio/)**

Test automation with **Playwright + TypeScript** against two public demo applications:
38 automated tests (25 UI, 13 API), run in GitHub Actions on every push, with the HTML report published on GitHub Pages.

## What is covered

| Area | Target | Tests |
|---|---|---|
| Login | [saucedemo.com](https://www.saucedemo.com) UI | valid and locked-out users, invalid and empty input, logout, access without login |
| Inventory | saucedemo UI | product list, all four sort orders |
| Cart | saucedemo UI | badge, add and remove, cart contents, persistence after reload |
| Checkout | saucedemo UI | full order with total check, missing-field validation, cancel |
| Health and auth | [Restful-Booker](https://restful-booker.herokuapp.com) API | ping, token, bad credentials, 403 without a token |
| Bookings | Restful-Booker API | create, read, filter, update (PUT and PATCH), delete, 404 and invalid input |

## Test strategy

**What I test and why.** I focused on the flows where a failure would hurt a user most: logging in, finding products, filling a cart and paying. For each flow I wrote the happy path plus the negative cases that matter, such as wrong credentials, missing checkout fields and unauthenticated access. Checks look at outcomes a user would notice (error messages, totals, cart contents), not at implementation details.

**UI versus API tests.** The two layers test different things. UI tests check that a real user can get through a flow in the browser. API tests check the rules behind it (data, status codes, permissions) much faster and without the browser. The API suite covers create, read, update, delete and the authorisation rules, because those are cheaper and more precise to verify at API level than through screens.

**Keeping tests independent.** Each test can run alone and in any order, so they run in parallel without interfering:
- The UI login happens once in a setup project and the session is reused, so tests start logged in without repeating the login. Login tests opt out and start logged out.
- Every API test creates its own booking with a unique name, and a fixture deletes everything it created afterwards. This matters because the API is shared and its data is reset every few minutes.
- Page objects hold locators and actions only. Assertions stay in the tests, so a test shows what is expected.
- Locators use roles and `data-test` ids, not brittle CSS or XPath, and there are no fixed waits: Playwright's auto-waiting and web-first assertions do the synchronisation.

**Known limits.** Both targets are public demo systems I do not control. The Restful-Booker API is shared and occasionally slow, so CI retries failed tests twice. Two tests document its quirks rather than ideal behaviour (bad credentials return 200, and a delete returns 201). Only Chromium is covered so far.

**What I would add next.**
- Firefox and WebKit projects to check cross-browser behaviour.
- Visual regression tests for the key pages.
- Accessibility checks, for example with axe, on the main flows.
- The other saucedemo users (`problem_user`, `performance_glitch_user`) and more API edge cases, including response schema validation.
- Tags (such as `@smoke`) so a fast subset can run on every pull request and the full suite on a schedule.

## Getting started
```bash
npm install
npx playwright install --with-deps chromium
npm test            # UI + API
npm run test:ui     # UI only
npm run test:api    # API only
npm run report      # open the last HTML report
```

## Project structure
```
pages/               Page objects (one class per page)
data/                Test data and expected messages
api/                 API client for Restful-Booker
tests/ui/            UI test specs
tests/api/           API test specs
tests/fixtures.ts    Shared page-object fixtures (UI)
tests/auth.setup.ts  Logs in once and saves the session
.github/workflows/   CI: runs the tests and publishes the report
```
