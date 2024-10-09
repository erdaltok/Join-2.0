
/**
 * Initializes the page, adds an animation class to the body, loads user data from Firebase, and triggers the display logic.
 * 
 * This function performs the following tasks:
 * 1. Adds an animation class to the body element to apply animations.
 * 2. Loads user data asynchronously from Firebase using `loadUsers()`.
 * 3. Calls the `show()` function to render or update the display after the users are loaded.
 * 
 * @async
 * @function load
 * @returns {Promise<void>} A promise that resolves once user data is loaded and the display is updated.
*/
async function load() {
    let logo = document.getElementById('logo');
    document.body.classList.add('animate');
    await loadUsers(); // Benutzer aus Firebase laden
    show();
}

/**
 * Delays the display of an element with the ID "animation" for 1 second.
 * 
 * This function waits for 1 second before setting the display style of the element 
 * with the ID "animation" to "flex", making it visible.
 */
function show() {
    setTimeout(function () {
        let element = document.getElementById("animation");
        if (element) {
            element.style.display = "flex";
        }
    }, 1000);
}

/**
 * Redirects the user to the "summary.html" page for guest login.
 * 
 * This function is used for guest login purposes. Upon invocation, it navigates 
 * the user to the "summary.html" page.
 */
function guestLogin() {
    window.location.href = "/Join/template/summary_template.html";
}

/**
 * Asynchronously loads user data from Firebase.
 * 
 * This function retrieves user data from the 'users' path in Firebase. 
 * If data is successfully fetched, it converts the data into an array. 
 * In case of an error, it logs the error message in the console.
 * @returns {Promise<void>} A promise that resolves when user data is loaded.
 */
async function loadUsers() {
    try {
        const data = await loadData('users'); 
        users = data ? Object.values(data) : []; 
    } catch (error) {
        console.error('Fehler beim Laden der Benutzer:', error);
    }
}

/**
 * Asynchronously handles user login by verifying email and password.
 * 
 * This function retrieves the email and password input by the user, searches for a matching user 
 * from the `users` array, and provides feedback based on the result. If a user is found, it stores 
 * the user's name and initials in localStorage and redirects the user to the summary page. If no 
 * user is found, it displays an error message.
 */
async function login() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let user = users.find((u) => u.email === email && u.password === password);
    let errorContainer = document.getElementById("error-message");
    errorContainer.style.display = "flex";

    if (user) {
        console.log("Benutzer gefunden");
        errorContainer.style.display = "none";

        localStorage.setItem("userName", user.name);
        let initials = user.name.split(" ").map((n) => n[0]).join("");
        localStorage.setItem("userInitials", initials);
        guestLogin();
    } else {
        console.log("Benutzer nicht gefunden");
        errorContainer.innerHTML = "Benutzer nicht gefunden";
        setTimeout(function () {
            errorContainer.style.display = "none";
        }, 2000);
    }
    emptyInputs();
}

/**
 * Handles the guest login process by simulating a predefined guest user login.
 * 
 * This function stores predefined guest user credentials (name and email) in localStorage and 
 * redirects the user to the summary page for guest users.
 */
function guestLogin1() {
    const guestUser = { name: 'Guest', email: 'Guest@gmail.com', password: 'Guest' };

    localStorage.setItem("userName", guestUser.name);
    let initials = guestUser.name.split(" ").map((n) => n[0]).join("");
    localStorage.setItem("userInitials", initials);

    guestLogin();
}

/**
 * Clears the input fields for email and password. 
 * This function resets the values of the email and password input fields to an empty string.
 */
function emptyInputs() {
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
}

       
   

