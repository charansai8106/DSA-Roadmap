/**
 * State management for DSA Roadmap:
 * Holds centralized reactive data, history stacks for undo/redo, and progress mutation.
 */

const appState = {
  topics: [],
  progress: {},
  history: [],
  future: [],
  selectedTopicId: null,
  searchQuery: "",
  diffFilter: "All",
  statusFilter: "All",
  view: { x: 60, y: 40, k: 0.62 },
  isLoaded: false,
};

/**
 * Initializes state from storage or defaults
 */
function initState() {
  const initialData = loadPersistedState(JSON.parse(JSON.stringify(INITIAL_TOPICS)));
  appState.topics = initialData.topics;
  appState.progress = initialData.progress;
  appState.isLoaded = true;
}

/**
 * Saves current topics and progress to localStorage
 */
function saveState() {
  if (!appState.isLoaded) return;
  savePersistedState(appState.topics, appState.progress);
}

/**
 * Saves a snapshot of topics before a mutation for undo support
 */
function pushHistory() {
  appState.history.push(JSON.parse(JSON.stringify(appState.topics)));
  if (appState.history.length > 20) {
    appState.history.shift();
  }
  appState.future = [];
}

/**
 * Reverts the most recent topic modification
 * @returns {boolean} True if an undo action took place
 */
function undo() {
  if (!appState.history.length) return false;
  appState.future.unshift(JSON.parse(JSON.stringify(appState.topics)));
  appState.topics = appState.history.pop();
  saveState();
  return true;
}

/**
 * Re-applies the most recently undone topic modification
 * @returns {boolean} True if a redo action took place
 */
function redo() {
  if (!appState.future.length) return false;
  appState.history.push(JSON.parse(JSON.stringify(appState.topics)));
  appState.topics = appState.future.shift();
  saveState();
  return true;
}

/**
 * Patches progress flags/notes for a specific problem and auto-saves
 * @param {string} problemId
 * @param {Object} patch
 */
function patchProgress(problemId, patch) {
  appState.progress[problemId] = {
    solved: false,
    favorite: false,
    revision: false,
    notes: "",
    ...(appState.progress[problemId] || {}),
    ...patch,
  };
  saveState();
}
