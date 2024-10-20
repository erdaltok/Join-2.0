let tasks = [];
let selectedContacts = [];
let subtasks = [];
let totalSubtasks = 0;
let completedSubtasks = 0;
let currentTaskId = null;
let fromAddTask = false;
let newTaskStatus = "todo";

/**
 * Initializes the page by loading tasks from Firebase, rendering them, and updating task counts.
 */
async function initPage() {
  try {
    await loadTasksFromStorage(); // Änderungen: Verwendung von Firebase statt getItem()
    renderTasks();
    updateTaskCounts();
    await includeHTML();
    setActiveLink();
  } catch (error) {
    console.error("Fehler beim Initialisieren der Seite:", error);
  }
}

/**
 * Saves the current state of tasks to Firebase.
 */
async function saveTasksToStorage() {
  try {
    await putData("tasks", tasks); 
  } catch (error) {
    console.error("Fehler beim Speichern der Tasks:", error);
  }
}

/**
 * Loads tasks from Firebase and updates the task list.
 * Änderungen: Die Daten werden nun mit Firebase geladen, statt über getItem.
 */
async function loadTasksFromStorage() {
  try {
    const loadedTasks = await loadData("tasks");
    if (!loadedTasks) {
      tasks = [];
      return;
    }
    tasks = Object.values(loadedTasks);
  } catch (error) {
    console.error("Fehler beim Laden der Tasks:", error);
  }
}

/** 
 * Renders all tasks on the board by iterating through each task status category.
 */
function renderTasks() {
  if (!document.getElementById("todo")) {
    return;
  }
  clearColumns();
  renderTaskBoxes();
  attachTaskBoxListeners();  
  
  document.querySelectorAll(".moveTaskToAnotherCategory").forEach((box) => {
    box.addEventListener("click", handleMoveTaskToAnotherCategory);
  });
}

/** 
 * Renders all tasks on the board by iterating through each task status category.
 */
function clearColumns() {
  ["todo", "inProgress", "awaitFeedback", "done"].forEach((columnId) => {
    const column = document.getElementById(columnId);
    if (column) {
      column.innerHTML = "";
    }
  });
}

/** 
 * Renders all tasks on the board.
 */
function renderTaskBoxes() {
  tasks.forEach((task) => {
    const columnId = task.status || "todo";
    addTaskToBoard(task, columnId);
  });
}

/** 
 * Attach eventlisteners.
 */
function attachTaskBoxListeners() {
  document.querySelectorAll(".task-small-box").forEach((box) => {
    box.addEventListener("click", function (event) {
      event.stopPropagation();
      const taskId = this.id;
      showBigTaskBox(taskId);      
    });
  });
}

/** 
 * Function to render task options for different categories
 */

function renderTaskOptions(tasks, index, trueID, renderFunction) {
  renderFunction(tasks, index, trueID);
}

/** 
* Function to handle click event for moving task to different category
*/
function handleMoveTaskToAnotherCategory(event) {
  event.stopPropagation();
  const trueID = this.id.slice(4);
  let index = tasks.findIndex(task => task.id == trueID);
  if (index === -1) { console.log("Task not found!"); return; }
  renderTaskOptions(tasks, index, trueID, renderToDoTaskOptions);
  renderTaskOptions(tasks, index, trueID, renderInProgressTaskOptions);
  renderTaskOptions(tasks, index, trueID, renderAwaitFeedbackTaskOptions);
  renderTaskOptions(tasks, index, trueID, renderDoneTaskOptions);
  document.querySelectorAll(".moveToDivs").forEach((box) => {
    box.addEventListener("click", handleMoveToDivs);
  });
}

/** 
* Function to handle click event for moving task to a specific category
*/
function handleMoveToDivs(event) {
  event.stopPropagation();
  event.preventDefault();
  let trueID = this.id.slice(2);
  let index = tasks.findIndex(task => task.id == trueID);
  if (index === -1) {
    console.log("Task not found!");
    return;
  }
  updateTaskStatus(this.id, tasks[index]);
  renderTasks();
}

/** 
 * Retrieves the image source for the active priority button.
 * @returns {string} The source of the image for the active priority button.
 */
function getActivePriorityImage() {
  const priorityButtons = document.querySelectorAll(".prioButtons");
  for (const button of priorityButtons) {
    if (isButtonActive(button)) {
      return getDefaultImageSrc(button.id);
    }
  }
  return "";
}

/** 
 * Gets the active priority level from the selected priority button.
 * @returns {string} The priority level of the active button.
 */
function getActivePriority() {
  const activeButton = document.querySelector(".prioButtons.active");
  return activeButton ? activeButton.getAttribute("data-priority") : "Standard";
}

/** 
 * Generates HTML badges for assigned contacts.
 * @returns {Array} An array of HTML strings representing contact badges.
 */
function getAssignedContactsBadges() {
  return selectedContacts.map((contact) => {
    const name = contact.querySelector(".contact-name").textContent;
    const initials = getInitials(name);
    const firstLetter = getFirstLetter(name);
    const initialColor = getLetterColor(firstLetter);
    return { badgeHtml: `<div class="initial" style="background-color: ${initialColor};">${initials}</div>`, name, };
  });
}

/** 
 * Collects subtasks from the subtask list element.
 * @returns {Array} An array of subtask objects.
 */
function getSubtasks() {
  const subtaskListElement = document.getElementById("addedSubstaskList");
  const subtaskElements = subtaskListElement.querySelectorAll("li");
  const subtasks = Array.from(subtaskElements).map((subtaskElement) => {
    return {
      text: subtaskElement.querySelector("span").textContent.trim(),
      completed: false, 
    };
  });
  return subtasks;
}

/** * Adds a task to a specific column on the board.
 * @param {Object} task The task object to be added.
 * @param {string} columnId The ID of the column where the task should be added.
 */
function addTaskToBoard(task, columnId) {
  const column = document.getElementById(columnId);
  if (column) {
    const taskHtml = createTaskHtml(
      task,
      getCategoryBackgroundColor(task.category)
    );
    column.insertAdjacentHTML("beforeend", taskHtml);
  }  
}

/** 
 * Formats a date string to a more readable format.
 * @param {string} dateString The date string to format.
 * @returns {string} Formatted date string.
 */
function formatDueDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/** 
 * Checks if a category is selected in the task form.
 * @returns {boolean} True if a category is selected, false otherwise.
 */
function isCategorySelected() {
  const categorySelect = document.getElementById("idSelectCategoryAddTask");
  const selectedCategory = categorySelect.value;
  const warningDiv = categorySelect.nextElementSibling;
  if ( selectedCategory === "Technical Task" ||
    selectedCategory === "User Story") {
    categorySelect.style.borderColor = ""; 
    warningDiv.style.display = "none";
    return true;} else {
    categorySelect.style.borderColor = "red";
    warningDiv.style.display = "block";
    return false;
  }
}

/** 
 * Gets the background color associated with a task category.
 * @param {string} category The category of the task.
 * @returns {string} The background color for the given category.
 */
function getCategoryBackgroundColor(category) {
  switch (category) {
    case "Technical Task":
      return "#1FD7C1";
    case "User Story":
      return "#0038FF";
    default:
      return "#StandardFarbcode";
  }
}

/** 
 * Changes the style of a selected priority button.
 * @param {HTMLElement} selectedButton The button element to change the style of.
 */
function changeButtonStyle(selectedButton) {
  if (isButtonActive(selectedButton)) {
    resetButtonStyle(selectedButton);
  } else {
    resetAllButtons();
    SelectedButtonStyle(selectedButton);
  }
}

/** 
 * Checks if a button is currently active.
 * @param {HTMLElement} button The button to check.
 * @returns {boolean} True if the button is active, false otherwise.
 */
function isButtonActive(button) {
  const isActive = button.classList.contains("active");
  return isActive;
}

/** 
 * Resets the style of a priority button to its default state.
 * @param {HTMLElement} button The button to reset.
 */
function resetButtonStyle(button) {
  button.classList.remove("active");
  button.style.backgroundColor = "white";
  button.style.color = "black";
  const originalImgSrc = getDefaultImageSrc(button.id);
  button.querySelector("img").src = originalImgSrc;
  button.style.border = "1px solid rgba(0, 0, 0, 0.20)";
}

/** * Resets the style of all priority buttons to their default state.*/
function resetAllButtons() {
  document.querySelectorAll(".prioButtons").forEach(resetButtonStyle);
}

/** 
 * Applies the selected style to a priority button.
 * @param {HTMLElement} button The button to apply the style to.
 */
function SelectedButtonStyle(button) {
  button.classList.add("active");
  button.style.backgroundColor = button.getAttribute("data-color");
  button.style.color = button.getAttribute("data-text-color");
  button.querySelector("img").src = button.getAttribute("data-img-src");
  button.style.border = "none";
}

/** 
 * Gets the default image source for a given priority button ID.
 * @param {string} buttonId The ID of the priority button.
 * @returns {string} The default image source for the button.
 */
function getDefaultImageSrc(buttonId) {
  switch (buttonId) {
    case "urgentButton":
      return "/Join/img/Urgent.png";
    case "mediumButton":
      return "/Join/img/Medium.png";
    case "lowButton":
      return "/Join/img/Low.png";
    default:
      return "";
  }
}

/**
 * * Updates the display of added contacts in the task form.
 * */
function updateAddedContactsDisplay() {
  const addedContactsContainer = document.getElementById(
    "addedContactsProfilBadges"
  );
  if (addedContactsContainer) {
    addedContactsContainer.innerHTML = ""; 
  }
}

/**
 * Resets the selected contacts to their default state.
 * */
function resetSelectedContacts() {
  selectedContacts.forEach((contactLine) => {
    contactLine.style.backgroundColor = "";
    contactLine.querySelector(".contact-name").style.color = "";
    const imgElement = contactLine.querySelector("img");
    imgElement.src = "/Join/img/check-button-default.svg";
    contactLine.classList.remove("selected");
  });

  selectedContacts = [];
  loadContactsForForm();
}

/** 
 * Sets up event listeners for the clear button in the task form.
 * */
document.addEventListener("DOMContentLoaded", function () {
  const clearButton = document.querySelector(".footerButtonClear");
  if (clearButton) {
    clearButton.addEventListener("click", function () {
      resetTaskForm();
    });
  }
});
document.addEventListener("DOMContentLoaded", function () {
  const clearButtons = document.querySelectorAll(".footerButtonClear");
  clearButtons.forEach((button) => {
    button.addEventListener("mouseover", function () {
      const icon = this.querySelector(".clearIconFooter");
      if (icon) {
        icon.src = "/Join/img/clear-icon-footer-board-addTask-blue.svg";
      } });
    button.addEventListener("mouseout", function () {
      const icon = this.querySelector(".clearIconFooter");
      if (icon) { icon.src = "/Join/img/clear-icon-footer-board-addTask.svg"; }
    });
  });  
});

document.addEventListener("DOMContentLoaded", initPage);

/**
 * Initializes the page and sets the active link based on the current page.
 * Adds a class 'loaded' to the body with a delay for smooth page load effect.
 */
function smoothPageLoad() {
  const currentPage = window.location.pathname
    .split("/")
    .pop()
    .replace(".html", "");

  switch (currentPage) {
    case "summary":
      init("summary");
      break;
    case "board":
      init("board");
      break;
    case "addTask":
      init("addTask");
      break;
    case "contacts":
      init("Contacts");
      break;
    case "privacy":
      init("privacy");
      break;
    case "legal":
      init("legal");
      break;
    case "signup":
      init("signup");
      break;
  }

  setTimeout(() => {
    document.body.classList.add("loaded");
  }, 50);

  setActiveLink(); 
}

/**
 * Adds a delay after page load and then sets the active link in the menu
 * based on the current page URL.
 */
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    setActiveLink(); 
  }, 500); 
});

/**
 * Highlights the active menu link by checking the current page's URL.
 * Resets the background color for all links, and highlights the one that matches the current page.
 */
function setActiveLink() {
  const links = document.querySelectorAll(".menu-links");
  const currentPage = window.location.pathname
    .split("/")
    .pop()
    .replace(".html", "");

  links.forEach((link) => {
    link.style.backgroundColor = ""; 

    if (link.getAttribute("href").includes(currentPage)) {
      link.style.backgroundColor = "rgba(9, 25, 49, 1)";
    }
  });
}




