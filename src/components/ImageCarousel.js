import React, { useEffect, useRef } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ImageCarousel = () => {
  const sliderRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      sliderRef.current.slickNext();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  const images = [
    '/1.jpg',
    '/2.jpg',
    '/3.jpg',
  ];

  return (
    <div className="carousel-container w-full mb-10 rounded-md z-0">
      <Slider ref={sliderRef} {...settings}>
        {images.map((img, index) => (
          <div key={index} className='outline-none'>
            <img src={img} alt={`Slide ${index + 1}`} className='w-full h-full object-cover rounded-md' />
          </div>
        ))}
      </Slider>
    </div>

  );
}

export default ImageCarousel;
