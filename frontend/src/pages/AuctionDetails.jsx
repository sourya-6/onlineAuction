import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, Button, Form } from "react-bootstrap";
import ImageCarousel from "../components/ImageCarousel";

const AuctionDetails = () => {
    const { id } = useParams();
    const [auction, setAuction] = useState(null);
    const [bidAmount, setBidAmount] = useState("");

    useEffect(() => {
        axios.get(`/api/auctions/${id}`)
            .then(res => setAuction(res.data.data))
            .catch(err => console.error(err));
    }, [id]);

    const placeBid = () => {
        axios.post(`/api/auctions/${id}/bid`, { amount: bidAmount }, { withCredentials: true })
            .then(res => setAuction(res.data.data))
            .catch(err => alert(err.response.data.message));
    };

    if (!auction) return <p>Loading...</p>;

    return (
        <div className="container mt-4">
            <Card>
                <Card.Body>
                    <ImageCarousel images={auction.images} />
                    <Card.Title>{auction.title}</Card.Title>
                    <Card.Text>Description: {auction.description}</Card.Text>
                    <Card.Text>Current Bid: ${auction.currentBid}</Card.Text>
                    <Form.Group>
                        <Form.Control type="number" placeholder="Enter bid amount" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} />
                    </Form.Group>
                    <Button onClick={placeBid} className="mt-2" variant="success">Place Bid</Button>
                </Card.Body>
            </Card>
        </div>
    );
};

export default AuctionDetails;
