import { useState } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";

const AuctionForm = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startingBid, setStartingBid] = useState("");
    const [endTime, setEndTime] = useState("");
    const [images, setImages] = useState([]);

    const handleFileChange = (e) => {
        setImages(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("startingBid", startingBid);
        formData.append("endTime", endTime);

        for (let i = 0; i < images.length; i++) {
            formData.append("images", images[i]);
        }

        try {
            await axios.post("/api/v1/auction", formData, { withCredentials: true });
            alert("Auction created successfully!");
        } catch (err) {
            alert(err.response.data.message);
        }
    };

    return (
        <Form onSubmit={handleSubmit} className="mt-3">
            <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </Form.Group>
            <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" value={description} onChange={(e) => setDescription(e.target.value)} />
            </Form.Group>
            <Form.Group>
                <Form.Label>Starting Bid</Form.Label>
                <Form.Control type="number" value={startingBid} onChange={(e) => setStartingBid(e.target.value)} required />
            </Form.Group>
            <Form.Group>
                <Form.Label>End Time</Form.Label>
                <Form.Control type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
            </Form.Group>
            <Form.Group>
                <Form.Label>Upload Images</Form.Label>
                <Form.Control type="file" multiple onChange={handleFileChange} />
            </Form.Group>
            <Button className="mt-3" type="submit">Create Auction</Button>
        </Form>
    );
};

export default AuctionForm;
