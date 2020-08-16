function playAudio(url) {
    const newAudio = new Audio(url);
    return newAudio.play();
}

export default playAudio;
