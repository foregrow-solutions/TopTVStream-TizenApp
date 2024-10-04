import { API_URL, TOKEN } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    const fetchApiData = async () => {
        try {
            const response = await fetch(`${API_URL} + "account"`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': TOKEN,
                },
                body: JSON.stringify({}),
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error(`Error fetching data from ${API_URL}:`, error);
            return null;
        }
    };

    const createAccountDetails = (account) => {
        const accountInfo = document.createElement('div');
        accountInfo.classList.add('account-info');

        const userInfo = document.createElement('h3');
        userInfo.textContent = 'User Information';

        const name = document.createElement('p');
        name.textContent = `Name: ${account.name}`;

        const email = document.createElement('p');
        email.textContent = `Email: ${account.email}`;

        const subscriptionPlan = document.createElement('p');
        subscriptionPlan.textContent = `Subscription Plan: ${account.subscription_plan}`;

        accountInfo.appendChild(userInfo);
        accountInfo.appendChild(name);
        accountInfo.appendChild(email);
        accountInfo.appendChild(subscriptionPlan);

        return accountInfo;
    };

    const populateAccountPage = (data, containerSelector, createElement) => {
        const sectionList = document.querySelector(containerSelector);
        if (!sectionList) return;

        const element = createElement(data);
        sectionList.appendChild(element);
    };

    const init = async () => {
        try {
            const accountDetails = await fetchApiData();
            if (accountDetails) {
                populateAccountPage(accountDetails, '.section', createAccountDetails);
            }
        } catch (error) {
            console.error('Error initializing application:', error);
        }
    };

    init();
});
