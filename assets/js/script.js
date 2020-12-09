
//objetivo 26-11, hacer andar la carga inicial, los botones de edit, delete y agregar medio harcodeado
//y usando la tactica de dibujar la tabla cada vez y llevar la correspondencia index de la tabla con
//el del array

//objetivo 29-11 SIMPLIFICARME con el tema del manejo de fechas
//dejo tanto en el formulario, como en la tabla, fecha de entrada y cantidad de dias
// en un string

// recupero el nodo table
const bookingsTableEl = document.getElementById("bookings-table");

// creo el nodo tbody - lo necesito para insertar las tr, sino lo hago asi tengo que recuperarlo de la tabla cada vez que lo necesito
const bookingsTableBodyEl = document.createElement("tbody");
bookingsTableEl.appendChild(bookingsTableBodyEl);

const formEditionEl = document.getElementsByTagName("form")[0];

// recupero el boton de agregar
const addBookingButtonEl = document.getElementById("add-booking-btn");

// recupero los fields del formulario del modal
const nameInputEl = document.getElementById("name-input");
const lastNameInputEl = document.getElementById("last-name-input");
const phoneInputEl = document.getElementById("phone-input");
const dateInInputEl = document.getElementById("date-in-input");
const daysInputEl = document.getElementById("days-input");
const guestsInputEl = document.getElementById("guests-input");
// input oculto usado para almacenar el index del booking a modificar, o -1 si es alta
const idBookingInputEl = document.getElementById("id-booking-input");

const titleModalEl = document.getElementById("edit-booking-modal-label");

// boton save changes y cancel changes
const saveChangesBtnEl = document.getElementById("save-changes-btn");
const cancelChangesBtnEl = document.getElementById("cancel-changes-btn");

const okDeleteBtnEl = document.getElementById("ok-delete-btn");

// Filtros
const lastNameFilterEl = document.getElementById("last-name-filter-input");

const filterCheckboxEl = document.getElementById("filter-checkbox");

/* Progress Bar */

const mostrarPbBtnEl = document.getElementById("mostrar-pb-btn"); // para borrar
const overlayEl = document.getElementsByClassName("overlay")[0];
const progressBarEl = document.getElementById("save-progress-bar");


const stepProgressBar = 50;
const durationProgressBar = 2000;

let nextBookingId;


// labels del head de la tabla
labels = ["id", "Nombre", "Apellido", "Teléfono", "Huéspedes", "Desde", "Días", "", ""];

let bookings = [
    {
        id: 1,
        last_name: "Mendez",
        first_name: "Ignacio",
        phone: "0249154526755",
        guests: 2,
        date_in: "10/01/2021",
        days: 5
    },
    {
        id: 2,
        last_name: "Lopez",
        first_name: "Florencia",
        phone: "0111526384095",
        guests: 5,
        date_in: "20/12/2020",
        days: 19
    },
    {
        id: 3,
        last_name: "Gomez",
        first_name: "Juan Jose",
        phone: "025515263487",
        guests: 6,
        date_in: "08/02/2021",
        days: 9
    }
]


/* CONTROLADO */

// action when the document has loaded
document.addEventListener("DOMContentLoaded", () => {
    // create the thead element and inserted it in the table
    bookingsTableEl.appendChild(createTableHead(labels));
    // fill the tbody with the bookingd data
    fillTableBody(bookings);
    // disabled filter fields
    setFilterFieldsEnabled(false);
})

// action when do click on add booking button
addBookingButtonEl.addEventListener("click", () => {
    console.table(bookings);
    titleModalEl.innerText = "Nueva Reserva";
    clearInputs();
    idBookingInputEl.setAttribute("value", -1);
});

// action when do click on delete button
okDeleteBtnEl.addEventListener("click", () => {
    const idBooking = parseInt(idBookingInputEl.getAttribute("value"));
    // delete booking from bookings
    bookings = bookings.filter(booking => booking.id !== idBooking);
    // remove the row
    const toDeleteTrEl = document.getElementById("tr" + idBooking);
    bookingsTableBodyEl.removeChild(toDeleteTrEl);
    // hide the delete modal
    $('#delete-booking-modal').modal('hide');
    console.table("En ok delete" + bookings);
});

// action when submitting edit form - New and Edit Booking
formEditionEl.addEventListener("submit", (e) => {
    e.preventDefault();

    // check validity of the input fields
    if (formEditionEl.checkValidity()) {
        // action of table modification - used  to simulate the save process
        let modifyTableAction;
        // get booking object from input fields
        const booking = getBookingFromInputs();
        // if the hidden input value is -1 it will be a new booking, otherwise it will be a modification
        const idBooking = parseInt(idBookingInputEl.getAttribute("value"));
        if (idBooking === -1) {
            booking.id = getNextBookingId(bookings);
            bookings.push(booking);
            // if filter toggle is not enabled a new row is added
            if (!isFilterEnabled()) {
                modifyTableAction = () => bookingsTableBodyEl.appendChild(createTableRow(booking));
            }
        } else {
            booking.id = idBooking;
            bookings[getIndexById(idBooking, bookings)] = booking;
            // if filter toggle is not enabled the modified row is replaced by a new
            if (!isFilterEnabled()) {
                const oldTrEl = document.getElementById("tr" + idBooking);
                const newTrEl = createTableRow(booking);
                modifyTableAction = () => bookingsTableBodyEl.replaceChild(newTrEl, oldTrEl);
            }
        }
        // if filter toggle is enabled, it becomes disabled and the table body is drawn again
        if (isFilterEnabled()) {
            setFilterEnabled(false);
            modifyTableAction = () => fillTableBody(bookings);
        }
        // hide the edit modal
        $('#edit-booking-modal').modal('hide');
        // delay the action and show progress bar
        delayAction(modifyTableAction, durationProgressBar);

    }
    formEditionEl.classList.add('was-validated');
});


// TABLE

// returns a thead element with the head labels
const createTableHead = (labels) => {
    const theadEl = document.createElement("thead");
    const trEl = document.createElement("tr");
    labels.forEach(element => {
        const tdEl = document.createElement("td");
        tdEl.innerText = element;
        trEl.appendChild(tdEl);
    });
    theadEl.appendChild(trEl);
    return theadEl;
}

// given the table data, fill the tbody
const fillTableBody = (tableData) => {
    bookingsTableBodyEl.innerHTML = "";
    tableData.forEach(element =>
        bookingsTableBodyEl.appendChild(createTableRow(element)));
}

// given a booking, build the tr element and returns it
const createTableRow = (booking) => {

    // given a booking and a property, resturns a td with the property value
    const createTableTd = (booking, property) => {
        const tdEl = document.createElement("td");
        tdEl.innerText = booking[property];
        return tdEl;
    }

    // returns a button element with labelAction as text and modal id as target
    const getActionButton = (labelAction, target) => {
        const buttonEl = document.createElement("button");
        buttonEl.setAttribute("type", "button");
        buttonEl.setAttribute("data-toggle", "modal");
        buttonEl.setAttribute("data-target", `#${target}`);
        buttonEl.innerText = labelAction;
        return buttonEl;
    }

    const trEl = document.createElement("tr");
    // set id to tr element
    trEl.setAttribute("id", "tr" + booking.id)
    // data
    trEl.appendChild(createTableTd(booking, 'id'));
    trEl.appendChild(createTableTd(booking, 'first_name'));
    trEl.appendChild(createTableTd(booking, 'last_name'));
    trEl.appendChild(createTableTd(booking, 'phone'));
    trEl.appendChild(createTableTd(booking, 'guests'));
    trEl.appendChild(createTableTd(booking, 'date_in'));
    trEl.appendChild(createTableTd(booking, 'days'));

    // edit button
    const tdEditEl = document.createElement("td");
    const buttonEditEl = getActionButton("Editar", "edit-booking-modal");
    tdEditEl.appendChild(buttonEditEl);
    trEl.appendChild(tdEditEl);
    // action when do click on edit button
    buttonEditEl.addEventListener("click", () => {
        titleModalEl.innerText = "Editar Reserva";
        // set booking id in the hidden input
        idBookingInputEl.setAttribute("value", booking.id);
        // fill the form with the booking data
        fillForm(bookings[getIndexById(booking.id, bookings)]);
    });

    // delete button
    const tdDeleteEl = document.createElement("td");
    const buttonDeleteEl = getActionButton("Borrar", "delete-booking-modal");
    tdDeleteEl.appendChild(buttonDeleteEl);
    trEl.appendChild(tdDeleteEl);
    // action when do click on delete button
    buttonDeleteEl.addEventListener("click", (e) => idBookingInputEl.setAttribute("value", booking.id));

    return trEl;
}

// EDIT FORM

// given a booking, fill the inputs form
const fillForm = (booking) => {
    formEditionEl.classList.remove("was-validated");
    nameInputEl.value = booking.first_name;
    lastNameInputEl.value = booking.last_name;
    phoneInputEl.value = booking.phone;
    dateInInputEl.value = booking.date_in;
    daysInputEl.value = booking.days;
    guestsInputEl.value = booking.guests;
}

// returns a booking object from the inputs values
const getBookingFromInputs = () => {
    return {
        last_name: lastNameInputEl.value,
        first_name: nameInputEl.value,
        phone: phoneInputEl.value,
        guests: guestsInputEl.value,
        date_in: dateInInputEl.value,
        days: daysInputEl.value,
    }
}

// clear the inputs values
const clearInputs = () => {
    formEditionEl.classList.remove("was-validated");
    nameInputEl.value = "";
    lastNameInputEl.value = "";
    phoneInputEl.value = "";
    dateInInputEl.value = "";
    daysInputEl.value = 1;
    guestsInputEl.value = 1;
}


// nextBookingId is the next id available for a new booking
// In first instance is calculated as the next id from the last element of bookings array
// By default bookings are sorted by id
const getNextBookingId = (bookings) => {
    if (nextBookingId == undefined) {
        nextBookingId = bookings[bookings.length - 1].id;
    }
    return ++nextBookingId;
}

// given an booking id, return the booking index
const getIndexById = (id, bookings) => {
    return bookings.findIndex(booking => booking.id === id);
}

// FILTERS

// returns if the filter toggle is enabled
const isFilterEnabled = () => filterCheckboxEl.checked;

// enable/disable filter fields
const setFilterFieldsEnabled = (isEnabled) => {
    lastNameFilterEl.disabled = !isEnabled;
    lastNameFilterEl.value = "";
}

// enable/disable filter toggle
const setFilterEnabled = (isEnabled) => {
    isEnabled ? $('#filter-checkbox').bootstrapToggle('on') : $('#filter-checkbox').bootstrapToggle('off');
    setFilterFieldsEnabled(isEnabled);
}

// PROGRESS BAR

// Show overlay to progress bar
const showOverlay = (show) => show ?
    overlayEl.classList.remove("display-none") : overlayEl.classList.add("display-none");

// Show progress Bar
const showProgressBar = (duration, step) => {
    // show te overlay
    showOverlay(true);

    let increment = 0;
    const makeProgress = () => {
        if (increment < 100) {
            increment += step;
            progressBarEl.setAttribute("style", `width: ${increment.toString()}%`);
        }
        setTimeout(makeProgress, duration / (100 / step));
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
    showProgressBar(duration, stepProgressBar);
    setTimeout(() => {
        // hide the overlay of progressbar
        showOverlay(false);
        action();
        console.table(bookings);
    }, duration);
}

/* FIN CONTROLADO */

const addDays = (date, days) => {
    console.log("Entrada " + date);
    console.log("Entrada " + days);
    const copy = new Date(Number(date))
    copy.setDate(date.getDate() + days)
    return copy
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}


/* Esto es del createTableRow
// data - lo podria hacer asi, pero dependo del correcto orden de las propiedades en el objeto
// y ademas si tengo datos extras o para ser calculados, como el caso days, no puedo hacerlo
// de esta manera
for (const property in booking) {
    const tdEl = document.createElement("td");
    tdEl.innerText = booking[property];
    console.log(tdEl);
    trEl.appendChild(tdEl);
} */









mostrarPbBtnEl.addEventListener("click", () => {
    //showProgressBar(5000, 10);
    console.log(getNextBookingId(bookings));
});

/* Busqueda */
// ALTA y EDIT
//  Si esta el filtro activado, desactiva el filtro, limpia los campos de busqueda
//  y redibuja la tabla. Considero que si el nuevo booking no cumple las condiciones
// de los filtros, no debiese aparecer en la tabla, lo que se prestaria a confusion
// cuando hice click en aceptar



// Action when change the filter toggle
$('#filter-checkbox').change(() => {
    setFilterFieldsEnabled(filterCheckboxEl.checked)
    if (!filterCheckboxEl.checked) {
        fillTableBody(bookings);
    }
});




lastNameFilterEl.addEventListener("keyup", (e) => {
    //alert(e.target.value.toUpperCase());

    const bookingsFiltrado = bookings.filter(booking =>
        booking.last_name.toUpperCase().includes(lastNameFilterEl.value.toUpperCase())

    );
    fillTableBody(bookingsFiltrado);

})

// https://mockapi.io/

// considerar la opcion de cambiar el input oculto para el idBooking por una variable