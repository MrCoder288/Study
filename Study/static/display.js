function startDisplay(words, speed) {
    let index = 0;
    function displayWord() {
        if (index < words.length) {
            document.getElementById('wordDisplay').textContent = words[index++];
            setTimeout(displayWord, 60000 / speed);  // Calculate delay based on words per minute
        }
    }
    displayWord();
}

document.addEventListener('DOMContentLoaded', function() {
    const words = JSON.parse(document.getElementById('wordsData').textContent);
    const speed = parseInt(document.getElementById('speedData').textContent) || 300;  
    startDisplay(words, speed);
});
