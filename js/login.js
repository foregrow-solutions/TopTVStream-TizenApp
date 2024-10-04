import { ANDROID_TV, API_URL, APP_VERSION, DEVICE_NAME, MAC_ADDRESS, SECRET_KEY } from './config.js';

// Function to fetch API data
const fetchApiData = async (url, body) => {
    try {
        const response = await fetch(url + "subscriber", {
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

        return await response.json();
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        return { success: false, message: 'Error fetching data. Please try again later.' };
    }
};

// Add spinner functions
const spinner = document.getElementById('spinner');

const showSpinner = () => {
    spinner.style.display = 'flex';
};

const hideSpinner = () => {
    spinner.style.display = 'none';
};

// Handle form submission
document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Get email from form input
    const email = document.getElementById('email').value.trim();

    if (email) {
        // Prepare device information payload
        const deviceInfo = {
            email: email,
            device_name: DEVICE_NAME,
            mac_address: MAC_ADDRESS,
            android_id: ANDROID_TV,
            app_version: APP_VERSION,
        };
        showSpinner();
        // Call API function with device info as body
        const apiResponse = await fetchApiData(API_URL, deviceInfo);
        hideSpinner();


        if (apiResponse && apiResponse.success) {
            // Redirect to OTP screen upon successful response
            window.location.href = 'otp.html';
        } else {
            // Display error message if API call fails
            alert(apiResponse.message || 'Failed to process request. Please try again.');
        }
    } else {
        alert('Please enter your email to proceed.');
    }
});
