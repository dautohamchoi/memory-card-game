import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import GameNav from '../components/GameNav';
import accurateInterval from 'accurate-interval';
import playAudio from '../functions/playAudio';
import CarouselDisplay from '../components/CarouselDisplay';
import { useDispatch, useSelector } from 'react-redux';
import { gameAction } from '../actions/gameAction';
import CircularProgress from '@material-ui/core/CircularProgress';
import youLose from '../functions/youLose';
import youWin from '../functions/youWin';
import { gameLogAction, resetLogAction } from '../actions/gameLogAction';
import { update } from '../actions/userAction';
import calculateScore from '../functions/calculateScore';



function GameFive(props) {
    const levelGame = 5;
    const scoreUnit = 5;

    const { cards: cardsFive, loading, error } = useSelector(state => state.gameList);
    
    const { gameState } = useSelector(state => state.gameLog);
    const userSignin = useSelector(state => state.userSignin);
    const { userInfo } = userSignin;

    // do not use 'useState()' because it delays 1 step comparing others
    let currentMana = '';
    let currentId = '';

    const gameContent = document.querySelector('.game-content');
    const gameFooter = document.querySelector('.game-footer');

    const [totalCardsFound, setTotalCardsFound] = useState(0);
    const [cardsIdFound, setCardsIdFound] = useState([]);

    const [score, setScore] = useState(gameState.score);
    const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [stopwatch, setStopwatch] = useState('');
    
    const [timer, setTimer] = useState(100);
    const [heart, setHeart] = useState(40);


    // manaIndex means notifying users which value of mana of card they should choose next.
    const [manaIndex, setManaIndex] = useState(1);
    // checking prevents users clicking consecutively in short time about 500ms.
    const [isChecking, setIsChecking] = useState(true);



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
    }, [])

    useEffect(() => {
        // check whether users win a game or not
        if (totalCardsFound === 10) {
            // redirect to next game 
            setScore(calculateScore(score, timer * 3, heart * 3, levelGame));
            // we have to separate to make sure that calculating total score before dispatch
            const totalScore = calculateScore(score, timer * 3, heart * 3, levelGame);
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
        checkCorrect();
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
        const cardId = cardClicked.dataset.id;
        if (isChecking // preventing users click cards consecutively in a short time when process checking is not done.
            && !cardsIdFound.includes(cardId) // preventing users click these cards found.
            ) {
            currentId = cardId;
            cardClicked.setAttribute('src', cardsFive[cardId].src);
            currentMana = cardsFive[cardId].manaValue; 
            setTimeout(checkManaValue, 350);
            setIsChecking(false);
        }
        
    }
    const checkManaValue = () => {
        const cards = document.querySelectorAll('.game-cards');
        if (currentMana === manaIndex) {
            cards[currentId].setAttribute('src', '/whiteImage.png');
            cardsIdFound.push(currentId);
            cards[currentId].style.opacity = "0.01";
            // change cursor to make users feeling that cards disappeared
            cards[currentId].style.cursor = "default";

            
            setScore((prevScore) => prevScore + scoreUnit);
            setManaIndex((prev) => prev + 1);
            setConsecutiveCorrect((prev) => prev + 1);
            setTotalCardsFound((prevNum) => prevNum + 1);

            playAudio('/audio/ding-sound.mp3');
        } else {
            playAudio('/audio/incorrect.mp3');
            setScore((prevScore) => prevScore - 15);
            cards.forEach(card => {
                card.setAttribute('src', '/cardback/cb-tomb.png');
                card.style.opacity = "1";
                card.style.cursor = "pointer";
            });
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
            setManaIndex(1);
            setCardsIdFound([]);
            setConsecutiveCorrect(0);
            setTotalCardsFound(0);
        }
        setIsChecking(true);
    }

    // checking the consecutive correct choice that users clicked
    const checkCorrect = () => {
        const notify = document.querySelector('.game-header-notify');
        switch (consecutiveCorrect) {
            case 0:
                notify.innerHTML = "";
                break;
            case 1:
                notify.innerHTML = `<img src='/mana_small.png' alt="">`;
                break;
            case 2:
                playAudio("/audio/double-kill-cs.mp3");
                notify.innerHTML = `
                    <img src='/mana_small.png' alt="">
                    <img src='/mana_small.png' alt="">
                `;
                break;
            case 3:
                playAudio("/audio/triple_kill_dota.mp3");
                notify.innerHTML = `
                <img src='/mana_small.png' alt="">
                <img src='/mana_small.png' alt="">
                <img src='/mana_small.png' alt="">
            `;
                break;
            case 4:
                playAudio("/audio/quadra-kill-lol.mp3");
                notify.innerHTML = `
                <img src='/mana_small.png' alt="">
                <img src='/mana_small.png' alt="">
                <img src='/mana_small.png' alt="">
                <img src='/mana_small.png' alt="">
            `;
                break;
            case 5:
                playAudio("/audio/pentakill-lol.mp3");
                notify.innerHTML = `
                <img src='/mana_small.png' alt="">
                <img src='/mana_small.png' alt="">
                <img src='/mana_small.png' alt="">
                <img src='/mana_small.png' alt="">
                <img src='/mana_small.png' alt="">
            `;
                break;
            case 6:
                notify.innerHTML = `
                <img src='/mana_small.png' alt="">
                <img src='/mana_small.png' alt="">
                <img src='/mana_small.png' alt="">
                <img src='/mana_small.png' alt="">
                <img src='/mana_small.png' alt="">
                <img src='/mana_small.png' alt="">
            `;
                break;
            case 7:
                playAudio("/audio/awesome.mp3");
                notify.innerHTML = `
                <img src='/mana_small.png' alt="">
                <img src='/mana_small.png' alt="">
                <img src='/mana_small.png' alt="">
                <img src='/mana_small.png' alt="">
                <img src='/mana_small.png' alt="">
                <img src='/mana_small.png' alt="">
                <img src='/mana_small.png' alt="">
            `;
                break;
            case 8:
                notify.innerHTML = `
                <img src='/mana_small.png' alt="">
                <img src='/mana_small.png' alt="">
                <img src='/mana_small.png' alt="">
                <img src='/mana_small.png' alt="">
                <img src='/mana_small.png' alt="">
                <img src='/mana_small.png' alt="">
                <img src='/mana_small.png' alt="">
                <img src='/mana_small.png' alt="">
            `;
                break;
            case 9:
                playAudio('/audio/legendary.mp3');
                notify.innerHTML = `
                <img src='/mana_small.png' alt="">
                <img src='/mana_small.png' alt="">
                <img src='/mana_small.png' alt="">
                <img src='/mana_small.png' alt="">
                <img src='/mana_small.png' alt="">
                <img src='/mana_small.png' alt="">
                <img src='/mana_small.png' alt="">
                <img src='/mana_small.png' alt="">
                <img src='/mana_small.png' alt="">
            `;
                break;
            case 10:
                notify.innerHTML = `
                    <img src='/mana_small.png' alt="">
                    <img src='/mana_small.png' alt="">
                    <img src='/mana_small.png' alt="">
                    <img src='/mana_small.png' alt="">
                    <img src='/mana_small.png' alt="">
                    <img src='/mana_small.png' alt="">
                    <img src='/mana_small.png' alt="">
                    <img src='/mana_small.png' alt="">
                    <img src='/mana_small.png' alt="">
                    <img src='/mana_small.png' alt="">
                `;
                break;                                  
            default:
                break;
        }
        
    }


    return (
        <div className="five-screen">
            <Navbar></Navbar>
            <div className="game-container">
                <GameNav score={score}
                    level={levelGame}
                    timer={timer}
                    heart={heart}
                    ></GameNav>
                <div className="game-header"
                    style={isPlaying ? {display: "block"} : {display: "none"}}>
                    <div className="game-header-notify">
                        ...
                    </div>
                </div>
                <div className="game-content" 
                   style={isPlaying ? {display: "flex"} : {display: "none"}}>
                    {
                        cardsFive &&
                        cardsFive.map(card => (
                            <img src="/cardback/cb-tomb.png" 
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
                            imageOne='/five/five_instruction_1.jpg'
                            imageTwo='/five/five_instruction_2.png'
                            imageThree='/five/five_instruction_3.png'
                            titleOne='Thử thách 5: Đột nhập vào thư viện tìm giúp lão bụng phệ các lá bài.'
                            titleTwo='Bạn chỉ có thế đánh cắp các lá bài theo chỉ số Mana, nằm ở góc trái trên cùng lá bài theo 
                            thứ tự từ 1 đến 10.'
                            titleThree='Nếu không may lấy phải lá không đúng thứ tự. Bạn sẽ phải tìm kiếm lại từ đầu.'
                            >
                        </CarouselDisplay>
                    </div>
                    { 
                        loading ? <div className="game-loading">
                                <CircularProgress size={'3rem'}/>
                                <span>Đang tải...</span> 
                            </div> 
                        : error ? <div className="game-loading">{error}</div>
                        : <button onClick={beginGame}
                        className="game-start-button">Bắt đầu</button>
                    }
                </div>

                <div className="game-footer"
                    style={isPlaying ? {display: "flex"} : {display: "none"}}>
                    <div className="game-mission">
                        <div className="game-question">
                            <div className="question-content">
                                <img src="/mind_tech.png" 
                                    alt="character"
                                    ></img>
                            </div>
                            <div className="question-content">
                            <div>
                                <span>
                                Nhiệm vụ của nhà ngươi ở thử thách này là: 
                                   <i> Thu thập các lá bài có chỉ số Mana từ 1 đến 10</i>.
                                   <b> Hãy tìm lá bài có</b>
                                </span>
                                   <img src="/mana_small.png" alt="mana" className="icon-small"></img>
                                   <span><b>bằng {manaIndex}</b></span> 
                            </div>
                        </div>
                    </div>

                </div>
                </div>
            </div>
        </div>
    )
}
export default GameFive;