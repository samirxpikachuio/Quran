document.addEventListener('DOMContentLoaded', function () {
    const verseContainer = document.getElementById('verse-container');
    const verseText = document.getElementById('verse-text');
    const verseInfo = document.getElementById('verse-info');

    let currentSurah = null;
    let currentVerseIndex = 0;
    let intervalId = null;

    function fetchRandomSurah() {
        fetch('https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/quran_en.json')
            .then(response => response.json())
            .then(data => {
                currentSurah = data[Math.floor(Math.random() * data.length)];
                currentVerseIndex = 0;
                displayCurrentVerse();
            });
    }

    function displayCurrentVerse() {
        if (!currentSurah) return;

        const currentVerse = currentSurah.verses[currentVerseIndex];
        verseContainer.classList.remove('show');

        setTimeout(() => {
            verseText.textContent = currentVerse.translation;
            verseInfo.textContent = `${currentSurah.transliteration} (${currentSurah.translation}) - Verse ${currentVerse.id}`;
            verseContainer.classList.add('show');
        }, 2000);
    }

    function showNextVerse() {
        if (!currentSurah) return;

        currentVerseIndex++;
        if (currentVerseIndex < currentSurah.verses.length) {
            displayCurrentVerse();
        } else {
            fetchRandomSurah();
        }
    }

    function showPreviousVerse() {
        if (!currentSurah) return;

        currentVerseIndex--;
        if (currentVerseIndex >= 0) {
            displayCurrentVerse();
        } else {
            currentVerseIndex = 0;
        }
    }

    function resetInterval() {
        clearInterval(intervalId);
        intervalId = setInterval(showNextVerse, 10000);
    }

    function handleTap(event) {
        const rect = verseContainer.getBoundingClientRect();
        const x = event.clientX - rect.left;

        if (x < rect.width / 2) {
            showPreviousVerse();
        } else {
            showNextVerse();
        }

        resetInterval();
    }

    let lastTapTime = 0;
    verseContainer.addEventListener('click', (event) => {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTapTime;

        if (tapLength < 300 && tapLength > 0) {
            handleTap(event);
        }

        lastTapTime = currentTime;
    });

    intervalId = setInterval(showNextVerse, 9000);
    fetchRandomSurah();
});
