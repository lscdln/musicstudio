document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.getElementById('databaseTable');
    const bookingForm = document.getElementById('bookingForm');
    const submitBtn = document.getElementById('submitBtn');
   


    // Data for dropdowns
    const instruments = ['string', 'wind', 'percussion', 'keyboard', 'electronic'];
    const subInstruments = {
        string: ['Violin', 'Guitar', 'Double Bass'],
        wind: ['Flute', 'Clarinet', 'Trumpet'],
        percussion: ['Snare Drum', 'Bass Drum', 'Xylophone'],
        keyboard: ['Piano', 'Organ', 'Harpsichord'],
        electronic: ['Electric Violin','Electric Guitar', 'Synthesizer']
    };
    const instructors = ['Jelai Batumbakal', 'Kate Zeno', 'Yayay Dimagiba', 'Joy Esgan', 'Boo Rhatjuts'];


    // Populate dropdowns
    function populateDropdown(selectElement, options, selectedOption = '') {
        selectElement.innerHTML = '<option value="">Select an option</option>';
        options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
            if (option === selectedOption) {
                opt.selected = true;
            }
            selectElement.appendChild(opt);
        });
    }


    function populateInstrumentDropdown(selectedInstrument = '') {
        const instrumentSelect = document.getElementById('instrument');
        populateDropdown(instrumentSelect, instruments, selectedInstrument);
        populateSubInstrumentDropdown(selectedInstrument);
    }


    function populateSubInstrumentDropdown(selectedInstrument, selectedSubInstrument = '') {
        const subInstrumentSelect = document.getElementById('subInstrument');
        const subInstrumentOptions = subInstruments[selectedInstrument] || [];
        populateDropdown(subInstrumentSelect, subInstrumentOptions, selectedSubInstrument);
    }


    function populateInstructorDropdown(selectedInstructor = '') {
        const instructorSelect = document.getElementById('instructor');
        populateDropdown(instructorSelect, instructors, selectedInstructor);
    }


     
    populateInstrumentDropdown();
    populateInstructorDropdown();


    
    document.getElementById('instrument').addEventListener('change', function () {
        populateSubInstrumentDropdown(this.value);
    });


     
    let database = JSON.parse(localStorage.getItem('bookings')) || [];
    let editIndex = null;  


    
window.editData = function (index) {
    const booking = database[index];
    if (booking.approved) {
        alert('You cannot edit an approved booking.');
        return;
    }
    document.getElementById('firstName').value = booking.firstName;
    document.getElementById('middleName').value = booking.middleName;
    document.getElementById('lastName').value = booking.lastName;
    document.getElementById('email').value = booking.email;
    document.getElementById('phoneNumber').value = booking.phone;
    document.getElementById('date').value = booking.date;
    document.getElementById('message').value = booking.notes;


     
    populateInstrumentDropdown(booking.instrument);
    populateSubInstrumentDropdown(booking.instrument, booking.subInstrument);


     
    populateInstructorDropdown(booking.instructor);


    editIndex = index;  
    submitBtn.textContent = 'Update Booking';  
};


// Update the fetchData function to include the Edit button
function fetchData() {
    tableBody.innerHTML = '';
    database.forEach((booking, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${booking.firstName} ${booking.middleName || ''} ${booking.lastName}</td>
            <td>${booking.email}</td>
            <td>${booking.phone}</td>
            <td>${booking.instrument}</td>
            <td>${booking.subInstrument || ''}</td>
            <td>${booking.instructor}</td>
            <td>${booking.date}</td>
            <td>${booking.notes || ''}</td>
            <td class="actions">
                ${booking.approved ? '<span>Already Approved</span>' : `<button class= "approve-button" onclick="approveBooking(${index})">Approve</button>`}
                <button class="delete-button" onclick="deleteData(${index})">Delete</button>
                <button class="edit-button" onclick="editData(${index})" ${booking.approved ? 'disabled' : ''}>Edit</button>
            </td>
        `;
        if (booking.approved) {
            row.style.backgroundColor = '#d4edda';  
        }
        tableBody.appendChild(row);
    });
}




// Function to approve a booking
window.approveBooking = function (index) {
    const booking = database[index];
    booking.approved = true;  


     
    const instructor = booking.instructor;
    let instructorDatabase = JSON.parse(localStorage.getItem(`instructor_${instructor}`)) || [];
    instructorDatabase.push(booking);
    localStorage.setItem(`instructor_${instructor}`, JSON.stringify(instructorDatabase));


     
    localStorage.setItem('bookings', JSON.stringify(database));
    fetchData();
    alert(`Booking for ${booking.firstName} ${booking.lastName} has been approved.`);
};






    // Update data
    function handleFormSubmit(event) {
        event.preventDefault();


        const firstName = document.getElementById('firstName').value;
        const middleName = document.getElementById('middleName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phoneNumber').value;
        const instrument = document.getElementById('instrument').value;
        const subInstrument = document.getElementById('subInstrument').value;
        const instructor = document.getElementById('instructor').value;
        const date = document.getElementById('date').value;
        const notes = document.getElementById('message').value;


        const newBooking = { firstName, middleName, lastName, email, phone, instrument, subInstrument, instructor, date, notes, approved: false };


       // Update existing booking
       database[editIndex] = newBooking;
       editIndex = null;  


        localStorage.setItem('bookings', JSON.stringify(database));
        fetchData();  
        bookingForm.reset();  
        populateInstrumentDropdown();  
        populateInstructorDropdown();  
    }


    // Edit a booking
    window.editData = function (index) {
        const booking = database[index];
        document.getElementById('firstName').value = booking.firstName;
        document.getElementById('middleName').value = booking.middleName;
        document.getElementById('lastName').value = booking.lastName;
        document.getElementById('email').value = booking.email;
        document.getElementById('phoneNumber').value = booking.phone;
        document.getElementById('date').value = booking.date;
        document.getElementById('message').value = booking.notes;


         
        populateInstrumentDropdown(booking.instrument);
        populateSubInstrumentDropdown(booking.instrument, booking.subInstrument);


         
        populateInstructorDropdown(booking.instructor);


        editIndex = index;  
        submitBtn.textContent = 'Update Booking'; 
    };


 // Delete a booking
window.deleteData = function (index) {
    if (confirm('Are you sure you want to delete this booking?')) {
        
        const bookingToDelete = database[index];
        const instructor = bookingToDelete.instructor;


        
        let instructorDatabase = JSON.parse(localStorage.getItem(`instructor_${instructor}`)) || [];
        instructorDatabase = instructorDatabase.filter(
            (booking) => booking.email !== bookingToDelete.email || booking.date !== bookingToDelete.date
        );
        localStorage.setItem(`instructor_${instructor}`, JSON.stringify(instructorDatabase));


         
        database.splice(index, 1);
        localStorage.setItem('bookings', JSON.stringify(database));


        
        alert(`Booking deleted from both admin and instructor databases.`);


         
        fetchData();
    }
};


    // Approve a booking
    window.approveData = function (index) {
        if (confirm('Are you sure you want to approve this booking?')) {
            database[index].approved = true;  
            localStorage.setItem('bookings', JSON.stringify(database));  
            fetchData();  
        }
    };


     
    fetchData();
    bookingForm.addEventListener('submit', handleFormSubmit);
});