/**
 * Search and filtering logic for DSA Roadmap
 */

/**
 * Checks whether a problem satisfies active difficulty, status, and text search filters
 * @param {Object} problem
 * @returns {boolean}
 */
function matchesFilters(problem) {
  const status = appState.progress[problem.id];

  // Difficulty filter
  if (appState.diffFilter !== "All" && problem.difficulty !== appState.diffFilter) {
    return false;
  }

  // Status filter
  if (appState.statusFilter === "Solved" && !status?.solved) return false;
  if (appState.statusFilter === "Unsolved" && status?.solved) return false;
  if (appState.statusFilter === "Favorite" && !status?.favorite) return false;
  if (appState.statusFilter === "Revision" && !status?.revision) return false;

  // Search query (matches problem name, tags, or company names)
  if (appState.searchQuery.trim()) {
    const query = appState.searchQuery.toLowerCase();
    const searchableText = `${problem.name} ${problem.tags.join(" ")} ${problem.companies.join(" ")}`.toLowerCase();
    if (!searchableText.includes(query)) {
      return false;
    }
  }

  return true;
}

/**
 * Checks whether a topic card matches the active search query
 * Used to dim non-matching topics on the canvas graph
 * @param {Object} topic
 * @returns {boolean}
 */
function topicMatchesSearch(topic) {
  if (!appState.searchQuery.trim()) return true;
  const query = appState.searchQuery.toLowerCase();

  // Matches topic title or any problem name in the topic
  if (topic.title.toLowerCase().includes(query)) return true;
  return topic.problems.some((problem) => problem.name.toLowerCase().includes(query));
}
