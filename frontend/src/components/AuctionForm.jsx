import { useState } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import "./AuctionForm.css"; // Import CSS

const AuctionForm = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startingBid, setStartingBid] = useState("");
    const [endTime, setEndTime] = useState("");
    const [images, setImages] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]); // To show previews

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);

        // Generate preview URLs
        const filePreviews = files.map((file) => URL.createObjectURL(file));
        setPreviewUrls(filePreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("startingBid", startingBid);
        formData.append("endTime", endTime);

        // Append multiple images
        images.forEach((image) => {
            formData.append("images", image);
        });

        try {
            await axios.post("/api/v1/auction", formData, { withCredentials: true });
            alert("Auction created successfully!");
            setTitle("");
            setDescription("");
            setStartingBid("");
            setEndTime("");
            setImages([]);
            setPreviewUrls([]);
        } catch (err) {
            alert(err.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <Form onSubmit={handleSubmit} className="auction-form">
            <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control
                    type="text"
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control
                    as="textarea"
                    className="form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Starting Bid</Form.Label>
                <Form.Control
                    type="number"
                    className="form-control"
                    value={startingBid}
                    onChange={(e) => setStartingBid(e.target.value)}
                    required
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>End Time</Form.Label>
                <Form.Control
                    type="datetime-local"
                    className="form-control"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Upload Images</Form.Label>
                <Form.Control
                    type="file"
                    className="form-control"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </Form.Group>

            {/* Image Preview Section */}
            <div className="image-preview-container">
                {previewUrls.map((url, index) => (
                    <img key={index} src={url} alt={`Preview ${index}`} className="preview-image" />
                ))}
            </div>

            <Button className="btn btn-primary mt-3" type="submit">Create Auction</Button>
        </Form>
    );
};

export default AuctionForm;
