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
