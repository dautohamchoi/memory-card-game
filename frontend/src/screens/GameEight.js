import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import GameNav from '../components/GameNav';
import accurateInterval from 'accurate-interval';
import playAudio from '../functions/playAudio';
import CarouselDisplay from '../components/CarouselDisplay';
import { useSelector, useDispatch } from 'react-redux';
import { gameAction } from '../actions/gameAction';
import youLose from '../functions/youLose';
import youWin from '../functions/youWin';
import { CircularProgress } from '@material-ui/core';
import findReducedObjArray from '../functions/findReducedObjArray';
import { resetLogAction, gameLogAction } from '../actions/gameLogAction';
import { update } from '../actions/userAction';
import GameNotify from '../components/GameNotify';
import calculateScore from '../functions/calculateScore';




function GameEight(props) {
    const levelGame = 8;
    const scoreUnit = 100;

    const { cards: cardsEight, loading, error } = useSelector(state => state.gameList);
    const { gameState } = useSelector(state => state.gameLog);
    const userSignin = useSelector(state => state.userSignin);
    const { userInfo } = userSignin;
    

    // when cyclone appears, it's a time to start the second stage 
    const [cyclone, setCyclone] = useState(false);
    // new Array will replace for the initial array.
    const [newCardsOne, setNewCardsOne] = useState([]);

    const gameContent = document.querySelector('.game-content');
    const gameFooter = document.querySelector('.game-footer');

    const [cardsChosen, setCardsChosen] = useState([]);
    const [cardsIdChosen, setCardsIdChosen] = useState([]);
    const [totalCardsFound, setTotalCardsFound] = useState(0);
    const [cardsIdFound, setCardsIdFound] = useState([]);
    const [cardsNameFound, setCardsNameFound] = useState([]);

    const [score, setScore] = useState(gameState.score);
    const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [stopwatch, setStopwatch] = useState('');
    
    const [timer, setTimer] = useState(50);
    const [heart, setHeart] = useState(20);

    // get the level index from location comparing with real level game.
    const pathname = props.location.pathname;
    const levelAccessing = pathname[pathname.length - 1];     
    

    const dispatch = useDispatch();

    // LOGIC GAME: WE SPLIT THIS LEVEL INTO 2 LEVELS
    // FIRST: MECHANISM IS SIMILAR TO LEVEL ONE, ALL CARDS ARE .game-cards
    // SECOND: WE REMOVE THOSE FOUND CARDS AND DATA-ID OF THEIR, CREATING NEW ARRAY CORRESPONDING WITH NEW DATA-ID 
    const beginGame = () => {
        setIsPlaying(true);
        setStopwatch(
            accurateInterval(function() {
                    setTimer((prevTimer) => prevTimer - 1);
                }, 1000
                , {aligned: true, immediate: true})
        );
        // if users reload the page, they will redirect to the first level, and score equals zero
        // this prevents an action when users are about to lose and they decide to reload. 
        dispatch(resetLogAction()); 

        // create a cyclone to inform users that the order of cards had changed.
        setTimeout(() => {
            playAudio('/audio/yasuo-ult.mp3');
            const styleElem = document.head.appendChild(
                document.createElement('style')
            )
            styleElem.innerHTML = `.game-content-cyclone::before {
                transform: translateX(-150%)
            }`
        }, 10000);
        setTimeout(() => {
            // play sound of hasaki to inform users that cyclone appears
            playAudio('/audio/yasuo-hasaki.mp3');
            const cards = document.querySelectorAll('.game-cards');
            // remove old data-id to make a path for hidden cards only.
            for (let i = 0; i < cards.length; i++) {
                cards[i].removeAttribute('data-id');
                cards[i].setAttribute('src', '/cardback/cb-lemon.png');
            }
            // find a new array including these hidden cards
            // second stage
            const randomArr = findReducedObjArray(cardsNameFound, cardsEight);
            setNewCardsOne(randomArr);
            setCyclone(true);

            const hiddenCards = document.querySelectorAll('.hidden-cards');
            // add new data-id to each card to decide whether these cards match or not 
            for (let i = 0; i < hiddenCards.length; i++) {
                hiddenCards[i].setAttribute('data-id', i)
            }            
            // clear old data to make sure that game works well
            setCardsIdFound([]);
            setCardsChosen([]);
            setCardsIdChosen([]);
            gameContent.classList.add("game-content-cyclone");
        }, 12000);
        setTimeout(() => {
            playAudio('/audio/yasuo-hasaki.mp3');
            const styleElem = document.head.appendChild(
                document.createElement('style')
            )
            styleElem.innerHTML = `.game-content-cyclone::before {
                transform: translateX(150%)
            }`
        }, 18000);
        setTimeout(() => {
            playAudio('/audio/yasuo-hasaki.mp3');
            const styleElem = document.head.appendChild(
                document.createElement('style')
            )
            styleElem.innerHTML = `.game-content-cyclone::before {
                transform: translateX(-150%)
            }`
        }, 24000);
        setTimeout(() => {
            playAudio('/audio/yasuo-hasaki.mp3');
            const styleElem = document.head.appendChild(
                document.createElement('style')
            )
            styleElem.innerHTML = `.game-content-cyclone::before {
                transform: translateX(150%)
            }`
        }, 30000);
    }

    useEffect(() => {
        dispatch(gameAction(levelGame));
        // this prevents users to change location to get higher level
        if (gameState.level !== levelAccessing) {
            props.history.push("/games/" + gameState.level)
        }           
    }, [])

    useEffect(() => {
        // check whether users win a game or not
        if (totalCardsFound === 9) {
            // redirect to next game 
            setScore(calculateScore(score, timer, heart, levelGame));
            // we have to separate to make sure that calculating total score before dispatch
            const totalScore = calculateScore(score, timer * 4, heart * 4, levelGame);
            youWin(stopwatch, gameContent, gameFooter, levelGame + 1);
            dispatch(gameLogAction(levelGame + 1, totalScore));
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

    // to change from hidden card to exposed card.
    const flipCard = (e) => {
        const cardClicked = e.target;
        if (cardClicked.classList.contains('hidden-cards')) {
            const cardId = cardClicked.dataset.id;
            if (cardsChosen.length < 2 // preventing users accidentally click so quickly before checkForMatch
                && !cardsIdChosen.includes(cardId) // preventing users double click the same card
                && !cardsIdFound.includes(cardId) // preventing users click these cards found.
                ) {
                cardsIdChosen.push(cardId);
                if (!cyclone) {
                    cardClicked.setAttribute('src', cardsEight[cardId].src);
                    cardsChosen.push(cardsEight[cardId].name);
                } else {
                    cardClicked.setAttribute('src', newCardsOne[cardId].src);
                    cardsChosen.push(newCardsOne[cardId].name);
                }
                if (cardsChosen.length === 2) {
                    // decrease 100ms to increase hardness
                    setTimeout(checkForMatch, 150);
                }
            }
        }

    }

    const checkForMatch = () => {
        
        if (!cyclone) {
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
                cards[optionOneId].classList.remove('hidden-cards');
                cards[optionTwoId].classList.remove('hidden-cards');
                cardsNameFound.push(cardsEight[optionOneId].name);
                cardsNameFound.push(cardsEight[optionTwoId].name);
                cardsIdFound.push(optionOneId);
                cardsIdFound.push(optionTwoId);
                // make sure that these code always place below
                // it ensures that these code on top can run before render
                setScore((prevScore) => prevScore + 10);
                setConsecutiveCorrect((prev) => prev + 1);
                setTotalCardsFound((prevNum) => prevNum + 1);
                playAudio('/audio/ding-sound.mp3');
            } else {
                playAudio('/audio/incorrect.mp3');
                cards[optionOneId].setAttribute('src', '/cardback/cb-lemon.png');
                cards[optionTwoId].setAttribute('src', '/cardback/cb-lemon.png');
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
            // reset those cards clicked or chosen
            setCardsChosen([]);
            setCardsIdChosen([]);
        } else {
            const cards = document.querySelectorAll('.hidden-cards');
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
                cardsNameFound.push(cardsEight[optionOneId].name);
                setTotalCardsFound((prevNum) => prevNum + 1);
                setScore((prevScore) => prevScore + scoreUnit);
                setConsecutiveCorrect((prev) => prev + 1);
                cardsIdFound.push(optionOneId);
                cardsIdFound.push(optionTwoId);
                playAudio('/audio/ding-sound.mp3');
            } else {
                playAudio('/audio/incorrect.mp3');
                cards[optionOneId].setAttribute('src', '/cardback/cb-lemon.png');
                cards[optionTwoId].setAttribute('src', '/cardback/cb-lemon.png');
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
            // reset those cards clicked or chosen
            setCardsChosen([]);
            setCardsIdChosen([]);
        }
        

    }


    return (
        <div className="eight-screen">
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
                <div className="game-content game-content-cyclone" 
                   style={isPlaying ? {display: "flex"} : {display: "none"}}>
                    {
                        cardsEight &&
                        cardsEight.map(card => (
                            <img src="/cardback/cb-lemon.png" 
                            alt="card"
                            key={card.id}
                            data-id={card.id}
                            onClick={(e) => flipCard(e)}
                            className="game-cards hidden-cards"
                            ></img>
                        ))
                    }
                </div>
                <div className="game-instruction"
                    style={isPlaying ? {display: "none"} : {display: "block"}}>
                    <div className="carousel-container">
                        <CarouselDisplay
                            imageOne='/eight/eight_instruction_1.jpg'
                            imageTwo='/eight/eight_instruction_2.jpg'
                            imageThree='/eight/eight_instruction_3.png'
                            titleOne='Thử thách 8: Bạn đi tìm người đào vàng để ông ta chỉ dẫn đến Đảo Rồng để dự thi tốt nghiệp.'
                            titleTwo='Để được chỉ đường, ông ta đưa bạn thử thách tương tự cấp độ 1 với độ khó tăng lên. Nhiệm vụ của bạn
                            là tìm cặp lá bài giống nhau. NHƯNG...'
                            titleThree='Đột ngột, Yasuo từ đầu xuất hiện, lão sử dụng tuyệt kỹ Hasaki chém bay thứ tự của các lá
                            bài, khiến thử thách trở nên khó khăn hơn.'
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
                                    <img src="/yasuo.png" 
                                    alt="character"
                                    ></img>
                            </div>
                            <div className="question-content">
                                    <p>Ủa tôi là ai ? Đây là đâu ? Có lộn trò chơi không vậy ???
                                        Thôi thì ta sẽ cho ngươi biết thế nào là hasagi. (
                                    <b> Tìm hai lá bài giống nhau</b> để tìm đường tới Đảo Rồng). 
                                    </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default GameEight;