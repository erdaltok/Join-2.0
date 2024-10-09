// CONTACT-LIST IN ADD TASK ON BOARD PAGE
/**
 * Toggles the visibility of the contact list and updates the appearance of the contact input field accordingly.
 */
function toggleContactList() {
  const contactInput = document.getElementById("idTitleSelectContactsAddTask");
  const contactList = document.querySelector(".listSelectableContacts");
  const addedContactsContainer = document.getElementById("addedContactsProfilBadges");

  if (contactList.style.display === "block") {
    contactList.style.display = "none";
    contactInput.style.background =
      "url(/Join/img/arrow_drop_down.svg) no-repeat scroll right";
    addedContactsContainer.style.display = "flex";
  } else {
    contactList.style.display = "block";
    contactInput.style.background =
      "url(/Join/img/arrow_drop_up.svg) no-repeat scroll right";
    addedContactsContainer.style.display = "none";    
  }
}

/**
 * Event listener to handle clicks outside the contact input and contact list.
 * If a click occurs outside these elements, it hides the contact list and updates the appearance of the contact input field.
 * @param {MouseEvent} event - The click event object.
 */
window.addEventListener("click", function (event) {
  const contactInput = document.getElementById("idTitleSelectContactsAddTask");
  const contactList = document.querySelector(".listSelectableContacts");

  if (contactInput && contactList) {
    if (
      !contactInput.contains(event.target) &&
      !contactList.contains(event.target)
    ) {
      contactList.style.display = "none";
      contactInput.style.background =
        "url(/Join/img/arrow_drop_down.svg) no-repeat scroll right";
      document.getElementById("addedContactsProfilBadges").style.display = "flex";
    }
  }
});

/**
 * Adds or removes a contact from the task based on its current selection state.
 * @param {Event} event - The event object representing the click event.
 */
function addContactToTask(event) {
  const contactLine = event.currentTarget;
  if (contactLine.classList.contains("selected")) {
    removeContactFromTask(contactLine);
  } else {
    addedContactToTask(contactLine);
  }
  updateAddedContactsDisplay();
}

/**
 * Marks a contact line as selected and adds it to the task.
 * @param {HTMLElement} contactLine - The HTML element representing the contact line.
 */
function addedContactToTask(contactLine) {
  contactLine.style.backgroundColor = "#091931";
  contactLine.querySelector(".contact-name").style.color = "white";
  const imgElement = contactLine.querySelector("img");
  imgElement.src = "/Join/img/check-button-checked-white.svg";
  contactLine.classList.add("selected");
  selectedContacts.push(contactLine);
}

/**
 * Removes a contact line from the task and deselects it.
 * @param {HTMLElement} contactLine - The HTML element representing the contact line.
 */
function removeContactFromTask(contactLine) {
  contactLine.style.backgroundColor = "";
  contactLine.querySelector(".contact-name").style.color = "";
  const imgElement = contactLine.querySelector("img");
  imgElement.src = "/Join/img/check-button-default.svg";
  contactLine.classList.remove("selected");
  selectedContacts = selectedContacts.filter(
    (contact) => contact !== contactLine
  );
}

/**
 * Updates the display of added contacts by rendering their initials as badges.
 */
function updateAddedContactsDisplay() {
  const addedContactsContainer = document.querySelector(
    ".addedContactsProfilBadges");
  if (addedContactsContainer) {
    addedContactsContainer.innerHTML = ""; 
    selectedContacts.forEach((contact) => { 
      const name = contact.querySelector(".contact-name").textContent; const firstLetter = getFirstLetter(name);
      const initialColor = getLetterColor(firstLetter); const initials = getInitials(name);
      const badgeElement = document.createElement("div");
      badgeElement.className = "initial"; badgeElement.style.backgroundColor = initialColor;
      badgeElement.textContent = initials;
      addedContactsContainer.appendChild(badgeElement);});  
    addedContactsContainer.style.display = selectedContacts.length > 0 ? "flex" : "none";
  }
}
/**
 * Adds click event listeners to each contact line, triggering the addition of the contact to a task when clicked.
 */
document.addEventListener("DOMContentLoaded", function () {
  const contactLines = document.querySelectorAll(".contact-line");
  contactLines.forEach((line) => {
    line.addEventListener("click", addContactToTask);
  });
});

/**
 * Loads contacts from Firebase and populates the selectable contacts list in the form.
 * This is the main function that coordinates the data loading and rendering process.
 * @async
 * @returns {Promise<void>}
 */
async function loadContactsForForm() {
  const listSelectableContacts = document.getElementById("listSelectableContacts");
  if (listSelectableContacts) {
    const ulElement = listSelectableContacts.querySelector("ul");
    ulElement.innerHTML = "";

    try {
      const contacts = await fetchContactsFromFirebase(); // Fetch contacts data
      if (contacts.length === 0) {
        renderNoContactsMessage(ulElement);
        return;
      }

      renderContactsList(contacts, ulElement); 
      addEventListenersToContactLines();

    } catch (error) {
      console.error("Error loading contacts from Firebase:", error);
    }
  }
}

/**
 * Fetches contacts data from Firebase and returns it as an array.
 * @async
 * @returns {Promise<Array>} - An array of contact objects from Firebase.
 */
async function fetchContactsFromFirebase() {
  const loadedContacts = await loadData("contacts");

  if (!loadedContacts) {
    return [];
  }

  return Object.entries(loadedContacts).map(([id, contact]) => ({
    id, 
    ...contact
  }));
}

/**
 * Renders a message indicating that no contacts are available.
 * @param {HTMLElement} ulElement - The unordered list (ul) element where contacts should be displayed.
 */
function renderNoContactsMessage(ulElement) {
  ulElement.innerHTML = "<li>No contacts available</li>";
}

/**
 * Renders the list of contacts in the form's selectable contacts section.
 * @param {Array} contacts - The array of contact objects.
 * @param {HTMLElement} ulElement - The unordered list (ul) element where contacts will be displayed.
 */
function renderContactsList(contacts, ulElement) {
  contacts.forEach((contact) => {
    const liElement = createContactListItem(contact);
    ulElement.appendChild(liElement);
  });
}

/**
 * Creates an HTML list item (li) element for a contact.
 * @param {Object} contact - The contact object containing name, email, etc.
 * @returns {HTMLElement} - A list item element with the contact details.
 */
function createContactListItem(contact) {
  const initials = getInitials(contact.nameKey);
  const firstLetter = getFirstLetter(contact.nameKey);
  const initialColor = getLetterColor(firstLetter);

  const liElement = document.createElement("li");
  liElement.className = "contact-line";
  liElement.innerHTML = loadContactsForFormHtmlTemplate(contact.nameKey, initials, initialColor);

  return liElement;
}

/**
 * Adds event listeners to each contact line element.
 * When a contact line is clicked, it triggers the `addContactToTask` function.
 */
function addEventListenersToContactLines() {
  const contactLines = document.querySelectorAll(".contact-line");
  contactLines.forEach((line) => {
    line.addEventListener("click", addContactToTask);
  });
}

/**
 * Adds an event listener to the `DOMContentLoaded` event.
 * When the DOM content is loaded, it triggers the `loadContactsForForm` function.
 */
document.addEventListener("DOMContentLoaded", function () {
  loadContactsForForm();
});

/**
 * Searches contacts based on the input text and renders filtered contacts.
 */
function searchContacts() {
  const searchText = document
    .getElementById("idTitleSelectContactsAddTask")
    .value.toLowerCase();
  const contacts = JSON.parse(localStorage.getItem("contacts")) || {
    names: [], emails: [], phones: [],};
  const filteredContacts = contacts.names.filter((name) =>
    name.toLowerCase().includes(searchText));
  renderFilteredContacts(filteredContacts);
}

/**
 * Renders filtered contact names by populating the list of selectable contacts with the provided names.
 * @param {string[]} filteredContactNames - The array of filtered contact names.
 */
function renderFilteredContacts(filteredContactNames) {
  const listSelectableContacts = document.getElementById("listSelectableContacts" );
  const ulElement = listSelectableContacts.querySelector("ul");
  ulElement.innerHTML = "";
  filteredContactNames.forEach((name) => {
    const initials = getInitials(name); const firstLetter = getFirstLetter(name);
    const initialColor = getLetterColor(firstLetter); const liElement = document.createElement("li");
    liElement.className = "contact-line";
    liElement.innerHTML = loadContactsForFormHtmlTemplate( name,  initials,  initialColor );
    ulElement.appendChild(liElement);});
  addEventListenersToContactLines();
}


