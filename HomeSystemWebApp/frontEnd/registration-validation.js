document.getElementById("registrationForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    let fullname = document.getElementById("fullname").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;
    let userType = document.getElementById("userType").value;
    let terms = document.getElementById("terms").checked;
    let errorMessage = document.getElementById("errorMessage");

    if (fullname === "" || email === "" || password === "" || confirmPassword === "" || userType === "") {
        errorMessage.textContent = "All fields are required!";
        return;
    }

    if (!email.includes("@") || !email.includes(".")) {
        errorMessage.textContent = "Enter a valid email!";
        return;
    }

    if (password.length < 6) {
        errorMessage.textContent = "Password must be at least 6 characters!";
        return;
    }

    if (password !== confirmPassword) {
        errorMessage.textContent = "Passwords do not match!";
        return;
    }

    if (!terms) {
        errorMessage.textContent = "You must agree to the Terms & Conditions!";
        return;
    }


	//creates the data object from the form to send to the backend via POST
	let formData = {	fullname, email, password, userType		};

    try {
        // Send form data to the server
        let response = await fetch("http://localhost:8080/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        let result = await response.json();

        if (response.ok) {
            alert(result.message || "Registration Successful!");
            document.getElementById("registrationForm").reset();
            errorMessage.textContent = "";
        } else {
            errorMessage.textContent = result.message || "An error occurred.";
        }

    } catch (error) {
        console.error("Error submitting form:", error);
        errorMessage.textContent = "An error occurred while submitting the form.";
    }

    
});

    // Show admin code field if Home Manager is selected
    document.getElementById('userType').addEventListener('change', function () {
        const adminField = document.getElementById('adminCodeField');
        if (this.value === 'homeManager') {
            adminField.classList.remove('hidden');
        } else {
            adminField.classList.add('hidden');
        }
    });

