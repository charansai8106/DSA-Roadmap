/**
 * Storage module:
 * Handles persistence to localStorage, dataset versioning, and state rehydration.
 */

const STORAGE_KEY = "dsa-roadmap-vanilla-v1";
const DATA_VERSION = "2026-07-17-v2-326";

/**
 * Loads saved state from localStorage.
 * Restores user progress (solved, favorite, revision, notes) safely,
 * and checks the dataVersion before overriding topics with cached data.
 *
 * @param {Array} defaultTopics - Fallback topics if nothing is stored or version changed
 * @returns {{ topics: Array, progress: Object }}
 */
function loadPersistedState(defaultTopics) {
  let loadedTopics = defaultTopics;
  let loadedProgress = {};

  try {
    const rawData = window.localStorage.getItem(STORAGE_KEY);
    if (rawData) {
      const parsed = JSON.parse(rawData);

      // User progress is always safe to restore across dataset updates
      if (parsed.progress && typeof parsed.progress === "object") {
        loadedProgress = parsed.progress;
      }

      // Only restore stored topics if the dataset version matches.
      // If the built-in topics received updates, we preserve the new topics while keeping user progress.
      if (parsed.topics && parsed.dataVersion === DATA_VERSION) {
        loadedTopics = parsed.topics;
      } else if (parsed.topics && parsed.dataVersion !== DATA_VERSION) {
        console.info(
          "Roadmap dataset was updated — loaded latest topic definitions while preserving your saved progress."
        );
      }
    }
  } catch (error) {
    console.warn("Could not load saved roadmap data from localStorage:", error);
  }

  return {
    topics: loadedTopics,
    progress: loadedProgress,
  };
}

/**
 * Persists topics and progress state to localStorage
 * @param {Array} topics
 * @param {Object} progress
 */
function savePersistedState(topics, progress) {
  try {
    const payload = {
      topics,
      progress,
      dataVersion: DATA_VERSION,
      savedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.warn("Could not save roadmap data to localStorage:", error);
  }
}
