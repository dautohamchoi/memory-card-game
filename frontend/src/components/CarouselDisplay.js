import React, { useState, useEffect } from 'react';
import Carousel from '../functions/Carousel.js';

function CarouselDisplay(props) {
    const [heightImage, setHeightImage] = useState(null);

    useEffect(() => {
        Carousel();
        calcHeight();
        window.addEventListener('resize', calcHeight)

        return () => {
            window.removeEventListener('resize', calcHeight)
        }
    }, [])

    const calcHeight = () => {
        const currentImg = document.querySelector('.current-slide').firstChild;
        const width = currentImg.offsetWidth;
        const height = 1080 * width / 1920;
        setHeightImage(height);
    }

    return (
        <div>
            <div className="carousel" style={{ height: heightImage}}>
                <div className="carousel__track-container">
                    <ul className="carousel__track">
                    <li className="carousel__slide current-slide">
                        <img className="carousel__image" 
                            src={props.imageOne} alt="slide"/>
                        <div className="carousel__title">
                            <div className="carousel__title-details">
                                {props.titleOne}
                            </div>
                        </div>
                    </li>
                    <li className="carousel__slide">
                        <img className="carousel__image" 
                            src={props.imageTwo} alt="slide"/>
                        <div className="carousel__title">
                        <div className="carousel__title-details">
                            {props.titleTwo}
                        </div>
                        </div>
                    </li>
                    <li className="carousel__slide">
                        <img className="carousel__image" 
                            src={props.imageThree} alt="slide"/>
                        <div className="carousel__title">
                        <div className="carousel__title-details">
                            {props.titleThree}
                        </div>
                        </div>                
                    </li>
                    </ul>
                </div>
                <button className="carousel__button carousel__button--left is-hidden" >
                    <img src="/gold_arrow_left.png" alt="arrow"></img>
                </button>   
                <button className="carousel__button carousel__button--right" >
                    <img src="/gold_arrow_right.png" alt="arrow"></img>
                </button>
            </div>
        </div>
    )
}

export default CarouselDisplay;