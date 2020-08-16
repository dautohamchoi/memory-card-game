import playAudio from './playAudio';

function youWin(stopwatch, gameContent, gameFooter, level) {
    playAudio('/audio/victory.mp3');
    stopwatch.clear();
    gameContent.innerHTML = `<div class="game-content">
        <img src="/complete.png" alt="win" class="game-pass">
    <div>`;
    gameFooter.innerHTML = `<a href="/games/${level}"  class="pass-button">Tiếp tục</a>`;
};

export default youWin;