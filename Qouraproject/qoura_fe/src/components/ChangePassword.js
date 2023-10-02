import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import jwtDecode from "jwt-decode";

const ChangePassword = () => {
    const navigate = useNavigate();
    const token = JSON.parse(localStorage.getItem('userData'));
    const accessToken = token.access;
    const decodedToken = jwtDecode(token.access);

    const [formData, setFormData] = useState({
        old_password: '',
        new_password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleChangePassword = (e) => {
        e.preventDefault();


        axios.post("http://localhost:8000/change-password/", formData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then(response => {
                console.log("Password changed successfully:", response.data.message);
                navigate('/home');
            })
            .catch(error => {
                console.error("Error changing password:", error.response.data);
            });
    };

    return (
        <div className="container" style={{ marginTop: '10%' }}>
            <h2>Change Password</h2>
            <form>
                <div className="mb-3">
                    <label htmlFor="old_password" className="form-label">
                        Old Password:
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        id="old_password"
                        name="old_password"
                        value={formData.old_password}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="new_password" className="form-label">
                        New Password:
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        id="new_password"
                        name="new_password"
                        value={formData.new_password}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary" onClick={handleChangePassword}>
                    Change Password
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;
