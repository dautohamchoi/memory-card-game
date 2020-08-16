import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import GameNav from '../components/GameNav';
import accurateInterval from 'accurate-interval';
import findEquationSumArray from '../functions/findEquationSumArray';
import findReducedArray from '../functions/findReducedArray';
import playAudio from '../functions/playAudio';
import { useSelector, useDispatch } from 'react-redux';
import { gameAction } from '../actions/gameAction';
import youLose from '../functions/youLose';
import CarouselDisplay from '../components/CarouselDisplay';
import { CircularProgress } from '@material-ui/core';
import { resetLogAction } from '../actions/gameLogAction';
import { update } from '../actions/userAction';
import calculateScore from '../functions/calculateScore';
import GameNotify from '../components/GameNotify';



function GameNine(props) {

    const levelGame = 9;
    const scoreUnit = 200;

    const { cards: cardsNine, loading, error } = useSelector(state => state.gameList);
    
    const { gameState } = useSelector(state => state.gameLog);
    const userSignin = useSelector(state => state.userSignin);
    const { userInfo } = userSignin;    

    const gameContent = document.querySelector('.game-content');
    const gameFooter = document.querySelector('.game-footer');
    const gameHeader = document.querySelector('.game-header');

    const [cardsChosen, setCardsChosen] = useState([]);
    const [cardsIdChosen, setCardsIdChosen] = useState([]);
    const [totalCardsFound, setTotalCardsFound] = useState(0);
    const [cardsIdFound, setCardsIdFound] = useState([]);
    const [cardsManaFound, setCardsManaFound] = useState([])
    

    const [score, setScore] = useState(gameState.score);
    const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [stopwatch, setStopwatch] = useState('');
    
    const [timer, setTimer] = useState(69);
    const [heart, setHeart] = useState(15);

    const [total, setTotal] = useState('');

    // get the level index from location comparing with real level game.
    const pathname = props.location.pathname;
    const levelAccessing = pathname[pathname.length - 1];        

    const dispatch = useDispatch();

    const beginGame = () => {
        if (cardsNine) {
            selectTotal();
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
    };

    useEffect(() => {
        dispatch(gameAction(levelGame));
        // this prevents users to change location to get higher level
        if (gameState.level !== levelAccessing) {
            props.history.push("/games/" + gameState.level)
        }            
    }, [])
    

    useEffect(() => {
        if (cardsNine) {
            selectTotal();
        }
        // check whether users win a game or not
        if (totalCardsFound === 9) {
            playAudio('/audio/congratulations.mp3');
            setScore(calculateScore(score, timer * 4, heart * 4, levelGame));
            // we have to separate to make sure that calculating total score before dispatch
            const totalScore = calculateScore(score, timer * 4, heart * 4, levelGame);
            console.log(totalScore);
            dispatch(update({ 
                userId: userInfo._id,
                level: 10,
                score: totalScore 
            }));
            stopwatch.clear();
            gameHeader.style.display = "none";
            gameContent.innerHTML = `<div>
                <img src="/congrats.gif" alt="congrats">
                <div class="content-congrats">
                    <div class="content-score">Bạn đã phá đảo trò chơi với kỷ 
                    lục là <b>${score}</b> điểm.</div>
                    <a href="/ranking" class="ranking-button">Bảng xếp hạng</a>
                </div>
            <div>`;
            gameFooter.innerHTML = "";
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

    // to select which number need to find based on cardsSix
    const selectTotal = () => {
        const numberArr = cardsNine.map(card => card.manaValue);
        const filteredArr = findReducedArray(cardsManaFound, numberArr);
        const totalArr = findEquationSumArray(filteredArr);
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
            cardsChosen.push(cardsNine[cardId].manaValue);
            cardsIdChosen.push(cardId);
            cardClicked.setAttribute('src', cardsNine[cardId].src)
            if (cardsChosen.length === 2) {
                setTimeout(checkForMatch, 175);
            }
        }
    }

    const checkForMatch = () => {
        const cards = document.querySelectorAll('.game-cards');
        let optionOneId = cardsIdChosen[0];
        let optionTwoId = cardsIdChosen[1];
        const currentTotal = cardsChosen[0] * cardsChosen[0] + cardsChosen[1] * 2;
        // check name of twos card whether they are match or not
        if (currentTotal === total) {
            cards[optionOneId].setAttribute('src', '/whiteImage.png');
            cards[optionTwoId].setAttribute('src', '/whiteImage.png');
            cards[optionOneId].style.opacity = "0.01";
            cards[optionTwoId].style.opacity = "0.01";
            // change cursor to make users feeling that cards disappeared
            cards[optionOneId].style.cursor = "default";
            cards[optionTwoId].style.cursor = "default";  
            cardsManaFound.push(cardsNine[optionOneId].manaValue);
            cardsManaFound.push(cardsNine[optionTwoId].manaValue);
            cardsIdFound.push(optionOneId);
            cardsIdFound.push(optionTwoId);
            // make sure that these code always place below in order
            // it ensures that these code on top can run before render 
            setHeart((prev) => prev + 1); 
            setScore((prevScore) => prevScore + scoreUnit);
            setConsecutiveCorrect((prev) => prev + 1);        
            setTotalCardsFound((prevNum) => prevNum + 1);
            playAudio('/audio/ding-sound.mp3');
        } else {
            playAudio('/audio/incorrect.mp3');
            cards[optionOneId].setAttribute('src', '/cardback/cb-legend.png');
            cards[optionTwoId].setAttribute('src', '/cardback/cb-legend.png');
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
        <div className="nine-screen">
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
                        cardsNine &&
                        cardsNine.map(card => (
                            <img src="/cardback/cb-legend.png" 
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
                            imageOne='/nine/nine_instruction_1.jpg'
                            imageTwo='/nine/nine_instruction_2.png'
                            imageThree='/nine/nine_instruction_3.png'
                            titleOne='Thử thách 9: Xin chúc mừng bạn đã đến được Đảo Rồng. Đây chính là nơi bạn sẽ
                            tham gia bài kiểm tra cuối cùng để tốt nghiệp. Hãy cố lên nhé.'
                            titleTwo='Đề thi: Hãy tìm cặp lá bài có chứa chỉ số Mana phù hợp với yêu cầu bên dưới.'
                            titleThree='Trong đó: X là chỉ số Mana của lá bài thứ nhất được lật, Y là của là bài thứ hai.
                            Trả lời đúng sẽ nhận được 1 trái tim để tiếp tục thử thách.'
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
                                    <img src="/character_final.png" 
                                    alt="character"
                                    ></img>
                            </div>
                            <div className="question-content">
                                    <div>Khá lắm chàng trai. Các thử thách trước khi là ôn tập về các kỹ năng
                                        ghi nhớ, tính toán và sư nhanh nhạy. Đây chính thức là bài kiểm tra cuối cùng: 
                                        <i> Tìm hai lá bài thoả mãn điều kiện sau: </i>
                                        <div style={{border: 'none', fontWeight: 'bold'}}>
                                            <img src="/mana_small.png" alt="mana"
                                            className="icon-small"></img> X<sup>2</sup> +&nbsp;  
                                             <img src="/mana_small.png" alt="mana"
                                            className="icon-small"></img> 2Y - {total} = 0
                                        </div>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default GameNine;