import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import GameNav from '../components/GameNav';
import accurateInterval from 'accurate-interval';
import playAudio from '../functions/playAudio';
import CarouselDisplay from '../components/CarouselDisplay';
import { useSelector, useDispatch } from 'react-redux';
import { gameAction } from '../actions/gameAction';
import { CircularProgress } from '@material-ui/core';
import GameNotify from '../components/GameNotify';
import trainingLose from '../functions/trainingLose';
import trainingWin from '../functions/trainingWin';
import calculateScore from '../functions/calculateScore';




function TrainingOne(props) {
    const levelGame = 1;
    const scoreUnit = 10;

    const { cards: cardsOne, loading, error } = useSelector(state => state.gameList);


    const gameContent = document.querySelector('.game-content');
    const gameFooter = document.querySelector('.game-footer');

    const [cardsChosen, setCardsChosen] = useState([]);
    const [cardsIdChosen, setCardsIdChosen] = useState([]);
    const [totalCardsFound, setTotalCardsFound] = useState(0);
    const [cardsIdFound, setCardsIdFound] = useState([]);

    const [score, setScore] = useState(0);
    const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [stopwatch, setStopwatch] = useState('');
    
    const [timer, setTimer] = useState(60);
    const [heart, setHeart] = useState(30);

    const dispatch = useDispatch();

    const beginGame = () => {
        setIsPlaying(true);
        setStopwatch(
            accurateInterval(function() {
                    setTimer((prevTimer) => prevTimer - 1);
                }, 1000
                , {aligned: true, immediate: true})
        );
    }

    useEffect(() => {
        dispatch(gameAction(levelGame));

        return () => {
            //
        }
    }, [])

    useEffect(() => {
        // check whether users win a game or not
        if (totalCardsFound === 9) {
            setScore(calculateScore(score, timer, heart, levelGame));
            trainingWin(stopwatch, gameContent, gameFooter);
        }
        return () => {
            //
        }
    }, [totalCardsFound]);

    // separate to make sure that it not affect each other, which can cause re-rendering many times.
    useEffect(() => {
        if (consecutiveCorrect > 1) {
            setScore((prev) => prev + scoreUnit * consecutiveCorrect);
        }
    }, [consecutiveCorrect]);

    // check timer when it's over having become synonymous with users lose.
    useEffect(() => { 
        if (timer === 0) {
            trainingLose(stopwatch, gameContent, gameFooter, levelGame);
        }
        return () => {
            //
        }
    }, [timer]);

    // to change from hidden card to exposed card.
    const flipCard = (e) => {
        const cardClicked = e.target;
        const cardId = cardClicked.dataset.id;
        if (cardsChosen.length < 2 // preventing users accidentally click so quickly before checkForMatch
            && !cardsIdChosen.includes(cardId) // preventing users double click the same card
            && !cardsIdFound.includes(cardId) // preventing users click these cards found.
            ) {
            cardsChosen.push(cardsOne[cardId].name);
            cardsIdChosen.push(cardId);
            cardClicked.setAttribute('src', cardsOne[cardId].src)
            if (cardsChosen.length === 2) {
                setTimeout(checkForMatch, 250);
            }
        }
    }

    const checkForMatch = () => {
        const cards = document.querySelectorAll('.game-cards');
        let optionOneId = cardsIdChosen[0];
        let optionTwoId = cardsIdChosen[1];
        // check name of twos card whether they are match or not
        if (cardsChosen[0] === cardsChosen[1]) {
            cards[optionOneId].setAttribute('src', '/whiteImage.png');
            cards[optionTwoId].setAttribute('src', '/whiteImage.png');
            cards[optionOneId].style.opacity = "0.01";
            cards[optionTwoId].style.opacity = "0.01";
            // change cursor to make users feeling that cards disappeared
            cards[optionOneId].style.cursor = "default";
            cards[optionTwoId].style.cursor = "default";
            cardsIdFound.push(optionOneId);
            cardsIdFound.push(optionTwoId);

            // make sure that these code always place below in order ( score - first, total - final)
            // it ensures that these code on top can run before render
            setScore((prevScore) => prevScore + scoreUnit);
            setConsecutiveCorrect((prev) => prev + 1);
            setTotalCardsFound((prevNum) => prevNum + 1);
            playAudio('/audio/ding-sound.mp3');
        } else {
            playAudio('/audio/incorrect.mp3');
            cards[optionOneId].setAttribute('src', '/classic_card_back.png');
            cards[optionTwoId].setAttribute('src', '/classic_card_back.png');
            setConsecutiveCorrect(0);
            if (heart > 1) {
                setHeart((prev) => prev - 1);
            } else {
                setHeart((prev) => prev - 1);
                trainingLose(stopwatch, gameContent, gameFooter, levelGame);
            }
        }
        // reset those cards clicked or chosen
        setCardsChosen([]);
        setCardsIdChosen([]);
    }





    return (
        <div className="one-screen">
            <Navbar></Navbar>
            <div className="game-container">
                <GameNav score={score}
                    level={levelGame}
                    timer={timer}
                    heart={heart}
                    mode=" TẬP LUYỆN&nbsp;"
                    ></GameNav>
                <div className="game-header"
                    style={isPlaying ? {display: "block"} : {display: "none"}}>
                    <GameNotify consecutive={consecutiveCorrect}></GameNotify>
                </div>
                <div className="game-content" 
                   style={isPlaying ? {display: "flex"} : {display: "none"}}>
                    {
                        cardsOne &&
                        cardsOne.map(card => (
                            <img src="/classic_card_back.png" 
                            alt="card"
                            key={card.id}
                            data-id={card.id}
                            onClick={(e) => flipCard(e)}
                            className="game-cards"
                            ></img>
                        ))
                    }
                </div>
                <div className="game-instruction"
                    style={isPlaying ? {display: "none"} : {display: "block"}}>
                    <div className="carousel-container">
                        <CarouselDisplay
                            imageOne='/one/one_instruction_1.png'
                            imageTwo='/one/one_instruction_2.png'
                            imageThree='/one/one_instruction_3.png'
                            titleOne='Thử thách 1: Tìm tất cả các cặp lá bài giống nhau trong vòng 60 giây.'
                            titleTwo='Bạn có 30 trái tim khởi đầu. Mỗi lần trả lời sai sẽ bị mất một trái tim.
                            Nếu mất hết trái tim thì sẽ thất bại.'
                            titleThree='Trả lời đúng liên tiếp sẽ nhận được nhiều số điểm hơn.'
                            >
                        </CarouselDisplay>
                    </div>
                    { 
                        loading ? <div className="game-loading">
                                <CircularProgress size={'3rem'}/>
                                <span>Đang tải...</span> 
                            </div> 
                        : error ? <div>{error}</div>
                        : <button onClick={beginGame}
                        className="game-start-button">Bắt đầu</button>
                    }
                </div>
                
                <div className="game-footer"
                    style={isPlaying ? {display: "flex"} : {display: "none"}}>
                    <div className="game-mission">
                        <div className="game-question">
                            <div className="question-content">
                                    <img src="/chicken.png" 
                                    alt="character"
                                    ></img>
                            </div>
                            <div className="question-content">
                                    <p>Quác quác... Hãy giải cứu tôi và những người bạn bằng cách
                                    <b> chọn hai lá bài giống nhau</b>. Quác quác cảm ơn. 
                                    </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default TrainingOne;