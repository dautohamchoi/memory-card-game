function calculateScore(score, timer, heart, levelGame) {
    return score + timer * levelGame + 2 * heart * levelGame;
}

export default calculateScore;