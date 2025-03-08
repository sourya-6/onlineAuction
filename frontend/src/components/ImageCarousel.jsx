import { useState, useEffect } from "react";
import { Carousel } from "react-bootstrap";

const ImageCarousel = ({ images }) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 2000); // Change every 2 seconds
        return () => clearInterval(interval);
    }, [images]);

    return (
        <Carousel activeIndex={index} onSelect={(selectedIndex) => setIndex(selectedIndex)}>
            {images.map((image, idx) => (
                <Carousel.Item key={idx}>
                    <img className="d-block w-100" src={image} alt={`Auction Image ${idx}`} />
                </Carousel.Item>
            ))}
        </Carousel>
    );
};

export default ImageCarousel;
