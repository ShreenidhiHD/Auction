import React from 'react';
import { Carousel } from 'react-bootstrap';
import '../css/Carousel.css';

function CarouselComponent() {
  const images = [
    'https://img.freepik.com/free-photo/medium-shot-people-with-food-donations_23-2149182009.jpg?w=1060&t=st=1687456488~exp=1687457088~hmac=b151645424dbfd6c0c8386cab6760e0ec5e66cf2a1a0b5240dcfe34a264effa3',
   'https://img.freepik.com/free-photo/team-volunteers-holding-donation-boxes-looking-camera_637285-10775.jpg?w=1060&t=st=1687456628~exp=1687457228~hmac=372820c1da5f6bf839f59203de253da17d791d055e45d1ee2b0a1dc1989cbacb',
    'https://img.freepik.com/free-photo/people-collecting-food-donations-medium-shot_23-2149182020.jpg?w=1060&t=st=1687456675~exp=1687457275~hmac=bde205a3b4b1a07bb54f5cc294c6197c0dfb1ec4dbfd75d722e4b6c13d89773b',
  ];

  return (
    <Carousel interval={3000}> {/* Change slides every 3 seconds */}
      {images.map((image, index) => (
        <Carousel.Item key={index}>
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