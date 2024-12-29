function submitApplication(e) {
    e.preventDefault(); // You can ignore this; prevents the default form submission!
    // TODO: Alert the user of the job that they applied for!
    let elements = document.getElementsByName('job');
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].checked == true) {
            alert("Thank you for applying to be a " + elements[i].value + "!");
        }
    }
}