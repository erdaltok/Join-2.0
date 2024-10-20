/**
 * Initiates the dragging process for a task.
 * @param {string} id - The ID of the task being dragged.
 */
function startDragging(id) {
  draggedItemId = id;
  const item = document.getElementById(draggedItemId);
  item.addEventListener("dragend", clearHighlights);
}

/**
 * Allows a dragged item to be dropped on a droppable element.
 * @param {Event} event - The drag event.
 */
function allowDrop(event) {
  event.preventDefault();
}

/**
 * Moves a dragged task to a specified column.
 * @param {string} columnId - The ID of the column where the task is dropped.
 */
function moveTo(columnId) {
  if (draggedItemId) {
    const item = document.getElementById(draggedItemId);
    document.getElementById(columnId).appendChild(item);
    const task = tasks.find(
      (t) => t.id.toString() === draggedItemId.toString()
    );
    if (task) {
      task.status = columnId;
      saveTasksToStorage();
    }
    draggedItemId = null;
    clearHighlights();
  }
}

/**
 * Highlights a column to indicate it's a valid drop target.
 * @param {string} columnId - The ID of the column to be highlighted.
 */
function highlight(columnId) {
  document.getElementById(columnId).style.background = "#f0f0f0";
  document.getElementById(columnId).style.borderRadius = "16px";
}

/**
 * Removes highlight from a column.
 * @param {string} columnId - The ID of the column to remove highlight from.
 */
function removeHighlight(columnId) {
  document.getElementById(columnId).style.background = "";
}

/**
 * Clears highlights from all columns.
 */
function clearHighlights() {
  ["todo", "inProgress", "awaitFeedback", "done"].forEach(removeHighlight);
}

/**
 * Filters tasks based on a search query.
 */
function searchTask() {
  const searchText = document.getElementById("search-Task").value.toLowerCase();
  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchText) ||
      task.description.toLowerCase().includes(searchText)
  );
  renderFilteredTasks(filteredTasks);
}

/**
 * Renders tasks that match the search filter.
 * @param {Array} filteredTasks - Array of tasks that match the search criteria.
 */
function renderFilteredTasks(filteredTasks) {
  ["todo", "inProgress", "awaitFeedback", "done"].forEach((columnId) => {
    document.getElementById(columnId).innerHTML = "";
  });
  filteredTasks.forEach((task) => {
    const columnId = task.status || "todo";
    addTaskToBoard(task, columnId);
  });
}

// Event listeners for drag and drop functionality and image hover effects.
document.addEventListener("DOMContentLoaded", function () {
  ["todo", "inProgress", "awaitFeedback", "done"].forEach((columnId) => {
    const column = document.getElementById(columnId);
    if (column) {
      column.addEventListener("drop", clearHighlights);
    }
  });

  /**
   * Changes the image source to a blue plus icon on mouseover.
   */
  const imageElements = document.querySelectorAll(".changeableImage");
  imageElements.forEach((imageElement) => {
    imageElement.addEventListener("mouseover", function () {
      this.src = "/Join/img/plus-icon-board-column-blue.svg";
    });

    /**
     * Changes the image source back to the default plus icon on mouseout.
     */
    imageElement.addEventListener("mouseout", function () {
      this.src = "/Join/img/plus-icon-board-column.svg";
    });
  });
});

/**
 * Updates the status of a task based on its ID prefix and saves the changes to storage.
 * @param {string} id - The ID of the task to update.
 * @param {Array} tasks - The array of tasks to update.
 */
function updateTaskStatus(id, tasks) {
  // Check the prefix of the task ID and update its status accordingly
  if (id.slice(0, 2) === "TD") {
    tasks.status = "todo";
  } else if (id.slice(0, 2) === "IP") {
    tasks.status = "inProgress";
  } else if (id.slice(0, 2) === "AF") {
    tasks.status = "awaitFeedback";
  } else if (id.slice(0, 2) === "DN") {
    tasks.status = "done";
  }
  saveTasksToStorage();
}

/**
 * Renders options for moving a task that is already marked as done.
 * @param {Array} tasks - The array of tasks.
 * @param {number} i - The index of the task to render options for.
 * @param {string} trueID - The ID of the container element where options will be rendered.
 */
function renderDoneTaskOptions(tasks, i, trueID) {
  /**
   * If the task status is "done", renders options for moving the task back to different statuses.
   * @param {string} tasks[i].status - The status of the task.
   * @param {string} tasks[i].id - The ID of the task.
   */
  if (tasks[i].status === "done") {
    document.getElementById(trueID).innerHTML =
      '<div id="TD' +
      tasks[i].id +
      '" class="moveToDivs">To Do</div>' +
      '<div id="IP' +
      tasks[i].id +
      '" class="moveToDivs">In progress</div>' +
      '<div id="AF' +
      tasks[i].id +
      '" class="moveToDivs">Await feedback</div>' +
      '<div id="CN' +
      tasks[i].id +
      '" class="moveToDivs" style="background-color:red;color:white;">Cancel</div>';
  }
}

/**
 * Renders options for moving a task that is awaiting feedback.
 * @param {Array} tasks - The array of tasks.
 * @param {number} i - The index of the task to render options for.
 * @param {string} trueID - The ID of the container element where options will be rendered.
 */
function renderAwaitFeedbackTaskOptions(tasks, i, trueID) {
  /**
   * If the task status is "awaitFeedback", renders options for moving the task to different statuses.
   * @param {string} tasks[i].status - The status of the task.
   * @param {string} tasks[i].id - The ID of the task.
   */
  if (tasks[i].status === "awaitFeedback") {
    document.getElementById(trueID).innerHTML =
      '<div id="TD' +
      tasks[i].id +
      '" class="moveToDivs">To Do</div>' +
      '<div id="IP' +
      tasks[i].id +
      '" class="moveToDivs">In Progress</div>' +
      '<div id="DN' +
      tasks[i].id +
      '" class="moveToDivs">Done</div>' +
      '<div id="CN' +
      tasks[i].id +
      '" class="moveToDivs" style="background-color:red;color:white;">Cancel</div>';
  }
}

/**
 * Renders options for moving a task that is in progress.
 * @param {Array} tasks - The array of tasks.
 * @param {number} i - The index of the task to render options for.
 * @param {string} trueID - The ID of the container element where options will be rendered.
 */
function renderInProgressTaskOptions(tasks, i, trueID) {
  /**
   * If the task status is "inProgress", renders options for moving the task to different statuses.
   * @param {string} tasks[i].status - The status of the task.
   * @param {string} tasks[i].id - The ID of the task.
   */
  if (tasks[i].status === "inProgress") {
    document.getElementById(trueID).innerHTML =
      '<div id="TD' +
      tasks[i].id +
      '" class="moveToDivs">To Do</div>' +
      '<div id="AF' +
      tasks[i].id +
      '" class="moveToDivs">Await feedback</div>' +
      '<div id="DN' +
      tasks[i].id +
      '" class="moveToDivs">Done</div>' +
      '<div id="CN' +
      tasks[i].id +
      '" class="moveToDivs" style="background-color:red;color:white;">Cancel</div>';
  }
}

/**
 * Renders options for moving a task that is in the "To Do" status.
 * @param {Array} tasks - The array of tasks.
 * @param {number} i - The index of the task to render options for.
 * @param {string} trueID - The ID of the container element where options will be rendered.
 */
function renderToDoTaskOptions(tasks, i, trueID) {
  /**
   * If the task status is "todo", renders options for moving the task to different statuses.
   * @param {string} tasks[i].status - The status of the task.
   * @param {string} tasks[i].id - The ID of the task.
   */
  if (tasks[i].status === "todo") {
    document.getElementById(trueID).innerHTML =
      '<div id="IP' +
      tasks[i].id +
      '" class="moveToDivs"><span>In progress</span></div>' +
      '<div id="AF' +
      tasks[i].id +
      '" class="moveToDivs">Await feedback</div>' +
      '<div id="DN' +
      tasks[i].id +
      '" class="moveToDivs">Done</div>' +
      '<div id="CN' +
      tasks[i].id +
      '" class="moveToDivs" style="background-color:red;color:white;">Cancel</div>';
  }
}

/**
 * Iterates through the tasks array to find the index of the task with the specified ID.
 * @param {string} tasks[i].id - The ID of the current task being checked.
 */
function findTaskIndexById(id, tasks) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === id) {
      return i;
    }
  }
  return -1; // Return -1 if the task with the specified id is not found
}
