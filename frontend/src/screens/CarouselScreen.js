import React from 'react';
import Carousel from '../functions/Carousel.js';

class CarouselScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      heightImage: null
    }
    this.calcHeight = this.calcHeight.bind(this);
  }
  calcHeight() {
    const currentImg = document.querySelector('.current-slide').firstChild;
    const width = currentImg.offsetWidth;
    const height = 1080 * width / 1920;
    this.setState({
      heightImage: height
    })
  }

  componentDidMount() {
    Carousel();
    this.calcHeight();
    window.addEventListener('resize', this.calcHeight)
  };
  componentWillUnmount() {
    window.removeEventListener('resize', this.calcHeight)
  }
  

  render() {
    return (
      <div>
        <div className="carousel" style={{ height: this.state.heightImage}}>
          <div className="carousel__track-container">
            <ul className="carousel__track">
              <li className="carousel__slide current-slide">
                <img className="carousel__image" src="/bg-homescreen.jpg" alt="slide"/>
                <div className="carousel__title">
                  <div className="carousel__title-details">
                  Thử thách 1: Chọn 2 lá bái giống nhau
                  </div>
                </div>
              </li>
              <li className="carousel__slide">
                <img className="carousel__image" 
                src="/bg-profile.jpg" alt="slide"/>
                <div className="carousel__title">
                  <div className="carousel__title-details">
                  Mỗi lần trả lời sai sẽ bị mất một trái tim.
                  Nếu mất hết trái tim thì sẽ thất bại.
                  </div>
                </div>
              </li>
              <li className="carousel__slide">
                <img className="carousel__image" 
                src="/bg-homescreen.jpg" alt="slide"/>
                <div className="carousel__title">
                  <div className="carousel__title-details">
                  Trả lời đúng liên tiếp sẽ nhận được nhiều số điểm hơn.
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
        <div className="carousel__nav">
          <button className="carousel__nav-indicator current-slide"></button>
          <button className="carousel__nav-indicator"></button>
          <button className="carousel__nav-indicator"></button>
        </div>
      </div>
    )
  }
}

export default CarouselScreen;