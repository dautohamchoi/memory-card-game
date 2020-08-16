import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faHeart } from '@fortawesome/free-solid-svg-icons';


function GameNav(props) {
    useEffect(() => {
        const timer = document.getElementById('timer');
        const heart = document.getElementById('heart');
        if (props.timer === 10) {
            timer.style.color = 'red';
            playBeep();
        }
        if (props.heart === 10) {
            heart.style.color = 'orange';
        } else if (props.heart < 4) {
            heart.style.color = 'red';
        }
    }, [props.timer])
    //function to play "beep" audio when warning player
    function playBeep() {
        const beepAudio = new Audio(
        "https://cdn.glitch.com/5704b750-1fa7-45b6-bf7c-95dd0e46549f%2FBeepSound.wav?v=1589379626770"
        );
        beepAudio.play();
    }

    function clock(timer) {
        let minutes = Math.floor(timer / 60);
        let seconds = timer - minutes * 60;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        return minutes + ":" + seconds;     
    }

    return (
        <div className="game-nav">
            <div>
                Cấp. {props.level}
                <span className="nav-mode-training">{props.mode}</span>
            </div>
            <div>
                <FontAwesomeIcon icon={faClock}
                style={{color: "#FFC312"}}></FontAwesomeIcon>
                <span id="timer">{clock(props.timer)}</span>
            </div>
            <div className="game-nav-right">
                <div>
                    <FontAwesomeIcon icon={faHeart}
                    style={{color: "#eb2f06"}}></FontAwesomeIcon>
                        <span id="heart" style={{color: '#7bed9f'}}>{props.heart}</span>
                </div>
                <div>
                    <img src="/coin.png" alt=""
                        className="game-nav-icon"></img>
                    <span style={{color: 'yellow'}}>{props.score}</span>
                </div>
            </div>
        </div>
    )
}

export default GameNav;