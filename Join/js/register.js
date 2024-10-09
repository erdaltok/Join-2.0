let users = [];

/**
 * Initializes the application by loading user data.
 * Calls the loadUsers function to retrieve existing users from Firebase.
 */
async function init() {
  await includeHTML();
  addEventListeners(); 
  await loadUsers();
  // await loadContactsFromStorage();
}

/**
 * Loads user data from Firebase Realtime Database.
 * Assigns the data to the users array. Logs an error if loading fails.
 */
async function loadUsers() {
  try {
    const data = await loadData("users");
    users = data ? Object.values(data) : []; // Check if data exists and convert to array
  } catch (e) {
    console.error("Loading error:", e);
  }
}

/**
 * Registers a new user and updates the user data in Firebase.
 * Validates the password and confirm password fields.
 * Displays a success message and redirects the user to the index page after successful registration.
 */
async function register() {
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirm_password");

  // Check if the passwords match
  if (password.value !== confirmPassword.value) {
    alert("Passwörter stimmen nicht überein");
    return;
  }

  // Show success message and disable the register button
  document.getElementById("msg_box").innerHTML = "You Signed Up successfully";
  document.getElementById("msg_box").style.display = "flex";
  document.getElementById("register_btn").disabled = true;

  // Push the new user to the users array
  const newUser = {
    name: name.value,
    email: email.value,
    password: password.value,
  };
  users.push(newUser);

  // Save the new user data to Firebase
  try {
    await postData("users", newUser);
  } catch (error) {
    console.error("Error saving user to Firebase:", error);
    document.getElementById("msg_box").innerHTML = "Error saving user data!";
    return;
  }

  // Reset the form and redirect to index.html
  resetForm();
  setTimeout(function () {
    window.location.href = "./index.html";
  }, 3000);
}

/**
 * Resets the input fields of the registration form and re-enables the registration button.
 * Clears the values of the name, email, password, and confirm password fields.
 * Enables the register button.
 */
function resetForm() {
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
  document.getElementById("confirm_password").value = "";
  document.getElementById("register_btn").disabled = false;
}
