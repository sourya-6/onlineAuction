import { Carousel } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/v1/auction/${id}`);
        const { title, description, highestBid, endTime, images } = res.data.data; // Destructure here
        setProduct({ title, description, highestBid, endTime, images });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <h3>Loading...</h3>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-5">
      <h2>{product.title}</h2>

      {/* 🛑 Display images using Bootstrap Carousel */}
      {product.images && product.images.length > 0 ? (
        <Carousel>
          {product.images.map((img, index) => (
            <Carousel.Item key={index}>
              <img src={img} alt={`Product ${index}`} className="d-block w-80 img-fluid" />
            </Carousel.Item>
          ))}
        </Carousel>
      ) : (
        <h3>No images available</h3>
      )}

      <p><strong>Description:</strong> {product.description}</p>
      <p><strong>Current Highest Bid:</strong> ${product.highestBid}</p>
      <p><strong>End Time:</strong> {new Date(product.endTime).toLocaleString()}</p>
      <button className="btn btn-primary" onClick={() => window.history.back()}>Go Back</button>
    </div>
  );
};

export default ProductDetails;
