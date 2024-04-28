document
  .getElementById("login-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    var email = document.getElementById("email").value.trim();
    var password = document.getElementById("password").value.trim();

    try {
      // Check if the email exists
      const response = await axios.post("/login", { email, password });
      localStorage.setItem("token", response.data.token);

      alert(response.data.message);
      window.location.href = "/expenses";
    } catch (error) {
      // Check if there's an error message in the response data
      if (error.response && error.response.data && error.response.data.error) {
        // Display the error message returned from the server
        document.getElementById("error-message").innerText =
          error.response.data.error;
      } else {
        // Display a generic error message for any other error
        document.getElementById("error-message").innerText =
          "An error occurred while logging in: " + error.message;
      }
    }

    // Clear the form
    this.reset();
  });

document
  .getElementById("forgotPasswordBtn")
  .addEventListener("click", function () {
    // Hide the login form
    document.getElementById("login-form").style.display = "none";

    // Show the forgot password form
    document.getElementById("forgotPasswordForm").style.display = "block";
  });

document
  .getElementById("forgotPasswordForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    var forgotEmail = document.getElementById("forgotEmail").value.trim();
    console.log(forgotEmail);
    try {
      // Call the backend API to handle forgot password request
      const response = await axios.post("/password/forgotpassword", {
        email: forgotEmail,
      });

      // Display success message
      alert(response.data.message);

      // Reset the form and show the login form
      if (response.status === 200) {
        // Reset the form and show the login form if email is sent successfully
        document.getElementById("forgotPasswordForm").style.display = "none";
        document.getElementById("login-form").style.display = "block";
      }
    } catch (error) {
      // Handle errors
      console.error("Forgot password error:", error);
      alert("An error occurred. Please try again.");
    }
  });

document.getElementById("returnToLogin").addEventListener("click", function () {
  // Hide the forgot password form
  document.getElementById("forgotPasswordForm").style.display = "none";

  // Show the login form
  document.getElementById("login-form").style.display = "block";
});
