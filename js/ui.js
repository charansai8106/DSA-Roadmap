/**
 * UI Rendering and DOM manipulation for DSA Roadmap
 */

/**
 * Displays a temporary toast notification at the bottom of the screen
 * @param {string} message
 */
function showToast(message) {
  const toastElement = document.getElementById("toast");
  toastElement.textContent = message;
  toastElement.classList.add("show");

  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toastElement.classList.remove("show");
  }, 2200);
}

/**
 * Updates top bar brand subtitle and undo/redo button enabled states
 */
function renderTopBar() {
  const stats = computeStats();
  const brandSub = document.getElementById("brand-sub");
  if (brandSub) {
    brandSub.textContent = `${stats.total} problems · ${appState.topics.length} topics`;
  }

  const undoBtn = document.getElementById("undo-btn");
  if (undoBtn) {
    undoBtn.disabled = appState.history.length === 0;
  }

  const redoBtn = document.getElementById("redo-btn");
  if (redoBtn) {
    redoBtn.disabled = appState.future.length === 0;
  }

  renderStats(stats);
}

/**
 * Renders the top summary metric cards and overall progress bar
 * @param {Object} stats
 */
function renderStats(stats) {
  const s = stats || computeStats();
  const strip = document.getElementById("stats-strip");
  if (!strip) return;

  strip.innerHTML = `
    ${createStatCell("&#127942;", "Solved", `${s.solved}/${s.total}`)}
    ${createStatCell("&#128200;", "Completion", `${s.pct}%`)}
    ${createStatCell("&#9989;", "Easy", `${s.easy}/${s.easyTotal}`)}
    ${createStatCell("&#9989;", "Medium", `${s.medium}/${s.medTotal}`)}
    ${createStatCell("&#9989;", "Hard", `${s.hard}/${s.hardTotal}`)}
    ${createStatCell("&#11088;", "Favorites", s.favs)}
    ${createStatCell("&#128293;", "Remaining", s.remaining)}
    <div class="stat-bar-cell">
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${s.pct}%; background: linear-gradient(90deg, #3b82f6, #06b6d4)"></div>
      </div>
    </div>
  `;
}

function createStatCell(icon, label, value) {
  return `
    <div class="stat-cell">
      <span class="stat-icon">${icon}</span>
      <div>
        <div class="stat-value">${escapeHtml(value)}</div>
        <div class="stat-label">${escapeHtml(label)}</div>
      </div>
    </div>
  `;
}

/**
 * Computes maximum canvas bounds to fit all topic nodes and edges
 * @returns {{ w: number, h: number }}
 */
function computeCanvasBounds() {
  let maxX = 900;
  let maxY = 800;
  appState.topics.forEach((topic) => {
    maxX = Math.max(maxX, topic.x + 500);
    maxY = Math.max(maxY, topic.y + 400);
  });
  return { w: maxX, h: maxY };
}

/**
 * Applies current pan offset and zoom scale to canvas inner container
 */
function applyViewTransform() {
  const inner = document.getElementById("canvas-inner");
  if (inner) {
    inner.style.transform = `translate(${appState.view.x}px, ${appState.view.y}px) scale(${appState.view.k})`;
  }
}

/**
 * Renders the SVG dependency edges and interactive topic cards onto the canvas
 */
function renderCanvas() {
  const bounds = computeCanvasBounds();
  const inner = document.getElementById("canvas-inner");
  if (!inner) return;

  inner.style.width = `${bounds.w}px`;
  inner.style.height = `${bounds.h}px`;
  applyViewTransform();

  // Build prerequisite edge connections
  const edges = [];
  appState.topics.forEach((topic) => {
    (topic.prereqs || []).forEach((prereqId) => {
      const fromTopic = appState.topics.find((t) => t.id === prereqId);
      if (fromTopic) {
        edges.push({ from: fromTopic, to: topic });
      }
    });
  });

  const svgPaths = edges
    .map((edge) => {
      const x1 = edge.from.x + CARD_WIDTH;
      const y1 = edge.from.y + CARD_HEIGHT / 2;
      const x2 = edge.to.x;
      const y2 = edge.to.y + CARD_HEIGHT / 2;
      const mx = (x1 + x2) / 2;
      const color = (TRACK_COLORS[edge.to.track] || TRACK_COLORS.core).base;
      return `<path d="M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}" stroke="${color}" stroke-opacity="0.35" stroke-width="2" fill="none" />`;
    })
    .join("");

  const svgContent = `<svg width="${bounds.w}" height="${bounds.h}" class="edges-svg">${svgPaths}</svg>`;

  // Build topic cards
  const nodesContent = appState.topics
    .map((topic) => {
      const trackTheme = TRACK_COLORS[topic.track] || TRACK_COLORS.core;
      const stats = getTopicStats(topic);
      const isDimmed = appState.searchQuery.trim() && !topicMatchesSearch(topic);
      const isSelected = appState.selectedTopicId === topic.id;

      return `
        <div class="node-card ${isDimmed ? "dimmed" : ""} ${isSelected ? "selected" : ""}"
             data-action="node" data-id="${topic.id}"
             style="left: ${topic.x}px; top: ${topic.y}px; --track-base: ${trackTheme.base}; --track-soft: ${trackTheme.soft}; --track-ring: ${trackTheme.ring};">
          <div class="node-inner">
            <div class="node-top-row">
              <span class="node-cat">${escapeHtml(topic.category)}</span>
              <span class="node-level">${escapeHtml(topic.level)}</span>
            </div>
            <div class="node-title">${escapeHtml(topic.title)}</div>
            <div class="node-meta-row">
              <span>${stats.solved}/${stats.total} solved</span>
              <span>${escapeHtml(topic.estimate)}</span>
            </div>
            <div class="progress-bar thin">
              <div class="progress-fill" style="width: ${stats.pct}%; background: linear-gradient(90deg, ${trackTheme.base}, ${trackTheme.ring})"></div>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  inner.innerHTML = svgContent + nodesContent;

  // Re-bind mouse down drag handler on rendered nodes
  inner.querySelectorAll(".node-card").forEach((cardElement) => {
    cardElement.addEventListener("mousedown", (e) => {
      if (typeof onNodeMouseDown === "function") {
        onNodeMouseDown(e, cardElement.dataset.id);
      }
    });
  });
}

/**
 * Renders the slide-out drawer displaying topic details and problem list
 */
function renderDrawer() {
  const drawer = document.getElementById("drawer");
  if (!drawer) return;

  const topic = appState.topics.find((t) => t.id === appState.selectedTopicId);
  if (!topic) {
    drawer.classList.remove("open");
    drawer.innerHTML = "";
    return;
  }

  drawer.classList.add("open");
  const trackTheme = TRACK_COLORS[topic.track] || TRACK_COLORS.core;
  const stats = getTopicStats(topic);
  const matchingProblems = topic.problems.filter(matchesFilters);

  const prereqChips = (topic.prereqs || [])
    .map((prereqId) => {
      const prereqTopic = appState.topics.find((t) => t.id === prereqId);
      if (!prereqTopic) return "";
      return `<button class="pill-btn" data-action="jump-topic" data-id="${prereqId}">${escapeHtml(prereqTopic.title)}</button>`;
    })
    .join("");

  const problemRowsHtml = matchingProblems.length
    ? matchingProblems.map((problem) => renderProblemRow(problem, topic)).join("")
    : `<div class="empty-hint">No problems match the current filters.</div>`;

  drawer.innerHTML = `
    <div class="drawer-inner">
      <div class="drawer-header">
        <div class="drawer-header-top">
          <div>
            <div class="drawer-cat" style="color: ${trackTheme.ring}">
              ${escapeHtml(topic.category)} · ${escapeHtml(topic.level)}
            </div>
            <h2 class="drawer-title">${escapeHtml(topic.title)}</h2>
          </div>
          <button class="icon-btn" data-action="close-drawer" title="Close drawer">&#10005;</button>
        </div>
        <p class="drawer-desc">${escapeHtml(topic.description)}</p>
        <div class="drawer-meta">
          <span>&#128337; ${escapeHtml(topic.estimate)}</span>
          <span>&#128209; ${topic.problems.length} problems</span>
        </div>
        ${topic.prereqs?.length ? `
          <div class="prereq-block">
            <div class="section-label">Prerequisites</div>
            <div>${prereqChips}</div>
          </div>
        ` : ""}
        <div class="drawer-progress">
          <div class="section-label-row">
            <span>Progress</span>
            <span>${stats.solved}/${stats.total}</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${stats.pct}%; background: linear-gradient(90deg, ${trackTheme.base}, ${trackTheme.ring})"></div>
          </div>
        </div>
        <div class="drawer-actions">
          <button class="btn btn-outline flex1" data-action="open-add-problem" data-topic="${topic.id}">+ Add Problem</button>
          <button class="btn btn-danger" data-action="confirm-delete-topic" data-id="${topic.id}">&#128465; Delete</button>
        </div>
      </div>
      <div class="drawer-body">${problemRowsHtml}</div>
    </div>
  `;
}

/**
 * Renders markup for a single problem row in the drawer
 * @param {Object} problem
 * @param {Object} topic
 * @returns {string}
 */
function renderProblemRow(problem, topic) {
  const status = appState.progress[problem.id] || {};
  const tagsHtml = problem.tags.map((tag) => `<span class="chip">${escapeHtml(tag)}</span>`).join("");
  const companiesHtml = problem.companies.length
    ? `<div class="row-companies">${escapeHtml(problem.companies.join(" · "))}</div>`
    : "";

  return `
    <div class="problem-row">
      <button class="check-btn" data-action="toggle-solved" data-id="${problem.id}" title="Mark solved">
        ${status.solved ? "&#9989;" : "&#9711;"}
      </button>
      <div class="row-main">
        <div class="row-title-line">
          <a href="https://leetcode.com/problems/${encodeURIComponent(problem.slug)}/"
             target="_blank" rel="noopener noreferrer"
             class="row-title ${status.solved ? "solved" : ""}">
            ${escapeHtml(problem.name)} <span class="ext-ic">&#8599;</span>
          </a>
          <span class="diff-badge diff-${problem.difficulty}">${problem.difficulty}</span>
        </div>
        <div class="row-tags">${tagsHtml}</div>
        ${companiesHtml}
        <div class="row-actions">
          <button class="mini-btn ${status.favorite ? "fav-on" : ""}" data-action="toggle-favorite" data-id="${problem.id}" title="Favorite">
            ${status.favorite ? "&#9733;" : "&#9734;"}
          </button>
          <button class="mini-btn ${status.revision ? "rev-on" : ""}" data-action="toggle-revision" data-id="${problem.id}" title="Mark for revision">
            &#8635;
          </button>
          <button class="mini-btn" data-action="open-solution" data-id="${problem.id}" title="Solution framework">
            &#128161;
          </button>
          <button class="mini-btn ${status.notes ? "note-on" : ""}" data-action="open-notes" data-id="${problem.id}" title="Notes">
            &#128221;
          </button>
          <button class="mini-btn danger ml-auto" data-action="remove-problem" data-topic="${topic.id}" data-id="${problem.id}" title="Remove problem">
            &#128465;
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Track legend items rendered on the canvas
 */
function renderLegend() {
  const legendElement = document.getElementById("legend");
  if (!legendElement) return;

  legendElement.innerHTML = Object.entries(TRACK_COLORS)
    .map(([trackName, colors]) => `
      <span class="legend-item">
        <span class="legend-dot" style="background: ${colors.base}"></span>
        ${escapeHtml(trackName)}
      </span>
    `)
    .join("");
}

/* ---------- Modals ---------- */

function openModal(contentHtml, isWide = false) {
  const root = document.getElementById("modal-root");
  if (!root) return;

  root.innerHTML = `
    <div class="modal-overlay" data-action="close-modal">
      <div class="modal-box ${isWide ? "wide" : ""}" data-stop>${contentHtml}</div>
    </div>
  `;
  root.querySelector(".modal-box").addEventListener("mousedown", (e) => e.stopPropagation());
}

function closeModal() {
  const root = document.getElementById("modal-root");
  if (root) {
    root.innerHTML = "";
  }
}

function openAddTopicModal() {
  const optionsHtml = appState.topics
    .map((topic) => `<button type="button" class="pill-btn pill-toggle" data-prereq="${topic.id}">${escapeHtml(topic.title)}</button>`)
    .join("");

  openModal(`
    <div class="modal-head">
      <h3>Add a topic</h3>
      <button class="icon-btn" data-action="close-modal">&#10005;</button>
    </div>
    <div class="modal-body">
      <label class="field">
        <span>Topic name</span>
        <input id="f-title" class="modal-input" placeholder="e.g. Suffix Arrays" />
      </label>
      <div class="field-row">
        <label class="field">
          <span>Category label</span>
          <input id="f-category" class="modal-input" placeholder="e.g. Advanced Strings" />
        </label>
        <label class="field">
          <span>Level</span>
          <select id="f-level" class="modal-input">
            <option>Beginner</option>
            <option selected>Intermediate</option>
            <option>Advanced</option>
          </select>
        </label>
      </div>
      <label class="field">
        <span>Description</span>
        <textarea id="f-desc" class="modal-input" rows="2"></textarea>
      </label>
      <label class="field">
        <span>Estimated time</span>
        <input id="f-est" class="modal-input" placeholder="e.g. 3-4 hrs" />
      </label>
      <label class="field">
        <span>Prerequisites</span>
        <div class="pill-wrap" id="f-prereqs">${optionsHtml}</div>
      </label>
    </div>
    <div class="modal-foot">
      <button class="btn btn-outline flex1" data-action="close-modal">Cancel</button>
      <button class="btn btn-primary flex1" id="save-topic-btn">Add topic</button>
    </div>
  `, true);

  const selectedPrereqs = new Set();
  document.querySelectorAll("#f-prereqs .pill-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const topicId = btn.dataset.prereq;
      if (selectedPrereqs.has(topicId)) {
        selectedPrereqs.delete(topicId);
        btn.classList.remove("active");
      } else {
        selectedPrereqs.add(topicId);
        btn.classList.add("active");
      }
    });
  });

  document.getElementById("save-topic-btn").addEventListener("click", () => {
    const title = document.getElementById("f-title").value.trim();
    if (!title) return;

    pushHistory();
    const newTopicId = uid("topic");
    const category = document.getElementById("f-category").value.trim() || "Custom";
    const level = document.getElementById("f-level").value;
    const description = document.getElementById("f-desc").value.trim();
    const estimate = document.getElementById("f-est").value.trim() || "—";

    // Place topic near current view center
    const posX = 60 - appState.view.x / appState.view.k + 300;
    const posY = 40 - appState.view.y / appState.view.k + 300;

    appState.topics.push(
      createTopic(
        newTopicId,
        title,
        category,
        "advanced",
        level,
        description,
        Array.from(selectedPrereqs),
        estimate,
        posX,
        posY,
        []
      )
    );

    saveState();
    closeModal();
    renderCanvas();
    renderTopBar();
    showToast(`Added topic "${title}"`);
  });
}

function openAddProblemModal(topicId) {
  openModal(`
    <div class="modal-head">
      <h3>Add a problem</h3>
      <button class="icon-btn" data-action="close-modal">&#10005;</button>
    </div>
    <div class="modal-body">
      <label class="field">
        <span>Problem name</span>
        <input id="p-name" class="modal-input" placeholder="e.g. Longest Valid Parentheses" />
      </label>
      <label class="field">
        <span>LeetCode slug (from the URL)</span>
        <input id="p-slug" class="modal-input" placeholder="e.g. longest-valid-parentheses" />
      </label>
      <label class="field">
        <span>Difficulty</span>
        <select id="p-diff" class="modal-input">
          <option>Easy</option>
          <option selected>Medium</option>
          <option>Hard</option>
        </select>
      </label>
      <label class="field">
        <span>Tags (comma separated)</span>
        <input id="p-tags" class="modal-input" placeholder="Stack, DP" />
      </label>
      <label class="field">
        <span>Companies (comma separated, optional)</span>
        <input id="p-companies" class="modal-input" placeholder="Amazon, Google" />
      </label>
    </div>
    <div class="modal-foot">
      <button class="btn btn-outline flex1" data-action="close-modal">Cancel</button>
      <button class="btn btn-primary flex1" id="save-problem-btn">Add problem</button>
    </div>
  `);

  document.getElementById("save-problem-btn").addEventListener("click", () => {
    const name = document.getElementById("p-name").value.trim();
    const slug = document.getElementById("p-slug").value.trim().toLowerCase().replace(/\s+/g, "-");
    if (!name || !slug) return;

    pushHistory();
    const topic = appState.topics.find((t) => t.id === topicId);
    if (topic) {
      topic.problems.push(
        createProblem(
          name,
          slug,
          document.getElementById("p-diff").value,
          document.getElementById("p-tags").value,
          document.getElementById("p-companies").value
        )
      );
      saveState();
      closeModal();
      renderDrawer();
      renderCanvas();
      renderTopBar();
      showToast(`Added "${name}"`);
    }
  });
}

function openSolutionModal(problemId) {
  const problem = getAllProblems().find((p) => p.id === problemId);
  if (!problem) return;

  const topic = appState.topics.find((t) => t.id === problem.topicId);
  const framework = getSolutionFramework(topic, problem);

  openModal(`
    <div class="modal-head">
      <h3>&#128161; ${escapeHtml(problem.name)} <span class="diff-badge diff-${problem.difficulty}">${problem.difficulty}</span></h3>
      <button class="icon-btn" data-action="close-modal">&#10005;</button>
    </div>
    <a href="https://leetcode.com/problems/${encodeURIComponent(problem.slug)}/"
       target="_blank" rel="noopener noreferrer" class="modal-link">
      Open on LeetCode &#8599;
    </a>
    <div class="modal-body">
      ${renderSolutionBlock("Intuition", framework.intuition)}
      ${renderSolutionBlock("Brute force", framework.brute)}
      ${renderSolutionBlock("Optimal approach", framework.optimal)}
      ${renderSolutionBlock("Complexity", framework.complexity)}
      <div class="caveat-box">&#9888; ${escapeHtml(framework.caveat)}</div>
    </div>
  `, true);
}

function renderSolutionBlock(label, text) {
  return `
    <div class="sol-block">
      <div class="section-label">${escapeHtml(label)}</div>
      <div class="sol-text">${escapeHtml(text)}</div>
    </div>
  `;
}

function openNotesModal(problemId) {
  const problem = getAllProblems().find((p) => p.id === problemId);
  if (!problem) return;

  const currentNotes = appState.progress[problemId]?.notes || "";

  openModal(`
    <div class="modal-head">
      <h3>&#128221; Notes — ${escapeHtml(problem.name)}</h3>
      <button class="icon-btn" data-action="close-modal">&#10005;</button>
    </div>
    <div class="modal-body">
      <textarea id="notes-area" class="modal-input mono" rows="10"
        placeholder="Write approach notes, gotchas, or paste a code snippet…">${escapeHtml(currentNotes)}</textarea>
    </div>
    <div class="modal-foot">
      <button class="btn btn-primary flex1" id="notes-done-btn">Done</button>
    </div>
  `);

  const textarea = document.getElementById("notes-area");
  textarea.addEventListener("input", () => {
    patchProgress(problemId, { notes: textarea.value });
  });

  document.getElementById("notes-done-btn").addEventListener("click", () => {
    closeModal();
    renderDrawer();
  });
}

function openConfirmDeleteTopic(topicId) {
  openModal(`
    <div class="modal-body">
      <h3>Delete this topic?</h3>
      <p class="confirm-text">
        This removes the topic and its problems from the roadmap, and clears it as a prerequisite from other topics.
      </p>
    </div>
    <div class="modal-foot">
      <button class="btn btn-outline flex1" data-action="close-modal">Cancel</button>
      <button class="btn btn-danger-solid flex1" id="confirm-delete-btn">Delete</button>
    </div>
  `);

  document.getElementById("confirm-delete-btn").addEventListener("click", () => {
    pushHistory();
    appState.topics = appState.topics
      .filter((t) => t.id !== topicId)
      .map((t) => ({
        ...t,
        prereqs: (t.prereqs || []).filter((pid) => pid !== topicId),
      }));

    if (appState.selectedTopicId === topicId) {
      appState.selectedTopicId = null;
    }

    saveState();
    closeModal();
    renderCanvas();
    renderDrawer();
    renderTopBar();
    showToast("Topic deleted");
  });
}
