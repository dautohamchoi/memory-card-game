import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import GameNav from '../components/GameNav';
import accurateInterval from 'accurate-interval';
import findSumArray from '../functions/findSumArray';
import findReducedArray from '../functions/findReducedArray';
import { useSelector, useDispatch } from 'react-redux';
import { gameAction } from '../actions/gameAction';
import { CircularProgress } from '@material-ui/core';
import CarouselDisplay from '../components/CarouselDisplay';
import youLose from '../functions/youLose';
import youWin from '../functions/youWin';
import playAudio from '../functions/playAudio';
import { resetLogAction, gameLogAction } from '../actions/gameLogAction';
import { update } from '../actions/userAction';
import GameNotify from '../components/GameNotify';
import calculateScore from '../functions/calculateScore';



function GameSix(props) {
    const levelGame = 6;
    const scoreUnit = 50;


    const { cards: cardsSix, loading, error } = useSelector(state => state.gameList);
    
    const { gameState } = useSelector(state => state.gameLog);
    const userSignin = useSelector(state => state.userSignin);
    const { userInfo } = userSignin;

    const gameContent = document.querySelector('.game-content');
    const gameFooter = document.querySelector('.game-footer');
    

    const [cardsChosen, setCardsChosen] = useState([]);
    const [cardsIdChosen, setCardsIdChosen] = useState([]);
    const [totalCardsFound, setTotalCardsFound] = useState(0);
    const [cardsIdFound, setCardsIdFound] = useState([]);
    const [cardsAttackFound, setCardsAttackFound] = useState([])
    

    const [score, setScore] = useState(gameState.score);
    const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [stopwatch, setStopwatch] = useState('');
    
    const [timer, setTimer] = useState(70);
    const [heart, setHeart] = useState(20);

    const [total, setTotal] = useState('');

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
        if (cardsSix) {
            selectTotal();
        }
        // if users reload the page, they will redirect to the first level, and score equals zero
        // this prevents an action when users are about to lose and they decide to reload. 
        dispatch(resetLogAction());    
    }
    useEffect(() => {
        dispatch(gameAction(levelGame));
        // this prevents users to change location to get higher level
        if (gameState.level !== levelAccessing) {
            props.history.push("/games/" + gameState.level)
        }            
    }, []);

    useEffect(() => {
        if (cardsSix) {
            selectTotal();
        }
        // check whether users win a game or not
        if (totalCardsFound === 9) {
            setScore(calculateScore(score, timer, heart, levelGame));
            // we have to separate to make sure that calculating total score before dispatch
            const totalScore = calculateScore(score, timer, heart, levelGame);
            youWin(stopwatch, gameContent, gameFooter, levelGame + 1);
            dispatch(gameLogAction(levelGame + 1, totalScore));
        }
        return () => {
            //
        }
    }, [totalCardsFound]);

    useEffect(() => {
        if (consecutiveCorrect > 1) {
            setScore((prev) => prev + scoreUnit * consecutiveCorrect);
        }
    }, [consecutiveCorrect]);

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

    // to select which number need to find based on cardsSix
    const selectTotal = () => {
        const numberArr = cardsSix.map(card => card.attack);
        const filteredArr = findReducedArray(cardsAttackFound, numberArr);
        const totalArr = findSumArray(filteredArr);
        const totalNeedFound = totalArr[Math.floor(Math.random() * totalArr.length)];
        setTotal(totalNeedFound);
    }


    // to change from hidden card to exposed card.
    const flipCard = (e) => {
        const cardClicked = e.target;
        const cardId = cardClicked.dataset.id;
        if (cardsChosen.length < 2 // preventing users accidentally click so quickly before checkForMatch
            && !cardsIdChosen.includes(cardId) // preventing users double click the same card
            && !cardsIdFound.includes(cardId) // preventing users click these cards found.
            ) {
            cardsChosen.push(cardsSix[cardId].attack);
            cardsIdChosen.push(cardId);
            cardClicked.setAttribute('src', cardsSix[cardId].src)
            if (cardsChosen.length === 2) {
                setTimeout(checkForMatch, 250);
            }
        }
    }

    const checkForMatch = () => {
        const cards = document.querySelectorAll('.game-cards');
        let optionOneId = cardsIdChosen[0];
        let optionTwoId = cardsIdChosen[1];
        const currentTotal = cardsChosen[0] + cardsChosen[1];
        // check name of twos card whether they are match or not
        if (currentTotal === total) {
            cards[optionOneId].setAttribute('src', '/whiteImage.png');
            cards[optionTwoId].setAttribute('src', '/whiteImage.png');
            cards[optionOneId].style.opacity = "0.01";
            cards[optionTwoId].style.opacity = "0.01";
            // change cursor to make users feeling that cards disappeared
            cards[optionOneId].style.cursor = "default";
            cards[optionTwoId].style.cursor = "default";            
            cardsAttackFound.push(cardsSix[optionOneId].attack);
            cardsAttackFound.push(cardsSix[optionTwoId].attack);
            cardsIdFound.push(optionOneId);
            cardsIdFound.push(optionTwoId);

            // make sure that these code always place below
            // it ensures that these code on top can run before render
            setScore((prevScore) => prevScore + scoreUnit);
            setConsecutiveCorrect((prev) => prev + 1);
            setTotalCardsFound((prevNum) => prevNum + 1);
            playAudio('/audio/ding-sound.mp3');
        } else {
            playAudio('/audio/incorrect.mp3');
            cards[optionOneId].setAttribute('src', '/cardback/cb-frozen.png');
            cards[optionTwoId].setAttribute('src', '/cardback/cb-frozen.png');
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


    return (
        <div className="six-screen">
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
                    {
                        cardsSix &&
                        cardsSix.map(card => (
                            <img src="/cardback/cb-frozen.png" 
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
                            imageOne='/six/six_instruction_1.jpg'
                            imageTwo='/six/six_instruction_2.png'
                            imageThree='/six/six_instruction_3.png'
                            titleOne='Thử thách 6: Bạn là sinh viên trường Scholomance danh giá. Bạn sẽ quyết định đi làm gia 
                            sư để kiếm cơm qua ngày. Học trò đầu tiên của bạn là chú ếch.'
                            titleTwo='Dạy ếch học phép tính tổng dựa trên chỉ số tấn công của hai lá bài được lật.
                            Chỉ số tấn công nằm bên trái góc dưới (phép toán ví dụ là 4 + 5 = 9)'
                            titleThree='Hãy dạy kèm chú ếch để giải những bài toán mà nó được giao nhé.
                            Trong đó: X là chỉ số tấn công lá đầu tiên lật, và Y là lá thứ hai.'
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
                                    <img src="/monkey.png" 
                                    alt="character"
                                    ></img>
                            </div>
                            <div className="question-content">
                                    <div>Con người hay kêu tôi là ếch ngồi đáy giếng, kiến thức nông cạn.
                                        Vì thế tôi đã quyết định học toán. Hãy giúp tôi giải một số câu nhé.
                                    <b>Tìm hai lá bài sao cho </b>
                                        <img src="/attack_icon.png" 
                                        className="icon-small" alt="attack"></img>X  + 
                                        <img src="/attack_icon.png" className="icon-small"
                                        alt="attack"></img>Y  = <b>{total}</b> 
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default GameSix;