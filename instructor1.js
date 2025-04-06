document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.getElementById('databaseTable');
    const instructorName = 'Jelai Batumbakal';  
    let instructorDatabase = JSON.parse(localStorage.getItem(`instructor_${instructorName}`)) || [];

     
    function fetchData() {
        tableBody.innerHTML = '';
        instructorDatabase.forEach((booking, index) => {
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
                    <button  class="delete-button" onclick="deleteBooking(${index})">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

     
    window.deleteBooking = function (index) {
        if (confirm('Are you sure you want to delete this booking?')) {
            instructorDatabase.splice(index, 1);  
            localStorage.setItem(`instructor_${instructorName}`, JSON.stringify(instructorDatabase));  
            fetchData();  
            alert('Booking deleted successfully.');
        }
    };

    fetchData();
});