const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");

registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});

// Login form handler
document.querySelector('.sign-in form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.querySelector('.sign-in input[type="email"]').value;
    const password = document.querySelector('.sign-in input[type="password"]').value;
    const messageBox = document.querySelector('#message-box');

    if (!messageBox) {
        console.error('Message box element not found');
        return;
    }

    try {
        messageBox.className = 'message-box';
        messageBox.textContent = 'Logging in...';
        messageBox.style.display = 'block';

        const response = await fetch(`${config.apiUrl}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Show success message
            messageBox.textContent = 'Login successful!';
            messageBox.classList.add('success-message');
            
            // Store the token and email
            localStorage.setItem('token', data.token);
            localStorage.setItem('userEmail', data.user.email);
            
            // Redirect after showing success message
            setTimeout(() => {
                window.location.href = 'Calender.html';
            }, 150);
        } else {
            // Show error message
            messageBox.textContent = data.message || 'Login failed';
            messageBox.classList.add('error-message');
        }
    } catch (error) {
        console.error('Error:', error);
        if (messageBox) {
            messageBox.textContent = 'Connection error. Please try again.';
            messageBox.className = 'message-box error-message';
        }
    }
});

// Register form handler
document.querySelector('.sign-up form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('fullName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const messageBox = document.querySelector('#signup-message-box');

    try {
        messageBox.className = 'message-box';
        messageBox.textContent = 'Creating account...';
        messageBox.style.display = 'block';

        const response = await fetch(`${config.apiUrl}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                username: email, 
                email, 
                password, 
                fullName: name 
            })
        });

        const data = await response.json();

        if (response.ok) {
            messageBox.textContent = 'Registration successful! Please login.';
            messageBox.classList.add('success-message');
            setTimeout(() => {
                container.classList.remove("active");
            }, 1500);
            
            // Clear form
            e.target.reset();
        } else {
            messageBox.textContent = data.message || 'Registration failed';
            messageBox.classList.add('error-message');
        }
    } catch (error) {
        console.error('Error:', error);
        messageBox.textContent = 'Connection error. Please try again.';
        messageBox.className = 'message-box error-message';
    }
});

// Add this after your existing code
document.getElementById('updateServer').addEventListener('click', () => {
    const serverUrl = document.getElementById('serverUrl').value.trim();
    if (config.setApiUrl(serverUrl)) {
        alert('Server URL updated successfully!');
        // Update the input field with the stored value
        document.getElementById('serverUrl').value = config.apiUrl;
    } else {
        alert('Invalid server URL format. Please check and try again.');
    }
});

// Set initial value of server URL input if one exists
document.getElementById('serverUrl').value = config.apiUrl;

// Add at the beginning of the file
window.onload = () => {
    // Check if server URL is set
    if (!config.apiUrl) {
        window.location.href = 'setup.html';
        return;
    }
}
