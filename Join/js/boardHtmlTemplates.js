
// HTML TEMPLATESsrc
/**
 * Generates HTML markup for displaying a task.
 * @param {Object} task - The task object containing details like id, title, description, category, assigned contacts, priority image, and subtasks.
 * @param {string} backgroundColor - The background color for the task category label.
 * @returns {string} HTML markup for the task.
 */
function createTaskHtml(task, backgroundColor) {
  let assignedContactsHtml = "";
  if (Array.isArray(task.assignedContactsBadges)) {assignedContactsHtml = task.assignedContactsBadges
      .map((contactData) => contactData.badgeHtml)
      .join("");}
  const priorityImageHtml = task.priorityImage
    ? `<img  src="${task.priorityImage}" alt="Priority Image">`
    : "";
  const subtasks = task.subtasks || [];
  const totalSubtasks = subtasks.length;
  const completedSubtasks = subtasks.filter(
    (subtask) => subtask.completed).length;
  const progress =
    totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
  const html = `
    <div class="task-small-box" id="${
      task.id
    }" draggable="true" ondragstart="startDragging('${task.id}')">
        <div class="task-small-box-content">
            <div class="category">
                <div class="label-small-box" style="background-color: ${backgroundColor};">
                    <span>${task.category}</span>   
                </div>                 
                    <div class="moveTaskToAnotherCategory" id="move${task.id}">
                        <img src="/Join/img/move-to-icon.png" alt="">          
                    </div>
            </div>
            <div>
                <h1>${task.title}</h1>
                <p id="maxLenghtDescription">${task.description}</p>
            </div>
            <div class="progress-subtasks">
            ${
              totalSubtasks > 0
                ? `
                <div class="progress-bar" style="--width: ${progress}"></div>
                <div class="counter-subtasks">${completedSubtasks}/${totalSubtasks} Subtasks</div>
                `
                : ""
            }
            </div>
            <div class="profilBadges-priority">
               <div class="profil-badges">
                    ${assignedContactsHtml}
                </div>
                <div class="priority-icons">
                ${priorityImageHtml}
                </div>
            </div>
        </div>   
    </div>
  `;
  return html;
}

/**
 * Generates HTML code for an edit task form.
 * @returns {string} HTML code for the edit task form.
 */

function createSubtaskHtml(subtaskText) {
  return `
        <li>
            <span>${subtaskText}
                <div class="editDeleteSubtask">
                    <img src="/Join/img/edit-pen-icon-subtasks.svg" onclick="editSubtask(event)">
                    <img src="/Join/img/divider-icon-subtasks.svg">
                    <img src="/Join/img/delete-icon-subtasks.svg" onclick="deleteSubtask(event)" >
                </div>
                <div class="confirmEditSubtask" contenteditable="false" style="display: none;">
                    <img src="/Join/img/delete-icon-subtasks.svg" onclick="deleteSubtask(event)" >
                    <img src="/Join/img/divider-icon-subtasks.svg">
                    <img src="/Join/img/check-icon-subtasks.svg" onclick="confirmEditSubtask(event)">
                </div>
            </span>
        </li>
    `;
}

/**
 * Generates HTML markup for displaying a big task popup.
 * @param {Object} task - The task object containing details like title, description, due date, priority, category, assigned contacts, and subtasks.
 * @param {string} subtasksHtml - HTML markup for displaying subtasks.
 * @returns {string} HTML markup for the big task popup.
 */
function showBigTaskPopupHtmlTemplate(task, subtasksHtml) {
  let assignedContactsHtml = (task.assignedContactsBadges || [])
    .map((contactData) => {
      return `<li class="contact-line-BigBox">
              <div class="contact-badge-container">
                ${contactData.badgeHtml}
                <span class="contact-name">${contactData.name}</span>
              </div>
            </li>`;
    })
    .join("");

  const categoryColor = getCategoryBackgroundColor(task.category);
  return `
    <div class="BigTaskFormPopUp" id="BigTaskFormPopUp">
        <div class="popupFlex">
            <form class="BigTaskPopUp">
                <div class="BigTaskContent">
                    <div class="category">
                        <div class="label-big-box">
                            <span style="background-color: ${categoryColor};">${
    task.category
  }</span>
                            <img src="/Join/img/close-icon-subtasks.svg" onclick="closeBigTaskBox()">
                        </div>
                    </div>
                    <div class="titleAndDescriptionBigBox">
                        <h1>${task.title}</h1>
                        <p>${task.description}</p>
                    </div>
                    <div class="dueDate">
                        <span>Due date:</span>
                        <p>${formatDueDate(task.dueDate)}</p>
                    </div>
                    <div class="priorityBigBox">
                        <span>Priority:</span>
                        <div class="selectedPriorityBigBox">
                            <p>${task.priority}</p>
                            <img src="${task.priorityImage}" alt="">
                        </div>
                    </div>
                    <div class="assignedBigBox">
                        <span>Assigned To:</span>
                        <div class="listSelectableContactsBigBox">
                            <ul>
                              ${assignedContactsHtml}
                            </ul>
                        </div>
                    </div>
                    <div class="subtasksBigBox">
                        <span>Subtasks:</span>
                        <div class="addedSubstaskList">
                            ${subtasksHtml}
                        </div>
                    </div>
              <div class="footerBigBox">
                <div class="deleteBigBoxFooter" onclick="deleteBigTaskBox()">
                  <div class="icon deleteIcon"></div>
                    <span>Delete</span>
                </div>
                <img src="/Join/img/divider-icon-subtasks.svg" alt="">
                <div class="editBigBoxFooter">
                  <div class="icon editIcon"></div>
                    <span>Edit</span>
                  </div>
              </div>
                </div>
            </form>
        </div>
    </div>
  `;
}

/**
 * Generates HTML markup for displaying contacts in a form template.
 * @param {string} name - The name of the contact.
 * @param {string} initials - The initials of the contact.
 * @param {string} initialColor - The background color for the initials.
 * @returns {string} HTML markup for displaying contacts.
 */
function loadContactsForFormHtmlTemplate(name, initials, initialColor) {
  return `
    <div class="initial initial-margin-small-task" style="background-color: ${initialColor};">${initials}</div>
    <span class="contact-name">${name}</span>
    <img src="/Join/img/check-button-default.svg" alt="">
  `;
}

/**
 * Creates HTML markup for subtasks.
 * @param {Array<{text: string, completed: boolean}>} subtasks - An array of subtasks, each containing text and completion status.
 * @param {string} taskId - The ID of the task associated with the subtasks.
 * @returns {string} HTML markup for displaying subtasks.
 */
function createSubtasksHtml(subtasks, taskId) {
  // Check if subtasks is an array, if not, set it to an empty array
  if (!Array.isArray(subtasks)) {
    subtasks = [];
  }

  return subtasks
    .map(
      (subtask, index) => `
    <div class="subtaskBigBoxContent" data-index="${index}" onclick="toggleSubtaskStatus('${taskId}', ${index})">
      <img src="/Join/img/${
        subtask.completed
          ? "check-button-checked-bigTask"
          : "check-button-default"
      }.svg" alt="">
      <span>${subtask.text}</span>
    </div>
  `
    )
    .join("");
}

/**
 * Generates HTML code for an edit task form.
 * @returns {string} HTML code for the edit task form.
 */

function generateAddTaskFormHtml() {
  return `
    <form class="addTaskPopUp" onsubmit="handleFormSubmit(event)">
        <div class="addTaskLittle">
                <div class="titlePositionLittle">
                    <h1>Add Task</h1>
                    <img src="/Join/img/close-icon-board-addtask.svg" onclick="closeAddTaskForm()">
                </div>
            <div class="formLeftAndRightFlex">

                <div class="formBox">

                    <div class="addTaskLeftLittle">
                        <div class="titleInputAddTaskBoard">
                            <label for="idTitleInputAddTask">Title
                                <p style="color: #FF8190;">*</p>
                            </label>
                            <input class="inputTitleAddTask" id="idTitleInputAddTask" type="text" autocomplete="off"
                                placeholder="Enter a title" required>
                            <div class="requestWarningInputField" style="display: none;">This field is required</div>
                        </div>
                        <div class="titleDescriptionAddTaskBoard">
                            <label for="idDescriptionAddTask">Description
                                <p style="color: #FF8190;">*</p>
                            </label>
                            <textarea class="inputTitleAddTask" id="idDescriptionAddTask" type="text" name="inputDesciption"
                                placeholder="Enter a Description" required></textarea>
                            <div class="requestWarningInputField" style="display: none;">This field is required</div>
                        </div>

                        <div class="titleSelectContactsAddTaskBoard">
                            <label for="idTitleSelectContactsAddTask">Assigned to</label>

                            <input class="inputTitleAddTask inputSelectContact" id="idTitleSelectContactsAddTask" type="text" autocomplete="off"
                                placeholder="Select contacts to assign" onclick="toggleContactList()" onkeyup="searchContacts()">
                        </div>
                        <div id="listSelectableContacts" class="listSelectableContacts" style="display: none;">
                            <ul>
                            </ul>
                        </div>
                        <div class="addedContactsProfilBadges" id="addedContactsProfilBadges" style="display: none;"></div>
                    </div>
                    <div class="dividerLittle"></div>
                    <div class="addTaskRightLittle">
                        <div class="titleDateAddTaskBoard">
                            <label for="idTitleDateAddTask">Due date
                                <p style="color: #FF8190;">*</p>
                            </label>
                            <input class="inputDateAddTask" id="idTitleDateAddTask" type="date" placeholder="tt/mm/jjjj"
                                required>
                            <div class="requestWarningInputField" style="display: none;">This field is required</div>
                        </div>
                        <div class="prioSection">
                            <div class="titlePrioSection">Prio</div>
                            <div class="prioButtonsBox" id="idPrioAddTask">
                                <div class="prioButtons" id="urgentButton" onclick="changeButtonStyle(this)"
                                    data-color="#FF3D00" data-text-color="white"
                                    data-img-src="/Join/img/prio-icon-small-task-white.svg" data-priority="Urgent">
                                    Urgent
                                    <img src="/Join/img/Urgent.png">
                                </div>
                                <div class="prioButtons active" id="mediumButton" onclick="changeButtonStyle(this)"
                                    data-color="#FFA800" style="background-color: rgb(255, 168, 0); color: white;" data-text-color="white" data-img-src="/Join/img/prio-icon-medium-white.svg"
                                    data-priority="Medium" >
                                    Medium
                                    <img src="/Join/img/prio-icon-medium-white.svg">
                                </div>
                                <div class="prioButtons" id="lowButton" onclick="changeButtonStyle(this)" data-color="#7AE229"
                                    data-text-color="white" data-img-src="/Join/img/prio-icon-low-white.svg" data-priority="Low">
                                    Low
                                    <img src="/Join/img/Low.png">
                                </div>
                            </div>
                        </div>
                        <div class="categorySection">
                            <div class="titleCategoryAddTask">
                                <label for="idSelectCategoryAddTask">Category
                                    <p style="color: #FF8190;">*</p>
                                </label>
                                <select id="idSelectCategoryAddTask" class="selectContainerOv selectArrow" name="category"
                                    required="">
                                    <option disabled selected="" hidden="">Select task category</option>
                                    <option value="Technical Task">Technical Task</option>
                                    <option value="User Story">User Story</option>
                                </select>
                                <div class="requestWarningInputField" style="display: none;">This field is required</div>
                            </div>
                        </div>
                        <div class="subtaskSection">
                            <div class="titleSubtaskAddTask">
                                <label for="inputFieldSubtaskId">Subtask</label>
                                <div class="subtaskBox">
                                    <input onclick="openSubtasks()" class="inputTitleAddTask" id="inputFieldSubtaskId"
                                        type="text" autocomplete="off" placeholder="Add new subtask">
                                    <img onclick="openSubtasks()" class="subtaskImage" src="/Join/img/subtasksIcon.png">
                                    <div class="closeCheckSubstask" style="display: none;">
                                        <img onclick="closeSubtasks()" src="/Join/img/close-icon-subtasks.svg">
                                        <img src="/Join/img/divider-icon-subtasks.svg">
                                        <img onclick="addNewSubtask()" src="/Join/img/check-icon-subtasks.svg">
                                    </div>
                                </div>
                                <ul id="addedSubstaskList" class="addedSubstaskList"></ul>
                            </div>
                        </div>
                        <div class="bottomSpacer" ></div>
                    </div>

                    </div>

                <div class="editFooter">
                    <!-- <p class="requiredFooter" style="color: #FF8190;">*<span style="color: #000;">This field is required</span></p> -->
                    <div class="footerButtonsAddTask">
                        <button id="ClearButton" class="footerButtonClear" type="button">Clear
                            <img src="/Join/img/clear-icon-footer-board-addTask.svg" class="clearIconFooter">
                        </button>
                        <button id="createTaskFooterButton" class="footerButtonCreateTask">Create Task
                            <img src="/Join/img/check-icon-footer-board-addTask.svg" alt="">
                        </button>
                        <button class="footerEditTask" type="submit" style="display: none;">OK
                            <img src="/Join/img/check-icon-footer-board-addTask.svg" alt="">
                        </button>
                    </div>
                </div>



                </div>
               
            </div>
        </form>
  `;
}
/**
 * Generates HTML code for an edit task form.
 * @returns {string} HTML code for the edit task form.
 */

function generateEditTaskFormHtml() {
  return `
<form class="editPopUp" onsubmit="handleFormSubmit(event)" id="editTask">
    <div class="EditAddTaskLittle">
        <div class="editTitle">
            <img src="/Join/img/close-icon-board-addtask.svg" class="closeEditTask">
        </div>
        <div class="editLeftAndRight">
            <div class="editLeft">
                <div class="titleInputAddTaskBoard">
                    <label for="idTitleInputAddTask">Title
                        <p style="color: #FF8190;">*</p>
                    </label>
                    <input class="inputTitleAddTask" id="idTitleInputAddTask" type="text" autocomplete="off"
                        placeholder="Enter a title" required>
                    <div class="requestWarningInputField" style="display: none;">This field is required</div>
                </div>
                <div class="titleDescriptionAddTaskBoard">
                    <label for="idDescriptionAddTask">Description
                        <p style="color: #FF8190;">*</p>
                    </label>
                    <textarea class="inputTitleAddTask" id="idDescriptionAddTask" type="text" name="inputDesciption"
                        placeholder="Enter a Description" required></textarea>
                    <div class="requestWarningInputField" style="display: none;">This field is required</div>
                </div>
                <div class="titleSelectContactsAddTaskBoard">
                    <label for="idTitleSelectContactsAddTask">Assigned to</label>
                    <input class="inputTitleAddTask" id="idTitleSelectContactsAddTask" type="text" autocomplete="off"
                        placeholder="Select contacts to assign" onclick="toggleContactList()" onkeyup="searchContacts()">
                </div>
                <div id="listSelectableContacts" class="listSelectableContacts" style="display: none;">
                    <ul>
                    </ul>
                </div>
                <div class="addedContactsProfilBadges" id="addedContactsProfilBadges" style="display: none;"></div>
            </div>
            <div class="editHideDivider"></div>
            <div class="editRight">
                <div class="editDate">
                    <label for="idTitleDateAddTask">Due date
                        <p style="color: #FF8190;">*</p>
                    </label>
                    <input class="inputDateAddTask" id="idTitleDateAddTask" type="date" placeholder="tt/mm/jjjj"
                        required>
                    <div class="requestWarningInputField" style="display: none;">This field is required</div>
                </div>
                <div class="prioSection">
                    <div class="titlePrioSection">Prio</div>
                    <div class="prioButtonsBox" id="idPrioAddTask">
                        <div class="prioButtons" id="urgentButton" onclick="changeButtonStyle(this)"
                            data-color="#FF3D00" data-text-color="white"
                            data-img-src="/Join/img/prio-icon-small-task-white.svg" data-priority="Urgent">
                            Urgent
                            <img src="/Join/img/Urgent.png">
                        </div>
                        <div class="prioButtons" id="mediumButton" onclick="changeButtonStyle(this)"
                            data-color="#FFA800" data-text-color="white" data-img-src="/Join/img/prio-icon-medium-white.svg"
                            data-priority="Medium">
                            Medium
                            <img src="/Join/img/Medium.png">
                        </div>
                        <div class="prioButtons" id="lowButton" onclick="changeButtonStyle(this)" data-color="#7AE229"
                            data-text-color="white" data-img-src="/Join/img/prio-icon-low-white.svg" data-priority="Low">
                            Low
                            <img src="/Join/img/Low.png">
                        </div>
                    </div>
                </div>
                <div class="categorySection">
                    <div class="titleCategoryAddTask">
                        <label for="idSelectCategoryAddTask">Category
                            <p style="color: #FF8190;">*</p>
                        </label>
                        <select id="idSelectCategoryAddTask" class="selectContainerOv selectArrow" name="category"
                            required="">
                            <option disabled selected="" hidden="">Select task category</option>
                            <option value="Technical Task">Technical Task</option>
                            <option value="User Story">User Story</option>
                        </select>
                        <div class="requestWarningInputField" style="display: none;">This field is required</div>
                    </div>
                </div>
                <div class="subtaskSection">
                    <div class="titleSubtaskAddTask">
                        <label for="inputFieldSubtaskId">Subtask</label>
                        <div class="subtaskBox">
                            <input onclick="openSubtasks()" class="inputTitleAddTask" id="inputFieldSubtaskId"
                                type="text" autocomplete="off" placeholder="Add new subtask">
                            <img onclick="openSubtasks()" class="subtaskImage" src="/Join/img/subtasksIcon.png">

                            <div class="closeCheckSubstask" style="display: none;">
                                <img onclick="closeSubtasks()" src="/Join/img/close-icon-subtasks.svg">
                                <img src="/Join/img/divider-icon-subtasks.svg">
                                <img onclick="addNewSubtask()" src="/Join/img/check-icon-subtasks.svg">
                            </div>
                        </div>
                        <ul id="addedSubstaskList" class="addedSubstaskList"></ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="editFooter">
            <div class="footerButtonsAddTask"> 
                <button id="footerEditTask" class="footerEditTask" type="button">OK
                    <img src="/Join/img/check-icon-footer-board-addTask.svg" alt="">
                </button>
            </div>
        </div>
    </div>
</form>
`;
} 