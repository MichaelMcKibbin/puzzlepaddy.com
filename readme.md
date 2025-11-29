🚀 PuzzlePaddy.com — Next.js Static Website

PuzzlePaddy is a lightweight, fast, and expandable Next.js site featuring interactive games and puzzles.
It is deployed as a static website on Hostinger and built with:

Next.js

React

TypeScript

Tailwind CSS

Static hosting (Hostinger)

The current version includes a fully functional Tic-Tac-Toe game and serves as the foundation for additional puzzle and game pages.

Live Site: https://puzzlepaddy.com

🧩 Features
✔️ Current Features

🎮 Tic-Tac-Toe implemented with React components

🎨 Tailwind-based layout and styling

📱 Responsive header/navigation

⚡ Static export for fast hosting on Hostinger

🚧 Planned Features

/games page with multiple mini-games

/puzzles page for logic puzzles and brain teasers

/contact page

Additional small interactive components (word puzzles, number games, etc.)

Improved site-wide styling and branding

SEO and metadata improvements

🛠 Tech Stack
Category	Technology
Framework	Next.js (static export)
Language	TypeScript
Frontend	React + Tailwind CSS
Hosting	Hostinger (static site)
Tooling	npm, PostCSS
📁 Project Structure
puzzlepaddy/
├── components/      # Reusable UI components
├── pages/           # Routing (Next.js pages)
├── styles/          # Global + Tailwind styles
├── public/          # Static assets
├── package.json     # Dependencies and scripts
├── tailwind.config.js
└── next.config.js

🚀 Running the Project Locally
1️⃣ Install dependencies
npm install

2️⃣ Start development server
npm run dev


The site will be available at:
http://localhost:3000

🏗 Building for Production (Hostinger)

PuzzlePaddy is deployed as a static Next.js export.

1️⃣ Build the app
npm run build

2️⃣ Export static files
npm run export


This creates an /out folder containing the full static website.

3️⃣ Upload to Hostinger

Upload the contents of /out to:

public_html/

🔒 Security Notes

Do NOT commit .env files or secrets

.next/, node_modules/, and .idea/ are excluded (see .gitignore)

All deployment happens via static files only

📌 Roadmap

Upgrade navigation component and mobile menu

Add colour palette + consistent brand theme

Add new puzzle/game pages

Improve accessibility (ARIA, focus states)

Add automated build-export scripts

Add GitHub Actions deployment pipeline (optional)

🤝 Contributing

This is currently a solo learning project.
Feel free to fork the repository or submit suggestions.

📜 License

MIT License.
You may reuse or adapt components freely.

💬 Contact

Made by Michael McKibbin www.michaelmckibbin.com

GitHub: https://github.com/MichaelMcKibbin

Website: https://puzzlepaddy.com