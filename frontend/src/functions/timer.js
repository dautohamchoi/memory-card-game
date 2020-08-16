import React from 'react';

function clock(timer) {
    let minutes = Math.floor(timer / 60);
    let seconds = timer - minutes * 60;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    const clock = document.getElementById("timer");
    if (clock) {
        return clock.innerText = minutes + ":" + seconds;
    }   
}

export default clock();