import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import GameNav from '../components/GameNav';
import accurateInterval from 'accurate-interval';
import playAudio from '../functions/playAudio';
import { useSelector, useDispatch } from 'react-redux';
import { gameAction } from '../actions/gameAction';
import youWin from '../functions/youWin';
import youLose from '../functions/youLose';
import { CircularProgress } from '@material-ui/core';
import CarouselDisplay from '../components/CarouselDisplay';
import { resetLogAction, gameLogAction } from '../actions/gameLogAction';
import { update } from '../actions/userAction';
import calculateScore from '../functions/calculateScore';
import GameNotify from '../components/GameNotify';




function GameSeven(props) {
    const levelGame = 7;
    const scoreUnit = 60;
    const { cards, loading, error } = useSelector(state => state.gameList);
    
    const { gameState } = useSelector(state => state.gameLog);
    const userSignin = useSelector(state => state.userSignin);
    const { userInfo } = userSignin;

    const gameContent = document.querySelector('.game-content');
    const gameFooter = document.querySelector('.game-footer');

    const [randomNum, setRandomNum] = useState('');

    const [cardsChosen, setCardsChosen] = useState([]);
    const [cardsIdChosen, setCardsIdChosen] = useState([]);
    const [totalCardsFound, setTotalCardsFound] = useState(0); // control blur index
    const [cardsIdFound, setCardsIdFound] = useState([]); //preventing users click these cards found

    const [answerChosen, setAnswerChosen] = useState(null);// make sure that users only choose one answer in this stage

    const [score, setScore] = useState(gameState.score);
    const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [stopwatch, setStopwatch] = useState('');
    
    const [timer, setTimer] = useState(45);
    const [heart, setHeart] = useState(15);

    // get the level index from location comparing with real level game.
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
        if (cards) {
            setRandomNum(Math.floor(Math.random() * 18));
        }
        // if users reload the page, they will redirect to the first level, and score equals zero
        // this prevents an action when users are about to lose and they decide to reload. 
        dispatch(resetLogAction());        
    }

    // componentDidMount for randomNum
    useEffect(() => {
        dispatch(gameAction(levelGame));
        // this prevents users to change location to get higher level
        if (gameState.level !== levelAccessing) {
            props.history.push("/games/" + gameState.level)
        }          
    }, []);


    useEffect(() => {
        const styleElement = document.head.appendChild(document.createElement("style"));
        // As 0 is a falsy. So we have to use Number.isInteger as a condition
        if (Number.isInteger(randomNum)) {
            styleElement.innerHTML = `.bg-content::before {
                background-image: url(${cards.question[randomNum].src})
            }`
        }
        // when users found a pair of cards, hidden picture behind the cards will be clearer.
        decreaseBlur(totalCardsFound);
        // check whether users win a game or not

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

    // to change from hidden card to exposed card.
    const flipCard = (e) => {
        const cardClicked = e.target;
        const cardId = cardClicked.dataset.id;
        if (cardsChosen.length < 2 // preventing users accidentally click so quickly before checkForMatch
            && !cardsIdChosen.includes(cardId) // preventing users double click the same card
            && !cardsIdFound.includes(cardId) // preventing users click these cards found.
            && cards.cardsSeven
            ) {
            cardsChosen.push(cards.cardsSeven[cardId].name);
            cardsIdChosen.push(cardId);
            cardClicked.setAttribute('src', cards.cardsSeven[cardId].src)
            if (cardsChosen.length === 2) {
                setTimeout(checkForMatch, 200);
            }
        }
    }

    const checkForMatch = () => {
        const allCards = document.querySelectorAll('.game-cards');
        let optionOneId = cardsIdChosen[0];
        let optionTwoId = cardsIdChosen[1];
        // check name of twos card whether they are match or not
        if (cardsChosen[0] === cardsChosen[1]) {
            allCards[optionOneId].setAttribute('src', '/whiteImage.png');
            allCards[optionTwoId].setAttribute('src', '/whiteImage.png');
            allCards[optionOneId].style.opacity = "0.01";
            allCards[optionTwoId].style.opacity = "0.01";
            // change cursor to make users feeling that cards disappeared
            allCards[optionOneId].style.cursor = "default";
            allCards[optionTwoId].style.cursor = "default";
            cardsIdFound.push(optionOneId);
            cardsIdFound.push(optionTwoId);

            setScore((prevScore) => prevScore + scoreUnit);
            setConsecutiveCorrect((prev) => prev + 1);
            setTotalCardsFound((prevNum) => prevNum + 1);
            playAudio('/audio/ding-sound.mp3');
        } else {
            playAudio('/audio/incorrect.mp3');
            allCards[optionOneId].setAttribute('src', '/cardback/cb-christmas.png');
            allCards[optionTwoId].setAttribute('src', '/cardback/cb-christmas.png');
            setConsecutiveCorrect(0);
            if (heart > 1) {
                setHeart((prev) => prev - 1);
            } else {
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

    const checkAnswer = (e) => {
        const answerClicked = e.target;
        const answer = answerClicked.dataset.answer;
        const rightAnswer = cards.question[randomNum].answer;
        // users cannot choose an answer without opening any card
        if (!totalCardsFound) {
            alert('Vui lòng không thử vận may. Hãy mở các lá bài để chắc chắn về đáp án');
        } else {
            setAnswerChosen(answer); // make sure that users only choose one answer in this stage.
        }
        if (!answerChosen && totalCardsFound) {
            // change background of an answer to green when users choose
            answerClicked.style.backgroundColor = '#4cd137';
            stopwatch.clear();
            // decrease blur to 0 px
            decreaseBlur(9);
            const answerChoices = document.querySelectorAll('.answer-choice');
            const answerList = [...answerChoices].map(choice => choice.dataset.answer);
            const rightAnswerIndex = answerList.indexOf(rightAnswer);
            setTimeout(() => {
                answerChoices[rightAnswerIndex].style.backgroundColor = '#f39c12';
                stopwatch.clear();
                gameContent.innerHTML = `<div>
                    <img src="${cards.question[randomNum].card}" 
                    alt="hidden-card" class="card-hidden">
                <div>`;
                if (answer === rightAnswer) {
                    playAudio('/audio/exactly.mp3');
                    setTimeout(() => {
                        setScore(calculateScore(score, timer, heart, levelGame));
                        // we have to separate to make sure that calculating total score before dispatch
                        const totalScore = calculateScore(score, timer * 5, heart * 4, levelGame);
                        youWin(stopwatch, gameContent, gameFooter, levelGame + 1);
                        dispatch(gameLogAction(levelGame + 1, totalScore));
                    }, 3000);
                } else {
                    playAudio('/audio/wrong.mp3');
                    setTimeout(() => {
                        youLose(stopwatch, gameContent, gameFooter);
                        dispatch(update({ 
                            userId: userInfo._id,
                            level: levelGame,
                            score 
                        }));
                        dispatch(resetLogAction());
                    }, 3000)
                }
            }, 1000);
            setTimeout(() => {
                answerChoices[rightAnswerIndex].style.backgroundColor = '#e74c3c';
            }, 1300);
            setTimeout(() => {
                answerChoices[rightAnswerIndex].style.backgroundColor = '#d35400';
            }, 1600);
            setTimeout(() => {
                answerChoices[rightAnswerIndex].style.backgroundColor = '#e74c3c';
            }, 1900);
            setTimeout(() => {
                answerChoices[rightAnswerIndex].style.backgroundColor = '#e67e22';
            }, 2200);
            setTimeout(() => {
                const styleElement = document.head.appendChild(document.createElement("style"));
                styleElement.innerHTML = `.bg-content::before {
                        background-image: none
                    }`
            }, 3000);
        }
    }

    // when users found a pair of cards, hidden picture behind the cards will be clearer.
    const decreaseBlur = (totalCardsFound) => {
        const blurIndex = (9 - totalCardsFound) * 1.5 + 'px';
        const bgContentStyle = document.querySelector('.bg-content').style;
        bgContentStyle.setProperty('--bg-blur', blurIndex);
    }


    return (
        <div className="seven-screen">
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
                <div className="game-content bg-content" 
                   style={isPlaying ? {display: "flex"} : {display: "none"}}>
                    {
                        loading ? <div>Loading...</div>
                        : error ? <div>{error}</div>
                        :                    
                        cards.cardsSeven && cards.cardsSeven.map(card => (
                            <img src="/cardback/cb-christmas.png" 
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
                            imageOne='/seven/seven_instruction_1.png'
                            imageTwo='/seven/seven_instruction_2.png'
                            imageThree='/seven/seven_instruction_3.png'
                            titleOne='Thử thách 7: Bài kiểm tra về độ tinh mắt và trí nhớ. Hãy giúp những
                            tên quái quỷ trên tìm ra lá bài bí ẩn này, nếu không thì ...'
                            titleTwo='Tìm cặp lá bài giống nhau để mở các gợi ý về bức ảnh phía sau.'
                            titleThree='Càng nhiều cặp lá bài tìm được thì độ rõ nét của ảnh càng tăng. 
                            Nếu biết chắc đáp án có thể trả lời ngay để đạt điểm cao.'
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
                                <img src="/character_men.png" 
                                alt="character"
                                ></img>
                            </div>
                            <div className="question-content">
                                <p>Hãy giúp ta trả lời câu hỏi: 
                                    <i> "Bức ảnh đang bị che dấu thuộc về lá bài của nhân vật nào?"</i></p>
                            </div>
                        </div>
                        <ul className="answer-list">
                            {
                                loading ? <div>Loading...</div>
                                : error ? <div>{error}</div>
                                :                                     
                                Number.isInteger(randomNum) && cards.question[randomNum].choices.map(choice => <li 
                                    data-answer={choice}
                                    key={choice}
                                    className="answer-choice"
                                    onClick={(e) => checkAnswer(e)}
                                    >
                                    {choice}
                                    </li>)
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default GameSeven;