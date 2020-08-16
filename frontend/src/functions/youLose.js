import playAudio from './playAudio';

function youLose(stopwatch, gameContent, gameFooter) {
    playAudio('/audio/you-lose.mp3');
    stopwatch.clear();
    gameContent.innerHTML = `<div class="game-content">
        <img src="/fail.png" alt="fail" class="game-pass">
    <div>`;
    gameFooter.innerHTML = `<a href="/games/1" class="fail-button">Thử lại</a>`;
}

export default youLose;