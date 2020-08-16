import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

import GameNav from '../components/GameNav';
import accurateInterval from 'accurate-interval';

import playAudio from '../functions/playAudio';
import CarouselDisplay from '../components/CarouselDisplay';
import youLose from '../functions/youLose';
import youWin from '../functions/youWin';
import { useSelector, useDispatch } from 'react-redux';
import { gameLogAction, resetLogAction } from '../actions/gameLogAction';
import { update } from '../actions/userAction';
import calculateScore from '../functions/calculateScore';
import GameNotify from '../components/GameNotify';





function GameThree(props) {
    // make Dr.Boom great again.
    const levelGame = 3;
    const scoreUnit = 5;

    const { gameState } = useSelector(state => state.gameLog);
    const userSignin = useSelector(state => state.userSignin);
    const { userInfo } = userSignin;

    const gameContent = document.querySelector('.game-content');
    const gameFooter = document.querySelector('.game-footer');

    const [totalCardsFound, setTotalCardsFound] = useState(0);

    const [hitPositionId, setHitPositionId] = useState('');

    const [score, setScore] = useState(gameState.score);
    const [highConsecutive, setHighConsecutive] = useState(0);
    const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [stopwatch, setStopwatch] = useState('');
    
    const [timer, setTimer] = useState(50);
    const [heart, setHeart] = useState(10);

    const pathname = props.location.pathname;
    const levelAccessing = pathname[pathname.length - 1];

    const dispatch = useDispatch();

    const beginGame = () => {
        setIsPlaying(true);
        setStopwatch(
            accurateInterval(function() {
                    setTimer((prevTimer) => prevTimer - 1);
                }, 1000
                , {aligned: true, immediate: true})
        );
        // if users reload the page, they will redirect to the first level
        // this prevents an action when users are about to lose and they decide to reload. 
        dispatch(resetLogAction());
    }

    useEffect(() => {
        if (gameState.level !== levelAccessing) {
            props.history.push("/games/" + gameState.level);
        }
    }, []);
    
    useEffect(() => {
        // check whether users win a game or not
        if (totalCardsFound === 30 && highConsecutive >= 9) {
            setScore(calculateScore(score, timer, heart, levelGame));
            // we have to separate to make sure that calculating total score before dispatch
            const totalScore = calculateScore(score, timer, heart, levelGame);
            youWin(stopwatch, gameContent, gameFooter, levelGame + 1);
            dispatch(gameLogAction(levelGame + 1, totalScore));
        }
        return () => {
            //
        }
    }, [totalCardsFound, highConsecutive]);
    
    // separate to make sure that it not affect each other, which can cause re-rendering many times.
    useEffect(() => {
        if (consecutiveCorrect > highConsecutive) {
            setHighConsecutive(consecutiveCorrect);
        }
        if (consecutiveCorrect > 1) {
            setScore((prev) => prev + 2 * consecutiveCorrect);
        }
    }, [consecutiveCorrect]);        

    // check timer when it's over having become synonymous with users lose.
    useEffect(() => { 
        randomPlace();
        if (timer <= 0) {
            youLose(stopwatch, gameContent, gameFooter);
            dispatch(update({ 
                userId: userInfo._id,
                level: levelGame,
                score 
            }));
            dispatch(resetLogAction());
        }
        return () => {
            //
        }
    }, [timer]);

    const clickRight = (e) => {
        const cardClicked = e.target;
        const cardId = cardClicked.id;
        // users can not click on the white card, it can cause losing consecutive correct.
        if (!cardClicked.classList.contains('bg-white-card')) {
            if (cardId === hitPositionId) {
                playAudio("/audio/gun-shot.mp3");
                // preventing increase score when users click consecutively the same real card within 1 second
                setHitPositionId('');
                cardClicked.classList.remove('bg-boom', 'bg-card-back');
                cardClicked.classList.add('bg-white-card');

                 // make sure that these code always place below
                // it ensures that these code on top can run before render
                setScore((prevScore) => prevScore + scoreUnit);
                setConsecutiveCorrect((prev) => prev + 1)
                setTotalCardsFound((prevNum) => prevNum + 1);
            } else {
                playAudio("/audio/incorrect.mp3");
                setConsecutiveCorrect(0);
                if (heart > 1) {
                    setHeart((prev) => prev - 1);
                } else {
                    setHeart((prev) => prev - 1);
                    youLose(stopwatch, gameContent, gameFooter);
                    dispatch(update({ 
                        userId: userInfo._id,
                        level: levelGame,
                        score 
                    }));
                    dispatch(resetLogAction());
                }
            }
        }
    }

    const randomPlace = () => {
        const cards = document.querySelectorAll('.game-cards');
        cards.forEach(card => {
            card.classList.remove('bg-boom', 'bg-boom-fake', 'bg-white-card');
            card.classList.add('bg-card-back');
        });
        const randomFakeOne = cards[Math.floor(Math.random() * 18)];
        randomFakeOne.classList.add('bg-boom-fake');
        const randomFakeTwo = cards[Math.floor(Math.random() * 18)];
        randomFakeTwo.classList.add('bg-boom-fake');
        const randomFakeThree = cards[Math.floor(Math.random() * 18)];
        randomFakeThree.classList.add('bg-boom-fake');
        const randomFakeFour = cards[Math.floor(Math.random() * 18)];
        randomFakeFour.classList.add('bg-boom-fake');
        // random position of real Dr.boom which users should click
        const randomPosition = cards[Math.floor(Math.random() * 18)];
        randomPosition.classList.add('bg-boom');
        // assigning the id of randomPosition to hitPosition
        setHitPositionId(randomPosition.id);

    }


    return (
        <div className="three-screen">
            <Navbar></Navbar>
            <div className="game-container">
                <GameNav score={score}
                    level={levelGame}
                    timer={timer}
                    heart={heart}
                    ></GameNav>
                <div className="game-header"
                    style={isPlaying ? {display: "block"} : {display: "none"}}>
                    <GameNotify consecutive={consecutiveCorrect}></GameNotify>
                </div>
                <div className="game-content" 
                   style={isPlaying ? {display: "flex"} : {display: "none"}}>
                    <div className="game-cards bg-card-back" id="0"
                        onMouseUp={(e) => clickRight(e)}></div>
                    <div className="game-cards bg-card-back" id="1"
                        onMouseUp={(e) => clickRight(e)}></div>
                    <div className="game-cards bg-card-back" id="2"
                        onMouseUp={(e) => clickRight(e)}></div>
                    <div className="game-cards bg-card-back" id="3"
                        onMouseUp={(e) => clickRight(e)}></div>
                    <div className="game-cards bg-card-back" id="4"
                        onMouseUp={(e) => clickRight(e)}></div>
                    <div className="game-cards bg-card-back" id="5"
                        onMouseUp={(e) => clickRight(e)}></div>
                    <div className="game-cards bg-card-back" id="6"
                        onMouseUp={(e) => clickRight(e)}></div>
                    <div className="game-cards bg-card-back" id="7"
                        onMouseUp={(e) => clickRight(e)}></div>
                    <div className="game-cards bg-card-back" id="8"
                        onMouseUp={(e) => clickRight(e)}></div>
                    <div className="game-cards bg-card-back" id="9"
                        onMouseUp={(e) => clickRight(e)}></div>
                    <div className="game-cards bg-card-back" id="10"
                        onMouseUp={(e) => clickRight(e)}></div>
                    <div className="game-cards bg-card-back" id="11"
                        onMouseUp={(e) => clickRight(e)}></div>
                    <div className="game-cards bg-card-back" id="12"
                        onMouseUp={(e) => clickRight(e)}></div>
                    <div className="game-cards bg-card-back" id="13"
                        onMouseUp={(e) => clickRight(e)}></div>
                    <div className="game-cards bg-card-back" id="14"
                        onMouseUp={(e) => clickRight(e)}></div>
                    <div className="game-cards bg-card-back" id="15"
                        onMouseUp={(e) => clickRight(e)}></div>
                    <div className="game-cards bg-card-back" id="16"
                        onMouseUp={(e) => clickRight(e)}></div>
                    <div className="game-cards bg-card-back" id="17"
                        onMouseUp={(e) => clickRight(e)}></div>
                </div>
                <div className="game-instruction"
                    style={isPlaying ? {display: "none"} : {display: "block"}}>
                    <div className="carousel-container">
                        <CarouselDisplay
                            imageOne='/three/three_instruction_1.png'
                            imageTwo='/three/three_instruction_2.png'
                            imageThree='/three/three_instruction_3.png'
                            titleOne='Thử thách 3: Dr. Boom đang kêu gọi đội quân của hắn để tấn công thế giới một lần nữa.
                            Hãy tiêu diệt hắn trước khi mọi chuyện tồi tệ có thể xảy ra.'
                            titleTwo='Dr. Boom có khả năng phân thân ra tối đa 4 phiên bản. Để tiêu diệt hắn cần phải
                            bắn trúng 30 phát.'
                            titleThree='Cách phân biệt: Dr. Boom thiệt có viền màu vàng sáng chói. Nếu bạn bắn trật,
                            bạn sẽ mất một tim. Lưu ý bạn chỉ có 5 trái tim.'
                            >
                        </CarouselDisplay>
                    </div>
                    <button onClick={beginGame}
                        className="game-start-button">Bắt đầu
                    </button>
                </div>

                <div className="game-footer"
                    style={isPlaying ? {display: "flex"} : {display: "none"}}>
                    <div className="game-mission">
                        <div className="game-question">
                            <div className="question-content">
                                    <img src="/drboom.png" 
                                    alt="character"
                                    ></img>
                            </div>
                            <div className="question-content">
                                <p>
                                    <i>"MAKE DR.BOOM GREAT AGAIN". </i>
                                    Ta sẽ sớm quay trở lại và lợi hại hơn xưa.
                                     (Ghi chú: Tiêu diệt hắn với <b>
                                        {totalCardsFound < 31 ? 30 - totalCardsFound : 0}
                                    </b> lần nhấp chuột trúng
                                     và đạt được <b>combo 9</b> lần liên tiếp. Combo hiện tại: {highConsecutive} )
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default GameThree;