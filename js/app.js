/**
 * Application controller for DSA Roadmap:
 * Initializes modules, binds canvas interactions, handles event delegation, and manages export/import.
 */

let panState = null;
let dragNode = null;

/* ---------- Canvas Pan, Zoom, and Drag ---------- */

function zoomBy(delta) {
  appState.view.k = Math.min(2, Math.max(0.3, +(appState.view.k + delta).toFixed(2)));
  applyViewTransform();
}

function resetView() {
  appState.view = { x: 60, y: 40, k: 0.62 };
  applyViewTransform();
}

function onNodeMouseDown(e, topicId) {
  e.stopPropagation();
  const topic = appState.topics.find((t) => t.id === topicId);
  if (!topic) return;

  dragNode = {
    id: topicId,
    startX: e.clientX,
    startY: e.clientY,
    origX: topic.x,
    origY: topic.y,
    moved: false,
    recorded: false,
  };
}

function initCanvasEvents() {
  const canvasWrap = document.getElementById("canvas-wrap");
  if (!canvasWrap) return;

  // Zoom on wheel scroll
  canvasWrap.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      const delta = -e.deltaY * 0.0012;
      appState.view.k = Math.min(2, Math.max(0.3, +(appState.view.k + delta).toFixed(3)));
      applyViewTransform();
    },
    { passive: false }
  );

  // Pan canvas on background mouse down
  canvasWrap.addEventListener("mousedown", (e) => {
    if (e.target !== canvasWrap && e.target.id !== "canvas-inner") return;
    panState = {
      startX: e.clientX,
      startY: e.clientY,
      origX: appState.view.x,
      origY: appState.view.y,
    };
  });

  // Global mouse move for panning canvas and dragging topic cards
  window.addEventListener("mousemove", (e) => {
    if (panState) {
      const dx = e.clientX - panState.startX;
      const dy = e.clientY - panState.startY;
      appState.view.x = panState.origX + dx;
      appState.view.y = panState.origY + dy;
      applyViewTransform();
    }

    if (dragNode) {
      const dx = (e.clientX - dragNode.startX) / appState.view.k;
      const dy = (e.clientY - dragNode.startY) / appState.view.k;

      if (Math.abs(e.clientX - dragNode.startX) > 3 || Math.abs(e.clientY - dragNode.startY) > 3) {
        dragNode.moved = true;
      }

      // Record snapshot into history once dragging starts
      if (dragNode.moved && !dragNode.recorded) {
        dragNode.recorded = true;
        pushHistory();
      }

      const topic = appState.topics.find((t) => t.id === dragNode.id);
      if (topic) {
        topic.x = dragNode.origX + dx;
        topic.y = dragNode.origY + dy;
        renderCanvas();
      }
    }
  });

  // Global mouse up to finalize pan/drag
  window.addEventListener("mouseup", () => {
    if (dragNode && !dragNode.moved) {
      // Clicked on a card without dragging: open drawer for this topic
      appState.selectedTopicId = dragNode.id;
      renderCanvas();
      renderDrawer();
    } else if (dragNode) {
      // Card was moved: persist its new coordinates
      saveState();
    }

    panState = null;
    dragNode = null;
  });
}

/* ---------- Export & Import Handlers ---------- */

function exportJSON() {
  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    topics: appState.topics,
    progress: appState.progress,
  };
  downloadBlob(JSON.stringify(payload, null, 2), "application/json", "dsa-roadmap-backup.json");
  showToast("Exported JSON backup");
}

function exportCSV() {
  const rows = [["Topic", "Problem", "Difficulty", "Solved", "Favorite", "Revision", "LeetCode URL"]];

  getAllProblems().forEach((problem) => {
    const status = appState.progress[problem.id] || {};
    rows.push([
      problem.topicTitle,
      problem.name,
      problem.difficulty,
      status.solved ? "Yes" : "No",
      status.favorite ? "Yes" : "No",
      status.revision ? "Yes" : "No",
      `https://leetcode.com/problems/${problem.slug}/`,
    ]);
  });

  const csvContent = rows
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  downloadBlob(csvContent, "text/csv", "dsa-roadmap-progress.csv");
  showToast("Exported CSV");
}

function handleFileImport(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (data.topics && Array.isArray(data.topics)) {
        appState.topics = data.topics;
      }
      if (data.progress && typeof data.progress === "object") {
        appState.progress = data.progress;
      }
      saveState();
      renderCanvas();
      renderDrawer();
      renderTopBar();
      showToast("Import successful");
    } catch (err) {
      showToast("Import failed — invalid JSON");
    }
  };
  reader.readAsText(file);
  event.target.value = "";
}

/* ---------- Event Delegation Dispatcher ---------- */

function handleAction(element) {
  const action = element.dataset.action;
  const id = element.dataset.id;

  switch (action) {
    case "node":
      // Handled via mousedown/mouseup distinction
      break;

    case "close-drawer":
      appState.selectedTopicId = null;
      renderCanvas();
      renderDrawer();
      break;

    case "jump-topic":
      appState.selectedTopicId = id;
      renderCanvas();
      renderDrawer();
      break;

    case "toggle-solved":
      patchProgress(id, { solved: !appState.progress[id]?.solved });
      renderDrawer();
      renderCanvas();
      renderTopBar();
      break;

    case "toggle-favorite":
      patchProgress(id, { favorite: !appState.progress[id]?.favorite });
      renderDrawer();
      renderTopBar();
      break;

    case "toggle-revision":
      patchProgress(id, { revision: !appState.progress[id]?.revision });
      renderDrawer();
      break;

    case "open-solution":
      openSolutionModal(id);
      break;

    case "open-notes":
      openNotesModal(id);
      break;

    case "remove-problem": {
      const topicId = element.dataset.topic;
      pushHistory();
      const topic = appState.topics.find((t) => t.id === topicId);
      if (topic) {
        topic.problems = topic.problems.filter((p) => p.id !== id);
        saveState();
        renderDrawer();
        renderCanvas();
        renderTopBar();
      }
      break;
    }

    case "open-add-problem":
      openAddProblemModal(element.dataset.topic);
      break;

    case "confirm-delete-topic":
      openConfirmDeleteTopic(id);
      break;

    case "close-modal":
      closeModal();
      break;

    case "undo":
      if (undo()) {
        renderCanvas();
        renderDrawer();
        renderTopBar();
      }
      break;

    case "redo":
      if (redo()) {
        renderCanvas();
        renderDrawer();
        renderTopBar();
      }
      break;

    case "add-topic":
      openAddTopicModal();
      break;

    case "export-json":
      exportJSON();
      break;

    case "export-csv":
      exportCSV();
      break;

    case "trigger-import":
      document.getElementById("import-file-input")?.click();
      break;

    case "zoom-in":
      zoomBy(0.15);
      break;

    case "zoom-out":
      zoomBy(-0.15);
      break;

    case "reset-view":
      resetView();
      break;
  }
}

/* ---------- Application Bootstrap ---------- */

function init() {
  initState();

  // Global action delegation
  document.addEventListener("click", (e) => {
    const actionEl = e.target.closest("[data-action]");
    if (!actionEl) return;
    if (actionEl.dataset.action === "node") return;
    handleAction(actionEl);
  });

  // Topbar search input
  document.getElementById("search-input")?.addEventListener("input", (e) => {
    appState.searchQuery = e.target.value;
    renderCanvas();
    renderDrawer();
  });

  // Difficulty filter dropdown
  document.getElementById("diff-filter")?.addEventListener("change", (e) => {
    appState.diffFilter = e.target.value;
    renderDrawer();
  });

  // Status filter dropdown
  document.getElementById("status-filter")?.addEventListener("change", (e) => {
    appState.statusFilter = e.target.value;
    renderDrawer();
  });

  // File import input
  document.getElementById("import-file-input")?.addEventListener("change", handleFileImport);

  // Initialize canvas listeners and initial render
  initCanvasEvents();
  renderLegend();
  renderTopBar();
  renderCanvas();
  renderDrawer();
}

document.addEventListener("DOMContentLoaded", init);
