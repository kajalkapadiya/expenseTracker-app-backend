function showPremiumuserMessage() {
  document.getElementById("rzp-button").style.visibility = "hidden";
  document.getElementById("message").innerHTML = "You are a premium user ";
}

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const decodeToken = parseJwt(token);
  console.log("decodeToken", decodeToken);
  const ispremiumuser = decodeToken.name;
  if (ispremiumuser) {
    showPremiumuserMessage();
    showLeaderboard();
  }

  fetchExpenses();
});

function showError(err) {
  document.body.innerHTML += `<div style="color:red;"> ${err}</div>`;
}

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

function showLeaderboard() {
  const inputElement = document.createElement("input");
  inputElement.type = "button";
  inputElement.value = "Show Leaderboard";
  inputElement.onclick = async () => {
    const token = localStorage.getItem("token");
    const userLeaderBoardArray = await axios.get("/premium/showLeaderBoard", {
      headers: { Authorization: token },
    });
    console.log(userLeaderBoardArray);

    var leaderboardElem = document.getElementById("leaderboard");
    leaderboardElem.innerHTML += "<h1> Leader Board </<h1>";
    userLeaderBoardArray.data.forEach((userDetails) => {
      leaderboardElem.innerHTML += `<li>Name - ${
        userDetails.name
      } Total Expense - ${userDetails.total_cost || 0} </li>`;
    });
  };
  document.getElementById("message").appendChild(inputElement);
}

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
      document.getElementById("rzp-button").style.visibility = "hidden";
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
