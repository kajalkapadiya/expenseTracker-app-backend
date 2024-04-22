document
  .getElementById("signup-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    var username = document.getElementById("username").value.trim();
    var email = document.getElementById("email").value.trim();
    var password = document.getElementById("password").value.trim();

    try {
      const response = await axios.post("/signup", {
        name: username,
        email,
        password,
      });

      console.log("User created successfully. User ID:", response.data.userId);

      // Optionally, redirect to another page or display a success message
      window.location.href = "/login";
    } catch (error) {
      console.error("Error creating user:", error);
      document.getElementById("error-message").innerText =
        error.response.data.error;
    }

    // Clear the form
    this.reset();
  });
