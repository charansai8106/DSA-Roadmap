/**
 * Progress tracking and metrics calculations for DSA Roadmap
 */

/**
 * Returns a flat list of all problems enriched with topic metadata
 * @returns {Array}
 */
function getAllProblems() {
  return appState.topics.flatMap((topic) =>
    topic.problems.map((problem) => ({
      ...problem,
      topicId: topic.id,
      topicTitle: topic.title,
      track: topic.track,
    }))
  );
}

/**
 * Calculates progress statistics for an individual topic
 * @param {Object} topic
 * @returns {{ total: number, solved: number, pct: number }}
 */
function getTopicStats(topic) {
  const total = topic.problems.length;
  const solved = topic.problems.filter((p) => appState.progress[p.id]?.solved).length;
  const pct = total ? Math.round((solved / total) * 100) : 0;
  return { total, solved, pct };
}

/**
 * Computes global statistics across the entire roadmap
 * @returns {Object}
 */
function computeStats() {
  const allProblems = getAllProblems();
  let solved = 0;
  let easy = 0;
  let medium = 0;
  let hard = 0;
  let easyTotal = 0;
  let medTotal = 0;
  let hardTotal = 0;
  let favs = 0;

  allProblems.forEach((problem) => {
    const status = appState.progress[problem.id];
    if (problem.difficulty === "Easy") easyTotal++;
    if (problem.difficulty === "Medium") medTotal++;
    if (problem.difficulty === "Hard") hardTotal++;

    if (status?.solved) {
      solved++;
      if (problem.difficulty === "Easy") easy++;
      if (problem.difficulty === "Medium") medium++;
      if (problem.difficulty === "Hard") hard++;
    }

    if (status?.favorite) favs++;
  });

  const total = allProblems.length;
  const pct = total ? Math.round((solved / total) * 100) : 0;

  return {
    total,
    solved,
    remaining: total - solved,
    easy,
    medium,
    hard,
    easyTotal,
    medTotal,
    hardTotal,
    favs,
    pct,
  };
}
