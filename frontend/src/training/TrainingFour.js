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
import trainingWin from '../functions/trainingWin';
import trainingLose from '../functions/trainingLose';
import calculateScore from '../functions/calculateScore';




function TrainingFour(props) {
    const levelGame = 4;
    const scoreUnit = 20;

    const { cards: cardsFour, loading, error } = useSelector(state => state.gameList);
    


    const gameContent = document.querySelector('.game-content');
    const gameFooter = document.querySelector('.game-footer');

    // cannot useState for cardsChosen and cardsIdChosen, it do not work when flip card
    let cardsChosen = [];
    let cardsIdChosen = [];

    const [totalCardsFound, setTotalCardsFound] = useState(0);
    const [cardsIdFound, setCardsIdFound] = useState([]);

    const [score, setScore] = useState(0);
    const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [stopwatch, setStopwatch] = useState('');
    
    const [timer, setTimer] = useState(35);
    const [heart, setHeart] = useState(20);


    const dispatch = useDispatch();

    const beginGame = () => {
        setIsPlaying(true);
        setStopwatch(
            accurateInterval(function() {
                    setTimer((prevTimer) => prevTimer - 1);
                }, 1000
                , {aligned: true, immediate: true})
        );
        // make sure that the data of cardsFour is loaded before rendering
        if (cardsFour) {
            // set time to turn clear cards to hidden cards 
            setTimeout(() => {
                const cards = document.querySelectorAll('.game-cards');
                // add data-id to each card to decide whether these cards match or not 
                for (let i = 0; i < cards.length; i++) {
                    cards[i].setAttribute('src', '/cardback/cb-school.png');
                    cards[i].addEventListener('click', (e) => flipCard(e));
                }
            }, 5000);
        }
    }

    useEffect(() => {
        dispatch(gameAction(levelGame));       
    }, [])

    useEffect(() => {
        // check whether users win a game or not
        if (totalCardsFound === 9) {
            trainingWin(stopwatch, gameContent, gameFooter);
        }
        return () => {
            //
        }
    }, [totalCardsFound]);

    // separate to make sure that it not affect each other, which can cause re-rendering many times.
    useEffect(() => {
        if (consecutiveCorrect > 1) {
            setScore(calculateScore(score, timer, heart, levelGame));
            setScore((prev) => prev + scoreUnit * consecutiveCorrect);
        }
    }, [consecutiveCorrect]);      

    // when the number of heart equals zero, game is over. checkForMatch only receive first value of heart.
    useEffect(() => {
        if (heart === 0) {
            trainingLose(stopwatch, gameContent, gameFooter, levelGame);
        }
        return () => {
           //
        }
    }, [heart]);

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
            cardsChosen.push(cardsFour[cardId].name);
            cardsIdChosen.push(cardId);
            cardClicked.setAttribute('src', cardsFour[cardId].src)
            if (cardsChosen.length === 2) {
                setTimeout(checkForMatch, 400);
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

            // make sure that these code always place below
            // it ensures that these code on top can run before render
            setScore((prevScore) => prevScore + scoreUnit);
            setConsecutiveCorrect((prev) => prev + 1)
            setTotalCardsFound((prevNum) => prevNum + 1);
            playAudio('/audio/ding-sound.mp3');
        } else {
            playAudio('/audio/incorrect.mp3');
            cards[optionOneId].setAttribute('src', '/cardback/cb-school.png');
            cards[optionTwoId].setAttribute('src', '/cardback/cb-school.png');
            setConsecutiveCorrect(0);
            // cannot put if else condition here as this function only receive the first value of heart.
            setHeart((prev) => prev - 1);
        }
        // reset those cards clicked or chosen
        cardsChosen = [];
        cardsIdChosen = [];
    }




    return (
        <div className="four-screen">
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
                        cardsFour &&
                        cardsFour.map(card => (
                            <img src={card.src}
                            alt="card"
                            key={card.id}
                            data-id={card.id}
                            className="game-cards"
                            ></img>
                        ))
                    }
                </div>
                <div className="game-instruction"
                    style={isPlaying ? {display: "none"} : {display: "block"}}>
                    <div className="carousel-container">
                        <CarouselDisplay
                            imageOne='/four/four_instruction_1.jpg'
                            imageTwo='/four/four_instruction_2.png'
                            imageThree='/four/four_instruction_3.png'
                            titleOne='Thử thách 4: Bạn đã hạ gục được Dr. Boom. Thế giới đã yên bình, bạn phải quay trở lại trường học
                            . Bài kiểm tra đầu tiên là khả năng ghi nhớ.'
                            titleTwo='Bạn có 5 giây để ghi nhớ vị trí các lá bài.'
                            titleThree='Bạn chỉ có 30 giây để tìm các cặp lá bài giống nhau.'
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
                                    <img src="/character_teacher.png" 
                                    alt="character"
                                    ></img>
                            </div>
                            <div className="question-content">
                                    <p>Trò chỉ có 5 giây để ghi nhớ. Sau đó hoàn thành bài kiểm tra bằng
                                        cách tìm
                                    <b> hai lá bài giống nhau</b>. HẾT. 
                                    </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default TrainingFour;