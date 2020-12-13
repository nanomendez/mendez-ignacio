// Table
const employeesTableEl = document.getElementById("employees-table");
// Table tbody
const employeesTableBodyEl = document.createElement("tbody");
employeesTableEl.appendChild(employeesTableBodyEl);

// Add employee button
const addEmployeeButtonEl = document.getElementById("add-employee-btn");

// Edit form
const formEditionEl = document.getElementsByTagName("form")[0];
// Edit modal title
const titleModalEl = document.getElementById("edit-employee-modal-label");
// Edit inputs
const nameInputEl = document.getElementById("name-input");
const lastNameInputEl = document.getElementById("last-name-input");
const phoneInputEl = document.getElementById("phone-input");
const categoryInputEl = document.getElementById("category-input");
const salaryInputEl = document.getElementById("salary-input");
// Edit form buttons
const saveChangesBtnEl = document.getElementById("save-changes-btn");
const cancelChangesBtnEl = document.getElementById("cancel-changes-btn");

// Delete confirmation button
const okDeleteBtnEl = document.getElementById("ok-delete-btn");

// Filters fields
const lastNameFilterEl = document.getElementById("last-name-filter-input");
const categoryFilterEl = document.getElementById("category-filter-input");
// Filter buttons
const filterCheckboxEl = document.getElementById("filter-checkbox");
const cleanFiltersBtnEl = document.getElementById("clean-filters-btn");

/* Progress Bar */
const overlayEl = document.getElementsByClassName("overlay")[0];
const progressBarEl = document.getElementById("save-progress-bar");