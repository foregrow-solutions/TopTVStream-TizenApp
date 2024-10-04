import { API_URL, TOKEN } from './config.js';
import { setToken, getToken } from './localStorageUtil.js';

document.addEventListener('DOMContentLoaded', () => {

    const fetchApiData = async (endpoint) => {
        try {
            const token = getToken();
            const response = await fetch(`${API_URL}${endpoint}`, {
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
            console.error(`Error fetching data from ${endpoint}:`, error);
            return null;
        }
    };

    const checkLoginStatus = () => {
        return localStorage.getItem('isLoggedIn') === 'true';
    };

    const checkFirstTimeUse = () => {
        return localStorage.getItem('isFirstTimeUse') !== 'false';
    };

    const updateNavLinks = () => {
        const navLinks = document.getElementById('nav-links');
        navLinks.innerHTML = '';

        if (checkLoginStatus()) {
            navLinks.innerHTML += `
                <li>
                    <a href="plan.html" class="nav-link" tabindex="0">
                        <img src="images/tv.png" alt="Plans Icon" class="nav-icon"> Plans
                    </a>
                </li>
                <li>
                    <a href="account.html" class="nav-link" tabindex="0">
                        <img src="images/profile.png" alt="Accounts Icon" class="nav-icon"> Accounts
                    </a>
                </li>
            `;
        } else {
            navLinks.innerHTML += `
                <li>
                    <a href="login.html" class="nav-link" tabindex="0">
                        <img src="images/profile.png" alt="Login Icon" class="nav-icon"> Sign In
                    </a>
                </li>
            `;
        }
    };

    const handleFirstTimeUse = () => {
        if (checkFirstTimeUse()) {
            localStorage.setItem('isFirstTimeUse', 'false');
            window.location.href = 'login.html';
        }
    };

    const createSlide = (movie) => {
        const slide = document.createElement('div');
        slide.classList.add('slide');
        slide.tabIndex = 0;

        const img = document.createElement('img');
        img.src = movie.image;
        img.alt = movie.title;

        const banner = document.createElement('div');
        banner.classList.add('banner');
        banner.innerHTML = `<h1>${movie.title}</h1>`;

        slide.appendChild(img);
        slide.appendChild(banner);

        return slide;
    };

    const createQuickChannelCard = (channel) => {
        // Create the main card container
        const card = document.createElement('div');
        card.classList.add('quick-channel-card');
        card.setAttribute('stream-url', channel.stream_url);
        card.tabIndex = 0;

        // Create the image container
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image-container');

        // Create the image element
        const img = document.createElement('img');
        img.src = channel.image;
        img.alt = channel.insert_language;
        img.classList.add('card-image');

        // Create overlay for image
        const overlay = document.createElement('div');
        overlay.classList.add('overlay');

        // Append image and overlay to the container
        imageContainer.appendChild(img);
        imageContainer.appendChild(overlay);
        card.appendChild(imageContainer);

        return card;
    };

    const createLanguageCard = (language) => {
        // Create the main card container
        const card = document.createElement('div');
        card.classList.add('language-card');
        card.tabIndex = 0;
        card.setAttribute('data-language', language.insert_language);

        // Create the image container
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image-container');

        // Create the image element
        const img = document.createElement('img');
        img.src = language.image;
        img.alt = language.insert_language;
        img.classList.add('card-image');

        // Create overlay for image
        const overlay = document.createElement('div');
        overlay.classList.add('overlay');

        // Create a description container for language name
        const description = document.createElement('div');
        description.classList.add('description');
        description.textContent = language.insert_language;

        // Append image, overlay, and description to the container
        imageContainer.appendChild(img);
        imageContainer.appendChild(overlay);
        card.appendChild(imageContainer);
        card.appendChild(description);

        return card;
    };

    const populateSection = (data, containerSelector, createElement) => {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        container.innerHTML = '';

        data.forEach(item => {
            const element = createElement(item);
            container.appendChild(element);
        });
    };

    const handleGridItemClick = (event) => {
        const { language } = event.target.dataset;
        const player = event.currentTarget.getAttribute('stream-url');
        if (language) {
            window.location.href = `listing.html?language=${encodeURIComponent(language)}`;
        }
        if (player) {
            window.location.href = `player.html?videoUrl=${encodeURIComponent(player)}`;
        }
    };

    const initializeSlider = () => {
        const slides = document.querySelectorAll('.slide');
        let currentSlide = 0;

        const showSlide = (index) => {
            const offset = -index * 100;
            slides.forEach(slide => {
                slide.style.transform = `translateX(${offset}%)`;
            });
        };

        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        };

        setInterval(nextSlide, 3000);
        showSlide(currentSlide);
    };

    const init = async () => {
        try {
            const [featured, language, quickWatch] = await Promise.all([
                fetchApiData('banners'),
                fetchApiData('languages'),
                fetchApiData('quick-channels')
            ]);

            if (featured) {
                populateSection(featured, '.featured .slider', createSlide);
            }
            if (quickWatch) {
                populateSection(quickWatch, '#quick-channel-list', createQuickChannelCard);
            }
            if (language) {
                populateSection(language, '#language-list', createLanguageCard);
            }
            initializeSlider();
        } catch (error) {
            console.error('Error initializing application:', error);
        } finally {
        }

        document.querySelectorAll('.quick-channel-card, .language-card').forEach(item => {
            item.addEventListener('click', handleGridItemClick);
        });
    };

    handleFirstTimeUse();
    updateNavLinks();
    init();
});
