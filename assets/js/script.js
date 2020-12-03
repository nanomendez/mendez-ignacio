
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

const stepProgressBar = 5;
const durationProgressBar = 2000;


// labels del head de la tabla
labels = ["Apellido", "Nombre", "Teléfono", "Huéspedes", "Desde", "Días", "", ""];

let bookings = [
    {
        last_name: "Mendez",
        first_name: "Ignacio",
        phone: "0249154526755",
        guests: 2,
        date_in: "10/01/2021",
        days: 5
    },
    {
        last_name: "Lopez",
        first_name: "Florencia",
        phone: "0111526384095",
        guests: 5,
        date_in: "20/12/2020",
        days: 19
    },
    {
        last_name: "Gomez",
        first_name: "Juan Jose",
        phone: "025515263487",
        guests: 6,
        date_in: "08/02/2021",
        days: 9
    }
]

// dado las labels del head de la tabla, devuelve el nodo thead con sus respectivos td
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

// dado un un objeto booking y la propiedad, devuelve el nodo td con el valor de la propiedad en el objeto
const createTableTd = (booking, property) => {
    const tdEl = document.createElement("td");
    tdEl.innerText = booking[property];
    return tdEl;
}

// dado los valores de los inputs, retorna un objeto booking
const fillForm = (booking) => {
    formEditionEl.classList.remove("was-validated");
    nameInputEl.value = booking.first_name;
    lastNameInputEl.value = booking.last_name;
    phoneInputEl.value = booking.phone;
    dateInInputEl.value = booking.date_in;
    daysInputEl.value = booking.days;
    guestsInputEl.value = booking.guests;
}

// dado un objeto booking arma la tr y la devuelve
const createTableRow = (booking, index) => {
    const trEl = document.createElement("tr");

    trEl.appendChild(createTableTd(booking, 'first_name'));
    trEl.appendChild(createTableTd(booking, 'last_name'));
    trEl.appendChild(createTableTd(booking, 'phone'));
    trEl.appendChild(createTableTd(booking, 'guests'));
    trEl.appendChild(createTableTd(booking, 'date_in'));
    trEl.appendChild(createTableTd(booking, 'days'));

    // edit
    const tdEditEl = document.createElement("td");
    const buttonEditEl = document.createElement("button");
    buttonEditEl.setAttribute("type", "button");
    buttonEditEl.setAttribute("data-toggle", "modal");
    buttonEditEl.setAttribute("data-target", "#edit-booking-modal");
    buttonEditEl.innerText = "Editar";
    tdEditEl.appendChild(buttonEditEl);
    trEl.appendChild(tdEditEl);

    buttonEditEl.addEventListener("click", () => {
        titleModalEl.innerText = "Editar Reserva";
        // seteo el index del input oculto
        idBookingInputEl.setAttribute("value", index);
        // completo el formulario con la data
        fillForm(bookings[index]);
    })

    // delete
    const tdDeleteEl = document.createElement("td");
    const buttonDeleteEl = document.createElement("button");
    buttonDeleteEl.setAttribute("type", "button");
    buttonDeleteEl.setAttribute("data-toggle", "modal");
    buttonDeleteEl.setAttribute("data-target", "#delete-booking-modal");
    buttonDeleteEl.innerText = "Borrar";
    tdDeleteEl.appendChild(buttonDeleteEl);
    trEl.appendChild(tdDeleteEl);

    buttonDeleteEl.addEventListener("click", () => {
        // seteo el index del input oculto
        idBookingInputEl.setAttribute("value", index);
    })

    return trEl;
}



// dada la tabla de bookings, completa el tbody de la tabla
const fillTableBody = (tableData) => {
    bookingsTableBodyEl.innerHTML = "";
    tableData.forEach((element, index) =>
        bookingsTableBodyEl.appendChild(createTableRow(element, index)));
}

// addBooking: se invoca cuando es agregada una nueva reserva, 
const addBooking = booking => {

}

document.addEventListener("DOMContentLoaded", () => {
    // crea el thead y lo inserta en la table
    bookingsTableEl.appendChild(createTableHead(labels));
    // completa el tbody de la tabla con las reservas
    fillTableBody(bookings);
})







// dado los valores de los inputs, retorna un objeto booking
const getBookingFromInputs = () => {
    const name = nameInputEl.value;
    const lastName = lastNameInputEl.value;
    const phone = phoneInputEl.value;
    const dateIn = dateInInputEl.value;
    const days = daysInputEl.value;
    const guests = guestsInputEl.value;

    const booking = {
        last_name: lastName,
        first_name: name,
        phone: phone,
        guests: guests,
        date_in: dateIn,
        days: days
    }

    return booking;
}

// limpia los inputs
const clearInputs = () => {
    formEditionEl.classList.remove("was-validated");

    nameInputEl.value = "";
    lastNameInputEl.value = "";
    phoneInputEl.value = "";
    dateInInputEl.value = "";
    daysInputEl.value = 1;
    guestsInputEl.value = 1;
    
}

// al hacer click en agregar reserva
//    setea el titulo del modal
//    limpia los fields
//    setea -1 en el input oculto
addBookingButtonEl.addEventListener("click", () => {
    titleModalEl.innerText = "Nueva Reserva";
    clearInputs();
    idBookingInputEl.setAttribute("value", -1);
});

// action when submitting edit form
formEditionEl.addEventListener("submit", (e) => {
    e.preventDefault();
    // check validity of the input fields
    if(formEditionEl.checkValidity()) {
        // get booking object from input fields
        const booking = getBookingFromInputs();
        // if the hidden input value is -1 it will be a new booking, otherwise it will be a modification
        const idBooking = parseInt(idBookingInputEl.getAttribute("value"));
        idBooking === -1 ? bookings.push(booking) : bookings[idBooking] = booking;
        $('#edit-booking-modal').modal('hide');
        fillTableBody(bookings);
        showProgressBar(durationProgressBar, stepProgressBar);
    }
    formEditionEl.classList.add('was-validated');
});

// action when do click on delete button
okDeleteBtnEl.addEventListener("click", () => {
    const idBooking = parseInt(idBookingInputEl.getAttribute("value"));
    bookings = bookings.filter((element, index) => {
        return index !== idBooking;
    })
    fillTableBody(bookings);
    $('#delete-booking-modal').modal('hide');
});




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




/* Progress Bar */

const mostrarPbBtnEl = document.getElementById("mostrar-pb-btn");
const overlayEl = document.getElementsByClassName("overlay")[0];
const progressBarEl = document.getElementById("save-progress-bar");

const showProgressBar = (duration, step) => {
    overlayEl.classList.remove("display-none");

    let increment = 0;
    const makeProgress = () => {
        if(increment < 100){
            increment += step;
            progressBarEl.setAttribute("style", `width: ${increment.toString()}%`);
        }
        setTimeout(makeProgress, duration / (100 / step));
    }
    makeProgress();

    setTimeout(() => overlayEl.classList.add("display-none") , duration + 200);
}


mostrarPbBtnEl.addEventListener("click", () => {
    showProgressBar(5000, 10);
    
});

/* Busqueda */

const lastNameFilterEl = document.getElementById("last-name-filter-input");

const filterCheckboxEl = document.getElementById("filter-checkbox");

$('#filter-checkbox').change(() => {
    console.log(lastNameFilterEl.disabled);
    lastNameFilterEl.disabled = !filterCheckboxEl.checked;
    lastNameFilterEl.value = "";
})


lastNameFilterEl.addEventListener("keyup", (e) => {
    //alert(e.target.value.toUpperCase());
    
    const bookingsFiltrado = bookings.filter( booking => 
        booking.last_name.toUpperCase().includes(lastNameFilterEl.value.toUpperCase())
    
    );
    fillTableBody(bookingsFiltrado);

})

// https://mockapi.io/
