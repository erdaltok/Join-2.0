// SUBTASKS IN ADD TASK BOARD PAGE

/**
 * Opens the subtask editing interface.
 * Hides the subtask image and displays the close/check subtask division.
 */
function openSubtasks() {
  const subtaskImage = document.querySelector(".subtaskImage");
  if (subtaskImage) {
    subtaskImage.style.display = "none";
  }
  const closeCheckSubtaskDiv = document.querySelector(".closeCheckSubstask");
  if (closeCheckSubtaskDiv) {
    closeCheckSubtaskDiv.style.display = "flex";
  }
}

/**
 * Closes the subtask editing interface.
 * Displays the subtask image and hides the close/check subtask division.
 */
function closeSubtasks() {
  const subtaskImage = document.querySelector(".subtaskImage");
  if (subtaskImage) {
    subtaskImage.style.display = "block";
  }
  const closeCheckSubtaskDiv = document.querySelector(".closeCheckSubstask");
  if (closeCheckSubtaskDiv) {
    closeCheckSubtaskDiv.style.display = "none";
  }
}

/**
 * Enables editing mode for a subtask.
 * @param {Event} event - The event object triggered by the user action.
 */
function editSubtask(event) {
  const liElement = event.target.closest("li");
  const span = liElement.querySelector("span");
  const editDeleteDiv = liElement.querySelector(".editDeleteSubtask");
  const confirmEditDiv = liElement.querySelector(".confirmEditSubtask");
  if (!span.getAttribute("contenteditable") || span.getAttribute("contenteditable") === "false") {
    // Set the initial value in the dataset attribute
    span.dataset.originalText = span.textContent.trim();
    // Enable editing mode
    span.setAttribute("contenteditable", "true");
    span.focus();
    editDeleteDiv.style.display = "none";
    confirmEditDiv.style.display = "flex";
  }
}

/**
 * Confirms the edit of a subtask and updates the subtasks array.
 * @param {Event} event - The event object triggered by the user action.
 */
function confirmEditSubtask(event) {
  const liElement = event.target.closest("li");
  if (!liElement) return;
  const span = liElement.querySelector("span");
  const editedText = span.textContent.trim(); // Get the edited text
  // Find the index of the edited text in the subtasks array
  const originalText = span.dataset.originalText;
  const index = subtasks.indexOf(originalText);
  if (index !== -1) {
    // Update the subtask text in the subtasks array
    subtasks[index] = editedText;
  }
  // Hide editing UI
  span.setAttribute("contenteditable", "false");
  liElement.querySelector(".editDeleteSubtask").style.display = "flex";
  liElement.querySelector(".confirmEditSubtask").style.display = "none";
}

/**
 * Adds a new subtask to the subtasks array and updates the list display.
 */
function addNewSubtask() {
  const inputField = document.getElementById("inputFieldSubtaskId");
  const subtaskText = inputField.value.trim();
  if (subtaskText) {
    subtasks.push(subtaskText);
    updateSubtaskList();
    totalSubtasks = subtasks.length;
    updateProgressBar();
    inputField.value = "";    
    toggleSubtaskDisplay();
    inputField.innerHTML = "";
  }
}

/**
 * Toggles the display of the subtask editing interface.
 */
function toggleSubtaskDisplay() {
  const closeCheckSubstask = document.querySelector(".closeCheckSubstask");
  const subtaskImage = document.querySelector(".subtaskImage");
  if (closeCheckSubstask && subtaskImage) {
    closeCheckSubstask.style.display = "none";
    subtaskImage.style.display = "block";
  }
}

/**
 * Updates the subtask list in the DOM.
 */
function updateSubtaskList() {
  const listElement = document.getElementById("addedSubstaskList");
  listElement.innerHTML = subtasks.map(createSubtaskHtml).join("");
}

/**
 * Deletes a subtask from the list based on the event triggered by the user.
 * @param {Event} event - The event object triggered by the user action.
 * @returns {void}
 */
function deleteSubtask(event) {
  const liElement = event.target.closest("li");
  if (!liElement) return;
  const span = liElement.querySelector("span");
  const editedText = span.textContent.trim();
  const index = subtasks.indexOf(editedText);
  if (index !== -1) {
    subtasks.splice(index, 1);
  }
  liElement.remove();
  updateSubtaskList();
}

/**
 * Resets the subtasks when the form is closed or a new task is created.
 * This function clears the input field, resets the subtask array,
 * and updates the UI components related to subtasks.
 * 
 * @returns {void}
 */
function resetSubtasks() {
  const inputField = document.getElementById("inputFieldSubtaskId");
  if (inputField) {
    inputField.value = ""; 
  }
  subtasks = [];
  updateSubtaskList();
  toggleSubtaskDisplay();
  completedSubtasks = 0;
  totalSubtasks = 0;
  updateProgressBar();
}

/**
 * Updates the progress bar and subtask counter based on the current state.
 */
function updateProgressBar() {
  const progress =
    totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
  document.querySelectorAll(".progress-bar").forEach((bar) => {
    bar.style.setProperty("--width", progress);
  });
  document.querySelectorAll(".counter-subtasks").forEach((counter) => {
    counter.textContent = `${completedSubtasks}/${totalSubtasks} Subtasks`;
  });
}
