async function fetchExpenses() {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get("/expenses/expenses-data", {
      headers: { Authorization: `${token}` },
    });
    console.log(response);
    const expenses = response.data.allExpenses;

    const expenseList = document.getElementById("expense-list");
    expenseList.innerHTML = "";

    expenses.forEach((expense) => {
      const listItem = document.createElement("li");
      listItem.textContent = `Amount: ${expense.amount}, Description: ${expense.description}, Category: ${expense.category}`;
      expenseList.appendChild(listItem);
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
  }
}

// Fetch and render expenses when the page loads
fetchExpenses();

// Event listener for form submission
document
  .getElementById("expense-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const token = localStorage.getItem("token");
    const amount = document.getElementById("amount").value.trim();
    const description = document.getElementById("description").value.trim();
    const category = document.getElementById("category").value;

    const formData = {
      amount,
      description,
      category,
    };

    try {
      const response = await axios.post("/expenses", formData, {
        headers: { Authorization: `${token}` },
      });
      console.log("Expense added successfully. User ID:", response.data);
      fetchExpenses(); // Fetch and render updated expenses after adding new expense
    } catch (error) {
      console.error("Error adding expense:", error);
      document.getElementById("error-message").innerText =
        error.response.data.error;
    }

    // Clear the form
    this.reset();
  });
