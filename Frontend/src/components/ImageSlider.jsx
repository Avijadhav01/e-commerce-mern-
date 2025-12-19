import React, { useEffect, useState } from 'react'
import "./componentStyles/ImageSlider.css"

function ImageSlider() {

  const images = [1, 2, 3, 4, 5, 6]

  const [currIndex, setCurrIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000)
    return () => clearInterval(interval);
  }, [])

  return (
    <div className="image-slider-container">
      <div className="slider-images" style={{ transform: `translateX(-${currIndex * 100}%)` }}>
        {
          images.map((i, index) =>
          (<div className='slider-item' key={index}>
            <img src={`./images/banner${i}.jpg`} alt={`slide ${i}`} />
          </div>)
          )
        }
      </div>
      <div className='slider-dots'>
        {
          images.map((_, idx) => (
            <span
              className={`dot ${idx === currIndex ? 'active' : ''}`}
              onClick={() => setCurrIndex(idx)}
              key={idx}
            />
          ))
        }
      </div>
    </div>
  )
}

export default ImageSlider;