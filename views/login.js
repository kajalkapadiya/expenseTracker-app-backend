document
  .getElementById("login-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    var email = document.getElementById("email").value.trim();
    var password = document.getElementById("password").value.trim();

    try {
      // Check if the email exists
      const response = await axios.post("/login", { email, password });
      if (response.data.error) {
        // If the email does not exist, display the error message
        document.getElementById("error-message").innerText =
          response.data.error;
      } else {
        // If the email exists, check if the password matches
        if (response.data.passwordMatch) {
          // If the password matches, show a success message
          alert("User logged in successfully!");
        } else {
          // If the password does not match, display the error message
          document.getElementById("error-message").innerText =
            "Incorrect password";
        }
      }
    } catch (error) {
      // If there's an error, display it below the login form
      document.getElementById("error-message").innerText =
        "An error occurred while logging in: " + error.message;
    }

    // Clear the form
    this.reset();
  });
