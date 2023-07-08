import React from 'react';
import { Carousel } from 'react-bootstrap';
import '../css/Carousel.css';

function CarouselComponent() {
  const images = [
    'https://img.freepik.com/free-vector/bid-design-background_52683-76080.jpg?w=1380&t=st=1688840866~exp=1688841466~hmac=5ac6a60fed43fdf485833b992b1f468cf16ed02e445a91c9f27b5229254b2be6',
   'https://img.freepik.com/free-photo/court-hammer_1048-4190.jpg?w=826&t=st=1688840975~exp=1688841575~hmac=0f3c0d9d268f86f83b2cdbbaa86a469a7094feac84c53b42932b678ec47f5250',
    'https://img.freepik.com/free-vector/bidding-auction-auctions-involving-purchase-item_1150-35041.jpg?w=1380&t=st=1688841014~exp=1688841614~hmac=80f97c6138d7e6ba5db3938b1971e2b4dacaa08957c19d83e758ded188b87e78',
  ];

  return (
    <Carousel interval={3000}> {/* Change slides every 3 seconds */}
      {images.map((image, index) => (
        <Carousel.Item key={index} >
          <img className="d-block w-100 carousel-image" src={image} alt={`Image ${index + 1}`} />
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default CarouselComponent;


// The CarouselComponent creates a Carousel using the 'react-bootstrap' Carousel component.
// It displays a list of images, defined in the 'images' array.
// Each slide in the Carousel changes every 3 seconds.