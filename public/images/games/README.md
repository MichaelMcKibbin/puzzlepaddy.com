# Game Thumbnail Images

This folder contains thumbnail images for each game displayed on the home page.

## Image Specifications

**Recommended dimensions:** 400x400 pixels (square/1:1 aspect ratio)
**File format:** JPG, PNG, or WebP
**File size:** Keep under 200KB for fast loading

## Required Image Files

Place images in this folder with the following filenames:

- `tictactoe.jpg` - Tic Tac Toe
- `four-in-a-row.jpg` - Four in a Row
- `2048.jpg` - 2048
- `hangman.jpg` - Hangman
- `word-scramble.jpg` - Word Scramble
- `mastermind.jpg` - Mastermind
- `mini-sudoku.jpg` - Mini Sudoku
- `nonogram.jpg` - Nonogram
- `sliding-tile.jpg` - Sliding Tile
- `snake.jpg` - Snake
- `number-guess.jpg` - Number Guessing
- `dog-rescue.jpg` - Dog Rescue

## Fallback Behavior

If an image is not found or fails to load, the tile will automatically display an emoji placeholder instead:
- ⭕ Tic Tac Toe
- 🔴 Four in a Row
- 🔢 2048
- 🔤 Hangman
- 🔀 Word Scramble
- 🎯 Mastermind
- 🔢 Mini Sudoku
- 📊 Nonogram
- 🧩 Sliding Tile
- 🐍 Snake
- 🔮 Number Guessing
- 🐕 Dog Rescue

## How to Change an Image

1. Create or obtain a square image (400x400px recommended)
2. Name it according to the list above
3. Place it in this folder (`/public/images/games/`)
4. The website will automatically use it on next page load

## Tips for Creating Thumbnails

- **Screenshots:** Take a screenshot of the game in action
- **Cropping:** Crop to a square shape focusing on the most recognizable part
- **Colors:** Use vibrant colors that stand out
- **Consistency:** Try to maintain a similar style across all thumbnails
- **Text:** Avoid adding text to the images (the game name is displayed below)
- **Optimization:** Use an image optimizer to reduce file size without losing quality

## Changing Image Format

If you want to use PNG or WebP instead of JPG, update the `image` property in `/pages/index.js`:

```javascript
const allGames = [
    { slug: 'tictactoe', name: 'Tic Tac Toe', ..., image: 'tictactoe.png' },
    // etc.
];
```

