# PuzzlePaddy.com

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![CI/CD](https://img.shields.io/badge/GitHub%20Actions-CI%2FCD-blue?logo=github-actions&logoColor=white)
![Status](https://img.shields.io/badge/Status-Active-success)
![Pull Requests](https://img.shields.io/github/issues-pr/MichaelMcKibbin/puzzlepaddy)
![Last Commit](https://img.shields.io/github/last-commit/MichaelMcKibbin/puzzlepaddy)


A full-stack puzzle & games platform built with **Next.js**, **React**, **Node.js**, and **Tailwind CSS**, deployed via automated **GitHub webhook**.

PuzzlePaddy is a Next.js application featuring interactive games and puzzles with dynamic functionality.  

Built with
- Next.js 
- React
- JavaScript
- Tailwind CSS
- Node.js server
- API routes
- Dynamic functionality
- GitHub Actions CI/CD
- Automated server deployment

The current version includes a number of fully functional puzzle and game pages.

Live Site: https://puzzlepaddy.com/

## Features
### Current Features

- Games and puzzles implemented with React components
- Tailwind-based layout and styling
- Responsive header/navigation
- /games page with multiple mini-games
- /puzzles page for logic puzzles and brain teasers
- interactive components (word puzzles, number games, etc.)
- /contact page with recaptcha, for user feedback
  - disabled due to limitations of the hosting package
  - The original contact form used an API route to send form submissions via email and works in localhost.
  - When used with a hosting package that gives full support for Node.js server applications, the contact form will work as intended.
  - added button links instead

### Planned Features
- Improved site-wide styling and branding
- SEO and metadata improvements

### Tech Stack

| Category   | Technology                   |
|------------|------------------------------|
| Framework  | Next.js                      |
| Language   | JavaScript                   |
| Frontend   | React + Tailwind CSS         |
| Tooling    | npm, PostCSS                 |
| Deployment | Node.js server               |
| Pipeline   | GitHub webhook + auto-deploy |

### Project Structure
```
puzzlepaddy/
├── components/      # Reusable UI components
├── pages/           # Routing (Next.js pages)
├── styles/          # Global + Tailwind styles
├── public/          # Static assets
├── package.json     # Dependencies and scripts
├── tailwind.config.js
└── next.config.js
```

### Running the Project Locally
- 1 Install dependencies
```npm install```

- 2 Start development server
```npm run dev```

- The site will be available at:
```http://localhost:3000```

### Building for Production

PuzzlePaddy is deployed as a Node.js server application.

- 1 Build the app
```npm run build```

- 2 Start the server
```npm start```

This runs the Next.js server with API routes and SSR capabilities.

- 3 Deployment

Automatic deployment via webhook to Node.js hosting.

### Static vs Dynamic Pages
After running ```npm run build```, the Next.js server will generate static HTML pages for each page in the ```/pages``` directory.  

[//]: # (The contact page is an example of a dynamic page, and requires an SSR deployment.  )
After building, the file structure will look a little like this:

```
Route (pages)                                Size  First Load JS    
┌ ○ /                                       877 B        99.3 kB
├   /_app                                     0 B        98.5 kB
├ ○ /404                                  1.27 kB        99.7 kB
├ ○ /about                                  305 B        98.8 kB
├ ƒ /api/contact                              0 B        98.5 kB
├ ○ /contact                              4.87 kB         103 kB
├ ○ /games                                  636 B        99.1 kB
├ ○ /games/dog-rescue                     3.33 kB         102 kB
├ ○ /games/hangman                        1.44 kB        99.9 kB
├ ○ /games/nonogram                       1.29 kB        99.7 kB
├ ○ /games/number-guess                   1.92 kB         100 kB
├ ○ /games/snake                          1.59 kB         100 kB
├ ○ /games/tictactoe                      1.73 kB         100 kB
├ ○ /puzzles                                612 B        99.1 kB
├ ○ /puzzles/mastermind                   1.54 kB         100 kB
├ ○ /puzzles/mini-sudoku                  2.06 kB         101 kB
├ ○ /puzzles/sliding-tile                 1.31 kB        99.8 kB
└ ○ /puzzles/word-scramble                1.29 kB        99.7 kB
+ First Load JS shared by all              103 kB
  ├ chunks/framework-acd67e14855de5a2.js  57.7 kB
  ├ chunks/main-c52fafc302c2483a.js         35 kB
  └ other shared chunks (total)           10.7 kB

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand```
```

### Security Notes

Do NOT commit:
- .env files or secrets
- .next/, node_modules/, and .idea/ are excluded (see .gitignore)

Server includes API routes for contact form and dynamic functionality

### Roadmap

- Upgrade navigation component and mobile menu
- Add colour palette + consistent brand theme
- Add more interactive components
- Add more games
- Add more puzzles
- Add more pages
- Add more styling
- Add more accessibility features

### Contributing

This is an ongoing personal project.
Feel free to fork the repository or submit suggestions.

### License
This repository is licensed under the AGPL-3.0 License. See LICENSE file for details.

### Contact

By: Michael McKibbin www.michaelmckibbin.com

GitHub: https://github.com/MichaelMcKibbin

LinkedIn: https://www.linkedin.com/in/michaelkevinmckibbin/

Website: https://puzzlepaddy.com