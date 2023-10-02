import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import axios from "axios";


const AddTopicForm = () => {

    const token = JSON.parse(localStorage.getItem('userData'));
    const accessToken = token.access;

    const decodedToken = jwtDecode(accessToken);
    const userId = decodedToken?.user_id || null;
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [topicName, setTopicName] = useState("");
    const [topicDescription, setTopicDescription] = useState("");
    const [imageFile, setImageFile] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const handleTopicNameChange = (e) => {
        setTopicName(e.target.value);
    };

    const handleTopicDescriptionChange = (e) => {
        setTopicDescription(e.target.value);
    };

    const handleImageUpload = async (e) => {
        const selectedFile = e.target.files[0];

        console.log(selectedFile)
        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('upload_preset', 'xbxpbrfx'); // Replace with your upload preset

            try {
                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/dc8hvoez1/image/upload`,
                    {
                        method: 'POST',
                        body: formData,
                    }
                );
                console.log("here")

                const data = await response.json();
                console.log('Image uploaded to Cloudinary:', data);
                setImageFile(data.secure_url)
                console.log(data.secure_url)
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(topicName, topicDescription, userId)
        if (topicName && topicDescription && userId) {
            const formData = new FormData();
            formData.append("topic_name", topicName);
            formData.append("description", topicDescription);
            formData.append("image", imageFile);
            formData.append("user_id", userId);

            try {
                const response = await axios.post("http://localhost:8000/add_topic/", formData, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (response.status === 201) {
                    setSuccessMessage("Topic added successfully.");
                    setErrorMessage("");
                    navigate('/home');

                }
            } catch (error) {
                console.error("Error adding topic:", error);
                setErrorMessage("Error adding topic.");
            }

        } else {
            setErrorMessage("Please enter topic name, description, select an image, and ensure you're logged in.");
            setSuccessMessage("");
        }
    };
    return (
        <div className="col-md-6 container">
            <div className="mt-5 py-5">
                <h2>Add Topic</h2>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="topicName" className="form-label">
                        Topic Name
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="topicName"
                        value={topicName}
                        onChange={handleTopicNameChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="topicDescription" className="form-label">
                        Topic Description
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="topicDescription"
                        value={topicDescription}
                        onChange={handleTopicDescriptionChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="imageUpload" className="form-label">
                        Upload Picture
                    </label>
                    <input
                        type="file"
                        className="form-control"
                        id="imageUpload"
                        accept="image/*"
                        onChange={handleImageUpload}
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Add Topic
                </button>
                {errorMessage && <p className="text-danger">{errorMessage}</p>}
                {successMessage && <p className="text-success">{successMessage}</p>}
            </form>
        </div>
    );
};


export default AddTopicForm;
