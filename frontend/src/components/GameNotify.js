import React, { useEffect } from 'react'
import playAudio from '../functions/playAudio';

function GameNotify(props) {

    useEffect(() => {
        const consecutiveCorrect = document.querySelector('.game-header-notify').innerHTML;
        checkCorrect(consecutiveCorrect);
    }, [props.consecutive])

    const checkCorrect = (consecutiveCorrect) => {
        const notify = document.querySelector('.game-header-notify');
        switch (consecutiveCorrect) {
            case "0":
                notify.innerHTML = "Incorrect";
                break;
            case "1":
                notify.innerHTML = "Correct";
                break;
            case "2":
                notify.innerHTML = "Double Correct";
                playAudio("/audio/double-kill-cs.mp3");
                break;
            case "3":
                notify.innerHTML = "Triple Correct";
                playAudio("/audio/triple_kill_dota.mp3");
                break;
            case "4":
                notify.innerHTML = "Quadruple Correct";
                playAudio("/audio/quadra-kill-lol.mp3");
                break;
            case "5":
                notify.innerHTML = "Penta Correct";
                playAudio("/audio/pentakill-lol.mp3");
                break;
            case "6":
                notify.innerHTML = "Are you hacking the game?";
                break;
            case "7":
                notify.innerHTML = "You're awesome";
                playAudio("/audio/awesome.mp3");
                break;
            case "8":
                notify.innerHTML = "Your memorizing ability is beyond your mind";
                break;
            case "9":
                notify.innerHTML = "LEGENDARY !!! Definitely, it's you.";
                playAudio('/audio/legendary.mp3');
                break;                          
            default:
                break;
        }
        setTimeout(() => notify.innerHTML = "", 1000);
    }

    return (
        <div className="game-header-notify">
            {props.consecutive}
        </div>
    )
}

export default GameNotify;