let isPaused = false;
let currentIndex = 0;
let words = [];
let speed = 300;

function cleanText(text) {
    return text.split(/\n{2,}/)
               .map(paragraph => paragraph.replace(/\s+/g, ' ').trim())
               .join('\n\n');
}

function updateWpmDisplay() {
    document.getElementById('wpmDisplay').textContent = `WPM: ${speed}`;
}

function increaseWpm() {
    speed += 1;
    updateWpmDisplay();
}

function decreaseWpm() {
    if (speed > 1) { // Prevent WPM from going below 1
        speed -= 1;
        updateWpmDisplay();
    }
}

function startDisplay(text, newSpeed) {
    isPaused = false;
    currentIndex = 0;
    speed = newSpeed || speed;
    const cleanedText = cleanText(text);
    words = cleanedText.split(/\s+/);
    updateWpmDisplay();
    displayWord();
}

function displayWord() {
    if (currentIndex < words.length && !isPaused) {
        let displayText = words[currentIndex++];
        
        if (displayText === '') {
            displayText = '[Paragraph Break]';
        }
        
        document.getElementById('wordDisplay').textContent = displayText;
        setTimeout(displayWord, 60000 / speed);
    }
}

function pauseResume() {
    isPaused = !isPaused;
    if (!isPaused) {
        displayWord();
    }
    document.getElementById('pauseButton').textContent = isPaused ? 'Resume' : 'Pause';
}

function rewind() {
    currentIndex = 0;
    if (isPaused) {
        document.getElementById('wordDisplay').textContent = words[currentIndex];
    }
}

function uploadNewFile() {
    window.location.href = 'http://localhost:3000/upload.html';
}

document.addEventListener('DOMContentLoaded', function() {
    const text = document.getElementById('wordsData').textContent;
    speed = parseInt(document.getElementById('speedData').textContent) || 300;
    startDisplay(text, speed);

    document.getElementById('pauseButton').addEventListener('click', pauseResume);
    document.getElementById('rewindButton').addEventListener('click', rewind);
    document.getElementById('uploadButton').addEventListener('click', uploadNewFile);
    document.getElementById('increaseWpmButton').addEventListener('click', increaseWpm);
    document.getElementById('decreaseWpmButton').addEventListener('click', decreaseWpm);
});

