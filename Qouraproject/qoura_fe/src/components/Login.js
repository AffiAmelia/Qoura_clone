import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Logo from "../components/Logo";
import { Size } from "../utils/enumsome.js";
import bgImage from "../images/bg-1.jfif";
import axios from 'axios'

export const Login = React.memo(() => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [signupForm, setSignUpForm] = useState(true);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        age: "",
        gender: "1",
        email: "",
        password: "",
        confirmpassword: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const url = signupForm ? "http://localhost:8000/register/" : "http://localhost:8000/login/";
            const response = await axios.post(url, formData);

            if (response.status === 201) {
                setSignUpForm(false)
            } else if (response.status === 200) {
                console.log(response)
                localStorage.setItem('userData', JSON.stringify(response.data.jwtToken));
                navigate("/home");
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setError(error.response.data.message);

            console.error("Error occurred:", error);
        } finally {
            setIsLoading(false);
        };
    };


    return (
        <div
            style={{
                backgroundImage: `url(${bgImage})`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                paddingTop: "70px",
                height: "100vh",
            }}
        >
            <div className="card p-3 col-md-6" style={{ maxWidth: "500px", borderRadius: "12px" }}>
                <Logo size={Size.LARGE} />
                <form onSubmit={handleSubmit}>
                    {signupForm && (
                        <>

                            <div className="mb-2">
                                <label htmlFor="email" className="form-label">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="age" className="form-label">
                                    Age
                                </label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="age"
                                    value={formData.age}
                                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="gender" className="form-label">
                                    Gender
                                </label>
                                <select
                                    className="form-select"
                                    id="gender"
                                    defaultValue={formData.gender}
                                    value={formData.gender}
                                    onChange={(e) => setFormData(prevState => { return { ...prevState, gender: e.target.value } })}
                                    required
                                >
                                    <option value="1">Male</option>
                                    <option value="-1">Female</option>
                                    <option value="0">Can't Say</option>
                                </select>
                            </div>
                        </>
                    )}
                    <div className="mb-2">
                        <label htmlFor="username" className="form-label">
                            Username
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>

                    {signupForm && (
                        <div className="mb-2">
                            <label htmlFor="confirmPassword" className="form-label">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                id="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmpassword: e.target.value })}
                                required
                            />
                        </div>
                    )}
                    {error && <div className="error-message">{error}</div>}
                    {isLoading ? (
                        <div className="loading-screen">Loading...</div>
                    ) : (
                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ fontWeight: "bold", width: "100%", backgroundColor: "#000" }}
                        >
                            {signupForm ? "Sign Up" : "Login"}
                        </button>
                    )}
                </form>
                <p className="mt-2">
                    {signupForm ? "Already have an account?" : "Don't have an account?"}{" "}
                    <span className="signup-link" onClick={() => setSignUpForm(!signupForm)}>
                        {signupForm ? "Login" : "Sign up"}
                    </span>
                </p>
            </div>
        </div>
    );
});
