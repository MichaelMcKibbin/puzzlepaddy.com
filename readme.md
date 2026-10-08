# PuzzlePaddy.com

![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

PuzzlePaddy is a browser-based collection of interactive games and puzzles, built with the Next.js Pages Router, React, and Tailwind CSS.

Live site: <https://puzzlepaddy.com/>

## Features

- Responsive home page with links to 13 featured games and puzzles.
- `/games` directory with 10 game links and `/puzzles` directory with four puzzle links.
- Eleven game pages: 2048, Dog Rescue, Four in a Row, Hangman, Lights Out, Nonogram, Number Guessing, Snake, Sokoban, Tic Tac Toe, and Word Ladder.
- Four puzzle pages: Mastermind, Mini Sudoku, Sliding Tile, and Word Scramble.
- Browser-based game state; some games also save progress or best scores in local storage.
- Instructions popups on some game pages (currently Tic Tac Toe), with an optional audio narration of the instructions.
- A contact page with links to the site owner's website and LinkedIn.

Sokoban has its own game page and is featured on the home page, but is not currently listed on `/games`. Word Ladder and Nonogram have game pages linked from `/games`, but are not currently featured on the home page.

The current `/contact` page does not contain a form. The older form remains at `/contact-old`; it posts to `/api/contact`, which verifies reCAPTCHA and sends email through Nodemailer when configured with the required environment variables.

## Technology

| Area | Technology |
| --- | --- |
| Framework | Next.js 16 (Pages Router) |
| UI | React 19 |
| Styling | Tailwind CSS 4, PostCSS |
| Language | JavaScript |
| Email integration | Nodemailer |
| CI workflow | GitHub Actions with Node.js 20 |

## Audio instructions

Some instructions popups include an audio player that reads the instructions aloud. The audio files are text-to-speech recordings created with [ElevenLabs](https://elevenlabs.io/) and stored as MP3 files in `public/audio/` (for example, `public/audio/tictactoe-instructions.mp3`). The player uses `autoPlay`, so the narration starts when the popup opens; users can pause it with the player controls, and if a browser blocks autoplay they can press play manually. If autoplay is not required, omit `autoPlay` and use `preload="none"` instead so audio is only downloaded when a user presses play.

## Project structure

```text
puzzlepaddy/
├── data/                # Word lists, themes, and Sokoban levels
├── lib/                 # Game utilities and utility tests
├── pages/               # Page routes and the contact API route
├── public/              # Images, audio, and other static assets
├── styles/              # Global stylesheet
├── .github/workflows/   # GitHub Actions workflow
├── next.config.js
├── package.json
└── server.js            # Optional custom Next.js server
```

## Run locally

Install dependencies and start the development server:

```sh
npm install
npm run dev
```

Open <http://localhost:3000>.

To build and run the production app:

```sh
npm run build
npm start
```

The start script runs `next start -p $PORT`; set the `PORT` environment variable in the shell or hosting environment before starting the production server.

## Contact form configuration

The legacy `/contact-old` form and `/api/contact` endpoint require these environment variables:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | reCAPTCHA site key used by the form |
| `RECAPTCHA_SECRET_KEY` | Server-side reCAPTCHA verification |
| `EMAIL_HOST` | SMTP server host |
| `EMAIL_PORT` | SMTP server port |
| `EMAIL_USER` | SMTP username and sender address |
| `EMAIL_PASS` | SMTP password |

The current contact page only provides external contact links, so the form is not part of the default contact-page experience.

## Deployment

After a push to the repository, GitHub Actions runs the build and tests and initiates deployment. The deployment is built on the hosting server, currently Hostinger, which serves the production site.

## Tests

Game utility tests are located alongside their implementations in `lib/`. GitHub Actions runs the project's build and tests after changes are pushed to the repository.

## License

This repository is licensed under the AGPL-3.0 License. See [LICENSE](LICENSE) for details.

## Contact

Michael McKibbin: <https://michaelmckibbin.com>

GitHub: <https://github.com/MichaelMcKibbin>

LinkedIn: <https://www.linkedin.com/in/michaelkevinmckibbin/>
