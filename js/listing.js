import { API_URL, TOKEN } from './config.js';
import RemoteControlManager from './remoteControlManager.js';

document.addEventListener('DOMContentLoaded', () => {

    const getQueryParams = () => {
        const params = new URLSearchParams(window.location.search);
        const queryParams = {};
        params.forEach((value, key) => {
            queryParams[key] = value;
        });
        return queryParams;
    };

    const fetchApiData = async (endpoint, body) => {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': TOKEN,
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error(`Error fetching data from ${endpoint}:`, error);
            return null;
        }
    };

    const createChannelCard = (channel) => {
        const card = document.createElement('div');
        card.classList.add('listing-item');
        card.tabIndex = 0;
        card.setAttribute('stream-url', channel.stream_url);

        const img = document.createElement('img');
        img.src = channel.image;
        img.alt = channel.channel_name;

        const details = document.createElement('div');
        details.classList.add('listing-details');

        const title = document.createElement('h3');
        title.textContent = channel.channel_name;

        const description = document.createElement('p');
        description.textContent = channel.description || "Description not available.";

        details.appendChild(title);
        details.appendChild(description);
        card.appendChild(img);
        card.appendChild(details);

        return card;
    };

    const populateListingPage = (data, containerSelector, createElement) => {
        const listingSection = document.querySelector('.listing-page-section h2');
        if (!listingSection || listingSection.textContent.trim() !== 'Listing Page') return;

        const sectionList = document.getElementById(containerSelector);
        if (!sectionList) return;

        sectionList.innerHTML = '';

        data.forEach(item => {
            const element = createElement(item);
            sectionList.appendChild(element);
        });

        // Add event listeners to grid items
        document.querySelectorAll('.listing-item').forEach(item => {
            item.addEventListener('click', handleCardClick);
        });
    };

    const handleCardClick = (event) => {
        const movie = event.currentTarget.getAttribute('stream-url');
        if (movie) {
            window.location.href = `player.html?videoUrl=${encodeURIComponent(movie)}`;
        }
    };

    const init = async () => {
        try {
            const queryParams = getQueryParams();
            const channels = await fetchApiData('channels', queryParams);
            if (channels) {
                populateListingPage(channels, 'listing', createChannelCard);
            }
        } catch (error) {
            console.error('Error initializing application:', error);
        }
    };

    init();
});
