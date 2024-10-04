// otp.js
import { API_URL, MAC_ADDRESS, SECRET_KEY } from './config.js';
import RemoteControlManager from './remoteControlManager.js';

// Function to fetch API data
const fetchApiData = async (url, body) => {
    try {
        const response = await fetch(url + "validate-subscriber", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'secret-key': SECRET_KEY,
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        return { success: false, message: 'Error fetching data. Please try again later.' };
    }
};

// Function to get query parameter by name
const getQueryParam = (name) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
};

// Retrieve email from URL
const email = getQueryParam('email');

// Select all OTP input fields
const otpInputs = document.querySelectorAll('.otp-input input');

// Add event listener to each OTP input field
otpInputs.forEach((input, index) => {
    input.addEventListener('input', (event) => {
        const inputLength = input.value.length;
        if (inputLength === 1) {
            // Move focus to the next input field if available
            if (index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            } else {
                // If it's the last input field, focus on the submit button
                document.getElementById('verify-button').focus();
            }
        }
    });

    // Add event listener to handle backspace key
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Backspace' && input.value === '') {
            // Move focus to the previous input field if available
            if (index > 0) {
                otpInputs[index - 1].focus();
            }
        }
    });
});

// Add spinner functions
const spinner = document.getElementById('spinner');

const showSpinner = () => {
    spinner.style.display = 'flex';
};

const hideSpinner = () => {
    spinner.style.display = 'none';
};

// Handle form submission
document.getElementById('otp-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Construct the OTP from input values
    const otp = Array.from(otpInputs).map(input => input.value).join('');

    // Verify OTP length and handle accordingly
    if (otp.length === 6) {
        // Example: Handle OTP verification logic here
        console.log('OTP:', otp);

        // Prepare the payload for API call
        const payload = {
            email: email,
            mac_address: MAC_ADDRESS,
            password: otp
        };

        showSpinner();

        // Call API function with OTP info as body
        const apiResponse = await fetchApiData(API_URL, payload);

        hideSpinner();

        if (apiResponse && apiResponse.success) {
            // Redirect to Login screen upon successful response
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('token', apiResponse.token);
            window.location.href = 'index.html';
        } else {
            // Display error message if API call fails
            alert(apiResponse.message || 'Failed to verify OTP. Please try again.');
        }

    } else {
        alert('Please enter the complete OTP.');
    }
});