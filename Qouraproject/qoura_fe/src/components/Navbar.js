import { useState } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import Logo from "./Logo";
import { Size } from "../utils/enumsome.js";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { useSearchResult } from "../provider/search-provider";


export const Navbar = () => {
    const token = JSON.parse(localStorage.getItem('userData'));

    const accessToken = token ? token.access : null;

    const decodedToken = jwtDecode(accessToken);
    const userId = decodedToken?.user_id || null;
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const { searchResult, setSearchResult } = useSearchResult()


    const handleLogout = async () => {
        try {
            const response = await axios.get('http://localhost:8000/logout/');

            if (response.status === 200) {
                localStorage.clear();
                navigate("/");
            } else {
                console.error("Logout failed:", response.data);
            }
        } catch (error) {
            console.error("Error occurred:", error);
        }
    };
    const handleSearch = () => {
        axios.post("http://localhost:8000/questions/search/", {
            topic: searchQuery
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then(response => {
                searchResult.splice(0, searchResult.length)
                searchResult.push(...response.data)
                navigate('/search-results')
            })
            .catch(error => {
                console.error("Error searching questions:", error);
            });
    };


    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white fixed-top">
            <div className="container">
                <NavLink className="navbar-brand" to="/home">
                    <Logo size={Size.SMALL} />
                </NavLink>
                <div className="d-flex align-items-end">
                    <div>
                        <Link to="/home" className="text-dark">
                            <i className="mx-3 fa-solid fa-house fa-2xl"></i>
                        </Link>
                    </div>
                    <div>
                        <Link to="/topic" className="text-dark">
                            <i className="mx-3 fa-solid fa-list fa-2xl"></i>
                        </Link>

                    </div>
                    <div className="input-group mx-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search"
                            aria-label="Search"
                            aria-describedby="search-icon"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="btn btn-outline-secondary" type="button" id="search-icon" onClick={handleSearch}>
                            <i className="fas fa-search"></i>
                        </button>
                    </div>
                </div>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link" to={"/add-topic"} >
                                ADD TOPIC
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to={"/add-question"}>
                                ADD QUESTION
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to={"/profile"}>
                                ABOUT
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <div
                                onClick={handleLogout}
                                className="nav-link-logout"
                            >
                                LOGOUT
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </nav >
    );
};

export default Navbar;