import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import GameNav from '../components/GameNav';
import accurateInterval from 'accurate-interval';
import findReducedArray from '../functions/findReducedArray';
import playAudio from '../functions/playAudio';
import { useDispatch, useSelector } from 'react-redux';
import { gameAction } from '../actions/gameAction';
import { CircularProgress } from '@material-ui/core';
import CarouselDisplay from '../components/CarouselDisplay';
import GameNotify from '../components/GameNotify';
import trainingWin from '../functions/trainingWin';
import trainingLose from '../functions/trainingLose';
import calculateScore from '../functions/calculateScore';



function TrainingTwo(props) {
    const levelGame = 2;
    const scoreUnit = 10;

    const { cards: cardsTwo, loading, error } = useSelector(state => state.gameList);
 


    // do not use 'useState()' because it delays 1 step comparing others
    let currentClass = '';
    let currentId = '';
    
    const gameContent = document.querySelector('.game-content');
    const gameFooter = document.querySelector('.game-footer');

    const [totalCardsFound, setTotalCardsFound] = useState(0);
    const [cardsIdFound, setCardsIdFound] = useState([]);
    const [cardsFound, setCardsFound] = useState([]);

    const [score, setScore] = useState(0);
    const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [stopwatch, setStopwatch] = useState('');
    
    const [timer, setTimer] = useState(90);
    const [heart, setHeart] = useState(45);

    const initialClass = ['Hunter', 'Mage', 'Paladin'];

    // manaIndex means notifying users which value of mana of card they should choose next.
    const [classType, setClassType] = useState(initialClass[Math.floor(Math.random() * 3)]);

    // checking prevents users clicking consecutively in short time about 500ms.
    const [isChecking, setIsChecking] = useState(true);


  

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

    }, []);


    useEffect(() => {
        // make sure that the data of cardsTwo is loaded before rendering
        if (cardsTwo) {
            const classArray = cardsTwo.map(card => card.classType);
            const filteredArray = findReducedArray(cardsFound, classArray).filter(type => type !== 'Boom');
            const classNeedFound = filteredArray[Math.floor(Math.random() * filteredArray.length)]
            if (classNeedFound) {
                setClassType(classNeedFound);
            }     
        }
        // check whether users win a game or not
        if (totalCardsFound === 15) {
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
            setScore((prev) => prev + 3 * consecutiveCorrect);
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
        if (isChecking // preventing users click cards consecutively in a short time when process checking is not done.
            && !cardsIdFound.includes(cardId) // preventing users click these cards found.
            ) {
            currentId = cardId;
            cardClicked.setAttribute('src', cardsTwo[cardId].src);
            currentClass = cardsTwo[cardId].classType; 
            setTimeout(checkClassType, 300);
            setIsChecking(false);
        }
        
    }
    const checkClassType = () => {

        const cards = document.querySelectorAll('.game-cards');
        if (currentClass === classType) {
            playAudio('/audio/ding-sound.mp3');
            cards[currentId].setAttribute('src', '/whiteImage.png');
            cardsIdFound.push(currentId);
            cardsFound.push(cardsTwo[currentId].classType);
            cards[currentId].style.opacity = "0.01";
            // change cursor to make users feeling that cards disappeared
            cards[currentId].style.cursor = "default";

            // make sure that these code always place below
            // it ensures that these code on top can run before render
            setScore((prevScore) => prevScore + scoreUnit);
            setConsecutiveCorrect((prev) => prev + 1)
            setTotalCardsFound((prevNum) => prevNum + 1);
        } else if (currentClass === 'Boom') {
            playAudio('/audio/explode.mp3');
            setScore((prevScore) => prevScore - 50);
            cards.forEach(card => {
                card.setAttribute('src', '/cardback/cb-knight.png');
                card.style.opacity = "1";
                card.style.cursor = "pointer";
            });
            if (heart > 1) {
                setHeart((prev) => prev - 1);
            } else {
                setHeart((prev) => prev - 1);
                trainingLose(stopwatch, gameContent, gameFooter, levelGame);
            }
            setCardsFound([]);
            setConsecutiveCorrect(0);
            setCardsIdFound([]);
            setTotalCardsFound(0);
        } else {
            playAudio('/audio/incorrect.mp3')
            cards[currentId].setAttribute('src', '/cardback/cb-knight.png');
            setConsecutiveCorrect(0);
            setScore((prevScore) => prevScore - 10);
            if (heart > 1) {
                setHeart((prev) => prev - 1);
            } else {
                setHeart((prev) => prev - 1);
                trainingLose(stopwatch, gameContent, gameFooter, levelGame);
            }
        }
        setIsChecking(true);
    }



    return (
        <div className="two-screen">
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
                        cardsTwo &&                      
                        cardsTwo.map(card => (
                            <img src="/cardback/cb-knight.png" 
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
                            imageOne='/two/two_instruction_1.png'
                            imageTwo='/two/two_instruction_2.jpg'
                            imageThree='/two/two_instruction_3.png'
                            titleOne='Thử thách 2: Hãy giúp Mage và những người bạn tìm những 
                            lá bài phép đã bị Dr. Boom đánh cắp.'
                            titleTwo='Cách phân biệt: lá bài của Hunter sẽ có viền xanh lá cây, Mage 
                            là xanh dương và Paladin là màu vàng.'
                            titleThree='Nếu bị quân lính của Dr. Boom phát hiện, thì những lá bài đó sẽ bị đánh cắp trở lại.'
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
                                    <img src="/mage.png" 
                                    alt="character"
                                    ></img>
                            </div>
                            <div className="question-content">
                                <p>
                                    Dr.Boom và quân lính của ông ấy đã đánh cắp những lá bài của
                                    tôi và những người bạn.
                                    <b>Tìm giúp tôi lá bài của nhân vật {classType}</b>. Mãi bên nhau bạn nhé.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default TrainingTwo;