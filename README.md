# QA Automation Portfolio

![Playwright tests](https://github.com/AyhanYuseinov/playwright-qa-portfolio/actions/workflows/playwright.yml/badge.svg)

**[View the latest test report](https://AyhanYuseinov.github.io/playwright-qa-portfolio/)**

Test automation with **Playwright + TypeScript** against public demo applications.

> Work in progress. Status: stage 4 (UI + API tests, CI and published report).

## Planned scope
- UI tests for [saucedemo.com](https://www.saucedemo.com) using the Page Object pattern
- API tests for [Restful-Booker](https://restful-booker.herokuapp.com) using Playwright's API testing
- CI with GitHub Actions, HTML report published on GitHub Pages

## Getting started
```bash
npm install
npx playwright install --with-deps chromium
npm test            # UI + API
npm run test:ui     # UI only
npm run test:api    # API only
npm run report
```

## Project structure
```
pages/        Page objects (one class per page)
data/         Test data and expected messages
tests/ui/     UI test specs
api/          API client for Restful-Booker
tests/api/    API test specs
tests/fixtures.ts  Shared page-object fixtures
tests/auth.setup.ts  Logs in once and saves the session
```

## Test strategy
_To be written in my own words after the UI and API suites are done._
