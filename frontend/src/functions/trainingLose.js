import playAudio from './playAudio';

function trainingLose(stopwatch, gameContent, gameFooter, level) {
    playAudio('/audio/you-lose.mp3');
    stopwatch.clear();
    gameContent.innerHTML = `<div class="game-content">
        <img src="/fail.png" alt="fail" class="game-pass">
    <div>`;
    gameFooter.innerHTML = `<a href="/training" class="pass-button">Quay về</a>
        <a href="/train/${level}" class="fail-button">Thử lại</a>
    `;
}

export default trainingLose;