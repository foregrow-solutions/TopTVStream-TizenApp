export default class RemoteControlManager {
    constructor() {
        this.updateFocusableElements();
        this.videoElement = document.querySelector('video');
        this.currentFocusIndex = 0;

        if (this.focusableElements.length > 0) {
            this.focusableElements[this.currentFocusIndex].focus();
        }

        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    updateFocusableElements() {
        this.focusableElements = Array.from(document.querySelectorAll('.nav-link, .quick-channel-card, .language-card, .listing-item, video, input, button, a'));
    }

    moveFocus(delta) {
        this.focusableElements[this.currentFocusIndex].blur();
        this.currentFocusIndex = (this.currentFocusIndex + delta + this.focusableElements.length) % this.focusableElements.length;
        this.focusableElements[this.currentFocusIndex].focus();

        const isSlide = this.focusableElements[this.currentFocusIndex].classList.contains('slide');
        if (isSlide) {
            this.focusableElements[this.currentFocusIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        } else if (this.focusableElements[this.currentFocusIndex].classList.contains('language-card')) {
            this.focusableElements[this.currentFocusIndex].scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        } else {
            this.focusableElements[this.currentFocusIndex].scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        }
    }

    handleKeyDown(event) {
        switch (event.keyCode) {
            case 37:
                this.moveFocus(-1);
                break;
            case 38:
                this.moveFocus(-4);
                break;
            case 39:
                this.moveFocus(1);
                break;
            case 40:
                this.moveFocus(4);
                break;
            case 13:
                this.focusableElements[this.currentFocusIndex].click();
                togglePlayPause();
                break;
            case 80:
                this.togglePlayPause();
                break;
            case 83:
                this.stop();
                break;
            case 10009:
                this.back();
                break;
            case 70:
                this.forward();
                break;
            case 82:
                this.refresh();
                break;
            default:
                console.log('Unhandled key code:', event.keyCode);
                break;
        }
    }

    togglePlayPause() {
        if (this.videoElement.paused) {
            this.play();
        } else {
            this.pause();
        }
    }

    play() {
        this.videoElement.play();
        console.log('Play action triggered');
    }

    pause() {
        this.videoElement.pause();
        console.log('Pause action triggered');
    }

    stop() {
        this.videoElement.pause();
        this.videoElement.currentTime = 0;
        console.log('Stop action triggered');
    }

    back() {
        console.log('Back action triggered');
        window.history.back(); // Perform back navigation or exit application
    }

    forward() {
        console.log('Forward action triggered');
        // Perform forward navigation or any other action
    }

    refresh() {
        console.log('Refresh action triggered');
        window.location.reload();
    }
}

// Initialize the RemoteControlManager when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    const remoteControlManager = new RemoteControlManager();
    document.addEventListener('DOMNodeInserted', () => {
        remoteControlManager.updateFocusableElements();
    });
});
