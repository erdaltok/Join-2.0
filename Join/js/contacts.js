let contactsLocal = []; //Stores all contacts from storage
let selectedContact = ""; //Contains the email of selected contact
let names = []; // List of names
let emails = []; //List of Emails
let phones = []; //List of Phone numbers
let letterColors = {}; //List of Colors
/**
 * Reloads the current page.
 */
function reload() {
  location.reload();
}

/**
 * Creates or updates an advance card for a contact.
 * @param {string} name - The name of the contact.
 * @param {string} email - The email of the contact.
 * @param {string} phone - The phone number of the contact.
 */
function advanceCard(name, email, phone) {
  const firstLetter = name.charAt(0).toUpperCase();
  const advanceCardContainer = document.getElementById("advanceCard");
  let existingLetterContainer = document.querySelector(
    `.letter-container[data-letter='${firstLetter}']`
  );
  if (!existingLetterContainer) {
    existingLetterContainer = createLetterContainer(firstLetter);
    advanceCardContainer.appendChild(existingLetterContainer);
  }
  const newAdvanceCard = createNewAdvanceCard(name, email, firstLetter);
  if (!existingLetterContainer.contains(newAdvanceCard)) {
    existingLetterContainer.appendChild(newAdvanceCard);
  }
  newAdvanceCard
    .querySelector(".contact")
    .addEventListener("click", function () {
      handleContactClick(this, name, email, phone);
    });
}

/**
 * Creates a container element for cards associated with a specific letter.
 * @param {string} letter - The letter associated with the container.
 * @returns {HTMLElement} The created letter container element.
 */
function createLetterContainer(letter) {
  const letterContainer = document.createElement("div");
  letterContainer.className = "letter-container";
  letterContainer.dataset.letter = letter;
  letterContainer.innerHTML = `
        <div>
            <p class="initial-letter">${letter}</p>
            <div class="line"></div>
        </div>
    `;
  return letterContainer;
}

/**
 * Creates a new advance card for a contact.
 * @param {string} name - The name of the contact.
 * @param {string} email - The email of the contact.
 * @param {string} firstLetter - The first letter of the contact's name.
 * @returns {HTMLElement} The created advance card element.
 */
function createNewAdvanceCard(name, email, firstLetter) {
  const initials = name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
  const initialColor = getLetterColor(firstLetter);
  const isSelected = selectedContact === email;
  const clickedClass = isSelected ? "clicked" : "";
  const newAdvanceCard = document.createElement("div");
  newAdvanceCard.innerHTML = ` <div id="contact" class="contact ${clickedClass}">
            <div>  <p style="background-color: ${initialColor};" class="initial">${initials}</p></div>
            <div class="initial-text">
                <p>${makeNameFirstLetterUppercase(name)}</p>
                <p>${email}</p>
            </div>
        </div>`;
  if (isSelected) {
    showCard(name, email, phones);
  }
  return newAdvanceCard; // Show the card if it is selected
}

/**
 * Capitalizes the first letter of each word in a given name.
 * @param {string} name - The name to capitalize.
 * @returns {string} The name with the first letter of each word capitalized.
 */
function makeNameFirstLetterUppercase(name) {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Draws the contacts list by populating the advance card container with contacts.
 */
function drawContactsList() {
  contactsLocal.sort((a, b) => {
    let nameA = a.nameKey.toUpperCase();
    let nameB = b.nameKey.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });

  document.getElementById("card").innerHTML = "";
  document.getElementById("advanceCard").innerHTML = "";

  for (let i = 0; i < contactsLocal.length; i++) {
    advanceCard(
      contactsLocal[i].nameKey,
      contactsLocal[i].emailKey,
      contactsLocal[i].phoneKey
    );
  }
}

/**
 * Hides the contact view on mobile devices by setting the display property of the card and contact-view elements to "none".
 */
function hideContactViewMobil() {
  document.getElementById("card").style.display = "none";
  document.getElementById("contact-view").style.display = "none";
}

/**
 * Hides the contact view by setting the display property of the card element to "none".
 */
function hideContactView() {
  document.getElementById("card").style.display = "none";
}

/**
 * Displays the contact card with the provided name, email, and phone number.
 * @param {string} name - The name of the contact.
 * @param {string} email - The email of the contact.
 * @param {string} phone - The phone number of the contact.
 */
function showCard(name, email, phone) {
  let initials = getInitials(name);
  let firstLetter = getFirstLetter(name);
  let letterColor = getLetterColor(firstLetter);
  document.getElementById("card").innerHTML = ``;
  document.getElementById("card").innerHTML = ` 
    <div class="card">

 <div class="back-icon">
    <img class="cardBackArrowMobil" src="/Join/img/Vector.png" onclick="hideContactViewMobil()">
    <img class="cardBackArrow" src="/Join/img/Vector.png" onclick="hideContactView()">
  </div>
        <div class="name-div">

            <div class="initialDiv" style="padding: 10px;">
                <p style="background-color: ${letterColor};" class="initial-2">${initials}</p>
            </div>
                <p class="name">${name}</p>
        </div>     
      </div>
      <div class="information">
        <p>Contact Information</p>
        <div class="info">
                <p class="info-1 gap-1">E-Mail:  
                <a class="info-2 gap-2" href="mailto:${email}">${email}</a>
                </p>
                <p class="info-1">Telefon:         
                <a class="info-2" href="tel:${phone}">${phone}</a>
                </p>        
              </div>
      </div>  
      <div class="del">
            <div onclick="editContact('${name}','${email}','${phone}')" class="edit-delete">
              <img class="edit-del" src="/Join/img/edit.png">
              <p onclick="editContact()" class="edit-del">Edit</p>
            </div>
            <div onclick="deleteContact('${email}')" class="edit-delete">
            <img class="edit-del" src="/Join/img/delete.png">     
              <p class="edit-del">Delete</p>
            </div>
          </div>
      `;
  document.getElementById("card").style.display = "block";
  document.getElementById("contact-view").style.display = "flex";
}

/**
 * Gets the color associated with the given letter.
 * @param {string} letter - The letter for which to retrieve the color.
 * @returns {string} The color associated with the letter. If no color is found for the letter, returns 'gray'.
 */
function getLetterColor(letter) {
  const colorMap = {
    A: "blue",
    Ä: "cyan",
    B: "green",
    C: "red",
    D: "purple",
    E: "orange",
    F: "pink",
    G: "cyan",
    H: "brown",
    I: "teal",
    J: "yellow",
    K: "maroon",
    L: "navy",
    M: "olive",
    N: "lime",
    O: "indigo",
    Ö: "darkorange",
    P: "magenta",
    Q: "tan",
    R: "slategray",
    S: "lightcoral",
    T: "peru",
    U: "darkorange",
    Ü: "mediumseagreen",
    V: "orangered",
    W: "goldenrod",
    X: "steelblue",
    Y: "darkviolet",
    Z: "gray",
  };
  return colorMap[letter.toUpperCase()] || "gray";
}

/**
 * Gets the first letter of the provided name.
 * @param {string} name - The name from which to extract the first letter.
 * @returns {string} The first letter of the name, converted to uppercase. If the name is empty or consists of whitespace only, returns 'A'.
 */
function getFirstLetter(name) {
  if (name && name.trim() !== "") {
    return name.trim()[0].toUpperCase();
  }
  return "A";
}

// Funktion zum Aktualisieren des ausgewählten Kontakts und Anzeigen der Detailansicht.
function handleContactClick(clickedContact, name, email, phone) {
  let allContactElements = document.getElementsByClassName("contact");
  for (let element of allContactElements) {
    element.classList.remove("clicked");
  }
  clickedContact.classList.add("clicked");
  selectedContact = email;

  showCard(name, email, phone);
}

// Funktion zum Extrahieren der Initialen aus einem Namen.
function getInitials(name) {
  if (name && name.trim() !== "") {
    let splitName = name.split(" ");
    let initials = "";
    for (let i = 0; i < splitName.length; i++) {
      if (i < 3) {
        initials += splitName[i][0].toUpperCase();
      } else {
        break;
      }
    }
    return initials;
  }
  return "";
}

// Funktion zum Öffnen des Formulars zum Hinzufügen eines neuen Kontakts.
function newContact() {
  let openDiv = document.getElementById("newContact");
  openDiv.innerHTML = `
    <div class="div-container">
      <div class="close">
            <img id="closeButton" onclick="closeNewContact()" src="/Join/img/close.png">
      </div>
            <img id="newContactJoinImage" src="/Join/img/icon2.png">
        <div class="new-card">           
        <div class="titleAddNewTaskForm">
            <h1 class="new-text">Add contact</h1>
            <p class="new-text-2">Tasks are better with a team</p>
            <div class="seperatorDiv"></div>
          </div>            
        </div>
        <div class=" div-input">
            <div class="picture-div">
                <div class="picture">
                    <img style="width: 42px; height: 42px;" src="/Join/img/person (1).png">
                </div>
            </div>          
            <form onsubmit="createContact(event)">
             <div class="div-input-fields">
                <div class="input-fields">
                <input class="input" type="text" pattern="[a-zA-Z ]*" name="newName" required placeholder="Max Mustermann">
                    <img src="/Join/img/person.png" alt="icon" style="width: 24; height: 24;">
                </div>
                <div class="input-fields">
                    <input class="input" required type="email" name="newEmail" placeholder="max.mustermann@gmail.com">
                    <img src="/Join/img/mail.png" alt="icon" class="icon-1">
                </div>
                <div class="input-fields">
                <input class="input" type="number" pattern="\d*" oninput="this.value = this.value.replace(/\D/g,'')" required required name="newPhone" placeholder="Phone number">
                    <img src="/Join/img/call.png" alt="icon" class="icon-2">
                </div>
                <div class="buttons">
                    <button onclick="closeNewContact()" class="cancel-btn">Cancel &#10006;</button>
                    <button class="create-btn">Create contact <img src="/Join/img/check.png" alt=""></button>
                </div>
             </div>
            </form>
        </div>
    </div>
  `;
  updateCloseButtonImage();
  window.addEventListener("resize", updateCloseButtonImage);
  showContactFormPopup();
}

// opens the contact-form for new contacts.
function showContactFormPopup() {
  let popup = document.querySelector(".new-contact");
  let container = document.querySelector(".div-container");

  if (popup) {
    popup.style.display = "flex";
    container.classList.add("slide-in");
    container.classList.remove("slide-out");
  }

  document.documentElement.style.overflowY = "hidden";
  document.body.style.overflowY = "hidden";
}

// to close the contact-form
function closeNewContact() {
  let popup = document.querySelector(".new-contact");
  let container = document.querySelector(".div-container");

  container.classList.add("slide-out");
  container.classList.remove("slide-in");

  setTimeout(() => {
    popup.style.display = "none";
    document.documentElement.style.overflowY = "auto";
    document.body.style.overflowY = "auto";
  }, 200);
}

/**
 * Updates the close button image based on the window width.
 */
function updateCloseButtonImage() {
  let closeButton = document.getElementById("closeButton");
  if (closeButton) {
    if (window.innerWidth <= 1250) {
      closeButton.src = "/Join/img/close-white.png";
    } else {
      closeButton.src = "/Join/img/close.png";
    }
  }
}
updateCloseButtonImage();
window.addEventListener("resize", updateCloseButtonImage);

/**
 * Creates a new contact based on form inputs.
 *
 * This function gathers the contact information from the form (name, email, phone),
 * checks if the email already exists in the contacts list, and if not, saves the new contact
 * to Firebase and the local contacts array. It also updates the displayed contacts list
 * and closes the contact form after the process is completed.
 *
 * @param {Event} event - The form submit event, which is prevented to handle the custom contact creation logic.
 *
 * @async
 * @function
 * @returns {void} - No return value. The function directly updates the UI and the local data.
 */
async function createContact(event) {
  event.preventDefault();

  let nameInput = document.querySelector(
    '.input-fields input[name="newName"]'
  ).value;
  let emailInput = document.querySelector(
    '.input-fields input[name="newEmail"]'
  ).value;
  let phoneInput = document.querySelector(
    '.input-fields input[name="newPhone"]'
  ).value;

  for (let i = 0; i < contactsLocal.length; i++) {
    if (contactsLocal[i].emailKey === emailInput) {
      alert("This email is already used!");
      return;
    }
  }

  let newContact = {
    nameKey: makeNameFirstLetterUppercase(nameInput),
    emailKey: emailInput,
    phoneKey: phoneInput,
  };

  try {
    await postData("contacts", newContact);
  } catch (error) {
    console.error("Error while saving the contact in Firebase:", error);
  }

  contactsLocal.push(newContact);
  contactsLocal.sort((a, b) => a.nameKey.localeCompare(b.nameKey));
  selectedContact = emailInput;
  drawContactsList();

  showCard(newContact.nameKey, newContact.emailKey, newContact.phoneKey);
  closeNewContact();
  created();
}

/**
 * Saves the contacts stored in the local variable `contactsLocal` to the storage.
 * @async
 * @returns {Promise<void>} A Promise that resolves when the contacts are successfully saved to storage.
 */
async function saveContactsToStorage() {
  await setItem("contacts", JSON.stringify(contactsLocal));
}

/**
 * Loads contacts from storage into the local variable `contactsLocal`.
 * @async
 * @returns {Promise<void>} A Promise that resolves when contacts are successfully loaded from storage.
 */
async function loadContactsFromStorage() {
  try {
    const loadedContacts = await loadData("contacts");

    if (!loadedContacts) {
      contactsLocal = [];
      return;
    }

    contactsLocal = Object.entries(loadedContacts).map(([id, contact]) => {
      return { id, ...contact };
    });
  } catch (error) {
    console.error("Fehler beim Laden der Kontakte aus Firebase:", error);
  }
  drawContactsList();
}

/**
 * Deletes a contact both locally and in Firebase.
 *
 * This function removes the contact from the local contacts array and also
 * deletes the corresponding contact from Firebase using its unique Firebase ID.
 *
 * @async
 * @param {string} email - The email of the contact to delete.
 * @returns {void}
 */
async function deleteContact(email) {
  let contactId = null;

  for (let i = 0; i < contactsLocal.length; i++) {
    if (contactsLocal[i].emailKey === email) {
      contactId = contactsLocal[i].id; // Store the Firebase ID
      contactsLocal.splice(i, 1);
      break;
    }
  }
  if (contactId === null) {
    console.error("Contact not found in local data");
    return;
  }
  try {
    await deleteData(`contacts/${contactId}`);
  } catch (error) {
    console.error("Error deleting contact from Firebase:", error);
  }
  selectedContact = "";
  drawContactsList();
}

// Funktion zum Aktualisieren der Kontaktanzeige.
function updateContactDisplay() {
  document.getElementById("card").innerHTML = "";
}
// // Funktion zum Öffnen des Formulars zum Bearbeiten eines Kontakts.
function editContact(namep, emailp, phonep) {
  let selectedContact = document.querySelector(".contact.clicked");
  if (selectedContact) {
    // let index = selectedContact.dataset.index;

    // if (namep === undefined || emailp === undefined || phonep === undefined) {
    //   console.error(
    //     "Einer der Werte (Name, Email oder Telefon) ist undefined."
    //   );
    //   return;
    // }

    let initials = getInitials(namep);
    let firstLetter = getFirstLetter(namep);
    let initialColor = getLetterColor(firstLetter);
    let openDiv = document.getElementById("editContact");

    if (openDiv) {
      openDiv.style.display = "flex";
      openDiv.innerHTML = createEditContactHTML(
        namep,
        emailp,
        phonep,
        initials,
        initialColor
      );
    }
  } else {
    console.error("Kein Kontakt ausgewählt.");
  }

  updateCloseButtonImage();
  window.addEventListener("resize", updateCloseButtonImage);
}

/**
 * Creates HTML content for editing a contact.
 * @param {string} namep - The name of the contact.
 * @param {string} emailp - The email of the contact.
 * @param {string} phonep - The phone number of the contact.
 * @param {string} initials - The initials of the contact.
 * @param {string} initialColor - The background color for the initials.
 * @returns {string} The HTML content for editing the contact.
 */
function createEditContactHTML(namep, emailp, phonep, initials, initialColor) {
  return `
        <div class="div-container">
            <div class="new-card">
            <img src="/Join/img/icon2.png">
            <h1 class="new-text">Edit contact</h1>
                <p class="new-text-2">Tasks are better with a team</p><svg xmlns="http://www.w3.org/2000/svg" width="88" height="3" viewBox="0 0 3 3" fill="none"
                    style="width: 88px; height: 3px;"> <path d="M2 2V61" stroke="" stroke-width="" stroke-linecap="round" />
                </svg>
            </div>
            <div class=" div-input">
                <div class="picture-div">
                    <div class="picture" style="background-color: ${initialColor};">
                        <p style="color: white; font-size: 47px; font-weight: 400; line-height: 42px;">${initials}</p>
                    </div>
                </div>
                <div class="close">
                    <img id="closeButton" onclick="closeEditContact()" src="/Join/img/close.png">
                </div>
                <form onsubmit="saveEditedContact(event,'${namep}','${emailp}','${phonep}')">
                    <div class="div-input-fields">
                        <div class="input-fields">
                            <input class="input" required type="text" placeholder="Name" value="${namep}">
                            <img src="/Join/img/person.png" alt="icon" style="width: 24; height: 24;">
                        </div>
                        <div class="input-fields">
                            <input class="input" required type="email" placeholder="Email" value="${emailp}">
                            <img src="/Join/img/mail.png" alt="icon" class="icon-1">
                        </div>
                        <div class="input-fields">
                            <input oninput="this.value = this.value.replace(/[^0-9]/g, '');" class="input" required type="number"  placeholder="Phone" value="${phonep}">
                            <img src="/Join/img/call.png" alt="icon" class="icon-2">
                        </div>
                        <div class="buttons">
                            <button type="button" onclick="closeEditContact()" class="cancel-btn">Discard &#10006;</button>
                            <button class="create-btn" type="submit">Save <img src="/Join/img/check.png" alt=""></button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `;
}

/**
 * Saves the edited contact information and updates the Firebase and local storage.
 * The function compares the old and new email addresses to determine if a contact should be updated or deleted and re-added.
 *
 * @param {Event} event - The form submission event.
 * @param {string} oldname - The old name of the contact before editing.
 * @param {string} oldemail - The old email of the contact before editing.
 * @param {string} oldphone - The old phone number of the contact before editing.
 *
 * @async
 * @function saveEditedContact
 */
async function saveEditedContact(event, oldname, oldemail, oldphone) {
  event.preventDefault();

  let newName = document.querySelector(
    '.input-fields input[placeholder="Name"]'
  ).value;
  let newEmail = document.querySelector(
    '.input-fields input[placeholder="Email"]'
  ).value;
  let newPhone = document.querySelector(
    '.input-fields input[placeholder="Phone"]'
  ).value;

  let existingContactIndex = findContactIndexByEmail(oldemail);
  if (existingContactIndex === -1) {
    console.error("Kontakt nicht gefunden!");
    return;
  }
  const contactId = contactsLocal[existingContactIndex].id;
  let updatedContact = {
    nameKey: makeNameFirstLetterUppercase(newName),
    emailKey: newEmail,
    phoneKey: newPhone,
  };
  if (newEmail !== oldemail) {
    try {
      await deleteData(`contacts/${contactId}`);
    } catch (error) {
      console.error(
        "Fehler beim Löschen des alten Kontakts in Firebase:",
        error
      );
    }
  }
  try {
    await putData(`contacts/${contactId}`, updatedContact); // Firebase-ID
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Kontakts in Firebase:", error);
  }
  contactsLocal[existingContactIndex] = { id: contactId, ...updatedContact };
  drawContactsList();
  closeEditContact();
}

/**
 * Finds the index of a contact in the contactsLocal array by email.
 * @param {string} email - The email address of the contact to find.
 * @returns {number} - The index of the contact if found, otherwise -1.
 */
function findContactIndexByEmail(email) {
  for (let i = 0; i < contactsLocal.length; i++) {
    if (contactsLocal[i].emailKey === email) {
      return i;
    }
  }
  return -1;
}

/**
 * Checks if an email already exists in the contactsLocal array.
 * @param {string} email - The email address to check.
 * @returns {boolean} - True if the email already exists, otherwise false.
 */
function emailAlreadyExists(email) {
  return contactsLocal.some((contact) => contact.emailKey === email);
}

/**
 * Restores the old contact values to the input fields and adds the old contact back to the contactsLocal array.
 * @param {string} oldname - The old name of the contact.
 * @param {string} oldemail - The old email of the contact.
 * @param {string} oldphone - The old phone number of the contact.
 */
function restoreOldContactValues(oldname, oldemail, oldphone) {
  document.querySelector('.input-fields input[placeholder="Name"]').value =
    oldname;
  document.querySelector('.input-fields input[placeholder="Email"]').value =
    oldemail;
  document.querySelector('.input-fields input[placeholder="Phone"]').value =
    oldphone;

  let oldContact = { nameKey: oldname, emailKey: oldemail, phoneKey: oldphone };
  contactsLocal.push(oldContact);
  selectedContact = oldemail;
}
/**
 * Saves a new contact to the contactsLocal array.
 * @param {string} newName - The name of the new contact.
 * @param {string} newEmail - The email of the new contact.
 * @param {string} newPhone - The phone number of the new contact.
 */
function saveNewContact(newName, newEmail, newPhone) {
  let formattedName = makeNameFirstLetterUppercase(newName);
  let newContact = {
    nameKey: formattedName,
    emailKey: newEmail,
    phoneKey: newPhone,
  };
  contactsLocal.push(newContact);
  selectedContact = newEmail;

  contactsLocal.sort((a, b) => {
    if (a.nameKey < b.nameKey) return -1;
    if (a.nameKey > b.nameKey) return 1;
    return 0;
  });
}

/**
 * Capitalizes the first letter of a string.* @param {string} name - The input string.
 * @returns {string} - The input string with the first letter capitalized.*/
function makeNameFirstLetterUppercase(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/**
 * Closes the edit contact form.
 * This function hides the edit contact form by setting its display property to 'none'.
 * It is typically triggered after the contact editing process is finished.
 */
function closeEditContact() {
  let openDiv = document.getElementById("editContact");
  openDiv.innerHTML = "";
  openDiv.style.display = "none";
}

/**
 * Displays a message indicating that a new contact has been successfully created.
 * The message is shown for 2 seconds and then automatically hidden.
 */
function created() {
  let msgBox = document.getElementById("msgBox");
  let card = document.getElementById("card");
  msgBox.innerHTML = "Contact successfully created";
  msgBox.style.display = "flex";
  card.style.display = "block";
  setTimeout(function () {
    msgBox.style.display = "none";
  }, 2000);
}
