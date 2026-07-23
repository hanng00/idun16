# Ida's Gender Reveal 👶

A fun, interactive gender reveal experience with 5 mini-games!

## Games

1. **🎈 Balloon Pop** - Pop pink and blue balloons to influence the gender meter
2. **🧺 Catch the Stereotypes** - Catch gendered items, avoid Socialtjänsten!
3. **🧠 Baby Quiz** - Test your knowledge about Swedish parental leave & Socialtjänstlagen
4. **🎰 Name Wheel** - Spin the wheel of Swedish baby names
5. **❤️ Heartbeat** - Listen to the baby's heartbeat and tap along

## The Gender Meter

Throughout the games, a gender meter at the bottom shows the current "prediction". It swings back and forth with Brownian motion animation, creating suspense before the final reveal!

## Configuration

Edit `src/config.ts` to change:
- `ACTUAL_GENDER`: Set to `'boy'` or `'girl'`
- `RIGGED_POSITIONS`: The meter positions after each game (for maximum suspense)
- `FINAL_REVEAL_PERCENT`: How far to the winning side on final reveal

## Development

```bash
bun install
bun run dev
```

## Deploy to GitHub Pages

The repo is configured for automatic deployment via GitHub Actions. Just push to `main` and it will deploy to GitHub Pages.

Manual deploy:
```bash
bun run deploy
```

## Tech Stack

- React 19
- TypeScript
- Vite
- CSS Modules
