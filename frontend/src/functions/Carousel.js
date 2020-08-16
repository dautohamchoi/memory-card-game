function Carousel() {
    const track = document.querySelector(".carousel__track");
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.carousel__button--right');
    const prevButton = document.querySelector('.carousel__button--left');

  
    const slideWidth = slides[0].getBoundingClientRect().width;
  
    // arrange the slides next to the left
    // slides[0].style.left = slideWidth * 0 + 'px';
    // slides[1].style.left = slideWidth * 1 + 'px';
    // slides[2].style.left = slideWidth * 2 + 'px';
  
    const setSlidePosition = (slide, index) => {
      slide.style.left = slideWidth * index + 'px';
    };
    slides.forEach(setSlidePosition);
  
  
    const moveToSlide = (track, currentSlide, targetSlide) => {
      track.style.transform = "translateX(-" + targetSlide.style.left + ")";
      currentSlide.classList.remove("current-slide");
      targetSlide.classList.add("current-slide");
    }
  
    const updateDot = (currentDot, targetDot) => {
      currentDot.classList.remove('current-slide');
      targetDot.classList.add('current-slide');
    }
  
    const hideShowArrows = (slides, prevButton, nextButton, targetIndex) =>  {
      if (targetIndex === 0) {
        prevButton.classList.add('is-hidden');
        nextButton.classList.remove('is-hidden');
      } else if (targetIndex === slides.length - 1) {
        prevButton.classList.remove('is-hidden');
        nextButton.classList.add('is-hidden');    
      } else {
        prevButton.classList.remove('is-hidden');
        nextButton.classList.remove('is-hidden'); 
      } 
    }
    function autoSlide() {
      const currentSlide = track.querySelector(".current-slide");
      const nextSlide = currentSlide.nextElementSibling 
              ? currentSlide.nextElementSibling
              : slides[0] ;

      const nextIndex = slides.findIndex(slide => slide === nextSlide)
  
        moveToSlide(track, currentSlide, nextSlide);
        hideShowArrows(slides, prevButton, nextButton, nextIndex)
    };
    setInterval(() => {
      autoSlide()
    }, 7000);
  
    // when I click left, move slides to the left
    prevButton.addEventListener("click", (e) => {
      const currentSlide = track.querySelector(".current-slide");
      const prevSlide = currentSlide.previousElementSibling;

      const prevIndex = slides.findIndex(slide => slide === prevSlide)
  
      moveToSlide(track, currentSlide, prevSlide);

      hideShowArrows(slides, prevButton, nextButton, prevIndex)
    });
  
    // when I click right, move slides to the right
    nextButton.addEventListener("click", (e) => {
      const currentSlide = track.querySelector(".current-slide");
      const nextSlide = currentSlide.nextElementSibling;
      const nextIndex = slides.findIndex(slide => slide === nextSlide)
  
      moveToSlide(track, currentSlide, nextSlide);
      hideShowArrows(slides, prevButton, nextButton, nextIndex)
    })
  

  
  }
  export default Carousel;