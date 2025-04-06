document.getElementById('bookingForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const booking = {
        firstName: document.getElementById('firstName').value,
        middleName: document.getElementById('middleName').value || '',
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phoneNumber').value || '',
        instrument: document.getElementById('instrument').value,
        subInstrument: document.getElementById('subInstrument').value || '',
        instructor: document.getElementById('instructor').value,
        date: document.getElementById('date').value,
        notes: document.getElementById('message').value || ''
    };

    const database = JSON.parse(localStorage.getItem('bookings')) || [];
    database.push(booking);
    localStorage.setItem('bookings', JSON.stringify(database));

    alert('Booking saved!');
    document.getElementById('bookingForm').reset();
});
