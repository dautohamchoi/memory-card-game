import playAudio from './playAudio';

function trainingWin(stopwatch, gameContent, gameFooter) {
    playAudio('/audio/victory.mp3');
    stopwatch.clear();
    gameContent.innerHTML = `<div class="game-content">
        <img src="/complete.png" alt="win" class="game-pass">
    <div>`;
    gameFooter.innerHTML = `<a href="/training"  class="pass-button">Quay về</a>
        <a href="/games/1"  class="fail-button">Chơi thiệt</a>
    `;
};

export default trainingWin;