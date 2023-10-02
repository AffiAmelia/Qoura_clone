import React, { useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";
import jwtDecode from "jwt-decode";

const UpdateProfile = () => {
    const navigate = useNavigate();
    const token = JSON.parse(localStorage.getItem('userData'));
    const accessToken = token.access;
    const decodedToken = jwtDecode(token.access);

    const userId = decodedToken?.user_id || null;
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const [userData, setUserData] = useState({
        username: userInfo.username || "",
        age: userInfo.age || "",
        profile_picture: userInfo.profile_picture || "",
        gender: userInfo.gender || "",
        email: userInfo.email || "",
    });

    const handleImageUpload = async (e) => {
        const selectedFile = e.target.files[0];

        console.log(selectedFile)
        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('upload_preset', 'xbxpbrfx');

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
                setUserData((prevUserData) => ({
                    ...prevUserData,
                    profile_picture: data.secure_url,
                }));

            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(userData)


        axios
            .put(`http://localhost:8000/profile/${userId}/`, userData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            .then((response) => {
                console.log("Profile updated successfully:", response.data);
            })
            .catch((error) => {
                console.error("Error updating profile:", error);
            });
    };

    const handlePasswordChange = () => {
        navigate('/upate-password');
    };

    return (
        <div className="container " style={{ marginTop: "10% " }}>
            <h2>Update Profile</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        name="username"
                        value={userData.username}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="age" className="form-label">Date of Birth:</label>
                    <input
                        type="date"
                        className="form-control"
                        id="age"
                        name="age"
                        value={userData.age}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="profile_picture" className="form-label">Profile Picture URL:</label>
                    <input
                        type="file"
                        className="form-control"
                        id="profile_picture"
                        name="profile_picture"
                        accept="image/*"
                        onChange={handleImageUpload}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="gender" className="form-label">Gender:</label>
                    <select
                        className="form-select"
                        id="gender"
                        defaultValue={userData.gender}
                        value={userData.gender}
                        onChange={(e) => setUserData({ ...userData, gender: e.target.value })}
                        required
                    >
                        <option value="1">Male</option>
                        <option value="-1">Female</option>

                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email:</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                    />
                </div>
                <button onClick={handlePasswordChange} className="btn btn-secondary">
                    Change Password
                </button>
                <button type="submit" className="btn btn-primary">Update Profile</button>
            </form>
        </div>
    );
};

export default UpdateProfile;
