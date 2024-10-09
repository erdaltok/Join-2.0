/**
 * Opens the form to add a new task with a specified status.
 * @param {string} status - The initial status of the new task (default: "todo").
 */
async function openNewTaskBoard(status = "todo") {
  await prepareTaskForm(status);
  showTaskFormPopup();
}

/**
 * Prepares the form to add a new task with a specified status.
 * @param {string} status - The initial status of the new task (default: "todo").
 */
async function prepareTaskForm(status = "todo") {
  await searchContacts(); 
  newTaskStatus = status;
  let importAddTaskForm = document.getElementById("importAddTaskForm");
  if (importAddTaskForm) {
    const formHtml = generateAddTaskFormHtml();
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = formHtml.trim();
    const formElement = tempDiv.firstElementChild;

    importAddTaskForm.innerHTML = "";
    importAddTaskForm.appendChild(formElement);

    loadContactsForForm();
    setupClearButtonListeners();
  }
}

/**
 * Displays the task form popup.
 */
function showTaskFormPopup() {
  let popup = document.querySelector(".addTaskFormPopUp");
  if (popup) {
    popup.style.display = "block";
    let popUpContent = popup.querySelector(".addTaskPopUp");
    if (popUpContent) {
      popUpContent.classList.add("slide-in");
      popUpContent.classList.remove("slide-out");
    }
  }
  document.documentElement.style.overflowY = "hidden";
  document.body.style.overflowY = "hidden";
}

/**
 * Closes the task form popup with an animation and resets the form.
 */
function closePopup() {
  let popup = document.querySelector(".addTaskFormPopUp");
  if (popup) {
    let popUpContent = popup.querySelector(".addTaskPopUp");
    if (popUpContent) {
      popUpContent.classList.remove("slide-in");
      popUpContent.classList.add("slide-out");

      popUpContent.addEventListener(
        "animationend",
        function () {
          popup.style.display = "none";
          const importAddTaskForm =
            document.getElementById("importAddTaskForm");
          importAddTaskForm.innerHTML = "";
        },
        { once: true }
      );
    }
  }
}

/**
 * Restores the page's scroll functionality and updates tasks.
 */
function restorePageState() {
  document.documentElement.style.overflowY = "";
  document.body.style.overflowY = "";
  saveTasksToStorage();
  renderTasks();
  initPage();
}

/**
 * Closes the task form and restores the page state.
 */
function closeAddTaskForm() {
  closePopup();
  restorePageState();
  resetSubtasks();
}

/**
 * Handles clicks outside the task form popup to close it.
 * @param {Event} event - The click event.
 */
document.addEventListener("click", function (event) {
  const clickedElement = event.target;
  const popupFlex = document.querySelector(".popupFlex");
  if (
    popupFlex &&
    popupFlex.contains(clickedElement) &&
    !clickedElement.closest(".addTaskPopUp")
  ) {
    closeAddTaskForm();
  }
});

/**
 * Collects form data to create or update a task.
 * @returns {object} - The data collected from the form.
 */
function getFormData() {
  return {
    title: document.getElementById("idTitleInputAddTask").value,
    description: document.getElementById("idDescriptionAddTask").value,
    dueDate: document.getElementById("idTitleDateAddTask").value,
    category: document.getElementById("idSelectCategoryAddTask").value,
    subtasks: getSubtasks(),
    priority: getActivePriority(),
    priorityImage: getActivePriorityImage(),
  };
}

/**
 * Creates a new task or updates an existing one based on the form data.
 */
function createNewTaskOrUpdateExistingTask() {
  if (!isCategorySelected()) {
    return;
  }
  const formData = getFormData();
  const priorityImage = getActivePriorityImage();
  const assignedContactsData = getAssignedContactsBadges();
  const priority = getActivePriority();
  const subtasks = getSubtasks();

  // Check if an existing task needs to be updated or a new one is created
  if (currentTaskId !== null) {
    updateExistingTask(
      formData,
      priorityImage,
      assignedContactsData,
      priority,
      subtasks
    );
  } else {
    // Creating a new task
    const newTask = {
      id: generateUniqueTaskId(), // New unique ID for the task
      ...formData,
      priorityImage,
      priority,
      assignedContactsBadges: assignedContactsData,
      subtasks,
      status: newTaskStatus,
    };
    tasks.push(newTask); // Add new task to tasks array
    addTaskToBoard(newTask, newTask.status || "todo");
  }
  finalizeTaskCreation();
}


/**
 * Creates a new task with the provided data and adds it to the task board.
 * @param {object} formData - Data for the new task.
 * @param {string} priorityImage - URL of the priority image.
 * @param {Array} assignedContactsData - Array of assigned contacts.
 * @param {string} priority - Priority level of the task.
 * @param {Array} subtasks - Array of subtasks.
 */
function generateUniqueTaskId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

function createNewTask(
  formData,
  priorityImage,
  assignedContactsData,
  priority,
  subtasks
) {
  const newTask = {
    id: generateUniqueTaskId(),
    ...formData,
    priorityImage,
    priority,
    assignedContactsBadges: assignedContactsData,
    subtasks,
    status: newTaskStatus,
  };
  tasks.push(newTask);
  addTaskToBoard(newTask, newTask.status || "todo");
  resetTaskForm();
  resetSubtasks();
}

/**
 * Updates an existing task with new data.
 * @param {object} formData - Updated data for the task.
 * @param {string} priorityImage - URL of the priority image.
 * @param {Array} assignedContactsData - Array of assigned contacts.
 * @param {string} priority - Priority level of the task.
 * @param {Array} subtasks - Array of subtasks.
 */
function updateExistingTask(
  formData,
  priorityImage,
  assignedContactsData,
  priority,
  subtasks
) {
  const currentTaskIndex = tasks.findIndex(
    (task) => task.id.toString() === currentTaskId
  );
  if (currentTaskIndex !== -1) {
    tasks[currentTaskIndex] = {
      ...tasks[currentTaskIndex],
      ...formData,
      priorityImage,
      priority,
      assignedContactsBadges: assignedContactsData,
      subtasks,
    };
  }
}

/**
 * Finalizes the task creation process, saves tasks to storage, and resets the form.
 */
async function finalizeTaskCreation() {
  await saveTasksToStorage(); 
  const currentPath = window.location.pathname;
  if (currentPath.includes("board_template.html")) {
    closeAddTaskForm();
  }

  newTaskAddedMessage();
  resetTaskForm();
  currentTaskId = null;

  if (currentPath.includes("addTask_template.html")) {
    setTimeout(() => {
      window.location.href = "board_template.html";
    }, 2000);
  }
}

/**
 * Resets the task form to its default state.
 */
function resetTaskForm() {
  document.getElementById("idTitleInputAddTask").value = "";
  document.getElementById("idDescriptionAddTask").value = "";
  document.getElementById("idTitleSelectContactsAddTask").value = "";
  document.getElementById("idTitleDateAddTask").value = "";
  document.getElementById("idSelectCategoryAddTask").value = "";
  document.getElementById("addedSubstaskList").innerHTML = "";
  document.getElementById("addedSubstaskList").value = "";
  document.getElementById("inputFieldSubtaskId").value = "";
  document.getElementById("inputFieldSubtaskId").innerHTML = "";

  resetAllButtons();
  selectedContacts = [];
  updateAddedContactsDisplay();
  resetSelectedContacts();
  resetSubtasks();
}

/**
 * Displays a message indicating a new task has been added to the board.
 */
function newTaskAddedMessage() {
  let messageBox = document.getElementById("addNewTaskMessage");
  messageBox.innerHTML = `
        <span>Task added to board</span>
        <img src="/Join/img/board-icon-tasl-added-message.svg" alt="" style="margin-left: 10px;">
    `;
  messageBox.style.display = "flex";

  setTimeout(function () {
    messageBox.style.display = "none";
  }, 2000);
}

/**
 * Handles the form submission for creating or updating a task.
 * @param {Event} event - The form submission event.
 */
function handleFormSubmit(event) {
  event.preventDefault();
  createNewTaskOrUpdateExistingTask();
}

/**
 * Handles the form submission specifically from the 'Add Task' section.
 * @param {Event} event - The form submission event.
 */
function handleFormSubmitFromAddTask(event) {
  event.preventDefault();
  fromAddTask = true;
  createNewTaskOrUpdateExistingTask();
  fromAddTask = false;
}

/**
* Searches for contacts based on the entered search text and renders the filtered contacts.
* Changes: Using Firebase instead of `getItem`.
*/
async function searchContacts() {
  try {
    const loadedContacts = await loadData("contacts");
    if (!loadedContacts) {
      contactsLocal = [];
      return;
    }
    contactsLocal = Array.isArray(loadedContacts)
      ? loadedContacts
      : Object.values(loadedContacts); // Change to array.
  } catch (error) {
    console.error("Fehler beim Laden der Kontakte:", error); 
  }

  const searchText = document.getElementById("idTitleSelectContactsAddTask")?.value?.toLowerCase(); 
  if (!searchText) return;

  let names = [];
  for (let i = 0; i < contactsLocal.length; i++) {
    names.push(contactsLocal[i].nameKey);
  }

  const filteredContacts = names.filter((name) => name.toLowerCase().includes(searchText));
  renderFilteredContacts(filteredContacts);
}

/**
 * Renders the filtered contact names by populating the contact list with matching contacts.
 * @param {string[]} filteredContactNames - An array of filtered contact names.
 */
function renderFilteredContacts(filteredContactNames) {
  const listSelectableContacts = document.getElementById("listSelectableContacts");
  const ulElement = listSelectableContacts.querySelector("ul");
  ulElement.innerHTML = "";
  filteredContactNames.forEach((name) => {
    const initials = getInitials(name);
    const firstLetter = getFirstLetter(name);
    const initialColor = getLetterColor(firstLetter);
    const liElement = document.createElement("li");
    liElement.className = "contact-line";
    liElement.innerHTML = loadContactsForFormHtmlTemplate(name, initials, initialColor);
    ulElement.appendChild(liElement);});
  addEventListenersToContactLines();
}




