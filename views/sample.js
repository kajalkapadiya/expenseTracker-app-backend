let currentPage = 1;
const perPage = 10; // Number of expenses per page

async function fetchExpenses(page) {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(`/expenses/expenses-data?page=${page}`, {
      headers: { Authorization: `${token}` },
    });
    const expensesByMonth = response.data.expensesByMonth;

    const expenseList = document.getElementById("expense-list");
    expenseList.innerHTML = "";

    for (const monthYear in expensesByMonth) {
      const monthExpenses = expensesByMonth[monthYear];

      // Display month as heading
      const monthHeading = document.createElement("h3");
      monthHeading.textContent = monthYear;
      expenseList.appendChild(monthHeading);

      // Display expenses for the month
      monthExpenses.forEach((expense) => {
        const listItem = document.createElement("li");
        listItem.textContent = `Amount: ${expense.amount}, Description: ${expense.description}, Category: ${expense.category}`;
        // Create delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", async () => {
          try {
            await deleteExpense(expense.id);
            fetchExpenses(currentPage); // Reload expenses after deletion
          } catch (error) {
            console.error("Error deleting expense:", error);
          }
        });

        listItem.appendChild(deleteButton);
        expenseList.appendChild(listItem);
      });
    }

    // Update pagination info
    const totalPages = Math.ceil(Object.keys(expensesByMonth).length / perPage);
    document.getElementById(
      "page-info"
    ).textContent = `Page ${currentPage} of ${totalPages}`;
    document.getElementById("prev-page").disabled = currentPage === 1;
    document.getElementById("next-page").disabled = currentPage === totalPages;
  } catch (error) {
    console.error("Error fetching expenses:", error);
    document.getElementById("error-message").textContent =
      "Error fetching expenses. Please try again later.";
  }
}

// Pagination event listeners
document.getElementById("prev-page").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    fetchExpenses(currentPage);
  }
});

document.getElementById("next-page").addEventListener("click", () => {
  currentPage++;
  fetchExpenses(currentPage);
});

// Initial fetch for the first page
fetchExpenses(currentPage);
