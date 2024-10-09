
/**
 * Prepares the edit task form by generating the HTML and appending it to the display area.
 */
function prepareEditForm() {
  const displayArea = document.getElementById("editTaskDisplay");
  if (displayArea) {
    const formHtml = generateEditTaskFormHtml();
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = formHtml.trim();
    const formElement = tempDiv.firstElementChild;

    displayArea.innerHTML = "";
    displayArea.appendChild(formElement);
  }
}

/**
 * Toggles the view between the edit task form and the big task box.
 */
function toggleView() {
  const container = document.getElementById("editTaskBoxContainer");
  const bigTaskBoxContainer = document.getElementById("bigTaskBoxContainer");

  if (container && bigTaskBoxContainer) {
    container.style.display = "block";
    bigTaskBoxContainer.style.display = "none";
  }
}

/**
 * Initializes the edit form by loading contacts, binding events, and populating the form with current task values.
 */
function initializeEditForm() {
  searchContacts();
  prepareEditForm();
  toggleView();

  const form = document.getElementById("editTask");
  if (form) {
    form.classList.remove("slide-in", "slide-out");
  }
  loadContactsForForm();
  setTimeout(() => {
    const currentTask = tasks.find(
      (task) => task.id.toString() === currentTaskId
    );
    if (currentTask) {
      showCurrentValuesFromTask(currentTask);
    }
  }, 100);
  bindCloseEditTaskButton();
}

/**
 * Toggles the display between the edit task form and the big task box.
 */
function toggleDisplayForEdit() {
  initializeEditForm();
}
/**
 * Fills the edit task form with the current values of the selected task.
 * @param {object} currentTask - The task currently being edited.
 */
function showCurrentValuesFromTask(currentTask) {
  document.getElementById("idTitleInputAddTask").value = currentTask.title;
  document.getElementById("idDescriptionAddTask").value = currentTask.description;
  updateSelectedContactsForTask(currentTask);
  document.getElementById("idTitleDateAddTask").value = formatDueDateForInput(
    currentTask.dueDate
  );
  setActivePriorityButton(currentTask.priority);

  const categorySelect = document.getElementById("idSelectCategoryAddTask");
  if (categorySelect) {
    categorySelect.value = currentTask.category;
    
    // Ensure currentTask.subtasks is an array, if not, set it to an empty array
    subtasks = Array.isArray(currentTask.subtasks)
      ? currentTask.subtasks.map((subtask) => subtask.text)
      : [];
    
    updateSubtaskList();
  }
}

/**
 * Sets up the edit functionality for the big task box.
 */
function editBigBoxTask() {
  const editFooter = document.querySelector(".editBigBoxFooter");  
  if (editFooter) {
    editFooter.addEventListener("click", function () {
     toggleDisplayForEdit();
      const currentTask = tasks.find(
        (task) => task.id.toString() === currentTaskId );
      if (currentTask) {
        setTimeout(() => {
          showCurrentValuesFromTask(currentTask);
          updateSelectedContactsForTask(currentTask);
        }, 0);}
      setupEditTaskButton();
    });
  }
}

/**
 * Sets up the edit task button to commit changes when clicked.
 */
 function setupEditTaskButton() {
  const editTaskButton = document.getElementById("footerEditTask");
  if (editTaskButton) {
    editTaskButton.addEventListener("click", async function () {
      await commitEditTask();
    });
  } else {
    console.log("Edit-Button wurde nicht gefunden");
  }
}

/**
 * Commits the edits made to a task and updates the display.
 */
async function commitEditTask() {
  if (!validateCurrentTaskId()) {
    return;
  }
  await saveUpdatedTask();
  await updateDisplayAfterEdit();
  await initPage();
}

/**
 * Validates if the current task ID is set.
 * @returns {boolean} - True if the current task ID is valid, false otherwise.
 */
function validateCurrentTaskId() {
  if (currentTaskId === null) {
    return false;
  }
  return true;
}

/**
 * Updates the task display after editing a task.
 */
async function updateDisplayAfterEdit() {
  const editTaskBoxContainer = document.getElementById("editTaskBoxContainer");
  const bigTaskBoxContainer = document.getElementById("bigTaskBoxContainer");
  if (!editTaskBoxContainer || !bigTaskBoxContainer) {
    console.log("Container nicht gefunden.");
    return;}
  const currentTask = tasks.find(
    (task) => task.id.toString() === currentTaskId );
  if (!currentTask) {
    console.log("Aktualisierter Task nicht gefunden.");
    return; }
  updateBigTaskBoxContainer(currentTask, bigTaskBoxContainer);
  toggleContainersVisibility(editTaskBoxContainer, bigTaskBoxContainer);
}

/**
 * Updates the big task box container with the current task's details.
 * @param {object} currentTask - The task currently being edited.
 * @param {HTMLElement} container - The container element for the big task box.
 */
function updateBigTaskBoxContainer(currentTask, container) {
  const subtasksHtml = createSubtasksHtml(currentTask.subtasks, currentTaskId);
  const bigTaskBoxHtml = showBigTaskPopupHtmlTemplate(
    currentTask,
    subtasksHtml
  );
  container.innerHTML = bigTaskBoxHtml;
}

/**
 * Toggles the visibility of the edit task and big task box containers.
 * @param {HTMLElement} editContainer - The container for the edit task form.
 * @param {HTMLElement} bigTaskContainer - The container for the big task box.
 */
function toggleContainersVisibility(editContainer, bigTaskContainer) {
  editContainer.style.display = "none";
  bigTaskContainer.style.display = "block";
}

/**
 * Saves the updated task to the task list.
 */
async function saveUpdatedTask() {
  const currentTaskIndex = tasks.findIndex(
    (task) => task.id.toString() === currentTaskId );
  if (currentTaskIndex === -1) {
    console.error(
      "Task mit der ID " + currentTaskId + " wurde nicht gefunden." );
    return;
  }
  const updatedTaskData = getFormData();
  const updatedContacts = getAssignedContactsBadges();
  tasks[currentTaskIndex] = { ...tasks[currentTaskIndex], ...updatedTaskData, assignedContactsBadges: updatedContacts,};
  await saveTasksToStorage();
}

/**
 * Updates the selected contacts for the current task.
 * @param {object} task - The task whose contacts are being updated.
 */
function updateSelectedContactsForTask(task) {
  selectedContacts = [];
  const contactLines = document.querySelectorAll(".contact-line");

  contactLines.forEach((line) => {
    const contactName = line.querySelector(".contact-name").textContent;

    // Check if assignedContactsBadges exists and is an array
    if (Array.isArray(task.assignedContactsBadges) && 
        task.assignedContactsBadges.some((contact) => contact.name === contactName)) {
      addedContactToTask(line);
    } else {
      removeContactFromTask(line);
    }
  });

  updateAddedContactsDisplay();
}

/**
 * Formats a date string for input fields.
 * @param {string} dateString - The date string to format.
 * @returns {string} - The formatted date string.
 */
function formatDueDateForInput(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Sets the active priority button based on the task's priority.
 * @param {string} priority - The priority level of the task.
 */
function setActivePriorityButton(priority) {
  resetAllButtons();
  let buttonId;
  switch (priority) { case "Urgent": buttonId = "urgentButton";
      break;
    case "Medium": buttonId = "mediumButton";
      break; case "Low": buttonId = "lowButton";
      break;
    default:
      return;
  }
  const buttonToActivate = document.getElementById(buttonId);
  if (buttonToActivate) {
    SelectedButtonStyle(buttonToActivate);
  }
}

/**
 * Binds the close button functionality for the edit task form.
 */
function bindCloseEditTaskButton() {
  const closeEditTaskButton = document.querySelector(".closeEditTask");
  if (closeEditTaskButton) {
    closeEditTaskButton.addEventListener("click", handleCloseEditTask);
  }
}

/**
 * Handles the closing of the edit task form.
 */
function handleCloseEditTask() {
  const editTaskBoxContainer = document.getElementById("editTaskBoxContainer");
  const bigTaskBoxContainer = document.getElementById("bigTaskBoxContainer");
  if (editTaskBoxContainer && bigTaskBoxContainer) {
    editTaskBoxContainer.style.display = "none";
    bigTaskBoxContainer.style.display = "block";
  }
}

/**
 * Closes the edit task form when the close button is clicked.
 */
function closeEditTask() {
  const closeEditTaskButton = document.querySelector(".closeEditTask");
  if (closeEditTaskButton) {
    closeEditTaskButton.addEventListener("click", function () {
      const editTaskBoxContainer = document.getElementById(
        "editTaskBoxContainer" );
      const bigTaskBoxContainer = document.getElementById(
        "bigTaskBoxContainer");
      if (editTaskBoxContainer && bigTaskBoxContainer) {
        editTaskBoxContainer.style.display = "none";
        bigTaskBoxContainer.style.display = "block"; }
    });
  }
}

