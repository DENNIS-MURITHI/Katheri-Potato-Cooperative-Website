
const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");
const resetForm = document.getElementById("reset-form");

const loginButton = document.getElementById("login-button");
const forgotPasswordButton = document.getElementById("forgot-password-button");
const backToSignupButton = document.getElementById("back-to-signup");
const backToSignupFromResetButton = document.getElementById("back-to-signup-from-reset");

// Function to switch to login form
loginButton.addEventListener("click", function() {
    signupForm.style.display = "none";
    loginForm.style.display = "block";
    resetForm.style.display = "none";
});

// Function to switch to reset password form
forgotPasswordButton.addEventListener("click", function() {
    signupForm.style.display = "none";
    loginForm.style.display = "none";
    resetForm.style.display = "block";
});

// Function to go back to signup form
backToSignupButton.addEventListener("click", function() {
    signupForm.style.display = "block";
    loginForm.style.display = "none";
    resetForm.style.display = "none";
});

// Function to go back to signup from reset form
backToSignupFromResetButton.addEventListener("click", function() {
    signupForm.style.display = "block";
    loginForm.style.display = "none";
    resetForm.style.display = "none";
});

// Display login form by default on page load
window.onload = function() {
    loginForm.style.display = "block";
    signupForm.style.display = "none";
    resetForm.style.display = "none";
};

// Handle signup form submission
document.querySelector("#signup-form form").addEventListener('submit', async function(event) {
    event.preventDefault(); 

    const fullName = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const password = this.querySelector('input[type="password"]').value;

    try {
        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                full_name: fullName,
                email: email,
                password: password,
            }),
        });

        const data = await response.json();
        alert(data.message);
        if (data.message === 'User registered successfully.') {
            loginForm.style.display = 'block';
            signupForm.style.display = 'none';
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error registering user.');
    }
});

// Handle login form submission
document.querySelector("#login-form form").addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission

    const email = this.querySelector('input[type="email"]').value;
    const password = this.querySelector('input[type="password"]').value;

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });

        const data = await response.json();
        alert(data.message);
        if (data.message === 'Login successful.') {
            // Store user info in localStorage
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            
            // Redirect to home page
            window.location.href = '/home.html';
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error logging in.');
    }
});

// Handle reset password form submission
document.querySelector("#reset-form form").addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission

    const email = this.querySelector('input[type="email"]').value;
    const newPassword = prompt("Enter your new password:");

    try {
        const response = await fetch('http://localhost:3000/api/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                newPassword: newPassword,
            }),
        });

        const data = await response.json();
        alert(data.message);
        if (data.message === 'Reset link sent.') {
            resetForm.style.display = 'none';
            loginForm.style.display = 'block'; 
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error sending reset link.');
    }
}); 


