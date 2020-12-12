
// employees data
let employees = [];
// id for next employee
let nextEmployeeId;

// LISTENERS

// action when the document has loaded
document.addEventListener("DOMContentLoaded", () => {
    // add styles to table
    employeesTableEl.classList.add("table", "table-striped");
    // disabled filter fields
    setFilterFieldsEnabled(false);
    // get data from json file
    fetch('../assets/json/data.json')
        .then(result => result.json())
        .then(rawData => {
            console.log(rawData);
            // create the thead element and inserted it in the table
            employeesTableEl.appendChild(createTableHead(rawData.labels));

            employees = rawData.employees;
            // fill the tbody with the employee data
            fillTableBody(employees);
            // initialize next employee id
            nextEmployeeId = setNextEmployeeId(employees);
        });
});

// action when do click on add employee button
addEmployeeButtonEl.addEventListener("click", () => {
    console.table(employees);
    titleModalEl.innerText = "Nuevo Empleado";
    clearInputs();
    idEmployeeInputEl.setAttribute("value", -1);
});

// action when do click on delete button
okDeleteBtnEl.addEventListener("click", () => {
    const idEmployee = parseInt(idEmployeeInputEl.getAttribute("value"));
    // delete employee from employees
    employees = employees.filter(employee => employee.id !== idEmployee);
    // remove the row
    const toDeleteTrEl = document.getElementById("tr" + idEmployee);
    employeesTableBodyEl.removeChild(toDeleteTrEl);
    // hide the delete modal
    $('#delete-employee-modal').modal('hide');
    console.table("En ok delete" + employees);
});

// action when submitting edit form - New and Edit Employee
formEditionEl.addEventListener("submit", (e) => {
    e.preventDefault();

    // check validity of the input fields
    if (formEditionEl.checkValidity()) {
        // action of table modification - used  to simulate the save process
        let modifyTableAction;
        // get employee object from input fields
        const employee = getEmployeeFromInputs();
        // if the hidden input value is -1 it will be a new employee, otherwise it will be a modification
        const idEmployee = parseInt(idEmployeeInputEl.getAttribute("value"));
        if (idEmployee === -1) {
            employee.id = getNextEmployeeId();
            employees.push(employee);
            // if filter toggle is not enabled a new row is added
            if (!isFilterEnabled()) {
                modifyTableAction = () => employeesTableBodyEl.appendChild(createTableRow(employee));
            }
        } else {
            employee.id = idEmployee;
            employees[getIndexById(idEmployee, employees)] = employee;
            // if filter toggle is not enabled the modified row is replaced by a new
            if (!isFilterEnabled()) {
                const oldTrEl = document.getElementById("tr" + idEmployee);
                const newTrEl = createTableRow(employee);
                modifyTableAction = () => employeesTableBodyEl.replaceChild(newTrEl, oldTrEl);
            }
        }
        // if filter toggle is enabled, it becomes disabled and the table body is drawn again
        if (isFilterEnabled()) {
            setFilterEnabled(false);
            modifyTableAction = () => fillTableBody(employees);
        }
        // hide the edit modal
        $('#edit-employee-modal').modal('hide');
        // delay the action and show progress bar
        delayAction(modifyTableAction, durationProgressBar);

    }
    formEditionEl.classList.add('was-validated');
});

// action when change the filter toggle
$('#filter-checkbox').change(() => {
    setFilterFieldsEnabled(filterCheckboxEl.checked)
    if (!filterCheckboxEl.checked) {
        fillTableBody(employees);
    }
});

// action when do click on clean filters button
cleanFiltersBtnEl.addEventListener("click", () => {
    cleanFilterFields();
    lastNameFilterEl.focus();
    fillTableBody(employees);
});

lastNameFilterEl.addEventListener("keyup", () => {
    applyFilter();
});

categoryFilterEl.addEventListener("change", () => {
    applyFilter();
});

// TABLE

// returns a thead element with the head labels
const createTableHead = (labels) => {
    const theadEl = document.createElement("thead");
    const trEl = document.createElement("tr");
    labels.forEach(element => {
        const thEl = document.createElement("th");
        thEl.innerText = element;
        trEl.appendChild(thEl);
    });
    theadEl.appendChild(trEl);
    return theadEl;
}

// given the table data, fill the tbody
const fillTableBody = (tableData) => {
    employeesTableBodyEl.innerHTML = "";
    tableData.forEach(element =>
        employeesTableBodyEl.appendChild(createTableRow(element)));
}

// given a employee, build the tr element and returns it
const createTableRow = (employee) => {

    // given a employee and a property, returns a td with the property value
    const createTableTd = (employee, property) => {
        const tdEl = document.createElement("td");
        tdEl.innerText = employee[property];
        return tdEl;
    }

    // returns a button element with labelAction as text and modal id as target
    const getActionButton = (labelAction, target) => {
        const buttonEl = document.createElement("button");
        buttonEl.setAttribute("type", "button");
        buttonEl.setAttribute("data-toggle", "modal");
        buttonEl.setAttribute("data-target", `#${target}`);
        buttonEl.classList.add("btn");
        buttonEl.innerText = labelAction;
        return buttonEl;
    }

    const trEl = document.createElement("tr");
    // set id to tr element
    trEl.setAttribute("id", "tr" + employee.id)
    // data
    trEl.appendChild(createTableTd(employee, 'id'));
    trEl.appendChild(createTableTd(employee, 'first_name'));
    trEl.appendChild(createTableTd(employee, 'last_name'));
    trEl.appendChild(createTableTd(employee, 'phone'));
    trEl.appendChild(createTableTd(employee, 'category'));
    trEl.appendChild(createTableTd(employee, 'salary'));

    // edit button
    const tdActionsEl = document.createElement("td");
    const buttonEditEl = getActionButton("Editar", "edit-employee-modal");
    buttonEditEl.classList.add("btn-outline-info");
    tdActionsEl.appendChild(buttonEditEl);
    // action when do click on edit button
    buttonEditEl.addEventListener("click", () => {
        titleModalEl.innerText = "Editar Empleado";
        // set employee id in the hidden input
        idEmployeeInputEl.setAttribute("value", employee.id);
        // fill the form with the employee data
        fillForm(employees[getIndexById(employee.id, employees)]);
    });

    // delete button
    const buttonDeleteEl = getActionButton("Borrar", "delete-employee-modal");
    buttonDeleteEl.classList.add("btn-outline-danger", "ml-2");
    tdActionsEl.appendChild(buttonDeleteEl);
    trEl.appendChild(tdActionsEl);
    // action when do click on delete button
    buttonDeleteEl.addEventListener("click", (e) => idEmployeeInputEl.setAttribute("value", employee.id));

    return trEl;
}

// EDIT FORM

// given a employee, fill the inputs form
const fillForm = (employee) => {
    formEditionEl.classList.remove("was-validated");
    nameInputEl.value = employee.first_name;
    lastNameInputEl.value = employee.last_name;
    phoneInputEl.value = employee.phone;
    categoryInputEl.value = employee.category;
    salaryInputEl.value = employee.salary;
}

// returns a employee object from the inputs values
const getEmployeeFromInputs = () => {
    return {
        last_name: lastNameInputEl.value,
        first_name: nameInputEl.value,
        phone: phoneInputEl.value,
        category: categoryInputEl.value,
        salary: parseInt(salaryInputEl.value),
    }
}

// clear the inputs values
const clearInputs = () => {
    formEditionEl.classList.remove("was-validated");
    nameInputEl.value = "";
    lastNameInputEl.value = "";
    phoneInputEl.value = "";
    categoryInputEl.value = "";
    salaryInputEl.value = 0;
}

// nextEmployeeId is the next id available for a new employee
// In first instance is calculated as the next id from the last element of employees array
// By default employees are sorted by id
setNextEmployeeId = (employees) =>
    nextEmployeeId = employees.length == 0 ? 1 : employees[employees.length - 1].id;

const getNextEmployeeId = () => {
    return ++nextEmployeeId;
}

// given an employee id, return the employee index
const getIndexById = (id, employees) => {
    return employees.findIndex(employee => employee.id === id);
}

// FILTERS

// returns if the filter toggle is enabled
const isFilterEnabled = () => filterCheckboxEl.checked;

const cleanFilterFields = () => {
    lastNameFilterEl.value = "";
    categoryFilterEl.value = "--Todos--"
}

// enable/disable filter fields
const setFilterFieldsEnabled = (isEnabled) => {
    lastNameFilterEl.disabled = !isEnabled;
    categoryFilterEl.disabled = !isEnabled;
    cleanFiltersBtnEl.disabled = !isEnabled;
    cleanFilterFields();
    if (isEnabled) {
        lastNameFilterEl.focus();
    }
}

// enable/disable filter toggle
const setFilterEnabled = (isEnabled) => {
    isEnabled ? $('#filter-checkbox').bootstrapToggle('on') : $('#filter-checkbox').bootstrapToggle('off');
    setFilterFieldsEnabled(isEnabled);
}

// apply filters
const applyFilter = () => {
    const employeesFiltrado = employees.filter(employee => {
        return employee.last_name.toUpperCase().includes(lastNameFilterEl.value.toUpperCase()) &&
            (categoryFilterEl.value === "--Todos--" || employee.category === categoryFilterEl.value);
    });
    fillTableBody(employeesFiltrado);
}

// PROGRESS BAR

const stepProgressBar = 10;
const durationProgressBar = 2000;

// Show overlay to progress bar
const showOverlay = (show) => show ?
    overlayEl.classList.remove("display-none") : overlayEl.classList.add("display-none");

// Show progress Bar
const showProgressBar = (duration, step) => {
    let increment = 0;
    const makeProgress = () => {
        if (increment < 100) {
            increment += step;
            progressBarEl.style.width = `${increment}%`
            setTimeout(makeProgress, duration / (100 / step));
        }
        console.log(increment);
    }
    makeProgress();
}

/* 
   Simulate a save process with a delay of duration ms, while the progress bar appears 
   
   Action is the function related with the table drawing, after the progress bar is shown
   Action can be:
   - a new row is added
   - a row is replaced
   - draw the entire table
 */
const delayAction = (action, duration) => {
    // show te overlay
    showOverlay(true);
    showProgressBar(duration, stepProgressBar);
    setTimeout(() => {
        // hide the overlay of progressbar
        showOverlay(false);
        action();
    }, duration);
}