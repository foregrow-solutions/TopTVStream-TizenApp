// plan.js
import { API_URL, TOKEN } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    const fetchApiData = async () => {
        try {
            const response = await fetch(`${API_URL}plans`, {
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
            console.error(`Error fetching data from ${API_URL}plans:`, error);
            return null;
        }
    };

    const createPlanCard = (plan) => {
        const card = document.createElement('div');
        card.classList.add('plan-item');
        card.tabIndex = 0;

        const title = document.createElement('h3');
        title.textContent = plan.name;

        const price = document.createElement('p');
        price.textContent = `$${plan.price}/month`;

        const description = document.createElement('p');
        description.textContent = plan.description;

        const button = document.createElement('button');
        button.classList.add('subscribe-button');
        button.textContent = 'Subscribe';

        card.appendChild(title);
        card.appendChild(price);
        card.appendChild(description);
        card.appendChild(button);

        return card;
    };

    const populatePlanPage = (data, containerSelector, createElement) => {
        const sectionList = document.querySelector(containerSelector);
        if (!sectionList) return;

        sectionList.innerHTML = '';

        data.forEach(item => {
            const element = createElement(item);
            sectionList.appendChild(element);
        });

        // Add event listeners to plan items
        document.querySelectorAll('.plan-item').forEach(item => {
            item.addEventListener('click', handleCardClick);
        });
    };

    const handleCardClick = (event) => {
        const planName = event.currentTarget.querySelector('h3').textContent;
        if (planName) {
            window.location.href = `subscribe.html?plan=${encodeURIComponent(planName)}`;
        }
    };

    const init = async () => {
        try {
            const plans = await fetchApiData();
            if (plans) {
                populatePlanPage(plans, '.plan-grid', createPlanCard);
            }
        } catch (error) {
            console.error('Error initializing application:', error);
        }
    };

    init();
});
