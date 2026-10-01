# DSA Mastery Roadmap

An interactive, visual roadmap for tracking Data Structures and Algorithms (DSA) preparation for technical interviews. The roadmap presents 34 core DSA topics arranged as an interactive dependency graph with 326 curated LeetCode problems.

Built entirely with **vanilla HTML, CSS, and JavaScript** — no frameworks, no build steps, and no external dependencies.

---

## Features

- **Interactive Canvas Graph**: Drag to pan, scroll to zoom, and drag topic cards to rearrange the roadmap layout.
- **Visual Topic Prerequisites**: SVG bezier curves connect prerequisite topics to downstream topics.
- **Categorized Track Themes**: Topics are color-coded by domain (Core Foundations, Data Structures, Trees, Graphs, Dynamic Programming, Advanced Structures, and System Design).
- **Curated Problem Bank**: 326 hand-picked LeetCode problems categorized by difficulty (Easy, Medium, Hard) with topic tags, company frequency tags, and direct problem links.
- **Progress Tracking & Metrics**: Mark problems as Solved, Favorite, or Revision. Real-time statistics track completion percentage and difficulty breakdown.
- **Approach Notes**: Write and save personal notes, gotchas, or solution outlines directly for each problem.
- **Solution Frameworks**: Instant high-level intuition, brute force analysis, optimal approach hints, and Big-O complexity breakdowns for every problem.
- **Search & Filtering**: Filter problems by difficulty, completion status, favorite/revision flags, or search by problem title, tags, and companies. Non-matching topics on the canvas graph dim automatically.
- **Undo / Redo History**: Revert or reapply topic moves, deletions, and additions with a 20-step history stack.
- **Dynamic Topic & Problem Management**: Add custom topics with prerequisite links, add new problems to any topic, or delete topics.
- **Data Persistence & Backups**:
  - Auto-saves state to the browser's `localStorage`.
  - **Export JSON**: Download a complete JSON backup of topics and user progress.
  - **Import JSON**: Restore roadmap state from any previous backup file.
  - **Export CSV**: Export problem progress (topic, title, difficulty, status, LeetCode link) into a spreadsheet-friendly CSV.

---

## Technologies Used

- **HTML5**: Semantic document layout, modal dialogs, and form controls.
- **CSS3**: Custom properties (CSS variables), Flexbox, CSS Grid, smooth transitions, and responsive dark-mode styling.
- **JavaScript (ES6+)**:
  - Document Object Model (DOM) manipulation and template literal rendering.
  - Event delegation on `data-action` attributes.
  - SVG path calculations for cubic bezier curves.
  - Browser `localStorage` API with dataset versioning.
  - `FileReader` API for local JSON file imports.
  - `Blob` and object URL generation for client-side JSON and CSV downloads.

---

## Project Structure

```
DSA-Roadmap/
│
├── index.html          # Application layout, top bar, canvas wrapper, drawer, and modal containers
│
├── css/
│   └── style.css       # Complete dark-mode styling, grid layouts, and component styles
│
├── js/
│   ├── utils.js        # Helper functions (HTML escaping, unique ID generator, Blob downloader)
│   ├── data.js         # Curated DSA topics (34), problems (326), track colors, and hints
│   ├── storage.js      # LocalStorage persistence logic and dataset version validation
│   ├── state.js        # Central application state, history undo/redo stacks, and progress mutators
│   ├── progress.js     # Topic and global completion metric calculations
│   ├── search.js       # Search filtering predicates for problems and canvas cards
│   ├── ui.js           # Canvas rendering, drawer views, problem cards, and modal dialogs
│   └── app.js          # Canvas pan/zoom/drag handlers, event dispatcher, import/export, and init
│
└── README.md           # Project documentation
```

### Module Responsibilities

1. **`index.html`**: Defines the structural scaffolding and loads scripts in correct dependency order.
2. **`css/style.css`**: Manages all visual styles, responsive design, dark theme colors, and layout positioning.
3. **`js/utils.js`**: Contains general-purpose helpers (`escapeHtml`, `uid`, `downloadBlob`).
4. **`js/data.js`**: Houses the initial dataset of 34 topics, 326 problems, track color definitions, and algorithmic pattern hints.
5. **`js/storage.js`**: Reads and writes to `localStorage` safely, ensuring user progress is preserved even when topic data is updated.
6. **`js/state.js`**: Maintains the single source of truth for the active roadmap state, history snapshots for undo/redo, and progress updates.
7. **`js/progress.js`**: Performs data aggregation to calculate progress percentages and difficulty statistics.
8. **`js/search.js`**: Implements filter predicates that evaluate search terms, difficulty levels, and completion status.
9. **`js/ui.js`**: Converts state data into DOM elements, computes canvas bounds, renders SVG connector lines, and renders modals.
10. **`js/app.js`**: Orchestrates event listeners, pan/zoom/drag gestures on the canvas, file import/export workflows, and boots the application.

---

## How to Run

Because this project uses vanilla JavaScript and standard browser APIs, **no build step, package manager, or server installation is strictly required**:

### Option 1: Direct File Opening (Simplest)
Double-click `index.html` or drag it into any modern web browser (Google Chrome, Firefox, Safari, Edge).

### Option 2: Local HTTP Server (Recommended)
You can serve the directory using Python's built-in HTTP server or VS Code's Live Server:

```bash
# Using Python 3
cd DSA-Roadmap
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

---

## Technical Concepts Demonstrated

- **DOM Manipulation & Template Rendering**: Building complex user interfaces dynamically from JavaScript objects without third-party template engines.
- **Event Delegation**: Using a single global click handler that inspects `data-action` attributes on target elements, reducing memory overhead and avoiding detached listener bugs.
- **Interactive Coordinate Math**: Converting screen mouse coordinates to scaled canvas coordinates (`dx / k`, `dy / k`) for smooth panning, zooming, and card dragging.
- **State Management & Immutability**: Managing application state cleanly in a central store, using deep clones (`JSON.parse(JSON.stringify(...))`) to maintain undo/redo history stacks.
- **Persistence & Schema Versioning**: Storing serialized JSON state in `localStorage` while separating user progress keys from static content so that updates to the curriculum don't wipe out user progress.
- **Data Exporting (JSON & CSV)**: Creating dynamic in-memory `Blob` objects and triggering browser download links programmatically with proper CSV escaping for commas and quotes.
