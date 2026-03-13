# Playwright Demo: Login + Logout

This demo automates:
1. Open `https://test.nirvanaxp.com`
2. Enter username/password
3. Login
4. Logout

## Setup

1. Open terminal in this folder.
2. Install packages:
   - `npm.cmd install`
3. Install Playwright browsers:
   - `npx.cmd playwright install`
4. Create `.env` from `.env.example` and fill credentials.

## Run

- Headed run:
  - `npm.cmd run test:headed`
- Headless run:
  - `npm.cmd test`
- UI mode:
  - `npm.cmd run test:ui`

## Notes

- If logout selector differs in your environment, update the locators in `tests/login-logout.spec.ts`.
