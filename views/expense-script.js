async function fetchExpenses() {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get("/expenses/expenses-data", {
      headers: { Authorization: `${token}` },
    });
    const expenses = response.data.allExpenses;

    const expenseList = document.getElementById("expense-list");
    expenseList.innerHTML = "";

    expenses.forEach((expense) => {
      const listItem = document.createElement("li");
      listItem.textContent = `Amount: ${expense.amount}, Description: ${expense.description}, Category: ${expense.category}`;
      // Create delete button
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", async () => {
        try {
          await deleteExpense(expense.id);
        } catch (error) {
          console.error("Error deleting expense:", error);
        }
      });

      listItem.appendChild(deleteButton);
      expenseList.appendChild(listItem);
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
  }
}

async function deleteExpense(expenseId) {
  const token = localStorage.getItem("token");
  console.log("deleteId", expenseId);
  try {
    await axios.delete(`/expenses/${expenseId}`, {
      headers: { Authorization: `${token}` },
    });
    console.log("Expense deleted successfully.");
    fetchExpenses();
  } catch (error) {
    console.error("Error deleting expense:", error);
    throw error;
  }
}

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
      fetchExpenses();
    } catch (error) {
      console.error("Error adding expense:", error);
      document.getElementById("error-message").innerText =
        error.response.data.error;
    }

    // Clear the form
    this.reset();
  });

document.getElementById("rzp-button").onclick = async function (e) {
  const token = localStorage.getItem("token");
  const response = await axios.get("/purchase/premiummembership", {
    headers: { Authorization: token },
  });
  console.log(response);
  var options = {
    key: response.data.key_id, // Enter the Key ID generated from the Dashboard
    order_id: response.data.order.id, // For one time payment
    // This handler function will handle the success payment
    handler: async function (response) {
      const res = await axios.post(
        "/purchase/updatetransactionstatus",
        {
          order_id: options.order_id,
          payment_id: response.razorpay_payment_id,
        },
        { headers: { Authorization: token } }
      );

      console.log(res);
      alert("You are a Premium User Now");
      document.getElementById("rzp-button1").style.visibility = "hidden";
      document.getElementById("message").innerHTML = "You are a premium user ";
      localStorage.setItem("token", res.data.token);
      showLeaderboard();
    },
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on("payment.failed", async function (response) {
    console.log(response);
    alert("Payment failed. Please try again.");

    const paymentId = response.payment_id;

    // Trigger request to update transaction status to "FAIL" with the payment_id
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "/purchase/updatetransactionstatus",
        {
          order_id: options.order_id, // assuming options is accessible here
          payment_id: paymentId, // Pass the payment_id to the backend
        },
        { headers: { Authorization: token } }
      );
      console.log(res); // Log response from the backend
    } catch (error) {
      console.error("Error updating transaction status:", error);
    }
  });
};
